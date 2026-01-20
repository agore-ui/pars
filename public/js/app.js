// ════════════════════════════════════════════════════════════════
// 🌐 HH.ru JOB INTELLIGENCE - ВЕБ ИНТЕРФЕЙС
// ════════════════════════════════════════════════════════════════

const API_BASE = '/api';
let currentUser = null;
let currentSessionId = null;
let currentPage = {
    adminJobs: 1,
    adminCandidates: 1,
    managerJobs: 1,
    managerCandidates: 1
};

// ════════════════════════════════════════════════════════════════
// 📍 ИНИЦИАЛИЗАЦИЯ
// ════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем сохранённую сессию
    const savedSession = sessionStorage.getItem('sessionId');
    if (savedSession) {
        checkAuth(savedSession);
    }

    // Обработчик формы логина
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Обработчики навигации
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            navigateTo(page);
        });
    });

    // Обработчики модалей
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

// ════════════════════════════════════════════════════════════════
// 🔐 АУТЕНТИФИКАЦИЯ
// ════════════════════════════════════════════════════════════════

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        errorDiv.style.display = 'none';

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка входа');
        }

        // Сохраняем сессию
        sessionStorage.setItem('sessionId', data.sessionId);
        currentSessionId = data.sessionId;
        currentUser = data.user;

        // Переходим на dashboard
        showDashboard();

    } catch (err) {
        errorDiv.textContent = '❌ ' + err.message;
        errorDiv.style.display = 'block';
    }
}

function quickLogin(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

async function checkAuth(sessionId) {
    try {
        const response = await fetch(`${API_BASE}/auth/check`, {
            headers: { 'X-Session-Id': sessionId }
        });

        if (response.ok) {
            const data = await response.json();
            currentSessionId = sessionId;
            currentUser = data.user;
            showDashboard();
        } else {
            sessionStorage.removeItem('sessionId');
        }
    } catch (err) {
        console.error('Auth check failed:', err);
    }
}

function logout() {
    if (confirm('Вы уверены что хотите выйти?')) {
        fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { 'X-Session-Id': currentSessionId }
        });

        sessionStorage.removeItem('sessionId');
        currentSessionId = null;
        currentUser = null;

        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('dashboard').classList.remove('active');
    }
}

// ════════════════════════════════════════════════════════════════
// 🎨 НАВИГАЦИЯ И ИНТЕРФЕЙС
// ════════════════════════════════════════════════════════════════

function showDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');

    // Показываем правильное меню в зависимости от роли
    if (currentUser.role === 'admin') {
        document.getElementById('adminMenu').style.display = 'block';
        document.getElementById('managerMenu').style.display = 'none';
        navigateTo('admin-dashboard');
    } else {
        document.getElementById('adminMenu').style.display = 'none';
        document.getElementById('managerMenu').style.display = 'block';
        navigateTo('manager-dashboard');
    }

    // Обновляем информацию о пользователе
    document.getElementById('userDisplayName').textContent = currentUser.name;
    document.getElementById('userDisplayRole').textContent = 
        currentUser.role === 'admin' ? '👨‍💼 Администратор' : '👨‍💻 Менеджер';

    // Загружаем начальные данные
    loadDashboardStats(currentUser.role);
}

function navigateTo(page) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Убираем активный класс с кнопок
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    // Показываем нужную страницу
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Активируем кнопку
    const btn = document.querySelector(`[data-page="${page}"]`);
    if (btn) {
        btn.classList.add('active');
    }

    // Загружаем данные для страницы
    if (page === 'admin-jobs') loadAdminJobs();
    else if (page === 'admin-candidates') loadAdminCandidates();
    else if (page === 'manager-jobs') loadManagerJobs();
    else if (page === 'manager-candidates') loadManagerCandidates();
}

// ════════════════════════════════════════════════════════════════
// 📊 СТАТИСТИКА
// ════════════════════════════════════════════════════════════════

