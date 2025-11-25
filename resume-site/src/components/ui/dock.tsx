"use client";

import { cn } from "@/lib/utils";
import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export interface DockProps {
    className?: string;
    children: React.ReactNode;
}

export const Dock = ({ className, children }: DockProps) => {
    return (
        <div
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-neutral-900/50 px-4 pb-3 backdrop-blur-2xl border border-white/10 shadow-2xl",
                className
            )}
        >
            {children}
        </div>
    );
};

export const DockIcon = ({
    mouseX,
    children,
    href,
    label,
    className,
}: {
    mouseX: MotionValue;
    children: React.ReactNode;
    href?: string;
    label?: string;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const content = (
        <motion.div
            ref={ref}
            style={{ width }}
            className={cn(
                "aspect-square w-10 rounded-2xl bg-white/5 flex items-center justify-center relative group cursor-pointer hover:bg-white/10 transition-colors border border-white/5",
                className
            )}
        >
            {children}
            {label && (
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 w-auto px-3 py-1 rounded-lg bg-neutral-900/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 backdrop-blur-md">
                    {label}
                </span>
            )}
        </motion.div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
};
