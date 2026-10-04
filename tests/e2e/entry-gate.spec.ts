import { test, expect } from '@playwright/test';

test.describe('Entry Gate Anti-Scraping UX & Skip Logic', () => {
  test('skips entry gate by default when navigator.webdriver is true (automated browser)', async ({ page }) => {
    // Playwright sets navigator.webdriver to true by default.
    await page.goto('/');

    // Pre-paint cover class must not remain on the html element
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/ba-prelaunch/);

    // Overlay dialog should not be rendered
    const dialog = page.locator('div[role="dialog"][aria-label*="Welcome"]');
    await expect(dialog).toHaveCount(0);

    // Main portfolio content is directly visible
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();
  });

  test('skips entry gate for search engine crawlers (Googlebot UA)', async ({ browser }) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    });
    const page = await context.newPage();

    await page.goto('/');

    // Overlay dialog should not be rendered
    const dialog = page.locator('div[role="dialog"][aria-label*="Welcome"]');
    await expect(dialog).toHaveCount(0);

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/ba-prelaunch/);

    // Crucial: SEO / crawler sees the full static portfolio content
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await context.close();
  });

  test('skips entry gate for returning visitors with recent localStorage entry token', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Seed localStorage as a returning visitor
    await page.addInitScript(() => {
      window.localStorage.setItem('ba_entered', String(Date.now()));
    });

    await page.goto('/');

    const dialog = page.locator('div[role="dialog"][aria-label*="Welcome"]');
    await expect(dialog).toHaveCount(0);

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/ba-prelaunch/);

    await expect(page.locator('#main-content')).toBeVisible();

    await context.close();
  });

  test('skips entry gate when prefers-reduced-motion is requested', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    // Ensure navigator.webdriver false so only reduced-motion determines the skip
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
        configurable: true,
      });
    });

    await page.goto('/');

    const dialog = page.locator('div[role="dialog"][aria-label*="Welcome"]');
    await expect(dialog).toHaveCount(0);

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/ba-prelaunch/);

    await expect(page.locator('#main-content')).toBeVisible();

    await context.close();
  });

  test('shows entry gate for real human non-webdriver visitor and dissolves on enter gesture', async ({ browser }) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    // Emulate human visitor: navigator.webdriver is false
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
        configurable: true,
      });
      // Clear localStorage to ensure first visit
      window.localStorage.clear();
    });

    await page.goto('/');

    // Gate dialog should be visible
    const dialog = page.locator('div[role="dialog"][aria-label*="Welcome"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Heading inside splash
    await expect(dialog.getByText('Bilal Ahamad')).toBeVisible();

    // Enter button
    const enterBtn = dialog.getByRole('button', { name: /enter/i });
    await expect(enterBtn).toBeVisible();

    // Click Enter to execute handshake and trigger smooth dissolve
    await enterBtn.click();

    // After clicking enter, overlay dialog dissolves and unmounts
    await expect(dialog).toHaveCount(0, { timeout: 5000 });

    // html.ba-prelaunch must be cleared
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/ba-prelaunch/);

    // localStorage must have marked entered
    const enteredVal = await page.evaluate(() => window.localStorage.getItem('ba_entered'));
    expect(enteredVal).not.toBeNull();

    // Main content must be fully visible
    await expect(page.locator('#main-content')).toBeVisible();

    await context.close();
  });
});
