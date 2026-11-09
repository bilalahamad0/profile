import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound, { metadata } from "./not-found";

describe("NotFound component & metadata", () => {
  it("exports metadata with noindex, nofollow to prevent crawler indexing", () => {
    expect(metadata.title).toBe("Page Not Found");
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("renders 404 heading and navigation recovery links", () => {
    render(<NotFound />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Page not found");
    expect(screen.getByText("Error 404")).toBeDefined();

    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(homeLinks[0].getAttribute("href")).toBe("/");

    expect(screen.getByRole("link", { name: /experience/i }).getAttribute("href")).toBe("/experience");
    expect(screen.getByRole("link", { name: /projects/i }).getAttribute("href")).toBe("/projects");
    expect(screen.getByRole("link", { name: /blog/i }).getAttribute("href")).toBe("/blog");
    expect(screen.getByRole("link", { name: /contact/i }).getAttribute("href")).toBe("/contact");
  });
});
