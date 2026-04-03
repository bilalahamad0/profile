"use client";

import { motion } from "framer-motion";
import { Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers } from "lucide-react";

const experienceData = [
  {
    role: "Test Lead / Sr Firmware QA",
    company: "Samsara",
    duration: "Dec 2023 - Present",
    desc: "Managing E2E test strategies for Dash cam IoT products on video-based safety platforms.",
    logo: "S"
  },
  {
    role: "Test Lead / Sr Test Automation",
    company: "Cruise",
    duration: "Oct 2022 - Jun 2023",
    desc: "Owned CPU/GPU System Computing test delivery. Developed automation achieving 75% test coverage.",
    logo: "C"
  },
  {
    role: "Infotainment Test Lead",
    company: "Rivian Automotive",
    duration: "Jun 2021 - Sep 2022",
    desc: "Led Infotainment QA for R1T/R1S. Designed QNX/Android firmware automation pipelines.",
    logo: "R"
  },
  {
    role: "Test Lead / Sr QA II",
    company: "Amazon Lab126",
    duration: "Jun 2018 - Jun 2021",
    desc: "Led Alexa IoT testing (Dash, Echo Auto, Echo Buds). Automated VUI tests saving $3M.",
    logo: "A"
  },
  {
    role: "Software Test Engineer",
    company: "Google (via Tech Mahindra)",
    duration: "Jan 2016 - Jun 2018",
    desc: "Standalone VR Controller systems testing. Built 3DOF robot arm for automated motion tracking.",
    logo: "G"
  }
];

const skills = [
  "Python", "JavaScript", "Node.js", "Jenkins", "AWS", "Appium", "Selenium", "QNX", "Android OS", "IoT", "Firmware", "Scrum"
];

const certs = [
  "Software Testing Foundations: Integrating AI into the Quality Process (2026)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
  "How to Master Your Executive Presence (2023)",
  "Project Management Foundations (2023)",
  "Scrum: Advanced (2021)",
  "ISTQB Foundation Level"
];

export function BentoGridV2() {
  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
        
        {/* Large Main Card: Experience Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 lg:col-span-2 row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            15+ Years Experience
          </h2>
          <div className="space-y-6 relative z-10">
            {experienceData.map((exp, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex flex-center items-center justify-center font-bold text-lg text-white/80 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                    {exp.logo}
                  </div>
                  {idx !== experienceData.length - 1 && <div className="w-px h-full bg-gradient-to-b from-white/20 to-transparent mt-2" />}
                </div>
                <div className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <span className="text-sm text-emerald-400 font-medium">{exp.company}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">{exp.duration}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-md">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medium Card: Core Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            Technical Arsenal
          </h2>
          <div className="flex flex-wrap gap-2 mt-auto">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300 hover:bg-white/10 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Metric Card 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-colors" />
          <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
          <div>
            <h3 className="text-4xl font-bold text-white mb-1">$5.1M+</h3>
            <p className="text-sm text-zinc-400">Testing Costs Saved</p>
          </div>
        </motion.div>

        {/* Metric Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1 glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-colors" />
          <Cpu className="w-8 h-8 text-blue-400 mb-4" />
          <div>
            <h3 className="text-4xl font-bold text-white mb-1">75%+</h3>
            <p className="text-sm text-zinc-400">Automation Coverage</p>
          </div>
        </motion.div>

        {/* Medium Card: Certifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 lg:col-span-2 glass-card rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-zinc-400" />
            Certifications & Training
          </h2>
          <ul className="space-y-3">
            {certs.map((cert, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Box className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">{cert}</span>
              </li>
            ))}
          </ul>
        </motion.div>

      </div>
    </section>
  );
}
