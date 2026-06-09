# bilalahamad.com — 9.5+ Development Roadmap

Status legend: ⬜ Pending | 🔄 In Progress | ✅ Complete | 🚫 Dropped/Obsolete
**Last reconciled:** 2026-06-08 (full codebase audit — statuses below are evidence-verified, not assumed)

---

## Current State

Phase 1 (ATS & crawlability) is **fully shipped**. A 2026-06-08 audit found the prior
plan badly understated reality — metadata, sitemap, robots, Person schema, and per-route
OG/Twitter were all already in place. The same session closed the remaining SEO/security
gaps (canonicals, blog structured data, a tabnabbing hole). The real outstanding work is now
**credibility content** (a real resume, case studies, firmware blog posts) and a couple of
small **UX decisions** — not infrastructure.

---

## ✅ Completed

### Phase 1 — ATS & Crawlability (verified 2026-06-08)
- ✅ **1A** — Experience page is SSR/static HTML. `experience/page.tsx` is a Server Component; `ExperienceTimeline`/`ExperienceRightColumn` render `experienceData` server-side; build marks `/experience` as static. All companies + bullets in raw HTML.
- ✅ **1B** — JSON-LD Person schema on homepage (`app/page.tsx`) — name, jobTitle[], alumniOf (14 orgs), sameAs, hasOccupation, knowsAbout.
- ✅ **1C** — JSON-LD BreadcrumbList on **all** inner pages. Was partial (6/7); the `/blog/[slug]` gap was closed 2026-06-08 (Home › Blog › {title}).
- ✅ **1D** — Unique title/description + full Open Graph + Twitter on every route; `metadataBase` = bilalahamad.com; all `og:url` on `.com`. `og-image.png` exists (the old "missing" note is obsolete).
- ✅ **1E** — Dynamic `sitemap.ts` covers 7 static routes + all blog posts (14 URLs).
- ✅ **1F** — `robots.ts` allows all, references the sitemap.

### SEO / security hardening (2026-06-08)
- ✅ **3D** — `alternates.canonical` added to all 7 static routes **and** a self-referencing `/blog/${slug}` canonical on blog posts (points at bilalahamad.com so the source outranks any LinkedIn cross-post). Verified in prerendered HTML.
- ✅ **Article schema** — `BlogPosting` JSON-LD (headline, datePublished, author/publisher Person, image, mainEntityOfPage) added to `/blog/[slug]` — previously had zero structured data.
- ✅ **4E** — Added `rel="noopener noreferrer"` to the certifications "Verify Certificate" link (the only `target="_blank"` lacking a `rel` — reverse-tabnabbing fix).
- ✅ **3B (partial)** — Added the missing `adhan-caster-extension-story` OG thumbnail mapping (it was falling back to the generic image).
- ✅ **Repo hygiene** — `.gitignore` now covers `.claude/worktrees/`, `.lostpixel/`, `.playwright-mcp/`, `.antigravityignore`, and the 6.4 MB `bilal-logo-master.png` master art.

---

## ⬜ Outstanding — codebase-doable (I can implement autonomously)

- ⬜ **4D** — Run a real 375 px mobile pass (Playwright/Chrome) on `/`, `/experience`, `/certifications`, and the dense 7-pill `NavbarV2`. Code looks sound but the plan needs an *actual* viewport audit; add `body { overflow-x: clip }` if any horizontal scroll appears.
- ⬜ **2C (mostly)** — Add a Testimonials section to the homepage between `FeaturedProjects` and `AILabPreview`. Data partly exists: `portfolio.ts` `recommendations` (2 real LinkedIn recs) already renders on `/experience` only. Reuse it on the homepage. *(Needs owner input only for a `company` field per rec.)*

## ⬜ Outstanding — needs owner content or a decision

