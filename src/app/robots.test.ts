import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  it("points at the sitemap and declares the canonical host", () => {
    expect(result.sitemap).toBe("https://bilalahamad.com/sitemap.xml");
    expect(result.host).toBe("https://bilalahamad.com");
  });

  it("allows all crawlers at the root and disallows only the API", () => {
    const wildcard = rules.find((rule) => rule.userAgent === "*");
    expect(wildcard).toBeDefined();
    expect(wildcard?.allow).toBe("/");
    expect(wildcard?.disallow).toEqual(["/api/"]);
  });

  // Regression guard: blocking /_next/ hides every CSS/JS chunk and next/image
  // URL from Google's renderer (GSC live test: "15/16 resources blocked").
  it("never blocks the render resources under /_next/", () => {
    for (const rule of rules) {
      const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
      expect(disallow.some((path) => path?.startsWith("/_next"))).toBe(false);
    }
  });

  it("explicitly welcomes the major AI/LLM crawlers", () => {
    const agents = rules.flatMap((rule) =>
      Array.isArray(rule.userAgent) ? rule.userAgent : rule.userAgent ? [rule.userAgent] : []
    );
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]) {
      expect(agents).toContain(bot);
    }
  });

  it("keeps the AI-crawler rule scoped to the same disallow list", () => {
    const aiRule = rules.find(
      (rule) => Array.isArray(rule.userAgent) && rule.userAgent.includes("GPTBot")
    );
    expect(aiRule?.allow).toBe("/");
    expect(aiRule?.disallow).toEqual(["/api/"]);
  });
});
