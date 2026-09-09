import { test, expect } from '@playwright/test';

test.describe('Homepage E2E', () => {
  test('should load the elevated homepage and check key sections', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Bilal Ahamad/);
    
    // Main content visible
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // Check Who I Am section is present
    const whoIAm = page.locator('#who-i-am');
    await expect(whoIAm).toBeVisible();

    // Check Core Disciplines section is present
    const disciplines = page.locator('#disciplines');
    await expect(disciplines).toBeVisible();

    // Check Curated Systems section is present
    const curatedSystems = page.locator('#curated-systems');
    await expect(curatedSystems).toBeVisible();

    // Verify exact matching project names from projects data
    await expect(curatedSystems.getByText('US Live Layoff Monitoring Dashboard')).toBeVisible();
    await expect(curatedSystems.getByText('Smart-Home IoT Media Caster')).toBeVisible();
    await expect(curatedSystems.getByText('Adhan Caster — Cross-Browser Extension')).toBeVisible();

    // Verify video thumbnails are rendered
    const videos = curatedSystems.locator('video');
    await expect(videos).toHaveCount(3);

    // Take component screenshots
    if (await whoIAm.count() > 0) {
      await whoIAm.screenshot({ path: 'verify-who-i-am.png' });
    }

    if (await disciplines.count() > 0) {
      await disciplines.screenshot({ path: 'verify-disciplines.png' });
    }

    if (await curatedSystems.count() > 0) {
      await curatedSystems.screenshot({ path: 'verify-curated-systems.png' });
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
