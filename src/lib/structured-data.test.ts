import { describe, it, expect } from "vitest";
import {
  SITE_URL,
  PERSON_ID,
  absoluteUrl,
  breadcrumbList,
  websiteSchema,
  certificationsSchema,
  projectsSchema,
  blogSchema,
} from "./structured-data";
import type { Certification } from "@/data/portfolio";

describe("absoluteUrl", () => {
  it("returns the bare site root for an empty path (no trailing slash)", () => {
    expect(absoluteUrl("")).toBe(SITE_URL);
  });

  it("keeps an existing leading slash", () => {
    expect(absoluteUrl("/experience")).toBe(`${SITE_URL}/experience`);
  });

  it("adds a missing leading slash", () => {
    expect(absoluteUrl("projects")).toBe(`${SITE_URL}/projects`);
  });
});

describe("breadcrumbList", () => {
  const ld = breadcrumbList([
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
  ]);

  it("is a schema.org BreadcrumbList", () => {
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BreadcrumbList");
  });

  it("numbers items from 1 and resolves absolute URLs", () => {
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    });
    expect(ld.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Blog",
      item: `${SITE_URL}/blog`,
    });
  });
});

describe("websiteSchema", () => {
  const ld = websiteSchema();

  it("declares a WebSite entity at the canonical URL", () => {
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.url).toBe(SITE_URL);
    expect(ld.inLanguage).toBe("en-US");
  });

  it("links author/publisher to the Person @id", () => {
    expect(ld.author["@id"]).toBe(PERSON_ID);
    expect(ld.publisher["@id"]).toBe(PERSON_ID);
  });
});

describe("certificationsSchema", () => {
  const certs: Certification[] = [
    { title: "ISTQB CTFL", category: "testing" },
    { title: "Google AI Professional Certificate", category: "ai" },
    { title: "Scrum: Advanced", category: "leadership" },
  ];
  const ld = certificationsSchema(certs);

  it("is a ProfilePage wrapping an ItemList of credentials", () => {
    expect(ld["@type"]).toBe("ProfilePage");
    expect(ld.hasPart["@type"]).toBe("ItemList");
    expect(ld.hasPart.numberOfItems).toBe(3);
    expect(ld.hasPart.itemListElement).toHaveLength(3);
  });

  it("maps each entry to an EducationalOccupationalCredential with a readable category", () => {
    const items = ld.hasPart.itemListElement;
    expect(items[0].item).toMatchObject({
      "@type": "EducationalOccupationalCredential",
      name: "ISTQB CTFL",
      credentialCategory: "Software Testing",
    });
    expect(items[1].item.credentialCategory).toBe("AI & Machine Learning");
    expect(items[2].item.credentialCategory).toBe("Leadership & Management");
  });
});

describe("projectsSchema", () => {
  const projects = [
    {
      id: "a",
      name: "Project A",
      tagline: "Tagline A",
      description: "Description A",
      category: "AI-Powered",
      tech: ["Python", "Shell"],
      repo: "https://github.com/x/a",
      demo: "https://a.example",
    },
    {
      id: "b",
      name: "Project B",
      tagline: "Tagline B",
      description: "Description B",
      category: "Web & DevOps",
      tech: ["Next.js"],
      repo: "https://github.com/x/b",
      demo: null,
    },
  ];
  const ld = projectsSchema(projects);

  it("is a CollectionPage with an ItemList of SoftwareSourceCode", () => {
    expect(ld["@type"]).toBe("CollectionPage");
    expect(ld.mainEntity["@type"]).toBe("ItemList");
    expect(ld.mainEntity.numberOfItems).toBe(2);
  });

  it("carries the repo, languages and keywords for each project", () => {
    const first = ld.mainEntity.itemListElement[0].item;
    expect(first["@type"]).toBe("SoftwareSourceCode");
    expect(first.codeRepository).toBe("https://github.com/x/a");
    expect(first.url).toBe("https://a.example");
    expect(first.programmingLanguage).toEqual(["Python", "Shell"]);
    expect(first.keywords).toBe("Python, Shell");
  });

  it("falls back to the repo URL when a project has no demo", () => {
    expect(ld.mainEntity.itemListElement[1].item.url).toBe("https://github.com/x/b");
  });
});

describe("blogSchema", () => {
  const posts = [
    { slug: "post-one", title: "Post One", description: "First post", date: "2026-01-01" },
    { slug: "post-two", title: "Post Two", description: "Second post", date: "2026-02-02" },
  ];
  const ld = blogSchema(posts);

  it("is a Blog with one BlogPosting per post", () => {
    expect(ld["@type"]).toBe("Blog");
    expect(ld.blogPost).toHaveLength(2);
  });

  it("links each post to its canonical absolute URL", () => {
    expect(ld.blogPost[0]).toMatchObject({
      "@type": "BlogPosting",
      headline: "Post One",
      datePublished: "2026-01-01",
      url: `${SITE_URL}/blog/post-one`,
    });
    expect(ld.blogPost[0].mainEntityOfPage["@id"]).toBe(`${SITE_URL}/blog/post-one`);
  });
});
