"use client";

import { useEffect } from "react";

export default function HashScrollHandler() {
  useEffect(() => {
    // Wait for a brief moment to ensure dynamic content is painted
    const timeout = setTimeout(() => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      
      return () => cancelAnimationFrame(raf);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return null;
}
