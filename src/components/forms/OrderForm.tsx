import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileUploader } from './FileUploader';

const orderSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  service: z.string().min(1, 'Выберите услугу'),
  message: z.string().optional(),
  address: z.string().optional(),
  // Honeypot field - should be empty
  website: z.literal('').optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  service?: string;
  onSuccess?: () => void;
  className?: string;
}

const SERVICES = [
  { value: '', label: 'Выберите услугу' },
  { value: 'window-installation', label: 'Установка окон' },
  { value: 'window-repair', label: 'Ремонт окон' },
  { value: 'balcony', label: 'Балконы и лоджии' },
  { value: 'mosquito-nets', label: 'Москитные сетки' },
  { value: 'glass-replacement', label: 'Замена стеклопакетов' },
  { value: 'door-closers', label: 'Доводчики для дверей' },
];

export function OrderForm({ service: initialService = '', onSuccess, className = '' }: OrderFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: initialService,
      message: '',
      address: '',
    },
  });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      if (cleaned[0] === '8') {
        formatted = '+38' + cleaned;
      } else if (cleaned[0] === '3' && cleaned[1] === '8') {
        formatted = '+' + cleaned;
      } else if (cleaned.startsWith('380')) {
        formatted = '+' + cleaned;
      } else {
        formatted = '+38' + cleaned;
      }
    }
    const match = formatted.match(/^(\+38)?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (match) {
      return (
        '+38' +
        (match[2] ? ` (${match[2]})` : '') +
        (match[3] ? ` ${match[3]}` : '') +
        (match[4] ? `-${match[4]}` : '') +
        (match[5] ? `-${match[5]}` : '')
      ).trim();
    }
    return formatted;
  };

  const onSubmit = async (data: OrderFormData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const formData = {
        ...data,
        serviceLabel: SERVICES.find((s) => s.value === data.service)?.label || data.service,
      };

      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки заявки');
      }

      setSubmitStatus('success');
      reset();

      // GA4 event tracking
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // @ts-ignore
        window.gtag('event', 'form_submit', {
          event_category: 'form',
          event_label: 'order_form',
        });
      }

      if (onSuccess) {
        setTimeout(onSuccess, 3000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Произошла ошибка');
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 ${className}`}>
      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Оставить заявку
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Заполните форму и мы свяжемся с вами в течение 15 минут
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Honeypot field - hidden from users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            {...register('website')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Имя */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ваше имя *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } focus:ring-2 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="Иван Иванов"
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Телефон */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Номер телефона *
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                e.target.value = formatted;
                // @ts-ignore
                register('phone').onChange(e);
              }}
              className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } focus:ring-2 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="+38 (___) ___-__-__"
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.phone.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email (необязательно)
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } focus:ring-2 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="example@email.com"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Услуга */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Услуга *
          </label>
          <select
            id="service"
            {...register('service')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.service
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } focus:ring-2 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          >
            {SERVICES.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
          <AnimatePresence>
            {errors.service && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.service.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Адрес */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Адрес (необязательно)
          </label>
          <input
            type="text"
            id="address"
            {...register('address')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="г. Киев, ул. Примерная, 1"
          />
        </div>

        {/* Сообщение */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Комментарий (необязательно)
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            placeholder="Опишите вашу задачу..."
          />
        </div>

        {/* Загрузка файлов */}
        <Controller
          name="files"
          control={control}
          render={({ field }) => (
            <FileUploader
              name="files"
              maxFiles={10}
              maxSize={10}
              accept={['image/*', 'video/*']}
              onChange={field.onChange}
              error={errors.files?.message}
            />
          )}
        />

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={submitStatus === 'loading'}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            submitStatus === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : submitStatus === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitStatus === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Отправка...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Заявка отправлена!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Отправить заявку
            </>
          )}
        </button>

        {/* Сообщение об ошибке */}
        <AnimatePresence>
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errorMessage || 'Произошла ошибка при отправке. Попробуйте еще раз.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Политика конфиденциальности */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            политикой конфиденциальности
          </a>
        </p>
      </form>
    </div>
  );
}
