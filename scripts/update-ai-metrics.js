#!/usr/bin/env node
// Updates ai-metrics.json for all 4 projects every week.
// Profile: local git counts + vitest. Other repos: repository_dispatch triggers
// their own workflows to count locally and commit to themselves.
// Only touches: totalCommits, linesOfCode, tests, testSuites, lastUpdated.

"use strict";

const { execSync } = require("child_process");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { resolve } = require("path");

const ROOT = resolve(__dirname, "..");
const TODAY = new Date().toISOString().slice(0, 10);
const GH_USER = "bilalahamad0";
const GH_PAT = process.env.GH_PAT;
const ANTHROPIC_ADMIN_KEY = process.env.ANTHROPIC_ADMIN_KEY;
const TOKEN_WINDOW_DAYS = 7;

const REMOTE_REPO_MAP = {
  warn: "warn",
  adhan: "adhan-api",
  tmo: "tmo",
};

const SOURCE_EXTENSIONS = /\.(ts|tsx|js|jsx|css|mdx)$/;

// Seed data for repos that have no ai-metrics.json yet.
// Manual fields only — totalCommits/linesOfCode are updated by each repo's own workflow.
const SEED_METRICS = {
  adhan: {
    projectId: "adhan",
    lastUpdated: TODAY,
    aiContribution: 92,
    agents: [
      {
        name: "Antigravity",
        provider: "Google DeepMind",
        period: "Feb – Apr 2026",
        models: ["Gemini 2.5 Flash", "Gemini 2.5 Pro"],
        tokens: 255000,
        role: "v1–v2 architecture",
      },
      {
        name: "Cursor",
        provider: "Anthropic",
        period: "Apr 2026 – Present",
        models: ["Claude Sonnet 4", "Claude Opus 4.6"],
        tokens: 200000,
        role: "v3 pipeline, auto-updater & dashboard",
      },
    ],
    totalTokens: 455000,
    totalCommits: 0,
    linesOfCode: 0,
    devCycleDays: 4,
    manualEstimateDays: 21,
    impact:
      "Zero-touch prayer-time audio notifications with automated media-state control (Raspberry Pi + Android TV via ADB) · 10 microservices",
    cycle: "4 days",
    beforeAI: "No automation, manual device control",
    afterAI: "Zero-touch IoT orchestration system",
    microservices: 10,
    tests: 54,
    testSuites: 12,
  },
  tmo: {
    projectId: "tmo",
    lastUpdated: TODAY,
    aiContribution: 75,
    agents: [
      {
        name: "Antigravity",
        provider: "Google DeepMind",
        period: "Apr 2026",
        models: ["Gemini 2.5 Flash"],
        tokens: 90000,
        role: "Pipeline scaffolding & automation architecture",
      },
    ],
    totalTokens: 90000,
    totalCommits: 0,
    linesOfCode: 0,
    devCycleDays: 3,
    manualEstimateDays: 12,
    impact: "Zero-touch monthly billing cycle",
    cycle: "~3 days",
    beforeAI: "Manual Python script, ran per request",
    afterAI: "Event-driven E2E billing automation",
  },
};

// Workflow bootstrapped into each other repo if it doesn't already exist.
// Uses a heredoc so no quote-escaping is needed inside the Node.js code.
const REMOTE_WORKFLOW_YAML = `name: Update AI Metrics

on:
  repository_dispatch:
    types: [update-metrics]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-metrics:
    name: Refresh AI usage stats
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: \${{ secrets.GH_PAT }}

      - name: Update ai-metrics.json
        run: |
          node << 'JSEOF'
          const fs = require('fs');
          const { execSync } = require('child_process');
          if (!fs.existsSync('ai-metrics.json')) {
            console.log('No ai-metrics.json -- skipping');
            process.exit(0);
          }
          const metrics = JSON.parse(fs.readFileSync('ai-metrics.json', 'utf8'));
          const commits = parseInt(execSync('git rev-list --count HEAD').toString().trim(), 10);
          const exts = /\\.(ts|tsx|js|jsx|py|go|java|c|cpp|h|css|mdx|sh)$/;
          const files = execSync('git ls-files').toString().trim().split('\\n')
            .filter(f => f && exts.test(f) && !f.includes('node_modules'));
          let loc = 0;
          for (const f of files) {
            try { loc += fs.readFileSync(f, 'utf8').split('\\n').length; } catch {}
          }
          const today = new Date().toISOString().slice(0, 10);
          metrics.totalCommits = commits;
          if (loc > 0) metrics.linesOfCode = loc;
          metrics.lastUpdated = today;
          fs.writeFileSync('ai-metrics.json', JSON.stringify(metrics, null, 2) + '\\n');
          console.log('Updated:', JSON.stringify({ commits, loc, lastUpdated: today }));
          JSEOF

      - name: Commit and push if changed
        run: |
          git config user.name "bilalahamad-bot"
          git config user.email "bilal.ahamad@gmail.com"
          git add ai-metrics.json
          if ! git diff --cached --quiet; then
            git commit -m "chore: weekly AI metrics update [skip actions]"
            git push origin HEAD
          else
            echo "No changes to commit"
          fi
`;

