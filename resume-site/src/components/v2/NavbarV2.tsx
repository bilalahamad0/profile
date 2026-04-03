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
      <nav className="glass border border-black/10 dark:border-white/10 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 pointer-events-auto h-14">
        {/* Logo/Name */}
        <Link 
          href="#top" 
          className="text-zinc-900 dark:text-white font-bold tracking-tight pr-4 border-r border-black/10 dark:border-white/10 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
        >
          B.A.
        </Link>
        
        <div className="flex items-center gap-5 sm:gap-6 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Link href="#experience" className="flex items-center gap-2 hover:text-zinc-900 dark:text-white transition-colors group">
            <Briefcase className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:text-blue-400 transition-colors" />
            <span className="hidden sm:inline pt-0.5">Experience</span>
          </Link>
          
          <Link href="https://github.com/bilalahamad0" target="_blank" className="flex items-center gap-2 hover:text-zinc-900 dark:text-white transition-colors group">
            <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-100 transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline pt-0.5">Projects</span>
          </Link>

          <a href="/Resume_Bilal_Ahamad.pdf" download="Bilal_Ahamad_Resume.pdf" className="flex items-center gap-2 hover:text-zinc-900 dark:text-white transition-colors group">
            <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors" />
            <span className="hidden sm:inline pt-0.5">Resume</span>
          </a>
          
          <Link href="#contact" className="flex items-center gap-2 hover:text-zinc-900 dark:text-white transition-colors group">
            <Mail className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-purple-600 dark:text-purple-400 transition-colors" />
            <span className="hidden sm:inline pt-0.5">Contact</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
