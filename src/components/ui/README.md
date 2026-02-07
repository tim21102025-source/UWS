# UI Components Library

Библиотека UI компонентов для проекта UWS (uws.com.ua), разработанная согласно [UI Design System](../../docs/03-ui_design_system.md).

## Установка

Все компоненты доступны в папке `src/components/ui/`:

```astro
---
import { Button, Card, Input } from '@/components/ui';
---
```

## Компоненты

### Button

Универсальная кнопка с多种 вариантами стиля и размера.

```astro
<Button variant="primary" size="md">Нажми меня</Button>
<Button variant="outline" disabled>Отключена</Button>
<Button variant="secondary" loading>Загрузка...</Button>
<Button href="/link" variant="primary">Ссылка-кнопка</Button>
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Вариант стиля |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер кнопки |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Тип элемента |
| `href` | `string` | - | Превращает в ссылку |
| `disabled` | `boolean` | `false` | Отключенное состояние |
| `loading` | `boolean` | `false` | Состояние загрузки |
| `fullWidth` | `boolean` | `false` | Полная ширина |

---

### Icon

SVG иконки на основе Heroicons.

```astro
<Icon name="home" size="md" />
<Icon name="arrow-right" size="lg" class="text-brand-yellow" />
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `name` | `IconName` | - | Имя иконки (обязательный) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Размер |
| `class` | `string` | - | Дополнительные классы |

**Доступные иконки:** `home`, `menu`, `x`, `chevron-right`, `chevron-left`, `chevron-down`, `chevron-up`, `plus`, `minus`, `check`, `phone`, `envelope`, `map-pin`, `clock`, `calendar`, `user`, `users`, и многие другие (100+ иконок).

---

### Badge

Компонент для отображения статусов и меток.

```astro
<Badge variant="success">Успех</Badge>
<Badge variant="error" size="sm">Ошибка</Badge>
<Badge variant="warning" rounded>Предупреждение</Badge>
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Вариант цвета |
| `size` | `'sm' \| 'md'` | `'md'` | Размер |
| `rounded` | `boolean` | `true` | Скруглённые углы |

---

### Card

Базовый карточный контейнер.

```astro
<Card variant="elevated" hover="lift">
  Контент карточки
</Card>

<Card variant="bordered">
  <Card.Header>Заголовок</Card.Header>
  <Card.Body>Контент</Card.Body>
  <Card.Footer>Футер</Card.Footer>
</Card>
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'default' \| 'bordered' \| 'elevated'` | `'default'` | Вариант стиля |
| `hover` | `'none' \| 'lift' \| 'scale'` | `'none'` | Hover эффект |

---

### Input

Поле ввода с поддержкой валидации.

```astro
<Input label="Имя" id="name" required />
<Input type="email" label="Email" error="Некорректный email" />
<Input label="Поиск" placeholder="Введите запрос..." />
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `type` | `'text' \| 'email' \| 'tel' \| 'password' \| 'number'` | `'text'` | Тип input |
| `label` | `string` | - | Лейбл поля |
| `required` | `boolean` | `false` | Обязательное поле |
| `disabled` | `boolean` | `false` | Отключенное состояние |
| `error` | `string` | - | Текст ошибки |
| `helpText` | `string` | - | Подсказка под полем |

---

### Select

Выпадающий список.

```astro
<Select 
  label="Выберите услугу" 
  options={[
    { value: '1', label: 'Услуга 1' },
    { value: '2', label: 'Услуга 2' },
  ]} 
/>
<Select label="Multiple" options={options} multiple />
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `options` | `Option[]` | - | Массив опций |
| `multiple` | `boolean` | `false` | Множественный выбор |
| `required` | `boolean` | `false` | Обязательное поле |
| `error` | `string` | - | Текст ошибки |

---

### Textarea

Многострочное поле ввода.

```astro
<Textarea label="Сообщение" rows={4} />
<Textarea label="Комментарий" maxLength={500} showCount />
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `rows` | `number` | `4` | Количество строк |
| `maxLength` | `number` | - | Максимум символов |
| `showCount` | `boolean` | `false` | Показать счётчик |
| `resize` | `boolean \| 'none' \| 'both' \| 'horizontal' \| 'vertical'` | `true` | Изменение размера |

---

### Modal

Модальное окно.

```astro
<Modal open={showModal} title="Заголовок" onClose={() => setShowModal(false)}>
  Контент модального окна
  <div slot="footer">
    <Button variant="secondary">Отмена</Button>
    <Button>Подтвердить</Button>
  </div>
</Modal>
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `open` | `boolean` | `false` | Открыто ли окно |
| `title` | `string` | - | Заголовок |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Размер |
| `showClose` | `boolean` | `true` | Показать кнопку X |

---

### Accordion

Раскрывающаяся панель.

```astro
<Accordion 
  items={[
    { id: '1', title: 'Вопрос 1', content: 'Ответ 1' },
    { id: '2', title: 'Вопрос 2', content: 'Ответ 2' },
  ]}
  multiple
/>
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `items` | `AccordionItem[]` | - | Массив элементов |
| `multiple` | `boolean` | `false` | Несколько открытых |
| `variant` | `'default' \| 'bordered'` | `'default'` | Вариант стиля |

---

### Tabs

Компонент табов.

```astro
<Tabs
  tabs={[
    { id: 'tab1', label: 'Таб 1', content: 'Контент 1' },
    { id: 'tab2', label: 'Таб 2', content: 'Контент 2' },
  ]}
  defaultTab="tab1"
  variant="underline"
/>
```

**Props:**
| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `tabs` | `Tab[]` | - | Массив табов |
| `defaultTab` | `string` | - | ID таба по умолчанию |
| `variant` | `'default' \| 'pills' \| 'underline'` | `'underline'` | Вариант стиля |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Выравнивание |

---

## Accessibility

Все компоненты следуют рекомендациям WCAG 2.1 AA:
- Корректные `aria-*` атрибуты
- Focus styles для навигации с клавиатуры
- Semantic HTML структура
- Достаточный контраст цветов

## Темизация

Компоненты поддерживают светлую и тёмную тему:

```css
.dark {
  --bg-primary: #1A252B;
  --bg-secondary: #2D3A42;
  --text-primary: #F8F9FA;
  --text-secondary: #CED4DA;
}
```

## Storybook

Для визуального тестирования компонентов используйте Storybook (опционально).

```bash
npm run storybook
```
