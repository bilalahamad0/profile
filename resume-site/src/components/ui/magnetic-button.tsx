"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export const MagneticButton = ({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { mass: 0.1, stiffness: 150, damping: 12 });
    const ySpring = useSpring(y, { mass: 0.1, stiffness: 150, damping: 12 });

    const rectRef = useRef<DOMRect | null>(null);

    const handleMouseEnter = () => {
        if (ref.current) {
            rectRef.current = ref.current.getBoundingClientRect();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!rectRef.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = rectRef.current;
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.3);
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        rectRef.current = null;
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            onClick={onClick}
            className={className}
        >
            {children}
        </motion.div>
    );
};
