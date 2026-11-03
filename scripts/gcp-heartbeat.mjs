#!/usr/bin/env node
// scripts/gcp-heartbeat.mjs
// Heartbeat ping for Google Cloud project `portfolio-analytics-497506`.
// Runs twice a week in regular cadence:
//   - Primary ping: Mondays 09:00 UTC (start of cycle)
//   - Fallback ping: Thursdays 09:00 UTC (~3.5 days later)
//
// Usage:
//   node scripts/gcp-heartbeat.mjs
//   node scripts/gcp-heartbeat.mjs --cadence=primary
//   node scripts/gcp-heartbeat.mjs --cadence=fallback

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  executeHeartbeat,
  formatHeartbeatSummary,
  parseEnvFile,
} from "./lib/gcp-heartbeat-core.mjs";

function getArg(name) {
  const match = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (match) return match.split("=")[1];
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

const cadenceArg = getArg("cadence") || "auto";

// Load .env.local if present and merge with process.env
const envLocalPath = resolve(process.cwd(), ".env.local");
let localEnv = {};
if (existsSync(envLocalPath)) {
  try {
    const raw = readFileSync(envLocalPath, "utf8");
    localEnv = parseEnvFile(raw);
  } catch (err) {
    console.warn("Could not read .env.local:", err.message);
  }
}

const config = {
  clientId: process.env.GA_OAUTH_CLIENT_ID || localEnv.GA_OAUTH_CLIENT_ID,
  clientSecret: process.env.GA_OAUTH_CLIENT_SECRET || localEnv.GA_OAUTH_CLIENT_SECRET,
  refreshToken: process.env.GA_OAUTH_REFRESH_TOKEN || localEnv.GA_OAUTH_REFRESH_TOKEN,
  propertyId: process.env.GA_PROPERTY_ID || localEnv.GA_PROPERTY_ID,
};

async function main() {
  console.log(`Starting GCP Heartbeat check (cadence: ${cadenceArg})...\n`);

  const result = await executeHeartbeat({
    config,
    cadenceInput: cadenceArg,
  });

  console.log(formatHeartbeatSummary(result));

  if (!result.success) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("GCP Heartbeat fatal error:", err);
  process.exit(1);
});
