import { describe, it, expect } from "vitest";
import {
  SCHEDULING_URL,
  SCHEDULING_EMBED_URL,
  BOOKING_ANCHOR,
  BOOKING_SHARE_PATH,
  BOOKING_SHARE_URL,
} from "./contact";

describe("contact configuration and URLs", () => {
  it("exports a valid Google Calendar scheduling URL", () => {
    expect(SCHEDULING_URL).toMatch(/^https:\/\/calendar\.google\.com\//);
  });

  it("exports an embed URL with ?gv=true parameter", () => {
    expect(SCHEDULING_EMBED_URL).toBe(`${SCHEDULING_URL}?gv=true`);
  });

  it("exports the on-site booking anchor pointing to /contact#book", () => {
    expect(BOOKING_ANCHOR).toBe("/contact#book");
  });

  it("exports the short share path and canonical public URL", () => {
    expect(BOOKING_SHARE_PATH).toBe("/book");
    expect(BOOKING_SHARE_URL).toBe("https://bilalahamad.com/book");
  });
});
