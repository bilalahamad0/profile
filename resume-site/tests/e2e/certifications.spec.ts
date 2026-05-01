import { test, expect } from '@playwright/test';

const PRO_CERT_TITLES = [
  'AI Fundamentals',
  'AI for Brainstorming and Planning',
  'AI for Research and Insights',
  'AI for Writing and Communicating',
  'AI for Content Creation',
  'AI for Data Analysis',
  'AI for App Building',
];

const ESSENTIALS_TITLES = [
  'Introduction to AI',
  'Maximize Productivity With AI Tools',
  'Discover the Art of Prompting',
  'Use AI Responsibly',
  'Stay Ahead of the AI Curve',
];

async function spyOnWindowOpen(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    // @ts-expect-error attach probe state for the test
    window.__openCalls = [];
    // @ts-expect-error override
    window.open = (url, target) => {
      // @ts-expect-error read probe state
      window.__openCalls.push({ url: String(url), target: String(target) });
      return null;
    };
  });
}

async function readOpenCalls(page: import('@playwright/test').Page) {
  return page.evaluate(
    // @ts-expect-error read probe state
    () => window.__openCalls as Array<{ url: string; target: string }>,
  );
}

test.describe('Certifications — Page-level layout', () => {
  test('Pro Certificate spec section renders before Essentials (reverse chronology)', async ({ page }) => {
    await page.goto('/certifications');

    const sections = page.locator(
      'section[aria-labelledby="specialization-path-heading"], section[aria-labelledby="specialization-path-heading-professional"]',
    );
    await expect(sections).toHaveCount(2);

    const ids = await sections.evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-labelledby')),
    );
    expect(ids).toEqual([
      'specialization-path-heading-professional',
      'specialization-path-heading',
    ]);
  });

  test('the standalone "Verifiable Credly Badges" section is gone', async ({ page }) => {
    await page.goto('/certifications');
    await expect(page.getByTestId('credly-badges-grid')).toHaveCount(0);
    await expect(
      page.locator('section[aria-labelledby="credly-badges-heading"]'),
    ).toHaveCount(0);
  });
});

test.describe('Certifications — Google AI Essentials specialization path', () => {
  test('header heading splits into two lines, no descriptive paragraph in header', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');
    await expect(section).toBeVisible();

    const heading = section.getByRole('heading', { level: 2 });
    await expect(heading).toBeVisible();
    await expect(heading.locator('span').nth(0)).toHaveText('Google AI Essentials');
    await expect(heading.locator('span').nth(1)).toHaveText('5-Course Journey');

    // Section header has no descriptive paragraph (description moved into the card).
    // The header block contains only the eyebrow + heading and optional counter.
    const headerBlock = section.locator(':scope > div').first();
    await expect(headerBlock.locator('p')).toHaveCount(0);
  });

  test('card has thumbnail with AI Skills ribbon, no in-card title h3, no Verify Specialization button, no Specialization-Complete pill', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');

    // Single Google logo, no Coursera logo, AI Skills ribbon present.
    await expect(section.locator('img[alt="Google"]')).toHaveCount(1);
    await expect(section.locator('img[alt="Coursera"]')).toHaveCount(0);
    await expect(section.getByText('AI Skills', { exact: true })).toBeVisible();

    // Thumbnail click target is present (the user navigates via the thumbnail).
    await expect(
      section.getByRole('button', { name: /view google ai essentials certificate on coursera/i }),
    ).toBeVisible();

    // Removed: Verify Specialization button.
    await expect(
      section.getByRole('button', { name: /verify specialization/i }),
    ).toHaveCount(0);

    // Removed: "X-Course Specialization · Complete" pill.
    await expect(
      section.getByText(/specialization · complete/i),
    ).toHaveCount(0);

    // Removed: redundant in-card h3 title "Google AI Essentials".
    await expect(
      section.getByRole('heading', { level: 3, name: 'Google AI Essentials' }),
    ).toHaveCount(0);
  });

  test('parent badge sits next to the description in the left column; right column has the 5-course numbered list', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');

    const parentBadge = section.getByRole('button', {
      name: /view google ai essentials parent badge on credly/i,
    });
    await expect(parentBadge).toBeVisible();

    const list = page.getByTestId('specialization-courses-list');
    const items = list.locator('li');
    await expect(items).toHaveCount(5);

    for (const title of ESSENTIALS_TITLES) {
      await expect(list.getByText(title, { exact: true })).toBeVisible();
      await expect(
        list.getByRole('button', { name: new RegExp(`verify certificate for ${title}`, 'i') }),
      ).toBeVisible();
    }
  });

  test('thumbnail click opens the Coursera spec verification URL', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');
    await section.scrollIntoViewIfNeeded();
    const thumbBtn = section.getByRole('button', {
      name: /view google ai essentials certificate on coursera/i,
    });
    await thumbBtn.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await thumbBtn.click();
    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'coursera.org/account/accomplishments/specialization/0YNZJF3R5PJA',
    );
    expect(calls[0].target).toBe('_blank');
  });

  test('parent badge click opens the Credly public_url for Essentials', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');
    await section.scrollIntoViewIfNeeded();
    const parentBadge = section.getByRole('button', {
      name: /view google ai essentials parent badge on credly/i,
    });
    await parentBadge.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await parentBadge.click();
    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url',
    );
    expect(calls[0].target).toBe('_blank');
  });

  test('description renders inside the card next to the parent badge, not in the header', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('section[aria-labelledby="specialization-path-heading"]');
    const description = section.getByText(/Google's flagship 5-course specialization/i);
    await expect(description).toBeVisible();
    await expect(description).toContainText(/practical AI literacy/i);
    await expect(description).toContainText(/staying current/i);
  });
});

