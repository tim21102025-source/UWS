/**
 * Order Form Component
 * 
 * Contact form for requesting measurement or consultation.
 * 
 * @packageDocumentation
 */

import { CheckCircle, Clock, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';

// ============================================
// TYPES
// ============================================

export interface OrderFormData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  address?: string;
  comment?: string;
  consent: boolean;
}

export interface OrderFormProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: OrderFormData) => void;
  compact?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (match) {
    const parts: string[] = [];
    if (match[1]) parts.push(`(${match[1]}`);
    if (match[2]) parts.push(`) ${match[2]}`);
    if (match[3]) parts.push(`-${match[3]}`);
    if (match[4]) parts.push(`-${match[4]}`);
    return parts.join('');
  }
  return value;
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * OrderForm - Contact form for measurement requests
 * 
 * @example
 * ```tsx
 * <OrderForm onSubmit={(data) => console.log(data)} />
 * ```
 */
export function OrderForm({ 
  title = 'Заказать бесплатный замер', 
  subtitle,
  onSubmit,
  compact = false,
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    service: '',
    address: '',
    comment: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const services = [
    { value: '', label: 'Выберите услугу' },
    { value: 'measurement', label: 'Замер и консультация' },
    { value: 'installation', label: 'Установка окон' },
    { value: 'repair', label: 'Ремонт окон' },
    { value: 'balcony', label: 'Балкон под ключ' },
    { value: 'other', label: 'Другое' },
  ];

  const validate = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    
    if (!formData.service) {
      newErrors.service = 'Выберите услугу';
    }
    
    if (!formData.consent) {
      newErrors.consent = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit?.(formData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleChange = (field: keyof OrderFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className={cn(
        'bg-white rounded-2xl shadow-lg p-8 text-center',
        compact ? 'max-w-md mx-auto' : ''
      )}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-4">
          <CheckCircle className="w-8 h-8 text-success-500" />
        </div>
        <h3 className="text-xl font-semibold text-dark-900 mb-2">Спасибо за заявку!</h3>
        <p className="text-dark-600 mb-6">
          Мы свяжемся с вами в течение 15 минут для уточнения деталей.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-primary-500 text-dark-900 font-semibold rounded-xl hover:bg-primary-600 transition-colors"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-lg overflow-hidden',
      compact ? 'max-w-md mx-auto' : ''
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        {subtitle && <p className="text-primary-100">{subtitle}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Ваше имя <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Иван Петрович"
            className={cn(
              'w-full h-12 px-4 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              errors.name
                ? 'border-error-500 bg-error-50'
                : 'border-dark-300 focus:border-primary-500'
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error-500">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Телефон <span className="text-error-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', formatPhoneNumber(e.target.value))}
            placeholder="(0XX) XXX-XX-XX"
            className={cn(
              'w-full h-12 px-4 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              errors.phone
                ? 'border-error-500 bg-error-50'
                : 'border-dark-300 focus:border-primary-500'
            )}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error-500">{errors.phone}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Услуга <span className="text-error-500">*</span>
          </label>
          <select
            value={formData.service}
            onChange={(e) => handleChange('service', e.target.value)}
            className={cn(
              'w-full h-12 px-4 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none bg-white',
              errors.service
                ? 'border-error-500 bg-error-50'
                : 'border-dark-300 focus:border-primary-500'
            )}
          >
            {services.map(service => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-error-500">{errors.service}</p>
          )}
        </div>

        {/* Address (optional) */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Адрес объекта
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="г. Киев, ул. Примерная 12, кв. 34"
            className="w-full h-12 px-4 rounded-lg border border-dark-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
          />
        </div>

        {/* Comment (optional) */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Комментарий
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder="Дополнительная информация..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-dark-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
          />
        </div>

        {/* Consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => handleChange('consent', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-dark-600">
              Я согласен с{' '}
              <a href="/privacy" className="text-primary-500 hover:underline">
                политикой обработки персональных данных
              </a>
              <span className="text-error-500 ml-1">*</span>
            </span>
          </label>
          {errors.consent && !formData.consent && (
            <p className="mt-1 text-sm text-error-500">Необходимо согласие с политикой обработки данных</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full h-14 flex items-center justify-center gap-2',
            'bg-primary-500 hover:bg-primary-600',
            'text-dark-900 font-semibold text-lg',
            'rounded-xl transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Отправить заявку
            </>
          )}
        </button>
      </form>

      {/* Contact Info */}
      {!compact && (
        <div className="px-6 pb-6">
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-dark-200">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-dark-500">Телефон</p>
                <p className="text-sm font-medium text-dark-900">+38 (044) 000-00-00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-dark-500">Время работы</p>
                <p className="text-sm font-medium text-dark-900">Пн-Пт: 9:00 - 19:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-dark-500">Город</p>
                <p className="text-sm font-medium text-dark-900">Киев и область</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default OrderForm;
