import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  AI_CERTIFICATES,
  CERT_STATS,
  CONTINUING_EDUCATION,
  CREDENTIAL_GROUPS,
  GENERAL_CERTIFICATES,
  SPECIALIZATIONS,
  credentialSlug,
} from "./data";
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

/** Public badge page per PROVIDER. Both return 200 logged-out behind no login
 *  wall (verified by curl 2026-09-10/11): every page under the owner's public
 *  Google Skills profile, and the two Credly `public_url` pages. */
const BADGE_URL_BY_PROVIDER = {
  "Google Skills":
    /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/,
  Credly: /^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}\/public_url$/,
} as const;
/** Thumbnail folder per provider: Google Skills art is namespaced, Credly art
 *  sits flat in /badges/ beside the ledger's other Credly badges. */
const BADGE_IMAGE_BY_PROVIDER = {
  "Google Skills": /^\/badges\/google-skills\/[a-z0-9-]+\.webp$/,
  Credly: /^\/badges\/[a-z0-9-]+\.webp$/,
} as const;
/** The two lab-based Google Cloud skill badges, linked at their Credly copies.
 *  Google Skills badge 27848848 / 27852046 are their twins. */
const CREDLY_BADGE_URLS = [
  "https://www.credly.com/badges/328f785b-dc1b-4f73-9ed2-d9a8eb7c8e71/public_url",
  "https://www.credly.com/badges/fc080ecb-a01b-4ca4-a99f-4f008a846da9/public_url",
];
/** The ONE badge the two platforms name differently: Credly's exact og:title
 *  for the course Google lists inside path 118 as "Prompt Design in Agent
 *  Platform". `fc080ecb…` is titled identically on both, so it carries none. */
const PROMPT_DESIGN_BADGE_URL = CREDLY_BADGE_URLS[0];
const PROMPT_DESIGN_LINK_TITLE = "Prompt Design in Vertex AI Skill Badge";
const GEMINI_ENTERPRISE_BADGE_URL = CREDLY_BADGE_URLS[1];
const COURSE_URL =
  /^https:\/\/(online\.stanford\.edu\/courses\/[a-z0-9-]+|www\.skills\.google\/paths\/\d+)$/;
/** Keys the ENTRY type must never grow — verification lives on a course. */
const ENTRY_LEVEL_VERIFICATION_KEYS = [
  "url",
  "image",
  "logo",
  "badge",
  "credlyUrl",
  "officialBadge",
];

const EXPECTED_ORDER = [
  "ce-google-skills-beginner-gen-ai-118",
  "ce-google-skills-agents-3546",
  "ce-google-skills-smb-4020",
  "ce-google-skills-gen-ai-leader-1951",
  "ce-stanford-xee100",
];

const byId = (id: string) => CONTINUING_EDUCATION.find((e) => e.id === id);

const badged = CONTINUING_EDUCATION.flatMap((entry) =>
  entry.courses.flatMap((course) =>
    course.badge ? [{ entry, course, badge: course.badge }] : [],
  ),
);

describe("continuing education is never counted as a credential", () => {
  it("does not move the computed stats strip", () => {
    expect(CERT_STATS.credentials).toBe(17);
    expect(CERT_STATS.specializations).toBe(SPECIALIZATIONS.length);
    expect(CERT_STATS.credentials).toBe(
      SPECIALIZATIONS.length + AI_CERTIFICATES.length + GENERAL_CERTIFICATES.length,
    );
  });

  it("is absent from every array that feeds the ledger, the stats or the JSON-LD", () => {
    const ledgerSlugs = CREDENTIAL_GROUPS.flatMap((g) =>
      g.credentials.map(credentialSlug),
    );
    const singleIds = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES].map((c) => c.id);
    const specIds = SPECIALIZATIONS.map((s) => s.id);
    const schemaTitles = certifications.map((c) => c.title);

    expect(CONTINUING_EDUCATION.length).toBeGreaterThan(0);
    for (const entry of CONTINUING_EDUCATION) {
      expect(ledgerSlugs).not.toContain(entry.id);
      expect(ledgerSlugs).not.toContain(`cert-${entry.id}`);
      expect(singleIds).not.toContain(entry.id);
      expect(specIds).not.toContain(entry.id);
      // portfolio.ts `certifications` feeds BOTH certificationsSchema()
      // (EducationalOccupationalCredential) and the `certs` summary card.
      expect(schemaTitles).not.toContain(entry.title);
    }
  });

  it("never claims a credential in its own data", () => {
    for (const entry of CONTINUING_EDUCATION) {
      expect(entry.courseUrl).toMatch(COURSE_URL);
      expect(entry.title).not.toMatch(/certified/i);
      expect(entry.meta).not.toMatch(/certified/i);
      expect(entry.status).not.toMatch(/certified|verified/i);
      expect(entry.formatNote).not.toMatch(/certified/i);
      // One quiet caveat per card, stated exactly once — the tone guard.
      expect(entry.formatNote.match(/no certificate/gi) ?? []).toHaveLength(1);
      // The ENTRY type cannot express verification; keep it that way.
      for (const key of ENTRY_LEVEL_VERIFICATION_KEYS) {
        expect(entry).not.toHaveProperty(key);
      }
    }
  });

  it("lists the Google paths (all completed 2026-09-10 PDT, Beginner last) in reverse chronology, then Stanford", () => {
    expect(CONTINUING_EDUCATION.map((e) => e.id)).toEqual(EXPECTED_ORDER);
  });
});

