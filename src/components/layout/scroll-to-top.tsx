"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the top of the page on every route change.
 * Rendered once in the root layout — replaces the per-page useEffect workaround.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Preserve hash-target navigation (e.g. /contact#book): if the URL carries a
    // hash, let the browser / the target page scroll to that element instead of
    // yanking back to the top. Only plain route changes reset to the top.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
