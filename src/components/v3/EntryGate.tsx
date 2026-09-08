"use client";

import { useEffect } from "react";
import { ensureSession, markEntered } from "@/lib/security/client";

/**
 * Silent session initializer.
 * Ensures the signed `ba_entry` session cookie is minted in the background
 * without showing a blocking interstitial splash screen, ensuring world-class
 * instantaneous page load (< 1.2s LCP) for technical recruiters and hiring managers.
 */
export function EntryGate() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.remove("ba-prelaunch");
    markEntered();
    void ensureSession();
  }, []);

  return null;
}
