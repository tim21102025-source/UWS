/**
 * Window Calculator Component
 * 
 * Interactive window configuration calculator with real-time pricing.
 * 
 * @packageDocumentation
 */

import {
    Calculator,
    Check
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

// ============================================
// TYPES
// ============================================

export type WindowType = 'single' | 'double' | 'triple' | 'balcony' | 'door';

export type ProfileType = 'economy' | 'standard' | 'premium' | 'elite';

export type GlazingType = 'single' | 'double' | 'energy' | 'triple';

export type HardwareType = 'basic' | 'standard' | 'premium';

export interface WindowConfig {
  type: WindowType;
  width: number;
  height: number;
  profile: ProfileType;
  glazing: GlazingType;
  hardware: HardwareType;
  color: 'white' | 'laminate' | 'ral';
  mosquitoNet: boolean;
  sill: boolean;
  installation: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  profileExtra: number;
  glazingExtra: number;
  hardwareExtra: number;
  optionsExtra: number;
  installationExtra: number;
  total: number;
}

// ============================================
// CONSTANTS
// ============================================

const WINDOW_TYPES: { value: WindowType; label: string; icon: string; basePrice: number }[] = [
  { value: 'single', label: 'Одностворчатое', icon: '◰', basePrice: 2800 },
  { value: 'double', label: 'Двустворчатое', icon: '◱', basePrice: 4200 },
  { value: 'triple', label: 'Трёхстворчатое', icon: '█', basePrice: 5600 },
  { value: 'balcony', label: 'Балконный блок', icon: '🚪', basePrice: 6500 },
  { value: 'door', label: 'Входная дверь', icon: '🚪', basePrice: 12000 },
];

const PROFILES: { value: ProfileType; label: string; description: string; multiplier: number }[] = [
  { value: 'economy', label: 'Economy', description: '3 камеры, 60мм', multiplier: 1.0 },
  { value: 'standard', label: 'Standard', description: '5 камер, 70мм', multiplier: 1.25 },
  { value: 'premium', label: 'Premium', description: '6 камер, 80мм', multiplier: 1.5 },
  { value: 'elite', label: 'Elite', description: '7 камер, 86мм', multiplier: 1.8 },
];

const GLAZING_OPTIONS: { value: GlazingType; label: string; description: string; multiplier: number }[] = [
  { value: 'single', label: '1-камерный', description: '24мм', multiplier: 1.0 },
  { value: 'double', label: '2-камерный', description: '32мм', multiplier: 1.3 },
  { value: 'energy', label: 'Энергосберегающий', description: '40мм', multiplier: 1.6 },
  { value: 'triple', label: 'Тройной', description: '48мм Premium', multiplier: 2.0 },
];

const HARDWARE_OPTIONS: { value: HardwareType; label: string; description: string; multiplier: number }[] = [
  { value: 'basic', label: 'Basic', description: 'Elementis', multiplier: 1.0 },
  { value: 'standard', label: 'Standard', description: 'Siegenia TITAN', multiplier: 1.2 },
  { value: 'premium', label: 'Premium', description: 'Roto NT / MACO', multiplier: 1.5 },
];

const INSTALLATION_PRICE = 1500;

// ============================================
// HELPER FUNCTIONS
// ============================================

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// ============================================
// SUB-COMPONENTS
// ============================================

function WindowTypeSelector({ 
  selected, 
  onChange 
}: { 
  selected: WindowType; 
  onChange: (value: WindowType) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-dark-700">Тип конструкции</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {WINDOW_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200',
              'flex flex-col items-center gap-2',
              selected === type.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-dark-200 hover:border-primary-300 bg-white'
            )}
          >
            <span className="text-2xl">{type.icon}</span>
            <span className={cn(
              'text-sm font-medium',
              selected === type.value ? 'text-primary-600' : 'text-dark-600'
            )}>
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DimensionsInput({ 
  width, 
  height, 
  onChange 
}: { 
  width: number; 
  height: number; 
  onChange: (dimension: 'width' | 'height', value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-dark-700">Размеры (см)</label>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs text-dark-500 mb-1">Ширина</label>
          <div className="relative">
            <input
              type="number"
              min="30"
              max="300"
              value={width}
              onChange={(e) => onChange('width', Math.max(30, Math.min(300, parseInt(e.target.value) || 30)))}
              className="w-full h-12 px-4 rounded-lg border border-dark-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">см</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-dark-500 mb-1">Высота</label>
          <div className="relative">
            <input
              type="number"
              min="30"
              max="300"
              value={height}
              onChange={(e) => onChange('height', Math.max(30, Math.min(300, parseInt(e.target.value) || 30)))}
              className="w-full h-12 px-4 rounded-lg border border-dark-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">см</span>
          </div>
        </div>
      </div>
      <div className="p-3 bg-dark-50 rounded-lg">
        <span className="text-sm text-dark-600">Площадь: </span>
        <span className="text-sm font-medium text-dark-900">{(width * height / 10000).toFixed(2)} м²</span>
      </div>
    </div>
  );
}

function OptionSelector<T extends string>({
  title,
  options,
  selected,
  onChange,
  descriptionKey = 'description',
}: {
  title: string;
  options: { value: T; label: string; description: string; multiplier: number }[];
  selected: T;
  onChange: (value: T) => void;
  descriptionKey?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-dark-700">{title}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'w-full p-4 rounded-lg border-2 transition-all duration-200',
              'flex items-center justify-between',
              selected === option.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-dark-200 hover:border-primary-300 bg-white'
            )}
          >
            <div className="text-left">
              <span className={cn(
                'block font-medium',
                selected === option.value ? 'text-primary-600' : 'text-dark-800'
              )}>
                {option.label}
              </span>
              <span className="text-sm text-dark-500">{option.description}</span>
            </div>
            {selected === option.value && (
              <Check className="w-5 h-5 text-primary-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleOption({
  title,
  description,
  checked,
  onChange,
  price,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  price?: number;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'w-full p-4 rounded-lg border-2 transition-all duration-200',
        'flex items-center justify-between',
        checked
          ? 'border-primary-500 bg-primary-50'
          : 'border-dark-200 hover:border-primary-300 bg-white'
      )}
    >
      <div className="text-left">
        <span className={cn('block font-medium', checked ? 'text-primary-600' : 'text-dark-800')}>
          {title}
        </span>
        {description && (
          <span className="text-sm text-dark-500">{description}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {price && (
          <span className={cn('text-sm font-medium', checked ? 'text-primary-600' : 'text-dark-600')}>
            +{formatPrice(price)}
          </span>
        )}
        <div className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center',
          checked ? 'border-primary-500 bg-primary-500' : 'border-dark-300'
        )}>
          {checked && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * WindowCalculator - Interactive window configuration and pricing
 * 
 * @example
 * ```tsx
 * <WindowCalculator onSubmit={(config) => console.log(config)} />
 * ```
 */
export function WindowCalculator({ onSubmit }: { onSubmit?: (config: WindowConfig) => void }) {
  const [config, setConfig] = useState<WindowConfig>({
    type: 'double',
    width: 150,
    height: 150,
    profile: 'standard',
    glazing: 'double',
    hardware: 'standard',
    color: 'white',
    mosquitoNet: false,
    sill: false,
    installation: true,
  });

  // Calculate price breakdown
  const breakdown = useMemo((): PriceBreakdown => {
    const windowType = WINDOW_TYPES.find(t => t.value === config.type);
    const profile = PROFILES.find(p => p.value === config.profile);
    const glazing = GLAZING_OPTIONS.find(g => g.value === config.glazing);
    const hardware = HARDWARE_OPTIONS.find(h => h.value === config.hardware);

    const basePrice = windowType?.basePrice || 0;
    const area = (config.width * config.height) / 10000;
    
    const profileExtra = (profile?.multiplier || 1) * area * 1000;
    const glazingExtra = (glazing?.multiplier || 1) * area * 800;
    const hardwareExtra = (hardware?.multiplier || 1) * area * 400;
    
    const optionsExtra = 
      (config.mosquitoNet ? area * 600 : 0) +
      (config.sill ? config.width / 100 * 800 : 0);
    
    const installationExtra = config.installation ? INSTALLATION_PRICE + area * 400 : 0;

    const total = basePrice + profileExtra + glazingExtra + hardwareExtra + optionsExtra + installationExtra;

    return {
      basePrice,
      profileExtra,
      glazingExtra,
      hardwareExtra,
      optionsExtra,
      installationExtra,
      total,
    };
  }, [config]);

  const handleSubmit = useCallback(() => {
    onSubmit?.(config);
  }, [config, onSubmit]);

  const updateConfig = useCallback((updates: Partial<WindowConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
          <Calculator className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-3xl font-bold text-dark-900 mb-2">Калькулятор окон</h2>
        <p className="text-dark-600">Рассчитайте стоимость остекления за 2 минуты</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Configuration */}
        <div className="space-y-8">
          {/* Window Type */}
          <WindowTypeSelector
            selected={config.type}
            onChange={(value) => updateConfig({ type: value })}
          />

          {/* Dimensions */}
          <DimensionsInput
            width={config.width}
            height={config.height}
            onChange={(dim, value) => updateConfig({ [dim]: value })}
          />

          {/* Profile */}
          <OptionSelector
            title="Профильная система"
            options={PROFILES}
            selected={config.profile}
            onChange={(value) => updateConfig({ profile: value })}
          />

          {/* Glazing */}
          <OptionSelector
            title="Стеклопакет"
            options={GLAZING_OPTIONS}
            selected={config.glazing}
            onChange={(value) => updateConfig({ glazing: value })}
          />

          {/* Hardware */}
          <OptionSelector
            title="Фурнитура"
            options={HARDWARE_OPTIONS}
            selected={config.hardware}
            onChange={(value) => updateConfig({ hardware: value })}
          />

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-dark-700">Дополнительные опции</label>
            <ToggleOption
              title="Москитная сетка"
              description="Защита от насекомых"
              checked={config.mosquitoNet}
              onChange={(checked) => updateConfig({ mosquitoNet: checked })}
            />
            <ToggleOption
              title="Подоконник"
              description="ПВХ подоконник 200мм"
              checked={config.sill}
              onChange={(checked) => updateConfig({ sill: checked })}
              price={Math.round(config.width / 100 * 800)}
            />
            <ToggleOption
              title="Монтаж"
              description="Профессиональная установка"
              checked={config.installation}
              onChange={(checked) => updateConfig({ installation: checked })}
              price={INSTALLATION_PRICE + (config.width * config.height / 10000) * 400}
            />
          </div>
        </div>

        {/* Right Panel - Summary */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-2xl shadow-lg border border-dark-200 overflow-hidden">
            {/* Visual Preview */}
            <div className="p-6 bg-gradient-to-br from-dark-50 to-dark-100">
              <div className="aspect-video bg-white rounded-xl shadow-inner flex items-center justify-center">
                <div 
                  className="bg-primary-100 border-4 border-primary-300 rounded-lg relative overflow-hidden"
                  style={{ width: '60%', height: '70%' }}
                >
                  {/* Window frame simulation */}
                  <div className="absolute inset-2 border-2 border-primary-400 bg-white rounded">
                    {config.type === 'double' && (
                      <>
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-primary-300" />
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary-300" />
                      </>
                    )}
                    {config.type === 'triple' && (
                      <>
                        <div className="absolute inset-y-0 left-1/3 w-0.5 bg-primary-300" />
                        <div className="absolute inset-y-0 right-1/3 w-0.5 bg-primary-300" />
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary-300" />
                      </>
                    )}
                  </div>
                  <span className="absolute bottom-2 right-2 text-xs text-primary-400">
                    {config.width} × {config.height} см
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-dark-900">Стоимость</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-600">Базовая цена</span>
                  <span className="text-dark-900">{formatPrice(breakdown.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-600">Профиль ({config.profile})</span>
                  <span className="text-dark-900">+{formatPrice(breakdown.profileExtra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-600">Стеклопакет ({config.glazing})</span>
                  <span className="text-dark-900">+{formatPrice(breakdown.glazingExtra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-600">Фурнитура ({config.hardware})</span>
                  <span className="text-dark-900">+{formatPrice(breakdown.hardwareExtra)}</span>
                </div>
                {breakdown.optionsExtra > 0 && (
                  <div className="flex justify-between">
                    <span className="text-dark-600">Доп. опции</span>
                    <span className="text-dark-900">+{formatPrice(breakdown.optionsExtra)}</span>
                  </div>
                )}
                {breakdown.installationExtra > 0 && (
                  <div className="flex justify-between">
                    <span className="text-dark-600">Монтаж</span>
                    <span className="text-dark-900">+{formatPrice(breakdown.installationExtra)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-dark-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-dark-900">Итого</span>
                  <span className="text-3xl font-bold text-primary-500">{formatPrice(breakdown.total)}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-6 bg-dark-50 border-t border-dark-200">
              <button
                onClick={handleSubmit}
                className="w-full h-14 bg-primary-500 hover:bg-primary-600 text-dark-900 font-semibold rounded-xl transition-colors"
              >
                Оставить заявку на расчёт
              </button>
              <p className="text-center text-sm text-dark-500 mt-3">
                Бесплатный замер в пределах Киева
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default WindowCalculator;
