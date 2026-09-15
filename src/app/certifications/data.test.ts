import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  AI_CERTIFICATES,
  CERT_STATS,
  CLAUDE_ACADEMY_PATHS,
  CONTINUING_EDUCATION,
  COURSEWORK_GROUPS,
  CREDENTIAL_GROUPS,
  GENERAL_CERTIFICATES,
  LEARNING_PATHS,
  SPECIALIZATIONS,
  credentialSlug,
  type LearningPathData,
} from "./data";
import { gridPositions } from "@/components/certifications/gridPositions";
import { certifications } from "@/data/portfolio";

/** Resolve from the process cwd, NOT from `import.meta.url`. Vitest runs this
 *  suite under `environment: "happy-dom"` (vitest.config.mjs), where
 *  `import.meta.url` is not a `file:` URL — `fileURLToPath()` on it throws
 *  `ERR_INVALID_URL_SCHEME` and the whole FILE fails to load, so every test in
 *  it is skipped rather than failed. That is exactly what broke CI on
 *  2026-09-11 ("Test Files 1 failed | 16 passed", "Tests 193 passed"): a green
 *  test count hiding a suite that never ran. Vitest sets the cwd to the project
 *  root (where vitest.config.mjs lives), which is also where CI invokes
 *  `npm run test:coverage`. A wrong cwd cannot make this pass silently — the
 *  existsSync() assertions below would fail loudly. */
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

const ALL_COURSEWORK: readonly LearningPathData[] = [
  ...CLAUDE_ACADEMY_PATHS,
  ...LEARNING_PATHS,
  ...CONTINUING_EDUCATION,
];

/** The four Claude Academy learning paths in the owner's curated order. */
const CLAUDE_ACADEMY_ORDER = [
  "ce-claude-academy-platform",
  "ce-claude-academy-code",
  "ce-claude-academy-cowork",
  "ce-claude-academy-chat",
];



/** The Skilljar certificate JPGs these badge cards replaced. Deleted, not
 *  merely unreferenced — the assertion below is that they are gone from disk. */
const RETIRED_SKILLJAR_THUMBS = [
  "certificates/anthropic_claude_101_thumb.jpg",
  "certificates/anthropic_claude_code_101_thumb.jpg",
  "certificates/anthropic_claude_code_in_action_thumb.jpg",
  "certificates/anthropic_ai_fluency_framework_foundations_thumb.jpg",
  "certificates/anthropic_introduction_to_claude_cowork_thumb.jpg",
];

const BADGE_URL_BY_PROVIDER = {
  "Google Skills":
    /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/,
  Credly: /^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url$/,
  "Claude Academy":
    /^https:\/\/academy\.claude\.com\/(verify\/[0-9a-f]{32}|badges\/[0-9a-f-]{36}|courses\/[a-z0-9-]+)$/,
} as const;
const BADGE_IMAGE_BY_PROVIDER = {
  "Google Skills": /^\/badges\/google-skills\/[a-z0-9-]+\.webp$/,
  Credly: /^\/badges\/[a-z0-9-]+\.webp$/,
  "Claude Academy": /^\/badges\/claude-academy\/[a-z0-9-]+\.webp$/,
} as const;
/** All three lab-based skill badges link their CREDLY copy and glow — the
 *  convention `skill_badge_rule` records in scratchpad/google-skills-paths.json.
 *  Not every skill badge is here: 27886491 has no Credly twin (see below). */
const CREDLY_BADGE_URLS = [
  "https://www.credly.com/badges/328f785b-dc1b-4f73-9ed2-d9a8eb7c8e71/public_url",
  "https://www.credly.com/badges/fc080ecb-a01b-4ca4-a99f-4f008a846da9/public_url",
  "https://www.credly.com/badges/97b82f44-68ec-4c85-8847-4c488e076a9a/public_url",
];
const GS_PROFILE =
  "https://www.skills.google/public_profiles/aece174b-451d-4d6f-928d-6def28946025";
const ISSUER_URL =
  /^https:\/\/(online\.stanford\.edu\/courses\/[a-z0-9-]+|www\.skills\.google\/paths\/\d+|academy\.claude\.com\/all\?kind=course&product=[a-z]+)$/;
/** Keys that would turn an entry into a credential. Verification lives on a
 *  COURSE; a path may link the issuer's own page and nothing else. */
const CREDENTIAL_ONLY_KEYS = [
  "image",
  "parentBadge",
  "badgeHalo",
  "badgeShadow",
  "credlyUrl",
  "officialBadge",
  "isOfficial",
  "courseBadge",
  "formatNote",
  "ribbon",
];
/** The seven literal class strings the Professional Certificate grid has always
 *  produced. tests/e2e/certifications.spec.ts asserts that grid down to li/img
 *  counts and accessible names and may not be edited, so gridPositions(7) must
 *  reproduce this array exactly. */
const PRO_CERT_GRID_POSITIONS = [
  "col-start-2 col-end-4",
  "col-start-4 col-end-6",
  "col-start-1 col-end-3",
  "col-start-3 col-end-5",
  "col-start-5 col-end-7",
  "col-start-2 col-end-4",
  "col-start-4 col-end-6",
];

