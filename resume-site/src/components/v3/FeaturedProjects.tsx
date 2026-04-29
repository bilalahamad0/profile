"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Github, ArrowRight, ExternalLink } from "lucide-react";
import { projectsData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const ACCENT_BORDER: Record<string, string> = {
  blue: "group-hover:border-blue-500/30",
  emerald: "group-hover:border-emerald-500/30",
  pink: "group-hover:border-pink-500/30",
  violet: "group-hover:border-violet-500/30",
};
const ACCENT_TEXT: Record<string, string> = {
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  pink: "text-pink-400",
  violet: "text-violet-400",
};
const ACCENT_BG: Record<string, string> = {
  blue: "bg-blue-500/5",
  emerald: "bg-emerald-500/5",
  pink: "bg-pink-500/5",
  violet: "bg-violet-500/5",
};

function FeaturedProjectCard({ project }: { project: (typeof projectsData)[0] }) {
  const imgPosition = project.id === "adhan" ? "object-top" : "object-center";

  return (
    <div
      className={`group relative h-full flex flex-col rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] transition-all duration-500 ${ACCENT_BORDER[project.accent]}`}
    >
      {/* Stretched link for card-level navigation */}
      <Link
        href={`/projects${(project as unknown as { thumbnailType?: string }).thumbnailType === 'video' ? `?play=${project.id}` : ''}#${project.id}`}
        className="absolute inset-0 z-[1]"
        aria-label={`View ${project.name} details`}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
      />

      {/* Thumbnail / live dashboard preview */}
      {project.id === "warn" ? (
        <div className={`relative w-full h-40 overflow-hidden ${ACCENT_BG[project.accent]}`}>
          <iframe
            src={(project as any).dashboardSrc}
            className="w-full border-0 origin-top-left scale-[0.85]"
            style={{ width: "117%", height: "220px", pointerEvents: "none" }}
            loading="lazy"
            title={`${project.name} live preview`}
            sandbox="allow-scripts allow-same-origin"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent pointer-events-none" />
        </div>
      ) : (project as unknown as { thumbnailType?: string }).thumbnailType === "video" ? (
        <div className={`relative w-full h-40 overflow-hidden ${ACCENT_BG[project.accent]}`}>
          <video
            src={project.thumbnail!}
            className={`w-full h-full object-cover ${imgPosition} opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700`}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent pointer-events-none" />
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-blue-500/80 backdrop-blur-md border border-white/20 text-[9px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-1.5 z-10 pointer-events-none">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Click to play full video
          </div>
        </div>
      ) : project.thumbnail ? (
        <div className={`relative w-full h-40 overflow-hidden ${ACCENT_BG[project.accent]}`}>
          <Image
            src={project.thumbnail}
            alt={project.thumbnailAlt || project.name}
            fill
            className={`${imgPosition} object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700`}
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
        </div>
      ) : null}

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {project.isAI && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">AI-Built</span>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-white mb-1">{project.name}</h3>
        <p className={`text-sm font-medium ${ACCENT_TEXT[project.accent]} mb-3`}>{project.tagline}</p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          <span className="text-xs text-zinc-500">{project.tech.slice(0, 2).join(" · ")}</span>
          <div className="flex gap-3 relative z-[2]">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className={`text-xs font-bold ${ACCENT_TEXT[project.accent]} hover:opacity-80 transition-opacity flex items-center gap-1`}
              >
                <ExternalLink className="w-3.5 h-3.5" /> {project.demoLabel || "Live"}
              </a>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProjectsSection() {
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <section className="px-6 lg:px-24 py-24" id="featured-projects" aria-labelledby="proj-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 id="proj-heading" className="text-3xl md:text-5xl font-black tracking-tight text-white">
                  Featured{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Projects</span>
                </h2>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p, idx) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <FeaturedProjectCard project={p} />
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex justify-center">
            <Link
              href="/projects"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
