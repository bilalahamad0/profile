# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Identity
- Site: https://bilalahamad.com
- Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Vercel
- Repo: https://github.com/bilalahamad0/profile
- Owner: Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer
- Goal: Achieve 9.5+/10 portfolio rating. ATS-compliant. Recruiter-ready. LinkedIn/resume shareable.

## ENGINEERING STANDARDS — NON-NEGOTIABLE

### Verification-First Mindset
- NEVER claim a fix is complete based on code changes alone
- ALWAYS self-verify every fix using automated measurement before reporting done
- NEVER produce false positives — if you cannot verify, say so explicitly
- ALWAYS use the most automated solution available before asking the user to do anything manually

### Tool Usage Priority
Before asking the user to manually verify anything, check available tools in this order:
1. Playwright/headless browser — for layout measurement and UI verification
2. Claude in Chrome MCP — for live browser screenshots at real viewports
3. Vercel MCP — for deployment status and logs
4. Only ask user manually if ALL automated options are exhausted

### Layout & UI Fixes
- NEVER use fixed heights, hardcoded px values, or spacer divs for layout problems
- ALWAYS implement dynamic, content-driven solutions
- ALWAYS test at 1280px, 1440px, 1920px viewports
- ALWAYS run Playwright measurement verification reporting actual px heights before committing
- ALWAYS take browser screenshots via Claude in Chrome MCP to confirm visual output

### Code Quality Gates — Every Commit
- npm run build — zero errors, zero warnings
- npm run lint — zero errors
- No console.log in production code
- No `any` TypeScript types
- SSR verified intact after every change to /experience page

### Efficiency Standards
- Propose innovative automated solutions proactively
- Never suggest manual workarounds when automation exists
- Batch related fixes into single commits
- Always think of the highest standard solution first
- Token efficiency: scope prompts tightly, verify atomically, commit cleanly

## Repo Layout

The repo is a single Next.js 16 App Router app at the root:

```
/                    Next.js project root (package.json, next.config.ts, src/, public/, content/, ...)
.github/workflows/   CI/CD pipelines (lint, unit, e2e, visual regression, dependabot auto-fix)
scripts/             Utility scripts (efficiency-check, fix-alerts, sanity-check, generate-favicons)
content/blog/        MDX blog posts
src/                 App Router source
public/              Static assets served at /
```

This deploys to `bilalahamad.com` via the single `resume-site` Vercel project (Vercel "Root Directory" = `.`).

## Commands (run from repo root)

```bash
npm run dev          # local dev server
npm run build        # production build — run after every change
npm run lint         # ESLint — run before marking any phase complete
npm run test         # Vitest unit tests
npm run test:coverage
```

## Non-Negotiables
- ALL career content must be in static HTML at build time (no JS-only rendering)
- Never modify `package.json` without asking first
- Never delete existing blog posts or project entries
- Always run `npm run build` after changes to verify no build errors
- Commit after each phase with a clear message like `"Phase 1A: Fix SSR on Experience page"`
- Preserve glassmorphism design language throughout
- Every new page/section must be mobile-responsive

## Architecture

### Single source of truth: `src/data/portfolio.ts`
All career data lives here — `experienceData`, `skills`, `certs`, `recommendations`, `projectsData`, `linkedInPosts`. Add or edit career content here only; components read from this file.

### Component versioning
- `src/components/v2/` — current Navbar (`NavbarV2`) and `BentoGridV2` (the experience bento grid)
- `src/components/v3/` — current home page sections: `HeroPortfolio`, `ResumeReelClient`, `FeaturedProjects`, `HomePageSections`
- Never create `v4/` unless explicitly asked — edit in place instead

### SSR / client boundary rules
- Page files (e.g. `app/experience/page.tsx`) should be **Server Components** — no `"use client"` at the page level
- `BentoGridV2` has `ssr: false` (uses `ResizeObserver`, `getBoundingClientRect`) — it must remain client-only, but the underlying career text from `experienceData` must also render in a static `<section>` so ATS crawlers see it
- Interactive children carry their own `"use client"` boundaries; the page shell stays a Server Component
- Use `generateStaticParams` / `async` page functions for SSR — never `useEffect` for content fetching

### Blog pipeline
- Posts are MDX files in `content/blog/`
- Parsed server-side by `src/lib/blog.ts` using `gray-matter` — no client JS required
- Required frontmatter: `title`, `date`, `description`, `tags`, `category` (`"Project Story" | "Whitepaper" | "LinkedIn" | "Tutorial"`), `featured`
- Blog slug = filename without `.mdx`

### API routes
- `/api/contact` — nodemailer SMTP; requires env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO`
- `/api/repos` and `/api/badges` — cached at CDN level (1 hr s-maxage); see `next.config.ts`
- `/api/ai-metrics` — reads `ai-metrics.json` from repo root

### Images
- Use `next/image` only — no raw `<img>` tags
- Allowed remote hostnames (in `next.config.ts`): `bilalahamad0.github.io`, `opengraph.githubassets.com`, `raw.githubusercontent.com`, `media.licdn.com`
- Add new external image hostnames to `next.config.ts` `remotePatterns` before using them

### Analytics
- Google Analytics: call `trackEvent(eventName, params)` from `@/components/analytics/google-analytics`
- Vercel Analytics + Speed Insights are auto-injected in `app/layout.tsx`

## ATS Requirements (Critical)
- All job titles, companies, dates, and bullet points must appear in raw HTML source (not JS-only)
- JSON-LD Person schema on homepage
- JSON-LD BreadcrumbList on all inner pages
- Unique `<title>` and `<meta description>` on every page
- Open Graph tags complete on every page
- `/sitemap.xml` dynamically generated
- `/robots.txt` present and correct

## Tech Constraints
- TypeScript strict mode — no `any` types
- Tailwind only for styling — no inline styles
- Framer Motion for animations — keep existing animation patterns
- `next/image` for all images

## Session Workflow
1. Read this CLAUDE.md fully
2. Read PLAN.md and identify the next incomplete phase
3. Enter Plan Mode — propose approach before writing code
4. Execute after confirmation
5. Run `npm run build` + `npm run lint` from repo root
6. Commit with phase label
7. Mark phase complete in PLAN.md
8. Report summary of what changed
