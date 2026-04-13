"use client";

import { motion } from "framer-motion";
import { MoveRight, Car, Code2, Microchip, Network, Smartphone, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function InfographicBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
      style={{ transform: "translateZ(0)", willChange: "transform" }}
    >
      {/* Mesh gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-blue-600/8 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-emerald-600/8 blur-[100px]" />

      {/* Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* Floating icons — desktop only, decorative */}
      <div className="absolute inset-0 opacity-15 hidden lg:block">
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] text-blue-500/40"
        >
          <Car size={64} aria-hidden="true" />
          <span className="block text-[10px] mt-2 font-mono opacity-50 uppercase tracking-widest">
            AV Systems
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] left-[8%] text-blue-400/30"
        >
          <Smartphone size={56} aria-hidden="true" />
          <span className="block text-[10px] mt-1 font-mono opacity-50 uppercase tracking-widest">
            Mobile OS
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[15%] right-[5%] text-amber-500/30"
        >
          <Code2 size={64} aria-hidden="true" />
          <span className="block text-[10px] mt-2 font-mono opacity-50 uppercase tracking-widest">
            FW Automation
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[15%] right-[8%] text-emerald-500/30"
        >
          <Microchip size={60} aria-hidden="true" />
          <span className="block text-[10px] mt-1 font-mono opacity-50 uppercase tracking-widest">
            GPU Compute
          </span>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[2%] text-zinc-500/20"
        >
          <Network size={80} aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
}

const logos = [
  { name: "Amazon",   path: "/logos/amazon.png",   w: 80, h: 28 },
  { name: "Google",   path: "/logos/google.png",   w: 72, h: 28 },
  { name: "Samsara",  path: "/logos/samsara.png",  w: 88, h: 28 },
  { name: "Cruise",   path: "/logos/cruise.png",   w: 72, h: 28 },
  { name: "Rivian",   path: "/logos/rivian.png",   w: 72, h: 28 },
  { name: "Motorola", path: "/logos/motorola.png", w: 88, h: 28 },
];

export function HeroPortfolio() {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center items-start px-6 lg:px-24 py-20 overflow-hidden"
      aria-label="Hero introduction"
    >
      <div className="hidden lg:block">
        <InfographicBackground />
      </div>

      <div className="w-full max-w-5xl z-10">
        {/* Intro tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="h-px w-8 bg-blue-500/50" aria-hidden="true" />
          <span className="text-blue-400 font-mono text-sm uppercase tracking-widest">
            A Developer Story
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-7xl lg:text-8xl font-black text-zinc-100 leading-[1.08] mb-8 tracking-tighter"
        >
          {/* "Infrastructure" uses shimmer instead of animate-pulse */}
          Engineering{" "}
          <span className="text-shimmer">Infrastructure</span>{" "}
          &amp;{" "}
          <br className="hidden sm:block" />
          Automating{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Complexity
          </span>
          .
        </motion.h1>

        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl"
        >
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-10">
            For 18+ years, I&apos;ve built specialized test architectures and IoT solutions for{" "}
            <span className="text-zinc-200 font-medium">global industry leaders</span>. Currently
            focusing on high-integrity data pipelines and automated production systems.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="#featured-projects"
              className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-zinc-100 text-black font-bold transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              View Featured Work
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/experience"
              className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold transition-all hover:bg-white/10 hover:border-white/20"
            >
              Full Career Roadmap
              <Terminal className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Trusted-by logos — visible by default, no group hover gate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 pt-10 border-t border-white/5"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
            Engineering experience at
          </p>
          {/*
           * Logos: visible at opacity-60 grayscale always.
           * Individual hover: full opacity + colour restored.
           * No group-hover required — credibility is permanent, not hidden.
           */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {logos.map((logo) => (
              <Image
                key={logo.name}
                src={logo.path}
                alt={logo.name}
                width={logo.w}
                height={logo.h}
                className="h-7 w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative terminal icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute right-[-5%] top-[25%] w-[500px] h-[500px] hidden xl:block pointer-events-none"
        aria-hidden="true"
      >
        <Terminal className="w-full h-full text-blue-500 rotate-12" />
      </motion.div>
    </section>
  );
}
