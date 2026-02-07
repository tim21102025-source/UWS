// Unit tests for pricing calculator
import { describe, expect, it } from 'vitest';
import {
  calculatePrice,
  formatPrice,
  getGlazingById,
  getHardwareById,
  getProfileById,
  getSashCount,
  validateDimensions,
} from './pricing';

describe('Pricing Calculator', () => {
  describe('calculatePrice', () => {
    it('calculates base price correctly for standard window', () => {
      const result = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: [],
        includeInstallation: false,
        windowType: 'single',
      });

      expect(result.area).toBe(1.8);
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.totalPrice).toBeGreaterThan(0);
    });

    it('calculates price with installation (adds 15%)', () => {
      const withoutInstallation = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: [],
        includeInstallation: false,
        windowType: 'single',
      });

      const withInstallation = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: [],
        includeInstallation: true,
        windowType: 'single',
      });

      expect(withInstallation.installationCost).toBeGreaterThan(0);
      expect(withInstallation.totalPrice).toBeGreaterThan(withoutInstallation.totalPrice);
    });

    it('calculates price with extra options', () => {
      const withoutExtras = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: [],
        includeInstallation: false,
        windowType: 'single',
      });

      const withExtras = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: ['child-lock', 'vent'],
        includeInstallation: false,
        windowType: 'single',
      });

      expect(withExtras.extrasCost).toBeGreaterThan(0);
      expect(withExtras.totalPrice).toBeGreaterThan(withoutExtras.totalPrice);
    });

    it('applies type coefficient for balcony windows', () => {
      const singleWindow = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: [],
        includeInstallation: false,
        windowType: 'single',
      });

      const balconyWindow = calculatePrice({
        width: 120,
        height: 150,
        profileId: 'standard',
        glazingId: 'double',
        hardwareId: 'siegenia',
        extras: [],
        includeInstallation: false,
        windowType: 'balcony',
      });

      expect(balconyWindow.basePrice).toBeGreaterThan(singleWindow.basePrice);
    });

    it('calculates different sash counts for different window types', () => {
      const singleSash = getSashCount('single');
      const doubleSash = getSashCount('double');
      const tripleSash = getSashCount('triple');

      expect(singleSash).toBe(1);
      expect(doubleSash).toBe(2);
      expect(tripleSash).toBe(3);
    });
  });

  describe('validateDimensions', () => {
    it('validates correct dimensions', () => {
      const result = validateDimensions(120, 150);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects width below minimum (30cm)', () => {
      const result = validateDimensions(20, 150);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Ширина должна быть от 30 до 300 см');
    });

    it('rejects width above maximum (300cm)', () => {
      const result = validateDimensions(350, 150);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Ширина должна быть от 30 до 300 см');
    });

    it('rejects height below minimum (30cm)', () => {
      const result = validateDimensions(120, 20);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Высота должна быть от 30 до 300 см');
    });

    it('rejects height above maximum (300cm)', () => {
      const result = validateDimensions(120, 350);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Высота должна быть от 30 до 300 см');
    });

    it('rejects zero dimensions', () => {
      const result = validateDimensions(0, 150);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Размеры должны быть положительными числами');
    });

    it('rejects negative dimensions', () => {
      const result = validateDimensions(-50, 150);
      expect(result.valid).toBe(false);
    });

    it('accepts boundary values', () => {
      expect(validateDimensions(30, 30).valid).toBe(true);
      expect(validateDimensions(300, 300).valid).toBe(true);
    });
  });

  describe('formatPrice', () => {
    it('formats price in Ukrainian Hryvnia', () => {
      const formatted = formatPrice(10000);
      expect(formatted).toContain('₴');
      expect(formatted).toContain('10');
    });

    it('formats large numbers with thousand separators', () => {
      const formatted = formatPrice(1000000);
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
    });
  });

  describe('getProfileById', () => {
    it('returns correct profile', () => {
      const profile = getProfileById('standard');
      expect(profile).toBeDefined();
      expect(profile?.id).toBe('standard');
    });

    it('returns undefined for non-existent profile', () => {
      const profile = getProfileById('non-existent');
      expect(profile).toBeUndefined();
    });
  });

  describe('getGlazingById', () => {
    it('returns correct glazing', () => {
      const glazing = getGlazingById('double');
      expect(glazing).toBeDefined();
      expect(glazing?.id).toBe('double');
    });

    it('returns undefined for non-existent glazing', () => {
      const glazing = getGlazingById('non-existent');
      expect(glazing).toBeUndefined();
    });
  });

  describe('getHardwareById', () => {
    it('returns correct hardware (siegenia)', () => {
      const hardware = getHardwareById('siegenia');
      expect(hardware).toBeDefined();
      expect(hardware?.id).toBe('siegenia');
    });

    it('returns correct hardware (maco)', () => {
      const hardware = getHardwareById('maco');
      expect(hardware).toBeDefined();
      expect(hardware?.id).toBe('maco');
    });

    it('returns undefined for non-existent hardware', () => {
      const hardware = getHardwareById('non-existent');
      expect(hardware).toBeUndefined();
    });
  });
});
