#!/usr/bin/env node
// sync-ai-metrics.mjs — keep the /ai page's metrics in sync with their real sources.
//
// The /ai page (src/app/ai/page.tsx) renders two things from per-project metrics:
//   • "Metrics at a Glance" comparison table
//   • the "AI-Augmented Systems" project cards
// Each project's numbers come from an `ai-metrics.json` sidecar fetched live from its
// own GitHub repo (see src/lib/ai-metrics.ts → getAIMetricsMap). STATIC_FALLBACK in the
// page is a build-time mirror used only when that fetch fails.
//
// This script is the engine behind the `update-ai-page` skill. It NEVER invents AI/token
// data — those live in each repo. It only recomputes the *derived* fields from the actual
// code/git, and reports what the page's fallback should mirror.
//
// Two responsibilities:
//   1. (default / --check) Recompute THIS repo's (`profile`) derived metrics and write them
//      into ./ai-metrics.json, preserving every curated field.
//   2. (--report) Pull every project's canonical metrics — live sidecar where one exists,
//      a fresh clone + recompute where one doesn't — and print them so STATIC_FALLBACK and
//      portfolio.ts can be reconciled.
//
// Usage:
//   node scripts/sync-ai-metrics.mjs            # update ./ai-metrics.json (profile)
//   node scripts/sync-ai-metrics.mjs --check    # dry run: show the diff, write nothing
//   node scripts/sync-ai-metrics.mjs --report    # fetch/clone every repo, print canonical values
//
// Fields are split into:
//   DERIVED  — recomputed from code/git here (objective, reproducible)
//   CURATED  — owned by each repo's ai-metrics.json (AI usage, tokens, narrative). Never touched.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const GITHUB_USER = 'bilalahamad0';

// Mirror of REPO_MAP in src/lib/ai-metrics.ts (projectId -> github repo slug).
const REPO_MAP = {
  warn: 'warn',
  adhan: 'adhan-api',
  profile: 'profile',
  tmo: 'tmo',
  'adhan-ce': 'adhan-ce',
};

// The project whose source lives in THIS working tree (recompute locally instead of cloning).
const LOCAL_PROJECT = 'profile';

const DERIVED_FIELDS = ['totalCommits', 'linesOfCode', 'tests', 'testSuites', 'lastUpdated'];

// stderr is piped (not ignored) so a thrown error carries the command's diagnostics
// instead of an opaque non-zero exit. execSync still returns stdout only.
const sh = (cmd, cwd) =>
  execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Local calendar date (en-CA renders YYYY-MM-DD); avoids UTC rolling over to "tomorrow".
const today = () => new Date().toLocaleDateString('en-CA');

// ── Derived-metric computation (objective, reproducible) ──────────────────────

// Total commits reachable from HEAD.
const countCommits = (cwd) => Number(sh('git rev-list --count HEAD', cwd));

// Lines of code.
//   local  — this repo's established scope: tracked code under src/ and scripts/.
//   general — any repo layout: tracked code by extension, minus vendored/build/i18n dirs.
//             Used for cloned repos (e.g. adhan-ce) whose code isn't under src/.
const LOC_LOCAL = "git ls-files | grep -E '^(src|scripts)/.*\\.(ts|tsx|css|mjs|js)$'";
const LOC_GENERAL =
  "git ls-files | grep -E '\\.(ts|tsx|js|jsx|mjs|cjs|css|scss|html)$' | " +
  "grep -vE '(^|/)(node_modules|dist|build|out|vendor|\\.next|coverage|locales)/'";
const countLoc = (cwd, general = false) => {
  // List matching files via git (tolerate grep's exit 1 on zero matches), then count
  // newlines in Node. Avoids `xargs wc -l | tail -1`, which keeps only the LAST batch's
  // total when xargs splits a large file list across multiple wc runs (ARG_MAX) — and
  // avoids the empty-list xargs hang / NaN.
  const list = sh(`{ ${general ? LOC_GENERAL : LOC_LOCAL} ; } || true`, cwd);
  const files = list.split('\n').map((s) => s.trim()).filter(Boolean);
  let lines = 0;
  for (const f of files) {
    try {
      lines += (readFileSync(join(cwd, f), 'utf8').match(/\n/g) || []).length;
    } catch {
      /* unreadable / vanished file — skip */
    }
  }
  return lines;
};

// Tests + suites from the project's real test runner. Returns { tests, testSuites }.
// Tries Vitest, then Jest (ESM). Excludes node_modules + .claude worktrees so stale
// worktree copies never pollute the count.
const countTests = (cwd) => {
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  const dev = { ...pkg.dependencies, ...pkg.devDependencies };
  let out = '';
  if (dev.vitest) {
    out = run(
      "npx vitest run --exclude '**/node_modules/**' --exclude '**/.claude/**' --reporter=dot",
      cwd
    );
    // Parse the TOTAL in parens ("Tests  116 passed (116)") not "N passed" — so a run with
    // failures/skips ("Tests  2 failed | 114 passed (116)") still yields the true count
    // instead of silently keeping the old value.
    return {
      tests: pickWarn(out, /Tests\s+.*?\((\d+)\)/, 'vitest tests'),
      testSuites: pickWarn(out, /Test Files\s+.*?\((\d+)\)/, 'vitest suites'),
    };
  }
  if (dev.jest) {
    // Honor the repo's own invocation (often needs --experimental-vm-modules for ESM).
    const cmd = pkg.scripts?.test?.includes('jest')
      ? pkg.scripts.test
      : 'node --experimental-vm-modules node_modules/jest/bin/jest.js';
    out = run(`${cmd} --ci`, cwd);
    // Parse the "N total" (robust to failed/skipped tests), not "N passed".
    return {
      tests: pickWarn(out, /Tests:.*?(\d+) total/, 'jest tests'),
      testSuites: pickWarn(out, /Test Suites:.*?(\d+) total/, 'jest suites'),
    };
  }
  console.error('⚠ no vitest/jest dependency found — leaving tests/testSuites unchanged');
  return { tests: undefined, testSuites: undefined };
};

