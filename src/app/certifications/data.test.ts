import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

const PUBLIC_DIR = fileURLToPath(new URL("../../../public/", import.meta.url));

/** The owner's public Google Skills profile — every badge page under it
 *  returns 200 logged-out (verified by curl on 2026-09-10/11). */
const GOOGLE_SKILLS_BADGE_URL =
  /^https:\/\/www\.skills\.google\/public_profiles\/aece174b-451d-4d6f-928d-6def28946025\/badges\/\d+$/;
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

  it("point only at the public, login-free Google Skills profile", () => {
    // 4 (Beginner) + 3 (Agents) + 13 (SMB) + 5 (Gen AI Leader) + 0 (Stanford).
    expect(badged.length).toBe(25);
    for (const { badge } of badged) expect(badge.url).toMatch(GOOGLE_SKILLS_BADGE_URL);
  });

  it("mark exactly the two lab-based, Credly-issued skill badges as kind 'skill'", () => {
    const kindByUrl = new Map(badged.map(({ badge }) => [badge.url, badge.kind]));
    const skillIds = [...kindByUrl]
      .filter(([, kind]) => kind === "skill")
      .map(([url]) => Number(url.split("/").pop()))
      .sort((a, b) => a - b);
    expect(skillIds).toEqual([27848848, 27852046]);
    for (const [, kind] of kindByUrl) expect(["completion", "skill"]).toContain(kind);
    // A shared course carries the same kind in every path that lists it.
    for (const { badge } of badged) expect(kindByUrl.get(badge.url)).toBe(badge.kind);
  });

  it("ship a local thumbnail that exists on disk under public/", () => {
    for (const { badge } of badged) {
      expect(badge.image).toMatch(/^\/badges\/google-skills\/[a-z0-9-]+\.webp$/);
      expect(existsSync(path.join(PUBLIC_DIR, badge.image)), `${badge.image} is missing`).toBe(true);
    }
  });

  it("map one badge id to one image, even for a course shared by two paths", () => {
    const imageByUrl = new Map<string, string>();
    for (const { badge } of badged) {
      const seen = imageByUrl.get(badge.url);
      if (seen) expect(seen).toBe(badge.image);
      else imageByUrl.set(badge.url, badge.image);
    }
    // 20 distinct badges across the four completed paths (Google Skills →
    // Credentials → Completions also lists a 21st, 27855015, from an
    // unfinished path — it must never appear here).
    expect(imageByUrl.size).toBe(20);
    expect(new Set(imageByUrl.values()).size).toBe(20);
    expect([...imageByUrl.keys()].some((url) => url.endsWith("/badges/27855015"))).toBe(false);
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
