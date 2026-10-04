import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BookingEmbed } from "./booking-embed";
import { SCHEDULING_EMBED_URL } from "@/lib/contact";

describe("BookingEmbed", () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    // Reset location in happy-dom
    window.location.hash = "";
    window.location.search = "";

    // Mock clipboard safely
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
    mockWriteText.mockClear();
  });

  afterEach(() => {
    window.location.hash = "";
    window.location.search = "";
    vi.restoreAllMocks();
  });

  it("renders placeholder on demand by default when no booking intent is present", () => {
    render(<BookingEmbed />);
    expect(screen.getByRole("button", { name: /Load booking calendar/i })).toBeInTheDocument();
    expect(screen.queryByTitle(/Book a 1:1 call with Bilal Ahamad/i)).not.toBeInTheDocument();
  });

  it("loads iframe when the load button is clicked", () => {
    render(<BookingEmbed />);
    const loadButton = screen.getByRole("button", { name: /Load booking calendar/i });
    fireEvent.click(loadButton);

    const iframe = screen.getByTitle(/Book a 1:1 call with Bilal Ahamad/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", SCHEDULING_EMBED_URL);
  });

  it("auto-loads iframe immediately when arriving with #book hash", async () => {
    window.location.hash = "#book";
    render(<BookingEmbed />);

    await waitFor(() => {
      const iframe = screen.getByTitle(/Book a 1:1 call with Bilal Ahamad/i);
      expect(iframe).toBeInTheDocument();
    });
  });

  it("auto-loads iframe immediately when arriving with ?book=true query parameter", async () => {
    window.location.search = "?book=true";
    render(<BookingEmbed />);

    await waitFor(() => {
      const iframe = screen.getByTitle(/Book a 1:1 call with Bilal Ahamad/i);
      expect(iframe).toBeInTheDocument();
    });
  });

  it("auto-loads iframe immediately when arriving with ?schedule=true query parameter", async () => {
    window.location.search = "?schedule=true";
    render(<BookingEmbed />);

    await waitFor(() => {
      const iframe = screen.getByTitle(/Book a 1:1 call with Bilal Ahamad/i);
      expect(iframe).toBeInTheDocument();
    });
  });

  it("auto-loads when hashchange event fires with #book", async () => {
    render(<BookingEmbed />);
    expect(screen.queryByTitle(/Book a 1:1 call with Bilal Ahamad/i)).not.toBeInTheDocument();

    act(() => {
      window.location.hash = "#book";
      window.dispatchEvent(new Event("hashchange"));
    });

    await waitFor(() => {
      expect(screen.getByTitle(/Book a 1:1 call with Bilal Ahamad/i)).toBeInTheDocument();
    });
  });

  it("copies /book link to clipboard when Share Calendar button is clicked", async () => {
    render(<BookingEmbed />);
    const shareButton = screen.getByRole("button", { name: /Share calendar booking link/i });
    fireEvent.click(shareButton);

    expect(mockWriteText).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/Copied \/book link!/i)).toBeInTheDocument();
    });
  });

  it("copies /book link when clicking direct link text button", async () => {
    render(<BookingEmbed />);
    const linkButton = screen.getByRole("button", { name: /Copy bilalahamad\.com\/book to clipboard/i });
    act(() => {
      fireEvent.click(linkButton);
    });

    expect(mockWriteText).toHaveBeenCalled();
  });
});
