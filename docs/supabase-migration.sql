-- Supabase SQL Migration for UWS Orders
-- Выполнить в Supabase SQL Editor

-- Создание таблицы заявок
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service TEXT NOT NULL,
  service_label TEXT,
  message TEXT,
  address TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processed', 'completed', 'cancelled', 'rejected')),
  source TEXT DEFAULT 'website',
  metadata JSONB DEFAULT '{}'::jsonb,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_service ON orders(service);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Политики безопасности (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Политикатения всех для ч заявок (для админов)
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id AND email = 'admin@uws.com.ua'
    )
  );

-- Политика для создания заявок (всем)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Политика для обновления статуса (для админов)
CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id AND email = 'admin@uws.com.ua'
    )
  );

-- Функция для отправки уведомления в Telegram при создании заявки
CREATE OR REPLACE FUNCTION notify_telegram_on_new_order()
RETURNS TRIGGER AS $$
DECLARE
  message TEXT;
BEGIN
  message := format(
    '📩 *Новая заявка!*\n\n👤 Имя: %s\n📞 Телефон: %s\n📧 Email: %s\n🏠 Услуга: %s\n📝 Сообщение: %s\n📍 Адрес: %s',
    NEW.customer_name,
    NEW.customer_phone,
    COALESCE(NEW.customer_email, 'не указан'),
    COALESCE(NEW.service_label, NEW.service),
    COALESCE(NEW.message, 'нет'),
    COALESCE(NEW.address, 'не указан')
  );
  
  -- Здесь можно добавить вызов webhook для Telegram
  PERFORM net.http_post(
    'https://api.telegram.org/bot' || current_setting('app.telegram_bot_token', true) || '/sendMessage',
    json_build_object(
      'chat_id', current_setting('app.telegram_chat_id', true),
      'text', message,
      'parse_mode', 'MarkdownV2'
    )::text,
    'application/json',
    'POST'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Включение триггера (раскомментировать при настройке)
-- CREATE TRIGGER on_new_order
--   AFTER INSERT ON orders
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_telegram_on_new_order();

-- Пример тестовых данных
INSERT INTO orders (customer_name, customer_phone, customer_email, service, service_label, message)
VALUES 
  ('Иван Иванов', '+38 (099) 123-45-67', 'ivan@example.com', 'window-installation', 'Установка окон', 'Нужно установить 3 окна в квартире'),
  ('Мария Петрова', '+38 (067) 987-65-43', NULL, 'balcony', 'Балконы и лоджии', 'Хочу остеклить балкон');
