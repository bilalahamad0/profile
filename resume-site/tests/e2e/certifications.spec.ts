import { test, expect } from '@playwright/test';

test.describe('Certifications — Google AI Essentials specialization path', () => {
  test('renders parent card with single Google logo, ribbon, and verify button', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');
    await expect(section).toBeVisible();

    // Single Google logo only — Coursera coLogo was removed in this PR.
    // Use img[alt] selector so this asserts on the logo specifically.
    const logos = section.locator('img[alt="Google"]');
    await expect(logos).toHaveCount(1);

    // No Coursera logo image inside the parent card area.
    await expect(section.locator('img[alt="Coursera"]')).toHaveCount(0);

    // 🌟 AI Expert ribbon is present and contains the literal text.
    const ribbon = section.getByText('AI Expert', { exact: true });
    await expect(ribbon).toBeVisible();

    // Verify Specialization CTA button is present and points to a Coursera URL.
    const verifyBtn = section.getByRole('button', { name: /verify specialization/i });
    await expect(verifyBtn).toBeVisible();
  });

  test('renders all 5 child courses with verify links (no toggle/expand)', async ({ page }) => {
    await page.goto('/certifications');

    const list = page.getByTestId('specialization-courses-list');
    await expect(list).toBeVisible();

    const items = list.locator('li');
    await expect(items).toHaveCount(5);

    // Each course card has step number, title text, and an aria-labelled verify button.
    const expectedTitles = [
      'Introduction to AI',
      'Maximize Productivity With AI Tools',
      'Discover the Art of Prompting',
      'Use AI Responsibly',
      'Stay Ahead of the AI Curve',
    ];

    for (const title of expectedTitles) {
      await expect(list.getByText(title, { exact: true })).toBeVisible();
      await expect(
        list.getByRole('button', { name: new RegExp(`verify certificate for ${title}`, 'i') })
      ).toBeVisible();
    }

    // Critical: no expand/collapse toggle exists in the new design.
    await expect(
      page.getByRole('button', { name: /view individual course credentials|hide individual course credentials/i })
    ).toHaveCount(0);
  });

  test('parent thumbnail click invokes window.open with the Coursera verification URL', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');
    const thumbBtn = section.getByRole('button', {
      name: /view google ai essentials certificate on coursera/i,
    });
    await expect(thumbBtn).toBeVisible();

    // Spy on window.open before the click — more reliable than waiting for a
    // popup event, since `window.open(url, "_blank", "noopener")` doesn't
    // always trigger context.waitForEvent('page') in headless Chromium.
    await page.evaluate(() => {
      // Stash original to avoid affecting other tests that share this page.
      // @ts-expect-error attach probe state for the test
      window.__openCalls = [];
      // @ts-expect-error override
      window.open = (url, target) => {
        // @ts-expect-error read probe state
        window.__openCalls.push({ url: String(url), target: String(target) });
        return null;
      };
    });

    await thumbBtn.click();

    const calls = await page.evaluate(
      // @ts-expect-error read probe state
      () => window.__openCalls as Array<{ url: string; target: string }>
    );
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'coursera.org/account/accomplishments/specialization/0YNZJF3R5PJA'
    );
    expect(calls[0].target).toBe('_blank');
  });
});
