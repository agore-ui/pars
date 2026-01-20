# 🚀 УСТАНОВКА ВЕБ-ИНТЕРФЕЙСА

Это пошаговая инструкция по добавлению веб-интерфейса к вашему парсеру HH.ru.

## 📋 ШАГ 1: Загрузить файлы

### 1. Backend (Express сервер)

Поместить файл `web-server.js` в папку `/opt/hh-job-intelligence-tool/src/`:

```bash
cd /opt/hh-job-intelligence-tool/src
# Скопируйте файл web-server.js сюда
```

### 2. Frontend (HTML/CSS/JS)

Создать структуру папок и файлов:

```bash
# Создаём папку public
mkdir -p /opt/hh-job-intelligence-tool/public
mkdir -p /opt/hh-job-intelligence-tool/public/js
mkdir -p /opt/hh-job-intelligence-tool/public/css

# Копируем HTML
cp index.html /opt/hh-job-intelligence-tool/public/

# Копируем JavaScript
cp app.js /opt/hh-job-intelligence-tool/public/js/
```

## 📦 ШАГ 2: Установить зависимости

```bash
cd /opt/hh-job-intelligence-tool

# Установить необходимые пакеты Express
npm install express cors body-parser compression helmet date-fns

# Результат должен быть:
# + express@4.18.x
# + cors@2.8.x
# + body-parser@1.20.x
# + compression@1.7.x
# + helmet@7.x.x
# + date-fns@2.30.x
```

## ⚙️ ШАГ 3: Обновить .env

Отредактировать файл `/opt/hh-job-intelligence-tool/.env` и добавить:

```bash
nano /opt/hh-job-intelligence-tool/.env

# Добавить эти строки в конец файла:
# ════════════════════════════════════════════════════════════

# ВЕБ-ИНТЕРФЕЙС
WEB_PORT=3001
DB_PATH=./data/hh_intelligence.db

# ЛОГИНЫ (поменяйте на свои!)
ADMIN_PASSWORD=admin123
MANAGER_PASSWORD=manager123

# ════════════════════════════════════════════════════════════
```

**Сохранить:** Ctrl+X → Y → Enter

## 🔧 ШАГ 4: Запуск веб-интерфейса

### Вариант 1: Запуск отдельно от парсера (для тестирования)

```bash
cd /opt/hh-job-intelligence-tool

# Запустить веб-сервер
node src/web-server.js

# Результат:
# ╔════════════════════════════════════════════════════════════╗
# ║  🌐 ВЕБ-ИНТЕРФЕЙС ЗАПУЩЕН                                ║
# ║                                                            ║
# ║  📍 http://localhost:3001                                 ║
# ║  🔗 http://45.159.209.14:3001                             ║
# ║                                                            ║
# ║  👤 Админ:    admin / admin123                            ║
# ║  👨 Менеджер: manager / manager123                        ║
# │                                                            ║
# ║  Статус: ✅ ОНЛАЙН                                         ║
# ╚════════════════════════════════════════════════════════════╝

# Для выхода: Ctrl+C
```

### Вариант 2: Добавить в PM2 (рекомендуется)

```bash
# Запустить веб-интерфейс через PM2
pm2 start src/web-server.js --name "hh-web-ui"

# Проверить статус
pm2 status

# Должно быть:
# id │ name            │ namespace   │ version │ mode    │ ↺ │ status    │ ↑
# ────┼─────────────────┼─────────────┼─────────┼─────────┼───┼───────────┼──
# 0  │ hh-parser       │ default     │ 1.0.0   │ fork    │ 0 │ online    │ 0m
# 1  │ hh-web-ui       │ default     │ 1.0.0   │ fork    │ 0 │ online    │ 0m

# Сохранить конфиг
pm2 save
```

## 🌐 ШАГ 5: Открыть в браузере

### Локально (с сервера):
```
http://localhost:3001
```

### С другого компьютера:
```
http://45.159.209.14:3001
```

### Учётные данные:

**Администратор:**
- Логин: `admin`
- Пароль: `admin123`

**Менеджер:**
- Логин: `manager`
- Пароль: `manager123`

## 📊 ФУНКЦИОНАЛ

### 👨‍💼 Администратор имеет доступ к:

- **📊 Dashboard** - общая статистика
- **📋 Вакансии** - просмотр всех вакансий
- **👥 Клиенты** - просмотр всех кандидатов
- **🛠️ Инструменты**:
  - 📥 Экспорт в JSON
  - 📥 Экспорт в CSV
  - 🗑️ Очистка БД

### 👨‍💻 Менеджер имеет доступ к:

- **📊 Dashboard** - статистика (только просмотр)
- **📋 Вакансии** - просмотр актуальных вакансий
- **👥 Клиенты** - просмотр карточек клиентов

## 🔐 БЕЗОПАСНОСТЬ

### Поменять пароли:

```bash
nano /opt/hh-job-intelligence-tool/.env

# Изменить:
ADMIN_PASSWORD=новый_пароль_админа
MANAGER_PASSWORD=новый_пароль_менеджера

# Сохранить и перезагрузить
pm2 restart hh-web-ui
```

## 🐛 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

### Проверить логи:

```bash
# Показать логи веб-интерфейса
pm2 logs hh-web-ui --lines 50

# Показать все логи
pm2 logs

# Смотреть логи в реальном времени
pm2 logs hh-web-ui --follow
```

### Проверить файлы:

```bash
# Проверить что файлы на месте
ls -la /opt/hh-job-intelligence-tool/public/
# Должно быть:
# - index.html
# - js/app.js

# Проверить web-server.js
ls -la /opt/hh-job-intelligence-tool/src/web-server.js
```

### Проверить подключение к БД:

```bash
# Проверить что БД существует
ls -la /opt/hh-job-intelligence-tool/data/hh_intelligence.db

# Проверить содержимое БД
sqlite3 /opt/hh-job-intelligence-tool/data/hh_intelligence.db
.tables
SELECT COUNT(*) FROM jobs;
.quit
```

### Перезагрузить всё:

```bash
# Остановить оба сервиса
pm2 stop all

# Запустить оба сервиса
pm2 start all

# Проверить статус
pm2 status

# Смотреть логи
pm2 logs
```

## 🚀 СОВМЕСТНЫЙ ЗАПУСК ПАРСЕРА И ВЕБА

Оба сервиса работают независимо:

```bash
# Парсер работает на процессе PM2 ID 0
pm2 info hh-intelligence-parser

# Веб-интерфейс работает на процессе PM2 ID 1
pm2 info hh-web-ui

# Оба запускаются одновременно
pm2 start all

# Оба перезагружаются
pm2 restart all
```

## 📝 ИТОГО

После установки у вас будет:

✅ **Парсер HH.ru** (порт 3000 в logs)
✅ **Веб-интерфейс** (порт 3001)
✅ **Две роли**: Администратор и Менеджер
✅ **Просмотр вакансий и кандидатов**
✅ **Экспорт данных**
✅ **Управление БД**

## 🎉 ГОТОВО!

Теперь вы можете:
1. Просматривать результаты парсинга в веб-интерфейсе
2. Управлять клиентами и вакансиями
3. Экспортировать данные
4. Иметь разные роли для разных пользователей

**Вопросы? Напишите!** 💬

---

**Версия**: 1.0  
**Дата**: 2026-01-20  
**Статус**: ✅ ГОТОВО К УСТАНОВКЕ