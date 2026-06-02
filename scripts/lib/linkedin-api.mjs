// Thin LinkedIn REST wrappers (network I/O). Pure payload/URL shaping lives in
// linkedin-core.mjs and is unit-tested there; this file is exercised via
// `post-to-linkedin.mjs --dry-run` against real credentials.
//
// Auth model mirrors the Google OAuth refresh-token flow in
// src/app/api/visitors/route.ts: a long-lived refresh token is exchanged for a
// short-lived access token on demand.

import { readFile } from "node:fs/promises";
import {
  buildRegisterUploadPayload,
  extractRestliId,
  urnToPublicUrl,
} from "./linkedin-core.mjs";

const OAUTH_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const ASSETS_URL = "https://api.linkedin.com/v2/assets?action=registerUpload";
const UGC_POSTS_URL = "https://api.linkedin.com/v2/ugcPosts";

const RESTLI_HEADER = { "X-Restli-Protocol-Version": "2.0.0" };

/** Fetch + throw a descriptive error on any non-2xx response. */
async function http(url, init, label) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${label} failed: ${res.status} ${res.statusText} — ${body.slice(0, 500)}`);
  }
  return res;
}

/**
 * Resolve a usable access token from the environment.
 *  - LINKEDIN_REFRESH_TOKEN (+ client id/secret) → exchanged for a fresh access token (preferred)
 *  - LINKEDIN_ACCESS_TOKEN → used directly (60-day lifetime; caller should warn)
 * Throws with setup guidance when neither is present.
 */
export async function resolveAccessToken(env = process.env) {
  const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN, LINKEDIN_ACCESS_TOKEN } =
    env;

  if (LINKEDIN_REFRESH_TOKEN && LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET) {
    const res = await http(
      OAUTH_TOKEN_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: LINKEDIN_REFRESH_TOKEN,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        }),
      },
      "Token refresh"
    );
    const json = await res.json();
    if (!json.access_token) throw new Error("Token refresh: no access_token in response");
    return { token: json.access_token, source: "refresh_token" };
  }

  if (LINKEDIN_ACCESS_TOKEN) {
    return { token: LINKEDIN_ACCESS_TOKEN, source: "access_token" };
  }

  throw new Error(
    "No LinkedIn credentials found. Run `node scripts/linkedin-auth.mjs` once and add the " +
      "printed LINKEDIN_* values to .env.local (then re-run with --env-file=.env.local)."
  );
}

/** GET /v2/userinfo (OpenID Connect) → the author Person URN `urn:li:person:{sub}`. */
export async function getPersonUrn(token) {
  const res = await http(
    USERINFO_URL,
    { headers: { Authorization: `Bearer ${token}` } },
    "Fetch userinfo"
  );
  const json = await res.json();
  if (!json.sub) throw new Error("Fetch userinfo: response had no `sub`");
  return { urn: `urn:li:person:${json.sub}`, name: json.name, email: json.email };
}

/** Step 1 of image share: register an upload slot. Returns { uploadUrl, asset, uploadHeaders }. */
export async function registerUpload(token, authorUrn) {
  const res = await http(
    ASSETS_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...RESTLI_HEADER,
      },
      body: JSON.stringify(buildRegisterUploadPayload(authorUrn)),
    },
    "Register image upload"
  );
  const json = await res.json();
  const value = json.value || {};
  const mech = value.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"];
  if (!mech?.uploadUrl || !value.asset) {
    throw new Error("Register image upload: missing uploadUrl/asset in response");
  }
  return { uploadUrl: mech.uploadUrl, asset: value.asset, uploadHeaders: mech.headers || {} };
}

/** Step 2 of image share: upload the binary to the registered uploadUrl. */
export async function uploadImageBinary(token, uploadUrl, imagePath, uploadHeaders = {}) {
  const bytes = await readFile(imagePath);
  await http(
    uploadUrl,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, ...uploadHeaders },
      body: bytes,
    },
    "Upload image binary"
  );
}

/**
 * Create a UGC post. Accepts a prebuilt payload (see buildUgcPayload in
 * linkedin-core.mjs). Returns { urn, url }.
 */
export async function createUgcPost(token, payload) {
  const res = await http(
    UGC_POSTS_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...RESTLI_HEADER,
      },
      body: JSON.stringify(payload),
    },
    "Create ugcPost"
  );
  const urn = extractRestliId(res.headers);
  return { urn, url: urnToPublicUrl(urn) };
}
