#!/usr/bin/env node
// sync-ai-metrics.mjs — keep the AI Lab metrics in sync with their real sources.
//
// The AI Lab lives on /projects (src/app/projects/page.tsx) — it was its own /ai page
// until 2026-08. It renders two things from per-project metrics:
//   • the "Metrics at a Glance" comparison table (src/components/projects/AILabSection.tsx)
//   • the per-project "AI Build Breakdown" inside each project card
//     (src/components/projects/AIBuildBreakdown.tsx)
// Each project's numbers come from an `ai-metrics.json` sidecar fetched live from its
// own GitHub repo (see src/lib/ai-metrics.ts → getAIMetricsMap). STATIC_FALLBACK in
// src/lib/ai-metrics-fallback.ts is a build-time mirror used only when that fetch fails.
//
// This script is the engine behind the `update-ai-page` skill. It NEVER invents AI data:
// Claude Code token usage is *measured* from session transcripts (--tokens), derived fields
// are recomputed from the actual code/git, and narrative fields stay curated in each repo.
//
// Three responsibilities:
//   1. (default / --check) Recompute THIS repo's (`profile`) derived metrics and write them
//      into ./ai-metrics.json, preserving every curated field.
//   2. (--report) Pull every project's canonical metrics — live sidecar where one exists,
//      a fresh clone + recompute where one doesn't — and print them so STATIC_FALLBACK and
//      portfolio.ts can be reconciled.
//   3. (--tokens) Measure each project's Claude Code token usage from ~/.claude/projects
//      transcripts and print what the sidecars' Claude Code agent / totalTokens should be.
//
// Usage:
//   node scripts/sync-ai-metrics.mjs            # update ./ai-metrics.json (profile)
//   node scripts/sync-ai-metrics.mjs --check    # dry run: show the diff, write nothing
//   node scripts/sync-ai-metrics.mjs --report    # fetch/clone every repo, print canonical values
//   node scripts/sync-ai-metrics.mjs --report --fresh   # ignore sidecars, clone + recompute
//   node scripts/sync-ai-metrics.mjs --tokens    # measure Claude Code usage per project
//
// Fields are split into:
//   DERIVED  — recomputed from code/git here (objective, reproducible)
//   MEASURED — Claude Code agents[].tokens + totalTokens, summed from session transcripts
//   CURATED  — owned by each repo's ai-metrics.json (other agents, narrative). Never touched.

import { execSync } from 'node:child_process';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
  readdirSync,
  createReadStream,
} from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { dirname, join } from 'node:path';
import readline from 'node:readline';

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

