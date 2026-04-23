import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { ExperienceRightColumn } from "@/components/experience/ExperienceRightColumn";
import { ShareButton } from "@/components/experience/ShareButton";
import { DownloadButton } from "@/components/experience/DownloadButton";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <section className="pt-32 pb-12 px-6 lg:px-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              Technical <span className="text-blue-400">Roadmap</span>
            </h1>
            <p className="text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
              A comprehensive chronicle of 18+ years in engineering, test automation, and IoT
              orchestration across the global tech ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <DownloadButton />
            <ShareButton />
          </div>
        </div>
      </section>

      {/* Career content — fully SSR'd */}
      <section className="relative py-12 px-4 sm:px-6" aria-label="Professional dashboard">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <ExperienceTimeline />
          <ExperienceRightColumn />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center border-t border-white/5">
        <h2 className="text-3xl font-bold mb-8">Ready to build something together?</h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-600/20"
        >
          Get in Touch
          <ArrowLeft className="w-5 h-5 rotate-180" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