// ── Profile repo (local) ────────────────────────────────────────────────────

function exec(cmd, opts) {
  return execSync(cmd, { encoding: "utf8", cwd: ROOT, ...opts }).trim();
}

function countCommits() {
  return parseInt(exec("git rev-list --count HEAD"), 10);
}

function countLOC() {
  try {
    const files = exec("git ls-files")
      .split("\n")
      .filter((f) => SOURCE_EXTENSIONS.test(f));
    let total = 0;
    for (const f of files) {
      try {
        total += readFileSync(resolve(ROOT, f), "utf8").split("\n").length;
      } catch {}
    }
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

function runTests() {
  const outFile = "/tmp/vitest-update-metrics.json";
  try {
    exec(`npx vitest run --reporter json 2>/dev/null > ${outFile} || true`, {
      shell: true,
    });
    if (!existsSync(outFile)) return null;
    const data = JSON.parse(readFileSync(outFile, "utf8"));
    const tests = data.numTotalTests ?? null;
    const testSuites = data.numTotalTestSuites ?? null;
    return tests !== null || testSuites !== null ? { tests, testSuites } : null;
  } catch {
    return null;
  }
}

function updateProfileMetrics() {
  const metricsPath = resolve(ROOT, "ai-metrics.json");
  const metrics = JSON.parse(readFileSync(metricsPath, "utf8"));
  const commits = countCommits();
  const loc = countLOC();
  const testResults = runTests();
  const updates = { lastUpdated: TODAY };
  if (!isNaN(commits)) updates.totalCommits = commits;
  if (loc !== null) updates.linesOfCode = loc;
  if (testResults?.tests != null) updates.tests = testResults.tests;
  if (testResults?.testSuites != null) updates.testSuites = testResults.testSuites;
  const updated = { ...metrics, ...updates };
  writeFileSync(metricsPath, JSON.stringify(updated, null, 2) + "\n");
  console.log(`[profile] Updated: ${JSON.stringify(updates)}`);
}

// ── Remote repos (repository_dispatch) ─────────────────────────────────────

function ghFetch(url, opts) {
  return fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(opts?.headers ?? {}),
    },
  });
}

// Creates update-ai-metrics.yml in the repo if it doesn't already exist.
// Requires GH_PAT to have Workflows: Write scope.
async function ensureWorkflowExists(repo) {
  const path = ".github/workflows/update-ai-metrics.yml";
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/contents/${encodeURIComponent(path)}`;

  const check = await ghFetch(url);
  if (check.status === 200) {
    console.log(`[${repo}] workflow already exists`);
    return true;
  }
  if (check.status !== 404) {
    console.error(`[${repo}] workflow check failed: HTTP ${check.status}`);
    return false;
  }

  const res = await ghFetch(url, {
    method: "PUT",
    body: JSON.stringify({
      message: "ci: add weekly AI metrics update workflow",
      content: Buffer.from(REMOTE_WORKFLOW_YAML).toString("base64"),
      committer: { name: "bilalahamad-bot", email: "bilal.ahamad@gmail.com" },
    }),
  });

  if (res.ok) {
    console.log(`[${repo}] bootstrapped update-ai-metrics.yml`);
    return true;
  }
  const body = await res.text();
  console.error(
    `[${repo}] bootstrap failed (${res.status}) — GH_PAT needs Workflows:Write on '${repo}': ${body.slice(0, 300)}`
  );
  return false;
}

// Seeds ai-metrics.json in the repo if it doesn't exist.
// The dispatched workflow will immediately overwrite totalCommits/linesOfCode.
async function ensureMetricsFileExists(projectId, repo) {
  const seed = SEED_METRICS[projectId];
  if (!seed) return true; // no seed defined, nothing to do

  const url = `https://api.github.com/repos/${GH_USER}/${repo}/contents/ai-metrics.json`;
  const check = await ghFetch(url);
  if (check.status === 200) return true; // file already exists

  if (check.status !== 404) {
    console.error(`[${repo}] metrics check failed: HTTP ${check.status}`);
    return false;
  }

  const res = await ghFetch(url, {
    method: "PUT",
    body: JSON.stringify({
      message: "chore: seed ai-metrics.json [skip ci]",
      content: Buffer.from(JSON.stringify(seed, null, 2) + "\n").toString("base64"),
      committer: { name: "bilalahamad-bot", email: "bilal.ahamad@gmail.com" },
    }),
  });

  if (res.ok) {
    console.log(`[${repo}] seeded ai-metrics.json`);
    return true;
  }
  const body = await res.text();
  console.error(
    `[${repo}] seed failed (${res.status}) — GH_PAT needs Contents:Write on '${repo}': ${body.slice(0, 300)}`
  );
  return false;
}

