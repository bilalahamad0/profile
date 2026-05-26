import { describe, it, expect, vi, beforeEach } from "vitest";

const { existsSync, readdirSync, readFileSync } = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock("fs", () => ({
  default: { existsSync, readdirSync, readFileSync },
  existsSync,
  readdirSync,
  readFileSync,
}));

import { getAllPosts, getPostBySlug } from "./blog";

const fullPost = `---
title: Full Post
date: 2025-08-20
description: A complete post
tags:
  - ai
  - qa
category: Whitepaper
featured: true
linkedinUrl: https://linkedin.com/x
---
Body with several words here to compute the reading time estimate.`;

// No frontmatter fields — exercises every \`?? fallback\` branch.
const barePost = `---
---
Just body text, nothing in the frontmatter block at all.`;

beforeEach(() => {
  vi.clearAllMocks();
  existsSync.mockReturnValue(true);
});

describe("getAllPosts()", () => {
  it("returns an empty list when the content directory is missing", () => {
    existsSync.mockReturnValue(false);
    expect(getAllPosts()).toEqual([]);
  });

  it("parses frontmatter and computes a positive reading time", () => {
    readdirSync.mockReturnValue(["full.mdx"]);
    readFileSync.mockReturnValue(fullPost);

    const posts = getAllPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      slug: "full",
      title: "Full Post",
      description: "A complete post",
      category: "Whitepaper",
      featured: true,
      linkedinUrl: "https://linkedin.com/x",
    });
    expect(posts[0].tags).toEqual(["ai", "qa"]);
    expect(posts[0].readingTime).toBeGreaterThan(0);
  });

  it("falls back to defaults when frontmatter fields are absent", () => {
    readdirSync.mockReturnValue(["bare.mdx"]);
    readFileSync.mockReturnValue(barePost);

    const [post] = getAllPosts();

    expect(post.title).toBe("bare"); // slug fallback
    expect(post.date).toBe("");
    expect(post.description).toBe("");
    expect(post.tags).toEqual([]);
    expect(post.category).toBe("Project Story");
    expect(post.featured).toBe(false);
    expect(post.linkedinUrl).toBeUndefined();
  });

  it("ignores files that are not .mdx", () => {
    readdirSync.mockReturnValue(["a.mdx", "b.txt", "c.md", "d.mdxx"]);
    readFileSync.mockReturnValue(fullPost);
    expect(getAllPosts()).toHaveLength(1);
  });

  it("sorts posts newest-first by date", () => {
    readdirSync.mockReturnValue(["old.mdx", "new.mdx"]);
    readFileSync.mockImplementation((p: unknown) =>
      String(p).includes("old")
        ? "---\ntitle: Old\ndate: 2024-01-01\n---\nbody"
        : "---\ntitle: New\ndate: 2025-12-31\n---\nbody"
    );

    expect(getAllPosts().map((p) => p.title)).toEqual(["New", "Old"]);
  });

  it("sanitizes slugs to alphanumerics and dashes", () => {
    readdirSync.mockReturnValue(["we!rd@slug name.mdx"]);
    readFileSync.mockReturnValue(fullPost);
    expect(getAllPosts()[0].slug).toBe("werdslugname");
  });
});

describe("getPostBySlug()", () => {
  it("returns null when the file does not exist", () => {
    existsSync.mockReturnValue(false);
    expect(getPostBySlug("missing")).toBeNull();
  });

  it("returns the post including its body content", () => {
    readFileSync.mockReturnValue(fullPost);

    const post = getPostBySlug("full");

    expect(post).not.toBeNull();
    expect(post?.title).toBe("Full Post");
    expect(post?.content).toContain("Body with several words");
    expect(post?.readingTime).toBeGreaterThan(0);
  });

  it("applies frontmatter fallbacks for a sparse file", () => {
    readFileSync.mockReturnValue(barePost);

    const post = getPostBySlug("bare");

    expect(post?.title).toBe("bare");
    expect(post?.category).toBe("Project Story");
    expect(post?.tags).toEqual([]);
    expect(post?.featured).toBe(false);
  });
});
