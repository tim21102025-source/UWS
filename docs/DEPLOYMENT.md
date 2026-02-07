# Деплой UWS Website

## Предварительные требования

1. **GitHub репозиторий** создан и связан с локальным проектом
2. **Cloudflare аккаунт** с доменом uws.com.ua
3. **Node.js 18+** установлен

---

## Шаг 1: Инициализация Git и Push

```bash
# Инициализировать Git репозиторий
git init
git add .
git commit -m "Initial commit: UWS website"

# Создать репозиторий на GitHub и связать
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

**После push сработает GitHub Actions и начнется деплой на GitHub Pages.**

---

## Шаг 2: GitHub Pages настройка

1. Перейти в **Repository → Settings → Pages**
2. Source: **GitHub Actions**
3. Дождаться завершения workflow (обычно 2-5 минут)
4. URL будет: `https://USERNAME.github.io/REPO_NAME/`

---

## Шаг 3: Cloudflare DNS настройка

### Добавить домен в Cloudflare

1. Войти в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Нажать **Add a site**
3. Ввести: `uws.com.ua`
4. Выбрать план: **Free** или **Pro**

### DNS настройки

Добавить A запись для GitHub Pages:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | Auto |
| A | @ | 185.199.109.153 | Auto |
| A | @ | 185.199.110.153 | Auto |
| A | @ | 185.199.111.153 | Auto |
| CNAME | www | USERNAME.github.io | Auto |

**GitHub IP адреса:** `185.199.108-111.153`

### SSL/HTTPS настройка

1. **SSL/TLS → Overview:**
   - Mode: **Full**

2. **SSL/TLS → Edge Certificates:**
   - Включить **Always Use HTTPS**
   - Включить **HTTP Strict Transport Security (HSTS)**

3. **Page Rules** (опционально):
   ```
   URL: http://uws.com.ua/*
   Forwarding: https://uws.com.ua/$1
   Status: 301
   ```

---

## Шаг 4: Cloudflare Workers деплой (API)

### Установка Wrangler

```bash
npm install -g wrangler
npx wrangler login
```

### Настройка secrets

```bash
# Telegram
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID

# Supabase (опционально)
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_KEY
```

### Деплой

```bash
npx wrangler deploy
```

### Настройка Custom Domain для API

1. Перейти в **Workers & Pages → uws-api**
2. **Settings → Domains & Routes**
3. Add:
   - Route: `api.uws.com.ua/*`
   - Zone: `uws.com.ua`

---

## Шаг 5: Supabase настройка (опционально)

### Создание проекта

1. Перейти в [Supabase Dashboard](https://supabase.com/dashboard)
2. Создать новый проект
3. Получить **Project URL** и **anon public key**

### Выполнение миграции

Открыть **SQL Editor** в Supabase и выполнить `docs/supabase-migration.sql`

### Настройка environment variables

Создать `.env` файл:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_KEY=your-anon-key
```

---

## Шаг 6: Post-deploy тестирование

### Проверки

- [ ] Главная страница: `https://uws.com.ua/`
- [ ] Калькулятор: `https://uws.com.ua/calculator.html`
- [ ] Контакты: `https://uws.com.ua/contacts.html`
- [ ] HTTPS работает
- [ ] SSL сертификат валиден

### Lighthouse проверка

```bash
# Установить lighthouse
npm install -g lighthouse

# Запустить проверку
lighthouse https://uws.com.ua/ --view
```

**Цели:**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## Структура URL

| Страница | URL |
|----------|-----|
| Главная | https://uws.com.ua/ |
| О нас | https://uws.com.ua/about.html |
| Калькулятор | https://uws.com.ua/calculator.html |
| Услуги | https://uws.com.ua/services.html |
| FAQ | https://uws.com.ua/faq.html |
| Контакты | https://uws.com.ua/contacts.html |
| API | https://api.uws.com.ua/api/telegram |

---

## Troubleshooting

### GitHub Pages не работает

1. Проверить workflow run: **Actions → Deploy to GitHub Pages**
2. Убедиться что branch `main` существует
3. Проверить artifact: `actions/upload-pages-artifact`

### SSL ошибки

1. Подождать 24-48 часов для распространения DNS
2. Проверить SSL в: **SSL/TLS → Edge Certificates**
3. Включить **Always Use HTTPS** в настройках

### Cloudflare Workers ошибки

1. Проверить logs в **Workers & Pages → uws-api → Logs**
2. Убедиться что secrets настроены
3. Проверить CORS заголовки

---

## Команды для деплоя

```bash
# 1. Сборка
npm run build

# 2. Git commit & push
git add .
git commit -m "Update"
git push

# 3. Cloudflare Workers
npx wrangler deploy

# 4. Тестирование
npm run test:e2e
```
