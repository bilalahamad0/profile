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
const REMOTE_REPO_MAP = {
  warn: "warn",
  adhan: "adhan-api",
  tmo: "tmo",
  "adhan-ce": "adhan-ce",
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
  "adhan-ce": {
    projectId: "adhan-ce",
    lastUpdated: TODAY,
    aiContribution: 95,
    agents: [
      {
        name: "Claude Code",
        provider: "Anthropic",
        period: "May 2026",
        models: ["Claude Opus 4.7"],
        tokens: 458000,
        role: "End-to-end build — service worker, content scripts, geocoding, tests & store assets",
      },
    ],
    totalTokens: 458000,
    totalCommits: 9,
    linesOfCode: 2307,
    devCycleDays: 1,
    manualEstimateDays: 14,
    impact: "Auto-pauses media across every Chrome tab at Adhan time · cross-tab prayer-focus mode",
    cycle: "1 day",
    beforeAI: "Manual prayer tracking; media kept playing during Adhan",
    afterAI: "One-click extension pauses every tab at prayer time",
    tests: 31,
    testSuites: 3,
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

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`=== AI Metrics Update — ${TODAY} ===`);

  updateProfileMetrics();

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
