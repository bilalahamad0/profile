// Pure token-expiry status. All times are UNIX SECONDS.
// `expiresAt` is read from LINKEDIN_TOKEN_EXPIRES (written by linkedin-auth.mjs).
// The live userinfo call in the poster is authoritative; this just enables
// proactive "expiring soon" warnings and an "expired" hint when offline.

export function tokenStatus({ expiresAt, now, warnDays = 7 } = {}) {
  const exp = Number(expiresAt);
  if (!exp || Number.isNaN(exp)) {
    return { status: "unknown", expired: false, daysLeft: null };
  }
  const daysLeft = Math.floor((exp - Number(now)) / 86400);
  if (exp - Number(now) <= 0) return { status: "expired", expired: true, daysLeft };
  if (daysLeft <= warnDays) return { status: "expiring", expired: false, daysLeft };
  return { status: "ok", expired: false, daysLeft };
}
