# Интеграции и API: Веб-сайт UWS

**Версия:** 1.0  
**Дата:** 2026-02-06

---

## 1. Формы заявок

### 1.1 Компонент OrderForm

```tsx
import { OrderForm } from 'src/components/forms';

// Базовое использование
<OrderForm />

// С предзаполненной услугой
<OrderForm service="window-installation" />

// С колбэком успеха
<OrderForm onSuccess={() => console.log('Заявка отправлена!')} />
```

### 1.2 Интерфейс формы

```typescript
interface OrderFormData {
  name: string;           // Имя клиента
  phone: string;           // Телефон (обязательно)
  email?: string;          // Email
  service: string;         // Услуга
  message?: string;       // Описание
  address?: string;        // Адрес
}
```

### 1.3 Компонент FileUploader

```tsx
import { FileUploader } from 'src/components/forms';

<FileUploader
  name="files"
  maxFiles={10}
  maxSize={10} // MB
  accept={['image/*', 'video/*']}
  onChange={(files) => console.log(files)}
/>
```

### 1.4 Компонент OrderButton

```tsx
import { OrderButton } from 'src/components/forms';

<OrderButton variant="primary" service="window-repair">
  Заказать ремонт
</OrderButton>

<OrderButton variant="icon" /> // Кнопка с иконкой телефона
```

---

## 2. API Endpoints

### 2.1 Telegram API

**Endpoint:** `POST /api/telegram`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Иван Иванов",
  "phone": "+38 (099) 123-45-67",
  "email": "ivan@example.com",
  "service": "window-installation",
  "serviceLabel": "Установка окон",
  "message": "Нужно установить 3 окна",
  "address": "г. Киев, ул. Примерная 1",
  "website": "" // Honeypot - должен быть пустым
}
```

**Response:**
```json
{
  "success": true
}
```

**Формат сообщения в Telegram:**
```
📩 Новая заявка!

👤 Имя: Иван Иванов
📞 Телефон: +38 (099) 123-45-67
📧 Email: ivan@example.com
🏠 Услуга: Установка окон
📝 Сообщение: Нужно установить 3 окна
📍 Адрес: г. Киев, ул. Примерная 1

🕐 Время: 06.02.2026 23:00:00
```

### 2.2 Orders API (Supabase)

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "customer_name": "Иван Иванов",
  "customer_phone": "+38 (099) 123-45-67",
  "customer_email": "ivan@example.com",
  "service": "window-installation",
  "message": "Нужно установить 3 окна",
  "address": "г. Киев, ул. Примерная 1"
}
```

**Response:**
```json
{
  "success": true
}
```

**GET /api/orders** - Получение списка заявок

**Query Parameters:**
- `status` - фильтр по статусу (new, processed, completed, cancelled)
- `limit` - количество записей (по умолчанию 50)
- `offset` - смещение для пагинации

---

## 3. Настройка интеграций

### 3.1 Telegram Bot

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Добавьте бота в чат/канал
4. Получите ID чата (используйте @userinfobot для получения ID)
5. Добавьте переменные в `.env`:

```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=-1001234567890
```

### 3.2 Email (Resend)

1. Зарегистрируйтесь на [Resend.com](https://resend.com)
2. Получите API ключ
3. Добавьте переменную в `.env`:

```bash
RESEND_API_KEY=re_123456789
```

### 3.3 Supabase

1. Создайте проект на [Supabase.com](https://supabase.com)
2. Выполните миграцию из `docs/supabase-migration.sql`
3. Добавьте переменные в `.env`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
```

### 3.4 Cloudflare Workers

1. Установите Wrangler: `npm install -g wrangler`
2. Авторизуйтесь: `wrangler login`
3. Скопируйте `wrangler.example.toml` в `wrangler.toml`
4. Настройте секреты:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put RESEND_API_KEY
```

5. Деплой: `npx wrangler deploy`

---

## 4. GA4 События

### 4.1 Отслеживаемые события

| Событие | Категория | Описание |
|---------|-----------|----------|
| `form_submit` | form | Отправка формы заявки |
| `form_start` | form | Начало заполнения формы |
| `button_click` | button | Клик по кнопке |
| `phone_click` | contact | Клик по телефону |
| `cta_click` | cta | Клик по CTA |
| `page_view` | page | Просмотр страницы |

### 4.2 Использование

```tsx
import { analyticsEvents } from 'src/utils/analytics';

// Отправка события
analyticsEvents.formSubmit('order_form');
analyticsEvents.phoneClick('+380991234567');
analyticsEvents.ctaClick('Заказать звонок', 'header');
```

---

## 5. Структура файлов

```
src/components/forms/
├── index.ts           # Экспорт компонентов
├── OrderForm.tsx      # Форма заявки
├── OrderModal.tsx     # Модальное окно с формой
├── OrderButton.tsx    # Кнопка с формой
└── FileUploader.tsx  # Загрузка файлов

functions/api/
├── telegram.ts         # API для Telegram
└── orders.ts          # API для Supabase

docs/
├── supabase-migration.sql  # SQL миграция
└── integrations.md         # Эта документация
```

---

## 6. Тестовые сценарии

### 6.1 Тест формы заявки

1. Откройте страницу с формой
2. Заполните обязательные поля
3. Прикрепите файл (опционально)
4. Отправьте форму
5. Проверьте:
   - Сообщение в Telegram
   - Email подтверждение
   - Запись в Supabase

### 6.2 Тест валидации

1. Оставьте обязательные поля пустыми
2. Введите некорректный email
3. Введите короткий номер телефона
4. Попытайтесь загрузить >10 файлов
5. Проверьте сообщения об ошибках

---

**Документ:** Интеграции и API  
**Часть:** 06-integrations.md
