import { test, expect, type Locator, type Page } from '@playwright/test';

const GOOGLE_SKILLS_BADGE_URL =
  /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/;
const CREDLY_BADGE_URL = /^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url$/;
const BADGE_URL =
  /^(https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+|https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url)$/;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Course titles, verbatim. Several repeat ACROSS cards (Google reuses courses
// between paths), so every text locator below is scoped to its card.
// Three, not the six activities Google's path page counts. Two are the
// Welcome/Wrap Up bookends, which are never courses; the third is a badge-less
// hands-on lab the owner dropped from the data on 2026-09-12. So this card has
// 3 units and 3 badge links.
const MULTI_AGENT_COURSES = [
  'Build Collaborative Multi-Agent Systems with ADK & MCP',
  'Build Agent Skills with Google',
  'Use Agent Skills with Multi-Agent Systems',
];
// Three, not the five activities Google's path page counts — the Welcome/Wrap Up
// bookends are never courses. Step 3 earns a Credly skill badge, so all three
// tiles are badged and one glows.
const DEPLOY_COURSES = [
  'Build and Deploy Agents in Production',
  'Deploy Your First Agent',
  'Deploy Multi-Agent Architectures',
];
const BEGINNER_COURSES = [
  'Introduction to Generative AI',
  'Introduction to Large Language Models',
  'Prompt Design in Agent Platform',
  'Responsible AI: Applying AI Principles with Google Cloud',
];
// Three, not the five activities Google's path page counts: "Welcome:" and
// "Wrap Up:" are bookends, never courses (the standing rule, guarded in
// src/app/certifications/data.test.ts).
const AGENTS_COURSES = [
  'Agent Fundamentals',
  'Enterprise Agents and Use Cases',
  'Create Your First Gemini Enterprise Application',
];
const SMB_COURSES = [
  'Introduction to Generative AI',
  'Introduction to Large Language Models',
  'Introduction to AI Agents',
  'Agent Fundamentals',
  'Enterprise Agents and Use Cases',
  'Create Your First Gemini Enterprise Application',
  'Google Workspace with Gemini: Foundations of Your AI Workflow',
  'Gemini in Gmail',
  'Gemini in Google Sheets',
  'AI Boost Bites: TL;DR with Gemini in Docs & Drive',
  'AI Boost Bites: Gemini Gems – Your ultimate marketing sidekick',
  'AI Boost Bites: Content Generation with Gemini Made Easy',
  'Gemini in Google Vids',
];
const LEADER_COURSES = [
  'Gen AI: Beyond the Chatbot',
  'Gen AI: Unlock Foundational Concepts',
  'Gen AI: Navigate the Landscape',
  'Gen AI Apps: Transform Your Work',
  'Gen AI Agents: Transform Your Organization',
];
const STANFORD_MODULES = ['Cool Applications', 'Sensors', 'Embedded Systems', 'Networking', 'Circuits'];

type Card = {
  section: 'google-skills' | 'continuing-education';
  id: string;
  title: string;
  meta: string;          // the full collapsed meta line, exact
  chip: string;
  numeral: string;
  linkLabel: 'Path page' | 'Course page';
  urlNoun: 'path' | 'course';
  issuerShort: 'Google Skills' | 'Stanford';
  url: RegExp;
  courses: string[];
  /** Badge links on the card. Equals courses.length on every Google card —
   *  every listed course carries a badge — and 0 on Stanford. */
  badges: number;
  credly: number;
  pill: RegExp;
};

/** The CURATED top-to-bottom order the owner chose on 2026-09-11, which is also
 *  the order LEARNING_PATHS is written in and the order these numerals assert.
 *  It is NOT chronological: path 3802 was completed last of the six and renders
 *  fourth. Never re-sort this list by date. */
const CARDS: Card[] = [
  { section: 'google-skills', id: 'ce-google-skills-gen-ai-leader-1951',
    title: 'Generative AI Leader',
    meta: 'Google Skills · Sep 2026 · 5-Course Path · “Train for the exam”',
    chip: '5 Courses', numeral: '01',
    linkLabel: 'Path page', urlNoun: 'path', issuerShort: 'Google Skills',
    url: /^https:\/\/www\.skills\.google\/paths\/1951$/,
    courses: LEADER_COURSES, badges: 5, credly: 0, pill: /^5 public course badges$/i },
  { section: 'google-skills', id: 'ce-google-skills-smb-4020',
    title: 'SMB Learning Path',
    meta: 'Google Skills · Sep 2026 · 13-Course Path', chip: '13 Courses', numeral: '02',
    linkLabel: 'Path page', urlNoun: 'path', issuerShort: 'Google Skills',
    url: /^https:\/\/www\.skills\.google\/paths\/4020$/,
    courses: SMB_COURSES, badges: 13, credly: 1, pill: /^13 public course badges$/i },
  { section: 'google-skills', id: 'ce-google-skills-multi-agent-4459',
    title: 'Build High-Performance Multi-Agent Systems',
    meta: 'Google Skills · Sep 2026 · 3-Course Path', chip: '3 Courses', numeral: '03',
    linkLabel: 'Path page', urlNoun: 'path', issuerShort: 'Google Skills',
    url: /^https:\/\/www\.skills\.google\/paths\/4459$/,
    courses: MULTI_AGENT_COURSES, badges: 3, credly: 0, pill: /^3 public course badges$/i },
  { section: 'google-skills', id: 'ce-google-skills-deploy-agents-3802',
    title: 'Deploy Production Ready Agents',
    meta: 'Google Skills · Sep 2026 · 3-Course Path', chip: '3 Courses', numeral: '04',
    linkLabel: 'Path page', urlNoun: 'path', issuerShort: 'Google Skills',
    url: /^https:\/\/www\.skills\.google\/paths\/3802$/,
    courses: DEPLOY_COURSES, badges: 3, credly: 1, pill: /^3 public course badges$/i },
  { section: 'google-skills', id: 'ce-google-skills-agents-3546',
    title: 'Introduction to Agents and Google’s Agent Ecosystem',
    meta: 'Google Skills · Sep 2026 · 3-Course Path', chip: '3 Courses', numeral: '05',
    linkLabel: 'Path page', urlNoun: 'path', issuerShort: 'Google Skills',
    url: /^https:\/\/www\.skills\.google\/paths\/3546$/,
    courses: AGENTS_COURSES, badges: 3, credly: 1, pill: /^3 public course badges$/i },
  { section: 'google-skills', id: 'ce-google-skills-beginner-gen-ai-118',
    title: 'Beginner: Introduction to Generative AI',
    meta: 'Google Skills · Sep 2026 · 4-Course Path', chip: '4 Courses', numeral: '06',
    linkLabel: 'Path page', urlNoun: 'path', issuerShort: 'Google Skills',
    url: /^https:\/\/www\.skills\.google\/paths\/118$/,
    courses: BEGINNER_COURSES, badges: 4, credly: 1, pill: /^4 public course badges$/i },
  { section: 'continuing-education', id: 'ce-stanford-xee100',
    title: 'Introduction to Internet of Things',
    meta: 'Stanford School of Engineering · 2026 · 5-Module Course',
    chip: '5 Modules', numeral: '07',
    linkLabel: 'Course page', urlNoun: 'course', issuerShort: 'Stanford',
    url: /^https:\/\/online\.stanford\.edu\/courses\/xee100-introduction-internet-things$/,
    courses: STANFORD_MODULES, badges: 0, credly: 0, pill: /^5 course modules$/i },
];

const badgeLinks = (scope: Locator) =>
  scope.getByRole('link', {
    name: /(completion|skill) badge on (Google Skills|Credly), opens in a new tab$/i,
  });
const credlyLinks = (scope: Locator) =>
  scope.getByRole('link', { name: /badge on Credly, opens in a new tab$/i });
/** The two issuer-page controls per card, each with its OWN accessible name.
 *  There were three: the expanded panel also opened with a large issuer slab
 *  standing in for a specialization's certificate thumbnail. That slab is gone
 *  with the two-column panel, so `heroLink` is gone with it — and the test
 *  below asserts its accessible name is nowhere on the card. */
const rowLink = (card: Locator, c: Card) =>
  card.getByRole('link', {
    name: `${c.linkLabel} for ${c.title} on ${c.issuerShort} (opens in a new tab)`,
  });
/** The deleted hero slab's accessible name — must match nothing. */
const heroLinkGone = (card: Locator, c: Card) =>
  card.getByRole('link', {
    name: `View the ${c.title} ${c.urlNoun} page on ${c.issuerShort} (opens in a new tab)`,
  });
const detailsLink = (card: Locator, c: Card) =>
  card.getByRole('link', {
    name: `${c.title} ${c.urlNoun} details on ${c.issuerShort} (opens in a new tab)`,
  });
/** The row title itself. The h3 wraps the whole toggle, so its textContent also
 *  carries the meta line — the title lives in the button's first span, exactly
 *  as it does on every specialization row. */
const rowTitle = (card: Locator) => card.locator('h3 button > span').first();
/** Chips and the header count line are `hidden … sm:block/flex` on the shared
 *  template, so below 640px they are in the DOM but not painted. Mobile Chrome
 *  (Pixel 5, 393px) runs this file too. */
const wideViewport = (page: Page) => (page.viewportSize()?.width ?? 0) >= 640;
/** Open a row so its panel is measurable — the panel is `inert` while closed.
 *
 *  RETRIES the click. The row toggle is server-rendered with
 *  `aria-expanded="false"` and only starts responding once CredentialLedger
 *  hydrates, so a single click can land on inert markup, do nothing, and leave
 *  the assertion to time out. That never reproduced locally on a warm dev
 *  machine but failed on CI's slower runner (2026-09-12: one hard failure plus
 *  four flaky, every one of them an expansion). Polling the click instead of
 *  firing it once removes the race without weakening anything — the assertion
 *  is still that the row really opened. */
const openRow = async (page: Page, id: string) => {
  const toggle = page.locator(`#${id} button[aria-expanded]`);
  await expect(toggle).toBeVisible();
  await expect(async () => {
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true', { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
};

/** Same hydration race, for the group-level Expand/Collapse all buttons: they
 *  are inert until the ledger hydrates. `assert` runs after each attempt and
 *  must throw until the click has taken effect. */
const clickUntil = async (target: Locator, assert: () => Promise<void>) => {
  await expect(target).toBeVisible();
  await expect(async () => {
    await target.click();
    await assert();
  }).toPass({ timeout: 15_000 });
};

/** Expand every row in a section, retried past hydration. The button's own
 *  label flipping to "Collapse all" is the proof the click landed. */
const expandAll = async (page: Page, section: 'google-skills' | 'continuing-education') => {
  const btn = page.getByTestId(`expand-all-${section}`);
  await clickUntil(btn, async () => {
    await expect(btn).toHaveText('Collapse all', { timeout: 1_000 });
  });
};

test.describe('Certifications — completed coursework (Google Skills + Continuing Education)', () => {
  test('ATS: every path, issuer, course title and citation is in the raw server HTML with zero JavaScript', async ({ request }) => {
    const res = await request.get('/certifications');
    expect(res.status()).toBe(200);
    const decode = (s: string) =>
      s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#x2F;/g, '/').replace(/&amp;/g, '&');
    const html = decode(await res.text());
    for (const needle of new Set<string>([
      'Google Skills', 'Continuing Education', 'Completed Learning Paths',
      'Stanford School of Engineering', 'XEE100',
      '6 learning paths · 26 course badges', '1 short course · 5 modules',
      'Generative AI Leader Certification', 'Train for the exam',
      'Google Cloud Generative AI Leader certification',
      'six Stanford faculty members will deliver an overview',
      ...CARDS.map((c) => c.title),
      ...CARDS.flatMap((c) => c.courses),
    ])) {
      expect(html, `raw HTML must contain "${needle}"`).toContain(needle);
    }
    // The removed annotation: the tile shows Google's course name alone now, so
    // Credly's own name for that badge appears nowhere on the page.
    expect(html).not.toContain('Prompt Design in Vertex AI');
    expect(html).not.toContain('(Credly:');
  });

  test('neither section prints credential vocabulary anywhere in its markup', async ({ request }) => {
    const html = await (await request.get('/certifications')).text();
    for (const id of ['google-skills', 'continuing-education']) {
      const start = html.indexOf(`id="${id}"`);
      expect(start, `#${id} missing`).toBeGreaterThan(-1);
      // Both sections are <section>s whose rows are <article>s, so the first
      // </section> after the opening tag closes the section.
      const body = html.slice(start, html.indexOf('</section>', start));
      expect(body).not.toMatch(/certified/i);
      expect(body).not.toMatch(/all verified/i);
      expect(body).not.toMatch(/\bcredentials?\b/i);
      // The badge pill is the ONE licensed use of the word in these two
      // sections: it labels a public, login-free BADGE page. It reads "Verify
      // in Credly" on a Credly badge and a bare "Verify" on every other
      // provider (the owner's wording, 2026-09-11) — and "Verify in Google
      // Skills" is now gone entirely. Strip the pills longest-first, then
      // nothing else on the card may claim verification.
      expect(body).not.toMatch(/Verify in (?:<!-- -->)?Google Skills/);
      const rest = body
        .replace(/Verify in (?:<!-- -->)?Credly/g, '')
        .replace(/Verify/g, '');
      expect(rest).not.toMatch(/\bverif(y|ied)\b/i);
      expect(body).not.toMatch(
        /no certificate|issues no|not a certification|exam not taken|non-credential|not counted|non-credit/i,
      );
    }
  });

  test('neither section joins the four counted ledger groups, and the stats strip is unmoved', async ({ page }) => {
    await page.goto('/certifications');
    await expect(page.locator('section[id^="group-"]')).toHaveCount(4);
    await expect(page.locator('section[aria-labelledby^="specialization-path-heading"]')).toHaveCount(4);
    await expect(page.locator('#google-skills')).toBeVisible();
    await expect(page.locator('#continuing-education')).toBeVisible();
    const credentialsCell = page
      .locator('dl > div')
      .filter({ has: page.getByText('Credentials', { exact: true }) });
    await expect(credentialsCell.locator('dd')).toHaveText('15');
  });

  test('both group headers count the real thing and say nothing about certificates', async ({ page }) => {
    await page.goto('/certifications');
    const google = page.locator('#google-skills');
    await expect(google.getByRole('heading', { level: 2 })).toHaveText('Google Skills');
    await expect(google.getByText('Completed Learning Paths', { exact: true })).toBeVisible();
    const googleCount = google.getByText('6 learning paths · 26 course badges', { exact: true });
    await (wideViewport(page) ? expect(googleCount).toBeVisible() : expect(googleCount).toBeAttached());
    const cont = page.locator('#continuing-education');
    await expect(cont.getByRole('heading', { level: 2 })).toHaveText('Continuing Education');
    await expect(cont.getByText('Stanford School of Engineering', { exact: true }).first()).toBeVisible();
    const contCount = cont.getByText('1 short course · 5 modules', { exact: true });
    await (wideViewport(page) ? expect(contCount).toBeVisible() : expect(contCount).toBeAttached());
  });

  test('every card uses the credential row template: article, numeral, meta, chip, disclosure, panel', async ({ page }) => {
    await page.goto('/certifications');
    for (const card of CARDS) {
      const el = page.locator(`#${card.id}`);
      await expect(el).toBeVisible();
      // <article>, not <section> — that is what keeps the frozen counts at 4.
      expect(await el.evaluate((n) => n.tagName)).toBe('ARTICLE');
      await expect(el).toHaveAttribute('aria-labelledby', `${card.id}-heading`);
      await expect(el.getByRole('heading', { level: 3 })).toHaveCount(1);
      await expect(rowTitle(el)).toHaveText(card.title);
      const toggle = el.locator('button[aria-expanded]');
      await expect(toggle).toHaveCount(1);
      await expect(toggle).toHaveAttribute('id', `${card.id}-heading`);
      await expect(toggle).toHaveAttribute('aria-controls', `${card.id}-panel`);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false'); // collapsed by default
      await expect(el.getByText(card.meta, { exact: true })).toBeVisible();
      const chip = el.getByText(card.chip, { exact: true });
      await (wideViewport(page) ? expect(chip).toBeVisible() : expect(chip).toBeAttached());
      await expect(el.locator('[data-collapsible]')).toHaveCount(1);
      await expect(el.locator('[data-ledger-index]')).toHaveText(card.numeral);
    }
  });

  test('the coursework sections run one continuous ledger, 01–06 then 07, never past 15', async ({ page }) => {
    await page.goto('/certifications');
    const nums = (sel: string) =>
      page.locator(`${sel} [data-ledger-index]`).evaluateAll((els) =>
        els.map((e) => e.textContent?.trim()),
      );
    expect(await nums('#google-skills')).toEqual(['01', '02', '03', '04', '05', '06']);
    expect(await nums('#continuing-education')).toEqual(['07']);
    // And the cards carry those numerals in the owner's curated sequence, which
    // is what makes the order itself an assertion rather than a coincidence.
    const titles = await page
      .locator('#google-skills article[id^="ce-"] h3 button > span:first-child')
      .evaluateAll((els) => els.map((e) => e.textContent?.trim()));
    expect(titles).toEqual(
      CARDS.filter((c) => c.section === 'google-skills').map((c) => c.title),
    );
  });

  test('the Verify slot holds the issuer page link — never a Verify control', async ({ page }) => {
    await page.goto('/certifications');
    for (const card of CARDS) {
      const el = page.locator(`#${card.id}`);
      const link = rowLink(el, card);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('href', card.url);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('data-coursework-link', 'true');
      await expect(el.getByRole('button', { name: /^verify/i })).toHaveCount(0);
      await expect(el.getByText('Verified', { exact: true })).toHaveCount(0);
      await expect(el.locator('[data-verify]')).toHaveCount(0);
    }
  });

  for (const card of CARDS) {
    test(`${card.title} — expanded panel shows the description, the counter and every course unit`, async ({ page }) => {
      await page.goto('/certifications');
      await openRow(page, card.id);
      const el = page.locator(`#${card.id}`);
      await expect(el.getByText(card.pill)).toBeVisible();
      const list = el.locator('ol[data-testid^="coursework-courses-"]');
      await expect(list).toHaveCount(1);
      await expect(list.locator('li')).toHaveCount(card.courses.length);
      for (const course of card.courses) {
        await expect(
          list.locator('li').filter({ hasText: new RegExp(esc(course)) }),
        ).toHaveCount(1);
      }
      // Badge art count is scoped to the list — the panel's issuer logo is not
      // part of it.
      await expect(list.locator('img')).toHaveCount(card.badges);
      await expect(badgeLinks(el)).toHaveCount(card.badges);
      await expect(credlyLinks(el)).toHaveCount(card.credly);
      // Two issuer-page controls, each with its own accessible name — and the
      // deleted hero slab is not one of them.
      for (const locate of [rowLink, detailsLink]) {
        const a = locate(el, card);
        await expect(a).toHaveCount(1);
        await expect(a).toHaveAttribute('href', card.url);
        await expect(a).toHaveAttribute('rel', /noopener/);
      }
      await expect(heroLinkGone(el, card)).toHaveCount(0);
    });
  }

  test('the expanded panel is ONE full-width column, with no issuer slab in it', async ({ page }) => {
    await page.goto('/certifications');
    for (const card of CARDS) {
      await openRow(page, card.id);
      const el = page.locator(`#${card.id}`);
      // The slab is gone: no hero link, and the only issuer tile left on the
      // card is the small one in the collapsed row header, OUTSIDE the panel.
      await expect(heroLinkGone(el, card)).toHaveCount(0);
      const panelTiles = await el
        .locator('[data-collapsible]')
        .evaluateAll((els) =>
          els.flatMap((p) => [...p.querySelectorAll('span')]
            .filter((s) => /^(Google|Stanford)$/.test(s.textContent?.trim() ?? ''))
            .length),
        );
      expect(panelTiles).toEqual([0]);
      // One column: no md:grid-cols-* split survives in the panel, and the
      // course list spans (near enough) the panel's whole content box.
      const fill = await el.locator('[data-collapsible]').evaluate((panel) => {
        const inner = panel.firstElementChild as HTMLElement;
        const cs = getComputedStyle(inner);
        const content =
          inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const list = panel.querySelector<HTMLElement>('ol[data-testid^="coursework-courses-"]');
        return {
          split: [...panel.querySelectorAll('*')].some((n) =>
            /(^|\s)(md|lg):grid-cols-\[/.test(n.className?.toString?.() ?? ''),
          ),
          ratio: (list?.getBoundingClientRect().width ?? 0) / content,
        };
      });
      expect(fill.split, `${card.id} still has a two-column split`).toBe(false);
      expect(fill.ratio, `${card.id} course list fills only ${fill.ratio} of the panel`)
        .toBeGreaterThan(0.95);
    }
  });

  test('every badge pill reads Verify, naming Credly only where it links there, unclipped', async ({ page }) => {
    await page.goto('/certifications');
    await expandAll(page, 'google-skills');
    const links = badgeLinks(page.locator('#google-skills'));
    await expect(links).toHaveCount(31);
    const rows = await links.evaluateAll((els) =>
      els.map((el) => ({
        text: (el.textContent ?? '').replace(/\s+/g, ' '),
        // Every visible span must fit its box: the provider-aware label is
        // longer than the old "Badge" and may wrap, but must never clip.
        clipped: [...el.querySelectorAll('span')]
          .filter((s) => !s.className.includes('sr-only'))
          .some((s) => {
            const cs = getComputedStyle(s);
            return (
              cs.textOverflow === 'ellipsis' ||
              cs.webkitLineClamp !== 'none' ||
              s.scrollWidth > s.clientWidth + 1
            );
          }),
      })),
    );
    for (const { text, clipped } of rows) {
      const provider = /badge on (Google Skills|Credly), opens/.exec(text)?.[1];
      expect(provider, `no provider in "${text}"`).toBeTruthy();
      // Credly keeps its platform name; every other provider reads a bare
      // "Verify". WCAG 2.5.3 still holds because the accessible name (this
      // whole string) contains the visible label either way, and the sr-only
      // suffix still says which platform the link opens.
      if (provider === 'Credly') {
        expect(text, 'a Credly pill must still name Credly').toContain('Verify in Credly');
      } else {
        // `toContain`, not a \b regex: the <a>'s textContent runs the course
        // title straight into the pill ("…ChatbotVerify"), so there is no word
        // boundary before the V.
        expect(text, 'a Google Skills pill must read a bare Verify').toContain('Verify');
        expect(text, 'the platform must be gone from the visible pill').not.toContain(
          'Verify in Google Skills',
        );
      }
      expect(clipped, `a tile span is clipped in "${text}"`).toBe(false);
    }
    expect(rows.filter((r) => r.text.includes('Verify in Credly'))).toHaveLength(4);
    expect(rows.filter((r) => r.text.includes('Verify in Google Skills'))).toHaveLength(0);
    expect(rows.filter((r) => r.text.includes('Verify'))).toHaveLength(31);
  });

  test('only the Credly skill badges glow', async ({ page }) => {
    await page.goto('/certifications');
    await expandAll(page, 'google-skills');
    const tiles = await badgeLinks(page.locator('#google-skills')).evaluateAll((els) =>
      els.map((el) => {
        const spans = [...el.querySelectorAll('span')];
        return {
          credly: /badge on Credly/i.test(el.textContent ?? ''),
          // amber-500 shadow on the white tile…
          amber: spans.some((s) => getComputedStyle(s).boxShadow.includes('245, 158, 11')),
          // …plus the blurred halo behind it.
          halo: spans.some((s) => getComputedStyle(s).filter.startsWith('blur(')),
        };
      }),
    );
    expect(tiles.filter((t) => t.credly)).toHaveLength(4);
    for (const t of tiles) {
      expect(t.amber, 'glow must follow badge.provider === "Credly"').toBe(t.credly);
      expect(t.halo, 'halo must follow badge.provider === "Credly"').toBe(t.credly);
    }
  });

  test('every badge link is a public, login-free page on the provider its name states', async ({ page }) => {
    await page.goto('/certifications');
    await expandAll(page, 'google-skills');
    const links = badgeLinks(page.locator('#google-skills'));
    await expect(links).toHaveCount(31);
    const rows = await links.evaluateAll((els) =>
      els.map((e) => [e.getAttribute('href') ?? '', e.textContent ?? ''] as const),
    );
    for (const [href, text] of rows) {
      expect(href).toMatch(BADGE_URL);
      expect(href).toMatch(/badge on Credly/i.test(text) ? CREDLY_BADGE_URL : GOOGLE_SKILLS_BADGE_URL);
    }
    const hrefs = rows.map(([h]) => h);
    // 31 references, 26 distinct badge pages — the number the header prints.
    expect(new Set(hrefs).size).toBe(26);
    expect(hrefs.filter((h) => CREDLY_BADGE_URL.test(h))).toHaveLength(4);
    expect(hrefs.filter((h) => GOOGLE_SKILLS_BADGE_URL.test(h))).toHaveLength(27);
    // Path 4459's badges (withheld while it was unfinished) and path 3802's.
    for (const id of ['27855015', '27885513', '27886491', '27888328', '27888392']) {
      expect(hrefs.some((h) => h.endsWith(`/badges/${id}`)), `badge ${id} missing`).toBe(true);
    }
  });

  test('all three Credly badges are DISPLAYED as art, not merely linked', async ({ page }) => {
    await page.goto('/certifications');
    await expandAll(page, 'google-skills');
    const srcs = await page
      .locator('#google-skills ol[data-testid^="coursework-courses-"] img')
      .evaluateAll((els) => els.map((e) => e.getAttribute('src') ?? ''));
    // Credly art sits flat in /badges/ (no google-skills segment).
    for (const file of [
      'create-your-first-gemini-enterprise-application',
      'prompt-design-in-vertex-ai',
      'deploy-multi-agent-architectures',
    ]) {
      expect(
        srcs.some((s) => s.includes(`badges%2F${file}.webp`) || s.includes(`badges/${file}.webp`)),
        `${file} not rendered as art`,
      ).toBe(true);
    }
    // Rendered at grid-tile scale, not as a list icon.
    const box = await page
      .locator('#ce-google-skills-beginner-gen-ai-118 ol img')
      .first()
      .boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(60);
  });

  test('the Prompt Design tile shows GOOGLE\'S course name alone, unclipped', async ({ page }) => {
    // The "(Credly: Prompt Design in Vertex AI Skill Badge)" annotation was
    // removed on the owner's instruction (2026-09-11). The tile keeps Google's
    // title — the issuer of the course and of the path page it links from — and
    // the Credly destination is carried by the artwork, the amber glow and the
    // "Verify in Credly" pill instead of by extra words.
    await page.goto('/certifications');
    await openRow(page, 'ce-google-skills-beginner-gen-ai-118');
    const card = page.locator('#ce-google-skills-beginner-gen-ai-118');
    await expect(card).not.toContainText('Prompt Design in Vertex AI');
    await expect(card).not.toContainText('(Credly:');
    const link = card.getByRole('link', {
      name: /^Prompt Design in Agent Platform Verify in Credly/,
    });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', CREDLY_BADGE_URL);
    await expect(link).not.toHaveAttribute('title', /./);
    await expect(link.locator('img')).toHaveCount(1);
    await expect(link.locator('img')).toHaveAttribute('alt', '');
    const clipped = await link.evaluate((el) =>
      Array.from(el.querySelectorAll('span'))
        .filter((s) => !s.className.includes('sr-only'))
        .some((s) => {
          const cs = getComputedStyle(s);
          return (
            cs.textOverflow === 'ellipsis' ||
            cs.webkitLineClamp !== 'none' ||
            s.scrollWidth > s.clientWidth + 1
          );
        }),
    );
    expect(clipped).toBe(false);
  });

  test('no Welcome or Wrap Up bookend is rendered, or present in the HTML, as a course', async ({
    page,
    request,
  }) => {
    // The standing rule, asserted where a reader would see it. Every listed
    // course carries a badge, so a grid's tile count and its link count are now
    // equal on every card — a tile with no link would mean a smuggled bookend.
    const html = await (await request.get('/certifications')).text();
    expect(html).not.toMatch(/Welcome:\s*Introduction to Agents/);
    expect(html).not.toMatch(/Wrap[\s-]?Up:\s*Introduction to Agents/);
    expect(html).not.toMatch(/Welcome:\s*Build High-Performance/);
    expect(html).not.toMatch(/Wrap[\s-]?Up:\s*Build High-Performance/);
    expect(html).not.toMatch(/Welcome:\s*Deploy Production Ready/);
    expect(html).not.toMatch(/Wrap[\s-]?Up:\s*Deploy Production Ready/);
    await page.goto('/certifications');
    await expandAll(page, 'google-skills');
    for (const [testId, tiles, links] of [
      ['coursework-courses-multi-agent', 3, 3],
      ['coursework-courses-deploy-agents', 3, 3],
      ['coursework-courses-beginner-gen-ai', 4, 4],
      ['coursework-courses-agents', 3, 3],
      ['coursework-courses-smb', 13, 13],
      ['coursework-courses-gen-ai-leader', 5, 5],
    ] as const) {
      const items = page.getByTestId(testId).locator('li');
      await expect(items).toHaveCount(tiles);
      await expect(items.locator('a')).toHaveCount(links);
    }
  });

  test('the SMB grid is 4·5·4 with every row centred at desktop width', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/certifications');
    // Row counts and per-row margins for every badge grid on the page, measured
    // from the painted boxes — never inferred from the class names.
    //
    // Wait for the stagger to finish first. panelBadgeVariants animates each
    // tile in from scale 0.85, and a scaled <li> reports a box 15% narrower
    // than its grid cell, centred in it — which reads as ~17px of margin on a
    // row that actually has none. Measuring mid-flight is how this test lies.
    const settle = (testId: string) =>
      page.waitForFunction(
        (id) => {
          const ol = document.querySelector(`[data-testid="${id}"]`);
          if (!ol || ol.children.length === 0) return false;
          return [...ol.children].every((li) => {
            const cs = getComputedStyle(li);
            return (
              (cs.transform === 'none' || cs.transform === 'matrix(1, 0, 0, 1, 0, 0)') &&
              cs.opacity === '1'
            );
          });
        },
        testId,
        { timeout: 10_000 },
      );
    const measure = async (testId: string) => {
      await settle(testId);
      return page.getByTestId(testId).evaluate((ol) => {
        const track = ol.getBoundingClientRect();
        const rows = new Map<number, { left: number; right: number; n: number }>();
        for (const li of [...ol.children]) {
          const b = li.getBoundingClientRect();
          const key = Math.round(b.top);
          const row = rows.get(key) ?? { left: Infinity, right: -Infinity, n: 0 };
          rows.set(key, {
            left: Math.min(row.left, b.left),
            right: Math.max(row.right, b.right),
            n: row.n + 1,
          });
        }
        return [...rows.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([, r]) => ({
            n: r.n,
            // Rounded to the nearest px: sub-pixel track arithmetic is not a
            // centring defect.
            left: Math.round(r.left - track.left),
            right: Math.round(track.right - r.right),
          }));
      });
    };

    await openRow(page, 'ce-google-skills-smb-4020');
    const smb = await measure('coursework-courses-smb');
    expect(smb.map((r) => r.n), `SMB rows were ${JSON.stringify(smb)}`).toEqual([4, 5, 4]);
    for (const row of smb) {
      expect(Math.abs(row.left - row.right), `row ${row.n} is off-centre by ${row.left - row.right}px`)
        .toBeLessThanOrEqual(2);
    }
    // The 4-tile row is inset from the 5-tile row, not flush with it.
    expect(smb[0].left).toBeGreaterThan(smb[1].left + 20);
    expect(smb[1].left).toBeLessThanOrEqual(1);

    // The other counts still read as ONE deliberate full-width row.
    for (const [id, testId, n] of [
      ['ce-google-skills-multi-agent-4459', 'coursework-courses-multi-agent', 3],
      ['ce-google-skills-deploy-agents-3802', 'coursework-courses-deploy-agents', 3],
      ['ce-google-skills-agents-3546', 'coursework-courses-agents', 3],
      ['ce-google-skills-beginner-gen-ai-118', 'coursework-courses-beginner-gen-ai', 4],
      ['ce-google-skills-gen-ai-leader-1951', 'coursework-courses-gen-ai-leader', 5],
    ] as const) {
      await openRow(page, id);
      const rows = await measure(testId);
      expect(rows.map((r) => r.n), `${id} rows were ${JSON.stringify(rows)}`).toEqual([n]);
      expect(Math.abs(rows[0].left - rows[0].right)).toBeLessThanOrEqual(2);
    }
  });

  test('Stanford gets the same chrome with zero badges', async ({ page }) => {
    await page.goto('/certifications');
    const el = page.locator('#ce-stanford-xee100');
    await expect(el.getByText('Stanford').first()).toBeVisible();
    await expect(el.getByText('XEE100').first()).toBeVisible();
    await openRow(page, 'ce-stanford-xee100');
    await expect(el.locator('img')).toHaveCount(0); // no logo asset, no badge art
    await expect(badgeLinks(el)).toHaveCount(0);
    await expect(el.getByText(/six Stanford faculty members will deliver an overview/i)).toBeVisible();
    const modulesChip = el.getByText('5 Modules', { exact: true });
    await (wideViewport(page) ? expect(modulesChip).toBeVisible() : expect(modulesChip).toBeAttached());
    await expect(el.getByTestId('coursework-courses-stanford').locator('li')).toHaveCount(5);
    const titles = await el
      .getByTestId('coursework-courses-stanford')
      .locator('li h4')
      .evaluateAll((els) => els.map((e) => e.textContent?.trim()));
    expect(titles).toEqual(STANFORD_MODULES);
    // Same template parts as a Google card.
    await expect(el.locator('button[aria-expanded]')).toHaveCount(1);
    await expect(el.locator('[data-collapsible]')).toHaveCount(1);
    await expect(el.locator('[data-ledger-index]')).toHaveText('07');
  });

  test('the Generative AI Leader card cannot be read as a held certification', async ({ page }) => {
    await page.goto('/certifications');
    const el = page.locator('#ce-google-skills-gen-ai-leader-1951');
    await expect(rowTitle(el)).toHaveText('Generative AI Leader');
    await expect(rowTitle(el)).not.toContainText(/certification/i);
    await expect(
      el.getByText('Google Skills · Sep 2026 · 5-Course Path · “Train for the exam”', { exact: true }),
    ).toBeVisible();
    await openRow(page, 'ce-google-skills-gen-ai-leader-1951');
    await expect(
      el.getByText(/Listed by Google as “Generative AI Leader Certification”/),
    ).toBeVisible();
    await expect(el.getByText(/certified/i)).toHaveCount(0);
    await expect(el.getByText(/no certificate/i)).toHaveCount(0);
  });

  test('expand all / collapse all works on both sections', async ({ page }) => {
    await page.goto('/certifications');
    for (const [section, n] of [['google-skills', 6], ['continuing-education', 1]] as const) {
      const btn = page.getByTestId(`expand-all-${section}`);
      const toggles = page.locator(`#${section} button[aria-expanded]`);
      await expect(toggles).toHaveCount(n);

      // Retried: this button is inert until the ledger hydrates, and firing it
      // once is what made this the hard failure on CI.
      await clickUntil(btn, async () => {
        await expect(btn).toHaveText('Collapse all', { timeout: 1_000 });
      });
      for (let i = 0; i < n; i++) await expect(toggles.nth(i)).toHaveAttribute('aria-expanded', 'true');

      await clickUntil(btn, async () => {
        await expect(btn).toHaveText('Expand all', { timeout: 1_000 });
      });
      for (let i = 0; i < n; i++) await expect(toggles.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('deep links still open a coursework row', async ({ page }) => {
    await page.goto('/certifications#ce-google-skills-smb-4020');
    await expect(
      page.locator('#ce-google-skills-smb-4020 button[aria-expanded]'),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  test('both jump pills are present and set apart from the four category pills', async ({ page }) => {
    await page.goto('/certifications');
    const nav = page.getByRole('navigation', { name: /certification categories/i });
    for (const [href, label] of [
      ['#google-skills', 'Google Skills'],
      ['#continuing-education', 'Continuing Education'],
    ] as const) {
      const pill = nav.locator(`a[href="${href}"]`);
      await expect(pill).toBeVisible();
      await expect(pill).toContainText(label);
      await expect(pill).not.toContainText('·'); // no "· {n}" count suffix
    }
    await expect(nav.locator('a[href="#group-ai"]')).toBeVisible();
    await expect(nav.locator('a[href="#group-engineering"]')).toBeVisible();
  });

  test('no EducationalOccupationalCredential or Course node is emitted for any entry', async ({ request }) => {
    const html = await (await request.get('/certifications')).text();
    for (const needle of [
      'XEE100', 'Internet of Things', 'SMB Learning Path', 'Generative AI Leader',
      'Agent Ecosystem', 'Beginner: Introduction to Generative AI',
      'Deploy Production Ready Agents',
    ]) {
      expect(html).not.toMatch(
        new RegExp(`EducationalOccupationalCredential[^]{0,400}${esc(needle)}`),
      );
    }
    expect(html).not.toMatch(/"@type"\s*:\s*"Course"/);
  });

  test('no horizontal overflow at 375px, collapsed or expanded', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/certifications');
    for (const pass of ['collapsed', 'expanded'] as const) {
      if (pass === 'expanded') {
        await expandAll(page, 'google-skills');
        await expandAll(page, 'continuing-education');
      }
      for (const id of ['google-skills', 'continuing-education']) {
        const delta = await page.locator(`#${id}`).evaluate((el) => el.scrollWidth - el.clientWidth);
        expect(delta, `#${id} overflows by ${delta}px (${pass})`).toBeLessThanOrEqual(0);
      }
      const cards = await page
        .locator('article[id^="ce-"]')
        .evaluateAll((els) => els.map((el) => [el.id, el.scrollWidth - el.clientWidth] as const));
      expect(cards).toHaveLength(7);
      for (const [id, d] of cards) expect(d, `${id} overflows by ${d}px (${pass})`).toBeLessThanOrEqual(0);
      const doc = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(doc, `document overflows by ${doc}px (${pass})`).toBeLessThanOrEqual(0);
    }
  });

  test.describe('with prefers-reduced-motion: reduce', () => {
    test.use({ reducedMotion: 'reduce' });

    // Regression guard. `useReducedMotion()` resolves to false on the hydration
    // render, so framer-motion applies the `collapsed` variant (opacity 0) as
    // the element's resting inline style; swapping the `variants` prop to
    // `undefined` once the query resolved true made framer stop managing the
    // element and froze opacity 0 on it permanently. Every tile and module row
    // in a row that did NOT start open was then invisible — for exactly the
    // users who would never see a fade-in to notice. The reduced-motion
    // variant PAIRS in CollapsePanel keep the element managed instead.
    test('every course tile and module row is visible in a row opened by hand', async ({ page }) => {
      await page.goto('/certifications');
      for (const id of [
        // Coursework rows: all seven start collapsed.
        'ce-google-skills-beginner-gen-ai-118',
        'ce-google-skills-deploy-agents-3802',
        'ce-google-skills-smb-4020',
        'ce-stanford-xee100',
        // A collapsed row of the untouched credential template, which carried
        // the same defect before this fix.
        'spec-google-ai-essentials',
      ]) {
        await openRow(page, id);
        const items = page.locator(`#${id} [data-collapsible] li`);
        const count = await items.count();
        expect(count, `${id} rendered no list items`).toBeGreaterThan(0);
        // Poll: the variant swap lands in a useEffect after hydration.
        await expect
          .poll(
            async () =>
              (
                await items.evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))
              ).filter((o) => o !== '1'),
            { message: `${id} has list items that never reached opacity 1` },
          )
          .toEqual([]);
      }
    });
  });
});
