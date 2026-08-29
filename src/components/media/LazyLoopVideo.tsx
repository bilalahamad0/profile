"use client";

import { useEffect, useRef } from "react";

interface LazyLoopVideoProps {
  src: string;
  /** Poster frame shown until the video streams — keeps initial page weight at ~0. */
  poster?: string;
  className?: string;
}

/**
 * Ambient looping video thumbnail that costs nothing until seen. The <video>
 * mounts with preload="none" and no autoplay; an IntersectionObserver starts
 * playback when the card scrolls into view and pauses it when it leaves, so
 * the multi-MB loops in /public/videos never load with the page. Visitors with
 * prefers-reduced-motion keep the still poster frame.
 */
export function LazyLoopVideo({ src, poster, className }: LazyLoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              /* autoplay blocked — poster stays, no error surface needed */
            });
          } else {
            video.pause();
          }
        }
      },
      // 0px on purpose: cards sitting just below the fold must NOT stream —
      // with any positive margin the multi-MB loops start downloading on load.
      { rootMargin: "0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      preload="none"
      loop
      muted
      playsInline
      aria-hidden="true"
    />
  );
}
