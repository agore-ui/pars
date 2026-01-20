const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { formatDistanceToNow, parseISO } = require('date-fns');
const { ru } = require('date-fns/locale');

const app = express();
const PORT = process.env.WEB_PORT || 3001;
const DB_PATH = process.env.DB_PATH || './data/hh_intelligence.db';

// ════════════════════════════════════════════════════════════════
// 🔧 MIDDLEWARE
// ════════════════════════════════════════════════════════════════

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ════════════════════════════════════════════════════════════════
// 🗄️ БАЗА ДАННЫХ
// ════════════════════════════════════════════════════════════════

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('[ERROR] Ошибка подключения к БД:', err);
    process.exit(1);
  }
  console.log('[INFO] ✅ Подключено к БД:', DB_PATH);
});

// Helper для запросов БД (Promise)
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// ════════════════════════════════════════════════════════════════
// 🔐 АУТЕНТИФИКАЦИЯ
// ════════════════════════════════════════════════════════════════

const USERS = {
  admin: {
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
    name: 'Администратор'
  },
  manager: {
    password: process.env.MANAGER_PASSWORD || 'manager123',
    role: 'manager',
    name: 'Менеджер'
  }
};

// Простая проверка сессии (можно заменить на JWT позже)
const sessions = {};

const login = (username, password) => {
  const user = USERS[username];
  if (!user || user.password !== password) {
    return null;
  }
  
  const sessionId = Math.random().toString(36).substr(2, 9);
  sessions[sessionId] = {
    username,
    role: user.role,
    loginTime: new Date()
  };
  
  return sessionId;
};

const checkAuth = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.query.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Не авторизирован' });
  }
  
  req.user = sessions[sessionId];
  next();
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    next();
  };
};

// ════════════════════════════════════════════════════════════════
// 📍 МАРШРУТЫ - АУТЕНТИФИКАЦИЯ
// ════════════════════════════════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const sessionId = login(username, password);
  if (!sessionId) {
    return res.status(401).json({ error: 'Неверные учётные данные' });
  }
  
  const user = USERS[username];
  res.json({
    sessionId,
    user: {
      username,
      role: user.role,
      name: user.name
    }
  });
});

app.post('/api/auth/logout', checkAuth, (req, res) => {
  const sessionId = req.headers['x-session-id'];
  delete sessions[sessionId];
  res.json({ success: true });
});

app.get('/api/auth/check', checkAuth, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user
  });
});

// ════════════════════════════════════════════════════════════════
// 📊 МАРШРУТЫ - СТАТИСТИКА (для обоих)
// ════════════════════════════════════════════════════════════════

app.get('/api/stats', checkAuth, async (req, res) => {
  try {
    const totalJobs = await dbGet('SELECT COUNT(*) as count FROM jobs');
    const totalCandidates = await dbGet('SELECT COUNT(*) as count FROM candidates');
    const avgSalary = await dbGet('SELECT AVG(CAST(salary AS FLOAT)) as avg FROM jobs WHERE salary IS NOT NULL');
    const jobsBySkill = await dbAll(`
      SELECT skill, COUNT(*) as count FROM job_skills GROUP BY skill ORDER BY count DESC LIMIT 10
    `);
    
    res.json({
      totalJobs: totalJobs?.count || 0,
      totalCandidates: totalCandidates?.count || 0,
      avgSalary: Math.round(avgSalary?.avg || 0),
      jobsBySkill: jobsBySkill || []
    });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════
// 📋 МАРШРУТЫ - ВАКАНСИИ (для обоих)
// ════════════════════════════════════════════════════════════════

app.get('/api/jobs', checkAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const jobs = await dbAll(`
      SELECT * FROM jobs
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    const total = await dbGet('SELECT COUNT(*) as count FROM jobs');
    
    res.json({
      jobs: jobs || [],
      total: total?.count || 0,
      page,
      limit,
      pages: Math.ceil((total?.count || 0) / limit)
    });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', checkAuth, async (req, res) => {
  try {
    const job = await dbGet('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    
    if (!job) {
      return res.status(404).json({ error: 'Вакансия не найдена' });
    }
    
    // Получить навыки
    const skills = await dbAll('SELECT skill FROM job_skills WHERE job_id = ?', [req.params.id]);
    job.skills = skills.map(s => s.skill);
    
    res.json(job);
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════
// 👥 МАРШРУТЫ - КАНДИДАТЫ/КЛИЕНТЫ (для обоих)
// ════════════════════════════════════════════════════════════════

app.get('/api/candidates', checkAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'score';
    const order = req.query.order || 'DESC';
    
    const candidates = await dbAll(`
      SELECT * FROM candidates
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    const total = await dbGet('SELECT COUNT(*) as count FROM candidates');
    
    res.json({
      candidates: candidates || [],
      total: total?.count || 0,
      page,
      limit,
      pages: Math.ceil((total?.count || 0) / limit)
    });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/candidates/:id', checkAuth, async (req, res) => {
  try {
    const candidate = await dbGet('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Кандидат не найден' });
    }
    
    res.json(candidate);
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════
// 🛠️ МАРШРУТЫ - АДМИНИСТРАТОР
// ════════════════════════════════════════════════════════════════

// Очистить БД (только админ)
app.post('/api/admin/clear-db', checkAuth, checkRole('admin'), async (req, res) => {
  try {
    await dbRun('DELETE FROM jobs');
    await dbRun('DELETE FROM candidates');
    await dbRun('DELETE FROM job_skills');
    
    res.json({ success: true, message: 'БД очищена' });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// Экспортировать данные (только админ)
app.get('/api/admin/export', checkAuth, checkRole('admin'), async (req, res) => {
  try {
    const format = req.query.format || 'json';
    
    const jobs = await dbAll('SELECT * FROM jobs');
    const candidates = await dbAll('SELECT * FROM candidates');
    
    if (format === 'json') {
      res.json({ jobs, candidates });
    } else if (format === 'csv') {
      let csv = 'ВАКАНСИИ\n';
      csv += 'ID,Название,Компания,Зарплата,Ссылка,Дата\n';
      jobs.forEach(job => {
        csv += `${job.id},"${job.title}","${job.company}","${job.salary}","${job.url}","${job.created_at}"\n`;
      });
      
      csv += '\n\nКАНДИДАТЫ\n';
      csv += 'ID,Имя,Email,Телефон,Скор,Статус\n';
      candidates.forEach(c => {
        csv += `${c.id},"${c.name}","${c.email}","${c.phone}",${c.score},"${c.status}"\n`;
      });
      
      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.header('Content-Disposition', 'attachment; filename="export.csv"');
      res.send(csv);
    }
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════
// 📄 ФРОНТЕНД - СТАТИЧЕСКИЕ ФАЙЛЫ
// ════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ════════════════════════════════════════════════════════════════
// 🚀 ЗАПУСК СЕРВЕРА
// ════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🌐 ВЕБ-ИНТЕРФЕЙС ЗАПУЩЕН                                ║
║                                                            ║
║  📍 http://localhost:${PORT}                                 ║
║  🔗 http://45.159.209.14:${PORT}                             ║
║                                                            ║
║  👤 Админ:    admin / ${USERS.admin.password}                    ║
║  👨 Менеджер: manager / ${USERS.manager.password}            ║
║                                                            ║
║  Статус: ✅ ОНЛАЙН                                         ║
╚════════════════════════════════════════════════════════════╝
  `);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});