const run = (cmd, cwd) => {
  try {
    // Merge stderr → stdout: Jest prints its summary to stderr, and execSync's return
    // value is stdout only. Without this the test counts come back undefined.
    return execSync(`${cmd} 2>&1`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    // Test runners exit non-zero on failure but still print the summary we parse.
    return `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
};

const pick = (text, re) => {
  const m = text.match(re);
  return m ? Number(m[1]) : undefined;
};

// pick + a warning when the pattern doesn't match, so a parsing miss never silently
// freezes a metric at its old value.
const pickWarn = (text, re, label) => {
  const v = pick(text, re);
  if (v === undefined) {
    console.error(`⚠ could not parse ${label} from test output — keeping existing value`);
  }
  return v;
};

const computeDerived = (cwd, { generalLoc = false } = {}) => {
  const { tests, testSuites } = countTests(cwd);
  return {
    totalCommits: countCommits(cwd),
    linesOfCode: countLoc(cwd, generalLoc),
    tests,
    testSuites,
    lastUpdated: today(),
  };
};

// ── Mode 1: update THIS repo's ai-metrics.json (profile) ──────────────────────

const updateLocal = ({ check }) => {
  const path = join(process.cwd(), 'ai-metrics.json');
  if (!existsSync(path)) {
    console.error('✗ ai-metrics.json not found in cwd — run from the repo root.');
    process.exit(1);
  }
  const current = JSON.parse(readFileSync(path, 'utf8'));
  const derived = computeDerived(process.cwd());

  console.log(`\n${LOCAL_PROJECT} — derived metrics (this repo)`);
  const next = { ...current };
  let changed = false;
  for (const f of DERIVED_FIELDS) {
    const before = current[f];
    const v = derived[f];
    // Only accept a clean value (finite number or non-empty string); otherwise keep the
    // existing one. Guards against NaN (would serialize to null) when a counter fails.
    const valid =
      (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.length > 0);
    const after = valid ? v : before;
    const mark = String(before) === String(after) ? '   ' : ' → ';
    console.log(`  ${f.padEnd(13)} ${String(before).padStart(10)}${mark}${after}`);
    if (String(before) !== String(after)) changed = true;
    next[f] = after;
  }

  if (check) {
    console.log(`\n[--check] no file written. ${changed ? 'Changes pending.' : 'Already in sync.'}`);
    return;
  }
  if (!changed) {
    console.log('\n✓ ai-metrics.json already in sync — nothing written.');
    return;
  }
  writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
  console.log('\n✓ ai-metrics.json updated (curated fields preserved).');
};

// ── Mode 2: report canonical metrics for every project ────────────────────────

const fetchSidecar = async (repo) => {
  for (const branch of ['main', 'master']) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/${branch}/ai-metrics.json`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'sync-ai-metrics/1.0' } });
      if (res.ok) return { data: await res.json(), source: `sidecar@${branch}` };
    } catch {
      /* try next branch */
    }
  }
  return null;
};

const cloneAndCompute = (repo) => {
  const dir = mkdtempSync(join(tmpdir(), `aim-${repo}-`));
  try {
    sh(`git clone --quiet https://github.com/${GITHUB_USER}/${repo}.git ${dir}`);
    sh('npm ci --silent', dir);
    // Cloned repos have their own layout — use the general LOC scope, not src/+scripts.
    return { data: computeDerived(dir, { generalLoc: true }), source: 'clone+recompute' };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

const report = async () => {
  console.log('\nCanonical metrics per project (this is what STATIC_FALLBACK should mirror):\n');
  for (const [id, repo] of Object.entries(REPO_MAP)) {
    try {
      let result;
      if (id === LOCAL_PROJECT) {
        result = { data: computeDerived(process.cwd()), source: 'local recompute' };
      } else {
        result = await fetchSidecar(repo);
        if (!result) {
          console.log(`  ${id} (${repo}): no sidecar — cloning to recompute derived fields…`);
          result = cloneAndCompute(repo);
        }
      }
      const d = result.data;
      console.log(`  ${id.padEnd(9)} [${result.source}]`);
      console.log(
        `    commits=${d.totalCommits}  loc=${d.linesOfCode}  tests=${d.tests}  suites=${d.testSuites}` +
          (d.lastUpdated ? `  updated=${d.lastUpdated}` : '')
      );
    } catch (e) {
      // One bad repo (clone/network/npm failure) shouldn't abort the whole report.
      console.error(`  ${id.padEnd(9)} [ERROR] ${e.message?.split('\n')[0] ?? e}`);
    }
  }
  console.log(
    '\nApply these to STATIC_FALLBACK in src/app/ai/page.tsx (derived fields only; keep curated AI/token data).'
  );
};

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.includes('--report')) {
  await report();
} else {
  updateLocal({ check: args.includes('--check') });
}
