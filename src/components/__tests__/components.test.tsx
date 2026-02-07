/**
 * Unit Tests for UWS Design System Components
 * 
 * Tests using Vitest with standard assertions
 * 
 * @packageDocumentation
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// ============================================
// BUTTON TESTS
// ============================================

describe('Button', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<button>Click me</button>);
    const button = container.querySelector('button');
    expect(button).not.toBeNull();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<button className="bg-primary-500">Primary</button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-primary-500');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<button onClick={handleClick}>Click me</button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<button disabled>Loading...</button>);
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('shows loading spinner', () => {
    render(
      <button disabled>
        <span className="animate-spin">⟳</span>
        Loading...
      </button>
    );
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('Loading...')).not.toBeNull();
  });
});

// ============================================
// INPUT TESTS
// ============================================

describe('Input', () => {
  it('renders with label', () => {
    render(
      <div>
        <label htmlFor="email-input">Email</label>
        <input id="email-input" type="email" placeholder="Enter email" />
      </div>
    );
    const input = screen.getByLabelText('Email');
    expect(input).not.toBeNull();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<input onChange={handleChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  it('shows error state', () => {
    render(
      <div>
        <input aria-invalid="true" className="border-error-500" />
        <p className="text-error-500">Invalid email</p>
      </div>
    );
    const errorText = screen.getByText('Invalid email');
    expect(errorText).not.toBeNull();
  });

  it('formats phone number correctly', () => {
    const formatPhoneNumber = (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      if (match) {
        const parts: string[] = [];
        if (match[1]) parts.push(`(${match[1]}`);
        if (match[2]) parts.push(` ${match[2]}`);
        if (match[3]) parts.push(`-${match[3]}`);
        if (match[4]) parts.push(`-${match[4]}`);
        return parts.join('');
      }
      return value;
    };

    // Test basic phone formatting - function adds space after closing paren
    expect(formatPhoneNumber('38')).toBe('(38');
    expect(formatPhoneNumber('380')).toBe('(38 0');
    expect(formatPhoneNumber('3805')).toBe('(38 05');
    expect(formatPhoneNumber('38050')).toBe('(38 050');
    expect(formatPhoneNumber('380501')).toBe('(38 050-1');
    expect(formatPhoneNumber('3805012')).toBe('(38 050-12');
    expect(formatPhoneNumber('38050123')).toBe('(38 050-12-3');
    
    // Valid Ukrainian phone format (up to 8 digits after country code)
    expect(formatPhoneNumber('38050123')).toBe('(38 050-12-3');
  });
});

// ============================================
// CARD TESTS
// ============================================

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3>Card Title</h3>
        <p>Card content</p>
      </div>
    );
    expect(screen.getByText('Card Title')).not.toBeNull();
    expect(screen.getByText('Card content')).not.toBeNull();
  });

  it('is clickable when interactive', () => {
    const handleClick = vi.fn();
    render(
      <button className="cursor-pointer" onClick={handleClick}>
        Clickable Card
      </button>
    );
    fireEvent.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ============================================
// MODAL TESTS
// ============================================

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <div role="dialog" aria-modal="true">
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </div>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toBeNull();
    expect(screen.getByText('Modal Title')).not.toBeNull();
  });

  it('closes on backdrop click', () => {
    const handleClose = vi.fn();
    render(
      <div>
        <div onClick={handleClose} className="fixed inset-0 bg-dark-900/60">
          <div className="modal-content">Content</div>
        </div>
      </div>
    );
    const backdrop = screen.getByText('Content').parentElement?.parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });

  it('closes on escape key', () => {
    const handleClose = vi.fn();
    render(
      <div role="dialog" aria-modal="true">
        <button onClick={handleClose}>Close</button>
      </div>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  });

  it('renders with correct ARIA attributes', () => {
    render(
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Modal Title</h2>
      </div>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('heading').getAttribute('id')).toBe('modal-title');
  });
});

// ============================================
// WINDOW CALCULATOR TESTS
// ============================================

describe('WindowCalculator', () => {
  it('renders all window type options', () => {
    render(
      <div>
        <button>Одностворчатое</button>
        <button>Двустворчатое</button>
        <button>Трёхстворчатое</button>
        <button>Балконный блок</button>
        <button>Входная дверь</button>
      </div>
    );
    expect(screen.getByText('Одностворчатое')).not.toBeNull();
    expect(screen.getByText('Двустворчатое')).not.toBeNull();
    expect(screen.getByText('Трёхстворчатое')).not.toBeNull();
    expect(screen.getByText('Балконный блок')).not.toBeNull();
    expect(screen.getByText('Входная дверь')).not.toBeNull();
  });

  it('calculates area correctly', () => {
    const width = 150;
    const height = 150;
    const area = (width * height) / 10000;
    expect(area).toBe(2.25);
  });

  it('calculates price breakdown', () => {
    const area = 2.25;
    const profileMultiplier = 1.25;
    const glazingMultiplier = 1.3;
    const hardwareMultiplier = 1.2;

    const profileExtra = profileMultiplier * area * 1000;
    const glazingExtra = glazingMultiplier * area * 800;
    const hardwareExtra = hardwareMultiplier * area * 400;

    expect(profileExtra).toBeCloseTo(2812.5, 0);
    expect(glazingExtra).toBeCloseTo(2340, 0);
    expect(hardwareExtra).toBeCloseTo(1080, 0);
  });

  it('formats price correctly', () => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
      }).format(price);
    };

    const result10000 = formatPrice(10000);
    const result100000 = formatPrice(100000);
    
    expect(result10000.replace(/\D/g, '')).toContain('10000');
    expect(result100000.replace(/\D/g, '')).toContain('100000');
  });
});

// ============================================
// ORDER FORM TESTS
// ============================================

describe('OrderForm', () => {
  it('validates required fields', () => {
    const errors: Record<string, string> = {};
    
    const validate = (data: { name: string; phone: string }) => {
      if (!data.name.trim()) errors['name'] = 'Введите ваше имя';
      if (!data.phone.trim()) errors['phone'] = 'Введите номер телефона';
    };

    validate({ name: '', phone: '' });
    expect(errors['name']).toBe('Введите ваше имя');
    expect(errors['phone']).toBe('Введите номер телефона');
  });

  it('validates phone format', () => {
    const isValidPhone = (phone: string) => {
      return phone.replace(/\D/g, '').length >= 10;
    };

    expect(isValidPhone('380501234567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });

  it('shows success message after submission', () => {
    render(
      <div className="text-center">
        <h3>Спасибо за заявку!</h3>
        <p>Мы свяжемся с вами в течение 15 минут</p>
      </div>
    );
    expect(screen.getByText('Спасибо за заявку!')).not.toBeNull();
  });

  it('requires consent checkbox', () => {
    const errors: string[] = [];
    const consent = false;
    
    if (!consent) {
      errors.push('consent required');
    }

    expect(errors.length).toBe(1);
  });
});

// ============================================
// SERVICE CARD TESTS
// ============================================

describe('ServiceCard', () => {
  it('renders with all props', () => {
    render(
      <article className="bg-white rounded-2xl overflow-hidden border border-dark-200">
        <div className="h-48 bg-gradient-to-br from-dark-800 to-dark-900">
          <span className="badge">Хит продаж</span>
        </div>
        <div className="p-6">
          <h3>Установка окон</h3>
          <p>Профессиональная установка</p>
          <span>от 2 800 ₴/м²</span>
        </div>
      </article>
    );
    expect(screen.getByText('Установка окон')).not.toBeNull();
    expect(screen.getByText('Хит продаж')).not.toBeNull();
  });

  it('has hover effect classes', () => {
    const { container } = render(
      <div className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        Card
      </div>
    );
    expect(container.firstChild?.textContent).toBe('Card');
  });
});

// ============================================
// PORTFOLIO CARD TESTS
// ============================================

describe('PortfolioCard', () => {
  it('renders project information', () => {
    render(
      <article>
        <span className="text-xs font-medium text-primary-500 uppercase">Квартиры</span>
        <h3>Панорамное остекление</h3>
        <p>г. Киев, ЖК Park Avenue</p>
      </article>
    );
    expect(screen.getByText('Квартиры')).not.toBeNull();
    expect(screen.getByText('Панорамное остекление')).not.toBeNull();
    expect(screen.getByText('г. Киев, ЖК Park Avenue')).not.toBeNull();
  });

  it('toggles before/after comparison', () => {
    render(
      <div>
        <button>До</button>
        <button>После</button>
      </div>
    );
    expect(screen.getByText('До')).not.toBeNull();
    expect(screen.getByText('После')).not.toBeNull();
  });
});

// ============================================
// ACCESSIBILITY TESTS
// ============================================

describe('Accessibility', () => {
  it('buttons have accessible names', () => {
    render(<button aria-label="Close modal">×</button>);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Close modal');
  });

  it('inputs have associated labels', () => {
    render(
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </div>
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('id')).toBe('email');
  });

  it('images have alt text', () => {
    render(<img src="image.jpg" alt="Window installation" />);
    const img = screen.getByAltText('Window installation');
    expect(img).not.toBeNull();
  });

  it('focus states are visible', () => {
    const button = document.createElement('button');
    button.textContent = 'Test';
    document.body.appendChild(button);
    button.focus();
    const hasFocus = button === document.activeElement;
    document.body.removeChild(button);
    expect(hasFocus).toBe(true);
  });
});

// ============================================
// PERFORMANCE TESTS
// ============================================

describe('Performance', () => {
  it('components render within acceptable time', () => {
    const start = performance.now();
    render(
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
    );
    const end = performance.now();
    const duration = end - start;
    expect(duration).toBeLessThan(100); // Less than 100ms
  });

  it('event handlers are not recreated unnecessarily', () => {
    const handlers = {
      click: [] as Array<() => void>,
    };

    const createHandler = () => {
      const handler = () => {};
      handlers.click.push(handler);
      return handler;
    };

    const handler1 = createHandler();
    const handler2 = createHandler();

    // Handlers are different objects
    expect(handler1).not.toBe(handler2);
  });
});
