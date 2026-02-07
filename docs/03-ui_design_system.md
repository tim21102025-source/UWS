# UI Дизайн-система: Веб-сайт UWS

**Версия:** 1.0  
**Дата:** 2026-02-06

---

## 1. Цветовая палитра

### 1.1 Основные цвета

| Цвет | HEX | RGB | Использование |
|------|-----|-----|---------------|
| Brand Yellow | #FEB900 | 254, 185, 0 | CTA, акценты |
| Brand Dark | #1A252B | 26, 37, 43 | Текст, фон |
| Brand Gray | #52565E | 82, 86, 94 | Вторичный |

### 1.2 Семантические цвета

| Цвет | HEX | Назначение |
|------|-----|------------|
| Success | #28A745 | Успех |
| Error | #DC3545 | Ошибки |
| Warning | #FFC107 | Предупреждения |
| Info | #17A2B8 | Информация |

### 1.3 Тёмная тема

```css
.dark {
  --bg-primary: #1A252B;
  --bg-secondary: #2D3A42;
  --text-primary: #F8F9FA;
  --text-secondary: #CED4DA;
}
```

---

## 2. Типографика

### 2.1 Шрифты

| Семья | Файл | Назначение |
|-------|------|------------|
| Inter | Inter-*.woff2 | Body text |
| Roboto | Roboto-*.woff2 | Headings |

### 2.2 Размеры

| Элемент | Размер | Вес | Line-height |
|---------|--------|-----|-------------|
| Display LG | 3.5rem | 700 | 1.1 |
| Display MD | 2.5rem | 700 | 1.2 |
| H1 | 2rem | 700 | 1.25 |
| H2 | 1.75rem | 600 | 1.3 |
| H3 | 1.5rem | 600 | 1.35 |
| Body | 1rem | 400 | 1.5 |
| Caption | 0.875rem | 400 | 1.4 |

---

## 3. UI Компоненты

### 3.1 Button

```astro
<Button variant="primary" size="md">Текст</Button>
<Button variant="secondary">Текст</Button>
<Button variant="outline">Текст</Button>
```

| Variant | Описание |
|---------|----------|
| primary | Жёлтый фон, тёмный текст |
| secondary | Серый фон |
| outline | Прозрачный с рамкой |

### 3.2 Card

```astro
<Card hover>Контент</Card>
```

### 3.3 Form Inputs

```astro
<Input label="Имя" id="name" required />
<Select label="Услуга" options={services} />
<Textarea label="Сообщение" />
```

---

## 4. Адаптивность

### 4.1 Breakpoints

| Breakpoint | Ширина | Устройства |
|------------|--------|------------|
| xs | < 576px | Телефоны |
| sm | ≥ 576px | Большие телефоны |
| md | ≥ 768px | Планшеты |
| lg | ≥ 992px | Ноутбуки |
| xl | ≥ 1200px | Десктопы |
| 2xl | ≥ 1400px | Большие десктопы |

### 4.2 Mobile-first подход

```css
/* Base styles (mobile) */
.card { padding: 1rem; }

/* md breakpoint */
@media (min-width: 768px) {
  .card { padding: 1.5rem; }
}
```

---

## 5. Анимации

### 5.1 Keyframe анимации

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### 5.2 Utility классы

| Класс | Описание |
|-------|----------|
| `animate-fade-in` | Появление |
| `animate-slide-up` | Слайд вверх |
| `hover:scale-105` | Увеличение при hover |

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 6. Доступность (WCAG 2.1 AA)

### 6.1 Контрастность

- Текст на фоне: ≥ 4.5:1
- Крупный текст: ≥ 3:1
- UI компоненты: ≥ 3:1

### 6.2 Фокус

```css
:focus-visible {
  outline: 2px solid #FEB900;
  outline-offset: 2px;
}
```

### 6.3 ARIA атрибуты

```astro
<button aria-expanded="false">Меню</button>
<input aria-invalid="false" />
<div role="alert">Ошибка</div>
```

---

## 7. Светлая/тёмная тема

### 7.1 Toggle компонент

```astro
<ThemeToggle />
```

### 7.2 CSS переменные

```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --text-primary: #1A252B;
}

.dark {
  --bg-primary: #1A252B;
  --bg-secondary: #2D3A42;
  --text-primary: #F8F9FA;
}
```

---

**Документ:** UI Дизайн-система  
**Часть:** 03-ui_design_system.md
