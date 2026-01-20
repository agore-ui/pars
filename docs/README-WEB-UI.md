# 🎉 ВЕБ-ИНТЕРФЕЙС СОЗДАН!

## 📦 ФАЙЛЫ КОТОРЫЕ Я СОЗДАЛ

### Backend (Express сервер)
1. **`web-server.js`** - Express сервер с API
   - Аутентификация (админ/менеджер)
   - API для работы с БД
   - REST endpoints для фронтенда

### Frontend (интерфейс)
1. **`index.html`** - HTML с полными стилями
   - Красивый тёмный интерфейс
   - Адаптивный дизайн
   - Две роли (админ/менеджер)

2. **`app.js`** - JavaScript логика
   - Навигация
   - Загрузка данных
   - Модальные окна

### Документация & скрипты
1. **`INSTALL-WEB-UI.md`** - Подробная инструкция установки
2. **`quick-install-web-ui.sh`** - Скрипт быстрой установки
3. **`README-WEB-UI.md`** - Этот файл

---

## 🚀 БЫСТРАЯ УСТАНОВКА

### Шаг 1: Загрузить файлы

```bash
# Перейти в проект
cd /opt/hh-job-intelligence-tool

# Backend
# Поместить web-server.js в src/

# Frontend
mkdir -p public/js
# Поместить index.html в public/
# Поместить app.js в public/js/
```

### Шаг 2: Установить зависимости

```bash
cd /opt/hh-job-intelligence-tool
npm install express cors body-parser compression helmet date-fns
```

### Шаг 3: Запустить

```bash
# Вариант 1: Прямой запуск
node src/web-server.js

# Вариант 2: Через PM2 (рекомендуется)
pm2 start src/web-server.js --name "hh-web-ui"
pm2 save
```

### Шаг 4: Открыть браузер

```
http://localhost:3001
или
http://45.159.209.14:3001
```

---

## 👥 ДВЕ РОЛИ

### 👨‍💼 АДМИНИСТРАТОР
**Логин**: `admin` | **Пароль**: `admin123`

**Имеет доступ к:**
- 📊 Dashboard (общая статистика, топ навыки)
- 📋 Все вакансии (полный список)
- 👥 Все клиенты (полный список с фильтрацией)
- 🛠️ Инструменты:
  - Экспорт JSON
  - Экспорт CSV
  - Очистка БД (⚠️ осторожно!)

### 👨‍💻 МЕНЕДЖЕР
**Логин**: `manager` | **Пароль**: `manager123`

**Имеет доступ к:**
- 📊 Dashboard (только просмотр статистики)
- 📋 Актуальные вакансии
- 👥 Карточки клиентов

---

## 📊 ФУНКЦИОНАЛ

### Dashboard (для обоих)
```
┌─────────────────────────────────┐
│ 📋 Вакансии: 245                │
├─────────────────────────────────┤
│ 👥 Клиенты: 128                 │
├─────────────────────────────────┤
│ 💰 Средняя зарплата: 85,000 РУБ │
└─────────────────────────────────┘
```

### Вакансии
```
┌──────────────────────────────────────────────────────────────┐
│ Название        │ Компания      │ Зарплата  │ Дата  │ Действие│
├──────────────────────────────────────────────────────────────┤
│ Senior Python   │ Яндекс        │ 200-250K  │ 20.01 │ 👁️ View │
│ React Dev       │ 2ГИС         │ 150-180K  │ 20.01 │ 👁️ View │
│ DevOps Engineer │ MTS           │ 180-220K  │ 19.01 │ 👁️ View │
└──────────────────────────────────────────────────────────────┘
```

### Клиенты
```
┌────────────────────────────────────────────────────────────────┐
│ Имя      │ Email           │ Телефон  │ Скор │ Статус │ Действие│
├────────────────────────────────────────────────────────────────┤
│ Иван     │ ivan@example    │ +79...   │ 8.5  │ Новый  │ 👤 Card │
│ Петр     │ petr@example    │ +79...   │ 9.2  │ Кваліф │ 👤 Card │
│ Мария    │ maria@example   │ +79...   │ 7.8  │ Контак │ 👤 Card │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔐 БЕЗОПАСНОСТЬ

### Изменить пароли

```bash
nano /opt/hh-job-intelligence-tool/.env

# Изменить:
ADMIN_PASSWORD=ваш_новый_пароль_админа
MANAGER_PASSWORD=ваш_новый_пароль_менеджера

# Перезагрузить
pm2 restart hh-web-ui
```

### Сессии
- Сессии хранятся в памяти (очищаются при перезагрузке)
- Передаются в заголовке `X-Session-Id`
- Просто для демонстрации, можно улучшить с JWT

---

## 🛠️ КОМАНДЫ

### Управление
```bash
# Запустить
pm2 start hh-web-ui

# Остановить
pm2 stop hh-web-ui

# Перезагрузить
pm2 restart hh-web-ui

# Удалить
pm2 delete hh-web-ui

# Статус
pm2 status
```

### Логи
```bash
# Последние логи
pm2 logs hh-web-ui --lines 50

# Логи в реальном времени
pm2 logs hh-web-ui --follow

# Остановить Ctrl+C
```

### Мониторинг
```bash
# Процессы
pm2 monit

# Информация о процессе
pm2 info hh-web-ui

