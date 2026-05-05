"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Bilal Ahamad | Lead Embedded Firmware & Systems QA Engineer",
      text: "Check out Bilal Ahamad's professional technical roadmap and career timeline.",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled or error — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        // clipboard unavailable — no action needed
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share this page"
      className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
        isCopied
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
      }`}
    >
      {isCopied ? (
        <>
          <Check className="w-5 h-5" aria-hidden="true" /> Copied!
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" aria-hidden="true" /> Share Profile
        </>
      )}
    </button>
  );
}