// Sends repository_dispatch to trigger the repo's own update workflow.
// Requires GH_PAT to have Actions:Write (or repo scope on classic PAT).
async function triggerRepoDispatch(repo) {
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/dispatches`;
  const res = await ghFetch(url, {
    method: "POST",
    body: JSON.stringify({ event_type: "update-metrics" }),
  });
  if (res.status === 204) {
    console.log(`[${repo}] dispatch sent`);
    return true;
  }
  const body = await res.text();
  console.error(
    `[${repo}] dispatch failed (${res.status}) — GH_PAT needs Actions:Write on '${repo}': ${body.slice(0, 300)}`
  );
  return false;
}

async function updateRemoteRepo(projectId, repo) {
  if (!GH_PAT) {
    console.warn(`[${projectId}] Skipped — GH_PAT not set`);
    return false;
  }
  const bootstrapped = await ensureWorkflowExists(repo);
  if (!bootstrapped) return false;
  const seeded = await ensureMetricsFileExists(projectId, repo);
  if (!seeded) return false;
  return triggerRepoDispatch(repo);
}

// ── Anthropic token sync ───────────────────────────────────────────────────
// Queries Anthropic's Admin Usage API for Claude token usage in the last
// TOKEN_WINDOW_DAYS, distributes proportionally by commits-in-period across
// all 4 projects, and pushes per-project token deltas. Profile is updated
// locally; remote repos get pushed via Contents API BEFORE their dispatched
// workflows run (which preserve token fields and only refresh commits/LOC).
//
// Captures: direct Anthropic API usage from the org's API keys (Claude Code,
// any SDK calls in your projects). Does NOT capture Cursor-mediated usage —
// that lives in Cursor's billing, not Anthropic's, and individual Cursor
// plans don't expose it via API.

async function fetchAnthropicClaudeTokens(startISO, endISO) {
  if (!ANTHROPIC_ADMIN_KEY) return null;

  // Admin API requires sk-ant-admin... keys — regular API keys return 401
  if (!ANTHROPIC_ADMIN_KEY.startsWith("sk-ant-admin")) {
    console.error(
      "[anthropic] ANTHROPIC_ADMIN_KEY is not an Admin API key (must start with sk-ant-admin...).\n" +
        "  Generate one at: console.anthropic.com → Settings → Organization → Admin API Keys"
    );
    return null;
  }

  // Claude Code Analytics API — daily per-user breakdown by model
  const baseUrl = "https://api.anthropic.com/v1/organizations/usage_report/claude_code";
  let total = 0;
  let pageToken = null;
  while (true) {
    const url = new URL(baseUrl);
    url.searchParams.set("starting_at", startISO);
    url.searchParams.set("ending_at", endISO);
    if (pageToken) url.searchParams.set("page", pageToken);
    const res = await fetch(url, {
      headers: {
        "x-api-key": ANTHROPIC_ADMIN_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[anthropic] usage fetch failed (${res.status}): ${body.slice(0, 200)}`);
      return null;
    }
    const data = await res.json();
    for (const record of data.data ?? []) {
      for (const model of record.model_breakdown ?? []) {
        total +=
          (model.input ?? 0) +
          (model.output ?? 0) +
          (model.cache_read ?? 0) +
          (model.cache_creation ?? 0);
      }
    }
    if (!data.has_more) break;
    pageToken = data.next_page;
    if (!pageToken) break;
  }
  return total;
}

function countProfileCommitsSince(sinceISO) {
  try {
    return parseInt(exec(`git rev-list --count --since="${sinceISO}" HEAD`), 10) || 0;
  } catch {
    return 0;
  }
}

