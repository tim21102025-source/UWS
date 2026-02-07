// Cloudflare Worker для отправки заявок в Telegram
// Разместить в functions/api/telegram.ts

interface TelegramMessage {
  name: string;
  phone: string;
  email?: string;
  service: string;
  serviceLabel?: string;
  message?: string;
  address?: string;
  website?: string; // Honeypot field
}

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  RESEND_API_KEY?: string;
}

export async function onRequestPost(request: Request, env: Env): Promise<Response> {
  try {
    const data: TelegramMessage = await request.json();

    // Валидация данных
    if (!data.name || !data.phone || !data.service) {
      return new Response(
        JSON.stringify({ error: 'Отсутствуют обязательные поля' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Проверка honeypot поля
    if (data.website && data.website.length > 0) {
      // Это бот - silently fail
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Формирование сообщения для Telegram
    const message = formatTelegramMessage(data);

    // Отправка в Telegram
    const telegramResult = await sendToTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, message);

    if (!telegramResult.success) {
      console.error('Telegram send error:', telegramResult.error);
      // Не возвращаем ошибку клиенту, чтобы не раскрывать детали
    }

    // Отправка email уведомления (опционально)
    if (env.RESEND_API_KEY && data.email) {
      await sendConfirmationEmail(env.RESEND_API_KEY, data);
    }

    // Сохранение в Supabase (опционально)
    // await saveToSupabase(data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Request processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка обработки запроса' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function formatTelegramMessage(data: TelegramMessage): string {
  const lines = [
    '📩 *Новая заявка!*',
    '',
    `👤 *Имя:* ${escapeMarkdown(data.name)}`,
    `📞 *Телефон:* ${escapeMarkdown(data.phone)}`,
  ];

  if (data.email) {
    lines.push(`📧 *Email:* ${escapeMarkdown(data.email)}`);
  }

  lines.push(`🏠 *Услуга:* ${escapeMarkdown(data.serviceLabel || data.service)}`);

  if (data.message) {
    lines.push(`📝 *Сообщение:* ${escapeMarkdown(data.message)}`);
  }

  if (data.address) {
    lines.push(`📍 *Адрес:* ${escapeMarkdown(data.address)}`);
  }

  lines.push('');
  lines.push(`🕐 *Время:* ${new Date().toLocaleString('ru-RU')}`);

  return lines.join('\n');
}

function escapeMarkdown(text: string): string {
  return text
    .replace(/\_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\~/g, '\\~')
    .replace(/\`/g, '\\`')
    .replace(/\>/g, '\\>')
    .replace(/\#/g, '\\#')
    .replace(/\-/g, '\\-')
    .replace(/\+/g, '\\+')
    .replace(/\=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/\!/g, '\\!');
}

async function sendToTelegram(botToken: string, chatId: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (!botToken || !chatId) {
    return { success: false, error: 'Telegram credentials not configured' };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function sendConfirmationEmail(apiKey: string, data: TelegramMessage): Promise<void> {
  if (!apiKey) return;

  try {
    // Здесь можно использовать Resend или SendGrid API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'UWS <noreply@uws.com.ua>',
        to: data.email,
        subject: 'Ваша заявка принята - UWS',
        html: generateConfirmationEmail(data),
      }),
    });

    if (!response.ok) {
      console.error('Email send error:', await response.text());
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

function generateConfirmationEmail(data: TelegramMessage): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Заявка принята</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Спасибо за заявку!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Уважаемый ${escapeHtml(data.name)}!</p>
    
    <p>Мы получили вашу заявку и свяжемся с вами в течение 15 минут.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h3 style="margin-top: 0; color: #1e40af;">Детали заявки:</h3>
      <p><strong>Услуга:</strong> ${escapeHtml(data.serviceLabel || data.service)}</p>
      <p><strong>Телефон:</strong> ${escapeHtml(data.phone)}</p>
      ${data.email ? `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>` : ''}
      ${data.message ? `<p><strong>Сообщение:</strong> ${escapeHtml(data.message)}</p>` : ''}
    </div>
    
    <p>Если у вас возникли вопросы, вы можете связаться с нами по телефону <strong>+38 (044) 123-45-67</strong></p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #6b7280; font-size: 12px; text-align: center;">
      С уважением, команда UWS<br>
      uws.com.ua
    </p>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Добавляем обработчик OPTIONS для CORS
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Cloudflare Worker export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return onRequestOptions();
    }
    
    if (request.method === 'POST') {
      return onRequestPost(request, env);
    }
    
    return new Response('Method not allowed', { status: 405 });
  },
};
