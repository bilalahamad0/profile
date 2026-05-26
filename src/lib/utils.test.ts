import { describe, it, expect } from "vitest";
import { cn } from "./utils";

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
