# Документация проекта UWS

**Версия:** 1.0  
**Дата:** 2026-02-06

---

## Структура документации

| № | Документ | Описание |
|---|----------|----------|
| 01 | [Спецификация требований](01-requirements_specification.md) | Функциональные и нефункциональные требования |
| 02 | [Техническая архитектура](02-technical_architecture.md) | Технологический стек, структура, интеграции |
| 03 | [UI Дизайн-система](03-ui_design_system.md) | Цвета, типографика, компоненты, анимации |
| 04 | [SEO Спецификация](04-seo_specification.md) | Мета-теги, Schema.org, sitemap |
| 05 | [План реализации](05-implementation_plan.md) | Этапы, сроки, milestones |

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| Astro | 4.x | SSG фреймворк |
| React | 18.x | Интерактивные компоненты |
| TypeScript | 5.x | Типизация |
| Tailwind CSS | 3.x | Стилизация |
| Keystatic | - | Git-based CMS |
| Cloudflare | - | CDN, DNS |

---

## Ключевые решения

### Генератор сайта: **Astro**
- Island Architecture для минимального JS
- Content Collections для контента
- Лучшая производительность

### CMS: **Keystatic**
- Git-based workflow
- Type-safe контент
- Локальный предпросмотр

### Хостинг: **GitHub Pages + Cloudflare**
- Бесплатный хостинг
- CDN + DNS
- SSL сертификат

---

## Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/uws/website.git
cd website

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Деплой
npm run deploy
```

---

## Milestones

| Milestone | Срок | Статус |
|-----------|------|--------|
| Setup Complete | Неделя 1 | ⏳ |
| UI Kit Ready | Неделя 3 | ⏳ |
| Core Pages | Неделя 5 | ⏳ |
| Calculator | Неделя 7 | ⏳ |
| Beta Launch | Неделя 10 | ⏳ |
| Production | Неделя 11 | ⏳ |

**Общий срок: 11 недель**

---

## Контакты

- **Проект:** UWS Website Redesign
- **Репозиторий:** GitHub
- **Документация:** /docs
