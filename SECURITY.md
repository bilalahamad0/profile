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
| Edge bot filtering | Vercel **Attack Mode** (free on Hobby) — challenges non-browser traffic, auto-allows the verified-bot directory + your own functions, SEO-safe long-term. The *managed* Bot Protection ruleset's **Challenge** action needs Pro; on Hobby that ruleset is **Log-only** (observe). **BotID Basic** (free, invisible `checkBotId()`) is the route-scoped alternative. | Vercel dashboard (no code) |
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
never receives the `ba_entry` cookie, so it cannot post the contact form. With
**Attack Mode** on it is also challenged at the edge before reaching the app. It
can still read the public career HTML — by design, so ATS and Google can too. A
sophisticated headless browser *can* pass `/api/session`; Attack Mode (or BotID)
is what raises the bar against those.

## Manual steps (dashboard / secret — not in code)

This site runs on the Vercel **Hobby** plan. Plan-accurate options:

1. **Set `SESSION_SECRET` (required).** Add a 32+ byte random secret to Vercel env
   (and local `.env.local`). The token signer **fails closed in production** if it's
   unset/weak, so the contact form would 403 without it. Generate with:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
2. **Edge bot challenge — pick one (both free on Hobby):**
   - **Attack Mode** — Firewall → **Bot Management** → **Attack Mode → Enable**.
     Blanket challenge of non-browser traffic; auto-allows Googlebot/ATS + your own
     functions; safe to leave on long-term (no SEO impact). Tradeoff: real visitors
     see a brief "Vercel Security Checkpoint" on first visit (1h session).
   - **BotID Basic** — invisible `checkBotId()` guard on `/api/contact` (+ `/api/session`).
     Fully invisible to humans, route-scoped; needs `npm i botid`. Best always-on
     layer if you want zero human friction. Keep Attack Mode as a one-click switch
     for active scraping incidents.
3. *(optional)* **AI Bots ruleset → Deny** (Firewall → Bot Management) to block AI
   crawlers — if your plan offers the Deny action there (may be Pro-gated like the
   managed Bot Protection Challenge; check the dropdown).

Note: the **managed Bot Protection ruleset Challenge action requires Pro** — on
Hobby it only offers **Log** (observe, no blocking). Don't rely on it to block.

## The Google Developer badges "sync"

`/api/badges` tries to read your Google Developer Profile badge count
server-side. Google renders that page with JS Web Components and blocks
non-browser fetches, so a reliable server-side scrape isn't feasible — the route
falls back to a manually-verified count (`VERIFIED_BADGE_COUNT`). That's the
correct call; bump the constant when you earn new badges. (This is the mirror
image of the rest of this doc: there, *we* are the bot being blocked.)
