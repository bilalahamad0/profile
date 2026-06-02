import { describe, it, expect } from "vitest";
import {
  slugify,
  normalizeTag,
  urnToPublicUrl,
  extractRestliId,
  composeCommentary,
  buildRegisterUploadPayload,
  buildUgcPayload,
  COMMENTARY_MAX,
} from "./linkedin-core.mjs";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("drops apostrophes/quotes without leaving stray hyphens", () => {
    expect(slugify("Bilal's “Great” Post")).toBe("bilals-great-post");
  });
  it("collapses non-alphanumeric runs and trims hyphens", () => {
    expect(slugify("  AI + ML: the *future*!  ")).toBe("ai-ml-the-future");
  });
  it("strips diacritics", () => {
    expect(slugify("Café Déjà Vu")).toBe("cafe-deja-vu");
  });
  it("produces only [a-z0-9-] (matches blog.ts slug rules)", () => {
    expect(slugify("Q3 2026 — Layoffs & Hiring (Bay Area)")).toMatch(/^[a-z0-9-]+$/);
  });
  it("caps length and never ends with a hyphen", () => {
    const s = slugify("word ".repeat(40));
    expect(s.length).toBeLessThanOrEqual(80);
    expect(s.endsWith("-")).toBe(false);
  });
});

describe("normalizeTag", () => {
  it.each([
    ["#AI", "#ai"],
    ["AI Testing", "#aitesting"],
    ["ai", "#ai"],
    ["##Double", "#double"],
    ["  spaced  ", "#spaced"],
  ])("normalizes %s → %s", (input, expected) => {
    expect(normalizeTag(input)).toBe(expected);
  });
  it("returns empty string for empty/symbol-only input", () => {
    expect(normalizeTag("  ")).toBe("");
    expect(normalizeTag("#")).toBe("");
  });
});

describe("urnToPublicUrl", () => {
  it("builds the feed URL for a share URN", () => {
    expect(urnToPublicUrl("urn:li:share:6844785523593134080")).toBe(
      "https://www.linkedin.com/feed/update/urn:li:share:6844785523593134080/"
    );
  });
  it("builds the feed URL for a ugcPost URN", () => {
    expect(urnToPublicUrl("urn:li:ugcPost:68447855235931240")).toBe(
      "https://www.linkedin.com/feed/update/urn:li:ugcPost:68447855235931240/"
    );
  });
  it("rejects non-share URNs", () => {
    expect(() => urnToPublicUrl("urn:li:person:123")).toThrow();
    expect(() => urnToPublicUrl("nonsense")).toThrow();
  });
});

describe("extractRestliId", () => {
  it("reads x-restli-id from a fetch Headers object", () => {
    const headers = new Headers({ "x-restli-id": "urn:li:share:1" });
    expect(extractRestliId(headers)).toBe("urn:li:share:1");
  });
  it("reads from a plain object case-insensitively", () => {
    expect(extractRestliId({ "X-RestLi-Id": "urn:li:ugcPost:2" })).toBe("urn:li:ugcPost:2");
  });
  it("throws when missing", () => {
    expect(() => extractRestliId({})).toThrow(/x-restli-id/);
  });
});

describe("composeCommentary", () => {
  it("appends the blog link and hashtags", () => {
    const text = composeCommentary({
      body: "We shipped a thing.",
      tags: ["#AI", "Quality Assurance"],
      blogUrl: "https://bilalahamad.com/blog/x",
    });
    expect(text).toContain("We shipped a thing.");
    expect(text).toContain("Read the full post: https://bilalahamad.com/blog/x");
    expect(text).toContain("#ai #qualityassurance");
  });
  it("omits the link when includeLink is false", () => {
    const text = composeCommentary({
      body: "Body",
      blogUrl: "https://bilalahamad.com/blog/x",
      includeLink: false,
    });
    expect(text).not.toContain("Read the full post");
  });
  it("requires a body", () => {
    expect(() => composeCommentary({ body: "  " })).toThrow(/body/);
  });
  it("rejects commentary over the limit", () => {
    expect(() => composeCommentary({ body: "x".repeat(COMMENTARY_MAX + 1) })).toThrow(/too long/);
  });
});

describe("buildRegisterUploadPayload", () => {
  it("builds a feedshare-image register payload", () => {
    const p = buildRegisterUploadPayload("urn:li:person:abc");
    expect(p.registerUploadRequest.owner).toBe("urn:li:person:abc");
    expect(p.registerUploadRequest.recipes).toContain("urn:li:digitalmediaRecipe:feedshare-image");
    expect(p.registerUploadRequest.serviceRelationships[0]).toEqual({
      relationshipType: "OWNER",
      identifier: "urn:li:userGeneratedContent",
    });
  });
  it("rejects a non-person URN", () => {
    expect(() => buildRegisterUploadPayload("urn:li:share:1")).toThrow();
  });
});

describe("buildUgcPayload", () => {
  const author = "urn:li:person:abc";

  it("builds a text-only (NONE) share", () => {
    const p = buildUgcPayload({ authorUrn: author, text: "hi" });
    const content = p.specificContent["com.linkedin.ugc.ShareContent"];
    expect(content.shareMediaCategory).toBe("NONE");
    expect(content.media).toBeUndefined();
    expect(p.visibility["com.linkedin.ugc.MemberNetworkVisibility"]).toBe("PUBLIC");
    expect(p.lifecycleState).toBe("PUBLISHED");
  });

  it("builds an IMAGE share with the asset URN", () => {
    const p = buildUgcPayload({
      authorUrn: author,
      text: "hi",
      assetUrn: "urn:li:digitalmediaAsset:XYZ",
      mediaTitle: "T",
      mediaDescription: "D",
    });
    const content = p.specificContent["com.linkedin.ugc.ShareContent"];
    expect(content.shareMediaCategory).toBe("IMAGE");
    expect(content.media[0].media).toBe("urn:li:digitalmediaAsset:XYZ");
    expect(content.media[0].status).toBe("READY");
    expect(content.media[0].title.text).toBe("T");
  });

  it("builds an ARTICLE share when only a URL is given", () => {
    const p = buildUgcPayload({ authorUrn: author, text: "hi", articleUrl: "https://x.com" });
    const content = p.specificContent["com.linkedin.ugc.ShareContent"];
    expect(content.shareMediaCategory).toBe("ARTICLE");
    expect(content.media[0].originalUrl).toBe("https://x.com");
  });

  it("prefers IMAGE over ARTICLE when both are supplied (one-media rule)", () => {
    const p = buildUgcPayload({
      authorUrn: author,
      text: "hi",
      assetUrn: "urn:li:digitalmediaAsset:XYZ",
      articleUrl: "https://x.com",
    });
    expect(p.specificContent["com.linkedin.ugc.ShareContent"].shareMediaCategory).toBe("IMAGE");
  });

  it("supports CONNECTIONS visibility", () => {
    const p = buildUgcPayload({ authorUrn: author, text: "hi", visibility: "CONNECTIONS" });
    expect(p.visibility["com.linkedin.ugc.MemberNetworkVisibility"]).toBe("CONNECTIONS");
  });

  it("validates required fields and visibility", () => {
    expect(() => buildUgcPayload({ text: "hi" })).toThrow(/authorUrn/);
    expect(() => buildUgcPayload({ authorUrn: author })).toThrow(/text/);
    expect(() => buildUgcPayload({ authorUrn: author, text: "hi", visibility: "SECRET" })).toThrow(
      /visibility/
    );
  });
});
