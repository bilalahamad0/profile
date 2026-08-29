"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ExternalLink, X } from "lucide-react";
import { trackEvent } from "@/components/analytics/google-analytics";
import type { GalleryCertificate } from "@/app/certifications/data";

/** Full-size certificate inspector — the page's original lightbox modal,
 *  now reachable from every single-cert row via "View full size". */
export function CertLightbox({
  cert,
  onClose,
}: {
  cert: GalleryCertificate | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Modal contract for role="dialog": lock body scroll, move focus in, trap
  // Tab, close on Escape, and restore focus to the opener on close.
  useEffect(() => {
    if (!cert) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [cert, onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-2xl md:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${cert.title} certificate`}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line/10 shadow-2xl focus:outline-none md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Mobile */}
            <button
              className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/50 p-2 text-white md:hidden"
              onClick={onClose}
              aria-label="Close certificate viewer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate Image Area */}
            <div className="relative flex min-h-[300px] flex-[1.5] items-center justify-center bg-black/40 md:min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
              <div className="relative h-[85%] w-[90%]">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  priority
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col bg-ink/[0.03] p-8 md:p-12">
              <button
                onClick={onClose}
                className="mb-10 hidden items-center gap-2 t-caption font-bold uppercase tracking-widest text-ink-subtle transition-colors hover:text-ink dark:text-ink/40 md:flex"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Album
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line/10 bg-ink/5 p-2">
                    <Image src={cert.logo} alt={cert.issuer} width={30} height={30} className="object-contain" />
                  </div>
                  <div>
                    <p className="t-caption font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{cert.issuer}</p>
                    {/* 30% white reads at 2.6:1 on the dark panel — same date
                        line, same 60% fix as the row body. */}
                    <p className="t-label uppercase tracking-tighter text-ink-subtle dark:text-ink/60">{cert.date}</p>
                  </div>
                </div>

                <h3 className="t-h3 text-ink">
                  {cert.title}
                </h3>

                <div className="h-px w-full bg-gradient-to-r from-line/10 to-transparent" />

                <p className="t-body text-ink-muted dark:text-ink/50">
                  {cert.description}
                </p>

                <div className="mt-auto pt-10">
                  {cert.url ? (
                    <Link
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('verify_certificate', {
                        title: cert.title,
                        issuer: cert.issuer
                      })}
                      className="group relative inline-flex items-center gap-3 rounded-2xl bg-ink px-8 py-4 font-bold text-surface transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="relative z-10">Verify Certificate</span>
                      <ExternalLink className="h-4 w-4" />
                      <div className="absolute inset-x-0 bottom-0 h-full rotate-2 translate-y-2 rounded-2xl bg-blue-400 opacity-0 transition-all group-hover:opacity-10" />
                    </Link>
                  ) : (
                    <div className="inline-block rounded-xl border border-line/10 bg-ink/5 px-6 py-4">
                      <span className="t-caption font-bold uppercase tracking-widest text-ink-subtle dark:text-ink/40">Internal Verification Only</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
