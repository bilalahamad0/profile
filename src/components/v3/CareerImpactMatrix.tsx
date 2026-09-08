"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { experienceData } from "@/data/portfolio";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

// Curated flagship roles with high-impact quantifiable metrics
const FLAGSHIP_ROLES = [
  {
    id: "stealth",
    company: "Stealth Mode",
    role: "System Architect & Technical QA Lead",
    period: "2025 – 2026",
    metricValue: "70%",
    metricLabel: "LiDAR / Radar Bring-Up Cycle Cut",
    highlights: [
      "Built a LiDAR/Radar bring-up platform in Python with Docker/QEMU SIL (virtual-ECU) environments.",
      "Architected Unified Sensor Test Platform with containerized A/B testing and release gates.",
    ],
    tech: ["Python", "Docker", "QEMU SIL", "Virtual-ECU", "ARM / ESP32"],
    logo: "/logos/stealth.png",
    accent: "border-indigo-500/30 text-indigo-700 dark:text-indigo-400",
    badge: "Sensor Bring-Up IDE",
  },
  {
    id: "samsara",
    company: "Samsara Inc",
    role: "Senior Firmware Quality Lead",
    period: "2023 – 2025",
    metricValue: "5 Days",
    metricLabel: "Regression Cycle (Reduced from 2 Weeks)",
    highlights: [
      "Cut regression cycle from 2 weeks to 5 days and post-launch firmware escapes by 30% across Dash Cams.",
      "Pytest automation across Edge-to-Cloud video safety pipeline covering on-device AI precision & network robustness.",
    ],
    tech: ["Embedded Linux", "Pytest", "On-Device AI", "RTSP / RTP", "TLS 1.3"],
    logo: "/logos/samsara.png",
    accent: "border-amber-500/30 text-amber-700 dark:text-amber-400",
    badge: "Fleet IoT & Edge AI",
  },
  {
    id: "cruise",
    company: "Cruise LLC",
    role: "Senior Automation Architect",
    period: "2022 – 2023",
    metricValue: "75%",
    metricLabel: "Autonomous Compute Automation Coverage",
    highlights: [
      "Engineered Python framework stress-testing AV compute across CPU/GPU, AI/ML, V2X, and PCAP replay.",
      "Defined ASIL-D validation protocols on HIL benches against redundancy and fault-tolerance benchmarks.",
    ],
    tech: ["ASIL-D", "ISO 26262", "HIL Benches", "Python", "V2X / PCAP Replay"],
    logo: "/logos/cruise.png",
    accent: "border-violet-500/30 text-violet-700 dark:text-violet-400",
    badge: "ASIL-D Autonomous Vehicle",
  },
  {
    id: "rivian",
    company: "Rivian Automotive",
    role: "Test Lead & Senior System Test Engineer",
    period: "2021 – 2022",
    metricValue: "40%",
    metricLabel: "Blocking Defects Pre-FCS Reduced",
    highlights: [
      "Directed test strategy across R1T, R1S, and Commercial Fleet (EDV) across multi-ECU handshaking and OTA.",
      "Architected Python automation for QNX and Android running 24/7 on SIL/HIL benches through Buildkite CI.",
    ],
    tech: ["QNX", "Android AAOS", "OTA Verification", "CAN Bus", "Buildkite CI"],
    logo: "/logos/rivian.png",
    accent: "border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
    badge: "EV & Fleet Telematics",
  },
  {
    id: "amazon",
    company: "Amazon Lab126",
    role: "Senior Product Quality Lead & QAE II",
    period: "2018 – 2021",
    metricValue: "$3.0M",
    metricLabel: "Manual Testing Operational Cost Saved",
    highlights: [
      "Engineered reusable automation library of AVS test primitives across 50+ localized SKUs (Echo Auto, Echo Buds).",
      "Ran 24/7 CI/CD pipelines with firmware quality gates and live Splunk dashboards, cutting field defects by 30%.",
    ],
    tech: ["Alexa Voice Service", "Firmware Quality Gates", "Splunk", "DSP / Acoustics"],
    logo: "/logos/amazon.png",
    accent: "border-orange-500/30 text-orange-700 dark:text-orange-400",
    badge: "Smart Hardware & Audio",
  },
  {
    id: "google",
    company: "Google Inc / Tech M",
    role: "Senior Test Engineer",
    period: "2016 – 2018",
    metricValue: "80%",
    metricLabel: "Manual Execution Hours Cut via Robotics",
    highlights: [
      "Designed and built a 3DOF robotic motion-stimulus fixture automating IMU sensor-fusion validation.",
      "Steered system validation & firmware release sign-off across Pixel 2, Pixel 3 and Daydream VR ecosystem.",
    ],
    tech: ["Robotics Fixture", "Arduino", "IMU Sensor-Fusion", "UART Bus", "Battery Profiling"],
    logo: "/logos/google.png",
    accent: "border-blue-500/30 text-blue-700 dark:text-blue-400",
    badge: "Pixel & VR Hardware",
  },
];

