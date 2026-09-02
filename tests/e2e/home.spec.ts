import { test, expect } from '@playwright/test';

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

  // The accessibility scan that used to live here now runs in
  // accessibility.spec.ts across every route, at two viewports, with deferred
  // embeds mounted and with the <iframe> elements themselves still in scope.
  // See the header comment there for what this version could not catch.
});
