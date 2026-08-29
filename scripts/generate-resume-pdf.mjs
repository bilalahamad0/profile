#!/usr/bin/env node
/**
 * Generates public/Bilal_Ahamad_Resume.pdf from the /resume route.
 *
 * The resume is NOT a hand-made binary — it is Chromium's print of the live
 * /resume page, which renders from src/data/portfolio.ts. Regenerating after a
 * career-data edit is therefore the whole update process, and `--check` fails
 * CI when the committed PDF no longer matches what the site would print.
 *
 * Usage:
 *   node scripts/generate-resume-pdf.mjs            # write the PDF
 *   node scripts/generate-resume-pdf.mjs --check    # verify it is in sync
 *
 * Expects a server already running (npm run start). Override with
 * RESUME_BASE_URL, e.g. RESUME_BASE_URL=http://localhost:3288.
 */

import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/Bilal_Ahamad_Resume.pdf");
const BASE = process.env.RESUME_BASE_URL ?? "http://localhost:3000";
const CHECK = process.argv.includes("--check");

/**
 * Chromium stamps /CreationDate and /ID into every PDF, so two renders of
 * identical content are never byte-identical. Compare extractable text instead
 * — that is what a reader, a recruiter's CRM and an ATS actually consume.
 */
function pdfTextSignature(buffer) {
  return buffer
    .toString("latin1")
    .replace(/\/(CreationDate|ModDate)\s*\([^)]*\)/g, "")
    .replace(/\/ID\s*\[[^\]]*\]/g, "")
    .replace(/\s+/g, " ");
}

async function render() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // The entry splash is client-only and skips automation, but seed the flag
    // anyway so a future change to that logic cannot silently cover the sheet.
    await page.addInitScript(() => {
      try {
        localStorage.setItem("ba_entered", String(Date.now()));
      } catch {
        /* storage disabled — the splash skips automation regardless */
      }
    });

    const response = await page.goto(`${BASE}/resume`, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    if (!response || !response.ok()) {
      throw new Error(
        `GET ${BASE}/resume returned ${response ? response.status() : "no response"} — is the server running?`
      );
    }

    const sheet = await page.$(".resume-sheet");
    if (!sheet) throw new Error("/resume rendered without a .resume-sheet element");

    // preferCSSPageSize honours the @page rule in globals.css, which is where
    // the Letter size and the page margins are defined.
    return await page.pdf({ printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

const pdf = await render();

if (CHECK) {
  let committed;
  try {
    committed = await readFile(OUT);
  } catch {
    console.error(`✗ ${OUT} is missing. Run: node scripts/generate-resume-pdf.mjs`);
    process.exit(1);
  }
  if (pdfTextSignature(committed) !== pdfTextSignature(pdf)) {
    console.error(
      "✗ Resume PDF is out of sync with /resume.\n" +
        "  Career data changed without regenerating the PDF.\n" +
        "  Fix: npm run start, then node scripts/generate-resume-pdf.mjs"
    );
    process.exit(1);
  }
  console.log("✓ Resume PDF is in sync with /resume");
} else {
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, pdf);
  console.log(`✓ Wrote ${OUT} (${(pdf.length / 1024).toFixed(1)} KB)`);
}
