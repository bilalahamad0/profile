"use client";

import { ContactSection } from "@/components/sections/contact";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Header Section */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 px-6 lg:px-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-black tracking-tighter"
          >
            Get in <span className="text-blue-500">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-zinc-400 font-light max-w-2xl"
          >
            Have a project in mind or just want to say hello? I&apos;m always open to discussing new opportunities and creative ideas.
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-12 md:py-16 lg:py-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto">
          <ContactSection />
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-12 md:py-20 lg:py-24 px-6 text-center border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Based in Sunnyvale, CA</h2>
          <p className="text-zinc-400">
            Available for remote roles or local opportunities in the San Francisco Bay Area.
            I typically respond to inquiries within 24-48 business hours.
          </p>
        </div>
      </section>
    </main>
  );
}
