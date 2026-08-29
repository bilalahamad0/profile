import { describe, it, expect } from "vitest";
import { cn, formatTokens } from "./utils";

describe("cn() class merger", () => {
  it("joins multiple class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy and conditional values", () => {
    expect(cn("a", false && "skip", undefined, null, "", "c")).toBe("a c");
  });

  it("supports array and object (clsx) syntax", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });

  it("resolves conflicting Tailwind utilities last-wins (twMerge)", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("returns an empty string with no arguments", () => {
    expect(cn()).toBe("");
  });
});

describe("formatTokens() compact token counts", () => {
  it("returns small numbers verbatim", () => {
    expect(formatTokens(0)).toBe("0");
    expect(formatTokens(1)).toBe("1");
    expect(formatTokens(999)).toBe("999");
  });

  it("switches to thousands at 1,000 and rounds to whole k", () => {
    expect(formatTokens(1_000)).toBe("1k");
    expect(formatTokens(1_499)).toBe("1k");
    expect(formatTokens(1_500)).toBe("2k");
  });

  it("switches to millions at 1,000,000 with one decimal", () => {
    expect(formatTokens(999_999)).toBe("1000k");
    expect(formatTokens(1_000_000)).toBe("1.0M");
    expect(formatTokens(1_234_567)).toBe("1.2M");
  });

  it("switches to billions at 1,000,000,000", () => {
    expect(formatTokens(999_999_999)).toBe("1000.0M");
    expect(formatTokens(1_000_000_000)).toBe("1.0B");
    expect(formatTokens(2_500_000_000)).toBe("2.5B");
  });

  it("formats the documented real-world figure", () => {
    // The value the AI metrics table renders for cumulative tokens.
    expect(formatTokens(438_972_981)).toBe("439.0M");
  });
});
