#!/bin/bash
# Скрипт для деплоя на GitHub Pages
# Замените YOUR_USERNAME и YOUR_REPO на свои значения!

YOUR_USERNAME="pilligrim28"
YOUR_REPO="studio-website"

echo "🚀 Деплой сайта-визитки на GitHub Pages"
echo "========================================="
echo ""
echo "⚠️  ВАЖНО: Отредактируйте этот файл:"
echo "   1. Замените YOUR_USERNAME на ваш логин GitHub"
echo "   2. Замените YOUR_REPO на название репозитория"
echo ""

# Проверка что git настроен
if ! git remote -v | grep -q github; then
    echo "📝 Шаг 1: Создайте репозиторий на GitHub"
    echo "   Перейдите: https://github.com/new"
    echo "   - Repository name: $YOUR_REPO"
    echo "   - НЕ создавайте README, .gitignore, license"
    echo ""
    read -p "✅ Репозиторий создан? (y/n): " confirm
    
    if [ "$confirm" = "y" ]; then
        echo ""
        echo "📝 Шаг 2: Подключение к GitHub"
        git remote add origin "https://github.com/$YOUR_USERNAME/$YOUR_REPO.git"
        echo "✅ Remote добавлен"
    else
        echo "❌ Создайте репозиторий и запустите скрипт снова"
        exit 1
    fi
fi

echo ""
echo "📤 Шаг 3: Отправка на GitHub..."
git push -u origin main

echo ""
echo "========================================="
echo "✅ Готово!"
echo ""
echo "📌 Теперь включите GitHub Pages:"
echo "   1. Перейдите в репозиторий → Settings → Pages"
echo "   2. Source: GitHub Actions"
echo "   3. Сайт будет доступен через 1-2 минуты:"
echo "      https://$YOUR_USERNAME.github.io/$YOUR_REPO/"
echo ""
echo "📧 Не забудьте настроить email в script.js:"
echo "   Найдите 'YOUR_EMAIL@example.com' и замените на ваш email"
