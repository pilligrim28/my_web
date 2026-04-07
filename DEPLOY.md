# 🚀 Полная инструкция по настройке

## 1️⃣ Деплой на GitHub Pages

### Шаг 1: Создайте репозиторий
```bash
cd "/home/pilligrim28/Документы/my_web"
git init
git add .
git commit -m "Initial commit"
```

### Шаг 2: Создайте репозиторий на GitHub
1. Перейдите на https://github.com/new
2. Создайте новый репозиторий (например: `studio-website`)
3. **НЕ** создавайте README, .gitignore, license

### Шаг 3: Подключите локальный репозиторий
```bash
git remote add origin https://github.com/ВАШ_USERNAME/studio-website.git
git branch -M main
git push -u origin main
```

### Шаг 4: Включите GitHub Pages
1. Перейдите в репозитории → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Workflow автоматически запустится
4. Через 1-2 минуты сайт будет доступен по адресу:
   ```
   https://ВАШ_USERNAME.github.io/studio-website/
   ```

---

## 2️⃣ Настройка Email (FormSubmit.co) — БЕСПЛАТНО

### Шаг 1: Замените email в script.js
Откройте `script.js` и найдите строку:
```javascript
const email = 'YOUR_EMAIL@example.com';
```
Замените на ваш реальный email:
```javascript
const email = 'vash@email.com';
```

### Шаг 2: Подтвердите email
1. После первого деплоя отправьте тестовую заявку
2. На вашу почту придёт письмо от FormSubmit
3. **Подтвердите email** по ссылке в письме
4. Готово! Все заявки будут приходить на почту

### Что получите в письме:
- Имя клиента
- Email
- Телефон
- Выбранная платформа
- Сообщение
- Дата и время

---

## 3️⃣ Настройка Telegram бота — БЕСПЛАТНО

### Шаг 1: Создайте бота
1. Откройте Telegram
2. Найдите **@BotFather**
3. Отправьте `/newbot`
4. Следуйте инструкциям:
   - Придумайте имя (например: `Studio Leads Bot`)
   - Придумайте username (например: `studio_leads_bot`)
5. **Скопируйте токен** (выглядит как: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Шаг 2: Узнайте свой Chat ID
1. Найдите **@userinfobot** в Telegram
2. Отправьте `/start`
3. Скопируйте ваш **Id** (например: `123456789`)

### Шаг 3: Добавьте бота в контакты
1. Найдите вашего бота по username
2. Нажмите **Start** или отправьте любое сообщение
3. **Важно!** Бот не может писать первым — вы должны начать диалог

### Шаг 4: Создайте Cloudflare Worker

#### 4.1 Зарегистрируйтесь
Перейдите на https://dash.cloudflare.com и создайте аккаунт

#### 4.2 Создайте Worker
1. В меню слева: **Workers & Pages**
2. Нажмите **Create Application** → **Create Worker**
3. Назовите его (например: `studio-telegram`)
4. Нажмите **Deploy**

#### 4.3 Настройте код
1. Нажмите **Edit Code**
2. Удалите весь код
3. Вставьте код из файла `telegram-worker.js`
4. **Замените значения:**
```javascript
const BOT_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz';
const CHAT_ID = '123456789';
```
5. Нажмите **Deploy**

#### 4.4 Скопируйте URL
Вверху страницы будет URL вида:
```
https://studio-telegram.ВАШ_USERNAME.workers.dev
```
**Скопируйте его!**

### Шаг 5: Подключите Worker к сайту
Откройте `script.js` и найдите:
```javascript
const workerUrl = 'https://your-worker.workers.dev/send';
```
Замените на ваш URL:
```javascript
const workerUrl = 'https://studio-telegram.ВАШ_USERNAME.workers.dev';
```

### Что получите в Telegram:
```
🔔 Новая заявка с сайта

👤 Имя: Иван
📧 Email: ivan@email.com
📱 Телефон: +7 999 123-45-67
💻 Платформа: Telegram
📝 Тип формы: lead-capture
💬 Сообщение: Хочу бота для магазина

🕐 07.04.2026, 15:30
```

---

## 4️⃣ Проверка работы

### Тестовая заявка:
1. Откройте сайт: `https://ВАШ_USERNAME.github.io/studio-website/`
2. Нажмите "Бесплатная консультация"
3. Заполните форму
4. Нажмите "Получить гайд"

### Ожидаемый результат:
✅ Уведомление "Отлично! Проверьте почту"  
✅ Письмо на email через 1-2 минуты  
✅ Сообщение в Telegram через 1-2 секунды  

---

## 5️⃣ Обновление сайта

После любых изменений:
```bash
git add .
git commit -m "Описание изменений"
git push
```
GitHub Pages автоматически обновится через 1-2 минуты.

---

##  Альтернативы (если нужно)

### Только Email (без Telegram):
- Удалите вызов `sendToTelegram()` из `submitFormData()`

### Только Telegram (без Email):
- Удалите вызов `sendToEmail()` из `submitFormData()`

### Другие сервисы для Email:
- **Formspree.io** — 50 заявок/мес бесплатно
- **EmailJS.com** — 200 заявок/мес бесплатно
- **Getform.io** — 100 заявок/мес бесплатно

### Другие сервисы для Telegram:
- **Make.com** (бывший Integromat) — 1000 операций/мес
- **n8n.cloud** — можно хостить самому
- **Pipedream** — 333 запроса/день бесплатно

---

## 💡 Советы

1. **Тестируйте локально** перед деплоем
2. **Не коммитьте токены** в репозиторий (используйте GitHub Secrets для Worker)
3. **Проверяйте spam** папку после первой настройки FormSubmit
4. **Сохраните токен бота** в надёжном месте
5. **Мониторинг**: Cloudflare показывает статистику запросов в панели Workers

---

## 🆘 Troubleshooting

### Заявки не приходят на email:
- Проверьте spam папку
- Убедитесь что подтвердили email через FormSubmit
- Проверьте правильность email в script.js

### Заявки не приходят в Telegram:
- Убедитесь что написали боту первым (`/start`)
- Проверьте правильность BOT_TOKEN и CHAT_ID
- Проверьте URL Worker в Cloudflare
- Откройте консоль браузера (F12) → посмотрите ошибки

### Сайт не обновляется:
- Подождите 2-3 минуты после push
- Очистите кэш браузера (Ctrl+Shift+Delete)
- Проверьте GitHub Actions → нет ли ошибок

---

## 📞 Поддержка

Если что-то не работает:
1. Откройте консоль браузера (F12)
2. Проверьте вкладку Network
3. Посмотрите ошибки в Console
4. Проверьте логи в Cloudflare Workers
