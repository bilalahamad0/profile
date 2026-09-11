import { test, expect, type Locator } from '@playwright/test';

const BADGE_URL =
  /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/;

const STANFORD_TOPICS = ['Cool Applications', 'Sensors', 'Embedded Systems', 'Networking', 'Circuits'];
const BEGINNER_COURSES = [
  'Introduction to Generative AI',
  'Introduction to Large Language Models',
  'Prompt Design in Agent Platform',
  'Responsible AI: Applying AI Principles with Google Cloud',
];
const AGENTS_COURSES = [
  'Welcome: Introduction to Agents and Google’s Agent Ecosystem',
  'Agent Fundamentals',
  'Enterprise Agents and Use Cases',
  'Create Your First Gemini Enterprise Application',
  'Wrap Up: Introduction to Agents and Google’s Agent Ecosystem',
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

type Card = {
  id: string; // element id of the <article>
  title: string;
  issuer: string;
  status: string;
  pathUrl: RegExp; // the entry-level syllabus/path link
  courses: string[];
  badges: number; // courses that link to a public badge page
  note: RegExp; // the one "no certificate" line
};

// Section order = reverse chronology: all four Google paths finished
// 2026-09-10 PDT (Beginner ~22:00, Agents ~18:00, SMB ~17:55, Gen AI Leader
// ~14:35), then Stanford. Several course titles repeat ACROSS cards (Google
// reuses courses between paths), so every text locator below is scoped to
// its card — never section-wide — or asserted by count.
const CARDS: Card[] = [
  {
    id: 'ce-google-skills-beginner-gen-ai-118',
    title: 'Beginner: Introduction to Generative AI',
    issuer: 'Google Skills',
    status: 'Completed Sep 2026',
    pathUrl: /^https:\/\/www\.skills\.google\/paths\/118$/,
    courses: BEGINNER_COURSES,
    badges: 4,
    note: /Google issues no certificate for completing this path/i,
  },
  {
    id: 'ce-google-skills-agents-3546',
    title: 'Introduction to Agents and Google’s Agent Ecosystem',
    issuer: 'Google Skills',
    status: 'Completed Sep 2026',
    pathUrl: /^https:\/\/www\.skills\.google\/paths\/3546$/,
    courses: AGENTS_COURSES,
    badges: 3,
    note: /Google issues no certificate for completing this path/i,
  },
  {
    id: 'ce-google-skills-smb-4020',
    title: 'SMB Learning Path',
    issuer: 'Google Skills',
    status: 'Completed Sep 2026',
    pathUrl: /^https:\/\/www\.skills\.google\/paths\/4020$/,
    courses: SMB_COURSES,
    badges: 13,
    note: /Google issues no certificate for completing this path/i,
  },
  {
    id: 'ce-google-skills-gen-ai-leader-1951',
    title: 'Generative AI Leader — Exam-Prep Learning Path',
    issuer: 'Google Skills',
    status: 'Completed Sep 2026',
    pathUrl: /^https:\/\/www\.skills\.google\/paths\/1951$/,
    courses: LEADER_COURSES,
    badges: 5,
    note: /Google issues no certificate for completing this path/i,
  },
  {
    id: 'ce-stanford-xee100',
    title: 'Introduction to Internet of Things',
    issuer: 'Stanford School of Engineering',
    status: 'Completed 2026',
    pathUrl: /^https:\/\/online\.stanford\.edu\/courses\/xee100-introduction-internet-things$/,
    courses: STANFORD_TOPICS,
    badges: 0,
    note: /Stanford issues no certificate for this course/i,
  },
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Two of the badges are lab-based skill badges (also issued on Credly); the
// chip is identical, only the spoken suffix differs.
const badgeLinks = (scope: Locator) =>
  scope.getByRole('link', { name: /(completion|skill) badge on Google Skills, opens in a new tab$/i });
const SKILL_BADGE_IDS = ['27848848', '27852046'];
const pathLink = (card: Locator) => card.getByRole('link', { name: /^(course|path) page on /i });

test.describe('Certifications — Continuing Education (non-credential)', () => {
  test('ATS: every path, issuer and course title is in the raw server HTML with zero JavaScript', async ({ request }) => {
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

    const needles = new Set<string>([
      'Continuing Education',
      'Google Skills',
      'Stanford School of Engineering',
      'XEE100',
      // Google's official path title survives verbatim in the meta line,
      // framed the way Google Cloud's certification page frames the path.
      'Generative AI Leader Certification',
      'Train for the exam',
      ...CARDS.map((c) => c.title),
      ...CARDS.flatMap((c) => c.courses),
    ]);
    for (const needle of needles) {
      expect(html, `raw HTML must contain "${needle}"`).toContain(needle);
    }

    // Negative vocabulary, bounded to THIS section's markup: the ledger above
    // legitimately says "verified" and the trailing RSC payload re-serialises
    // the layout JSON-LD ("ISTQB Certified Tester…"), so slice from the
    // section's opening tag to its closing </section> (the cards are
    // <article>s — there is no nested <section>).
    const start = html.indexOf('id="continuing-education"');
    expect(start).toBeGreaterThan(-1);
    const end = html.indexOf('</section>', start);
    expect(end).toBeGreaterThan(start);
    const sectionHtml = html.slice(start, end);
    expect(sectionHtml).not.toMatch(/certified|not counted|not certified|\bverify\b/i);
  });

  test('the section is structurally not a credential and did not disturb the ledger', async ({ page }) => {
    await page.goto('/certifications');
    const section = page.locator('#continuing-education');
    await expect(section).toBeVisible();

    // It is not one of the four ledger groups, and it did not disturb them.
    await expect(page.locator('section[id^="group-"]')).toHaveCount(4);
    await expect(
      page.locator('section[aria-labelledby^="specialization-path-heading"]'),
    ).toHaveCount(4);

    // No verification vocabulary, no ledger chrome, no lightbox.
    await expect(section.getByRole('button')).toHaveCount(0);
    await expect(section.getByText(/\bverif/i)).toHaveCount(0);
    await expect(section.getByText(/all verified/i)).toHaveCount(0);
    await expect(section.getByText(/certified/i)).toHaveCount(0);
    await expect(section.locator('[aria-expanded]')).toHaveCount(0);
    await expect(section.locator('[role="dialog"]')).toHaveCount(0);

    // Five cards, in reverse chronology.
    const cards = section.locator('article[data-testid="continuing-education-entry"]');
    await expect(cards).toHaveCount(5);
    const ids = await cards.evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(CARDS.map((c) => c.id));

    // The eyebrow names every issuer, derived from data.
    await expect(section.getByText('Google Skills · Stanford', { exact: true })).toBeVisible();

    // 25 course badges section-wide (4 + 3 + 13 + 5 + 0), every one a safe
    // new-tab link to the public profile, every thumbnail decorative and local.
    const links = badgeLinks(section);
    await expect(links).toHaveCount(25);
    for (const a of await links.all()) {
      await expect(a).toHaveAttribute('href', BADGE_URL);
      await expect(a).toHaveAttribute('rel', /noopener/);
      await expect(a).toHaveAttribute('target', '_blank');
    }
    // 20 distinct badge pages behind them (shared courses repeat an href), and
    // the spoken suffix says "skill badge" for exactly the two lab-based ones.
    const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(new Set(hrefs).size).toBe(20);
    // 27855015 belongs to an unfinished path and must never render.
    expect(hrefs.some((h) => h.endsWith('/badges/27855015'))).toBe(false);
    const skillLinks = section.getByRole('link', { name: /skill badge on Google Skills/i });
    const skillHrefs = await skillLinks.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    // 27848848 sits in two cards (SMB + Agents), 27852046 in one (Beginner).
    expect(skillHrefs).toHaveLength(3);
    expect(new Set(skillHrefs.map((h) => h.split('/').pop()))).toEqual(new Set(SKILL_BADGE_IDS));
    const imgs = section.locator('img');
    await expect(imgs).toHaveCount(25);
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('alt', '');
      // next/image rewrites local src to /_next/image?url=%2Fbadges%2Fgoogle-skills…
      await expect(img).toHaveAttribute('src', /badges%2Fgoogle-skills|\/badges\/google-skills/);
    }
  });

  for (const card of CARDS) {
    test.describe(card.title, () => {
      test('renders title, issuer, every course, and exactly the expected links and thumbnails', async ({ page }) => {
        await page.goto('/certifications');
        const el = page.locator(`#${card.id}`);
        await expect(el).toBeVisible();
        await expect(el.getByRole('heading', { level: 3 })).toHaveText(card.title);
        // Issuer is asserted on the meta <p> (h3 + p), never via getByText:
        // the sr-only badge suffixes also contain "Google Skills".
        await expect(el.locator('h3 + p')).toContainText(`${card.issuer} · `);
        for (const course of card.courses) {
          // Anchored: a link chip's text continues with the sr-only suffix.
          await expect(
            el.locator('li').filter({ hasText: new RegExp(`^${esc(course)}( — |$)`) }),
          ).toHaveCount(1);
        }
        await expect(el.locator('li')).toHaveCount(card.courses.length);
        await expect(el.locator('img')).toHaveCount(card.badges);
        await expect(badgeLinks(el)).toHaveCount(card.badges);
        // Exactly one link that is NOT a badge — the issuer's own page.
        await expect(el.locator('a')).toHaveCount(card.badges + 1);
        await expect(pathLink(el)).toHaveCount(1);
        await expect(pathLink(el)).toHaveAttribute('href', card.pathUrl);
        await expect(pathLink(el)).toHaveAttribute('rel', /noopener/);
        await expect(pathLink(el)).toHaveAttribute('target', '_blank');
      });

      test('every badge link is a public, login-free Google Skills page opened safely in a new tab', async ({ page }) => {
        test.skip(card.badges === 0, 'no badges on this card');
        await page.goto('/certifications');
        const links = badgeLinks(page.locator(`#${card.id}`));
        await expect(links).toHaveCount(card.badges);
        for (let i = 0; i < card.badges; i++) {
          await expect(links.nth(i)).toHaveAttribute('href', BADGE_URL);
          await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
          await expect(links.nth(i)).toHaveAttribute('target', '_blank');
        }
      });

      test('the record status is stated once, in the fine print — not repeated', async ({ page }) => {
        await page.goto('/certifications');
        const el = page.locator(`#${card.id}`);
        // Stated: one quiet line beside the page link.
        await expect(el.getByText(card.note)).toBeVisible();
        // Stated ONCE. An earlier pass said it four times (eyebrow, header
        // slot, a red chip and a sentence), which read as an apology and
        // buried the course. This is the regression guard for that tone.
        await expect(el.getByText(/no certificate/i)).toHaveCount(1);
        await expect(el.getByText(/not counted/i)).toHaveCount(0);
        await expect(el.getByText(/certified/i)).toHaveCount(0);
        // The prominent slot carries the achievement instead.
        await expect(el.getByText(card.status, { exact: true })).toBeVisible();
      });

      test('achievement and fine print both render at 375px', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/certifications');
        const el = page.locator(`#${card.id}`);
        await expect(el.getByText(card.status, { exact: true })).toBeVisible();
        await expect(el.getByText(card.note)).toBeVisible();
      });
    });
  }

  test('Stanford keeps its faculty attribution', async ({ page }) => {
    await page.goto('/certifications');
    await expect(
      page.locator('#ce-stanford-xee100').getByText(/Taught by six Stanford faculty/i),
    ).toBeVisible();
  });

  test('the Generative AI Leader card cannot be read as a held certification', async ({ page }) => {
    await page.goto('/certifications');
    const card = page.locator('#ce-google-skills-gen-ai-leader-1951');
    // The heading never contains the word at all.
    await expect(card.getByRole('heading', { level: 3 })).toHaveText(
      'Generative AI Leader — Exam-Prep Learning Path',
    );
    // Google's official title stays visible, quoted and attributed, in the
    // meta line — led by the framing Google Cloud's own certification page
    // gives this path ("Train for the exam").
    const meta = card.locator('h3 + p');
    await expect(meta).toBeVisible();
    await expect(meta).toContainText('“Train for the exam” path for the Google Cloud Generative AI Leader certification');
    await expect(meta).toContainText('listed by Google as “Generative AI Leader Certification”');
    // The fine print names the certification as a separate credential, not taken.
    const note = card.getByText(/separate credential/i);
    await expect(note).toBeVisible();
    await expect(note).toContainText(/exam not taken/i);
    await expect(card.getByText(/certified/i)).toHaveCount(0);
  });

  test('long official titles are never visibly clamped', async ({ page }) => {
    for (const width of [375, 768, 900, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/certifications');
      for (const id of ['ce-google-skills-gen-ai-leader-1951', 'ce-google-skills-agents-3546']) {
        const h3 = page.locator(`#${id}`).getByRole('heading', { level: 3 });
        const clamped = await h3.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
        expect(clamped, `${id} title clamped at ${width}px`).toBe(false);
      }
    }
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

  test('no EducationalOccupationalCredential or Course node is emitted for any entry', async ({ request }) => {
    const html = await (await request.get('/certifications')).text();
    for (const needle of [
      'XEE100',
      'Internet of Things',
      'SMB Learning Path',
      'Generative AI Leader',
      'Agent Ecosystem',
      'Beginner: Introduction to Generative AI',
    ]) {
      expect(html).not.toMatch(new RegExp(`EducationalOccupationalCredential[^]{0,400}${esc(needle)}`));
    }
    // And no Course node either — a Course on a personal profile reads to
    // crawlers as "this site offers this course".
    expect(html).not.toMatch(/"@type"\s*:\s*"Course"/);
  });

  test('the cards stay row-sized and do not overflow at 375px', async ({ page }) => {
    // The page wrapper carries overflow-x-hidden, which can mask a real
    // overflow from a document-level assertion — so measure the section and
    // every card.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/certifications');
    const overflow = await page.evaluate(() => {
      const el = document.getElementById('continuing-education');
      if (!el) return null;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).not.toBeNull();
    expect(overflow ?? 1).toBeLessThanOrEqual(0);

    const cardOverflows = await page
      .locator('article[data-testid="continuing-education-entry"]')
      .evaluateAll((els) => els.map((el) => [el.id, el.scrollWidth - el.clientWidth] as const));
    expect(cardOverflows).toHaveLength(5);
    for (const [id, delta] of cardOverflows) {
      expect(delta, `${id} overflows by ${delta}px`).toBeLessThanOrEqual(0);
    }

    const docOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(docOverflow).toBeLessThanOrEqual(0);
  });
});
