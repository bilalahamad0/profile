import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  AI_CERTIFICATES,
  CERT_STATS,
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
  ...LEARNING_PATHS,
  ...CONTINUING_EDUCATION,
];

const BADGE_URL_BY_PROVIDER = {
  "Google Skills":
    /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/,
  Credly: /^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url$/,
} as const;
const BADGE_IMAGE_BY_PROVIDER = {
  "Google Skills": /^\/badges\/google-skills\/[a-z0-9-]+\.webp$/,
  Credly: /^\/badges\/[a-z0-9-]+\.webp$/,
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
  /^https:\/\/(online\.stanford\.edu\/courses\/[a-z0-9-]+|www\.skills\.google\/paths\/\d+)$/;
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
 *  choice, dated 2026-09-11, and the order LEARNING_PATHS itself is written in.
 *  It is NOT chronological and must never be re-derived from a completion date:
 *  path 3802 was finished last of the six and sits FOURTH. Earlier revisions of
 *  this file asserted reverse chronology; that rule is gone, not overridden. */
const EXPECTED_ORDER = [
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

  it("is absent from every array that feeds the ledger, the stats or the JSON-LD", () => {
    const ledgerSlugs = CREDENTIAL_GROUPS.flatMap((g) => g.credentials.map(credentialSlug));
    const singleIds = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES].map((c) => c.id);
    const specIds = SPECIALIZATIONS.map((s) => s.id);
    const schemaTitles = certifications.map((c) => c.title);
    expect(ALL_COURSEWORK).toHaveLength(7);
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
      "group-testing",
      "group-leadership",
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
    expect(COURSEWORK_GROUPS.map((g) => g.id)).toEqual(["google-skills", "continuing-education"]);
    for (const g of COURSEWORK_GROUPS) {
      expect(g.id.startsWith("group-")).toBe(false);
      expect(g.credentials.every((c) => c.kind === "path")).toBe(true);
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
    expect(courseworkSlugs).toEqual(EXPECTED_ORDER);
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

  it("lists the six Google paths in the owner's curated order, then Stanford", () => {
    // The array order IS the display order (see EXPECTED_ORDER). Nothing sorts
    // at runtime and no date is read: 3802 was completed last and sits fourth.
    expect(ALL_COURSEWORK.map((e) => e.id)).toEqual(EXPECTED_ORDER);
    expect(LEARNING_PATHS.map((e) => e.id)).toEqual(EXPECTED_ORDER.slice(0, 6));
    expect(CONTINUING_EDUCATION.map((e) => e.id)).toEqual(["ce-stanford-xee100"]);
  });
});

describe("the two coursework group headers", () => {
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
    // 31 references resolve to 26 distinct badge pages: Google reuses five
    // courses between paths. Printing 31 would overstate the awards held.
    expect(badged).toHaveLength(31);
    expect(new Set(badged.map((b) => b.badge.url)).size).toBe(26);
    // 31 course entries across the six Google paths, and 31 badge references:
    // the two are EQUAL because every listed course carries a badge.
    const courseEntries = LEARNING_PATHS.reduce((n, e) => n + e.courses.length, 0);
    expect(courseEntries).toBe(31);
    expect(courseEntries).toBe(badged.length);
    expect(COURSEWORK_GROUPS[0].countLabel).toBe("6 learning paths · 26 course badges");
    expect(COURSEWORK_GROUPS[1].countLabel).toBe("1 short course · 5 modules");
  });
});

describe("the row template's own fields are populated for every card", () => {
  it("carries every field CredentialRow reads, with unique heading and test ids", () => {
    const headings = new Set<string>();
    const testIds = new Set<string>();
    for (const e of ALL_COURSEWORK) {
      expect(e.titleLines[0].trim().length).toBeGreaterThan(0);
      expect(e.titleLines[1]).toMatch(/^\d+-(Course|Module) (Path|Course)$/);
      expect(e.gradient).toMatch(/^from-/);
      expect(e.description.length).toBeGreaterThan(80);
      expect(["list", "badges"]).toContain(e.coursesLayout);
      expect(["path", "course"]).toContain(e.urlNoun);
      headings.add(e.headingId);
      testIds.add(e.testId);
    }
    expect(headings.size).toBe(7);
    expect(testIds.size).toBe(7);
  });

  it("keeps the chip noun and the unit count honest on every card", () => {
    const shape = Object.fromEntries(
      ALL_COURSEWORK.map((e) => [e.id, [e.totalCourses, e.unitNoun, e.courses.length]]),
    );
    expect(shape).toEqual({
      // 3, not the 6 activities Google's path page counts: two are Welcome/Wrap
      // Up bookends and one is the badge-less lab the owner excluded outright
      // on 2026-09-12 (see the note on the path in data.ts).
      "ce-google-skills-multi-agent-4459": [3, "Courses", 3],
      // 3, not the 5 activities Google's path page counts — same bookend rule.
      "ce-google-skills-deploy-agents-3802": [3, "Courses", 3],
      "ce-google-skills-beginner-gen-ai-118": [4, "Courses", 4],
      // 3, not the 5 activities Google's path page counts: the "Welcome:" and
      // "Wrap Up:" bookends are not courses.
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
  });

  it("puts the badge grid on the six Google paths and the list on Stanford", () => {
    expect(LEARNING_PATHS.every((e) => e.coursesLayout === "badges")).toBe(true);
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
        expect(["Google Skills", "Credly"], where).toContain(badge?.provider);
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
    expect(imageByUrl.size).toBe(26);
    expect(new Set(imageByUrl.values()).size).toBe(26);
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
