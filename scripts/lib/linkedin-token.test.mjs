import { describe, it, expect } from "vitest";
import { tokenStatus } from "./linkedin-token.mjs";

const NOW = 1_750_000_000; // fixed reference (unix seconds)
const DAY = 86400;

describe("tokenStatus", () => {
  it("is unknown when no expiry is recorded", () => {
    expect(tokenStatus({ now: NOW })).toEqual({ status: "unknown", expired: false, daysLeft: null });
    expect(tokenStatus({ expiresAt: "", now: NOW }).status).toBe("unknown");
    expect(tokenStatus({ expiresAt: "abc", now: NOW }).status).toBe("unknown");
  });

  it("is ok when far from expiry", () => {
    const s = tokenStatus({ expiresAt: NOW + 60 * DAY, now: NOW });
    expect(s.status).toBe("ok");
    expect(s.expired).toBe(false);
    expect(s.daysLeft).toBe(60);
  });

  it("is expiring within the warn window (default 7 days)", () => {
    const s = tokenStatus({ expiresAt: NOW + 3 * DAY, now: NOW });
    expect(s.status).toBe("expiring");
    expect(s.expired).toBe(false);
    expect(s.daysLeft).toBe(3);
  });

  it("respects a custom warnDays", () => {
    expect(tokenStatus({ expiresAt: NOW + 10 * DAY, now: NOW, warnDays: 14 }).status).toBe("expiring");
    expect(tokenStatus({ expiresAt: NOW + 10 * DAY, now: NOW, warnDays: 7 }).status).toBe("ok");
  });

  it("is expired at or past the expiry instant", () => {
    expect(tokenStatus({ expiresAt: NOW - DAY, now: NOW }).expired).toBe(true);
    expect(tokenStatus({ expiresAt: NOW - DAY, now: NOW }).status).toBe("expired");
    expect(tokenStatus({ expiresAt: NOW, now: NOW }).status).toBe("expired");
  });
});
