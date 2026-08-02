"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, ExternalLink, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryCertificate } from "@/app/certifications/data";
import { panelItemVariants } from "./CollapsePanel";
import { openVerifyUrl } from "./verify";

/** Expanded body of a single-certificate row: inspectable thumbnail on the
 *  left, full description + issuer + CTAs on the right. ISTQB additionally
 *  shows its official badge with the blue halo. */
export const SingleCertBody = ({
  cert,
  onInspect,
}: {
  cert: GalleryCertificate;
  onInspect: (cert: GalleryCertificate) => void;
}) => {
  const itemVariants = useReducedMotion() ? undefined : panelItemVariants;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(280px,340px)_1fr] md:gap-8">
      {/* Thumbnail — opens the lightbox for full-size inspection */}
      <motion.div variants={itemVariants}>
        <button
          type="button"
          onClick={() => onInspect(cert)}
          aria-label={`View ${cert.title} certificate full size`}
          className="group/thumb relative block aspect-[1.4/1] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-black/20 ring-1 ring-white/5 transition-transform duration-300 hover:scale-[1.01]"
        >
          <Image
            src={cert.image}
            alt={`${cert.title} certificate preview`}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className={cn(
              cert.id === "g-2" ? "bg-white object-contain" : "object-cover",
              "transition-transform duration-700 group-hover/thumb:scale-105"
            )}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
            <div className="flex translate-y-4 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md transition-transform duration-300 group-hover/thumb:translate-y-0">
              <Search className="h-4 w-4 text-white" aria-hidden />
              <span className="t-label font-semibold uppercase tracking-wider text-white">
                View Full Size
              </span>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Details */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1.5">
            <Image
              src={cert.logo}
              alt={cert.issuer}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate t-caption font-bold uppercase tracking-widest text-blue-400">
              {cert.issuer}
            </p>
            <p className="flex items-center gap-1.5 t-label uppercase tracking-tighter text-white/30">
              <Calendar className="h-3 w-3" aria-hidden />
              {cert.date}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-5",
            cert.officialBadge && "sm:flex-row sm:items-center sm:gap-8"
          )}
        >
          <p className="t-body text-zinc-300">
            {cert.description}
          </p>
          {cert.officialBadge && (
            <div className="relative h-32 w-32 shrink-0 self-center transition-all duration-500 hover:scale-[1.07]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/30 blur-2xl"
              />
              <Image
                src={cert.officialBadge}
                alt={`${cert.title} official badge`}
                fill
                sizes="128px"
                className="relative object-contain drop-shadow-[0_6px_22px_rgba(37,99,235,0.55)]"
              />
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {cert.url && (
            <button
              type="button"
              onClick={() =>
                openVerifyUrl(cert.url as string, {
                  title: cert.title,
                  issuer: cert.issuer,
                })
              }
              aria-label={`Verify ${cert.title} certificate`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Verify Certificate
              <ExternalLink className="h-4 w-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={() => onInspect(cert)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 t-small font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search className="h-4 w-4" aria-hidden />
            View full size
          </button>
        </div>
      </motion.div>
    </div>
  );
};
