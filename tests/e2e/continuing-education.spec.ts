import { test, expect } from '@playwright/test';

const TOPICS = [
  'Cool Applications',
  'Sensors',
  'Embedded Systems',
  'Networking',
  'Circuits',
];

test.describe('Certifications — Continuing Education (non-credential)', () => {
  test('ATS: every Stanford fact is in the raw server HTML with zero JavaScript', async ({ request }) => {
    const res = await request.get('/certifications');
    expect(res.status()).toBe(200);
    // Decode &amp; LAST so an encoded sequence like &amp;quot; can never be
    // double-unescaped (js/double-escaping) — same order as certifications.spec.ts.
    const decode = (s: string) =>
      s
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&#x2F;/g, '/')
        .replace(/&amp;/g, '&');
    const html = decode(await res.text());

    for (const needle of [
      'Continuing Education',
      'Stanford School of Engineering',
      'Introduction to Internet of Things',
      'XEE100',
      ...TOPICS,
    ]) {
      expect(html, `raw HTML must contain "${needle}"`).toContain(needle);
    }
  });

  test('the section is structurally not a credential', async ({ page }) => {
    await page.goto('/certifications');
    const section = page.locator('#continuing-education');
    await expect(section).toBeVisible();

    // It is not one of the four ledger groups, and it did not disturb them.
    await expect(page.locator('section[id^="group-"]')).toHaveCount(4);
    await expect(
      page.locator('section[aria-labelledby^="specialization-path-heading"]'),
    ).toHaveCount(4);

    // No verification vocabulary, no certificate artefact, no ledger chrome.
    await expect(section.getByRole('button', { name: /verify/i })).toHaveCount(0);
    await expect(section.getByText(/all verified/i)).toHaveCount(0);
    await expect(section.locator('img')).toHaveCount(0);
    await expect(section.locator('[aria-expanded]')).toHaveCount(0);
    await expect(section.locator('[role="dialog"]')).toHaveCount(0);

    // Exactly one outbound link, and it points at the syllabus.
    const links = section.locator('a');
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute(
      'href',
      /^https:\/\/online\.stanford\.edu\/courses\/xee100-introduction-internet-things$/,
    );
    await expect(links).toHaveAttribute('rel', /noopener/);
  });

  test('all five topics render as chips on the card', async ({ page }) => {
    await page.goto('/certifications');
    const section = page.locator('#continuing-education');
    for (const topic of TOPICS) {
      await expect(section.getByText(topic, { exact: true })).toBeVisible();
    }
  });

  test('the record status is stated once, in the fine print — not repeated', async ({ page }) => {
    await page.goto('/certifications');
    const section = page.locator('#continuing-education');

    // Stated: one quiet line beside the course-page link.
    await expect(
      section.getByText(/Stanford issues no certificate for this course/i),
    ).toBeVisible();

    // Stated ONCE. An earlier pass said it four times (eyebrow, header slot,
    // a red chip and a sentence), which read as an apology and buried the
    // course. This is the regression guard for that tone, not a nitpick.
    await expect(section.getByText(/no certificate/i)).toHaveCount(1);
    await expect(section.getByText(/not counted/i)).toHaveCount(0);
    await expect(section.getByText(/not certified/i)).toHaveCount(0);

    // The prominent slots carry the achievement instead.
    await expect(section.getByText('Completed 2026', { exact: true })).toBeVisible();
    await expect(
      section.getByText(/Taught by six Stanford faculty/i),
    ).toBeVisible();
  });

  test('the achievement and the fine print both render at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/certifications');
    const section = page.locator('#continuing-education');
    await expect(section.getByText('Completed 2026', { exact: true })).toBeVisible();
    await expect(
      section.getByText(/Stanford issues no certificate for this course/i),
    ).toBeVisible();
  });

  test('the jump pill is present and set apart from the category pills', async ({ page }) => {
    await page.goto('/certifications');
    const nav = page.getByRole('navigation', { name: /certification categories/i });
    const pill = nav.locator('a[href="#continuing-education"]');
    await expect(pill).toBeVisible();
    await expect(pill).toContainText('Continuing Education');
    // No "· {n}" count suffix — that absence is what sets it apart from the
    // four category pills, without spending the label on a disclaimer.
    await expect(pill).not.toContainText('·');
    // The four category pills are untouched.
    await expect(nav.locator('a[href="#group-ai"]')).toBeVisible();
    await expect(nav.locator('a[href="#group-engineering"]')).toBeVisible();
  });

  test('no EducationalOccupationalCredential is emitted for the Stanford course', async ({ request }) => {
    const html = await (await request.get('/certifications')).text();
    expect(html).not.toMatch(/EducationalOccupationalCredential[^]{0,400}XEE100/);
    expect(html).not.toMatch(
      /EducationalOccupationalCredential[^]{0,400}Internet of Things/,
    );
    // And no Course node either — a Course on a personal profile reads to
    // crawlers as "this site offers this course".
    expect(html).not.toMatch(/"@type"\s*:\s*"Course"/);
  });

  test('the card stays row-sized and does not overflow at 375px', async ({ page }) => {
    // The page wrapper carries overflow-x-hidden, which can mask a real
    // overflow from a document-level assertion — so measure the section.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/certifications');
    const overflow = await page.evaluate(() => {
      const el = document.getElementById('continuing-education');
      if (!el) return null;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).not.toBeNull();
    expect(overflow ?? 1).toBeLessThanOrEqual(0);

    const docOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(docOverflow).toBeLessThanOrEqual(0);
  });
});
