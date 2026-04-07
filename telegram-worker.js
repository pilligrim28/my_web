// ===== Cloudflare Worker для отправки в Telegram =====
// Замените эти значения на свои!
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = 'YOUR_CHAT_ID_HERE';

export default {
  async fetch(request, env) {
    // Разрешаем CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      const { name, email, phone, platform, message, form_type } = body;

      // Формируем сообщение
      let text = `🔔 *Новая заявка с сайта*\n\n`;
      text += `👤 *Имя:* ${name || 'Не указано'}\n`;
      if (email) text += `📧 *Email:* ${email}\n`;
      if (phone) text += `📱 *Телефон:* ${phone}\n`;
      if (platform) text += `💻 *Платформа:* ${platform}\n`;
      if (form_type) text += `📝 *Тип формы:* ${form_type}\n`;
      if (message) text += `💬 *Сообщение:* ${message}\n`;
      text += `\n🕐 ${new Date().toLocaleString('ru-RU')}`;

      // Отправляем в Telegram
      const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send to Telegram');
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
