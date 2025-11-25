"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
    {
        title: "Resume Portfolio",
        category: "Web Development",
        description: "A premium, interactive portfolio built with Next.js, Tailwind CSS, and Framer Motion. Features liquid-glass aesthetics and smooth scroll animations.",
        gradient: "from-blue-500 to-cyan-500",
        link: "#",
    },
    {
        title: "IoT Automation Framework",
        category: "Automation",
        description: "Custom Python framework for testing IoT devices, reducing regression time by 50%. Integrated with Jenkins for CI/CD.",
        gradient: "from-purple-500 to-pink-500",
        link: "#",
    },
    {
        title: "Vehicle System Integration",
        category: "Automotive",
        description: "End-to-end testing strategy for Rivian R1T/R1S. Validated OTA updates, navigation, and connectivity features.",
        gradient: "from-emerald-500 to-green-500",
        link: "#",
    },
];

export function ProjectsSection() {
    return (
        <section id="projects" className="py-32 px-4 max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-20 text-center text-foreground">
                Featured Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PROJECTS.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative h-[450px] rounded-3xl overflow-hidden bg-card/50 border border-border backdrop-blur-xl hover:border-foreground/20 transition-all duration-300 shadow-2xl"
                    >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                        {/* Content */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                                <span className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-3 block tracking-wider uppercase">
                                    {project.category}
                                </span>
                                <h3 className="text-3xl font-bold text-card-foreground mb-4 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground line-clamp-3 mb-8 text-lg font-light leading-relaxed">
                                    {project.description}
                                </p>

                                <a
                                    href={project.link}
                                    className="inline-flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all group/link"
                                >
                                    View Project
                                    <ArrowUpRight className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover/link:text-foreground transition-colors" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
