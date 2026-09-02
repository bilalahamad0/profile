import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Site-wide accessibility guard.
 *
 * This replaces the single-route scan that used to live in `home.spec.ts`.
 * Three things that scan could not catch, and this one can:
 *
 * 1. It only ever visited `/`. Eight other routes had no coverage at all —
 *    and both of the violations this suite was written against (duplicate
 *    landmarks on /certifications and /projects) lived on those routes.
 *
 * 2. It called `.exclude('iframe')`, which drops the `<iframe>` ELEMENT as
 *    well as its contents, so `frame-title` (WCAG 4.1.2) could never fail —
 *    an embed shipped without a title would have gone unreported. Excluding
 *    `['iframe', '*']` instead keeps the elements in scope and drops only the
 *    third-party documents inside them, whose markup this repo cannot change.
 *    Verified both ways: with an untitled iframe injected, the old form
 *    reported nothing and this form reports `frame-title`.
 *
 * 3. It never scrolled. Every dashboard embed on /projects is mounted by
 *    `DashboardFacade`'s IntersectionObserver, so the three iframes did not
 *    exist in the DOM during the scan — precisely the elements point 2 is
 *    meant to protect.
 */

const ROUTES = [
  '/',
  '/projects',
  '/experience',
  '/certifications',
  '/blog',
  '/blog/warn-tracker-goes-national',
  '/contact',
  '/resume',
  '/privacy',
] as const;

/**
 * Waits until the page is genuinely finished, then forces deferred content in.
 *
 * `networkidle` alone is not enough: it fires while these pages are still
 * parsing, which yields a scan of a partially-built DOM that passes for the
 * wrong reason.
 */
async function settle(page: Page): Promise<void> {
  await page.waitForFunction(() => document.readyState === 'complete');

  // Mount everything gated behind an IntersectionObserver (dashboard embeds).
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 900));
    window.scrollTo(0, 0);
  });

  // Framer Motion enter animations must finish, or mid-transition opacity
  // produces false-positive contrast failures.
  await page.waitForTimeout(2500);
}

function scan(page: Page) {
  // See point 2 above: the iframe elements stay in scope, their contents do not.
  return new AxeBuilder({ page }).exclude(['iframe', '*']);
}

test.describe('Accessibility', () => {
  for (const route of ROUTES) {
    test(`${route} has no detectable accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await settle(page);

      const results = await scan(page).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('Accessibility (mobile viewport)', () => {
  // CI runs the chromium project only, so the config's Mobile Chrome / Mobile
  // Safari projects do not protect it. Pinning the viewport here keeps
  // mobile-only rules — scrollable-region-focusable, reflow, target-size —
  // covered on the one project CI actually executes.
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of ROUTES) {
    test(`${route} has no violations at 390x844`, async ({ page }) => {
      await page.goto(route);
      await settle(page);

      const results = await scan(page).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('Embedded dashboards', () => {
  test('every iframe carries an accessible name', async ({ page }) => {
    // A direct guard on the attribute, independent of which axe rules are
    // enabled. The dashboard iframes are built from project data, so a new
    // entry missing a title would otherwise ship silently.
    await page.goto('/projects');
    await settle(page);

    const frames = page.locator('iframe');
    const count = await frames.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const title = await frames.nth(i).getAttribute('title');
      expect(title?.trim()).toBeTruthy();
    }
  });
});
