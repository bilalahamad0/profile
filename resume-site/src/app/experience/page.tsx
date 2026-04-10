"use client";

import { BentoGridV2 } from "@/components/v2/BentoGridV2";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { motion } from "framer-motion";
import { Download, ArrowLeft, FileText, Share2, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/google-analytics";

export default function ExperiencePage() {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Bilal Ahamad | Engineering Manager & Technical Lead",
      text: "Checkout Bilal Ahamad's professional technical roadmap and career timeline.",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <NavbarV2 />
      
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 lg:px-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-4">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">
              Technical <span className="text-blue-500">Roadmap</span>
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-2xl">
              A comprehensive chronicle of 18+ years in engineering, test automation, and IoT orchestration across the global tech ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a 
              href="/Bilal_Ahamad_Resume.pdf" 
              download 
              onClick={() => trackEvent('resume_download', { location: 'ExperiencePage' })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
            <button 
              onClick={handleShare}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                isCopied 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {isCopied ? (
                <><Check className="w-5 h-5" /> Copied!</>
              ) : (
                <><Share2 className="w-5 h-5" /> Share Profile</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Professional Dashboard (Bento Grid) */}
      <section className="relative py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
           <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
        </div>
        
        {/* We pass a prop or use a variation of BentoGrid that focuses on the resume parts */}
        <BentoGridV2 showOnlyResume={true} />
      </section>

      {/* Footer / CTA */}
      <section className="py-24 px-6 text-center border-t border-white/5">
        <h2 className="text-3xl font-bold mb-8">Ready to build something together?</h2>
        <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-600/20">
          Get in Touch
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </Link>
      </section>
    </main>
  );
}
