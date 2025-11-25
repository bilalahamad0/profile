"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { MouseEvent } from "react";
import { Hero3DWrapper } from "@/components/ui/hero-3d-wrapper";

export function Hero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 pt-20 group bg-background"
        >
            <Hero3DWrapper />
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
                }}
            />

            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#00000033_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-5xl mx-auto space-y-8 relative z-10"
            >
                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-sm md:text-base font-medium tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase"
                    >
                        Technical QA Lead & Manager
                    </motion.h2>

                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-foreground pb-2">
                        Bilal Ahamad
                    </h1>

                    <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                        Architecting quality for the future of <span className="text-foreground font-medium">IoT</span>, <span className="text-foreground font-medium">Automotive</span>, and <span className="text-foreground font-medium">Hardware</span>.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                    <MagneticButton>
                        <Link href="#projects" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-foreground text-background px-10 font-medium transition-all duration-300 hover:bg-foreground/90 hover:scale-105">
                            <span className="mr-2 text-lg">View Work</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </MagneticButton>

                    <MagneticButton>
                        <a href="/docs/Bilal_Ahamad_Resume.pdf" download className="group inline-flex h-14 items-center justify-center rounded-full border border-border bg-background/5 px-10 font-medium text-foreground shadow-sm transition-all hover:bg-foreground/5 hover:scale-105 backdrop-blur-md">
                            <Download className="mr-2 h-5 w-5" />
                            <span className="text-lg">Resume</span>
                        </a>
                    </MagneticButton>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-foreground/50 to-transparent animate-pulse"></div>
            </motion.div>
        </section>
    );
}
