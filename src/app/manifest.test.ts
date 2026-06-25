import { describe, it, expect } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
  const m = manifest();

  it("declares the core PWA identity fields", () => {
    expect(m.name).toContain("Bilal Ahamad");
    expect(m.short_name).toBe("Bilal Ahamad");
    expect(m.description).toBeTruthy();
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
  });

  it("uses a consistent dark theme/background color", () => {
    expect(m.background_color).toBe("#09090b");
    expect(m.theme_color).toBe("#09090b");
  });

  it("ships PNG icons in both 192 and 512 sizes from the site root", () => {
    const icons = m.icons ?? [];
    const sizes = icons.map((icon) => icon.sizes);
    expect(sizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    for (const icon of icons) {
      expect(icon.type).toBe("image/png");
      expect(icon.src.startsWith("/")).toBe(true);
    }
  });
});
