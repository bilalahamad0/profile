"use client";

import { motion } from "framer-motion";
import { MoveRight, Star, Code2, Cpu, Globe, Rocket, Terminal, ShieldCheck } from "lucide-react";
import Link from "next/link";

const logos = [
  { name: "Amazon", path: "/logos/amazon.png" },
  { name: "Google", path: "/logos/google.png" },
  { name: "Samsara", path: "/logos/samsara.png" },
  { name: "Cruise", path: "/logos/cruise.png" },
  { name: "Rivian", path: "/logos/rivian.png" },
  { name: "Motorola", path: "/logos/motorola.png" }
];

export function HeroPortfolio() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-start px-6 lg:px-24 py-20 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#09090b]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-5xl z-10">
        {/* Intro Tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="h-px w-8 bg-blue-500/50" />
          <span className="text-blue-500 font-mono text-sm uppercase tracking-widest">A Developer Story</span>
        </motion.div>

        {/* Impact Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-100 leading-[1.1] mb-8 tracking-tighter"
        >
          Engineering <span className="text-zinc-500 animate-pulse">Infrastructure</span> & <br />
          Automating <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Complexity</span>.
        </motion.h1>

        {/* Narrative Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl"
        >
          <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-10">
            For 18+ years, I&apos;ve built specialized test architectures and IoT solutions for 
            <span className="text-zinc-200"> global industry leaders</span>. Currently focusing on 
            high-integrity data pipelines and automated production systems.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
             <Link href="#featured-projects" className="group flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-100 text-black font-bold transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
               View Featured Work
               <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href="/resume" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold transition-all hover:bg-white/10 hover:border-white/20">
               Nitty-Gritty Details
               <Terminal className="w-5 h-5" />
             </Link>
          </div>
        </motion.div>

        {/* Trusted By Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 pt-12 border-t border-white/5"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Engineering Experience at</p>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-8 opacity-40 grayscale group hover:opacity-100 transition-opacity duration-1000">
             {logos.map((logo) => (
               <img 
                 key={logo.name} 
                 src={logo.path} 
                 alt={logo.name} 
                 className="h-6 md:h-8 w-auto object-contain transition-all hover:grayscale-0" 
               />
             ))}
          </div>
        </motion.div>
      </div>

      {/* Hero Graphic Element (Abstract Terminal) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] hidden xl:block"
      >
        <Terminal className="w-full h-full text-blue-500 rotate-12" />
      </motion.div>
    </section>
  );
}
