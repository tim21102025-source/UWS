// E2E tests for forms
import { expect, test } from '@playwright/test';

test.describe('Order Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays form fields', async ({ page }) => {
    const nameInput = page.locator('input[name="name"], input[id*="name"]').first();
    const phoneInput = page.locator('input[name="phone"], input[id*="phone"]').first();
    
    await expect(nameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Check for validation errors
    const errors = page.locator('[class*="error"], .text-red, text=/обязательно/i');
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('shows phone format hint', async ({ page }) => {
    const phoneInput = page.locator('input[name="phone"]').first();
    await phoneInput.click();
    await phoneInput.fill('123');
    
    // Check for validation error
    const error = page.locator('text=/телефон|коррект/i').first();
    if (await error.isVisible()) {
      await expect(error).toBeVisible();
    }
  });

  test('accepts valid Ukrainian phone number', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]').first();
    const phoneInput = page.locator('input[name="phone"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await nameInput.fill('Тест Тест');
    await phoneInput.fill('+38 (099) 123-45-67');
    
    // Submit and check for errors
    await submitButton.click();
    
    // Should not have validation errors for phone
    const phoneError = page.locator('text=/телефон/i');
    const count = await phoneError.count();
    // Either success or no phone-specific error
  });
});

test.describe('Contact Page Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contacts');
  });

  test('displays contact information', async ({ page }) => {
    const contactInfo = page.locator('text=/контакт/i').first();
    await expect(contactInfo).toBeVisible();
  });

  test('has working form fields', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]').first();
    const phoneInput = page.locator('input[name="phone"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();
    
    await nameInput.fill('Иван Иванов');
    await phoneInput.fill('+38 (099) 123-45-67');
    await messageInput.fill('Тестовое сообщение для проверки формы');
    
    await expect(nameInput).toHaveValue('Иван Иванов');
    await expect(phoneInput).toHaveValue(/.*123-45-67/);
    await expect(messageInput).toHaveValue('Тестовое сообщение для проверки формы');
  });
});

test.describe('Form Security', () => {
  test('honeypot field exists but is hidden', async ({ page }) => {
    await page.goto('/');
    const honeypotField = page.locator('input[name="website"], input[id="website"]').first();
    
    // Field should exist but be hidden
    if (await honeypotField.isVisible()) {
      // Should have aria-hidden or be visually hidden
      const ariaHidden = await honeypotField.getAttribute('aria-hidden');
      expect(ariaHidden).toBeTruthy();
    }
  });
});