test.describe('Certifications — Google AI Professional Certificate specialization path', () => {
  test('header heading splits into two lines, no descriptive paragraph in header', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(
      'section[aria-labelledby="specialization-path-heading-professional"]',
    );
    await expect(section).toBeVisible();

    const heading = section.getByRole('heading', { level: 2 });
    await expect(heading).toBeVisible();
    await expect(heading.locator('span').nth(0)).toHaveText('Google AI Professional Certificate');
    await expect(heading.locator('span').nth(1)).toHaveText('7-Course Journey');

    const headerBlock = section.locator(':scope > div').first();
    await expect(headerBlock.locator('p')).toHaveCount(0);
  });

  test('card has thumbnail with AI Skills ribbon, no in-card title h3, no Verify Specialization button, no Specialization-Complete pill', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(
      'section[aria-labelledby="specialization-path-heading-professional"]',
    );

    await expect(section.locator('img[alt="Google"]')).toHaveCount(1);
    await expect(section.locator('img[alt="Coursera"]')).toHaveCount(0);
    await expect(section.getByText('AI Skills', { exact: true })).toBeVisible();

    await expect(
      section.getByRole('button', {
        name: /view google ai professional certificate certificate on coursera/i,
      }),
    ).toBeVisible();

    await expect(
      section.getByRole('button', { name: /verify specialization/i }),
    ).toHaveCount(0);
    await expect(
      section.getByText(/specialization · complete/i),
    ).toHaveCount(0);
    await expect(
      section.getByRole('heading', { level: 3, name: 'Google AI Professional Certificate' }),
    ).toHaveCount(0);
  });

  test('right column has 7 child badges in 2-3-2 formation; parent badge sits in the left column next to the description; each tile has a clickable VERIFY linker', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(
      'section[aria-labelledby="specialization-path-heading-professional"]',
    );

    // Parent badge moved to the LEFT column alongside the description text.
    const parentBadge = section.getByRole('button', {
      name: /view google ai professional certificate parent badge on credly/i,
    });
    await expect(parentBadge).toBeVisible();

    // Right column: ordered list of 7 child badges (2-3-2 grid layout).
    const list = page.getByTestId('specialization-courses-list-professional');
    const items = list.locator('li');
    await expect(items).toHaveCount(7);

    // Each list item exposes BOTH (a) a clickable badge button → Credly URL,
    // and (b) a clickable VERIFY linker → Coursera course-verification URL.
    for (const title of PRO_CERT_TITLES) {
      const badgeBtn = list.getByRole('button', {
        name: new RegExp(`view ${title} verified badge on credly`, 'i'),
      });
      await expect(badgeBtn).toBeVisible();

      const verifyBtn = list.getByRole('button', {
        name: new RegExp(`verify ${title} certificate on coursera`, 'i'),
      });
      await expect(verifyBtn).toBeVisible();
    }
  });

  test('VERIFY linker on a child tile opens that course\'s Coursera verify URL', async ({ page }) => {
    await page.goto('/certifications');

    const list = page.getByTestId('specialization-courses-list-professional');
    await list.scrollIntoViewIfNeeded();
    const verifyBtn = list.getByRole('button', {
      name: /verify ai fundamentals certificate on coursera/i,
    });
    await verifyBtn.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await verifyBtn.click();
    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    // AI Fundamentals course verify URL.
    expect(calls[0].url).toContain(
      'coursera.org/account/accomplishments/verify/M0X9KDJN1WFF',
    );
    expect(calls[0].target).toBe('_blank');
  });

  test('thumbnail click opens the Coursera spec verification URL (1B8PEYYE6E6R)', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(
      'section[aria-labelledby="specialization-path-heading-professional"]',
    );
    const thumbBtn = section.getByRole('button', {
      name: /view google ai professional certificate certificate on coursera/i,
    });

    await spyOnWindowOpen(page);
    await thumbBtn.click();
    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'coursera.org/account/accomplishments/specialization/1B8PEYYE6E6R',
    );
    expect(calls[0].target).toBe('_blank');
  });

  test('child badge click opens its respective Credly badge URL', async ({ page }) => {
    await page.goto('/certifications');

    const list = page.getByTestId('specialization-courses-list-professional');
    await list.scrollIntoViewIfNeeded();
    const fundamentalsTile = list.getByRole('button', {
      name: /view ai fundamentals verified badge on credly/i,
    });
    await fundamentalsTile.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await fundamentalsTile.click();
    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'credly.com/badges/619780f5-f2e2-4940-b763-7a7cdd030b08/public_url',
    );
    expect(calls[0].target).toBe('_blank');
  });

  test('description renders inside the card next to the parent badge, not in the header', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(
      'section[aria-labelledby="specialization-path-heading-professional"]',
    );
    const description = section.getByText(/Google's applied 7-course professional certificate/i);
    await expect(description).toBeVisible();
    await expect(description).toContainText(/real workplace use cases/i);
    await expect(description).toContainText(/app building/i);
  });
});