async function loadDashboardStats(role) {
    try {
        const response = await fetch(`${API_BASE}/stats`, {
            headers: { 'X-Session-Id': currentSessionId }
        });

        const stats = await response.json();

        const statsHTML = `
            <div class="stat-card">
                <div class="stat-label">📋 Вакансии</div>
                <div class="stat-value">${stats.totalJobs}</div>
                <div class="stat-unit">активные объявления</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">👥 Клиенты</div>
                <div class="stat-value">${stats.totalCandidates}</div>
                <div class="stat-unit">зарегистрировано</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">💰 Средняя зарплата</div>
                <div class="stat-value">${(stats.avgSalary || 0).toLocaleString()}</div>
                <div class="stat-unit">рублей в месяц</div>
            </div>
        `;

        const containerId = role === 'admin' ? 'adminStats' : 'managerStats';
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = statsHTML;
        }

        // Для админа - показываем топ навыки
        if (role === 'admin') {
            const skillsHTML = stats.jobsBySkill.map(skill => `
                <tr>
                    <td class="table-cell-strong">${skill.skill}</td>
                    <td>${skill.count}</td>
                </tr>
            `).join('');

            document.getElementById('topSkillsTable').innerHTML = skillsHTML;
        }

    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

// ════════════════════════════════════════════════════════════════
// 📋 ВАКАНСИИ
// ════════════════════════════════════════════════════════════════

async function loadAdminJobs(page = 1) {
    currentPage.adminJobs = page;
    await loadJobs('admin', page, 'adminJobsTable', 'adminJobsPagination');
}

async function loadManagerJobs(page = 1) {
    currentPage.managerJobs = page;
    await loadJobs('manager', page, 'managerJobsTable', 'managerJobsPagination');
}

async function loadJobs(role, page, tableId, paginationId) {
    try {
        const response = await fetch(`${API_BASE}/jobs?page=${page}&limit=20`, {
            headers: { 'X-Session-Id': currentSessionId }
        });

        const data = await response.json();

        const jobsHTML = data.jobs.map(job => `
            <tr>
                <td class="table-cell-strong">${job.title}</td>
                <td>${job.company}</td>
                <td>${job.salary || '—'}</td>
                <td>${new Date(job.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                    <button class="btn-sm" onclick="viewJob(${job.id})">👁️ Просмотр</button>
                </td>
            </tr>
        `).join('');

        document.getElementById(tableId).innerHTML = jobsHTML || '<tr><td colspan="5">Нет данных</td></tr>';

        // Паджинация
        const paginationHTML = Array.from({ length: data.pages }, (_, i) => i + 1).map(p => `
            <button ${p === page ? 'class="active"' : ''} onclick="load${role === 'admin' ? 'Admin' : 'Manager'}Jobs(${p})">${p}</button>
        `).join('');

        document.getElementById(paginationId).innerHTML = paginationHTML;

    } catch (err) {
        console.error('Failed to load jobs:', err);
    }
}

async function viewJob(jobId) {
    try {
        const response = await fetch(`${API_BASE}/jobs/${jobId}`, {
            headers: { 'X-Session-Id': currentSessionId }
        });

        const job = await response.json();

        const modal = document.getElementById('jobModal');
        const body = document.getElementById('jobModalBody');

        body.innerHTML = `
            <div class="modal-field">
                <label>Название</label>
                <p>${job.title}</p>
            </div>
            <div class="modal-field">
                <label>Компания</label>
                <p>${job.company}</p>
            </div>
            <div class="modal-field">
                <label>Зарплата</label>
                <p>${job.salary || 'Не указана'}</p>
            </div>
            <div class="modal-field">
                <label>Описание</label>
                <p>${job.description || 'Не указано'}</p>
            </div>
            <div class="modal-field">
                <label>Требуемые навыки</label>
                <p>${(job.skills || []).join(', ') || 'Не указаны'}</p>
            </div>
            <div class="modal-field">
                <label>Ссылка</label>
                <p><a href="${job.url}" target="_blank" style="color: #38bdf8;">🔗 Открыть вакансию</a></p>
            </div>
            <div class="modal-field">
                <label>Дата добавления</label>
                <p>${new Date(job.created_at).toLocaleString('ru-RU')}</p>
            </div>
        `;

        modal.classList.add('active');

    } catch (err) {
        console.error('Failed to load job:', err);
    }
}

// ════════════════════════════════════════════════════════════════
// 👥 КАНДИДАТЫ
// ════════════════════════════════════════════════════════════════

async function loadAdminCandidates(page = 1) {
    currentPage.adminCandidates = page;
    await loadCandidates('admin', page, 'adminCandidatesTable', 'adminCandidatesPagination');
}

async function loadManagerCandidates(page = 1) {
    currentPage.managerCandidates = page;
    await loadCandidates('manager', page, 'managerCandidatesTable', 'managerCandidatesPagination');
}

async function loadCandidates(role, page, tableId, paginationId) {
    try {
        const response = await fetch(`${API_BASE}/candidates?page=${page}&limit=20&sortBy=score&order=DESC`, {
            headers: { 'X-Session-Id': currentSessionId }
        });

        const data = await response.json();

        const statusBadge = (status) => {
            const badges = {
                'new': '<span class="badge badge-warning">Новый</span>',
                'contacted': '<span class="badge badge-info">Контактирован</span>',
                'qualified': '<span class="badge badge-success">Квалифицирован</span>'
            };
            return badges[status] || '<span class="badge badge-warning">' + status + '</span>';
        };

        const candidatesHTML = data.candidates.map(candidate => `
            <tr>
                <td class="table-cell-strong">${candidate.name}</td>
                <td>${candidate.email}</td>
                <td>${candidate.phone || '—'}</td>
                <td><strong style="color: #22c55e;">${(candidate.score || 0).toFixed(1)}</strong></td>
                <td>${statusBadge(candidate.status)}</td>
                <td>
                    <button class="btn-sm" onclick="viewCandidate(${candidate.id})">👁️ Карточка</button>
                </td>
            </tr>
        `).join('');

        document.getElementById(tableId).innerHTML = candidatesHTML || '<tr><td colspan="6">Нет данных</td></tr>';

        // Паджинация
        const paginationHTML = Array.from({ length: data.pages }, (_, i) => i + 1).map(p => `
            <button ${p === page ? 'class="active"' : ''} onclick="load${role === 'admin' ? 'Admin' : 'Manager'}Candidates(${p})">${p}</button>
        `).join('');

        document.getElementById(paginationId).innerHTML = paginationHTML;

    } catch (err) {
        console.error('Failed to load candidates:', err);
    }
}

async function viewCandidate(candidateId) {
    try {
        const response = await fetch(`${API_BASE}/candidates/${candidateId}`, {
            headers: { 'X-Session-Id': currentSessionId }
        });

        const candidate = await response.json();

        const modal = document.getElementById('candidateModal');
        const body = document.getElementById('candidateModalBody');

        body.innerHTML = `
            <div class="modal-field">
                <label>Имя</label>
                <p>${candidate.name}</p>
            </div>
            <div class="modal-field">
                <label>Email</label>
                <p><a href="mailto:${candidate.email}" style="color: #38bdf8;">${candidate.email}</a></p>
            </div>
            <div class="modal-field">
                <label>Телефон</label>
                <p>${candidate.phone ? `<a href="tel:${candidate.phone}" style="color: #38bdf8;">${candidate.phone}</a>` : 'Не указан'}</p>
            </div>
            <div class="modal-field">
                <label>Скор кандидата</label>
                <p><strong style="font-size: 20px; color: #22c55e;">${(candidate.score || 0).toFixed(1)}/100</strong></p>
            </div>
            <div class="modal-field">
                <label>Статус</label>
                <p>${candidate.status || 'new'}</p>
            </div>
            <div class="modal-field">
                <label>Источник</label>
                <p>${candidate.source || 'HH.ru'}</p>
            </div>
            <div class="modal-field">
                <label>Примечания</label>
                <p>${candidate.notes || 'Нет примечаний'}</p>
            </div>
            <div class="modal-field">
                <label>Добавлен</label>
                <p>${new Date(candidate.created_at).toLocaleString('ru-RU')}</p>
            </div>
        `;

        modal.classList.add('active');

    } catch (err) {
        console.error('Failed to load candidate:', err);
    }
}

// ════════════════════════════════════════════════════════════════
// 🛠️ АДМИН ФУНКЦИИ
// ════════════════════════════════════════════════════════════════

async function exportData(format) {
    try {
        const response = await fetch(`${API_BASE}/admin/export?format=${format}`, {
            headers: { 'X-Session-Id': currentSessionId }
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_${new Date().getTime()}.${format === 'csv' ? 'csv' : 'json'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        alert('✅ Данные экспортированы!');
    } catch (err) {
        alert('❌ Ошибка экспорта: ' + err.message);
    }
}

async function clearDatabase() {
    if (!confirm('⚠️ ВНИМАНИЕ!\n\nЭто удалит ВСЕ данные из базы.\n\nВы уверены?')) {
        return;
    }

    if (!confirm('Последняя проверка! ВСЕ данные будут удалены безвозвратно!')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/clear-db`, {
            method: 'POST',
            headers: { 'X-Session-Id': currentSessionId }
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ База данных очищена!');
            loadDashboardStats('admin');
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        alert('❌ Ошибка: ' + err.message);
    }
}

// ════════════════════════════════════════════════════════════════
// 🎯 МОДАЛИ
// ════════════════════════════════════════════════════════════════

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}