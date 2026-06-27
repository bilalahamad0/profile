/**
 * Client side of the entry handshake. Collects the browser-only signals the gate
 * requires and exchanges them for the signed `ba_entry` cookie via /api/session.
 *
 * Shared by the entry splash (mints on "enter") and the contact form (re-mints
 * silently right before submit, so a returning visitor whose 2h token expired
 * can still send a message without seeing the splash again).
 */

export type ClientSignals = {
  tz: string;
  tzOffset: number;
  clientTime: number;
  lang: string;
};

export const ENTERED_KEY = "ba_entered";
const ENTERED_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function collectSignals(): ClientSignals {
  let tz = "UTC";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    tz = "UTC";
  }
  return {
    tz,
    tzOffset: new Date().getTimezoneOffset(),
    clientTime: Date.now(),
    lang: typeof navigator !== "undefined" ? navigator.language || "en" : "en",
  };
}

/**
 * Mint (or refresh) the entry session. Resolves to true when the cookie was set.
 * Never throws — a network failure resolves false and the caller decides what to
 * do (the splash always lets a real human in regardless).
 */
export async function ensureSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectSignals()),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function hasEntered(): boolean {
  try {
    const raw = window.localStorage.getItem(ENTERED_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < ENTERED_TTL_MS;
  } catch {
    return false;
  }
}

export function markEntered(): void {
  try {
    window.localStorage.setItem(ENTERED_KEY, String(Date.now()));
  } catch {
    /* private mode / storage disabled — splash just shows again next visit */
  }
}