- ⬜ **3C** — **Resume PDF is a 614-byte placeholder stub** ("Placeholder - replace with your resume") and is linked nowhere. Two halves: (a) supply a real PDF matching the 10 `portfolio.ts` roles *(owner)*; (b) add a visible "Download Resume" link *(codebase)*. Single biggest recruiter-facing gap.
- ⬜ **2A** — *Decision:* deliver case studies as a **dedicated `/case-studies` route** (new MDX pipeline) **or** a **new "Case Study" blog category** (reuses existing `lib/blog.ts`, far less infra — audit's recommendation). Resolve before building.
- ⬜ **2B** — 2 sanitized employer case studies ("Tier-1 automotive OEM", "global IoT platform company") from firmware-validation/HIL experience. None exist today (and no client-name leakage either). *Needs owner narratives/metrics.* Depends on 2A.
- ⬜ **2D** — 3 firmware-credibility blog posts genuinely missing: "Testing at Scale in Automotive", "HIL vs SIL", "What 18 Years in QA Taught Me About AI". *Needs owner technical specifics* (use the `/post` skill). (The 4th, "Zero-Budget Data Pipeline", is already covered by `california-warn-story.mdx`.)
- ⬜ **4B** — *Decision:* hero CTA still reads "Full Career Roadmap" → `/experience`. Change to "Explore My Work →" → `/projects` per the old plan, **or** keep `/experience` (arguably the stronger recruiter CTA) and mark 4B done-differently.

---

## Backlog (lower priority, codebase-doable)

- ⬜ Surface the 2 existing LinkedIn recommendations on the homepage now — quick credibility win, no new data (overlaps 2C).
- ⬜ Migrate blog OG thumbnails from the hardcoded `slugToThumb` maps to a `thumbnail:` MDX frontmatter field (the two maps have already drifted; removes future drift as `/post` adds posts).
- ⬜ Remove orphan `public/blog-thumbs/warn-july-2026-layoffs.png` (no slug maps to it).
- ⬜ Verify per-post OG thumbnails are physically 1200×630 (declared dimension); mismatches can break LinkedIn/Twitter previews. Note `adhan-ce-demo.gif` is a GIF used as an OG image.
- ⬜ Normalize the ~25 `rel="noreferrer"` external links to `rel="noopener noreferrer"` (cosmetic — `noreferrer` already implies `noopener`).
- ⬜ Accessibility pass toward the 9.5+ goal: glass-UI color contrast, `next/image` alt text, keyboard focus order, sub-11px `NavbarV2` text at 375px (WCGA 2.1 AA).
- ⬜ **3A (user-only)** — Submit `sitemap.xml` in Google Search Console (code side done; external UI action).

---

## 🚫 Dropped / Obsolete (verified against the as-built site)

- 🚫 **4A** — "Replace scrolling keyword ticker with static metrics bar." There is **no ticker** anywhere and the exact metrics string was never built; the hero already ships pill-style stat cards (`coreCards`). Premise gone.
- 🚫 **4C (as specified)** — "Animated green dot near nav + hover tooltip." Shipped *differently* as a homepage "Available for Opportunities" pulse-dot badge with matching "Open to…" copy. The near-nav/tooltip specifics are low-value; mark done-differently unless a global nav signal is explicitly wanted.
- 🚫 **5B** — Ambient music/audio. Autoplay audio on an ATS/recruiter portfolio is an anti-feature (UX + accessibility). Drop.
- ⏸️ **5A** — AI chatbot via Anthropic API. Genuinely new build (no `@anthropic-ai` dep, no `/api/chat`) needing streaming + rate-limiting + cost controls. Deferred — low ROI vs the 3C resume gap.

---

## Session Log
| Date | Phase | Summary | Commit |
|------|-------|---------|--------|
| 2026-04-23 | 1A | Experience page → SSR. Server Components; all companies + bullets in raw HTML. | e227ab8 |
| 2026-04-23 | 1B | JSON-LD Person schema on homepage (name, jobTitle, alumniOf, sameAs, knowsAbout). | c2aa92f |
| 2026-04-23 | 1C | JSON-LD BreadcrumbList on inner pages (via layout/page). | 9f9adea |
| 2026-04-23 | 1D | Metadata audit: metadataBase, .com og:url, titles/descriptions, full OG+Twitter. | 7b51510 |
| 2026-04-23 | 1E | Dynamic sitemap.ts (static routes + all MDX posts). | e014841 |
| 2026-04-23 | 1F | robots.ts (allow all, sitemap referenced). | 15bb8fd |
| 2026-06-08 | audit | Full codebase audit reconciled PLAN vs reality (4 domains, 21 items + critic). | — |
| 2026-06-08 | 3D/1C/SEO | Canonicals on all routes + self-canonical on posts; BreadcrumbList + BlogPosting JSON-LD on /blog/[slug]; cert-link rel fix (4E); adhan OG thumb; .gitignore hygiene. | _this branch_ |
