import { describe, it, expect } from "vitest";
import { buildLlmsTxt, type LlmsTxtInput } from "./llms-txt";

const input: LlmsTxtInput = {
  experience: [
    {
      role: "Lead QA\nEngineer",
      company: "Acme",
      duration: "Jan 2020 - Present",
      desc: "Did things.\n  More things.",
    },
  ],
  projects: [
    {
      name: "Project A",
      tagline: "Tag A",
      repo: "https://github.com/x/a",
      demo: "https://a.example",
      category: "AI-Powered",
    },
    {
      name: "Project B",
      tagline: "Tag B",
      repo: "https://github.com/x/b",
      demo: null,
      category: "Web & DevOps",
    },
  ],
  certifications: ["ISTQB CTFL", "Google AI Professional Certificate"],
  posts: [{ slug: "post-one", title: "Post One", description: "First post" }],
};

describe("buildLlmsTxt", () => {
  const txt = buildLlmsTxt(input);

  it("opens with an H1 title and a blockquote summary", () => {
    const lines = txt.split("\n");
    expect(lines[0].startsWith("# Bilal Ahamad")).toBe(true);
    expect(txt).toContain("\n> Portfolio of Bilal Ahamad");
  });

  it("includes every top-level section", () => {
    for (const heading of [
      "## Pages",
      "## Experience",
      "## Projects",
      "## Writing",
      "## Certifications",
    ]) {
      expect(txt).toContain(heading);
    }
  });

  it("collapses newlines in roles and descriptions onto single lines", () => {
    expect(txt).toContain("Lead QA Engineer");
    expect(txt).not.toContain("Lead QA\nEngineer");
    expect(txt).toContain("Did things. More things.");
  });

  it("links a project to its demo when present, else the repo", () => {
    expect(txt).toContain("[Project A](https://a.example)");
    expect(txt).toContain("[Project B](https://github.com/x/b)");
  });

  it("links each post to its canonical blog URL", () => {
    expect(txt).toContain("[Post One](https://bilalahamad.com/blog/post-one)");
  });

  it("lists every certification", () => {
    expect(txt).toContain("- ISTQB CTFL");
    expect(txt).toContain("- Google AI Professional Certificate");
  });

  it("never emits an empty bullet", () => {
    for (const line of txt.split("\n")) {
      expect(line.trim()).not.toBe("-");
    }
  });

  it("omits a section entirely when its data is empty", () => {
    const empty = buildLlmsTxt({
      experience: [],
      projects: [],
      certifications: [],
      posts: [],
    });
    expect(empty).toContain("## Pages");
    expect(empty).not.toContain("## Experience");
    expect(empty).not.toContain("## Projects");
    expect(empty).not.toContain("## Writing");
    expect(empty).not.toContain("## Certifications");
  });
});
