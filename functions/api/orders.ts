// Cloudflare Worker API для работы с заявками в Supabase
// Разместить в functions/api/orders.ts

interface Order {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service: string;
  message?: string;
  address?: string;
  status: 'new' | 'processed' | 'completed' | 'cancelled';
  source?: string;
}

interface Env {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

// GET - Получение списка заявок
export async function onRequestGet(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'new';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?status=eq.${status}&order=created_at.desc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'apikey': env.SUPABASE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const orders = await response.json();
    return new Response(JSON.stringify(orders), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST - Создание новой заявки
export async function onRequestPost(request: Request, env: Env): Promise<Response> {
  try {
    const order: Order = await request.json();

    // Валидация
    if (!order.customer_name || !order.customer_phone || !order.service) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,
        service: order.service,
        message: order.message,
        address: order.address,
        status: 'new',
        source: order.source || 'website',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      throw new Error('Failed to create order');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PATCH - Обновление статуса заявки
export async function onRequestPatch(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updates = await request.json();

    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const method = request.method;

    switch (method) {
      case 'GET':
        return onRequestGet(request, env);
      case 'POST':
        return onRequestPost(request, env);
      case 'PATCH':
        return onRequestPatch(request, env);
      default:
        return new Response('Method not allowed', { status: 405 });
    }
  },
};
