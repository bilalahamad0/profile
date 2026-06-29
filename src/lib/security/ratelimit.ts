/**
 * Minimal fixed-window rate limiter backed by the same Upstash Redis (KV) store
 * the visitor-count badge already uses — no new dependency. Uses the REST API's
 * atomic INCR plus a one-shot EXPIRE on the first hit of each window.
 *
 * Fail-open by design: if KV isn't configured (local dev) or a network blip
 * occurs, requests are allowed. The limiter is a guard rail against abuse, never
 * a hard dependency that could take the contact form or data routes down.
 */

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export type RateLimitResult = { ok: boolean; remaining: number; limit: number };

/**
 * Count one hit against `key` within a fixed `windowSeconds` window.
 *
 * INCR and `EXPIRE … NX` run in a single Upstash pipeline — one round trip, so
 * there's no gap in which the counter can be incremented without ever getting a
 * TTL (which would permanently lock the bucket). `NX` sets the TTL only on the
 * first hit, keeping it a true fixed window. Fail-open on any error.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!KV_URL || !KV_TOKEN) return { ok: true, remaining: limit, limit };

  const redisKey = `rl:${key}`;
  try {
    const res = await fetch(`${KV_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(windowSeconds), "NX"],
      ]),
    });
    if (!res.ok) return { ok: true, remaining: limit, limit };
    const data = (await res.json()) as Array<{ result?: number; error?: string }>;
    const count = Number(data?.[0]?.result);
    if (!Number.isFinite(count)) return { ok: true, remaining: limit, limit };
    return { ok: count <= limit, remaining: Math.max(0, limit - count), limit };
  } catch {
    return { ok: true, remaining: limit, limit };
  }
}

/**
 * Best-effort client IP. Prefer the headers Vercel populates at its edge
 * (`x-vercel-forwarded-for`, `x-real-ip`) — clients cannot forge these through
 * the proxy. Only fall back to the client-controlled `x-forwarded-for` for
 * non-Vercel hosts (local/dev), where no trustworthy header exists.
 */
export function getClientIp(req?: Request): string {
  const headers = req?.headers;
  if (!headers) return "unknown";
  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

/** Stable, non-reversible bucket key for an email (avoids storing raw addresses in KV). */
export async function hashKey(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.toLowerCase().trim());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