/** The CURATED top-to-bottom order of the coursework cards — the owner's
 *  choice, dated 2026-09-11 (Google Skills/Stanford) and 2026-09-15 (Claude Academy).
 *  It is NOT chronological and must never be re-derived from a completion date. */
const EXPECTED_ORDER = [
  ...CLAUDE_ACADEMY_ORDER,
  "ce-google-skills-gen-ai-leader-1951",
  "ce-google-skills-smb-4020",
  "ce-google-skills-multi-agent-4459",
  "ce-google-skills-deploy-agents-3802",
  "ce-google-skills-agents-3546",
  "ce-google-skills-beginner-gen-ai-118",
  "ce-stanford-xee100",
];
const byId = (id: string) => ALL_COURSEWORK.find((e) => e.id === id);
const badged = ALL_COURSEWORK.flatMap((entry) =>
  entry.courses.flatMap((course) =>
    course.badge ? [{ entry, course, badge: course.badge }] : [],
  ),
);

describe("coursework is never counted as a credential", () => {
  it("does not move the computed stats strip", () => {
    expect(CERT_STATS.credentials).toBe(15);
    expect(CERT_STATS.specializations).toBe(SPECIALIZATIONS.length);
    expect(CERT_STATS.credentials).toBe(
      SPECIALIZATIONS.length + AI_CERTIFICATES.length + GENERAL_CERTIFICATES.length,
    );
  });

  it("counts EVERY single-course certificate, inside a specialization or standing alone", () => {
    // The stat used to sum only the specialization children, so it looked
    // inside the four multi-course programmes while ignoring eleven
    // certificates that each certify one course. 23 was then neither a subset
    // of the 15 credentials nor a total of anything, and the two figures could
    // not be reconciled by a reader. Both halves are asserted here so the stat
    // cannot silently revert to counting one of them.
    const fromSpecializations = SPECIALIZATIONS.reduce((n, s) => n + s.children.length, 0);
    const standalone = AI_CERTIFICATES.length + GENERAL_CERTIFICATES.length;
    expect(fromSpecializations).toBe(23);
    expect(standalone).toBe(11);
    expect(CERT_STATS.courseCertificates).toBe(34);
    expect(CERT_STATS.courseCertificates).toBe(fromSpecializations + standalone);
    // Every standalone credential is also a course certificate, so this stat
    // can never be smaller than the credential count minus the specializations.
    expect(CERT_STATS.courseCertificates).toBeGreaterThanOrEqual(
      CERT_STATS.credentials - CERT_STATS.specializations,
    );
  });

  it("files the four Claude Academy learning paths in their own uncounted section, in the owner's curated order", () => {
    // Owner-confirmed order: Claude Platform -> Claude Code -> Claude Cowork -> Claude.ai
    const paths = CLAUDE_ACADEMY_PATHS;
    expect(paths.map((c) => c.id)).toEqual(CLAUDE_ACADEMY_ORDER);
    const aiIds = AI_CERTIFICATES.map((c) => c.id);
    for (const id of CLAUDE_ACADEMY_ORDER) expect(aiIds).not.toContain(id);
    expect(AI_CERTIFICATES.some((c) => c.issuer === "Claude Academy")).toBe(false);
    expect(GENERAL_CERTIFICATES.some((c) => c.issuer === "Claude Academy")).toBe(false);
    for (const p of paths) {
      expect(p.id.startsWith("ce-claude-academy-")).toBe(true);
      expect(p.issuer).toBe("Claude Academy");
      expect(p.logo).toBe("/logos/claude.png");
      expect(p.tile.tile).toBe("bg-[#D97757]");
      expect(p.tile.wordmark).toBe("Claude");
      expect(p.tile.code).toBe("Academy");
      expect(p.courses.length).toBeGreaterThan(0);
      for (const c of p.courses) {
        expect(c.level).toBeUndefined();
        expect(c.badge).toBeDefined();
        expect(c.badge?.provider).toBe("Claude Academy");
        expect(existsSync(path.join(PUBLIC_DIR, c.badge!.image)), `${c.badge!.image} missing`).toBe(true);
      }
    }
    expect(existsSync(path.join(PUBLIC_DIR, "logos/claude.png"))).toBe(true);
    // The counted AI group holds the three specializations plus the two
    // LinkedIn Learning singles.
    const ai = CREDENTIAL_GROUPS.find((g) => g.id === "group-ai");
    expect(ai?.credentials).toHaveLength(5);
    expect(ai?.credentials.map(credentialSlug)).toEqual([
      "spec-google-ai-professional",
      "spec-google-ai-essentials",
      "spec-google-prompting-essentials",
      "cert-ai-2",
      "cert-ai-1",
    ]);
    const academy = COURSEWORK_GROUPS.find((g) => g.id === "claude-academy");
    expect(academy?.credentials.map(credentialSlug)).toEqual(CLAUDE_ACADEMY_ORDER);
    expect(academy?.credentials.every((c) => c.kind === "path")).toBe(true);
  });

  it("keeps every Claude Academy title out of the JSON-LD credential feed", () => {
    const blob = JSON.stringify(certifications);
    expect(blob).not.toMatch(/Claude/i);
    expect(blob).not.toMatch(/Anthropic/i);
    for (const p of CLAUDE_ACADEMY_PATHS) {
      expect(certifications.map((x) => x.title)).not.toContain(p.titleLines[0]);
    }
  });

  it("pins every Claude Academy course and verify URL", () => {
    const allCourses = CLAUDE_ACADEMY_PATHS.flatMap((p) => p.courses);
    expect(allCourses).toHaveLength(14);
    for (const c of allCourses) {
      expect(c.badge?.url).toMatch(/^https:\/\/academy\.claude\.com\/(verify\/[0-9a-f]{32}|badges\/[0-9a-f-]{36}|courses\/[a-z0-9-]+)$/);
      expect(existsSync(path.join(PUBLIC_DIR, c.badge!.image)), `${c.badge!.image} missing`).toBe(true);
    }
    const allPathUrls = ALL_COURSEWORK.map((p) => p.url);
    for (const u of allPathUrls) {
      expect(u).not.toContain("skilljar.com");
      expect(u).not.toContain("cc.sj-cdn.net");
    }
  });

  it("gives ISTQB the only official accreditation badge across single certificates", () => {
    const istqb = GENERAL_CERTIFICATES.find((c) => c.id === "g-1");
    expect(istqb?.isOfficial).toBe(true);
    expect(istqb?.officialBadge).toBe("/badges/ISTQB-CTFL-badge.png");
    expect(istqb?.courseBadge).toBeUndefined();
    expect(istqb?.courseUrl).toBeUndefined();

    const all = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES];
    expect(all.filter((c) => c.officialBadge || c.courseBadge)).toHaveLength(1);
    expect(all.filter((c) => c.officialBadge)).toEqual([istqb]);
    expect(all.filter((c) => c.isOfficial)).toEqual([istqb]);
  });

  it("organises Claude Academy into four product-focused learning paths", () => {
    expect(CLAUDE_ACADEMY_PATHS.map((p) => p.titleLines[0])).toEqual([
      "Claude Platform",
      "Claude Code",
      "Claude Cowork",
      "Claude.ai",
    ]);
  });

  it("earns the AI Skills chip from a data flag, on paths as well as certificates", () => {
    expect(AI_CERTIFICATES.filter((c) => c.aiSkills).map((c) => c.id)).toEqual(["ai-2", "ai-1"]);
    expect(CLAUDE_ACADEMY_PATHS.every((p) => p.aiSkills === true)).toBe(true);
    expect(LEARNING_PATHS.every((p) => p.aiSkills === true)).toBe(true);
    for (const c of CONTINUING_EDUCATION) {
      expect(c.id).toBe("ce-stanford-xee100");
      expect(c.aiSkills).toBeUndefined();
    }
    expect(GENERAL_CERTIFICATES.filter((c) => c.aiSkills)).toEqual([]);
    for (const s of SPECIALIZATIONS) expect(s).not.toHaveProperty("aiSkills");
    const flagged = [
      ...AI_CERTIFICATES,
      ...GENERAL_CERTIFICATES,
      ...ALL_COURSEWORK,
    ].filter((c) => c.aiSkills === true);
    expect(flagged).toHaveLength(12);
  });

  it("leaves no orphan decagon and no trace of the superseded Skilljar thumbnails", () => {
    const referenced = new Set(
      CLAUDE_ACADEMY_PATHS.flatMap((p) => p.courses.map((c) => path.basename(c.badge!.image))),
    );
    const onDisk = readdirSync(path.join(PUBLIC_DIR, "badges/claude-academy"));
    expect([...onDisk].sort()).toEqual([...referenced].sort());
    expect(referenced.size).toBe(14);
    for (const stale of RETIRED_SKILLJAR_THUMBS) {
      expect(existsSync(path.join(PUBLIC_DIR, stale)), `${stale} should be deleted`).toBe(false);
    }
  });

  it("is absent from every array that feeds the ledger, the stats or the JSON-LD", () => {
    const ledgerSlugs = CREDENTIAL_GROUPS.flatMap((g) => g.credentials.map(credentialSlug));
    const singleIds = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES].map((c) => c.id);
    const specIds = SPECIALIZATIONS.map((s) => s.id);
    const schemaTitles = certifications.map((c) => c.title);
    expect(ALL_COURSEWORK).toHaveLength(11);
    for (const entry of ALL_COURSEWORK) {
      expect(ledgerSlugs).not.toContain(entry.id);
      expect(ledgerSlugs).not.toContain(`cert-${entry.id}`);
      expect(singleIds).not.toContain(entry.id);
      expect(specIds).not.toContain(entry.id);
      expect(schemaTitles).not.toContain(entry.titleLines[0]);
    }
  });

  it("keeps the four counted ledger groups at four, none of them coursework", () => {
    // tests/e2e/certifications.spec.ts counts section[id^="group-"] at exactly
    // 4 and may not be edited.
    expect(CREDENTIAL_GROUPS).toHaveLength(4);
    expect(CREDENTIAL_GROUPS.map((g) => g.id)).toEqual([
      "group-ai",
      "group-leadership",
      "group-testing",
      "group-engineering",
    ]);
    for (const g of CREDENTIAL_GROUPS) {
      // `kind` is typed "specialization" | "single" here, so a literal
      // !== "path" comparison is itself a tsc error — the guard is structural.
      // This asserts the same fact at runtime without tripping TS2367.
      expect(
        g.credentials.every((c) => ["specialization", "single"].includes(c.kind)),
      ).toBe(true);
      // The derived "N credentials · all verified" line is legal only here.
      expect(g.countLabel).toBeUndefined();
    }
  });

  it("renders coursework through groups whose ids can never match section[id^='group-']", () => {
    // Owner-confirmed page order: Claude Academy → Google Skills → Continuing Education.
    expect(COURSEWORK_GROUPS.map((g) => g.id)).toEqual([
      "claude-academy",
      "google-skills",
      "continuing-education",
    ]);
    for (const g of COURSEWORK_GROUPS) {
      expect(g.id.startsWith("group-")).toBe(false);
      // All coursework groups are learning paths.
      const kinds = new Set(g.credentials.map((c) => c.kind));
      expect([...kinds]).toEqual(["path"]);
    }
  });

  it("keeps the specialization heading namespace to the four specializations", () => {
    // The page's other frozen count:
    // section[aria-labelledby^="specialization-path-heading"] === 4.
    expect(SPECIALIZATIONS).toHaveLength(4);
    for (const s of SPECIALIZATIONS) {
      expect(s.headingId.startsWith("specialization-path-heading")).toBe(true);
    }
    for (const e of ALL_COURSEWORK) {
      expect(e.headingId).toBe(`${e.id}-heading`);
      expect(e.headingId.startsWith("specialization-path-heading")).toBe(false);
    }
  });

  it("slugs the coursework rows by their bare ids, with no collisions anywhere", () => {
    const ledgerSlugs = CREDENTIAL_GROUPS.flatMap((g) => g.credentials.map(credentialSlug));
    const courseworkSlugs = COURSEWORK_GROUPS.flatMap((g) => g.credentials.map(credentialSlug));
    expect(courseworkSlugs).toEqual(ALL_COURSEWORK.map((p) => p.id));
    const all = [...ledgerSlugs, ...courseworkSlugs];
    expect(new Set(all).size).toBe(all.length);
  });

  it("never claims a credential in its own data", () => {
    for (const entry of ALL_COURSEWORK) {
      expect(entry.url).toMatch(ISSUER_URL);
      expect(["Path page", "Course page"]).toContain(entry.urlLabel);
      expect(JSON.stringify(entry)).not.toMatch(/certified/i);
      for (const key of CREDENTIAL_ONLY_KEYS) expect(entry).not.toHaveProperty(key);
    }
  });

  it("states nowhere what the issuer does not issue", () => {
    // The user chose structural honesty over a repeated caveat; every one of
    // these strings was deleted and must never come back.
    const blob =
      JSON.stringify(ALL_COURSEWORK) +
      JSON.stringify(COURSEWORK_GROUPS.map((g) => [g.eyebrow, g.title, g.countLabel]));
    for (const banned of [
      /no certificate/i,
      /issues no certificate/i,
      /not a certification/i,
      /non-credential/i,
      /certified/i,
      /all verified/i,
      /exam not taken/i,
      /\bnot counted\b/i,
      /non-credit/i,
      /separate credential/i,
    ]) {
      expect(blob).not.toMatch(banned);
    }
    for (const e of ALL_COURSEWORK) expect(e).not.toHaveProperty("formatNote");
  });

  it("renders cards top-to-bottom in the owner's curated order, never chronological", () => {
    // The array order IS the display order (see EXPECTED_ORDER). Nothing sorts
    // at runtime and no date is read.
    expect(ALL_COURSEWORK.map((e) => e.id)).toEqual(EXPECTED_ORDER);
    expect(CLAUDE_ACADEMY_PATHS.map((e) => e.id)).toEqual(EXPECTED_ORDER.slice(0, 4));
    expect(LEARNING_PATHS.map((e) => e.id)).toEqual(EXPECTED_ORDER.slice(4, 10));
    expect(CONTINUING_EDUCATION.map((e) => e.id)).toEqual(["ce-stanford-xee100"]);
  });
});

