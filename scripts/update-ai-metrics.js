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
  if (!res.ok) {
    console.warn(`[${repo}] fetchCommitCount failed: HTTP ${res.status}`);
    return null;
  }
  const link = res.headers.get("link") || "";
  // Link header looks like: <...?page=274>; rel="last"
  const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (match) return parseInt(match[1], 10);
  // If there's no "last" link, there's only 1 page of commits
  const body = await res.json();
  return Array.isArray(body) ? body.length : 1;
}

// Counts LOC for a remote repo using GitHub Git Trees API
async function fetchRemoteLOC(repo) {
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/git/trees/HEAD?recursive=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.tree) return null;

  const sourceFiles = data.tree.filter(
    (item) =>
      item.type === "blob" &&
      SOURCE_EXTENSIONS.test(item.path) &&
      !item.path.includes("node_modules")
  );

  // Fetch each file's content to count lines (batch in parallel, max 10 at a time)
  let total = 0;
  for (let i = 0; i < sourceFiles.length; i += 10) {
    const batch = sourceFiles.slice(i, i + 10);
    const counts = await Promise.all(
      batch.map(async (file) => {
        try {
          const r = await fetch(
            `https://api.github.com/repos/${GH_USER}/${repo}/contents/${file.path}`,
            {
              headers: {
                Authorization: `Bearer ${GH_PAT}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
              },
            }
          );
          if (!r.ok) return 0;
          const d = await r.json();
          const text = Buffer.from(d.content, "base64").toString("utf8");
          return text.split("\n").length;
        } catch {
          return 0;
        }
      })
    );
    total += counts.reduce((a, b) => a + b, 0);
  }
  return total > 0 ? total : null;
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
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "chore: weekly AI metrics update [skip ci]",
      content: Buffer.from(
        JSON.stringify(content, null, 2) + "\n"
      ).toString("base64"),
      sha,
      committer: {
        name: "bilalahamad-bot",
        email: "bilal.ahamad@gmail.com",
      },
    }),
  });
  return res.ok;
}

async function updateRemoteRepo(projectId, repo) {
  if (!GH_PAT) {
    console.warn(`[${projectId}] Skipped — GH_PAT not set`);
    return false;
  }

  let commits, remote, loc;
  try {
    [commits, remote, loc] = await Promise.all([
      fetchCommitCount(repo),
      fetchRemoteMetrics(repo),
      fetchRemoteLOC(repo),
    ]);
  } catch (err) {
    console.error(`[${projectId}] Fetch error: ${err.message}`);
    return false;
  }

  if (!remote) {
    console.error(
      `[${projectId}] Could not read ai-metrics.json — verify GH_PAT has 'Contents: Read & Write' access to the '${repo}' repo`
    );
    return false;
  }

  const updates = { lastUpdated: TODAY };
  if (commits !== null) updates.totalCommits = commits;
  if (loc !== null) updates.linesOfCode = loc;

  const updated = { ...remote.content, ...updates };

  try {
    const ok = await pushRemoteMetrics(repo, updated, remote.sha);
    if (ok) {
      console.log(`[${projectId}] Updated: ${JSON.stringify(updates)}`);
      return true;
    } else {
      console.error(
        `[${projectId}] Push failed — verify GH_PAT has 'Contents: Write' access to the '${repo}' repo`
      );
      return false;
    }
  } catch (err) {
    console.error(`[${projectId}] Push error: ${err.message}`);
    return false;
  }
}

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
      `\n=== FAILED repos: ${failures.join(", ")} ===\n` +
        `Fix: edit GH_PAT → Repository access → add ${failures.join(", ")} → Contents: Read & Write`
    );
    process.exit(1);
  }

  console.log("=== Done ===");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
