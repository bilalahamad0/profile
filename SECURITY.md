# Security — anti-scraping & anti-automation

This site is engineered to be **maximally readable by good bots** (Googlebot,
Bingbot, LinkedInBot, social previews, recruiter ATS crawlers) while **raising
the cost of automated scraping platforms** and **blocking abuse** of the
dynamic surface (contact form, data APIs). Those two goals are in tension — the
career content is intentionally public static HTML so ATS systems can read every
job title and bullet — so the design is **selective**, never a blanket gate.

## The honest tradeoff

Anything that renders like a browser can read the same static HTML Googlebot
reads. You cannot simultaneously expose career content to ATS and hide it from a
determined headless-browser scraper. What this design *does*:

1. **Edge Bot Filter (the real muscle)** — blocks commodity/non-browser scraping
   platforms before they reach the app, while auto-allowing verified crawlers.
2. **Entry handshake (the gate you asked for)** — a signed, browser-only token
   protects the *dynamic* surface and adds a genuine human-gesture wall.
3. **Zero SEO/ATS regression** — the splash is never shown to crawlers and never
   in the server HTML; data the gate protects is also present in the page itself.

## Layers

| Layer | Mechanism | Where |
|---|---|---|
| Edge bot filtering | Vercel **Bot Filter** managed WAF ruleset (+ Attack Challenge Mode for incidents). Auto-allows Vercel's verified-bot directory. | Vercel dashboard (no code) |
| Cross-origin guard | `src/middleware.ts` rejects cross-site POSTs to `/api/contact` + `/api/session` via `Sec-Fetch-Site`. | Edge middleware |
| Entry handshake | `/api/session` validates browser-only signals (IANA timezone **cross-checked against the reported UTC offset**, fresh client clock within ±5 min) and sets a 2h **HMAC-signed httpOnly `ba_entry` cookie**. Production fails **closed** if `SESSION_SECRET` is unset/weak (no forgeable tokens). | `src/lib/security/session.ts`, `src/app/api/session/route.ts` |
| Form protection | `/api/contact` **requires** a valid `ba_entry` token + rate-limits 5/h per IP and 3/day per email + validates input (email format, length caps, header-injection guard). | `src/app/api/contact/route.ts` |
| Read protection | `/api/{repos,badges,visitors,ai-metrics}` keep serving public cached data but are rate-limited 60/min per IP (fail-open). | the four route files |
| The splash | `src/components/v3/EntryGate.tsx` — skyline + converging session core; the single "enter" gesture mints the token. Client-only, skipped for bots / returning visitors, respects reduced-motion. | `src/components/v3/EntryGate.tsx` |

Rate limiting reuses the **existing Upstash Redis (KV)** store via its REST API —
no new dependency. Each hit is one atomic `INCR` + `EXPIRE … NX` pipeline (no
stuck-key race). It is **fail-open**: no KV, or a KV blip, means requests are
allowed. Buckets key off the **Vercel-populated** client IP
(`x-vercel-forwarded-for` / `x-real-ip`), which clients can't forge through the
proxy — so the limits can't be bypassed or used to exhaust a victim's bucket via
a spoofed `X-Forwarded-For`. The limiter is a guard rail, never a hard dependency.

## What a naive scraper hits

A bare `GET` / `curl`: never runs the JS, never sends a plausible timezone+clock,
never receives the `ba_entry` cookie, so it cannot post the contact form and is
likely already challenged at the edge by Bot Filter. It can still read the public
career HTML — by design, so ATS and Google can too. A sophisticated headless
browser *can* pass `/api/session`; the edge Bot Filter is what raises the bar
against those.

## Your two manual steps (required, dashboard/secret — not in code)

1. **Enable Vercel Bot Filter.** Vercel project → **Firewall** → turn on the
   managed **Bot Filter** ruleset (free, all plans; auto-allows verified
   crawlers). Optionally keep **Attack Challenge Mode** ready for active attacks.
2. **Set `SESSION_SECRET`.** Add a 32+ byte random secret to Vercel env (and your
   local `.env.local`). Generate one with:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
   The gate is only as strong as this secret. Without it, an insecure dev
   fallback is used (local only).

## The Google Developer badges "sync"

`/api/badges` tries to read your Google Developer Profile badge count
server-side. Google renders that page with JS Web Components and blocks
non-browser fetches, so a reliable server-side scrape isn't feasible — the route
falls back to a manually-verified count (`VERIFIED_BADGE_COUNT`). That's the
correct call; bump the constant when you earn new badges. (This is the mirror
image of the rest of this doc: there, *we* are the bot being blocked.)
