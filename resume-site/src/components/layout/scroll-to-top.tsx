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
    // Use instant scroll to avoid fighting Lenis animation on route change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
