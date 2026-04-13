"use client";

import { motion } from "framer-motion";
import { MoveRight, Star, Code2, Cpu, Globe, Rocket, Terminal, ShieldCheck, Car, Smartphone, Watch, Headset, Microchip, Network, Database, Wifi } from "lucide-react";
import Link from "next/link";

function InfographicBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Dynamic Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-blue-600/10 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-emerald-600/10 blur-[100px] mix-blend-screen" />
      
      {/* Data Visualization Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* Floating Animated Technical Icons - Positioned to the Periphery */}
      <div className="absolute inset-0 opacity-20">
        {/* --- LEFT PERIPHERY --- */}
        <motion.div 
          animate={{ y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 8, 0] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] text-blue-500/40 hidden lg:block"
        >
          <Car size={64} />
          <span className="block text-[10px] mt-2 font-mono ml-1 opacity-50 uppercase tracking-widest">AV Systems</span>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -15, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] left-[8%] text-indigo-500/40 hidden lg:block"
        >
          <Smartphone size={56} />
          <span className="block text-[10px] mt-1 font-mono opacity-50 uppercase tracking-widest">Mobile OS</span>
        </motion.div>

        {/* --- RIGHT PERIPHERY --- */}
        <motion.div 
          animate={{ y: [0, 25, 0], x: [0, -20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[15%] right-[5%] text-amber-500/40 hidden lg:block"
        >
          <Code2 size={64} />
          <span className="block text-[10px] mt-2 font-mono ml-1 opacity-50 uppercase tracking-widest">FW Automation</span>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 10, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[15%] right-[8%] text-emerald-500/40 hidden lg:block"
        >
          <Microchip size={60} />
          <span className="block text-[10px] mt-1 font-mono opacity-50 uppercase tracking-widest">GPU Compute</span>
        </motion.div>

        {/* --- SPACERS --- */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[2%] text-zinc-500/20"
        >
          <Network size={80} />
        </motion.div>
      </div>
    </div>
  );
}

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
    <section className="relative min-h-[95vh] flex flex-col justify-center items-start px-6 lg:px-24 py-20 overflow-hidden">
      <InfographicBackground />

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
          className="text-4xl md:text-7xl lg:text-8xl font-black text-zinc-100 leading-[1.1] mb-8 tracking-tighter"
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
            <span className="text-zinc-200 font-medium"> global industry leaders</span>. Currently focusing on 
            high-integrity data pipelines and automated production systems.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
             <Link href="#featured-projects" className="group flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-100 text-black font-bold transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
               View Featured Work
               <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href="/experience" className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold transition-all hover:bg-white/10 hover:border-white/20">
               Full Career Roadmap
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
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute right-[-5%] top-[25%] w-[500px] h-[500px] hidden xl:block pointer-events-none"
      >
        <Terminal className="w-full h-full text-blue-500 rotate-12" />
      </motion.div>
    </section>
  );
}
