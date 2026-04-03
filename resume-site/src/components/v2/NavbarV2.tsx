"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Mail, User } from "lucide-react";

export function NavbarV2() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-4 pb-2 flex justify-center pointer-events-none"
    >
      <nav className="glass border border-white/10 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 pointer-events-auto h-14">
        {/* Logo/Name */}
        <Link 
          href="#top" 
          className="text-white font-bold tracking-tight pr-4 border-r border-white/10 hover:text-emerald-400 transition-colors"
        >
          B.A.
        </Link>
        
        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="#experience" className="flex items-center gap-2 hover:text-white transition-colors group">
            <Briefcase className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            <span className="hidden sm:inline">Experience</span>
          </Link>
          <a href="/Resume_Bilal_Ahamad.pdf" download="Bilal_Ahamad_Resume.pdf" className="flex items-center gap-2 hover:text-white transition-colors group">
            <User className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            <span className="hidden sm:inline">Resume</span>
          </a>
          <Link href="#contact" className="flex items-center gap-2 hover:text-white transition-colors group">
            <Mail className="w-4 h-4 text-zinc-400 group-hover:text-purple-400 transition-colors" />
            <span className="hidden sm:inline">Contact</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
