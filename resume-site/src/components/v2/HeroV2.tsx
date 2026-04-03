"use client";

import { motion } from "framer-motion";
import { Download, MoveRight, Star } from "lucide-react";
import Link from "next/link";

function InfographicBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Dynamic Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-blue-600/10 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-emerald-600/10 blur-[100px] mix-blend-screen" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-[100%] bg-purple-600/10 blur-[150px] mix-blend-screen" />
      
      {/* Data Visualization / Tech SVG Layout */}
      <svg className="w-full h-full opacity-20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Infographic pseudo-curves */}
        <path d="M 0,200 Q 150,150 250,300 T 500,200 T 800,350 T 1000,100" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-pulse" />
        <path d="M -100,500 Q 200,600 450,400 T 800,200 T 1200,300" fill="none" stroke="url(#lineGradient2)" strokeWidth="1.5" />
        
        {/* Scattered interactive node points */}
        <circle cx="250" cy="300" r="3" fill="#3B82F6" />
        <circle cx="500" cy="200" r="3" fill="#3B82F6" />
        <circle cx="800" cy="350" r="4" fill="#10B981" />
        <circle cx="450" cy="400" r="3" fill="#8B5CF6" />
        <circle cx="800" cy="200" r="3" fill="#8B5CF6" />

        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </svg>
    </div>
  );
}

export function HeroV2() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="bg-noise" />
      <InfographicBackground />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center z-10 relative mt-16">
        
        {/* Ex-FAANG & Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/30 bg-amber-500/10 text-sm font-semibold tracking-wide text-amber-200">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Ex-FAANG Team Lead
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 bg-white/5 text-sm font-medium tracking-wide text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Leadership Roles
          </span>
        </motion.div>

        {/* Name Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-6"
        >
          <span className="text-white drop-shadow-lg">BILAL </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-sm">
            AHAMAD
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="max-w-3xl text-xl sm:text-2xl text-zinc-400 font-light mb-12 leading-relaxed"
        >
          Data-driven <span className="text-white font-medium">Engineering Manager & Technical QA Lead</span>. <br className="hidden md:block" />
          Specializing in executing massive test automation architectures <br className="hidden md:block" />
          across IoT, Autonomous Vehicles, and FAANG ecosystem hardware.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link href="#experience" className="group w-full sm:w-auto relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-neutral-950 transition-all hover:bg-neutral-200">
            <span className="mr-2 font-bold tracking-tight">Explore Impact</span>
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="/Resume_Bilal_Ahamad.pdf" download="Bilal_Ahamad_Resume.pdf" className="group w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center rounded-full glass border border-white/10 text-white font-medium hover:bg-white/10 transition-colors gap-2">
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Download CV
          </a>
        </motion.div>
      </div>
    </section>
  );
}
