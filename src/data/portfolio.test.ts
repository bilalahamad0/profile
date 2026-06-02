import { describe, it, expect } from "vitest";
import {
  experienceData,
  skills,
  certifications,
  certs,
  recommendations,
  projectsData,
  linkedInPosts,
} from "./portfolio";
import { getAllPosts } from "@/lib/blog";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DURATION_RE = /^[A-Z][a-z]{2} \d{4} - ([A-Z][a-z]{2} \d{4}|Present)$/;
const LOGO_RE = /^\/logos\/[\w-]+\.(png|svg)$/;
const REPO_RE = /^https:\/\/github\.com\/bilalahamad0\/[\w.-]+$/;
const LINKEDIN_RE = /^https:\/\/www\.linkedin\.com\//;

const PROJECT_CATEGORIES = new Set([
  "All",
  "IoT & Automation",
  "Data & Analytics",
  "AI-Powered",
  "Web & DevOps",
]);
// Accent keys the AI Lab card maps to color classes (src/app/ai/page.tsx).
const ACCENTS = new Set(["emerald", "blue", "pink", "violet"]);

function startTimestamp(duration: string): number {
  const [mon, year] = duration.split(" - ")[0].split(" ");
  return new Date(Number(year), MONTHS.indexOf(mon), 1).getTime();
}

function isHttps(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

describe("experienceData", () => {
  it("contains at least one role", () => {
    expect(experienceData.length).toBeGreaterThan(0);
  });

  it.each(experienceData)("$company — has complete, well-formed fields", (entry) => {
    expect(entry.role.trim()).not.toBe("");
    expect(entry.company.trim()).not.toBe("");
    expect(entry.location.trim()).not.toBe("");
    expect(entry.desc.trim()).not.toBe("");
    expect(entry.duration).toMatch(DURATION_RE);
    expect(entry.file).toMatch(LOGO_RE);
    expect(typeof entry.faang).toBe("boolean");
    expect(typeof entry.invertLogo).toBe("boolean");

    expect(Array.isArray(entry.highlights)).toBe(true);
    expect(entry.highlights.length).toBeGreaterThan(0);
    for (const h of entry.highlights) {
      expect(h.trim()).not.toBe("");
    }
  });

  it("is ordered most-recent-first by start date", () => {
    const starts = experienceData.map((e) => startTimestamp(e.duration));
    for (let i = 1; i < starts.length; i++) {
      expect(starts[i - 1]).toBeGreaterThanOrEqual(starts[i]);
    }
  });
});

describe("skills", () => {
  it.each(skills)("$name — has name, icon and color", (skill) => {
    expect(skill.name.trim()).not.toBe("");
    expect(skill.color.trim()).not.toBe("");
    expect(skill.icon).toBeTruthy();
  });

  it("has unique skill names", () => {
    const names = skills.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("certifications", () => {
  it.each(certifications)("$title — valid title and category", (cert) => {
    expect(cert.title.trim()).not.toBe("");
    expect(["ai", "testing", "leadership"]).toContain(cert.category);
  });

  it("has unique titles", () => {
    const titles = certifications.map((c) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("certs mirrors the certification titles exactly", () => {
    expect(certs).toEqual(certifications.map((c) => c.title));
  });
});

describe("recommendations", () => {
  it.each(recommendations)("$name — has name, title and a substantive review", (rec) => {
    expect(rec.name.trim()).not.toBe("");
    expect(rec.title.trim()).not.toBe("");
    expect(rec.review.trim().length).toBeGreaterThan(30);
  });
});

describe("projectsData", () => {
  it("has unique project ids", () => {
    const ids = projectsData.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(projectsData)("$id — well-formed project entry", (project) => {
    expect(project.id.trim()).not.toBe("");
    expect(project.name.trim()).not.toBe("");
    expect(project.tagline.trim()).not.toBe("");
    expect(project.description.trim()).not.toBe("");

    expect(PROJECT_CATEGORIES.has(project.category)).toBe(true);
    expect(ACCENTS.has(project.accent)).toBe(true);

    expect(Array.isArray(project.tech)).toBe(true);
    expect(project.tech.length).toBeGreaterThan(0);
    for (const t of project.tech) expect(t.trim()).not.toBe("");

    expect(Array.isArray(project.aiTools)).toBe(true);
    expect(project.aiTools.length).toBeGreaterThan(0);

    expect(project.repo).toMatch(REPO_RE);
    if (project.demo !== null) expect(isHttps(project.demo)).toBe(true);

    expect(typeof project.isAI).toBe("boolean");
    expect(typeof project.aiContribution).toBe("number");
    expect(project.aiContribution).toBeGreaterThan(0);
    expect(project.aiContribution).toBeLessThanOrEqual(100);

    expect(Array.isArray(project.relatedPosts)).toBe(true);
  });

  it("every related blog slug resolves to a real published post", () => {
    const realSlugs = new Set(getAllPosts().map((p) => p.slug));
    const broken: string[] = [];
    for (const project of projectsData) {
      for (const post of project.relatedPosts ?? []) {
        if (!realSlugs.has(post.slug)) broken.push(`${project.id} → ${post.slug}`);
      }
    }
    expect(broken).toEqual([]);
  });
});

describe("linkedInPosts", () => {
  it("has unique ids", () => {
    const ids = linkedInPosts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(linkedInPosts)("$id — well-formed LinkedIn post", (post) => {
    expect(post.title.trim()).not.toBe("");
    expect(post.excerpt.trim()).not.toBe("");
    expect(post.category).toBe("LinkedIn");
    expect(post.url).toMatch(LINKEDIN_RE);
    expect(Number.isNaN(new Date(post.date).getTime())).toBe(false);

    expect(post.tags.length).toBeGreaterThan(0);
    for (const tag of post.tags) expect(tag).toMatch(/^#/);

    if (post.thumbnail)
      expect(isHttps(post.thumbnail) || post.thumbnail.startsWith("/")).toBe(true);
  });
});
