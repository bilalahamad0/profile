import { describe, it, expect } from "vitest";
import { isLikelyBot, isVerifiedBot } from "./bots";

// Google's documented user agents (developers.google.com/search/docs/crawling-indexing).
const GOOGLEBOT =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const INSPECTION_TOOL =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0;)";
const GOOGLE_OTHER =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 (compatible; GoogleOther)";
const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

describe("bot detection", () => {
  it.each([GOOGLEBOT, INSPECTION_TOOL, GOOGLE_OTHER])("treats Google's crawlers as verified: %s", (ua) => {
    expect(isVerifiedBot(ua)).toBe(true);
    expect(isLikelyBot(ua)).toBe(true);
  });

  it("does not flag a regular browser", () => {
    expect(isVerifiedBot(CHROME)).toBe(false);
    expect(isLikelyBot(CHROME)).toBe(false);
  });

  it("treats a missing user agent as automation but not as a verified bot", () => {
    expect(isVerifiedBot(undefined)).toBe(false);
    expect(isLikelyBot(null)).toBe(true);
  });
});
