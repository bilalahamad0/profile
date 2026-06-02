#!/usr/bin/env node
// One-time LinkedIn OAuth 2.0 (3-legged) helper.
//
// Prereqs (do these once in https://www.linkedin.com/developers/apps):
//   1. Create/select an app linked to a LinkedIn Company Page.
//   2. Products tab → add "Sign In with LinkedIn using OpenID Connect" + "Share on LinkedIn".
//   3. Auth tab → add redirect URL exactly:  http://localhost:4571/callback
//
// Usage:
//   LINKEDIN_CLIENT_ID=xxx LINKEDIN_CLIENT_SECRET=yyy node scripts/linkedin-auth.mjs
//   (or pass --client-id / --client-secret, or put them in .env.local and run with --env-file=.env.local)
//
// It opens your browser, you click "Allow", and it prints the LINKEDIN_* lines
// to paste into .env.local. No secrets are written to disk by this script.

import http from "node:http";
import { randomUUID } from "node:crypto";
import { exec } from "node:child_process";

const PORT = 4571;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPE = "openid profile email w_member_social";
const AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const CLIENT_ID = arg("client-id") || process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = arg("client-secret") || process.env.LINKEDIN_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing client credentials.\n" +
      "Provide them via env (LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET) or\n" +
      "flags (--client-id <id> --client-secret <secret>).\n" +
      "Find them in your app's Auth tab at https://www.linkedin.com/developers/apps"
  );
  process.exit(1);
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start \"\""
        : "xdg-open";
  exec(`${cmd} "${url}"`, (err) => {
    if (err) console.log(`\nCould not auto-open a browser. Open this URL manually:\n${url}\n`);
  });
}

async function exchangeCode(code) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(`Token exchange failed: ${res.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function fetchAuthorUrn(token) {
  const res = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok || !json.sub) throw new Error(`userinfo failed: ${res.status} ${JSON.stringify(json)}`);
  return { urn: `urn:li:person:${json.sub}`, name: json.name };
}

const state = randomUUID();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end("Not found");
    return;
  }

  const respond = (msg) =>
    res
      .writeHead(200, { "Content-Type": "text/html" })
      .end(`<html><body style="font-family:system-ui;background:#0b0b10;color:#eee;padding:3rem">
        <h2>${msg}</h2><p>You can close this tab and return to your terminal.</p></body></html>`);

  try {
    if (url.searchParams.get("error")) {
      throw new Error(
        `${url.searchParams.get("error")}: ${url.searchParams.get("error_description")}`
      );
    }
    if (url.searchParams.get("state") !== state) throw new Error("State mismatch (possible CSRF)");
    const code = url.searchParams.get("code");
    if (!code) throw new Error("No authorization code returned");

    const tok = await exchangeCode(code);
    const author = await fetchAuthorUrn(tok.access_token);

    respond("✅ LinkedIn authorized!");

    console.log(`\n✅ Authorized as ${author.name} (${author.urn})\n`);
    console.log("Add these lines to .env.local (gitignored):\n");
    console.log("# ---- LinkedIn (Blog → LinkedIn cross-publish) ----");
    console.log(`LINKEDIN_CLIENT_ID=${CLIENT_ID}`);
    console.log(`LINKEDIN_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`LINKEDIN_AUTHOR_URN=${author.urn}`);
    if (tok.refresh_token) {
      console.log(`LINKEDIN_REFRESH_TOKEN=${tok.refresh_token}`);
      console.log(
        `# refresh token valid ~${Math.round((tok.refresh_token_expires_in || 0) / 86400)} days; ` +
          `access token auto-refreshed on demand.`
      );
    } else {
      console.log(`LINKEDIN_ACCESS_TOKEN=${tok.access_token}`);
      console.log(
        `# No refresh token granted by your app — this access token expires in ~` +
          `${Math.round((tok.expires_in || 0) / 86400)} days. Re-run this script to renew.`
      );
    }
    console.log("\nDone. You can stop other terminals; this server will now exit.\n");
  } catch (err) {
    respond(`❌ ${err.message}`);
    console.error(`\n❌ ${err.message}\n`);
  } finally {
    server.close();
    setTimeout(() => process.exit(0), 300);
  }
});

server.listen(PORT, () => {
  const authUrl = `${AUTH_URL}?${new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state,
    scope: SCOPE,
  })}`;
  console.log(`\nListening on ${REDIRECT_URI}`);
  console.log("Opening LinkedIn authorization in your browser…");
  console.log(`If it doesn't open, visit:\n${authUrl}\n`);
  openBrowser(authUrl);
});
