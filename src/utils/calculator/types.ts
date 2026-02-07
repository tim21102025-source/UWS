// Типы для калькулятора окон UWS
// Согласно docs/01-requirements_specification.md

// Типы конструкций
export type WindowType = 
  | 'single'      // Одностворчатое окно
  | 'double'      // Двустворчатое окно
  | 'triple'      // Трёхстворчатое окно
  | 'balcony'     // Балконный блок
  | 'door';       // Входная дверь ПВХ

// Профильные системы
export interface Profile {
  id: string;
  name: string;
  cameras: number;
  width: number; // мм
  pricePerSqm: number; // грн/м²
  description: string;
}

export const PROFILES: Profile[] = [
  { id: 'economy', name: 'Economy', cameras: 3, width: 60, pricePerSqm: 2800, description: 'Бюджетный вариант' },
  { id: 'standard', name: 'Standard', cameras: 5, width: 70, pricePerSqm: 3500, description: 'Оптимальный выбор' },
  { id: 'premium', name: 'Premium', cameras: 6, width: 80, pricePerSqm: 4200, description: 'Премиум качество' },
  { id: 'elite', name: 'Elite', cameras: 7, width: 86, pricePerSqm: 5000, description: 'Элитный профиль' },
];

// Стеклопакеты
export interface Glazing {
  id: string;
  name: string;
  thickness: number; // мм
  pricePerSqm: number; // грн/м²
  description: string;
}

export const GLAZING_OPTIONS: Glazing[] = [
  { id: 'single', name: '1-камерный', thickness: 24, pricePerSqm: 1900, description: 'Базовый вариант' },
  { id: 'double', name: '2-камерный', thickness: 32, pricePerSqm: 2400, description: 'Стандарт' },
  { id: 'energy', name: 'Энергосберегающий', thickness: 40, pricePerSqm: 3100, description: 'Максимальная теплоизоляция' },
];

// Фурнитура
export interface Hardware {
  id: string;
  name: string;
  brand: string;
  class: 'Economy' | 'Standard' | 'Premium';
  pricePerSash: number; // грн/створка
  description: string;
}

export const HARDWARE_OPTIONS: Hardware[] = [
  { id: ' roto', name: 'Roto NT', brand: 'Roto', class: 'Premium', pricePerSash: 2800, description: 'Немецкое качество' },
  { id: 'maco', name: 'MACO', brand: 'MACO', class: 'Premium', pricePerSash: 2600, description: 'Австрийская надежность' },
  { id: 'siegenia', name: 'Siegenia TITAN', brand: 'Siegenia', class: 'Standard', pricePerSash: 2000, description: 'Немецкая инженерия' },
  { id: 'elementis', name: 'Elementis', brand: 'Elementis', class: 'Economy', pricePerSash: 1500, description: 'Доступное качество' },
];

// Дополнительные опции
export interface ExtraOption {
  id: string;
  name: string;
  price: number; // грн
  description: string;
}

export const EXTRA_OPTIONS: ExtraOption[] = [
  { id: 'vent', name: 'Вентиляционный клапан', price: 1800, description: 'Приточный клапан для проветривания' },
  { id: 'child-lock', name: 'Детский замок', price: 850, description: 'Защита от открытия детьми' },
  { id: 'limit', name: 'Ограничитель открывания', price: 650, description: 'Фиксация угла открытия' },
  { id: 'anti-burglary', name: 'Противовзломная фурнитура', price: 3500, description: 'Повышенная безопасность' },
];

// Конфигурация калькулятора
export interface CalculatorConfig {
  windowType: WindowType;
  width: number; // см
  height: number; // см
  profileId: string;
  glazingId: string;
  hardwareId: string;
  extras: string[]; // массив id дополнительных опций
  includeInstallation: boolean;
}

// История расчётов
export interface CalculationHistory {
  id: string;
  date: string;
  config: CalculatorConfig;
  totalPrice: number;
  breakdown: PriceBreakdown;
}

// Детализация стоимости
export interface PriceBreakdown {
  basePrice: number;
  area: number;
  profilePrice: number;
  glazingPrice: number;
  hardwareCost: number;
  sashCount: number;
  extrasCost: number;
  installationCost: number;
  wasteFactor: number;
  totalPrice: number;
}

// Отображение типов конструкций
export const WINDOW_TYPE_LABELS: Record<WindowType, string> = {
  single: 'Одностворчатое окно',
  double: 'Двустворчатое окно',
  triple: 'Трёхстворчатое окно',
  balcony: 'Балконный блок',
  door: 'Входная дверь ПВХ',
};

// Количество створок по типу
export const SASH_COUNT: Record<WindowType, number> = {
  single: 1,
  double: 2,
  triple: 3,
  balcony: 2,
  door: 1,
};