const report = async ({ fresh = false } = {}) => {
  console.log('\nCanonical metrics per project (this is what STATIC_FALLBACK should mirror):\n');
  for (const [id, repo] of Object.entries(REPO_MAP)) {
    try {
      let result;
      if (id === LOCAL_PROJECT) {
        result = { data: computeDerived(process.cwd()), source: 'local recompute' };
      } else if (fresh) {
        // --fresh: don't trust the sidecar. Each repo refreshes its own derived fields on a
        // weekly schedule, and GitHub disables scheduled workflows in repos that go quiet —
        // so a sidecar can serve months-old counts. Reporting those would launder the
        // staleness straight into the page.
        console.log(`  ${id} (${repo}): --fresh — cloning to recompute derived fields…`);
        result = cloneAndCompute(repo);
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
    '\nApply these to STATIC_FALLBACK in src/lib/ai-metrics-fallback.ts (derived fields only; keep curated AI/token data).'
  );
};

// ── Mode 3: measure Claude Code token usage from session transcripts ──────────
//
// Claude Code journals every API call in ~/.claude/projects/<dir>/*.jsonl (incl.
// agent-*.jsonl sidechains) with a `message.usage` block. A repo's <dir> is its absolute
// path with every non-alphanumeric char → '-', plus `…--claude-worktrees-*` variants for
// sessions run in worktrees.
// Tokens = Σ input + output + cache_creation + cache_read, deduplicated by
// message.id:requestId (streamed messages are journaled more than once) — the standard
// "total tokens processed" (ccusage) convention. Lower bound: this machine, Claude Code
// only; other agents' token figures stay curated in each sidecar.

const TRANSCRIPT_ROOT = join(homedir(), '.claude', 'projects');

// Where the sibling project repos are checked out. The transcript dir name is derived from
// each repo's ABSOLUTE path, so this has to match the machine — and it differs between them
// (~/git_repo on one, ~/Documents/GitHub on another). Deriving it from THIS repo's own
// checkout keeps --tokens working anywhere instead of silently reporting "no transcripts".
// Order matters only for readability; every root is tried.
const REPO_ROOTS = [
  ...(process.env.AI_METRICS_REPO_ROOT ? [process.env.AI_METRICS_REPO_ROOT] : []),
  dirname(process.cwd()), // sibling repos live next to this one
  join(homedir(), 'git_repo'), // legacy layout
].filter((root, i, all) => all.indexOf(root) === i);

const transcriptDirsFor = (repo, allDirs) => {
  // Claude Code names the dir after the absolute path with EVERY non-alphanumeric
  // character → '-' (so /Users/x/git_repo/profile → -Users-x-git-repo-profile).
  const prefixes = REPO_ROOTS.map((root) => join(root, repo).replace(/[^a-zA-Z0-9]/g, '-'));
  // Exact match or a worktree variant — a bare startsWith(prefix) would wrongly pull in
  // lookalike siblings (profile → profile-ai-studio).
  return allDirs.filter((d) =>
    prefixes.some((p) => d === p || d.startsWith(`${p}--claude-worktrees-`))
  );
};

// `since` is a YYYY-MM-DD date — the day the currently-published figure was measured.
// Entries from that day or earlier are already baked into it, so they're accumulated
// separately (`t.since`) and only the strictly-newer usage counts as the delta to add.
const measureProject = async (dirs, since = null) => {
  const t = {
    apiCalls: 0,
    input: 0,
    output: 0,
    cacheWrite: 0,
    cacheRead: 0,
    files: 0,
    models: {},
    first: null,
    last: null,
    // usage strictly newer than `since` — the part not yet reflected in the sidecar
    since: { apiCalls: 0, input: 0, output: 0, cacheWrite: 0, cacheRead: 0 },
    undated: 0,
  };
  const seen = new Set();
  for (const dir of dirs) {
    for (const f of readdirSync(join(TRANSCRIPT_ROOT, dir)).filter((x) => x.endsWith('.jsonl'))) {
      t.files++;
      const rl = readline.createInterface({
        input: createReadStream(join(TRANSCRIPT_ROOT, dir, f)),
        crlfDelay: Infinity,
      });
      for await (const line of rl) {
        if (!line.includes('"usage"')) continue;
        let obj;
        try {
          obj = JSON.parse(line);
        } catch {
          continue;
        }
        const u = obj?.message?.usage;
        if (!u) continue;
        const key = obj.message.id
          ? `${obj.message.id}:${obj.requestId ?? ''}`
          : `${dir}/${f}:${obj.uuid}`;
        if (seen.has(key)) continue;
        seen.add(key);
        t.apiCalls++;
        t.input += u.input_tokens ?? 0;
        t.output += u.output_tokens ?? 0;
        t.cacheWrite += u.cache_creation_input_tokens ?? 0;
        t.cacheRead += u.cache_read_input_tokens ?? 0;
        const m = obj.message.model;
        if (m && m !== '<synthetic>') t.models[m] = (t.models[m] ?? 0) + 1;
        const ts = obj.timestamp;
        // An entry counts toward the delta only if it is provably newer than the baseline.
        // Undated entries are left out (and tallied) rather than assumed new — the whole
        // point of the delta is that it must never double-count.
        if (since) {
          if (!ts) t.undated++;
          else if (ts.slice(0, 10) > since) {
            t.since.apiCalls++;
            t.since.input += u.input_tokens ?? 0;
            t.since.output += u.output_tokens ?? 0;
            t.since.cacheWrite += u.cache_creation_input_tokens ?? 0;
            t.since.cacheRead += u.cache_read_input_tokens ?? 0;
          }
        }
        if (ts) {
          if (!t.first || ts < t.first) t.first = ts;
          if (!t.last || ts > t.last) t.last = ts;
        }
      }
    }
  }
  return t;
};

const fmt = (x) => x.toLocaleString('en-US');

// The published figure is CUMULATIVE, but transcripts are not kept forever — Claude Code
// prunes old session logs, so a re-measurement covers only the sessions that still exist.
// Overwriting with that raw total would silently erase real usage (tmo measured 12.8M in
// Aug 2026 against 121M already published). So the sidecar's own `lastUpdated` is treated
// as the baseline date and only strictly-newer usage is ADDED to the published figure:
// monotonic, no double-counting, and correct across pruning.
const loadSidecar = async (id, repo) => {
  if (id === LOCAL_PROJECT) {
    try {
      return JSON.parse(readFileSync(join(process.cwd(), 'ai-metrics.json'), 'utf8'));
    } catch {
      return null;
    }
  }
  return (await fetchSidecar(repo))?.data ?? null;
};

const tokensReport = async () => {
  if (!existsSync(TRANSCRIPT_ROOT)) {
    console.error(`✗ no Claude Code transcript directory at ${TRANSCRIPT_ROOT}`);
    process.exit(1);
  }
  const allDirs = readdirSync(TRANSCRIPT_ROOT);
  console.log('\nMeasured Claude Code token usage per project (lower bound — this machine only):\n');
  for (const [id, repo] of Object.entries(REPO_MAP)) {
    const dirs = transcriptDirsFor(repo, allDirs);
    if (dirs.length === 0) {
      console.log(`  ${id.padEnd(9)} no transcripts — token fields stay curated\n`);
      continue;
    }
    const sidecar = await loadSidecar(id, repo);
    const baseline = sidecar?.lastUpdated ?? null;
    const t = await measureProject(dirs, baseline);
    const total = t.input + t.output + t.cacheWrite + t.cacheRead;
    const delta = t.since.input + t.since.output + t.since.cacheWrite + t.since.cacheRead;
    const models = Object.entries(t.models)
      .sort((a, b) => b[1] - a[1])
      .map(([m, c]) => `${m} (${c})`)
      .join(', ');
    console.log(
      `  ${id.padEnd(9)} [${dirs.length} dir${dirs.length > 1 ? 's' : ''}, ${t.files} files, ${fmt(t.apiCalls)} API calls]`
    );
    console.log(
      `    TOTAL=${fmt(total)}  (input=${fmt(t.input)} output=${fmt(t.output)}` +
        ` cacheWrite=${fmt(t.cacheWrite)} cacheRead=${fmt(t.cacheRead)})`
    );
    console.log(`    models: ${models || '—'}`);
    console.log(`    span:   ${t.first?.slice(0, 10) ?? '?'} → ${t.last?.slice(0, 10) ?? '?'}`);

    if (!sidecar) {
      console.log('    ⚠ no sidecar found — cannot compute a delta; treat TOTAL as the value\n');
      continue;
    }
    const cc = (sidecar.agents ?? []).find((a) => a.name === 'Claude Code');
    const published = cc?.tokens ?? 0;
    const curated = (sidecar.agents ?? [])
      .filter((a) => a.name !== 'Claude Code')
      .reduce((s, a) => s + (a.tokens ?? 0), 0);
    const newCC = published + delta;
    console.log(
      `    delta:  +${fmt(delta)} since ${baseline} (${fmt(t.since.apiCalls)} calls)` +
        (t.undated ? ` [${t.undated} undated entries excluded]` : '')
    );
    if (total < published) {
      console.log(
        `    note:   surviving transcripts (${fmt(total)}) < published (${fmt(published)}) —` +
          ' older sessions pruned, so ADD the delta; never overwrite.'
      );
    }
    console.log(
      `    apply:  Claude Code agent tokens=${fmt(newCC)} (${fmt(published)} published + ${fmt(delta)} new);` +
        ` totalTokens=${fmt(curated + newCC)}`
    );
    console.log('');
  }
  console.log(
    "Apply: ADD each project's delta to its sidecar's Claude Code agent tokens, then set\n" +
      'totalTokens = curated agents + that figure (sibling repos via `gh api` PUT — see the\n' +
      'update-ai-page skill). Re-running is safe: the next baseline is the new lastUpdated.'
  );
};

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.includes('--tokens')) {
  await tokensReport();
} else if (args.includes('--report')) {
  await report({ fresh: args.includes('--fresh') });
} else {
  updateLocal({ check: args.includes('--check') });
}
