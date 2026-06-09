---
name: update-ai-page
description: Refresh the metrics on the /ai page (https://bilalahamad.com/ai) from their real sources — each project's GitHub `ai-metrics.json`, plus this repo's own git/test/LOC. TRIGGER whenever the user asks to update/refresh the AI page or AI Lab, sync ai-metrics, update "Metrics at a Glance", or update the "AI-Augmented Systems" cards — e.g. "update the ai page", "refresh AI metrics", "/update-ai-page". The agent does everything: recompute, fetch every repo, reconcile the fallback, verify, build. Never ask the user for token/model/AI-usage numbers — those live in each repo and are pulled automatically.
---

# Update the /ai page metrics (fully automated, source-driven)

The `/ai` page renders two metric surfaces, both from the same per-project data:
- **Metrics at a Glance** — the comparison table (AI %, Tokens, Commits, LOC, Cycle, Saved, Tests).
- **AI-Augmented Systems** — the project cards (agents, models, tokens, before/after, tests).

## How the data flows (audit this first if anything looks off)

`src/app/ai/page.tsx` → `getAIMetricsMap()` in [`src/lib/ai-metrics.ts`](../../../src/lib/ai-metrics.ts)
fetches each project's `ai-metrics.json` **live from its own GitHub repo**
(`raw.githubusercontent.com/bilalahamad0/<repo>/main/ai-metrics.json`). `REPO_MAP` there is the
project→repo mapping: `warn→warn`, `adhan→adhan-api`, `profile→profile`, `tmo→tmo`,
`adhan-ce→adhan-ce`. `STATIC_FALLBACK` in `page.tsx` is a build-time mirror used **only** when a
fetch fails — so on the live site the fallback is invisible unless GitHub is unreachable.

**Source of truth per project = that repo's `ai-metrics.json`.** Two consequences:
- `profile` is THIS repo — its sidecar (`./ai-metrics.json`) is the live source, so we recompute it
  here. It's the one most likely to be stale (it's easy to forget when updating the others).
- `adhan-ce` has **no** `ai-metrics.json` in its repo, so its fetch always 404s and the page uses
  `STATIC_FALLBACK["adhan-ce"]` permanently. For it, the fallback *is* the source — recompute by cloning.

## Fields: DERIVED vs CURATED

Only ever auto-update the **derived** fields. Never invent the curated ones — they live in each repo.

| | Fields | Where they come from |
|---|---|---|
| **DERIVED** (recompute) | `totalCommits`, `linesOfCode`, `tests`, `testSuites`, `lastUpdated` | git + the repo's test runner + LOC of tracked `src/`+`scripts/` code |
| **CURATED** (preserve) | `aiContribution`, `agents[]` (name/provider/period/models/tokens/role), `totalTokens`, `devCycleDays`, `manualEstimateDays`, `impact`, `cycle`, `beforeAI`, `afterAI`, `microservices` | hand-maintained in each repo's `ai-metrics.json` |

Derived methodology (the engine, `scripts/sync-ai-metrics.mjs`, implements all of this):
- `totalCommits` = `git rev-list --count HEAD`
- `linesOfCode` = tracked code lines. For THIS repo: `src/`+`scripts/` (`*.ts/tsx/css/mjs/js`). For a
  cloned/sidecar-less repo with a different layout (adhan-ce), a general by-extension scope minus
  vendored/build/i18n dirs — the script picks the right one automatically (`generalLoc`).
- `tests` / `testSuites` = the project's real runner — **Vitest** here (`Tests N passed` / `Test Files N passed`),
  **Jest** for adhan-ce (`Tests: N passed` / `Test Suites: N passed`, run with `--experimental-vm-modules`).
  Always exclude `**/node_modules/**` and `**/.claude/**` so stale worktree copies don't pollute the count.
- `lastUpdated` = today (local date).

## Steps (run all of this yourself, from the repo root)

### 1. Recompute this repo's sidecar (`profile`)
```
node scripts/sync-ai-metrics.mjs --check   # dry run: show the diff
node scripts/sync-ai-metrics.mjs           # write ./ai-metrics.json (curated fields preserved)
```
This is what the live `profile` row/card reads once committed + pushed.

### 2. Pull canonical metrics for every project
```
node scripts/sync-ai-metrics.mjs --report
```
For each project this prints the canonical derived values — from the **live sidecar** where one
exists, or a **fresh clone + recompute** where one doesn't (adhan-ce). This is the authority for the
fallback.

### 3. Reconcile `STATIC_FALLBACK` in `src/app/ai/page.tsx`
For each project, set the **derived** fields to match the `--report` output. Keep curated fields as
they are in the live sidecar (for `profile`, mirror your freshly-written `./ai-metrics.json` exactly
so the fallback never drifts from the source). Edit field-by-field; don't rewrite curated prose
unless it's demonstrably stale.

### 4. Catch stale counts embedded in prose
Numbers get hard-coded in prose too. Grep `src/data/portfolio.ts` (e.g. adhan-ce's
`· N tests, M suites` in `impact`, shown on `/projects`) **and** `content/blog/*.mdx` for commit /
LOC / test / token counts of these projects, and update the current-fact ones.
**Caveat:** a blog "project story" may cite numbers as a *point-in-time* narrative (e.g. "built in a
single day — 9 commits, 31 tests"). Those were accurate then — don't rewrite them to today's totals;
flag them to the user instead (optionally add a "now at N" note). Only update statements of *current*
fact.

### 5. Flag — don't silently fix — stale CURATED data
If a curated field is clearly outdated (e.g. adhan-ce shows `devCycleDays: 1` / `tokens: 458000` but
now has 80 commits + 179 tests, or `profile`'s `agents[]` omits a tool that's since done real work),
**tell the user** and let them supply the real number. You cannot derive AI usage / token counts.
Best fix for adhan-ce long-term: add an `ai-metrics.json` to its repo so it stops living in the fallback.

### 6. Quality gates
```
npm run build      # 0 errors, 0 warnings
npm run lint       # 0 errors
npx vitest run --exclude '**/node_modules/**' --exclude '**/.claude/**'
```
(The bare `npm test` currently crawls `.claude/worktrees/*/node_modules` — use the explicit excludes,
or clear stale worktrees first.)

### 7. Verify the rendered page
Start the app and confirm the table + cards show the new numbers at desktop + mobile widths
(`mcp__playwright__*` or the preview MCP against `/ai`). Spot-check that AI %, Commits, LOC, and Tests
match the sources.

### 8. Commit
Branch off `main`, commit `chore(ai): refresh /ai metrics from repo sources (<date>)`, push, offer a PR.

## Notes
- The engine is `scripts/sync-ai-metrics.mjs` — pure derived-metric computation + a multi-repo report.
  It writes only `./ai-metrics.json` and never touches curated fields; the `page.tsx` fallback edits
  are done by you, guided by `--report`.
- If `REPO_MAP` changes in `src/lib/ai-metrics.ts`, mirror it in the script's `REPO_MAP`.
- tmo's commit count can legitimately *drop* (history was squashed) — mirror the sidecar regardless.
