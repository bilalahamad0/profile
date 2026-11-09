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
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page not found");
    expect(screen.getByText("Error 404")).toBeInTheDocument();

    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(homeLinks[0]).toHaveAttribute("href", "/");

    expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute("href", "/experience");
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
  });
});
