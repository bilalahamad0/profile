import { test, expect, type Page } from '@playwright/test';

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

const PM_TITLES = [
  'Foundations of Project Management',
  'Project Initiation: Starting a Successful Project',
  'Project Planning: Putting It All Together',
  'Project Execution: Running the Project',
  'Agile Project Management',
  'Capstone: Applying Project Management in the Real World',
  'Accelerate Your Job Search with AI',
];

const CREDENTIAL_TITLES = [
  'Google Project Management Certificate',
  'Google AI Professional Certificate',
  'Google Prompting Essentials',
  'Google AI Essentials',
  'Software Testing Foundations: Integrating AI into the Quality Process',
  'AI Coding Agents with GitHub Copilot and Cursor',
  'ISTQB Foundation Level',
  'Project Management Foundations',
  'Scrum: Advanced',
  'How to Master Your Executive Presence',
  'Javascript Essential Training',
  'iOS App Development: Essential Courses',
];

async function spyOnWindowOpen(page: Page) {
  await page.evaluate(() => {
    // @ts-expect-error attach probe state for the test
    window.__openCalls = [];
    window.open = (url, target) => {
      // @ts-expect-error read probe state
      window.__openCalls.push({ url: String(url), target: String(target) });
      return null;
    };
  });
}

async function readOpenCalls(page: Page) {
  return page.evaluate(
    // @ts-expect-error read probe state
    () => window.__openCalls as Array<{ url: string; target: string }>,
  );
}

/** Expand a credential row via its heading toggle button. */
async function expandRow(page: Page, rowSelector: string) {
  const toggle = page
    .locator(rowSelector)
    .getByRole('button', { expanded: false })
    .first();
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await expect(
    page.locator(rowSelector).locator('[aria-expanded="true"]').first(),
  ).toBeVisible();
}

