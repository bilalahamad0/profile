"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Search, 
  X, 
  ChevronLeft, 
  Award, 
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/components/analytics/google-analytics";

// --- DATA ---

const AI_CERTIFICATES = [
  {
    id: "ai-1",
    title: "AI Coding Agents with GitHub Copilot and Cursor",
    issuer: "LinkedIn Learning",
    date: "2024",
    image: "/certificates/ai_coding_agents.png",
    url: "https://www.linkedin.com/learning/certificates/fa26c3fb8c3d86ba367271e666d1f5e54e0752eb73aff59ffb4e22a1c6b4d879",
    logo: "/logos/linkedin.png",
    description: "Deep dive into leveraging AI agents, GitHub Copilot, and Cursor for accelerated software development.",
    gradient: "from-blue-600/20 to-purple-600/20"
  },
  {
    id: "ai-2",
    title: "Software Testing Foundations: Integrating AI into the Quality Process",
    issuer: "LinkedIn Learning",
    date: "2024",
    image: "/certificates/software_testing_ai.png",
    url: "https://www.linkedin.com/learning/certificates/2a2a9abe336c54ff022075ad5887ac814192edc56dca798f9a7a5374be40a447",
    logo: "/logos/linkedin.png",
    description: "Modernizing QA workflows by integrating Generative AI into test planning, execution, and reporting.",
    gradient: "from-emerald-600/20 to-teal-600/20"
  },
  {
    id: "ai-3",
    title: "AI for App Building",
    issuer: "Coursera",
    date: "2024",
    image: "/certificates/ai_app_building.png",
    url: "https://www.coursera.org/account/accomplishments/verify/86O6XPQIM9WM",
    logo: "/logos/coursera.png",
    description: "Building intelligent applications powered by large language models and AI frameworks.",
    gradient: "from-indigo-600/20 to-blue-600/20"
  },
];

const GENERAL_CERTIFICATES = [
  {
    id: "g-1",
    title: "ISTQB Foundation Level",
    issuer: "ISTQB® - International Software Testing Qualifications Board",
    date: "2023",
    image: "/certificates/istqb.jpg",
    url: null,
    logo: "/logos/istqb.png",
    description: "The gold standard in software testing certifications, covering fundamental testing principles and strategies.",
    gradient: "from-blue-600/10 to-blue-800/10"
  },
  {
    id: "g-2",
    title: "Scrum: Advanced",
    issuer: "LinkedIn Learning",
    date: "2024",
    image: "/certificates/scrum_advanced.png",
    url: "https://www.linkedin.com/learning/certificates/9c6281ac20a7adf9e92714bff845ad8c95f08c0adea75b5ffbc7cadeaab9a357",
    logo: "/logos/linkedin.png",
    description: "Advanced Agile methodologies and Scrum framework for high-performing development teams.",
    gradient: "from-orange-600/10 to-red-600/10"
  },
  {
    id: "g-3",
    title: "iOS App Development: Essential Courses",
    issuer: "LinkedIn Learning",
    date: "2023",
    image: "/certificates/ios_app_dev.png",
    url: "https://www.linkedin.com/learning/certificates/48129ec1213ef12a50ad1ef36e933e1ff1d47102c6a02910cbbfbd2459ebe81b",
    logo: "/logos/linkedin.png",
    description: "Comprehensive training in Swift, Xcode, and iOS development principles.",
    gradient: "from-sky-600/10 to-blue-600/10"
  },
  {
    id: "g-4",
    title: "Javascript Essential Training",
    issuer: "LinkedIn Learning",
    date: "2023",
    image: "/certificates/javascript_essential.png",
    url: "https://www.linkedin.com/learning/certificates/e4aa03cd2c7d8ecd88c685ad02ae81ed93511e2eaf7a8713b9d71229443cdf87",
    logo: "/logos/linkedin.png",
    description: "Deep dive into core JavaScript concepts, DOM manipulation, and asynchronous programming.",
    gradient: "from-yellow-600/10 to-amber-600/10"
  },
  {
    id: "g-5",
    title: "Project Management Foundations",
    issuer: "LinkedIn Learning",
    date: "2023",
    image: "/certificates/pm_foundations.png",
    url: "https://www.linkedin.com/learning/certificates/40f20e0a52eb64a04a875e3539cc0e0808b59c34059bc3738f87065ef29dc85c",
    logo: "/logos/linkedin.png",
    description: "Essential project management skills including planning, execution, and risk management.",
    gradient: "from-indigo-600/10 to-violet-600/10"
  },
  {
    id: "g-6",
    title: "How to Master Your Executive Presence",
    issuer: "LinkedIn Learning",
    date: "2024",
    image: "/certificates/executive_presence.png",
    url: "https://www.linkedin.com/learning/certificates/5df27e588af83322ebbb6cd0394d68155e9ca37642fa24f523ec0f804079a1af",
    logo: "/logos/linkedin.png",
    description: "Developing leadership communication, confidence, and professional impact.",
    gradient: "from-slate-600/10 to-zinc-600/10"
  },
];

