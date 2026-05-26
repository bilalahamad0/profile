import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * shields.io endpoint badge backed by the GA4 Data API: historical total users
 * for the property (all-time). CDN-cached 1h via next.config.ts.
 *
 * Auth (in priority order):
 *  1. OAuth as the property owner — refresh-token flow. Preferred, because a
 *     Google bug (since 2025-04-23) blocks NEW service accounts from being added
 *     to GA4 properties. Env: GA_OAUTH_CLIENT_ID, GA_OAUTH_CLIENT_SECRET,
 *     GA_OAUTH_REFRESH_TOKEN.
 *  2. Service-account JWT (signed via node:crypto, no SDK). Only works for SAs
 *     created before the bug. Env: GA_SERVICE_ACCOUNT_JSON (base64 of key file).
 *
 * Always also needs GA_PROPERTY_ID. Returns a graceful "n/a" badge if neither
 * auth path is configured or anything fails.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ShieldsBadge = {
  schemaVersion: 1;
  label: string;
  message: string;
  color: string;
};

const FALLBACK: ShieldsBadge = {
  schemaVersion: 1,
  label: 'visitors',
  message: 'n/a',
  color: 'lightgrey',
};

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

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

export async function GET() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) return NextResponse.json(FALLBACK);

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
    if (!res.ok) return NextResponse.json(FALLBACK);

    const data = (await res.json()) as { rows?: { metricValues?: { value?: string }[] }[] };
    const value = Number(data.rows?.[0]?.metricValues?.[0]?.value ?? 0);

    const badge: ShieldsBadge = {
      schemaVersion: 1,
      label: 'visitors',
      message: formatCount(value),
      color: 'blue',
    };
    return NextResponse.json(badge);
  } catch (error) {
    console.error('visitors badge failed', error);
    return NextResponse.json(FALLBACK);
  }
}