test.describe('Certifications — Page-level layout', () => {
  test('ATS: every credential and course title is in the raw server HTML with zero interaction', async ({ request }) => {
    const res = await request.get('/certifications');
    expect(res.status()).toBe(200);
    const decode = (s: string) =>
      s
        .replace(/&amp;/g, '&')
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"');
    const html = decode(await res.text());
    for (const title of [
      ...CREDENTIAL_TITLES,
      ...PRO_CERT_TITLES,
      ...ESSENTIALS_TITLES,
      ...PM_TITLES,
    ]) {
      expect(html, `raw HTML must contain "${title}"`).toContain(title);
    }
    expect(html).toContain('Google · Coursera');
    expect(html).toContain('LinkedIn Learning');
    expect(html).toContain('ISTQB');
  });

  test('four category groups render in order with jump pills and a computed stats strip', async ({ page }) => {
    await page.goto('/certifications');

    const groups = page.locator('section[id^="group-"]');
    await expect(groups).toHaveCount(4);
    const ids = await groups.evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(['group-ai', 'group-testing', 'group-leadership', 'group-engineering']);

    // Jump pills navigate to each group.
    const nav = page.getByRole('navigation', { name: /certification categories/i });
    await expect(nav.locator('a[href="#group-ai"]')).toBeVisible();
    await expect(nav.locator('a[href="#group-engineering"]')).toBeVisible();

    // Stats strip is computed from the data arrays.
    await expect(page.getByText('Course Certificates', { exact: true })).toBeVisible();
    await expect(page.getByText('Google Specializations', { exact: true })).toBeVisible();
  });

  test('specialization sections keep their aria-labelledby wrappers; AI group orders Pro → Prompting → Essentials, PM lives in Leadership', async ({ page }) => {
    await page.goto('/certifications');

    const sections = page.locator(
      'section[aria-labelledby^="specialization-path-heading"]',
    );
    await expect(sections).toHaveCount(4);

    const ids = await sections.evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-labelledby')),
    );
    expect(ids).toEqual([
      'specialization-path-heading-professional',
      'specialization-path-heading-prompting',
      'specialization-path-heading',
      'specialization-path-heading-pm',
    ]);
  });

  test('the standalone "Verifiable Credly Badges" section is gone', async ({ page }) => {
    await page.goto('/certifications');
    await expect(page.getByTestId('credly-badges-grid')).toHaveCount(0);
    await expect(
      page.locator('section[aria-labelledby="credly-badges-heading"]'),
    ).toHaveCount(0);
  });

  test('no horizontal overflow at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/certifications');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('Certifications — collapse/expand behavior', () => {
  test('only the Google AI Professional row starts expanded; collapsed content stays attached but hidden', async ({ page }) => {
    await page.goto('/certifications');

    const proToggle = page.locator('#spec-google-ai-professional [aria-expanded]');
    await expect(proToggle).toHaveAttribute('aria-expanded', 'true');

    const pmToggle = page.locator('#spec-google-project-management [aria-expanded]');
    await expect(pmToggle).toHaveAttribute('aria-expanded', 'false');

    // Collapsed course list is in the DOM (ATS) but not visible; its panel is inert.
    const pmList = page.getByTestId('specialization-courses-list-pm');
    await expect(pmList).toBeAttached();
    await expect(
      page.locator('#spec-google-project-management [data-collapsible]'),
    ).toHaveAttribute('inert', '');
    await expect(
      page.locator('#spec-google-ai-professional [data-collapsible]'),
    ).not.toHaveAttribute('inert', '');
  });

  test('clicking a row heading expands and collapses its panel', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('#spec-google-project-management');
    const toggle = section.locator('button[aria-expanded]');
    await toggle.scrollIntoViewIfNeeded();

    const panel = section.locator('[data-collapsible]');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // The panel itself gains height — a stronger signal than child visibility,
    // since Playwright visibility ignores opacity.
    await expect(panel).toBeVisible();
    await expect(page.getByTestId('specialization-courses-list-pm')).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // Collapsed panel animates back to height 0 → empty bounding box.
    await expect(panel).not.toBeVisible();
  });

  test('keyboard: Enter on the focused heading toggle expands the row', async ({ page }) => {
    await page.goto('/certifications');

    const toggle = page.locator('#cert-g-5 button[aria-expanded]');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('Expand all opens every row in the group and flips to Collapse all', async ({ page }) => {
    await page.goto('/certifications');

    const btn = page.getByTestId('expand-all-group-leadership');
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await expect(btn).toHaveText(/collapse all/i);

    const toggles = page.locator('#group-leadership [aria-expanded]');
    await expect(toggles).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(toggles.nth(i)).toHaveAttribute('aria-expanded', 'true');
    }

    await btn.click();
    await expect(btn).toHaveText(/expand all/i);
  });

  test('deep link #spec-google-prompting-essentials loads with that row expanded', async ({ page }) => {
    await page.goto('/certifications#spec-google-prompting-essentials');

    const toggle = page.locator('#spec-google-prompting-essentials [aria-expanded]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('specialization-courses-list-prompting')).toBeVisible();
  });

  test('header Verify works on a collapsed row without expanding it', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator('#spec-google-project-management');
    await section.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await section.getByRole('button', { name: /^verify google project management certificate$/i }).click();

    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'coursera.org/account/accomplishments/professional-cert/RFCXEHN5D07B',
    );
    expect(calls[0].target).toBe('_blank');
    await expect(section.locator('[aria-expanded]')).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Certifications — Google AI Professional Certificate row (default open)', () => {
  const SECTION = '#spec-google-ai-professional';

  test('row header shows title, meta line with journey count, courses chip, and Verified', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(SECTION);
    const heading = section.getByRole('heading', { level: 3 }).first();
    await expect(heading.locator('span').nth(0)).toHaveText('Google AI Professional Certificate');
    await expect(heading.locator('span').nth(1)).toContainText('7-Course Journey');
    // Chips are hidden below the sm breakpoint — assert on desktop viewports only.
    if ((page.viewportSize()?.width ?? 1280) >= 640) {
      await expect(section.getByText('7 Courses', { exact: true })).toBeVisible();
      await expect(section.getByText('Verified', { exact: true })).toBeVisible();
    }
  });

  test('expanded body: 7 child badges in 2-3-2 grid, each with badge + verify buttons; parent badge next to description', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(SECTION);
    const parentBadge = section.getByRole('button', {
      name: /view google ai professional certificate parent badge on credly/i,
    });
    await expect(parentBadge).toBeVisible();

    const list = page.getByTestId('specialization-courses-list-professional');
    await expect(list.locator('li')).toHaveCount(7);

    for (const title of PRO_CERT_TITLES) {
      await expect(
        list.getByRole('button', { name: new RegExp(`view ${title} verified badge on credly`, 'i') }),
      ).toBeVisible();
      await expect(
        list.getByRole('button', { name: new RegExp(`verify ${title} certificate on coursera`, 'i') }),
      ).toBeVisible();
    }
  });

  test('AI Skills ribbon renders on the expanded thumbnail', async ({ page }) => {
    await page.goto('/certifications');
    await expect(page.locator(SECTION).getByText('AI Skills', { exact: true })).toBeVisible();
  });

  test('child badge click opens its Credly URL; VERIFY linker opens the course verify URL', async ({ page }) => {
    await page.goto('/certifications');

    const list = page.getByTestId('specialization-courses-list-professional');
    await list.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await list.getByRole('button', { name: /view ai fundamentals verified badge on credly/i }).click();
    await list.getByRole('button', { name: /verify ai fundamentals certificate on coursera/i }).click();

    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(2);
    expect(calls[0].url).toContain('credly.com/badges/619780f5-f2e2-4940-b763-7a7cdd030b08/public_url');
    expect(calls[1].url).toContain('coursera.org/account/accomplishments/verify/M0X9KDJN1WFF');
  });

  test('thumbnail click opens the Coursera spec verification URL (1B8PEYYE6E6R)', async ({ page }) => {
    await page.goto('/certifications');

    const thumbBtn = page.locator(SECTION).getByRole('button', {
      name: /view google ai professional certificate certificate on coursera/i,
    });
    await thumbBtn.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await thumbBtn.click();
    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain(
      'coursera.org/account/accomplishments/specialization/1B8PEYYE6E6R',
    );
  });

  test('description renders inside the expanded body', async ({ page }) => {
    await page.goto('/certifications');
    const description = page
      .locator(SECTION)
      .getByText(/Google's applied 7-course professional certificate/i);
    await expect(description).toBeVisible();
    await expect(description).toContainText(/real workplace use cases/i);
  });
});

test.describe('Certifications — Google AI Essentials row', () => {
  const SECTION = '#spec-google-ai-essentials';

  test('expanded body lists all 5 courses with verify linkers; parent badge opens Credly', async ({ page }) => {
    await page.goto('/certifications');
    await expandRow(page, SECTION);

    const list = page.getByTestId('specialization-courses-list');
    await expect(list.locator('li')).toHaveCount(5);
    for (const title of ESSENTIALS_TITLES) {
      await expect(list.getByText(title, { exact: true })).toBeVisible();
      await expect(
        list.getByRole('button', { name: new RegExp(`verify certificate for ${title}`, 'i') }),
      ).toBeVisible();
    }

    await spyOnWindowOpen(page);
    const parentBadge = page.locator(SECTION).getByRole('button', {
      name: /view google ai essentials parent badge on credly/i,
    });
    await parentBadge.scrollIntoViewIfNeeded();
    await parentBadge.click();
    const calls = await readOpenCalls(page);
    expect(calls[0].url).toContain('credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url');
  });

  test('thumbnail click opens the Coursera spec verification URL (0YNZJF3R5PJA)', async ({ page }) => {
    await page.goto('/certifications');
    await expandRow(page, SECTION);

    const thumbBtn = page.locator(SECTION).getByRole('button', {
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
  });
});

test.describe('Certifications — Google Project Management Certificate row', () => {
  const SECTION = '#spec-google-project-management';

  test('row sits in the Leadership group with a PM Skills chip; expanded body shows the ribbon', async ({ page }) => {
    await page.goto('/certifications');

    const section = page.locator(SECTION);
    expect(await section.evaluate((el) => Boolean(el.closest('#group-leadership')))).toBe(true);

    const heading = section.getByRole('heading', { level: 3 }).first();
    await expect(heading.locator('span').nth(0)).toHaveText('Google Project Management Certificate');
    await expect(heading.locator('span').nth(1)).toContainText('7-Course Journey');

    await expandRow(page, SECTION);
    await expect(section.getByText('PM Skills', { exact: true }).last()).toBeVisible();
  });

  test('expanded body lists all 7 courses with icons and a Bonus tag on course 7', async ({ page }) => {
    await page.goto('/certifications');
    await expandRow(page, SECTION);

    const list = page.getByTestId('specialization-courses-list-pm');
    await expect(list.locator('li')).toHaveCount(7);

    for (const title of PM_TITLES) {
      await expect(list.getByText(title, { exact: true })).toBeVisible();
      await expect(
        list.getByRole('button', { name: new RegExp(`verify certificate for ${title}`, 'i') }),
      ).toBeVisible();
    }

    await expect(list.locator('img')).toHaveCount(7);
    await expect(list.getByText('Bonus', { exact: true })).toBeVisible();
  });

  test('course VERIFY opens its Coursera record; parent badge opens Credly', async ({ page }) => {
    await page.goto('/certifications');
    await expandRow(page, SECTION);

    const list = page.getByTestId('specialization-courses-list-pm');
    await list.scrollIntoViewIfNeeded();

    await spyOnWindowOpen(page);
    await list
      .getByRole('button', { name: /verify certificate for foundations of project management/i })
      .click();
    const parentBadge = page.locator(SECTION).getByRole('button', {
      name: /view google project management certificate parent badge on credly/i,
    });
    await parentBadge.scrollIntoViewIfNeeded();
    await parentBadge.click();

    const calls = await readOpenCalls(page);
    expect(calls).toHaveLength(2);
    expect(calls[0].url).toContain('coursera.org/account/accomplishments/records/MX7DVBTMZZ82');
    expect(calls[1].url).toContain('credly.com/badges/00d274f5-2041-409e-803c-963f299371ab/public_url');
  });
});

test.describe('Certifications — single-certificate rows', () => {
  test('ISTQB flagship row: official badge chip collapsed, badge + verify in expanded body', async ({ page }) => {
    await page.goto('/certifications');

    const row = page.locator('#cert-g-1');
    await row.scrollIntoViewIfNeeded();
    // The Official Badge chip is hidden below the lg breakpoint.
    if ((page.viewportSize()?.width ?? 1280) >= 1024) {
      await expect(row.getByText('Official Badge', { exact: true })).toBeVisible();
    }

    await expandRow(page, '#cert-g-1');
    await expect(row.getByAltText(/istqb foundation level official badge/i)).toBeVisible();

    await spyOnWindowOpen(page);
    await row.getByRole('button', { name: /verify istqb foundation level certificate/i }).click();
    const calls = await readOpenCalls(page);
    expect(calls[0].url).toContain('istqb.in/foundation/certified-tester2/40317-bilal-ahamad');
  });

  test('LinkedIn single row expands to full description and opens the lightbox for full-size inspection', async ({ page }) => {
    await page.goto('/certifications');
    await expandRow(page, '#cert-ai-1');

    const row = page.locator('#cert-ai-1');
    await expect(
      row.getByText(/Deep dive into leveraging AI agents, GitHub Copilot, and Cursor/i),
    ).toBeVisible();

    await row.getByRole('button', { name: /view .* certificate full size/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('AI Coding Agents with GitHub Copilot and Cursor')).toBeVisible();

    await dialog.getByRole('button', { name: /back to album/i }).click();
    await expect(dialog).not.toBeVisible();
  });
});
