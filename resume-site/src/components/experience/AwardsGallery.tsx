"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronUp } from "lucide-react";

const AWARDS = [
  {
    src: "/awards/performance_award.jpeg",
    alt: "Excellent Performance Award Certificate",
    label: "Annual Best Performer",
    sublabel: "Excellent Performance Award",
    borderColor: "border-emerald-500/20",
    hoverBorderColor: "hover:border-emerald-500/40",
    textColor: "text-emerald-400",
  },
  {
    src: "/awards/eagle_award.jpeg",
    alt: "Eagle Award for Best Managed Project",
    label: "Annual Best Managed Project",
    sublabel: "Eagle Award",
    borderColor: "border-blue-500/20",
    hoverBorderColor: "hover:border-blue-500/40",
    textColor: "text-blue-400",
  },
];

const DESCRIPTIONS = [
  {
    bg: "bg-yellow-500/5 border-yellow-500/20",
    hover: "hover:border-yellow-500/40 hover:bg-white/5",
    iconColor: "text-yellow-400",
    title: "Annual Best Performer · Excellent Performance Award · L&T Infotech 2010–11",
    body: "Architected test automation infrastructure for Motorola ODC, validating multiple mobile platforms. Reduced man-hours by 25% through innovative automation of cumbersome stability testing procedures.",
  },
  {
    bg: "bg-blue-500/5 border-blue-500/20",
    hover: "hover:border-blue-500/40 hover:bg-white/5",
    iconColor: "text-blue-400",
    title: "Annual Best Managed Project · Eagle Award · L&T Infotech 2010–11",
    body: "Led the Development project for Motorola Mobility System Testing, achieving remarkable productivity growth.",
  },
];

export function AwardsGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [lightbox]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    if (lightbox) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const lightboxPortal =
    mounted && lightbox
      ? createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              backgroundColor: "rgba(0,0,0,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              touchAction: "none",
            }}
            onClick={() => setLightbox(null)}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "900px",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox}
                alt="Award expanded view"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  borderRadius: "16px",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "block",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  top: "-48px",
                  right: 0,
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setLightbox(null)}
                aria-label="Close lightbox"
              >
                <ChevronUp style={{ width: 24, height: 24, transform: "rotate(180deg)" }} />
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {lightboxPortal}

      {/* Stage photo */}
      <button
        className="relative w-full mb-6 rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in group text-left block"
        onClick={() => setLightbox("/awards/award_stage.jpg")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/awards/award_stage.jpg"
          alt="Bilal Ahamad receiving Excellent Performance Award on stage at L&T Infotech"
          className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-4 pointer-events-none">
          <span className="text-white font-bold text-sm block">Annual Best Performer · 2010–11</span>
          <span className="text-zinc-300 text-xs mt-0.5 block">L&amp;T Infotech · Receiving Award on Stage</span>
        </div>
        <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 border border-white/20 text-[9px] font-bold text-white/70 uppercase tracking-wider pointer-events-none">
          Click to expand
        </span>
      </button>

      {/* Performance + Eagle grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {AWARDS.map((award) => (
          <button
            key={award.src}
            className={`group relative rounded-2xl overflow-hidden border ${award.borderColor} ${award.hoverBorderColor} transition-all cursor-zoom-in text-left`}
            onClick={() => setLightbox(award.src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={award.src}
              alt={award.alt}
              className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-3 pointer-events-none">
              <span className="text-white text-[11px] font-black uppercase tracking-wider block">{award.label}</span>
              <span className={`${award.textColor} text-[10px] font-semibold`}>{award.sublabel}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Descriptions */}
      <div className="space-y-3">
        {DESCRIPTIONS.map((d) => (
          <div key={d.title} className={`p-4 rounded-2xl ${d.bg} ${d.hover} border transition-all duration-200 cursor-default`}>
            <div className="flex items-start gap-3">
              <span className={`${d.iconColor} text-lg shrink-0`} aria-hidden="true">⭐</span>
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{d.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{d.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