export function CareerImpactMatrix() {
  const [selectedRole, setSelectedRole] = useState(0);
  const active = FLAGSHIP_ROLES[selectedRole];

  return (
    <section
      className="px-6 lg:px-24 py-16 md:py-24 relative overflow-hidden"
      id="career-matrix"
      aria-label="Career Trajectory & Systems Impact Matrix"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 font-mono text-xs uppercase tracking-widest">
              <div className="h-px w-6 bg-violet-500/50" />
              18+ Years Systems Leadership
            </div>
            <h2 className="t-h2 text-ink">
              Career Trajectory &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400">
                Engineering Impact
              </span>
            </h2>
            <p className="t-lead text-ink-muted font-light max-w-2xl">
              Proven track record of architecting mission-critical firmware validation pipelines,
              hardware-in-the-loop test benches, and automated release gates for global tech leaders.
            </p>
          </div>

          <Link
            href="/experience"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink/5 border border-line/10 text-sm font-semibold text-ink hover:bg-ink/10 transition-all shrink-0 self-start md:self-auto"
          >
            Explore Full 18-Year Roadmap
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Interactive Role Switcher Pill Bar ── */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-line/10">
          {FLAGSHIP_ROLES.map((role, idx) => {
            const isSelected = idx === selectedRole;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(idx)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 shrink-0 text-left cursor-pointer",
                  isSelected
                    ? "bg-surface-card border-line/20 shadow-md ring-1 ring-violet-500/30"
                    : "bg-surface-card/40 border-line/10 hover:bg-surface-card/80 text-ink-muted hover:text-ink"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-ink leading-tight">{role.company}</span>
                  <span className="t-label text-ink-muted mt-0.5">{role.period}</span>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Active Role Showcase Card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <SpotlightCard className="p-6 sm:p-10 border-line/15 bg-gradient-to-br from-surface-card/90 via-surface-card/70 to-surface-card/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Col: Role Details & Highlights */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 t-label font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                      {active.badge}
                    </span>
                    <span className="t-caption text-ink-muted font-mono">{active.period}</span>
                  </div>

                  <div>
                    <h3 className="t-h3 text-ink mb-1">{active.role}</h3>
                    <p className="text-base font-bold text-violet-700 dark:text-violet-400">{active.company}</p>
                  </div>

                  <ul className="space-y-3">
                    {active.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" aria-hidden="true" />
                        <span className="t-body text-body leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {active.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-ink/[0.04] border border-line/10 t-caption font-mono text-ink-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Col: High-Impact Metric Hero Callout */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-ink/[0.04] to-ink/[0.01] border border-line/15 space-y-6">
                  <div className="space-y-2">
                    <span className="t-label font-mono uppercase text-ink-muted tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                      Measurable Business Impact
                    </span>
                    <div className="t-display text-ink leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-400">
                      {active.metricValue}
                    </div>
                    <p className="t-small text-ink-muted leading-snug">{active.metricLabel}</p>
                  </div>

                  <div className="pt-4 border-t border-line/10">
                    <Link
                      href={`/experience#${active.id}`}
                      className="group flex items-center justify-between text-xs font-bold text-ink hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <span>View full company deliverables</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>

        {/* ── ATS / Static HTML Crawler Fallback (Accessible & SEO-complete) ── */}
        <div className="sr-only">
          <h3>Complete Career History and Impact</h3>
          {experienceData.map((role) => (
            <div key={role.company + role.duration}>
              <h4>{role.role} at {role.company} ({role.duration})</h4>
              <p>{role.desc}</p>
              <ul>
                {role.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
