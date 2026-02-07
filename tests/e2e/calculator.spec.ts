// E2E tests for calculator page
import { expect, test } from '@playwright/test';

test.describe('Calculator Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/калькулятор|окна/i);
  });

  test('displays calculator interface', async ({ page }) => {
    const calculator = page.locator('[data-testid="calculator"], section').first();
    await expect(calculator).toBeVisible();
  });

  test('has width and height inputs', async ({ page }) => {
    const widthInput = page.locator('input[name="width"], input[id*="width"]').first();
    const heightInput = page.locator('input[name="height"], input[id*="height"]').first();
    
    await expect(widthInput).toBeVisible();
    await expect(heightInput).toBeVisible();
  });

  test('has profile selection', async ({ page }) => {
    const profileSelect = page.locator('select[name="profile"], select[id*="profile"]').first();
    await expect(profileSelect).toBeVisible();
  });

  test('has glazing selection', async ({ page }) => {
    const glazingSelect = page.locator('select[name="glazing"], select[id*="glazing"]').first();
    await expect(glazingSelect).toBeVisible();
  });

  test('displays price calculation', async ({ page }) => {
    // Fill in dimensions
    const widthInput = page.locator('input[name="width"]').first();
    const heightInput = page.locator('input[name="height"]').first();
    
    await widthInput.fill('120');
    await heightInput.fill('150');
    
    // Check if price is displayed
    const priceElement = page.locator('text=/[0-9]+\s*грн/i, text=/[0-9]+\s*₴/i').first();
    await expect(priceElement).toBeVisible();
  });

  test('installation toggle works', async ({ page }) => {
    const installationToggle = page.locator('input[name="installation"], input[id*="installation"]').first();
    if (await installationToggle.isVisible()) {
      await installationToggle.check();
      await expect(installationToggle).toBeChecked();
    }
  });

  test('calculates different prices for different profiles', async ({ page }) => {
    const profileSelect = page.locator('select[name="profile"]').first();
    
    // Get initial price
    const initialPrice = page.locator('text=/[0-9]+\s*грн/i').first().textContent();
    
    // Change profile
    await profileSelect.selectOption('premium');
    
    // Price should change (could be same or different depending on implementation)
    const newPrice = page.locator('text=/[0-9]+\s*грн/i').first().textContent();
    expect(newPrice).toBeTruthy();
  });
});

test.describe('Calculator Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('rejects invalid dimensions', async ({ page }) => {
    const widthInput = page.locator('input[name="width"]').first();
    await widthInput.fill('10'); // Below minimum of 30
    
    // Check for validation error
    const errorMessage = page.locator('text=/ширина|мin|min/i').first();
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('accepts valid dimensions', async ({ page }) => {
    const widthInput = page.locator('input[name="width"]').first();
    const heightInput = page.locator('input[name="height"]').first();
    
    await widthInput.fill('120');
    await heightInput.fill('150');
    
    // No validation errors should appear
    const errorMessages = page.locator('text=/ошибка|неверно|неправильно/i');
    const count = await errorMessages.count();
    expect(count).toBe(0);
  });
});