describe("the three coursework group headers", () => {
  it("never print 'credentials', 'all verified' or 'certified'", () => {
    for (const g of COURSEWORK_GROUPS) {
      expect(g.countLabel, `${g.id} must override the derived credential line`).toBeDefined();
      const header = `${g.eyebrow} ${g.title} ${g.countLabel}`;
      expect(header).not.toMatch(/credential/i);
      expect(header).not.toMatch(/all verified/i);
      expect(header).not.toMatch(/certified/i);
    }
  });

  it("count DISTINCT badge pages, not badge references", () => {
    // 31 references resolve to 26 distinct badge pages for Google Skills, plus 14 for Claude Academy: 45 total, 40 distinct.
    expect(badged).toHaveLength(45);
    expect(new Set(badged.map((b) => b.badge.url)).size).toBe(40);
    const googleEntries = LEARNING_PATHS.reduce((n, e) => n + e.courses.length, 0);
    expect(googleEntries).toBe(31);
    const claudeEntries = CLAUDE_ACADEMY_PATHS.reduce((n, e) => n + e.courses.length, 0);
    expect(claudeEntries).toBe(14);
    expect(COURSEWORK_GROUPS[0].countLabel).toBe("4 learning paths · 14 course badges");
    expect(COURSEWORK_GROUPS[1].countLabel).toBe("6 learning paths · 26 course badges");
    expect(COURSEWORK_GROUPS[2].countLabel).toBe("1 short course · 5 modules");
  });

  it("counts the Claude Academy section by learning paths and badges", () => {
    const academy = COURSEWORK_GROUPS[0];
    expect(academy.id).toBe("claude-academy");
    expect(academy.title).toBe("Claude Academy");
    expect(academy.eyebrow).toBe("Completed Learning Paths");
    expect(academy.countLabel).toBe("4 learning paths · 14 course badges");
    expect(academy.credentials).toHaveLength(4);
    expect(new Set(CLAUDE_ACADEMY_PATHS.flatMap((p) => p.courses.map((c) => c.badge?.url))).size).toBe(14);
  });
});

