/**
 * Signed "entry" session token — the server side of the anti-automation gate.
 *
 * The official frontend (the entry splash + the contact form) collects a few
 * signals only a real browser session has — the visitor's IANA timezone, its UTC
 * offset, and the client clock — and POSTs them to `/api/session`. We validate
 * those signals are internally consistent and fresh, then mint a short-lived,
 * HMAC-SHA256 *signed* token and set it as an httpOnly cookie. Protected actions
 * (e.g. the contact form) require that cookie back.
 *
 * A naive server-side scraper does a bare GET: it never runs the JS, never sends
 * a plausible timezone/clock, never receives the cookie, and so cannot echo it
 * on the protected call. The token is signed, so it can't be forged without
 * SESSION_SECRET. Web Crypto only — runs on both the edge and node runtimes.
 */

const COOKIE_NAME = "ba_entry";
const TOKEN_VERSION = 1;
const TOKEN_TTL_SECONDS = 60 * 120; // 2 hours
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000; // client clock must be within ±5 min

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_TTL_SECONDS = TOKEN_TTL_SECONDS;

export type ClientSignals = {
  tz: string;
  tzOffset: number;
  clientTime: number;
};

export type SessionPayload = {
  v: number;
  iat: number;
  exp: number;
  tz: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * The signing secret. Production MUST set a strong SESSION_SECRET — the gate is
 * only as strong as this secret, and this is a public repo, so we fail CLOSED:
 * a missing/weak secret in production throws (callers deny) rather than silently
 * using a known dev fallback that would let anyone forge tokens. The dev fallback
 * is only ever used outside production (local builds/tests).
 */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is not configured (must be >=16 bytes in production)");
  }
  return "dev-only-insecure-session-secret-change-me";
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Constant-time string comparison to avoid signature timing oracles. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

/** Mint a signed token: `base64url(payload).base64url(hmac)`. */
export async function signSession(payload: SessionPayload): Promise<string> {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

/** Verify a token's signature + expiry. Returns the payload, or null if invalid. */
export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  try {
    if (!token) return null;
    const dot = token.indexOf(".");
    if (dot <= 0) return null;

    const body = token.slice(0, dot);
    const signature = token.slice(dot + 1);

    const key = await importKey();
    const expected = bytesToBase64Url(
      new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)))
    );
    if (!timingSafeEqual(signature, expected)) return null;

    const payload = JSON.parse(decoder.decode(base64UrlToBytes(body))) as SessionPayload;
    if (payload.v !== TOKEN_VERSION) return null;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    // Includes the production "no SESSION_SECRET" throw — fail closed (deny).
    return null;
  }
}

/** Build a fresh, signed token for a validated client session. */
export async function issueSession(tz: string): Promise<{ token: string; maxAge: number }> {
  const now = Math.floor(Date.now() / 1000);
  const token = await signSession({ v: TOKEN_VERSION, iat: now, exp: now + TOKEN_TTL_SECONDS, tz });
  return { token, maxAge: TOKEN_TTL_SECONDS };
}

/** Is this a real IANA timezone the runtime recognizes? */
function isValidTimeZone(tz: string): boolean {
  if (!tz || typeof tz !== "string" || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * The UTC offset (in `Date.getTimezoneOffset()` convention: minutes, positive =
 * behind UTC) that `tz` actually has at instant `at`. Used to confirm the offset
 * the client reports genuinely matches the timezone it claims. Null if it can't
 * be derived.
 */
function offsetForTimeZone(tz: string, at: number): number | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date(at));
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    if (!Number.isFinite(asUtc)) return null;
    return Math.round((at - asUtc) / 60000);
  } catch {
    return null;
  }
}

/**
 * The anti-automation check: confirm the signals the official frontend sends are
 * internally consistent and fresh. Naive scrapers fail every clause.
 */
export function validateSignals(
  raw: unknown,
  serverNow: number = Date.now()
): { ok: true; signals: ClientSignals } | { ok: false; reason: string } {
  if (typeof raw !== "object" || raw === null) return { ok: false, reason: "missing-signals" };

  const record = raw as Record<string, unknown>;
  const tz = record.tz;
  const tzOffset = record.tzOffset;
  const clientTime = record.clientTime;

  if (typeof tz !== "string" || !isValidTimeZone(tz)) return { ok: false, reason: "bad-timezone" };
  if (typeof tzOffset !== "number" || !Number.isFinite(tzOffset) || Math.abs(tzOffset) > 14 * 60) {
    return { ok: false, reason: "bad-offset" };
  }
  if (typeof clientTime !== "number" || !Number.isFinite(clientTime)) {
    return { ok: false, reason: "bad-clock" };
  }
  if (Math.abs(serverNow - clientTime) > MAX_CLOCK_SKEW_MS) {
    return { ok: false, reason: "clock-skew" };
  }

  // Cross-check: the reported offset must match the timezone it claims (±60 min
  // tolerance for DST edges). A lazy scraper sending tz:"Asia/Kolkata" with
  // tzOffset:0 fails here. Skip only if the offset can't be derived.
  const expectedOffset = offsetForTimeZone(tz, serverNow);
  if (expectedOffset !== null && Math.abs(expectedOffset - tzOffset) > 60) {
    return { ok: false, reason: "offset-mismatch" };
  }

  return { ok: true, signals: { tz, tzOffset, clientTime } };
}

/** Parse a named cookie out of a raw `Cookie` header. */
export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}
