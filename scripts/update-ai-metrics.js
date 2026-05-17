#!/usr/bin/env node
// Reads auto-computable stats and updates ai-metrics.json files.
// Only touches: totalCommits, linesOfCode, tests, testSuites, lastUpdated.
// All other fields (tokens, aiContribution, narratives) are preserved.

"use strict";

const { execSync } = require("child_process");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { resolve } = require("path");

const ROOT = resolve(__dirname, "..");
const TODAY = new Date().toISOString().slice(0, 10);
const GH_USER = "bilalahamad0";
const GH_PAT = process.env.GH_PAT;

// Repos to update via GitHub API (not checked out locally)
const REMOTE_REPO_MAP = {
  warn: "warn",
  adhan: "adhan-api",
  tmo: "tmo",
};

const SOURCE_EXTENSIONS = /\.(ts|tsx|js|jsx|css|mdx)$/;

// Seed values for repos that don't have ai-metrics.json yet.
// Only manual fields are seeded; totalCommits/linesOfCode are overwritten immediately.
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
    totalCommits: 182,
    linesOfCode: 7800,
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
    totalCommits: 40,
    linesOfCode: 2200,
    devCycleDays: 3,
    manualEstimateDays: 12,
    impact: "Zero-touch monthly billing cycle",
    cycle: "~3 days",
    beforeAI: "Manual Python script, ran per request",
    afterAI: "Event-driven E2E billing automation",
  },
};

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
        const content = readFileSync(resolve(ROOT, f), "utf8");
        total += content.split("\n").length;
      } catch {
        // skip unreadable files
      }
    }
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

function runTests() {
  const outFile = "/tmp/vitest-update-metrics.json";
  try {
    // Redirect only stdout so the JSON isn't mixed with vitest's stderr progress output
    exec(
      `npx vitest run --reporter json 2>/dev/null > ${outFile} || true`,
      { shell: true }
    );
    if (!existsSync(outFile)) return null;
    const data = JSON.parse(readFileSync(outFile, "utf8"));
    const tests =
      data.numTotalTests != null ? data.numTotalTests : null;
    const testSuites =
      data.numTotalTestSuites != null ? data.numTotalTestSuites : null;
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

// Returns total commit count using the Link header trick (1 API call)
async function fetchCommitCount(repo) {
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/commits?per_page=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return null;
  const link = res.headers.get("link") || "";
  // Link header looks like: <...?page=274>; rel="last"
  const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (match) return parseInt(match[1], 10);
  // If there's no "last" link, there's only 1 page of commits
  const body = await res.json();
  return Array.isArray(body) ? body.length : 1;
}

async function fetchRemoteMetrics(repo) {
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/contents/ai-metrics.json`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const content = JSON.parse(
    Buffer.from(data.content, "base64").toString("utf8")
  );
  return { content, sha: data.sha };
}

async function pushRemoteMetrics(repo, content, sha) {
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/contents/ai-metrics.json`;
  const body = {
    message: sha
      ? "chore: weekly AI metrics update [skip ci]"
      : "chore: seed ai-metrics.json [skip ci]",
    content: Buffer.from(JSON.stringify(content, null, 2) + "\n").toString("base64"),
    committer: { name: "bilalahamad-bot", email: "bilal.ahamad@gmail.com" },
  };
  if (sha) body.sha = sha; // omit sha when creating a new file
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function updateRemoteRepo(projectId, repo) {
  if (!GH_PAT) {
    console.warn(`[${projectId}] Skipped — GH_PAT not set`);
    return;
  }

  let commits, remote;
  try {
    [commits, remote] = await Promise.all([
      fetchCommitCount(repo),
      fetchRemoteMetrics(repo),
    ]);
  } catch (err) {
    console.warn(`[${projectId}] Fetch error — skipped: ${err.message}`);
    return;
  }

  const seed = SEED_METRICS[projectId] ?? null;
  if (!remote) {
    if (!seed) {
      console.warn(`[${projectId}] ai-metrics.json not found and no seed data — skipped`);
      return;
    }
    console.log(`[${projectId}] Seeding ai-metrics.json for the first time`);
  }

  const base = remote ? remote.content : seed;
  const updates = { lastUpdated: TODAY };
  if (commits !== null) updates.totalCommits = commits;

  const updated = { ...base, ...updates };

  const sha = remote?.sha ?? null;
  try {
    const ok = await pushRemoteMetrics(repo, updated, sha);
    if (ok) {
      console.log(`[${projectId}] ${sha ? "Updated" : "Seeded"}: ${JSON.stringify(updates)}`);
    } else {
      console.warn(`[${projectId}] Push failed — check GH_PAT permissions`);
    }
  } catch (err) {
    console.warn(`[${projectId}] Push error — skipped: ${err.message}`);
  }
}

async function main() {
  console.log(`=== AI Metrics Update — ${TODAY} ===`);

  updateProfileMetrics();

  await Promise.all(
    Object.entries(REMOTE_REPO_MAP).map(([projectId, repo]) =>
      updateRemoteRepo(projectId, repo)
    )
  );

  console.log("=== Done ===");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
