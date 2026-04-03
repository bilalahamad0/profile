"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers, 
  ChevronDown, ChevronUp, Code2, Database, Wrench, Smartphone, Server, Github, GitFork, Star,
  MessageSquareQuote, Linkedin, ExternalLink
} from "lucide-react";

// Experience array with `invertLogo` property to explicitly handle black logos in dark mode
const experienceData = [
  { role: "Test Lead / Sr Firmware QA", company: "Samsara", duration: "Dec 2023 - Present", desc: "E2E test strategies for Dash cam IoT products on video-based safety platforms.", file: "/logos/samsara.png", faang: false, invertLogo: true },
  { role: "Test Lead / Sr Test Automation", company: "Cruise", duration: "Oct 2022 - Jun 2023", desc: "CPU/GPU System Computing test delivery. Developed automation achieving 75% test coverage.", file: "/logos/cruise.png", faang: false, invertLogo: false },
  { role: "Infotainment Test Lead", company: "Rivian Automotive", duration: "Jun 2021 - Sep 2022", desc: "Infotainment QA for R1T/R1S. Designed QNX/Android firmware automation pipelines.", file: "/logos/rivian.png", faang: false, invertLogo: false },
  { role: "Test Lead / Sr QA II", company: "Amazon Lab126", duration: "Jun 2018 - Jun 2021", desc: "Alexa IoT testing (Dash, Echo Auto, Echo Buds). Automated VUI tests saving $3M.", file: "/logos/amazon.png", faang: true, invertLogo: false },
  { role: "Software Test Engineer", company: "Google (Tech Mahindra)", duration: "Jan 2016 - Jun 2018", desc: "Standalone VR Controller systems testing. Built 3DOF robot arm for automated motion tracking.", file: "/logos/google.png", faang: true, invertLogo: false },
  { role: "Test Engineer", company: "Cisco (Cognizant)", duration: "Sep 2015 - Jan 2016", desc: "Python-based framework for Set-top-Box Video Streaming automation.", file: "/logos/cisco.png", faang: false, invertLogo: false },
  { role: "Radio Validation Engineer", company: "Wistron Mobile", duration: "Dec 2014 - Sep 2015", desc: "Pre-certification and Interoperability testing on Android/BlackBerry handsets.", file: "/logos/wistron.png", faang: false, invertLogo: true },
  { role: "Sr Software Engineer in Test", company: "Motorola Mobility", duration: "Oct 2009 - Dec 2014", desc: "Bluetooth automation framework for mobile handsets showcasing $2.1M savings.", file: "/logos/motorola.png", faang: false, invertLogo: false },
  { role: "Test Engineer", company: "Luminous Infoways", duration: "Oct 2008 - Sep 2009", desc: "Web application deployment modules, feature integration.", file: "/logos/luminous.png", faang: false, invertLogo: false },
];

const skills = [
  { name: "Python", icon: Code2, color: "text-blue-400" },
  { name: "JavaScript", icon: Code2, color: "text-amber-400" },
  { name: "Node.js", icon: Server, color: "text-green-500" },
  { name: "Jenkins", icon: Wrench, color: "text-red-400" },
  { name: "AWS", icon: Cloud, color: "text-orange-400" },
  { name: "Appium", icon: Smartphone, color: "text-purple-400" },
  { name: "Selenium", icon: Database, color: "text-emerald-400" },
  { name: "QNX", icon: Settings, color: "text-zinc-300" },
  { name: "Android OS", icon: Smartphone, color: "text-green-400" },
  { name: "IoT/Firmware", icon: Cpu, color: "text-blue-300" },
  { name: "Scrum", icon: Layers, color: "text-blue-500" }
];

const certs = [
  "Software Testing Foundations: Integrating AI into Quality Process (2026)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
  "How to Master Your Executive Presence (2023)",
  "Project Management Foundations (2023)",
  "Scrum: Advanced (2021)",
  "ISTQB Foundation Level"
];

