# SEO Спецификация: Веб-сайт UWS

**Версия:** 1.0  
**Дата:** 2026-02-06

---

## 1. Локализация для Киева

### 1.1 Ключевые слова (Украинский)

```
установка вікон Київ, ремонт вікон Київ, ціни на вікна, 
металопластикові вікна, балкони під ключ, заміна склопакетів, 
москітні сітки Київ, регулювання вікон
```

### 1.2 Ключевые слова (Русский)

```
установка окон Киев, ремонт окон Киев, цены на окна, 
металлопластиковые окна, балконы под ключ, замена стеклопакетов, 
москитные сетки Киев, регулировка окон
```

---

## 2. URL структура

### 2.1 Страницы

| Страница | URL (UK) | URL (RU) |
|----------|----------|----------|
| Главная | / | / |
| О компании | /about | /ru/about |
| Услуги | /services | /ru/services |
| Установка окон | /services/vstanovlennya-vikon | /ru/services/ustanovka-okon |
| Калькулятор | /calculator | /ru/calculator |
| Блог | /blog | /ru/blog |
| Контакты | /contactscontacts |

---

 | /ru/## 3. Hreflang

```html
<link rel="alternate" hreflang="uk" href="https://uws.com.ua/" />
<link rel="alternate" hreflang="ru" href="https://uws.com.ua/ru/" />
<link rel="alternate" hreflang="x-default" href="https://uws.com.ua/" />
```

---

## 4. Schema.org разметка

### 4.1 Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "UWS — Ukrainian Window Systems",
  "url": "https://uws.com.ua",
  "logo": "https://uws.com.ua/images/logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+380660575202",
    "contactType": "customer service",
    "availableLanguage": ["Ukrainian", "Russian"]
  }
}
```

### 4.2 LocalBusiness (Киев)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "UWS — Встановлення та Ремонт Вікон Київ",
  "description": "Профессиональна установка та ремонт вікон у Києві.",
  "url": "https://uws.com.ua",
  "telephone": "+380660575202",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Київ",
    "addressRegion": "Київська область",
    "addressCountry": "UA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 50.4501,
    "longitude": 30.5234
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 50.4501, "longitude": 30.5234 },
    "geoRadius": 50000
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday"], "opens": "09:00", "closes": "19:00" }
  ]
}
```

---

## 5. Meta теги

### 5.1 Главная страница (UK)

```html
<title>UWS — Установка и Ремонт Окон Киев | Цены 2026</title>
<meta name="description" content="Профессиональная установка и ремонт окон в Киеве. Официальная гарантия до 5 лет. Рассчитайте стоимость окон на калькуляторе." />
<meta name="keywords" content="установка окон киев, ремонт окон киев, цены на окна, металопластиковые окна" />
```

### 5.2 Open Graph

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="UWS — Установка и Ремонт Окон Киев" />
<meta property="og:description" content="Профессиональная установка и ремонт окон в Киеве." />
<meta property="og:image" content="https://uws.com.ua/images/og-image.jpg" />
<meta property="og:url" content="https://uws.com.ua/" />
<meta property="og:locale" content="uk_UA" />
```

---

## 6. Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://uws.com.ua/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://uws.com.ua/services/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://uws.com.ua/calculator/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.95</priority>
  </url>
</urlset>
```

---

## 7. robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://uws.com.ua/sitemap.xml
```

---

## 8. Техническое SEO

| Аспект | Статус |
|--------|--------|
| SSL сертификат | ✅ |
| Canonical URLs | ✅ |
| Meta description | ✅ |
| Open Graph | ✅ |
| Twitter Cards | ✅ |
| Schema.org | ✅ |
| XML Sitemap | ✅ |
| robots.txt | ✅ |
| 404 страница | ✅ |

---

**Документ:** SEO Спецификация  
**Часть:** 04-seo_specification.md
