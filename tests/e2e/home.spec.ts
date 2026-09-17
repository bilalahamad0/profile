import { test, expect } from '@playwright/test';

test.describe('Homepage E2E', () => {
  test('should load the elevated homepage and check key sections', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Bilal Ahamad/);
    
    // Main content visible
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // Check Curated Systems section is present before Who I Am
    const curatedSystems = page.locator('#curated-systems');
    await expect(curatedSystems).toBeVisible();

    // Check Who I Am section is present with updated heading
    const whoIAm = page.locator('#who-i-am');
    await expect(whoIAm).toBeVisible();
    await expect(whoIAm.getByText('The Architecture of System Validation')).toBeVisible();

    // Verify DOM order: #curated-systems comes before #who-i-am
    const order = await page.evaluate(() => {
      const el1 = document.querySelector('#curated-systems');
      const el2 = document.querySelector('#who-i-am');
      if (!el1 || !el2) return false;
      return Boolean(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order).toBe(true);

    // Verify redundant Core Disciplines section is removed
    await expect(page.locator('#disciplines')).toHaveCount(0);

    // Verify exact matching project names from projects data
    await expect(curatedSystems.getByText('US Live Layoff Monitoring Dashboard')).toBeVisible();
    await expect(curatedSystems.getByText('Smart-Home IoT Media Caster')).toBeVisible();
    await expect(curatedSystems.getByText('Adhan Caster — Cross-Browser Extension')).toBeVisible();

    // Verify video thumbnails are rendered
    const videos = curatedSystems.locator('video');
    await expect(videos).toHaveCount(3);

    // Take component screenshots
    if (await curatedSystems.count() > 0) {
      await curatedSystems.screenshot({ path: 'verify-curated-systems.png' });
    }

    if (await whoIAm.count() > 0) {
      await whoIAm.screenshot({ path: 'verify-who-i-am.png' });
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
});