describe("the row template's own fields are populated for every card", () => {
  it("carries every field CredentialRow reads, with unique heading and test ids", () => {
    const headings = new Set<string>();
    const testIds = new Set<string>();
    for (const e of ALL_COURSEWORK) {
      expect(e.titleLines[0].trim().length).toBeGreaterThan(0);
      expect(e.titleLines[1]).toMatch(/^(\d+-(Course|Module) (Path|Course|Track)|Developer Path)$/);
      expect(e.gradient).toMatch(/^from-/);
      expect(e.description.length).toBeGreaterThan(80);
      expect(["list", "badges"]).toContain(e.coursesLayout);
      expect(["path", "course"]).toContain(e.urlNoun);
      headings.add(e.headingId);
      testIds.add(e.testId);
    }
    expect(headings.size).toBe(11);
    expect(testIds.size).toBe(11);
  });

  it("keeps the chip noun and the unit count honest on every card", () => {
    const shape = Object.fromEntries(
      ALL_COURSEWORK.map((e) => [e.id, [e.totalCourses, e.unitNoun, e.courses.length]]),
    );
    expect(shape).toEqual({
      "ce-claude-academy-platform": [1, "Course", 1],
      "ce-claude-academy-code": [5, "Courses", 5],
      "ce-claude-academy-cowork": [2, "Courses", 2],
      "ce-claude-academy-chat": [6, "Courses", 6],
      "ce-google-skills-multi-agent-4459": [3, "Courses", 3],
      "ce-google-skills-deploy-agents-3802": [3, "Courses", 3],
      "ce-google-skills-beginner-gen-ai-118": [4, "Courses", 4],
      "ce-google-skills-agents-3546": [3, "Courses", 3],
      "ce-google-skills-smb-4020": [13, "Courses", 13],
      "ce-google-skills-gen-ai-leader-1951": [5, "Courses", 5],
      "ce-stanford-xee100": [5, "Modules", 5],
    });
  });

  it("gives every course a contiguous 1..n step, which the grid uses as its key", () => {
    for (const e of ALL_COURSEWORK) {
      expect(e.courses.map((c) => c.step)).toEqual(
        Array.from({ length: e.courses.length }, (_, i) => i + 1),
      );
    }
  });

  it("only references an issuer logo that exists, and never one for Stanford", () => {
    for (const e of LEARNING_PATHS) {
      expect(e.logo).toBe("/logos/google.png");
      expect(existsSync(path.join(PUBLIC_DIR, e.logo as string))).toBe(true);
    }
    for (const e of CLAUDE_ACADEMY_PATHS) {
      expect(e.logo).toBe("/logos/claude.png");
      expect(existsSync(path.join(PUBLIC_DIR, e.logo as string))).toBe(true);
    }
    expect(byId("ce-stanford-xee100")?.logo).toBeUndefined();
  });

  it("keeps every issuer tile an opaque fixed hex, with a family-only wordmark class", () => {
    // Measured as GROUNDS, identical in both themes: white on #174EA6 7.85:1
    // and on #8C1515 9.40:1; white/80 5.65:1 and 6.44:1. A font-<weight> or
    // tracking-* here would land beside t-h2 in the hero and break the
    // one-t-*-per-element rule.
    for (const e of ALL_COURSEWORK) {
      expect(e.tile.tile).toMatch(/^bg-\[#[0-9A-Fa-f]{6}\]$/);
      expect(e.tile.wordmark.trim().length).toBeGreaterThan(0);
      expect(e.tile.code.trim().length).toBeGreaterThan(0);
      if (e.tile.wordmarkFamily !== undefined) {
        expect(e.tile.wordmarkFamily).toBe("font-serif");
      }
    }
    expect(byId("ce-stanford-xee100")?.tile.tile).toBe("bg-[#8C1515]");
    expect(byId("ce-stanford-xee100")?.tile.code).toBe("XEE100");
    expect(byId("ce-stanford-xee100")?.tile.wordmarkFamily).toBe("font-serif");
    expect(LEARNING_PATHS.every((e) => e.tile.tile === "bg-[#174EA6]")).toBe(true);
    expect(LEARNING_PATHS.every((e) => e.tile.wordmarkFamily === undefined)).toBe(true);
    expect(CLAUDE_ACADEMY_PATHS.every((e) => e.tile.tile === "bg-[#D97757]")).toBe(true);
    expect(CLAUDE_ACADEMY_PATHS.every((e) => e.tile.wordmark === "Claude" && e.tile.code === "Academy" && e.tile.wordmarkFamily === "font-serif")).toBe(true);
  });

  it("puts the badge grid on Google and Claude paths and the list on Stanford", () => {
    expect(LEARNING_PATHS.every((e) => e.coursesLayout === "badges")).toBe(true);
    expect(CLAUDE_ACADEMY_PATHS.every((e) => e.coursesLayout === "badges")).toBe(true);
    expect(byId("ce-stanford-xee100")?.coursesLayout).toBe("list");
  });
});

describe("course-level badges", () => {
  it("has the expected course and badge counts per card", () => {
    const shape = Object.fromEntries(
      ALL_COURSEWORK.map((e) => [
        e.id,
        [e.courses.length, e.courses.filter((c) => c.badge).length],
      ]),
    );
    expect(shape).toEqual({
      "ce-claude-academy-platform": [1, 1],
      "ce-claude-academy-code": [5, 5],
      "ce-claude-academy-cowork": [2, 2],
      "ce-claude-academy-chat": [6, 6],
      "ce-google-skills-multi-agent-4459": [3, 3],
      "ce-google-skills-deploy-agents-3802": [3, 3],
      "ce-google-skills-beginner-gen-ai-118": [4, 4],
      "ce-google-skills-agents-3546": [3, 3],
      "ce-google-skills-smb-4020": [13, 13],
      "ce-google-skills-gen-ai-leader-1951": [5, 5],
      "ce-stanford-xee100": [5, 0],
    });
  });

  it("never counts a Welcome or Wrap Up bookend as a course", () => {
    // STANDING RULE (owner, 2026-09-11): Welcome and Wrap Up modules are never
    // courses, in any path, now or in future. Google's path pages list them as
    // activities — path 3546 shows 5 activities for 3 courses — so a future
    // scrape will hand them over again. This is the guard that rejects them.
    for (const entry of ALL_COURSEWORK) {
      for (const course of entry.courses) {
        expect(course.title, `${entry.id} still lists a bookend`).not.toMatch(
          /^\s*(welcome|wrap[\s-]?up)\b/i,
        );
      }
    }
  });

  it("gives EVERY course on a badge-grid path a well-formed badge", () => {
    // The invariant restored on 2026-09-12, when the owner dropped the one
    // badge-less unit on the page (path 4459's hands-on lab, /focuses/125061)
    // from the data rather than rendering a tile for it. Every listed course on
    // a "badges" path now carries a badge, so the grid has a single arm and can
    // never paint an empty tile — and this is the guard that keeps it that way.
    // A future badge-less course must fail HERE, loudly, not render blank.
    for (const entry of ALL_COURSEWORK.filter((e) => e.coursesLayout === "badges")) {
      for (const course of entry.courses) {
        const where = `${entry.id} / ${course.title}`;
        const badge = course.badge;
        expect(badge, `${where} has no badge`).toBeDefined();
        expect(badge?.url, where).toMatch(/^https:\/\/[^\s]+$/);
        expect(badge?.image, where).toMatch(/^\/badges\/[^\s]+\.webp$/);
        expect(["completion", "skill"], where).toContain(badge?.kind);
        expect(["Google Skills", "Credly", "Claude Academy"], where).toContain(badge?.provider);
      }
    }
    // Stanford is the only entry whose courses carry none, and it renders the
    // list layout, never the badge grid.
    expect(byId("ce-stanford-xee100")?.coursesLayout).toBe("list");
  });

  it("no longer lists the excluded hands-on lab anywhere in the data", () => {
    // Owner's call, 2026-09-12: a badge-less lab does not show what was
    // achieved, and labs sit inside many of these courses without being
    // surfaced, so listing one standalone was inconsistent. It is excluded from
    // the data, not merely hidden — chip, meta line and grid all count 3.
    // Plain substring, deliberately: a lookahead excluding "… ADK &" would let
    // the excluded lab back in under a name like "Build Multi-Agent Systems
    // with ADK & MCP", which is the regression this guards. No surviving
    // title contains this string ("Collaborative" sits between the words).
    expect(JSON.stringify(ALL_COURSEWORK)).not.toContain(
      "Build Multi-Agent Systems with ADK",
    );
    const path4459 = byId("ce-google-skills-multi-agent-4459");
    expect(path4459?.courses.map((c) => c.title)).toEqual([
      "Build Collaborative Multi-Agent Systems with ADK & MCP",
      "Build Agent Skills with Google",
      "Use Agent Skills with Multi-Agent Systems",
    ]);
    expect(path4459?.titleLines[1]).toBe("3-Course Path");
  });

  it("keeps Stanford's five modules verbatim and badge-free", () => {
    const stanford = byId("ce-stanford-xee100");
    expect(stanford?.courses.map((c) => c.title)).toEqual([
      "Cool Applications",
      "Sensors",
      "Embedded Systems",
      "Networking",
      "Circuits",
    ]);
    expect(stanford?.courses.every((c) => c.badge === undefined)).toBe(true);
  });

  it("uses unique, non-empty course titles within each entry (they are React keys)", () => {
    for (const entry of ALL_COURSEWORK) {
      const titles = entry.courses.map((c) => c.title);
      expect(new Set(titles).size).toBe(titles.length);
      for (const title of titles) expect(title.trim().length).toBeGreaterThan(0);
    }
  });

  it("points only at its provider's public, login-free badge page", () => {
    for (const { badge } of badged) {
      expect(Object.keys(BADGE_URL_BY_PROVIDER)).toContain(badge.provider);
      expect(badge.url).toMatch(BADGE_URL_BY_PROVIDER[badge.provider]);
    }
  });

  it("links exactly three badges at Credly, everything else at Google Skills, kind independent", () => {
    // `kind` (what the ARTWORK says the award is) and `provider` (which
    // platform's copy is linked) are separate fields and are pinned
    // separately. This test used to assert that the skill-badge set equalled
    // the Credly set, which silently forbade a Google-Skills-hosted skill
    // badge — and 27886491 is one: its art reads "SKILL BADGE · INTERMEDIATE"
    // and Google's raw PNG uses the 1000x666 landscape skill template, not the
    // 1000x908 completion template. Every Credly badge is still a skill badge;
    // the converse is what no longer holds.
    const byUrl = new Map(badged.map(({ badge }) => [badge.url, badge]));
    const credly = [...byUrl.values()].filter((b) => b.provider === "Credly");
    const skill = [...byUrl.values()].filter((b) => b.kind === "skill");
    expect(credly.map((b) => b.url).sort()).toEqual([...CREDLY_BADGE_URLS].sort());
    expect(credly.every((b) => b.kind === "skill")).toBe(true);
    expect(skill.map((b) => b.url).sort()).toEqual(
      [...CREDLY_BADGE_URLS, `${GS_PROFILE}/badges/27886491`].sort(),
    );
    expect([...byUrl.values()].filter((b) => b.provider === "Google Skills")).toHaveLength(23);
    // A course shared by two paths carries identical kind and provider in both.
    for (const { badge } of badged) {
      expect(byUrl.get(badge.url)?.kind).toBe(badge.kind);
      expect(byUrl.get(badge.url)?.provider).toBe(badge.provider);
    }
  });

  it("ships a local thumbnail, in its provider's folder, that exists on disk under public/", () => {
    for (const { badge } of badged) {
      expect(badge.image).toMatch(BADGE_IMAGE_BY_PROVIDER[badge.provider]);
      expect(existsSync(path.join(PUBLIC_DIR, badge.image)), `${badge.image} is missing`).toBe(true);
    }
  });

  it("displays all three Credly badges as art, not merely as links", () => {
    // The owner asked for these explicitly. Credly art sits flat in /badges/,
    // beside the ledger's other Credly art.
    const credlyImages = badged
      .filter(({ badge }) => badge.provider === "Credly")
      .map(({ badge }) => badge.image);
    expect([...new Set(credlyImages)].sort()).toEqual([
      "/badges/create-your-first-gemini-enterprise-application.webp",
      "/badges/deploy-multi-agent-architectures.webp",
      "/badges/prompt-design-in-vertex-ai.webp",
    ]);
  });

  it("leaves no orphan art in public/badges/google-skills/", () => {
    const onDisk = readdirSync(path.join(PUBLIC_DIR, "badges/google-skills"))
      .filter((f) => f.endsWith(".webp"))
      .map((f) => `/badges/google-skills/${f}`)
      .sort();
    const referenced = [
      ...new Set(
        badged
          .filter(({ badge }) => badge.provider === "Google Skills")
          .map(({ badge }) => badge.image),
      ),
    ].sort();
    expect(referenced).toHaveLength(23);
    expect(onDisk).toEqual(referenced);
  });

  it("maps one badge id to one image, even for a course shared by two paths", () => {
    const imageByUrl = new Map<string, string>();
    for (const { badge } of badged) {
      const seen = imageByUrl.get(badge.url);
      if (seen) expect(seen).toBe(badge.image);
      else imageByUrl.set(badge.url, badge.image);
    }
    expect(imageByUrl.size).toBe(40);
    expect(new Set(imageByUrl.values()).size).toBe(40);
    // 27855015 was withheld while path 4459 was unfinished. The path completed
    // on 2026-09-11, so its three badges are now on the page — this asserts
    // they arrived, and with the art the scrape recorded for them.
    expect(imageByUrl.get(`${GS_PROFILE}/badges/27855015`)).toBe(
      "/badges/google-skills/build-collaborative-multi-agent-systems-adk-mcp.webp",
    );
    expect(imageByUrl.get(`${GS_PROFILE}/badges/27885513`)).toBe(
      "/badges/google-skills/build-agent-skills-with-google.webp",
    );
    expect(imageByUrl.get(`${GS_PROFILE}/badges/27886491`)).toBe(
      "/badges/google-skills/use-agent-skills-with-multi-agent-systems.webp",
    );
    // Path 3802's own two Google Skills badges, plus its Credly skill badge.
    expect(imageByUrl.get(`${GS_PROFILE}/badges/27888328`)).toBe(
      "/badges/google-skills/build-and-deploy-agents-in-production.webp",
    );
    expect(imageByUrl.get(`${GS_PROFILE}/badges/27888392`)).toBe(
      "/badges/google-skills/deploy-your-first-agent.webp",
    );
    expect(imageByUrl.get(CREDLY_BADGE_URLS[2])).toBe(
      "/badges/deploy-multi-agent-architectures.webp",
    );
  });

  it("prints the ISSUER'S course title and nothing about the destination page", () => {
    // A `linkTitle` field once put Credly's own name for a badge in brackets
    // after the course title on one tile; the owner removed the parenthetical
    // on 2026-09-11 and the field with it. No badge may carry a name for its
    // destination again, and in particular the Prompt Design course keeps
    // GOOGLE'S title — renaming it to Credly's "Prompt Design in Vertex AI
    // Skill Badge" would make the card disagree with the path page it links to.
    for (const { badge } of badged) {
      expect(badge).not.toHaveProperty("linkTitle");
      expect(Object.keys(badge).sort()).toEqual(["image", "kind", "provider", "url"]);
    }
    const promptDesign = badged.find(({ badge }) => badge.url === CREDLY_BADGE_URLS[0]);
    expect(promptDesign?.course.title).toBe("Prompt Design in Agent Platform");
    expect(JSON.stringify(ALL_COURSEWORK)).not.toMatch(/Prompt Design in Vertex AI/);
  });
});

describe("the Generative AI Leader card", () => {
  const leader = byId("ce-google-skills-gen-ai-leader-1951");

  it("is headed exactly 'Generative AI Leader', with no appended qualifier", () => {
    expect(leader?.titleLines[0]).toBe("Generative AI Leader");
    expect(leader?.titleLines[0]).not.toMatch(/certification|exam|prep|path|—|–/i);
  });

  it("carries Google's own 'Train for the exam' framing in the collapsed meta line", () => {
    expect(leader?.metaSuffix).toBe("“Train for the exam”");
    // Exactly one card carries a metaSuffix, and it is not a disclaimer.
    expect(ALL_COURSEWORK.filter((e) => e.metaSuffix !== undefined)).toHaveLength(1);
  });

  it("keeps Google's official path title searchable as an attributed citation", () => {
    expect(leader?.officialTitleNote).toBe(
      "Listed by Google as “Generative AI Leader Certification”, the “Train for the exam” path for the Google Cloud Generative AI Leader certification.",
    );
    expect(JSON.stringify(leader)).not.toMatch(/certified/i);
    // Exactly one card cites an official title.
    expect(ALL_COURSEWORK.filter((e) => e.officialTitleNote !== undefined)).toHaveLength(1);
  });
});

describe("the badge grid generalises without breaking the frozen 7-item layout", () => {
  it("reproduces the Professional Certificate's 2-3-2 exactly at n=7", () => {
    expect(gridPositions(7)).toEqual(PRO_CERT_GRID_POSITIONS);
  });

  it("lays out 1..16 items without dropping or duplicating a cell", () => {
    for (let n = 1; n <= 16; n++) {
      const positions = gridPositions(n);
      expect(positions, `n=${n}`).toHaveLength(n);
      for (const p of positions) expect(p).toMatch(/^col-start-\d col-end-\d$/);
    }
    // The three shapes this page actually renders.
    expect(gridPositions(4)).toHaveLength(4);
    expect(gridPositions(5)).toHaveLength(5);
    expect(gridPositions(13)).toHaveLength(13);
    // An empty grid yields no cells. Unreachable from this page's data (every
    // card has 1..13 units, asserted above), but without the guard the fallback
    // resolves ROW_SHAPES[0] -> [0] -> ROW_COLS[0] ?? ROW_COLS[3] and hands
    // back three column strings for zero tiles.
    expect(gridPositions(0)).toEqual([]);
    expect(gridPositions(-1)).toEqual([]);
  });
});
