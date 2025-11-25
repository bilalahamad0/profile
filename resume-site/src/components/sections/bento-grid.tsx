"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { Cpu, Globe, Layers, Zap, Database } from "lucide-react";

export function BentoGridSection() {
    return (
        <section id="skills" className="py-32 px-4 max-w-7xl mx-auto">
            <div className="mb-16 text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
                    Expertise & Skills
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
                    A comprehensive toolkit for building scalable, high-performance systems.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
                <BentoCard
                    title="Technical Leadership"
                    description="Spearheading QA strategies for IoT, Automotive, and Hardware products. Managing teams, defining roadmaps, and driving innovation from concept to launch."
                    icon={<Layers className="h-8 w-8" />}
                    className="md:col-span-2 md:row-span-2 min-h-[400px]"
                    graphic={
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-50" />
                    }
                />
                <BentoCard
                    title="Test Automation"
                    description="Python, Selenium, Appium, Jenkins. Reducing regression cycles by 50%."
                    icon={<Zap className="h-8 w-8" />}
                    className="md:col-span-1"
                    graphic={
                        <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 via-transparent to-transparent opacity-50" />
                    }
                />
                <BentoCard
                    title="IoT & Hardware"
                    description="Wireshark, CAN Analyzers, Raspberry Pi, Arduino, RTOS."
                    icon={<Cpu className="h-8 w-8" />}
                    className="md:col-span-1"
                />
                <BentoCard
                    title="Data & Analytics"
                    description="Splunk, Datadog, Grafana, Kibana. Visualizing quality metrics."
                    icon={<Database className="h-8 w-8" />}
                    className="md:col-span-1"
                />
                <BentoCard
                    title="Systems Engineering"
                    description="Deep expertise in Android, iOS, QNX, Linux, and Unix environments. Ensuring seamless integration across complex hardware-software stacks."
                    icon={<Globe className="h-8 w-8" />}
                    className="md:col-span-2"
                    graphic={
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent opacity-50" />
                    }
                />
            </div>
        </section>
    );
}
