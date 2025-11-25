"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface BentoCardProps {
    title: string;
    description: string;
    graphic?: ReactNode;
    icon?: ReactNode;
    className?: string;
    href?: string;
    cta?: string;
}

export function BentoCard({
    title,
    description,
    graphic,
    icon,
    className,
    href,
    cta = "Learn More",
}: BentoCardProps) {
    return (
        <div
            className={cn(
                "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl bg-card/50 p-6 shadow-2xl backdrop-blur-xl border border-border transition-all duration-300 hover:border-foreground/10 hover:bg-card/80",
                className
            )}
        >
            <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 group-hover:-translate-y-2">
                {icon && (
                    <div className="mb-4 h-12 w-12 origin-left transform-gpu text-blue-500 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-blue-400 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <h3 className="text-xl font-semibold text-card-foreground">
                    {title}
                </h3>
                <p className="max-w-lg text-muted-foreground">
                    {description}
                </p>
            </div>

            {graphic && (
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 transition-opacity duration-300 group-hover:opacity-40">
                    {graphic}
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-foreground/[.02]" />

            {href && (
                <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="pointer-events-auto">
                        <a
                            href={href}
                            className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                        >
                            {cta}
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
