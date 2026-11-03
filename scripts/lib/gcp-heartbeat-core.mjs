// Core logic for the Google Cloud project heartbeat (portfolio-analytics-497506).
// Ensures regular API activity twice a week (primary on Mon, fallback on Thu)
// so that the project and OAuth refresh tokens do not expire or enter inactive states.

export const GCP_PROJECT_ID = "portfolio-analytics-497506";
export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const DISCOVERY_URL = "https://www.googleapis.com/discovery/v1/apis?name=analyticsdata";
export const OPENID_CONFIG_URL = "https://accounts.google.com/.well-known/openid-configuration";

/**
 * Determine cadence:
 * - Explicit input: 'primary' or 'fallback'
 * - Date-based auto:
 *   - Mon, Tue, Wed (1..3) -> 'primary'
 *   - Thu, Fri, Sat, Sun (4, 5, 6, 0) -> 'fallback'
 */
export function resolveCadence(input, date = new Date()) {
  if (input === "primary" || input === "fallback") {
    return input;
  }
  const day = date.getUTCDay();
  return day >= 1 && day <= 3 ? "primary" : "fallback";
}

/**
 * Simple .env parser for key=value lines, ignoring comments (#) and surrounding quotes.
 */
export function parseEnvFile(content = "") {
  const result = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

export function buildOAuthTokenParams({ clientId, clientSecret, refreshToken }) {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing required OAuth parameters (clientId, clientSecret, refreshToken)");
  }
  return new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
}

export function buildRunReportPayload() {
  return {
    dateRanges: [{ startDate: "yesterday", endDate: "today" }],
    metrics: [{ name: "activeUsers" }],
  };
}

export async function pingGoogleOAuth({ clientId, clientSecret, refreshToken, fetchFn = globalThis.fetch }) {
  const params = buildOAuthTokenParams({ clientId, clientSecret, refreshToken });
  const res = await fetchFn(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Google OAuth token exchange failed (HTTP ${res.status}): ${errText}`);
  }

  const json = await res.json();
  if (!json.access_token) {
    throw new Error("Google OAuth token response missing access_token");
  }

  return {
    accessToken: json.access_token,
    expiresIn: json.expires_in,
  };
}

export async function pingGoogleAnalyticsData({ accessToken, propertyId, fetchFn = globalThis.fetch }) {
  if (!propertyId) {
    throw new Error("Missing GA propertyId for runReport ping");
  }

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const res = await fetchFn(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildRunReportPayload()),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`GA4 runReport ping failed (HTTP ${res.status}): ${errText}`);
  }

  return {
    status: res.status,
    ok: true,
  };
}

export async function pingFallbackDiscovery({ fetchFn = globalThis.fetch }) {
  const res = await fetchFn(DISCOVERY_URL, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Google API discovery ping failed (HTTP ${res.status})`);
  }
  return { ok: true, status: res.status, endpoint: DISCOVERY_URL };
}

export async function pingFallbackOpenId({ fetchFn = globalThis.fetch }) {
  const res = await fetchFn(OPENID_CONFIG_URL, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Google OpenID config ping failed (HTTP ${res.status})`);
  }
  return { ok: true, status: res.status, endpoint: OPENID_CONFIG_URL };
}

/**
 * Execute the full heartbeat cycle.
 */
export async function executeHeartbeat({ config = {}, cadenceInput = "auto", fetchFn = globalThis.fetch, date = new Date() } = {}) {
  const cadence = resolveCadence(cadenceInput, date);
  const clientId = config.clientId || config.GA_OAUTH_CLIENT_ID;
  const clientSecret = config.clientSecret || config.GA_OAUTH_CLIENT_SECRET;
  const refreshToken = config.refreshToken || config.GA_OAUTH_REFRESH_TOKEN;
  const propertyId = config.propertyId || config.GA_PROPERTY_ID;

  const hasCredentials = Boolean(clientId && clientSecret && refreshToken);
  const now = new Date().toISOString();

  // 1. If credentials exist, run primary OAuth + GA4 activity
  if (hasCredentials) {
    try {
      const auth = await pingGoogleOAuth({ clientId, clientSecret, refreshToken, fetchFn });
      let queriedApi = false;

      if (propertyId) {
        await pingGoogleAnalyticsData({ accessToken: auth.accessToken, propertyId, fetchFn });
        queriedApi = true;
      }

      return {
        success: true,
        cadence,
        pingType: "primary",
        projectId: GCP_PROJECT_ID,
        refreshedToken: true,
        queriedApi,
        timestamp: now,
      };
    } catch (err) {
      // Primary failed -> switch to fallback ping to ensure Google endpoints are touched
      const discovery = await pingFallbackDiscovery({ fetchFn }).catch(() => null);
      const openid = await pingFallbackOpenId({ fetchFn }).catch(() => null);

      return {
        success: Boolean(discovery || openid),
        cadence,
        pingType: "fallback",
        projectId: GCP_PROJECT_ID,
        primaryError: err instanceof Error ? err.message : String(err),
        fallbackSuccess: Boolean(discovery || openid),
        timestamp: now,
      };
    }
  }

  // 2. Unauthenticated fallback reachability ping
  let networkError = null;
  const discovery = await pingFallbackDiscovery({ fetchFn }).catch((e) => {
    networkError = e.message;
    return null;
  });
  const openid = await pingFallbackOpenId({ fetchFn }).catch((e) => {
    networkError = e.message;
    return null;
  });

  const reachable = Boolean(discovery || openid);

  return {
    success: reachable,
    cadence,
    pingType: "fallback",
    projectId: GCP_PROJECT_ID,
    unauthenticated: true,
    message: reachable
      ? "Google Auth and API endpoints reachable. Configure GA_OAUTH credentials in GitHub Secrets to route authenticated activity to project."
      : `Could not reach Google endpoints (${networkError || "network unreachable"}).`,
    timestamp: now,
  };
}

export function formatHeartbeatSummary(result) {
  const lines = [
    `=== Google Cloud Heartbeat ===`,
    `Project:   ${result.projectId}`,
    `Cadence:   ${result.cadence.toUpperCase()} (${result.pingType})`,
    `Time:      ${result.timestamp}`,
    `Status:    ${result.success ? "ACTIVE / HEALTHY" : "FAILED"}`,
  ];

  if (result.refreshedToken) {
    lines.push(`OAuth:     Refreshed access token successfully`);
  }
  if (result.queriedApi) {
    lines.push(`API:       Google Analytics Data API runReport successful`);
  }
  if (result.primaryError) {
    lines.push(`Primary:   Failed with error: ${result.primaryError}`);
    lines.push(`Fallback:  Pinged Google API discovery & Auth endpoints (${result.fallbackSuccess ? "OK" : "FAILED"})`);
  }
  if (result.unauthenticated) {
    lines.push(`Notice:    ${result.message}`);
  }

  return lines.join("\n");
}
