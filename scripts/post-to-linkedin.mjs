#!/usr/bin/env node
// Publish a post to LinkedIn as the authenticated member.
//
// Run with credentials loaded from .env.local:
//   node --env-file=.env.local scripts/post-to-linkedin.mjs \
//     --commentary-file /tmp/post.txt --image public/blog-thumbs/foo.png \
//     --blog-url https://bilalahamad.com/blog/foo --tags "ai,quality" --dry-run
//
// Safety: a real post requires --confirm. Without --confirm (and without
// --dry-run) the script refuses to publish. --dry-run validates auth + author
// URN + payload and prints everything WITHOUT posting or uploading.
//
// On success it prints a machine-readable line:  POST_URL=<public url>

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import {
  resolveAccessToken,
  getPersonUrn,
  registerUpload,
  uploadImageBinary,
  createUgcPost,
} from "./lib/linkedin-api.mjs";
import { composeCommentary, buildUgcPayload } from "./lib/linkedin-core.mjs";
import { tokenStatus } from "./lib/linkedin-token.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}
const has = (name) => process.argv.includes(`--${name}`);

// `--check-token`: report whether the LinkedIn token is usable. Prints machine-
// readable TOKEN_STATUS=ok|expiring|expired and exits 3 when a re-auth is due.
async function checkToken() {
  const now = Math.floor(Date.now() / 1000);
  const st = tokenStatus({ expiresAt: process.env.LINKEDIN_TOKEN_EXPIRES, now });
  let live;
  try {
    const { token } = await resolveAccessToken();
    await getPersonUrn(token); // live GET /v2/userinfo — 401 if the token is dead
    live = "valid";
  } catch (e) {
    if (/\b401\b|expired|revoked|invalid_token/i.test(e.message)) {
      live = "expired";
    } else {
      console.log("TOKEN_STATUS=error");
      console.error(e.message);
      process.exit(1);
    }
  }
  // Live check wins for valid/expired; the timestamp supplies daysLeft + "expiring".
  const status = live === "expired" ? "expired" : st.status === "expiring" ? "expiring" : "ok";
  console.log(`TOKEN_STATUS=${status}`);
  console.log(`TOKEN_DAYS_LEFT=${st.daysLeft ?? ""}`);
  console.log(`live=${live}`);
  process.exit(status === "expired" ? 3 : 0);
}

async function main() {
  if (has("check-token")) return checkToken();
  const dryRun = has("dry-run");
  const confirm = has("confirm");
  const linkMode = arg("link-mode", "image"); // image | article
  const visibility = arg("visibility", "PUBLIC");
  const imagePath = arg("image");
  const blogUrl = arg("blog-url");
  const title = arg("title");
  const description = arg("description");
  const tags = (arg("tags", "") || "").split(",").map((t) => t.trim()).filter(Boolean);

  if (!dryRun && !confirm) {
    console.error(
      "Refusing to publish without --confirm. Re-run with --dry-run to validate, " +
        "or --confirm to post for real."
    );
    process.exit(2);
  }

  // --- commentary ---
  let body = arg("commentary");
  const commentaryFile = arg("commentary-file");
  if (commentaryFile) body = await readFile(commentaryFile, "utf-8");
  if (!body || !body.trim()) {
    console.error("Missing post text. Provide --commentary <text> or --commentary-file <path>.");
    process.exit(2);
  }

  const useImage = linkMode === "image" && imagePath;
  if (linkMode === "image" && imagePath && !existsSync(imagePath)) {
    console.error(`Image not found: ${imagePath}`);
    process.exit(2);
  }

  const text = composeCommentary({
    body,
    tags,
    blogUrl,
    includeLink: Boolean(useImage), // IMAGE share → link in text; ARTICLE share → link is the media
  });

  // --- auth ---
  const { token, source } = await resolveAccessToken();
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN || (await getPersonUrn(token)).urn;
  console.log(`Authenticated (${source}); author = ${authorUrn}`);

  // --- build payload ---
  let assetUrn;
  if (useImage) {
    if (dryRun) {
      assetUrn = "urn:li:digitalmediaAsset:DRYRUN"; // placeholder; no upload performed
    } else {
      const reg = await registerUpload(token, authorUrn);
      await uploadImageBinary(token, reg.uploadUrl, imagePath, reg.uploadHeaders);
      assetUrn = reg.asset;
      console.log(`Image uploaded → ${assetUrn}`);
    }
  }

  const payload = buildUgcPayload({
    authorUrn,
    text,
    assetUrn,
    articleUrl: !useImage ? blogUrl : undefined,
    mediaTitle: title,
    mediaDescription: description,
    visibility,
  });

  if (dryRun) {
    console.log("\n--- DRY RUN (nothing posted) ---");
    console.log(`link-mode: ${linkMode}  visibility: ${visibility}`);
    console.log(`\nCommentary (${text.length} chars):\n${text}\n`);
    console.log("ugcPosts payload:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("\nDry run OK. Re-run with --confirm to publish.");
    return;
  }

  // --- publish ---
  const { urn, url } = await createUgcPost(token, payload);
  console.log(`\n✅ Posted to LinkedIn: ${urn}`);
  console.log(`POST_URL=${url}`);
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`);
  process.exit(1);
});
