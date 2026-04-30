import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage E2E', () => {
  test('should load the homepage and check basic elements', async ({ page }) => {
    await page.goto('/');
    
    // Check page title or a known element. Assuming it has some title.
    await expect(page).toHaveTitle(/./);
    
    // Basic interaction test (this will need refinement based on exact DOM)
    // E.g. waiting for main content to be visible
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    // Wait for all Framer Motion enter animations to finish to avoid false-positive color contrast errors due to opacity transitions
    await page.waitForTimeout(2000);

    // Exclude iframes since they load external content (like dashboards) that we don't control
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('iframe')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
