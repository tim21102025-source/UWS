// Утилиты расчёта стоимости окон
// Формула расчёта согласно docs/01-requirements_specification.md

import type {
    CalculatorConfig,
    ExtraOption,
    Glazing,
    Hardware,
    PriceBreakdown,
    Profile
} from './types';
import {
    EXTRA_OPTIONS,
    GLAZING_OPTIONS,
    HARDWARE_OPTIONS,
    PROFILES,
    SASH_COUNT
} from './types';

// Коэффициенты для разных типов конструкций
const TYPE_COEFFICIENTS: Record<string, number> = {
  single: 1.0,
  double: 1.0,
  triple: 1.0,
  balcony: 1.2,
  door: 1.5,
};

// Получить профиль по ID
export function getProfileById(id: string): Profile | undefined {
  return PROFILES.find(p => p.id === id);
}

// Получить стеклопакет по ID
export function getGlazingById(id: string): Glazing | undefined {
  return GLAZING_OPTIONS.find(g => g.id === id);
}

// Получить фурнитуру по ID
export function getHardwareById(id: string): Hardware | undefined {
  return HARDWARE_OPTIONS.find(h => h.id === id);
}

// Получить дополнительные опции по ID
export function getExtraOptionsByIds(ids: string[]): ExtraOption[] {
  return EXTRA_OPTIONS.filter(e => ids.includes(e.id));
}

// Расчёт количества створок
export function getSashCount(windowType: string): number {
  const count = SASH_COUNT[windowType as keyof typeof SASH_COUNT];
  return count || 1;
}

// Основная функция расчёта стоимости
export function calculatePrice(config: CalculatorConfig): PriceBreakdown {
  const { width, height, profileId, glazingId, hardwareId, extras, includeInstallation, windowType } = config;

  // Площадь в м² (ширина * высота в см / 10000)
  const area = (width * height) / 10000;

  // Стоимость профиля за м²
  const profile = getProfileById(profileId);
  const profilePrice = profile?.pricePerSqm || 0;

  // Стоимость стеклопакета за м²
  const glazing = getGlazingById(glazingId);
  const glazingPrice = glazing?.pricePerSqm || 0;

  // Коэффициент типа конструкции
  const typeCoefficient = TYPE_COEFFICIENTS[windowType] || 1.0;

  // Базовая стоимость: WIDTH × HEIGHT × 0.01 × PROFILE_PRICE × GLAZING_COEFFICIENT × TYPE
  const basePrice = area * profilePrice * (glazingPrice / 2000) * typeCoefficient;

  // Стоимость фурнитуры
  const sashCount = getSashCount(windowType);
  const hardware = getHardwareById(hardwareId);
  const hardwareCost = sashCount * (hardware?.pricePerSash || 0);

  // Стоимость дополнительных опций
  const selectedExtras = getExtraOptionsByIds(extras);
  const extrasCost = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  // Промежуточный итог
  const subtotal = basePrice + hardwareCost + extrasCost;

  // Стоимость монтажа (+15% если выбрано)
  const installationCost = includeInstallation ? subtotal * 0.15 : 0;

  // Коэффициент отходов (10%)
  const wasteFactor = subtotal * 0.1;

  // Общая стоимость
  const totalPrice = subtotal + installationCost + wasteFactor;

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    area: Math.round(area * 100) / 100,
    profilePrice,
    glazingPrice,
    hardwareCost: Math.round(hardwareCost * 100) / 100,
    sashCount,
    extrasCost,
    installationCost: Math.round(installationCost * 100) / 100,
    wasteFactor: Math.round(wasteFactor * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
}

// Форматирование цены в гривны
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Валидация размеров
export function validateDimensions(width: number, height: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (width < 30 || width > 300) {
    errors.push('Ширина должна быть от 30 до 300 см');
  }
  
  if (height < 30 || height > 300) {
    errors.push('Высота должна быть от 30 до 300 см');
  }
  
  if (width <= 0 || height <= 0) {
    errors.push('Размеры должны быть положительными числами');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Генерация уникального ID для истории
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Сохранение истории в localStorage
export function saveToHistory(
  config: CalculatorConfig, 
  breakdown: PriceBreakdown
): void {
  const history = getHistory();
  
  const newItem = {
    id: generateId(),
    date: new Date().toISOString(),
    config,
    totalPrice: breakdown.totalPrice,
    breakdown,
  };
  
  history.unshift(newItem);
  
  if (history.length > 20) {
    history.pop();
  }
  
  localStorage.setItem('uws-calculator-history', JSON.stringify(history));
}

// Получение истории из localStorage
export function getHistory(): Array<{
  id: string;
  date: string;
  config: CalculatorConfig;
  totalPrice: number;
  breakdown: PriceBreakdown;
}> {
  try {
    const saved = localStorage.getItem('uws-calculator-history');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Очистка истории
export function clearHistory(): void {
  localStorage.removeItem('uws-calculator-history');
}