async function fetchRemoteCommitsSince(repo, sinceISO) {
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/commits?since=${encodeURIComponent(sinceISO)}&per_page=100`;
  const res = await ghFetch(url);
  if (!res.ok) return 0;
  const link = res.headers.get("link") || "";
  const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (m) return parseInt(m[1], 10) * 100; // last-page approximation
  const body = await res.json();
  return Array.isArray(body) ? body.length : 0;
}

function addClaudeCodeTokensToMetrics(metrics, delta) {
  if (!metrics.agents) metrics.agents = [];
  let agent = metrics.agents.find((a) => a.name === "Claude Code");
  if (!agent) {
    agent = {
      name: "Claude Code",
      provider: "Anthropic",
      period: `${TODAY.slice(0, 7)} – Present`,
      models: ["Claude Sonnet 4.6", "Claude Opus 4.7"],
      tokens: 0,
      role: "Automated metrics, agentic refactors & code review",
    };
    metrics.agents.push(agent);
  }
  agent.tokens = (agent.tokens ?? 0) + delta;
  metrics.totalTokens = metrics.agents.reduce((s, a) => s + (a.tokens ?? 0), 0);
}

function applyProfileTokenDelta(delta) {
  if (!delta) return;
  const path = resolve(ROOT, "ai-metrics.json");
  const metrics = JSON.parse(readFileSync(path, "utf8"));
  addClaudeCodeTokensToMetrics(metrics, delta);
  writeFileSync(path, JSON.stringify(metrics, null, 2) + "\n");
  console.log(`[profile] Claude Code token delta +${delta.toLocaleString()} applied locally`);
}

async function applyRemoteTokenDelta(projectId, repo, delta) {
  if (!delta) return true;
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/contents/ai-metrics.json`;
  const get = await ghFetch(url);
  if (!get.ok) {
    console.warn(`[${repo}] cannot fetch metrics for token update: HTTP ${get.status}`);
    return false;
  }
  const meta = await get.json();
  const metrics = JSON.parse(Buffer.from(meta.content, "base64").toString("utf8"));
  addClaudeCodeTokensToMetrics(metrics, delta);
  const res = await ghFetch(url, {
    method: "PUT",
    body: JSON.stringify({
      message: `chore: weekly Claude Code token delta +${delta} [skip ci]`,
      content: Buffer.from(JSON.stringify(metrics, null, 2) + "\n").toString("base64"),
      sha: meta.sha,
      committer: { name: "bilalahamad-bot", email: "bilal.ahamad@gmail.com" },
    }),
  });
  if (res.ok) {
    console.log(`[${repo}] Claude Code token delta +${delta.toLocaleString()} pushed`);
    return true;
  }
  const body = await res.text();
  console.error(`[${repo}] token delta push failed (${res.status}): ${body.slice(0, 200)}`);
  return false;
}

async function syncAnthropicTokens() {
  if (!ANTHROPIC_ADMIN_KEY) {
    console.log("[anthropic] ANTHROPIC_ADMIN_KEY not set — skipping token sync");
    return;
  }
  const endMs = Date.now();
  const startMs = endMs - TOKEN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const startISO = new Date(startMs).toISOString();
  const endISO = new Date(endMs).toISOString();

  const total = await fetchAnthropicClaudeTokens(startISO, endISO);
  if (total === null) return;
  console.log(`[anthropic] Claude tokens past ${TOKEN_WINDOW_DAYS}d: ${total.toLocaleString()}`);
  if (total === 0) {
    console.log("[anthropic] No usage in window — nothing to distribute");
    return;
  }

  const commits = { profile: countProfileCommitsSince(startISO) };
  for (const [pid, repo] of Object.entries(REMOTE_REPO_MAP)) {
    commits[pid] = await fetchRemoteCommitsSince(repo, startISO);
  }
  const totalCommits = Object.values(commits).reduce((s, c) => s + c, 0);
  console.log(`[anthropic] Commits per project (${TOKEN_WINDOW_DAYS}d): ${JSON.stringify(commits)}`);

  const dist = {};
  if (totalCommits === 0) {
    // No activity in any repo — attribute all to profile (the always-active project)
    dist.profile = total;
  } else {
    for (const [pid, count] of Object.entries(commits)) {
      if (count > 0) dist[pid] = Math.round(total * (count / totalCommits));
    }
  }
  console.log(`[anthropic] Distribution: ${JSON.stringify(dist)}`);

  if (dist.profile) applyProfileTokenDelta(dist.profile);
  for (const [pid, repo] of Object.entries(REMOTE_REPO_MAP)) {
    if (dist[pid]) await applyRemoteTokenDelta(pid, repo, dist[pid]);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`=== AI Metrics Update — ${TODAY} ===`);

  updateProfileMetrics();

  // Push token deltas BEFORE dispatching remote workflows.
  // The dispatched workflows only touch totalCommits/linesOfCode, so our
  // token updates are preserved when those workflows commit.
  await syncAnthropicTokens();

  const results = await Promise.all(
    Object.entries(REMOTE_REPO_MAP).map(([projectId, repo]) =>
      updateRemoteRepo(projectId, repo)
    )
  );

  const failures = Object.keys(REMOTE_REPO_MAP).filter((_, i) => !results[i]);
  if (failures.length > 0) {
    console.error(
      `\n=== FAILED: ${failures.join(", ")} ===\n` +
        `GH_PAT needs: Contents R/W + Workflows W + Actions W on those repos`
    );
    process.exit(1);
  }

  console.log("=== Done ===");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
