import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * shields.io endpoint badge backed by the GA4 Data API: total users for the
 * property. Authenticates with a service account (JWT signed via node:crypto,
 * no SDK), then calls runReport. CDN-cached 1h via next.config.ts.
 *
 * Env: GA_PROPERTY_ID, GA_SERVICE_ACCOUNT_JSON (base64 of the SA key file).
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

function base64url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(`${header}.${claim}`)
    .sign(privateKey)
    .toString('base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('no access_token in response');
  return json.access_token;
}

export async function GET() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const encodedKey = process.env.GA_SERVICE_ACCOUNT_JSON;
    if (!propertyId || !encodedKey) return NextResponse.json(FALLBACK);

    const sa = JSON.parse(Buffer.from(encodedKey, 'base64').toString('utf8')) as {
      client_email: string;
      private_key: string;
    };
    const token = await getAccessToken(sa.client_email, sa.private_key);

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
          metrics: [{ name: 'totalUsers' }],
        }),
      }
    );
    if (!res.ok) return NextResponse.json(FALLBACK);

    const data = (await res.json()) as {
      rows?: { metricValues?: { value?: string }[] }[];
    };
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