const recommendations = [
  { name: "Sai Abhishek / MBA", title: "Project Manager | PMP | Scrum Master", review: "Bilal is an extremely hardworking and dedicated worker, he gives him 100% to all that he does. It was wonderful working with him in a brief stint way back in 2012, however, he has always kept in touch and has ensured that relations built stay forever. I wish him luck in all his future endeavours." },
  { name: "Nimish Choudhary", title: "Senior Manager | Lead Digital Engineer", review: "I have worked with Bilal in Lnt where we both were in mysore office for some time. Bilal is a very in-tellectual person. He is born with gift of adapting to new technology quickly, his hunger to learn new things and implementing them, has let too many new ways in which a technology can be utilized. Apart from being a technically strong he is a good person to work with. His discussion points are strong and the way he presents them is even better." },
];

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
}

export function BentoGridV2() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  
  // Dynamically calculate years of experience from 2008
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - 2008;

  // Render 6 items initially to fully cover the height without large empty gaps
  const visibleExperiences = isExpanded ? experienceData : experienceData.slice(0, 6); 

  useEffect(() => {
    fetch("https://api.github.com/users/bilalahamad0/repos?sort=updated&per_page=3")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data.slice(0, 3)); // Increased mapped array to 3 exactly as requested
      })
      .catch(console.error);
  }, []);

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN STRUCTURE */}
        {/* Timeline Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 lg:row-span-4 glass-card rounded-3xl p-8 relative flex flex-col transition-all duration-500 h-full"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Activity className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            {yearsOfExperience}+ Years Experience
          </h2>
          <div className="space-y-6 relative z-10 flex-grow">
            <AnimatePresence>
              {visibleExperiences.map((exp, idx) => (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  key={exp.company + idx} 
                  className="flex gap-4 group overflow-hidden"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center transition-colors border overflow-hidden p-2.5
                      ${exp.faang 
                        ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                        : 'bg-white/5 border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50'
                      }`}
                    >
                      <img 
                        src={exp.file} 
                        alt={exp.company} 
                        className={`w-full h-full object-contain ${exp.invertLogo ? 'filter invert brightness-150' : ''}`} 
                        onError={(e) => (e.currentTarget.style.display = 'none')}  
                      />
                    </div>
                    {/* Hide timeline connector on the absolute last item shown */}
                    {idx !== visibleExperiences.length - 1 && <div className="w-px h-full bg-gradient-to-b from-zinc-600 to-transparent mt-2 pointer-events-none" />}
                  </div>
                  <div className="pb-4 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h3 className="text-lg font-semibold text-white leading-tight">{exp.role}</h3>
                      <span className={`font-medium tracking-tight ${exp.faang ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {exp.company}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 mt-1">{exp.duration}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-md">{exp.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {experienceData.length > 6 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 flex items-center justify-center w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors gap-2 text-sm font-medium z-20 relative"
            >
              {isExpanded ? (
                <><ChevronUp className="w-4 h-4" /> Collapse Timeline</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> View All {experienceData.length} Experiences</>
              )}
            </button>
          )}
        </motion.div>


        {/* RIGHT COLUMN STRUCTURE */}
        {/* 1. Technical Arsenal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col justify-start"
        >
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            Technical Arsenal
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span key={skill.name} className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-default group">
                <skill.icon className={`w-4 h-4 ${skill.color} group-hover:scale-110 transition-transform`} />
                {skill.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 2. Metrics Segment (Split into 2 columns on large screens) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 glass-card rounded-3xl p-8 flex flex-col justify-start relative group overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-colors pointer-events-none" />
          <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
          <h3 className="text-4xl font-extrabold text-white tracking-tight mb-1">$5.1M+</h3>
          <p className="text-sm font-medium text-zinc-400">Testing Costs Saved</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1 glass-card rounded-3xl p-8 flex flex-col justify-start relative group overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-colors pointer-events-none" />
          <Cpu className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-4xl font-extrabold text-white tracking-tight mb-1">75%+</h3>
          <p className="text-sm font-medium text-zinc-400">Automation Coverage</p>
        </motion.div>

        {/* 3. Certifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <Settings className="w-6 h-6 text-zinc-400" />
            Certifications
          </h2>
          <ul className="space-y-3.5">
            {certs.map((cert, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Box className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-sm text-zinc-300 leading-snug">{cert}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 4. GitHub Projects */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col h-full"
        >
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <Github className="w-6 h-6 text-zinc-100" />
            Recent Open Source
          </h2>
          <div className="flex flex-col gap-3 flex-grow">
            {repos.length > 0 ? repos.map((repo) => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="block p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors truncate pr-4">{repo.name}</h4>
                  <div className="flex gap-3 text-xs text-zinc-500 font-medium shrink-0">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-zinc-600" /> {repo.stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1">{repo.description || "No description provided."}</p>
              </a>
            )) : (
              <>
                <div className="flex items-center justify-center p-8 text-zinc-500 text-sm border border-white/5 rounded-xl border-dashed animate-pulse">
                  Fetching repositories...
                </div>
                <div className="flex items-center justify-center p-8 text-zinc-500/50 text-sm border border-white/5 rounded-xl border-dashed"></div>
                <div className="flex items-center justify-center p-8 text-zinc-500/30 text-sm border border-white/5 rounded-xl border-dashed"></div>
              </>
            )}
          </div>
        </motion.div>


        {/* BOTTOM ROW STRUCTURE: LinkedIn Modules spanning the full width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col"
        >
           <Linkedin className="absolute -right-4 -bottom-4 w-40 h-40 text-blue-500/10 pointer-events-none" />
           <div className="flex items-center justify-between mb-5 relative z-10">
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Linkedin className="w-6 h-6 text-[#0A66C2]" fill="currentColor" />
              LinkedIn Activity
             </h2>
             <a href="https://www.linkedin.com/in/bilalahamad/recent-activity/all/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
               <span className="hidden sm:inline">View All Activity</span> <ExternalLink className="w-3 h-3" />
             </a>
           </div>
          
          <div className="flex flex-col gap-4 relative z-10 flex-grow">
             <a href="https://www.linkedin.com/in/bilalahamad/recent-activity/all/" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors block">
               <h4 className="text-sm font-medium text-white mb-2">Engaging with the QA & IoT Community</h4>
               <p className="text-xs text-zinc-400 leading-relaxed mb-3">Actively participating in architectural discussions covering Automation, AI in Testing, and autonomous vehicle performance pipelines.</p>
               <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">Expand thread on LinkedIn &rarr;</span>
             </a>
             <a href="https://www.linkedin.com/in/bilalahamad/recent-activity/all/" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors block">
               <h4 className="text-sm font-medium text-white mb-2 line-clamp-1">Continuing Education & Certifications</h4>
               <p className="text-xs text-zinc-500 leading-relaxed">Shared updates regarding recent implementations of large scale infrastructure testing and AI Copilot integration workflow strategies.</p>
             </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8 relative flex flex-col"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <MessageSquareQuote className="w-24 h-24" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2 relative z-10">
            <MessageSquareQuote className="w-6 h-6 text-emerald-400" />
            Recommendations
          </h2>
          <div className="flex flex-col gap-4 relative z-10 flex-grow justify-between">
            {recommendations.map((rec, i) => (
             <div key={i} className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
               <p className="text-sm text-emerald-100/80 leading-relaxed italic mb-4 font-light">"{rec.review}"</p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/30 to-blue-400/30 flex items-center justify-center shrink-0 border border-emerald-500/30">
                   <UserIconPlaceholder />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-zinc-200">{rec.name}</span>
                   <span className="text-xs text-emerald-400/70">{rec.title}</span>
                 </div>
               </div>
             </div>
            ))}
          </div>
        </motion.div>

        {/* NEW FULL-WIDTH SEGMENT: Google Developer Profile & I/O Album */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-4 glass-card rounded-3xl p-8 lg:p-12 relative flex flex-col lg:flex-row gap-8 items-center justify-between overflow-hidden"
        >
          {/* Subtle Blue Glow specific to Google section */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          
          {/* Text Info */}
          <div className="flex flex-col flex-1 z-10 w-full lg:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <img src="/logos/google.png" alt="Google" className="w-5 h-5 object-contain" />
              </div>
              Google Developer Profile
            </h2>
            <a href="https://developers.google.com/profile/u/bahamad" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-400 font-medium mb-6 font-mono text-sm underline underline-offset-4 decoration-zinc-700 inline-block w-fit transition-colors">
              g.dev/bahamad
            </a>
            
            <p className="text-sm text-zinc-300 leading-relaxed max-w-lg mb-8">
              A recognized participant in the Google Developer Ecosystem. Attended multiple Google I/O flagship events in Mountain View, California, earning exclusive badges for technical integrations, Codelabs completions, and Android Platform Tool mastery.
            </p>

            {/* Badges Layout */}
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">I/O Attendance & Badges</h3>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">I/O 2026 Registered</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">I/O 2025</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">I/O 2024</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">I/O 2023 Attendee</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">I/O 2022 Attendee</span>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">8+ Developer Badges</span>
            </div>
          </div>

          {/* Google I/O Distinct Horizontal Timeline Album */}
          <div className="w-full mt-8 lg:mt-12 z-10 box-border border-t border-white/5 pt-8">
             <div className="flex flex-row overflow-x-auto gap-4 snap-x snap-mandatory pb-6 px-1 custom-scrollbar">
               
               {/* 2026 */}
               <a href="https://developers.google.com/profile/badges/events/io/2026/registered" target="_blank" rel="noreferrer" className="relative w-40 h-52 min-w-[10rem] flex-shrink-0 rounded-2xl border border-blue-500/20 bg-blue-500/5 snap-center group hover:bg-blue-500/10 transition-colors flex items-center justify-center overflow-hidden">
                 <div className="absolute top-4 left-4 text-xs font-bold text-blue-400/50 uppercase tracking-widest group-hover:text-blue-400 transition-colors">2026</div>
                 <img src="/io/badge_2026.svg" alt="I/O 2026 Badge" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-xl" />
               </a>

               {/* 2025 (Black T-shirt) */}
               <a href="https://developers.google.com/profile/badges/events/io/2025/registered" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border-4 border-zinc-800 bg-zinc-900 snap-center group shadow-xl overflow-hidden">
                 <img src="/io/1.jpg" alt="I/O 2025 Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                 <div className="absolute top-4 left-4 text-[10px] font-black text-white/90 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-emerald-400 z-20">2025 Live</div>
                 
                 {/* Real SVG Corner Overlap */}
                 <div className="absolute -bottom-2 -right-2 w-20 h-20 z-20 group-hover:scale-110 transition-transform drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                   <img src="/io/badge_2025.svg" alt="2025 Badge" className="w-full h-full object-contain" />
                 </div>
               </a>

               {/* 2024 (Brown Jacket) */}
               <a href="https://developers.google.com/profile/badges/events/io/2024/registered" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border-4 border-zinc-800 bg-zinc-900 snap-center group shadow-xl overflow-hidden">
                 <img src="/io/2.jpg" alt="I/O 2024 Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                 <div className="absolute top-4 left-4 text-[10px] font-black text-white/90 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-blue-400 z-20">2024 Live</div>
                 
                 {/* Real SVG Corner Overlap */}
                 <div className="absolute -bottom-2 -right-2 w-20 h-20 z-20 group-hover:scale-110 transition-transform drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                   <img src="/io/badge_2024.svg" alt="2024 Badge" className="w-full h-full object-contain" />
                 </div>
               </a>

               {/* 2023 */}
               <a href="https://developers.google.com/profile/badges/events/io/2023/attendee" target="_blank" rel="noreferrer" className="relative w-40 h-52 min-w-[10rem] flex-shrink-0 rounded-2xl border border-white/5 bg-white/5 snap-center group hover:bg-white/10 transition-colors flex items-center justify-center self-end overflow-hidden">
                 <div className="absolute top-4 left-4 text-xs font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">2023</div>
                 <img src="/io/badge_2023.svg" alt="I/O 2023 Badge" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform opacity-90 group-hover:opacity-100" />
               </a>

               {/* 2022 */}
               <a href="https://developers.google.com/profile/badges/events/io/2022/attendee" target="_blank" rel="noreferrer" className="relative w-40 h-52 min-w-[10rem] flex-shrink-0 rounded-2xl border border-white/5 bg-white/5 snap-center group hover:bg-white/10 transition-colors flex items-center justify-center self-end overflow-hidden">
                 <div className="absolute top-4 left-4 text-xs font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">2022</div>
                 <img src="/io/badge_2022.svg" alt="I/O 2022 Badge" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform opacity-90 group-hover:opacity-100" />
               </a>

             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function UserIconPlaceholder() {
  return (
    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
  );
}
