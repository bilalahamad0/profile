import { NextResponse } from "next/server";
import { issueSession, validateSignals, SESSION_COOKIE } from "@/lib/security/session";
import { rateLimit, getClientIp } from "@/lib/security/ratelimit";

/**
 * POST /api/session — the entry handshake.
 *
 * The official frontend posts its browser-only signals (timezone, UTC offset,
 * client clock). We validate they're consistent + fresh, then set a short-lived,
 * HMAC-signed httpOnly cookie that protected actions require. A bare scraper that
 * never runs the JS can't produce a valid body and never receives the cookie.
 */
export const runtime = "edge";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`session:${ip}`, 30, 60); // 30 mints / minute / IP
  if (!limited.ok) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-body" }, { status: 400 });
  }

  const validation = validateSignals(body);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, reason: validation.reason }, { status: 400 });
  }

  const { token, maxAge } = await issueSession(validation.signals.tz);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
