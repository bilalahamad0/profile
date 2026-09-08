import { test, expect } from '@playwright/test';

test.describe('Homepage E2E', () => {
  test('should load the homepage and check basic elements', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Bilal Ahamad/);
    
    // Main content visible
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // Check Systems Validation Workbench is present
    const consoleHeader = page.getByText(/Systems Validation Workbench/i);
    await expect(consoleHeader).toBeVisible();

    // Check Career Impact Matrix is present
    const careerMatrix = page.locator('#career-matrix');
    await expect(careerMatrix).toBeVisible();

    // Check Testimonials section is present
    const testimonials = page.locator('#testimonials');
    await expect(testimonials).toBeVisible();

    // Take component screenshots
    const consoleEl = page.locator('div[aria-label="Interactive Systems Validation Workbench"]');
    if (await consoleEl.count() > 0) {
      await consoleEl.screenshot({ path: 'verify-systems-console.png' });
    }

    if (await careerMatrix.count() > 0) {
      await careerMatrix.screenshot({ path: 'verify-career-matrix.png' });
    }

    if (await testimonials.count() > 0) {
      await testimonials.screenshot({ path: 'verify-testimonials.png' });
    }

    // Scroll down to trigger all in-view animations
    await page.evaluate(async () => {
      for (let i = 0; i < document.body.scrollHeight; i += 500) {
        window.scrollTo(0, i);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);

    // Take full page screenshot
    await page.screenshot({ path: 'verify-home-full.png', fullPage: true });

    // Test Command Menu trigger
    await page.keyboard.press('Meta+k');
    const cmdInput = page.getByPlaceholder(/Type a command/i);
    if (await cmdInput.count() > 0) {
      await expect(cmdInput).toBeVisible();
      await page.screenshot({ path: 'verify-cmdk.png' });
      await page.keyboard.press('Escape');
    }
  });

  test('should render properly on mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // Check that there is 0 horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    await page.screenshot({ path: 'verify-home-375.png' });
  });

  // The accessibility scan that used to live here now runs in
  // accessibility.spec.ts across every route, at two viewports, with deferred
  // embeds mounted and with the <iframe> elements themselves still in scope.
  // See the header comment there for what this version could not catch.
});
