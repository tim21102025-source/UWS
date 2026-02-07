// Telegram Bot API integration for UWS
// Sends order notifications to Telegram

interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

interface OrderData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  windowType?: string;
  windowWidth?: number;
  windowHeight?: number;
  quantity?: number;
}

export async function onRequestPost(context: { request: Request; env: Record<string, string> }) {
  try {
    const { request, env } = context;
    
    // Check for required environment variables
    const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram configuration missing:', { 
        hasBotToken: !!TELEGRAM_BOT_TOKEN, 
        hasChatId: !!TELEGRAM_CHAT_ID 
      });
      return new Response(JSON.stringify({ 
        error: 'Telegram configuration not set',
        message: 'Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const orderData: OrderData = await request.json();
    
    if (!orderData.name || !orderData.phone) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        message: 'Name and phone are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format message
    const message = formatTelegramMessage(orderData);
    
    // Send to Telegram
    const telegramResponse = await sendTelegramMessage({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    }, TELEGRAM_BOT_TOKEN);

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResponse);
      return new Response(JSON.stringify({
        error: 'Failed to send Telegram message',
        details: telegramResponse
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      messageId: telegramResponse.result?.message_id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Telegram API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function formatTelegramMessage(order: OrderData): string {
  const lines = [
    '📩 <b>Новая заявка с UWS</b>',
    '━━━━━━━━━━━━━━━━',
    `👤 <b>Имя:</b> ${escapeHtml(order.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(order.phone)}`,
  ];

  if (order.email) {
    lines.push(`📧 <b>Email:</b> ${escapeHtml(order.email)}`);
  }

  if (order.service) {
    lines.push(`🔧 <b>Услуга:</b> ${escapeHtml(order.service)}`);
  }

  if (order.windowType || order.windowWidth || order.windowHeight) {
    lines.push('');
    lines.push('🪟 <b>Параметры окна:</b>');
    if (order.windowType) lines.push(`   • Тип: ${escapeHtml(order.windowType)}`);
    if (order.windowWidth) lines.push(`   • Ширина: ${order.windowWidth} мм`);
    if (order.windowHeight) lines.push(`   • Высота: ${order.windowHeight} мм`);
    if (order.quantity) lines.push(`   • Количество: ${order.quantity} шт`);
  }

  if (order.message) {
    lines.push('');
    lines.push(`💬 <b>Сообщение:</b>`);
    lines.push(escapeHtml(order.message));
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━');
  lines.push(`🕐 ${new Date().toLocaleString('ru-RU')}`);

  return lines.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

async function sendTelegramMessage(
  message: TelegramMessage, 
  botToken: string
): Promise<{ ok: boolean; result?: { message_id: number }; description?: string }> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  return response.json();
}

export async function GET() {
  return new Response(JSON.stringify({
    service: 'UWS Telegram API',
    status: 'active',
    methods: ['POST']
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
