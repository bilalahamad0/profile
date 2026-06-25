import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

const BASE = "https://bilalahamad.com";
const STATIC = [
  BASE,
  `${BASE}/experience`,
  `${BASE}/projects`,
  `${BASE}/certifications`,
  `${BASE}/ai`,
  `${BASE}/blog`,
  `${BASE}/contact`,
];

describe("sitemap", () => {
  const routes = sitemap();
  const byUrl = (url: string) => routes.find((r) => r.url === url);
  const blogPosts = routes.filter((r) => r.url.startsWith(`${BASE}/blog/`));
  const validBlogTimes = blogPosts
    .map((p) => (p.lastModified as Date).getTime())
    .filter((t) => !Number.isNaN(t));

  it("includes all seven canonical static routes", () => {
    for (const url of STATIC) expect(byUrl(url)).toBeDefined();
  });

  it("uses absolute https URLs on the canonical host everywhere", () => {
    for (const route of routes) expect(route.url.startsWith(BASE)).toBe(true);
  });

  it("gives the homepage top priority", () => {
    expect(byUrl(BASE)?.priority).toBe(1);
  });

  it("keeps every priority within the [0, 1] range", () => {
    for (const route of routes) {
      expect(route.priority).toBeGreaterThanOrEqual(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });

  it("emits at least one blog-post entry, each stamped with a lastModified date", () => {
    expect(blogPosts.length).toBeGreaterThan(0);
    for (const post of blogPosts) expect(post.lastModified).toBeInstanceOf(Date);
  });

  it("dates the homepage and blog index from the newest post", () => {
    const newest = Math.max(...validBlogTimes);
    expect((byUrl(BASE)?.lastModified as Date).getTime()).toBe(newest);
    expect((byUrl(`${BASE}/blog`)?.lastModified as Date).getTime()).toBe(newest);
  });

  it("has exactly the seven static routes plus one entry per blog post", () => {
    expect(routes).toHaveLength(STATIC.length + blogPosts.length);
  });
});
