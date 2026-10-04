import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimit, getClientIp, hashKey } from "./ratelimit";

describe("rateLimit", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.KV_REST_API_URL = "https://example-kv.upstash.io";
    process.env.KV_REST_API_TOKEN = "test-kv-token";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    vi.restoreAllMocks();
  });

  it("allows request when hit count is within limit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ result: 2 }, { result: "OK" }],
    } as Response);

    const result = await rateLimit("ip:127.0.0.1", 5, 60);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(3);
    expect(result.limit).toBe(5);
  });

  it("blocks request when hit count exceeds limit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ result: 6 }, { result: "OK" }],
    } as Response);

    const result = await rateLimit("ip:127.0.0.1", 5, 60);
    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(5);
  });

  it("fails open if KV is not configured", async () => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;

    const result = await rateLimit("ip:127.0.0.1", 5, 60);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it("fails open if Upstash API returns HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const result = await rateLimit("ip:127.0.0.1", 5, 60);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it("fails open if network fetch throws an error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network timeout"));

    const result = await rateLimit("ip:127.0.0.1", 5, 60);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(5);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-vercel-forwarded-for header", () => {
    const req = new Request("https://example.com", {
      headers: {
        "x-vercel-forwarded-for": "203.0.113.195, 10.0.0.1",
        "x-real-ip": "198.51.100.1",
        "x-forwarded-for": "192.0.2.1",
      },
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("falls back to x-real-ip when x-vercel-forwarded-for is missing", () => {
    const req = new Request("https://example.com", {
      headers: {
        "x-real-ip": "198.51.100.1",
        "x-forwarded-for": "192.0.2.1",
      },
    });
    expect(getClientIp(req)).toBe("198.51.100.1");
  });

  it("falls back to x-forwarded-for when vercel/real-ip headers are missing", () => {
    const req = new Request("https://example.com", {
      headers: {
        "x-forwarded-for": "192.0.2.1, 10.0.0.2",
      },
    });
    expect(getClientIp(req)).toBe("192.0.2.1");
  });

  it("returns 'unknown' when no IP headers are present or req is undefined", () => {
    const req = new Request("https://example.com");
    expect(getClientIp(req)).toBe("unknown");
    expect(getClientIp(undefined)).toBe("unknown");
  });
});

describe("hashKey", () => {
  it("produces deterministic, normalized hash for email", async () => {
    const h1 = await hashKey("User@Example.COM");
    const h2 = await hashKey("user@example.com ");
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{24}$/);
  });
});
