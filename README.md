# UWS Website

**Версия:** 1.0  
**Дата:** 2026-02-06

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| Astro | 4.x | SSG фреймворк |
| React | 18.x | UI компоненты |
| TypeScript | 5.x | Типизация |
| Tailwind CSS | 3.x | Стилизация |

---

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Режим разработки

```bash
npm run dev
```

### Сборка для продакшна

```bash
npm run build
```

### Предпросмотр

```bash
npm run preview
```

---

## Структура проекта

```
uws-website/
├── .astro/              # Astro кэш
├── .github/             # GitHub Actions
│   └── workflows/
├── .vscode/             # VSCode настройки
├── config/              # Конфигурация
├── public/              # Статические файлы
├── src/
│   ├── components/      # Компоненты
│   ├── layouts/         # Макеты
│   ├── pages/           # Страницы
│   ├── content/        # Контент (markdown)
│   ├── styles/          # Глобальные стили
│   └── utils/           # Утилиты
├── astro.config.mjs     # Astro конфигурация
├── tailwind.config.mjs  # Tailwind конфигурация
├── tsconfig.json        # TypeScript конфигурация
└── package.json
```

---

## Команды

| Команда | Описание |
|----------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Сборка проекта |
| `npm run preview` | Предпросмотр сборки |
| `npm run lint` | Запуск ESLint |
| `npm run format` | Форматирование Prettier |

---

## CI/CD

Проект настроен на автоматический деплой через GitHub Pages при push в main/develop ветки.

---

**Документ:** README
