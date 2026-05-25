#!/usr/bin/env node
// Run locally: npm run sync-tokens
//
// Reads ~/.claude/projects/ session logs to collect actual Claude Code token
// usage since the last sync (or past 7 days on first run), attributes tokens
// to each project, and writes deltas to ai-metrics.json files.
//
// Profile repo: updated locally, then committed.
// Other repos (warn, adhan-api, tmo): updated via GitHub Contents API if
// GH_PAT is set in the environment.
//
// Usage:
//   npm run sync-tokens                        # interactive, default 7d window on first run
//   GH_PAT=xxx npm run sync-tokens             # also push to remote repos
//   TOKEN_WINDOW_DAYS=30 npm run sync-tokens   # override default lookback window

"use strict";

const { readFileSync, writeFileSync, readdirSync, existsSync, statSync } = require("fs");
const { resolve, join } = require("path");
const { execSync } = require("child_process");
const { homedir } = require("os");

const PROJECTS_DIR = join(homedir(), ".claude", "projects");
const ROOT = resolve(__dirname, "..");
const TODAY = new Date().toISOString().slice(0, 10);
const DEFAULT_WINDOW_DAYS = parseInt(process.env.TOKEN_WINDOW_DAYS || "7", 10);
const GH_PAT = process.env.GH_PAT;
const GH_USER = "bilalahamad0";

// Tracks the last sync time to avoid counting the same sessions twice.
// Gitignored — lives only on your local machine.
const LAST_SYNC_FILE = resolve(ROOT, ".last-token-sync");

const REMOTE_REPOS = { warn: "warn", adhan: "adhan-api", tmo: "tmo", "adhan-ce": "adhan-ce" };

// ── Session log parsing ──────────────────────────────────────────────────────

function getLastSyncMs() {
  try {
    const ts = parseInt(readFileSync(LAST_SYNC_FILE, "utf8").trim(), 10);
    if (!isNaN(ts)) return ts;
  } catch {}
  return Date.now() - DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

function saveLastSyncMs() {
  writeFileSync(LAST_SYNC_FILE, String(Date.now()));
}

function parseJsonl(filePath) {
  try {
    return readFileSync(filePath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getSessionTokens(filePath, sinceMs) {
  try {
    if (statSync(filePath).mtimeMs <= sinceMs) return 0;
  } catch {
    return 0;
  }
  let tokens = 0;
  for (const entry of parseJsonl(filePath)) {
    const usage = entry?.message?.usage;
    if (usage) {
      tokens +=
        (usage.input_tokens ?? 0) +
        (usage.output_tokens ?? 0) +
        (usage.cache_read_input_tokens ?? 0) +
        (usage.cache_creation_input_tokens ?? 0);
    }
  }
  return tokens;
}

// Claude encodes the working dir as the project dir name: /foo/bar → -foo-bar
// We match dirs whose name ends with -<repoName> (handles any prefix path).
function collectTokensForRepo(repoName, sinceMs) {
  if (!existsSync(PROJECTS_DIR)) return 0;
  let dirs;
  try {
    dirs = readdirSync(PROJECTS_DIR);
  } catch {
    return 0;
  }
  const suffix = `-${repoName}`;
  const matches = dirs.filter((d) => d === suffix || d.endsWith(suffix));
  if (matches.length === 0) return 0;

  let total = 0;
  for (const dir of matches) {
    const sessionDir = join(PROJECTS_DIR, dir);
    try {
      for (const f of readdirSync(sessionDir).filter((f) => f.endsWith(".jsonl"))) {
        total += getSessionTokens(join(sessionDir, f), sinceMs);
      }
    } catch {}
  }
  return total;
}

// ── Token application ────────────────────────────────────────────────────────

function applyDeltaToMetrics(metrics, delta) {
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

function applyProfileDelta(delta) {
  const path = resolve(ROOT, "ai-metrics.json");
  const metrics = JSON.parse(readFileSync(path, "utf8"));
  applyDeltaToMetrics(metrics, delta);
  writeFileSync(path, JSON.stringify(metrics, null, 2) + "\n");
  console.log(
    `[profile] +${delta.toLocaleString()} tokens → totalTokens now ${metrics.totalTokens.toLocaleString()}`
  );
}

async function applyRemoteDelta(projectId, repo, delta) {
  if (!GH_PAT) {
    console.log(`[${projectId}] GH_PAT not set — skipping remote push (run: GH_PAT=xxx npm run sync-tokens)`);
    return;
  }
  const url = `https://api.github.com/repos/${GH_USER}/${repo}/contents/ai-metrics.json`;
  const headers = {
    Authorization: `Bearer ${GH_PAT}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
  const get = await fetch(url, { headers });
  if (!get.ok) {
    console.warn(`[${projectId}] Cannot read remote ai-metrics.json: HTTP ${get.status}`);
    return;
  }
  const meta = await get.json();
  const metrics = JSON.parse(Buffer.from(meta.content, "base64").toString("utf8"));
  applyDeltaToMetrics(metrics, delta);
  const put = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `chore: Claude Code token sync +${delta} [skip ci]`,
      content: Buffer.from(JSON.stringify(metrics, null, 2) + "\n").toString("base64"),
      sha: meta.sha,
      committer: { name: "bilalahamad-bot", email: "bilal.ahamad@gmail.com" },
    }),
  });
  if (put.ok) {
    console.log(`[${projectId}] +${delta.toLocaleString()} tokens pushed to ${repo}`);
  } else {
    const body = await put.text();
    console.error(`[${projectId}] Push failed (${put.status}): ${body.slice(0, 200)}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(PROJECTS_DIR)) {
    console.error(`Claude Code projects dir not found at ${PROJECTS_DIR}`);
    console.error("Make sure Claude Code is installed and has been used at least once.");
    process.exit(1);
  }

  const sinceMs = getLastSyncMs();
  const sinceDate = new Date(sinceMs).toISOString().slice(0, 10);
  console.log(`=== Claude Code Token Sync — since ${sinceDate} (${TODAY}) ===`);

  const tokens = {
    profile: collectTokensForRepo("profile", sinceMs),
    ...Object.fromEntries(
      Object.entries(REMOTE_REPOS).map(([pid, repo]) => [pid, collectTokensForRepo(repo, sinceMs)])
    ),
  };

  const activeProjects = Object.entries(tokens).filter(([, t]) => t > 0);
  if (activeProjects.length === 0) {
    console.log("No new Claude Code activity since last sync.");
    saveLastSyncMs();
    return;
  }

  const total = activeProjects.reduce((s, [, t]) => s + t, 0);
  console.log(
    `Found ${total.toLocaleString()} tokens across: ${activeProjects.map(([p]) => p).join(", ")}`
  );

  if (tokens.profile > 0) applyProfileDelta(tokens.profile);

  for (const [pid, repo] of Object.entries(REMOTE_REPOS)) {
    if (tokens[pid] > 0) await applyRemoteDelta(pid, repo, tokens[pid]);
  }

  // Commit profile's ai-metrics.json if it changed
  try {
    execSync("git add ai-metrics.json", { cwd: ROOT });
    execSync("git diff --cached --quiet", { cwd: ROOT });
    // Exit 0 = no changes staged
    console.log("[profile] ai-metrics.json unchanged — nothing to commit");
  } catch {
    // Exit 1 = staged changes exist
    execSync(`git commit -m "chore: Claude Code token sync ${TODAY} [skip actions]"`, {
      cwd: ROOT,
      stdio: "inherit",
    });
    console.log("[profile] Committed ai-metrics.json — push when ready: git push");
  }

  saveLastSyncMs();
  console.log("=== Done ===");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