// --- COMPONENTS ---

const CertificateCard = ({ cert, isAI = false, onClick }: { cert: any, isAI?: boolean, onClick: (cert: any) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(cert)}
      className={cn(
        "group relative glass-card p-4 rounded-3xl cursor-pointer overflow-hidden flex flex-col h-full",
        isAI ? "border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)]" : "border-white/5"
      )}
    >
      {/* Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", cert.gradient)} />
      
      {/* Badge for AI */}
      {isAI && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">AI Expert</span>
          </div>
        </div>
      )}

      {/* Image Thumbnail */}
      <div className="relative aspect-[1.4/1] w-full rounded-2xl overflow-hidden mb-5 bg-black/20 ring-1 ring-white/5">
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Search className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col relative z-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-1 border border-white/10">
             <Image src={cert.logo} alt={cert.issuer} width={24} height={24} className="object-contain" />
          </div>
          <p className="text-xs font-medium text-white/50 truncate max-w-[150px]">{cert.issuer}</p>
        </div>

        <h3 className="text-lg font-semibold text-white/90 leading-tight mb-2 group-hover:text-white transition-colors">
          {cert.title}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {cert.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-white/30">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-widest">{cert.date}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-white/40 group-hover:text-blue-400 transition-colors">
            VIEW DETAILS
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- PAGE ---

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#09090b] aurora-gradient relative overflow-x-hidden">
      <div className="bg-noise" aria-hidden="true" />
      
      {/* Scroll to Top helper for SmoothScroll compatibility */}
      <div id="top" />

      {/* Header Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col items-center text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 shadow-xl">
             <Award className="w-4 h-4 text-blue-400" />
             <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Professional Credentials</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
            Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Album.</span>
          </h1>
          
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            A curated collection of my professional certifications, specialized training, 
            and continuous education in QA, Development, and Artificial Intelligence.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-40 space-y-32">
        
        {/* AI SECTION - HIGHLIGHTED */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  AI & NEXT-GEN TECH
               </div>
               <h2 className="text-3xl font-bold text-white tracking-tight">AI Specialists</h2>
               <p className="text-white/40 max-w-md">Highlighting expertise in Generative AI, Prompt Engineering, and AI-Powered Testing.</p>
            </div>
            {/* Minimal counter */}
            <div className="hidden md:flex flex-col items-end">
               <span className="text-5xl font-black text-white/5 leading-none">03</span>
               <span className="text-[10px] font-bold text-white/20 tracking-tighter uppercase mr-1">Certifications</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AI_CERTIFICATES.map((cert) => (
              <CertificateCard 
                key={cert.id} 
                cert={cert} 
                isAI={true} 
                onClick={setSelectedCert} 
              />
            ))}
          </div>
        </section>

        {/* GENERAL SECTION */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  CORE FOUNDATIONS
               </div>
               <h2 className="text-3xl font-bold text-white tracking-tight">Technical & Leadership</h2>
               <p className="text-white/40 max-w-md">Fundamental testing standards, development principles, and project management.</p>
            </div>
            {/* Minimal counter */}
            <div className="hidden md:flex flex-col items-end">
               <span className="text-5xl font-black text-white/5 leading-none">06</span>
               <span className="text-[10px] font-bold text-white/20 tracking-tighter uppercase mr-1">Certifications</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GENERAL_CERTIFICATES.map((cert) => (
              <CertificateCard 
                key={cert.id} 
                cert={cert} 
                onClick={setSelectedCert} 
              />
            ))}
          </div>
        </section>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/80"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Mobile */}
              <button 
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white md:hidden"
                onClick={() => setSelectedCert(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Image Area */}
              <div className="relative flex-[1.5] bg-black/40 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
                <div className="relative w-[90%] h-[85%]">
                  <Image
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    priority
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 md:p-12 flex flex-col bg-white/[0.02]">
                {/* Back to album (desktop) */}
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="hidden md:flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Album
                </button>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center">
                      <Image src={selectedCert.logo} alt={selectedCert.issuer} width={30} height={30} className="object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{selectedCert.issuer}</p>
                      <p className="text-[11px] text-white/30 uppercase tracking-tighter">{selectedCert.date}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {selectedCert.title}
                  </h3>

                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                  <p className="text-white/50 leading-relaxed">
                    {selectedCert.description}
                  </p>

                  <div className="pt-10 mt-auto">
                    {selectedCert.url ? (
                      <Link 
                        href={selectedCert.url} 
                        target="_blank"
                        onClick={() => trackEvent('verify_certificate', { 
                          title: selectedCert.title,
                          issuer: selectedCert.issuer
                        })}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="relative z-10">Verify Certificate</span>
                        <ExternalLink className="w-4 h-4" />
                        <div className="absolute inset-x-0 bottom-0 h-full bg-blue-400 rotate-2 translate-y-2 opacity-0 group-hover:opacity-10 transition-all rounded-2xl" />
                      </Link>
                    ) : (
                      <div className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 inline-block">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Internal Verification Only</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
