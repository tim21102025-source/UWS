// Accessibility tests for homepage using axe-core
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility - Homepage', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('homepage has proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      // Decorative images can have empty alt=""
      expect(alt !== null).toBe(true);
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/');
    
    const inputs = page.locator('input:not([type="hidden"]):not([type="submit"])');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      
      // Check for associated label
      const id = await input.getAttribute('id');
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
      const hasAriaLabel = await input.getAttribute('aria-label');
      const hasTitle = await input.getAttribute('title');
      
      expect(hasLabel || hasAriaLabel || hasTitle).toBe(true);
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      const hasAccessibleName = text?.trim() || ariaLabel || ariaLabelledBy;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('links have accessible text', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      const hasAccessibleName = text?.trim() || ariaLabel || title;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('page has language attribute', async ({ page }) => {
    await page.goto('/');
    
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    
    expect(lang).toBeTruthy();
    expect(['uk', 'ua', 'ru', 'en']).toContain(lang);
  });
});

test.describe('Accessibility - Calculator Page', () => {
  test('calculator page has no accessibility violations', async ({ page }) => {
    await page.goto('/calculator');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('calculator inputs are properly labeled', async ({ page }) => {
    await page.goto('/calculator');
    
    const inputs = page.locator('input:not([type="hidden"])');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
      const hasAriaLabel = await input.getAttribute('aria-label');
      
      expect(hasLabel || hasAriaLabel).toBe(true);
    }
  });
});

test.describe('Accessibility - Forms', () => {
  test('form validation errors are announced', async ({ page }) => {
    await page.goto('/');
    
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Check for aria-invalid or error messages
    const invalidInputs = page.locator('[aria-invalid="true"]');
    const errorMessages = page.locator('[role="alert"], .error, [aria-describedby]');
    
    const hasErrors = await invalidInputs.count() > 0 || await errorMessages.count() > 0;
    expect(hasErrors).toBe(true);
  });
});