describe("course-level completion badges", () => {
  it("has the expected course and badge counts per card", () => {
    const shape = Object.fromEntries(
      CONTINUING_EDUCATION.map((e) => [
        e.id,
        [e.courses.length, e.courses.filter((c) => c.badge).length],
      ]),
    );
    expect(shape).toEqual({
      "ce-google-skills-beginner-gen-ai-118": [4, 4],
      "ce-google-skills-agents-3546": [5, 3],
      "ce-google-skills-smb-4020": [13, 13],
      "ce-google-skills-gen-ai-leader-1951": [5, 5],
      "ce-stanford-xee100": [5, 0],
    });
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
    for (const entry of CONTINUING_EDUCATION) {
      const titles = entry.courses.map((c) => c.title);
      expect(new Set(titles).size).toBe(titles.length);
      for (const title of titles) expect(title.trim().length).toBeGreaterThan(0);
    }
  });

  it("point only at their provider's public, login-free badge page", () => {
    // 4 (Beginner) + 3 (Agents) + 13 (SMB) + 5 (Gen AI Leader) + 0 (Stanford).
    expect(badged.length).toBe(25);
    for (const { badge } of badged) {
      expect(Object.keys(BADGE_URL_BY_PROVIDER)).toContain(badge.provider);
      expect(badge.url, `${badge.url} is not a ${badge.provider} badge page`).toMatch(
        BADGE_URL_BY_PROVIDER[badge.provider],
      );
    }
  });

  it("link exactly the two lab-based skill badges at Credly, everything else at Google Skills", () => {
    const byUrl = new Map(badged.map(({ badge }) => [badge.url, badge]));
    // `kind` and `provider` are INDEPENDENT fields by design — a skill badge
    // exists on both platforms and this site links whichever copy the owner
    // chose. Today the correlation happens to be exact, so assert it in both
    // directions on the current data; if a future completion badge is ever
    // linked at Credly, this expectation moves — the type does not.
    const credly = [...byUrl.values()].filter((b) => b.provider === "Credly");
    const skill = [...byUrl.values()].filter((b) => b.kind === "skill");
    expect(credly.map((b) => b.url).sort()).toEqual(CREDLY_BADGE_URLS);
    expect(skill.map((b) => b.url).sort()).toEqual(CREDLY_BADGE_URLS);
    expect([...byUrl.values()].filter((b) => b.provider === "Google Skills")).toHaveLength(18);
    for (const badge of byUrl.values()) {
      expect(["completion", "skill"]).toContain(badge.kind);
      expect(["Google Skills", "Credly"]).toContain(badge.provider);
    }
    // A shared course carries the same kind and provider in every path.
    for (const { badge } of badged) {
      expect(byUrl.get(badge.url)?.kind).toBe(badge.kind);
      expect(byUrl.get(badge.url)?.provider).toBe(badge.provider);
    }
  });

  it("ship a local thumbnail, in its provider's folder, that exists on disk under public/", () => {
    for (const { badge } of badged) {
      expect(badge.image, `${badge.image} is not in the ${badge.provider} folder`).toMatch(
        BADGE_IMAGE_BY_PROVIDER[badge.provider],
      );
      expect(existsSync(path.join(PUBLIC_DIR, badge.image)), `${badge.image} is missing`).toBe(true);
    }
  });

  it("leave no orphan art in public/badges/google-skills/", () => {
    // That folder exists ONLY for this section, so it must hold exactly the
    // Google Skills thumbnails referenced above — 18 files, 18 references.
    // public/badges/ itself is shared with the ledger's Credly art, so only
    // assert that the two files referenced there exist (done above), never
    // that the folder has no extras.
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
    expect(referenced).toHaveLength(18);
    expect(onDisk).toEqual(referenced);
  });

  it("map one badge id to one image, even for a course shared by two paths", () => {
    const imageByUrl = new Map<string, string>();
    for (const { badge } of badged) {
      const seen = imageByUrl.get(badge.url);
      if (seen) expect(seen).toBe(badge.image);
      else imageByUrl.set(badge.url, badge.image);
    }
    // 20 distinct badges across the four completed paths — 18 linked at Google
    // Skills, 2 at Credly (Google Skills → Credentials → Completions also
    // lists a 21st, 27855015, from an unfinished path: it must never appear).
    expect(imageByUrl.size).toBe(20);
    expect(new Set(imageByUrl.values()).size).toBe(20);
    expect([...imageByUrl.keys()].some((url) => url.endsWith("/badges/27855015"))).toBe(false);
  });

  it("names the destination on exactly the one badge whose platform title differs", () => {
    // `linkTitle` is the chip's visible "…and Credly calls it this" annotation,
    // so it must be set ONLY where the two names actually disagree — one badge
    // today. A second one appearing here without a real mismatch would print a
    // parenthetical for nothing.
    const withLinkTitle = badged.filter(({ badge }) => badge.linkTitle !== undefined);
    expect(withLinkTitle.map(({ badge }) => badge.url)).toEqual([PROMPT_DESIGN_BADGE_URL]);
    expect(withLinkTitle[0]?.badge.linkTitle).toBe(PROMPT_DESIGN_LINK_TITLE);
    expect(withLinkTitle[0]?.course.title).toBe("Prompt Design in Agent Platform");
    // Credly titles this one identically to the course, so it carries none.
    const gemini = badged.find(({ badge }) => badge.url === GEMINI_ENTERPRISE_BADGE_URL);
    expect(gemini?.badge).toBeDefined();
    expect(gemini?.badge.linkTitle).toBeUndefined();
  });

  it("never carries a linkTitle equal to the course title that references it", () => {
    // The field MEANS "these two names disagree". A value equal to the course
    // title is therefore a bug, not a harmless duplicate — it would render the
    // same words twice inside one chip.
    for (const { course, badge } of badged) {
      if (badge.linkTitle === undefined) continue;
      expect(badge.linkTitle.trim().length).toBeGreaterThan(0);
      expect(
        badge.linkTitle,
        `${course.title} carries a redundant linkTitle`,
      ).not.toBe(course.title);
    }
  });
});

