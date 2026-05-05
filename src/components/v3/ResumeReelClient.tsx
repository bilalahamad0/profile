"use client";
import dynamic from "next/dynamic";

/**
 * Thin client boundary wrapper for ResumeReel.
 * Needed so `ssr: false` can be used — dynamic() with ssr:false requires a client component.
 */
const ResumeReelInner = dynamic(
  () => import("@/components/v3/ResumeReel").then((m) => ({ default: m.ResumeReel })),
  { ssr: false, loading: () => <div className="md:hidden h-20" aria-hidden="true" /> }
);

export function ResumeReelClient() {
  return <ResumeReelInner />;
}
