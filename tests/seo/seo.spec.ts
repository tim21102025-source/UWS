// SEO tests
import { expect, test } from '@playwright/test';

test.describe('SEO - Homepage', () => {
  test('has proper title tag', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(70);
  });

  test('has meta description', async ({ page }) => {
    await page.goto('/');
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
    
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
    expect(content?.length).toBeLessThan(160);
  });

  test('has Open Graph meta tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    const ogUrl = page.locator('meta[property="og:url"]');
    
    await expect(ogTitle).toHaveCount(1);
    await expect(ogDescription).toHaveCount(1);
    await expect(ogImage).toHaveCount(1);
    await expect(ogUrl).toHaveCount(1);
  });

  test('has Twitter Card meta tags', async ({ page }) => {
    await page.goto('/');
    
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    const twitterDescription = page.locator('meta[name="twitter:description"]');
    
    await expect(twitterCard).toHaveCount(1);
    await expect(twitterTitle).toHaveCount(1);
    await expect(twitterDescription).toHaveCount(1);
  });

  test('has canonical URL', async ({ page }) => {
    await page.goto('/');
    
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    
    const href = await canonical.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toContain('uws.com.ua');
  });

  test('has robots meta tag', async ({ page }) => {
    await page.goto('/');
    
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveCount(1);
    
    const content = await robots.getAttribute('content');
    expect(content).toContain('index');
    expect(content).toContain('follow');
  });

  test('has Schema.org data', async ({ page }) => {
    await page.goto('/');
    
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schema.count();
    
    expect(schemaCount).toBeGreaterThan(0);
    
    // Check for Organization schema
    const pageContent = await page.content();
    expect(pageContent).toContain('"@type"');
    expect(pageContent).toContain('Organization');
  });

  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Count all headings
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
  });
});

test.describe('SEO - Calculator Page', () => {
  test('has proper title', async ({ page }) => {
    await page.goto('/calculator');
    
    const title = await page.title();
    expect(title).toContain('калькулятор');
    expect(title).toContain('окна');
  });

  test('has meta description', async ({ page }) => {
    await page.goto('/calculator');
    
    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    
    expect(content).toBeTruthy();
  });

  test('has structured data for service', async ({ page }) => {
    await page.goto('/calculator');
    
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schema.count();
    
    expect(schemaCount).toBeGreaterThan(0);
  });
});

test.describe('SEO - Sitemap', () => {
  test('sitemap.xml exists and is valid', async ({ page }) => {
    await page.goto('/sitemap.xml');
    
    const content = await page.content();
    
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('<loc');
  });

  test('sitemap contains main pages', async ({ page }) => {
    await page.goto('/sitemap.xml');
    
    const content = await page.content();
    
    expect(content).toContain('/');
    expect(content).toContain('/about');
    expect(content).toContain('/calculator');
    expect(content).toContain('/contacts');
  });
});

test.describe('SEO - Robots.txt', () => {
  test('robots.txt exists', async ({ page }) => {
    await page.goto('/robots.txt');
    
    const content = await page.content();
    expect(content).toContain('User-agent');
    expect(content).toContain('Disallow');
  });

  test('allows search engine bots', async ({ page }) => {
    await page.goto('/robots.txt');
    
    const content = await page.content();
    expect(content).toContain('Allow');
  });
});
