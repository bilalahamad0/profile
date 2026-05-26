import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * shields.io endpoint badge: historical, monotonic visitor count.
 *
 * Reads all-time totalUsers from the GA4 Data API and serves max(stored, live),
 * persisting the high-water mark in a KV store. The number therefore only ever
 * grows — it never resets, survives GA data-retention aging-out old users, and
 * keeps showing the last known value if GA/OAuth is temporarily unavailable.
 *
 * Auth (priority): OAuth refresh token (GA_OAUTH_CLIENT_ID / _SECRET /
 * _REFRESH_TOKEN) -> service-account JWT (GA_SERVICE_ACCOUNT_JSON). Always needs
 * GA_PROPERTY_ID. Optional persistence: KV_REST_API_URL + KV_REST_API_TOKEN
 * (Vercel's Upstash Redis integration) — without it the badge still works but is
 * just the live value, not persisted/monotonic. CDN-cached 1h via next.config.ts.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ShieldsBadge = { schemaVersion: 1; label: string; message: string; color: string };

const FALLBACK: ShieldsBadge = { schemaVersion: 1, label: 'visitors', message: 'n/a', color: 'lightgrey' };

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const COUNT_KEY = 'visitors_total';

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

function base64url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

async function tokenFromResponse(res: Response, label: string): Promise<string> {
  if (!res.ok) throw new Error(`${label} token exchange failed: ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error(`${label}: no access_token in response`);
  return json.access_token;
}

/** OAuth refresh-token flow — authenticates as the GA property owner. */
async function getOAuthToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  return tokenFromResponse(res, 'oauth');
}

/** Service-account JWT flow (fallback). */
async function getServiceAccountToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({ iss: clientEmail, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })
  );
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(`${header}.${claim}`)
    .sign(privateKey)
    .toString('base64url');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  return tokenFromResponse(res, 'service-account');
}

async function resolveAccessToken(): Promise<string> {
  const clientId = process.env.GA_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GA_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GA_OAUTH_REFRESH_TOKEN;
  if (clientId && clientSecret && refreshToken) {
    return getOAuthToken(clientId, clientSecret, refreshToken);
  }

  const encodedKey = process.env.GA_SERVICE_ACCOUNT_JSON;
  if (encodedKey) {
    const sa = JSON.parse(Buffer.from(encodedKey, 'base64').toString('utf8')) as {
      client_email: string;
      private_key: string;
    };
    return getServiceAccountToken(sa.client_email, sa.private_key);
  }

  throw new Error('no GA credentials configured');
}

/** Live all-time totalUsers from GA, or null if anything fails. */
async function fetchLiveTotal(): Promise<number | null> {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) return null;
    const token = await resolveAccessToken();
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
          metrics: [{ name: 'totalUsers' }],
        }),
      }
    );
    if (!res.ok) {
      console.error('visitors: runReport failed', res.status);
      return null;
    }
    const data = (await res.json()) as { rows?: { metricValues?: { value?: string }[] }[] };
    const n = Number(data.rows?.[0]?.metricValues?.[0]?.value ?? 0);
    return Number.isFinite(n) ? n : null;
  } catch (error) {
    console.error('visitors: GA fetch failed', error);
    return null;
  }
}

/** Read the persisted high-water mark from KV, or null if unavailable. */
async function kvGet(key: string): Promise<number | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string | null };
    if (json.result == null) return null;
    const n = Number(json.result);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Persist a new high-water mark to KV (best-effort). */
async function kvSet(key: string, value: number): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return;
  try {
    await fetch(`${KV_URL}/set/${key}/${value}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
  } catch {
    /* best-effort — a failed write just means we retry next request */
  }
}

export async function GET() {
  const [live, stored] = await Promise.all([fetchLiveTotal(), kvGet(COUNT_KEY)]);

  // No data from either source → graceful placeholder (never "0").
  if (live == null && stored == null) return NextResponse.json(FALLBACK);

  // Monotonic: serve the high-water mark; never drop below what we've recorded.
  const best = Math.max(live ?? 0, stored ?? 0);

  // Persist a new high (also seeds the store on first run).
  if (live != null && live > (stored ?? -1)) await kvSet(COUNT_KEY, live);

  const badge: ShieldsBadge = {
    schemaVersion: 1,
    label: 'visitors',
    message: formatCount(best),
    color: 'blue',
  };
  return NextResponse.json(badge);
}
