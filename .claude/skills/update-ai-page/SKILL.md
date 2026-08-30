---
name: update-ai-page
description: Refresh the AI Lab metrics on the Projects page (https://bilalahamad.com/projects#ai-lab, formerly the standalone /ai page) from their real sources — each project's GitHub `ai-metrics.json`, plus this repo's own git/test/LOC. TRIGGER whenever the user asks to update/refresh the AI page or AI Lab, sync ai-metrics, update "Metrics at a Glance", or update the per-project "AI Build Breakdown" cards — e.g. "update the ai page", "refresh AI metrics", "/update-ai-page". The agent does everything: recompute, measure, fetch every repo, reconcile the fallback, verify, build. Never ask the user for token/model/AI-usage numbers — Claude Code usage is measured from session transcripts (`--tokens`) and everything else is pulled from each repo automatically.
---

# Update the AI Lab metrics (fully automated, source-driven)

> **Moved 2026-08:** the AI Lab was a standalone `/ai` page; it is now the `#ai-lab`
> section of **`/projects`** and `/ai` 301s there (`next.config.ts`). Same data, same
> pipeline — only the files that render it changed.

The AI Lab renders two metric surfaces, both from the same per-project data:
- **Metrics at a Glance** — the comparison table (AI %, Tokens, Commits, LOC, Cycle, Saved, Tests),
  in [`src/components/projects/AILabSection.tsx`](../../../src/components/projects/AILabSection.tsx).
- **AI Build Breakdown** — the collapsible per-project detail (agents, models, tokens, before/after,
  tests) inside each card on `/projects`, in
  [`src/components/projects/AIBuildBreakdown.tsx`](../../../src/components/projects/AIBuildBreakdown.tsx).

## How the data flows (audit this first if anything looks off)

`src/app/projects/page.tsx` (a Server Component) → `getAIMetricsMap()` in [`src/lib/ai-metrics.ts`](../../../src/lib/ai-metrics.ts)
fetches each project's `ai-metrics.json` **live from its own GitHub repo**
(`raw.githubusercontent.com/bilalahamad0/<repo>/main/ai-metrics.json`). `REPO_MAP` there is the
project→repo mapping: `warn→warn`, `adhan→adhan-api`, `profile→profile`, `tmo→tmo`,
`adhan-ce→adhan-ce`. `STATIC_FALLBACK` in [`src/lib/ai-metrics-fallback.ts`](../../../src/lib/ai-metrics-fallback.ts)
is a build-time mirror used **only** when a fetch fails — so on the live site the fallback is invisible unless GitHub is unreachable.

**Source of truth per project = that repo's `ai-metrics.json`.** Two consequences:
- `profile` is THIS repo — its sidecar (`./ai-metrics.json`) is the live source, so we recompute it
  here. It's the one most likely to be stale (it's easy to forget when updating the others).
- Every project now has a sidecar in its own repo (`adhan-ce` got one on 2026-06-09). If a fetch
  404s (new project, renamed repo), the page silently falls back to `STATIC_FALLBACK` and `--report`
  clones the repo to recompute derived fields — restore the missing sidecar rather than letting the
  fallback become the de-facto source.

## Fields: DERIVED vs MEASURED vs CURATED

Auto-update the **derived** and **measured** fields. Never invent the curated ones — they live in
each repo.

