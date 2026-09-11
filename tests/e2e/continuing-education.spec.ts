import { test, expect, type Locator } from '@playwright/test';

// Public badge page per PROVIDER — both return 200 logged-out behind no login
// wall. 18 course badges are linked at Google Skills; the two lab-based skill
// badges are linked at their Credly copies.
const GOOGLE_SKILLS_BADGE_URL =
  /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/;
const CREDLY_BADGE_URL = /^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url$/;
const BADGE_URL =
  /^(https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+|https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url)$/;
const BADGE_URL_BY_PROVIDER: Record<string, RegExp> = {
  'Google Skills': GOOGLE_SKILLS_BADGE_URL,
  Credly: CREDLY_BADGE_URL,
};

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
  credly: number; // of those, how many link at credly.com (the rest: Google Skills)
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
    credly: 1, // Prompt Design in Agent Platform
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
    credly: 1, // Create Your First Gemini Enterprise Application
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
    credly: 1, // Create Your First Gemini Enterprise Application
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
    credly: 0,
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
    credly: 0,
    note: /Stanford issues no certificate for this course/i,
  },
];

// The one course whose badge page is titled something else. The chip shows
// BOTH names: Google's course title, then Credly's own badge name in
// parentheses, muted — so the destination can corroborate the label it was
// clicked from. Credly's exact og:title, verbatim and in full.
const PROMPT_DESIGN_COURSE = 'Prompt Design in Agent Platform';
const PROMPT_DESIGN_CREDLY_TITLE = 'Prompt Design in Vertex AI Skill Badge';
const PROMPT_DESIGN_CHIP_TEXT = `${PROMPT_DESIGN_COURSE} (Credly: ${PROMPT_DESIGN_CREDLY_TITLE})`;

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// A course chip's text starts with the course title and then either ends, or
// continues with the muted "(Credly: …)" annotation, or with the sr-only
// provider suffix.
const chipStartsWith = (course: string) =>
  new RegExp(`^${esc(course)}( \\((Credly|Google Skills): | — |$)`);
// Two of the badges are lab-based skill badges, linked at their Credly copies;
// the chip is identical, only the spoken suffix differs (kind + provider).
const badgeLinks = (scope: Locator) =>
  scope.getByRole('link', {
    name: /(completion|skill) badge on (Google Skills|Credly), opens in a new tab$/i,
  });
const credlyLinks = (scope: Locator) =>
  scope.getByRole('link', { name: /badge on Credly, opens in a new tab$/i });
