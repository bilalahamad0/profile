"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const EXPERIENCE = [
    {
        company: "Samsara Inc",
        role: "Senior Test Lead",
        location: "San Francisco, CA",
        date: "Dec 2023 - Present",
        description: [
            "Spearheaded system tests for IoT Dash Cam product line with AI/ML video analytics.",
            "Developed automation pipelines improving release cadence and cutting regression by 50%.",
        ],
    },
    {
        company: "Cruise LLC",
        role: "Test Automation Lead",
        location: "San Francisco, CA",
        date: "Oct 2022 - Jun 2023",
        description: [
            "Managed vehicle computational systems testing and firmware releases.",
            "Designed frameworks for CPU/GPU integration, network reliability and V2X testing.",
        ],
    },
    {
        company: "Rivian Automotive LLC",
        role: "Infotainment Test Lead",
        location: "Palo Alto, CA",
        date: "Jun 2021 - Sep 2022",
        description: [
            "Directed end-to-end testing strategy for R1T, R1S and Fleet models.",
            "Built automation for OTA, connectivity, navigation and vehicle system integration.",
        ],
    },
    {
        company: "Amazon Lab126",
        role: "Senior QA Engineer II & Technical Lead",
        location: "Sunnyvale, CA",
        date: "Jun 2018 - Jun 2021",
        description: [
            "Managed QA for Echo Buds, Echo Auto and Dash Button from concept to launch.",
            "Developed automation for voice, ANC, connectivity; reduced manual effort by 80%.",
            "Established CI/CD pipeline across 50+ devices resulting in 30% fewer post-launch issues.",
        ],
    },
    {
        company: "Tech Mahindra / Google Inc",
        role: "Software Test Engineer",
        location: "Mountain View, CA",
        date: "Jan 2016 - Jun 2018",
        description: [
            "Led system testing for Google's VR controllers powering Daydream View.",
            "Ensured KPI integrity and benchmarking for commercialization readiness.",
        ],
    },
];

export function ExperienceSection() {
    return (
        <section id="experience" className="py-32 px-4 max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-20 text-center text-foreground">
                Work Experience
            </h2>

            <div className="relative space-y-16">
                {/* Timeline Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent md:-translate-x-1/2"></div>

                {EXPERIENCE.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        {/* Timeline Dot */}
                        <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-background -translate-x-1/2 mt-1.5 z-10 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

                        {/* Content Card */}
                        <div className="ml-12 md:ml-0 md:w-1/2 p-8 rounded-3xl bg-card/50 border border-border backdrop-blur-xl hover:bg-card/80 transition-all duration-300 hover:border-foreground/20 shadow-2xl">
                            <h3 className="text-2xl font-bold text-card-foreground mb-1">{exp.role}</h3>
                            <h4 className="text-lg text-blue-500 dark:text-blue-400 font-medium mb-4">{exp.company}</h4>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>{exp.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{exp.location}</span>
                                </div>
                            </div>

                            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed marker:text-blue-500">
                                {exp.description.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Empty space for timeline alignment */}
                        <div className="hidden md:block md:w-1/2"></div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
