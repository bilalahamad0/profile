"use client";

import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export function HeroV2() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6">
      {/* Background Gradients */}
      <div className="absolute inset-0 w-full h-full aurora-gradient -z-10 opacity-60" />
      <div className="bg-noise" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-white/80 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Engineering Leadership Roles
          </span>
        </motion.div>

        {/* Name Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4"
        >
          <span className="text-white">BILAL </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            AHAMAD
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl text-xl sm:text-2xl text-zinc-400 font-light mb-12"
        >
          Ensuring Quality at Scale. <br className="hidden sm:block" />
          <span className="text-zinc-200 font-medium">Leading Technical QA & Systems Validation</span> across IoT, EV, VR, and Wearables.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link href="#experience" className="group w-full sm:w-auto relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-neutral-950 transition-all hover:bg-neutral-200">
            <span className="mr-2">Explore Experience</span>
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#contact" className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center rounded-full glass border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
            Get in touch
          </Link>
        </motion.div>
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-20 pointer-events-none" />
    </section>
  );
}
