# ⚡ Быстрый старт

## Что нужно сделать (5 минут):

### 1. Email заявки
```bash
# Откройте script.js, найдите строку 298:
const email = 'YOUR_EMAIL@example.com';

# Замените на ваш email:
const email = 'vash@gmail.com';
```

### 2. Telegram заявки
```bash
# 1. Создайте бота через @BotFather → получите токен
# 2. Узнайте chat_id через @userinfobot
# 3. Создайте Cloudflare Worker (бесплатно)
# 4. Вставьте код из telegram-worker.js
# 5. Замените BOT_TOKEN и CHAT_ID
# 6. Скопируйте URL Worker
# 7. В script.js замените URL Worker (строка 329)
```

### 3. Деплой на GitHub Pages
```bash
cd "/home/pilligrim28/Документы/my_web"
git init
git add .
git commit -m "Initial"
git remote add origin https://github.com/ВАШ_USERNAME/РЕПОЗИТОРИЙ.git
git branch -M main
git push -u origin main
```

Затем в GitHub: **Settings → Pages → GitHub Actions**

---

## 📁 Файлы проекта:

- `index.html` — сайт
- `styles.css` — стили
- `script.js` — логика + отправка заявок
- `telegram-worker.js` — код для Cloudflare Worker
- `DEPLOY.md` — подробная инструкция
- `.github/workflows/deploy.yml` — автодеплой

---

## 🔗 Полезные ссылки:

- FormSubmit.co — отправка на email (бесплатно)
- @BotFather — создание Telegram бота
- Cloudflare Workers — хостинг для Telegram Worker (бесплатно)
- GitHub Pages — хостинг сайта (бесплатно)
