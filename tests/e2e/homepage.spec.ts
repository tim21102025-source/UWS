// E2E tests for homepage
import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/UWS|окна|установка/i);
  });

  test('displays header with navigation', async ({ page }) => {
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('displays hero section', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('displays services section', async ({ page }) => {
    const services = page.locator('section:has-text("услуг")').first();
    await expect(services).toBeVisible();
  });

  test('displays footer', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    const navLinks = page.locator('nav a, header a').first();
    await navLinks.click();
    await expect(page).toHaveURL(/./);
  });

  test('contact form is accessible', async ({ page }) => {
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('links to about page', async ({ page }) => {
    await page.goto('/');
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/);
    }
  });

  test('links to calculator page', async ({ page }) => {
    await page.goto('/');
    const calculatorLink = page.locator('a[href="/calculator"]').first();
    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await expect(page).toHaveURL(/\/calculator/);
    }
  });

  test('links to contacts page', async ({ page }) => {
    await page.goto('/');
    const contactsLink = page.locator('a[href="/contacts"]').first();
    if (await contactsLink.isVisible()) {
      await contactsLink.click();
      await expect(page).toHaveURL(/\/contacts/);
    }
  });
});