describe("the Generative AI Leader path is exam prep, not the certification", () => {
  const leader = byId("ce-google-skills-gen-ai-leader-1951");

  it("keeps the word 'Certification' out of the heading entirely", () => {
    expect(leader?.title).toBe("Generative AI Leader — Exam-Prep Learning Path");
    expect(leader?.title).not.toMatch(/certification/i);
  });

  it("keeps Google's official path title searchable, quoted, in the meta line", () => {
    expect(leader?.meta).toContain("“Generative AI Leader Certification”");
  });

  it("frames the path the way Google Cloud's certification page does: “Train for the exam”", () => {
    // Assert the CONTRACT, not the sentence: Google Cloud's own certification
    // page files this path under Quick links as "Train for the exam", the
    // meta must lead with that framing, and Google's official path title must
    // survive in quotation marks (ATS searchability + attribution). A copy
    // tweak inside those bounds is not a regression; breaking any of them is.
    const meta = leader?.meta ?? "";
    expect(meta).toMatch(/^“Train for the exam”/);
    expect(meta).toContain("Google Cloud Generative AI Leader certification");
    expect(meta).toContain("“Generative AI Leader Certification”");
    // "Certification" never stands unqualified: every occurrence is inside the
    // quoted official title or attached to "Google Cloud … certification".
    expect(meta).not.toMatch(/certified/i);
  });

  it("never says certified, and names the certification as a separate credential not taken", () => {
    expect(JSON.stringify(leader)).not.toMatch(/certified/i);
    expect(leader?.formatNote).toMatch(/separate credential/i);
    expect(leader?.formatNote).toMatch(/exam not taken/i);
  });
});
