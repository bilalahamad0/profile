import { test, expect } from '@playwright/test';

/**
 * Guards the /ai -> /projects merge (2026-08).
 *
 * Two things here are load-bearing and easy to break silently:
 *  1. content/blog/adhan-caster-extension-story.mdx links to
 *     https://bilalahamad.com/ai#adhan-ce — a published post, so that URL must
 *     keep resolving to something that actually contains #adhan-ce.
 *  2. The AI metrics are fed by the weekly `update-ai-metrics.yml` Action, and
 *     they must stay server-rendered (ATS / crawler requirement), not fetched
 *     on the client.
 */

const AI_PROJECT_IDS = ['warn', 'adhan', 'tmo', 'adhan-ce', 'profile'];

test.describe('AI Lab merged into /projects', () => {
  test('/ai permanently redirects to /projects', async ({ page }) => {
    const response = await page.goto('/ai');
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe('/projects');

    // Must be a permanent redirect (Next emits 308 for `permanent: true`) so the
    // indexed /ai URL's ranking transfers rather than being treated as temporary.
    const chain = response?.request().redirectedFrom();
    expect(chain, '/ai should have been reached via a redirect').toBeTruthy();
    const redirectResponse = await chain!.response();
    expect(redirectResponse?.status()).toBe(308);
  });

  test('the published blog link /ai#adhan-ce lands on a real anchor', async ({ page }) => {
    await page.goto('/ai#adhan-ce');
    // Browsers carry the fragment across a fragment-less redirect target.
    expect(page.url()).toContain('/projects#adhan-ce');
    const target = page.locator('#adhan-ce');
    await expect(target).toBeAttached();
    await expect(target).toContainText('Adhan Caster');
  });

  test('the blog post still points somewhere that resolves', async ({ page }) => {
    await page.goto('/blog/adhan-caster-extension-story');
    const link = page.locator('a[href="https://bilalahamad.com/ai#adhan-ce"]');
    await expect(link).toHaveCount(1);
  });

  test('the AI Lab section and every project row are server-rendered', async ({ request }) => {
    // Read the raw HTML: no JS runs, so anything found here is in the static
    // markup a crawler or ATS parser sees.
    const html = await (await request.get('/projects')).text();

    expect(html).toContain('id="ai-lab"');
    expect(html).toContain('Metrics at a Glance');
    expect(html).toContain('AI Build Breakdown');

    for (const id of AI_PROJECT_IDS) {
      expect(html, `${id} card anchor missing from static HTML`).toContain(`id="${id}"`);
    }

    // Per-project AI detail that only existed on /ai before the merge.
    expect(html).toContain('Claude Code');
    expect(html).toContain('Before AI');
    expect(html).toContain('After AI');
  });

  test('metrics table rows jump to their project card', async ({ page }) => {
    await page.goto('/projects');
    const row = page.locator('#ai-lab a[href="#adhan-ce"]').first();
    await expect(row).toBeAttached();
  });

  test('AI Lab is gone from the primary navigation', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('nav[aria-label="Main navigation"] a[href="/ai"]')).toHaveCount(0);
    await expect(page.locator('footer a[href="/ai"]')).toHaveCount(0);
  });
});