// The two Credly skill badges: "Create Your First Gemini Enterprise
// Application" (rendered on the SMB and Agents cards) and "Prompt Design in
// Agent Platform" (Credly names that badge "Prompt Design in Vertex AI Skill
// Badge" — the chip leads with Google's course title and prints Credly's name
// after it, so the destination corroborates the label it was clicked from).
const CREDLY_BADGE_UUIDS = [
  '328f785b-dc1b-4f73-9ed2-d9a8eb7c8e71',
  'fc080ecb-a01b-4ca4-a99f-4f008a846da9',
];
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
      // Credly's own name for the Prompt Design badge — the chip prints it
      // beside Google's course title, so it is in the static HTML too. Only
      // the two titles separately: a <span> boundary sits between them in the
      // markup, so the joined chip text is asserted against the DOM instead.
      PROMPT_DESIGN_CREDLY_TITLE,
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
    // new-tab link to a public badge page, every thumbnail decorative and local.
    const links = badgeLinks(section);
    await expect(links).toHaveCount(25);
    for (const a of await links.all()) {
      await expect(a).toHaveAttribute('href', BADGE_URL);
      await expect(a).toHaveAttribute('rel', /noopener/);
      await expect(a).toHaveAttribute('target', '_blank');
    }
    // 20 distinct badge pages behind them (shared courses repeat an href), and
    // the spoken suffix names the platform: 3 of the 25 links resolve to Credly
    // (the shared "Create Your First Gemini Enterprise Application" chip on
    // both the SMB and Agents cards, plus "Prompt Design in Agent Platform"),
    // the other 22 to Google Skills.
    const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(new Set(hrefs).size).toBe(20);
    expect(hrefs.filter((h) => CREDLY_BADGE_URL.test(h))).toHaveLength(3);
    expect(hrefs.filter((h) => GOOGLE_SKILLS_BADGE_URL.test(h))).toHaveLength(22);
    // 27855015 belongs to an unfinished path and must never render.
    expect(hrefs.some((h) => h.endsWith('/badges/27855015'))).toBe(false);
    const credlyHrefs = await credlyLinks(section).evaluateAll((els) =>
      els.map((el) => el.getAttribute('href') ?? ''),
    );
    expect(credlyHrefs).toHaveLength(3);
    expect(credlyHrefs.every((h) => CREDLY_BADGE_URL.test(h))).toBe(true);
    // fc080ecb… ("Create Your First Gemini Enterprise Application") is shared
    // by the SMB and Agents cards, so it appears twice; 328f785b… ("Prompt
    // Design in Agent Platform") once, on the Beginner card.
    const credlyUuids = credlyHrefs.map((h) => h.split('/')[4]).sort();
    expect(credlyUuids).toEqual([
      '328f785b-dc1b-4f73-9ed2-d9a8eb7c8e71',
      'fc080ecb-a01b-4ca4-a99f-4f008a846da9',
      'fc080ecb-a01b-4ca4-a99f-4f008a846da9',
    ]);
    expect(new Set(credlyUuids)).toEqual(new Set(CREDLY_BADGE_UUIDS));
    const imgs = section.locator('img');
    await expect(imgs).toHaveCount(25);
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('alt', '');
      // next/image rewrites local src to /_next/image?url=%2Fbadges%2F… —
      // Google Skills art is namespaced, Credly art sits flat in /badges/.
      await expect(img).toHaveAttribute('src', /badges(%2F|\/)(google-skills(%2F|\/))?[a-z0-9-]+\.webp/);
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
          // Anchored: a link chip's text continues with the muted platform
          // title (where the two names disagree) and the sr-only suffix.
          await expect(
            el.locator('li').filter({ hasText: chipStartsWith(course) }),
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

      test('every badge link is a public, login-free badge page on the provider its accessible name states', async ({ page }) => {
        test.skip(card.badges === 0, 'no badges on this card');
        await page.goto('/certifications');
        const el = page.locator(`#${card.id}`);
        const links = badgeLinks(el);
        await expect(links).toHaveCount(card.badges);
        for (let i = 0; i < card.badges; i++) {
          await expect(links.nth(i)).toHaveAttribute('href', BADGE_URL);
          await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
          await expect(links.nth(i)).toHaveAttribute('target', '_blank');
          // The host must match the platform the spoken suffix names — a chip
          // that says "on Credly" and links skills.google is a lie to a screen
          // reader, and vice versa.
          const spoken = (await links.nth(i).textContent()) ?? '';
          const provider = /badge on Credly/i.test(spoken) ? 'Credly' : 'Google Skills';
          await expect(links.nth(i), `${card.id} link ${i} says "${provider}"`).toHaveAttribute(
            'href',
            BADGE_URL_BY_PROVIDER[provider],
          );
        }
        // ...and exactly this many of them point at Credly.
        await expect(credlyLinks(el)).toHaveCount(card.credly);
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

  test('the Prompt Design chip shows BOTH the course title and Credly’s own badge name', async ({ page }) => {
    await page.goto('/certifications');
    // "Prompt Design in Agent Platform" appears in exactly one card, but scope
    // to the card anyway — every text locator in this file is card-scoped.
    const card = page.locator('#ce-google-skills-beginner-gen-ai-118');
    const chip = card.locator('li').filter({ hasText: chipStartsWith(PROMPT_DESIGN_COURSE) });
    await expect(chip).toHaveCount(1);

    // Visible text: Google's course title, then Credly's own name — verbatim,
    // in full, neither one dropped and neither one truncated away.
    const visible = (await chip.locator('a > span.min-w-0').innerText()).replace(/\s+/g, ' ').trim();
    expect(visible).toBe(PROMPT_DESIGN_CHIP_TEXT);
    await expect(chip).toContainText(PROMPT_DESIGN_COURSE);
    await expect(chip).toContainText(PROMPT_DESIGN_CREDLY_TITLE);

    // Accessible name: both titles, in reading order, still ending in the
    // existing provider suffix.
    const link = chip.getByRole('link');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAccessibleName(
      new RegExp(
        `^${esc(PROMPT_DESIGN_CHIP_TEXT)}\\s*— skill badge on Credly, opens in a new tab$`,
      ),
    );
    await expect(link).toHaveAttribute('href', CREDLY_BADGE_URL);
    // Not a `title` attribute standing in for visible text.
    await expect(link).not.toHaveAttribute('title', /./);
    // Still one chip, one <li>, one thumbnail, one link.
    await expect(chip.locator('a')).toHaveCount(1);
    await expect(chip.locator('img')).toHaveCount(1);
    await expect(chip.locator('img')).toHaveAttribute('alt', '');
    // Nothing clamps or truncates the second title away.
    const clipped = await chip.locator('a').evaluate((el) => {
      const spans = [el, ...el.querySelectorAll('span')].filter(
        (n) => !(n as HTMLElement).classList.contains('sr-only'),
      );
      return spans.some((n) => {
        const s = getComputedStyle(n as HTMLElement);
        return (
          s.textOverflow === 'ellipsis' ||
          s.webkitLineClamp !== 'none' ||
          (n as HTMLElement).scrollWidth > (n as HTMLElement).clientWidth + 1
        );
      });
    });
    expect(clipped, 'the Prompt Design chip truncates its own text').toBe(false);
  });

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

    // The longest chip in the section is the Prompt Design one, which carries
    // two full titles. It may WRAP to a second line at 375px — that is fine —
    // but it must not push past its list, nor scroll inside itself.
    const chip = await page
      .locator('#ce-google-skills-beginner-gen-ai-118 li')
      .filter({ hasText: chipStartsWith(PROMPT_DESIGN_COURSE) })
      .locator('a')
      .evaluate((el) => {
        const list = el.closest('ul') as HTMLElement;
        const r = el.getBoundingClientRect();
        const lr = list.getBoundingClientRect();
        return {
          selfOverflow: el.scrollWidth - el.clientWidth,
          pastList: Math.round(r.right - lr.right),
          height: Math.round(r.height),
        };
      });
    expect(chip.selfOverflow, `chip scrolls by ${chip.selfOverflow}px`).toBeLessThanOrEqual(0);
    expect(chip.pastList, `chip extends ${chip.pastList}px past its list`).toBeLessThanOrEqual(0);
    expect(chip.height).toBeGreaterThan(0);
  });
});
