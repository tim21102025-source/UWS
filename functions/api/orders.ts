// Orders API endpoint for UWS
// Saves orders to Supabase and optionally sends to Telegram

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
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface SupabaseConfig {
  url: string;
  key: string;
}

export async function onRequestPost(context: { request: Request; env: Record<string, string> }) {
  try {
    const { request, env } = context;
    
    // Check Supabase configuration
    const SUPABASE_URL = env.SUPABASE_URL;
    const SUPABASE_KEY = env.SUPABASE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(JSON.stringify({
        error: 'Supabase configuration missing',
        message: 'Please set SUPABASE_URL and SUPABASE_KEY environment variables'
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

    // Prepare order record
    const order = {
      name: orderData.name,
      phone: orderData.phone,
      email: orderData.email || null,
      service: orderData.service || null,
      message: orderData.message || null,
      window_type: orderData.windowType || null,
      window_width: orderData.windowWidth || null,
      window_height: orderData.windowHeight || null,
      quantity: orderData.quantity || null,
      source: orderData.source || 'website',
      utm_source: orderData.utm_source || null,
      utm_medium: orderData.utm_medium || null,
      utm_campaign: orderData.utm_campaign || null,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Save to Supabase
    const supabaseResponse = await saveToSupabase(order, { url: SUPABASE_URL, key: SUPABASE_KEY });

    if (!supabaseResponse.ok) {
      console.error('Supabase error:', supabaseResponse);
      return new Response(JSON.stringify({
        error: 'Failed to save order',
        details: supabaseResponse
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Optionally send to Telegram
    const telegramSent = await sendToTelegram(orderData, env);

    return new Response(JSON.stringify({
      success: true,
      orderId: supabaseResponse.data?.id,
      telegramNotified: telegramSent
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Orders API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function saveToSupabase(
  order: Record<string, unknown>,
  config: SupabaseConfig
): Promise<{ ok: boolean; data?: { id: number }; error?: string }> {
  try {
    const response = await fetch(`${config.url}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.key,
        'Authorization': `Bearer ${config.key}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: errorText };
    }

    // Get the order ID from Location header
    const location = response.headers.get('Location');
    const orderId = location ? parseInt(location.split('/').pop() || '0') : 0;

    return { ok: true, data: { id: orderId } };
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function sendToTelegram(
  orderData: OrderData, 
  env: Record<string, string>
): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram not configured, skipping notification');
    return false;
  }

  const message = formatTelegramMessage(orderData);
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
}

function formatTelegramMessage(order: OrderData): string {
  const lines = [
    '📩 <b>Новая заявка с UWS</b>',
    '━━━━━━━━━━━━━━━━',
    `👤 <b>Имя:</b> ${escapeHtml(order.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(order.phone)}`,
  ];

  if (order.email) lines.push(`📧 <b>Email:</b> ${escapeHtml(order.email)}`);
  if (order.service) lines.push(`🔧 <b>Услуга:</b> ${escapeHtml(order.service)}`);
  
  if (order.windowType || order.windowWidth || order.windowHeight) {
    lines.push('');
    lines.push('🪟 <b>Параметры:</b>');
    if (order.windowType) lines.push(`   • Тип: ${escapeHtml(order.windowType)}`);
    if (order.windowWidth) lines.push(`   • Ширина: ${order.windowWidth} мм`);
    if (order.windowHeight) lines.push(`   • Высота: ${order.windowHeight} мм`);
    if (order.quantity) lines.push(`   • Количество: ${order.quantity}`);
  }

  if (order.message) {
    lines.push('');
    lines.push(`💬 <b>Сообщение:</b>`);
    lines.push(escapeHtml(order.message));
  }

  lines.push('');
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

export async function GET() {
  return new Response(JSON.stringify({
    service: 'UWS Orders API',
    status: 'active',
    methods: ['POST'],
    schema: {
      required: ['name', 'phone'],
      optional: ['email', 'service', 'message', 'windowType', 'windowWidth', 'windowHeight', 'quantity']
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