| | Fields | Where they come from |
|---|---|---|
| **DERIVED** (recompute) | `totalCommits`, `linesOfCode`, `tests`, `testSuites`, `lastUpdated` | git + the repo's test runner + LOC of tracked `src/`+`scripts/` code |
| **MEASURED** (transcripts) | Claude Code `agents[].tokens` + `models`, `totalTokens` (= sum of ALL agents' tokens) | Claude Code session logs in `~/.claude/projects/` — `--tokens` (since 2026-06-09; before that, tokens were hand-typed estimates) |
| **CURATED** (preserve) | `aiContribution`, non-Claude-Code `agents[]` entries (incl. their `tokens`), every agent's `period`/`role`, `devCycleDays`, `manualEstimateDays`, `impact`, `cycle`, `beforeAI`, `afterAI`, `microservices` | hand-maintained in each repo's `ai-metrics.json` |

Derived methodology (the engine, `scripts/sync-ai-metrics.mjs`, implements all of this):
- `totalCommits` = `git rev-list --count HEAD`
- `linesOfCode` = tracked code lines. For THIS repo: `src/`+`scripts/` (`*.ts/tsx/css/mjs/js`). For a
  cloned/sidecar-less repo with a different layout (adhan-ce), a general by-extension scope minus
  vendored/build/i18n dirs — the script picks the right one automatically (`generalLoc`).
- `tests` / `testSuites` = the project's real runner — **Vitest** here (`Tests N passed` / `Test Files N passed`),
  **Jest** for adhan-ce (`Tests: N passed` / `Test Suites: N passed`, run with `--experimental-vm-modules`).
  Always exclude `**/node_modules/**` and `**/.claude/**` so stale worktree copies don't pollute the count.
- `lastUpdated` = today (local date).

Token measurement methodology (`--tokens` implements this; full write-up in the
`ai-tokens-measured-from-transcripts` memory):
- Claude Code journals every API call in `~/.claude/projects/<dir>/*.jsonl` (incl. `agent-*.jsonl`
  sidechains) with a `message.usage` block. `<dir>` = the repo's absolute path with every
  non-alphanumeric character → `-` (`~/git_repo/profile` → `-Users-bilalmac2-git-repo-profile` —
  note the underscore becomes a dash too), plus its `…--claude-worktrees-*` variants —
  exact-prefix matching on those two shapes naturally excludes lookalike siblings
  (`profile-ai-studio`).
- Claude Code `tokens` = Σ input + output + cache_creation + cache_read tokens, **deduplicated by
  `message.id:requestId`** (streamed messages are journaled more than once). This is the standard
  "total tokens processed" (ccusage) convention — keep it consistent across refreshes.
- The agent entry's `models` come from `message.model` (skip `<synthetic>`); the activity span
  helps sanity-check the curated `period`.
- Measurements are a **lower bound**: this machine only, Claude Code only. Antigravity/Cursor
  figures stay curated estimates.
- `warn` DOES have Claude Code transcripts — they were recorded on another machine, so
  `--report` run here will not see them and must not overwrite that project's token fields.
  Treat its Claude Code entry as measured-elsewhere, not curated: do not re-derive it, and do
  not delete it because a local scan comes back empty.

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
exists, or a **fresh clone + recompute** where one doesn't. This is the authority for the fallback.

### 3. Measure AI token usage and apply it to the sidecars
```
node scripts/sync-ai-metrics.mjs --tokens
```
Prints per-project measured Claude Code usage (TOTAL + breakdown, models, activity span) and, for
`profile`, the exact `totalTokens` to apply. For each project with transcripts:
- set the **Claude Code** agent's `tokens` to TOTAL (add the agent entry if missing — models from
  the report; `period`/`role` are still yours to word from that repo's git log);
- set `totalTokens` = TOTAL + the other (curated) agents' tokens;
- skip projects reported as "no transcripts" — their token fields stay curated.

Apply to `./ai-metrics.json` directly for `profile`. For sibling repos, update their sidecar on
`main` **via the GitHub API** — never touch the local checkouts (they often sit on feature
branches):
```
sha=$(gh api "repos/bilalahamad0/<repo>/contents/ai-metrics.json?ref=main" --jq .sha)
gh api -X PUT "repos/bilalahamad0/<repo>/contents/ai-metrics.json" \
  -f message="chore(ai): refresh measured Claude Code token usage (<date>)" \
  -f branch=main -f sha="$sha" -f content="$(base64 -i <updated-file>)"
```
(Drop `-f sha=…` when creating the file fresh.) Safe to re-run: the weekly `update-ai-metrics.yml`
Actions in those repos only rewrite `totalCommits`/`linesOfCode`/`lastUpdated`, so measured token
fields survive. Verify each raw URL serves the new JSON afterwards.

### 4. Reconcile `STATIC_FALLBACK` in `src/lib/ai-metrics-fallback.ts`
For each project, set the **derived** fields to match the `--report` output. Keep curated fields as
they are in the live sidecar (for `profile`, mirror your freshly-written `./ai-metrics.json` exactly
so the fallback never drifts from the source). Edit field-by-field; don't rewrite curated prose
unless it's demonstrably stale.

### 5. Catch stale counts embedded in prose
Numbers get hard-coded in prose too. Grep `src/data/portfolio.ts` (e.g. adhan-ce's
`· N tests, M suites` in `impact`, shown on `/projects`) **and** `content/blog/*.mdx` for commit /
LOC / test / token counts of these projects, and update the current-fact ones.
**Caveat:** a blog "project story" may cite numbers as a *point-in-time* narrative (e.g. "built in a
single day — 9 commits, 31 tests"). Those were accurate then — don't rewrite them to today's totals;
flag them to the user instead (optionally add a "now at N" note). Only update statements of *current*
fact.

### 6. Flag — don't silently fix — stale CURATED data
If a curated field is clearly outdated (e.g. a `devCycleDays`/`cycle` that predates months of
follow-on sessions, an `aiContribution` that no longer reflects who does the work, or an
Antigravity/Cursor token estimate that looks off), **tell the user** and let them supply the real
value — those can't be measured, only Claude Code usage can. Known accepted quirk: adhan-ce keeps
`devCycleDays: 1` (the original build day) even though maintenance sessions continued after.

### 7. Quality gates
```
npm run build      # 0 errors, 0 warnings
npm run lint       # 0 errors
npx vitest run --exclude '**/node_modules/**' --exclude '**/.claude/**'
```
(The bare `npm test` currently crawls `.claude/worktrees/*/node_modules` — use the explicit excludes,
or clear stale worktrees first.)

### 8. Verify the rendered page
Start the app and confirm the table + cards show the new numbers at desktop + mobile widths
(`mcp__playwright__*` or the preview MCP against `/projects#ai-lab`; expand a card's
"AI Build Breakdown" to check the per-project agents). Spot-check that AI %, Tokens, Commits, LOC,
and Tests match the sources. **Nuance:** the page fetches `profile`'s sidecar from GitHub `main`, so
locally-edited profile values keep rendering the old data until the PR merges — verify profile via
`STATIC_FALLBACK` correctness + the other projects' live rows.

### 9. Commit
Branch off `main`, commit `chore(ai): refresh AI Lab metrics from repo sources (<date>)`, push, offer a PR.

## Notes
- The engine is `scripts/sync-ai-metrics.mjs` — derived-metric computation, a multi-repo report, and
  transcript token measurement (`--tokens`). It writes only `./ai-metrics.json` (derived fields) and
  never invents AI data: tokens are measured, narrative fields stay curated. The
  `ai-metrics-fallback.ts` edits and sibling-sidecar `gh api` pushes are done by you, guided by
  `--report` / `--tokens`.
- If `REPO_MAP` changes in `src/lib/ai-metrics.ts`, mirror it in the script's `REPO_MAP`.
- tmo's commit count can legitimately *drop* (history was squashed) — mirror the sidecar regardless.
