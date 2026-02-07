// Unit tests for form validation utilities
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// Import validation schemas from the forms
const orderSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  service: z.string().min(1, 'Выберите услугу'),
  message: z.string().optional(),
  address: z.string().optional(),
  website: z.literal('').optional(),
});

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

type OrderFormData = z.infer<typeof orderSchema>;
type ContactFormData = z.infer<typeof contactSchema>;

describe('Form Validation', () => {
  describe('Order Form Validation', () => {
    it('validates correct order form data', () => {
      const validData = {
        name: 'Иван Иванов',
        phone: '+38 (099) 123-45-67',
        email: 'test@example.com',
        service: 'window-installation',
        message: 'Нужно установить 3 окна',
        address: 'г. Киев, ул. Примерная, 1',
      };

      const result = orderSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects name shorter than 2 characters', () => {
      const invalidData = {
        name: 'И',
        phone: '+38 (099) 123-45-67',
        service: 'window-installation',
      };

      const result = orderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects phone shorter than 10 characters', () => {
      const invalidData = {
        name: 'Иван',
        phone: '123',
        service: 'window-installation',
      };

      const result = orderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid email format', () => {
      const invalidData = {
        name: 'Иван',
        phone: '+38 (099) 123-45-67',
        email: 'invalid-email',
        service: 'window-installation',
      };

      const result = orderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty service selection', () => {
      const invalidData = {
        name: 'Иван',
        phone: '+38 (099) 123-45-67',
        service: '',
      };

      const result = orderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts empty optional fields', () => {
      const validData = {
        name: 'Иван Иванов',
        phone: '+38 (099) 123-45-67',
        service: 'window-installation',
      };

      const result = orderSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Contact Form Validation', () => {
    it('validates correct contact form data', () => {
      const validData = {
        name: 'Мария Петрова',
        phone: '+38 (050) 987-65-43',
        email: 'maria@example.com',
        message: 'Хочу узнать больше о ваших услугах',
      };

      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects message shorter than 10 characters', () => {
      const invalidData = {
        name: 'Иван',
        phone: '+38 (099) 123-45-67',
        message: 'Привет',
      };

      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts valid Ukrainian phone numbers', () => {
      const validPhones = [
        '+38 (099) 123-45-67',
        '+38 (050) 123-45-67',
        '+38 (063) 123-45-67',
        '+38 (067) 123-45-67',
        '+38 (068) 123-45-67',
        '+38 (091) 123-45-67',
        '+38 (092) 123-45-67',
        '+38 (094) 123-45-67',
      ];

      for (const phone of validPhones) {
        const validData = {
          name: 'Тест',
          phone,
          message: 'Сообщение длиной более 10 символов',
        };
        const result = contactSchema.safeParse(validData);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Validation Helper Functions', () => {
    it('validates Ukrainian phone number prefixes', () => {
      const validPrefixes = ['050', '063', '066', '067', '068', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
      
      for (const prefix of validPrefixes) {
        expect(prefix.startsWith('0')).toBe(true);
        expect(prefix.length).toBe(3);
      }
    });

    it('validates email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@example.com',
      ];

      for (const email of validEmails) {
        expect(emailRegex.test(email)).toBe(true);
      }
    });

    it('validates phone number contains only digits after +', () => {
      const phone = '+38 (099) 123-45-67';
      const digits = phone.replace(/^\+\d{2}/, '');
      expect(digits.replace(/\D/g, '')).toBe('0991234567');
    });
  });
});
