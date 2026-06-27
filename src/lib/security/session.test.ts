import { beforeEach, describe, expect, it } from "vitest";
import {
  issueSession,
  signSession,
  verifySession,
  validateSignals,
  readCookie,
} from "./session";

describe("session token", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "unit-test-secret-at-least-16-chars";
  });

  it("round-trips a signed token", async () => {
    const { token } = await issueSession("America/Los_Angeles");
    const payload = await verifySession(token);
    expect(payload).not.toBeNull();
    expect(payload?.tz).toBe("America/Los_Angeles");
    expect(payload?.v).toBe(1);
  });

  it("rejects a tampered token", async () => {
    const { token } = await issueSession("UTC");
    const tampered = `${token.slice(0, -3)}aaa`;
    expect(await verifySession(tampered)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const now = Math.floor(Date.now() / 1000);
    const expired = await signSession({ v: 1, iat: now - 7200, exp: now - 10, tz: "UTC" });
    expect(await verifySession(expired)).toBeNull();
  });

  it("rejects null / empty tokens", async () => {
    expect(await verifySession(null)).toBeNull();
    expect(await verifySession("")).toBeNull();
    expect(await verifySession("garbage")).toBeNull();
  });

  it("does not verify under a different secret", async () => {
    const { token } = await issueSession("UTC");
    process.env.SESSION_SECRET = "a-totally-different-secret-value";
    expect(await verifySession(token)).toBeNull();
  });
});

describe("validateSignals", () => {
  const now = 1_700_000_000_000;

  it("accepts plausible, fresh signals", () => {
    const result = validateSignals({ tz: "America/New_York", tzOffset: 300, clientTime: now }, now);
    expect(result.ok).toBe(true);
  });

  it("rejects an invalid timezone", () => {
    const result = validateSignals({ tz: "Mars/Phobos", tzOffset: 0, clientTime: now }, now);
    expect(result.ok).toBe(false);
  });

  it("rejects a stale client clock", () => {
    const result = validateSignals({ tz: "UTC", tzOffset: 0, clientTime: now - 10 * 60 * 1000 }, now);
    expect(result.ok).toBe(false);
  });

  it("rejects a non-object body", () => {
    expect(validateSignals(null, now).ok).toBe(false);
    expect(validateSignals("nope", now).ok).toBe(false);
  });

  it("rejects an absurd UTC offset", () => {
    const result = validateSignals({ tz: "UTC", tzOffset: 9999, clientTime: now }, now);
    expect(result.ok).toBe(false);
  });

  it("rejects an offset that contradicts the claimed timezone", () => {
    // Asia/Kolkata is UTC+5:30 (getTimezoneOffset = -330), not 0.
    const result = validateSignals({ tz: "Asia/Kolkata", tzOffset: 0, clientTime: now }, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("offset-mismatch");
  });

  it("accepts a matching timezone + offset", () => {
    const result = validateSignals({ tz: "Asia/Kolkata", tzOffset: -330, clientTime: now }, now);
    expect(result.ok).toBe(true);
  });
});

describe("readCookie", () => {
  it("extracts a named cookie", () => {
    expect(readCookie("a=1; ba_entry=tok123; b=2", "ba_entry")).toBe("tok123");
  });

  it("returns null when absent or header empty", () => {
    expect(readCookie("a=1; b=2", "ba_entry")).toBeNull();
    expect(readCookie(null, "ba_entry")).toBeNull();
  });
});