# Статус всех процессов
pm2 status
```

---

## 🐛 РЕШЕНИЕ ПРОБЛЕМ

### Проблема: "Порт 3001 уже в использовании"

```bash
# Найти процесс на порту 3001
lsof -i :3001

# Убить процесс
kill -9 PID

# Или запустить на другом порту в .env:
WEB_PORT=3002
```

### Проблема: "Не могу подключиться к БД"

```bash
# Проверить что БД существует
ls -la /opt/hh-job-intelligence-tool/data/hh_intelligence.db

# Проверить права доступа
chmod 644 /opt/hh-job-intelligence-tool/data/hh_intelligence.db

# Проверить содержимое
sqlite3 /opt/hh-job-intelligence-tool/data/hh_intelligence.db ".tables"
```

### Проблема: "Логин не работает"

```bash
# Проверить пароли в .env
cat /opt/hh-job-intelligence-tool/.env | grep PASSWORD

# Попробовать дефолтные пароли
# admin / admin123
# manager / manager123

# Перезагрузить приложение
pm2 restart hh-web-ui
```

### Проблема: "Нет данных в таблице"

```bash
# Проверить что парсер работает
pm2 logs hh-intelligence-parser --lines 20

# Проверить БД
sqlite3 /opt/hh-job-intelligence-tool/data/hh_intelligence.db
SELECT COUNT(*) FROM jobs;
SELECT COUNT(*) FROM candidates;
.quit

# Если 0 - запустить парсер
pm2 start hh-intelligence-parser
```

---

## 📈 РАСШИРЕНИЕ

### Добавить новые роли

В `web-server.js`, функция `USERS`:

```javascript
const USERS = {
  admin: { /* ... */ },
  manager: { /* ... */ },
  supervisor: {  // Новая роль!
    password: 'supervisor123',
    role: 'supervisor',
    name: 'Супервайзер'
  }
};
```

### Добавить экспорт в Google Sheets

Требуется установка:
```bash
npm install googleapis
```

### Добавить экспорт в AmoCRM

Требуется установка:
```bash
npm install amocrm-api
```

### Добавить оповещения по Email

Требуется установка:
```bash
npm install nodemailer
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Рекомендации

1. **Использовать Nginx как reverse proxy**
   ```nginx
   location /api {
     proxy_pass http://localhost:3001;
   }
   ```

2. **Использовать HTTPS/SSL**
   ```bash
   npm install express-https-redirect
   ```

3. **Использовать переменные окружения для паролей**
   ```bash
   ADMIN_PASSWORD=$(openssl rand -base64 32)
   MANAGER_PASSWORD=$(openssl rand -base64 32)
   ```

4. **Настроить логирование**
   ```bash
   npm install winston
   ```

5. **Добавить rate limiting**
   ```bash
   npm install express-rate-limit
   ```

---

## 📝 ФАЙЛОВАЯ СТРУКТУРА

```
/opt/hh-job-intelligence-tool/
├── src/
│   ├── index.js                 (парсер)
│   └── web-server.js            ✨ (новый!)
├── public/                       ✨ (новая папка!)
│   ├── index.html               ✨ (новый!)
│   ├── js/
│   │   └── app.js               ✨ (новый!)
│   └── css/                      (для будущих стилей)
├── data/
│   └── hh_intelligence.db        (существует)
├── .env                          (обновлён)
├── package.json                  (обновлён)
└── ecosystem.config.js           (обновлён для PM2)
```

---

## ✅ ЧЕКЛИСТ УСТАНОВКИ

- [ ] Загрузил `web-server.js` в `/opt/hh-job-intelligence-tool/src/`
- [ ] Создал папку `/opt/hh-job-intelligence-tool/public/`
- [ ] Загрузил `index.html` в папку `public/`
- [ ] Загрузил `app.js` в папку `public/js/`
- [ ] Установил зависимости: `npm install express cors body-parser compression helmet date-fns`
- [ ] Обновил `.env` файл с WEB_PORT и паролями
- [ ] Запустил через PM2: `pm2 start src/web-server.js --name "hh-web-ui"`
- [ ] Открыл браузер на `http://localhost:3001`
- [ ] Вошёл как admin/admin123
- [ ] Вижу данные из БД (вакансии, клиенты, статистику)
- [ ] Всё работает! 🎉

---

## 💡 СОВЕТЫ

1. **Проверять логи часто** - помогает отловить проблемы
2. **Резервные копии БД** - делайте регулярно
3. **Менять пароли** - для безопасности
4. **Мониторить процессы** - используйте `pm2 monit`
5. **Обновлять npm пакеты** - `npm update`

---

## 📞 ПОДДЕРЖКА

Если что-то не работает:

1. Проверьте логи: `pm2 logs hh-web-ui`
2. Проверьте БД: `sqlite3 data/hh_intelligence.db ".tables"`
3. Проверьте портов: `lsof -i :3001`
4. Перезагрузите: `pm2 restart all`
5. Напишите мне ошибку 😊

---

## 🎉 ГОТОВО!

Теперь у вас есть полнофункциональный веб-интерфейс для управления вакансиями и клиентами!

**Наслаждайтесь! 🚀**

---

**Версия**: 1.0  
**Дата**: 2026-01-20  
**Статус**: ✅ ГОТОВО