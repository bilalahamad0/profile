"use client";
import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,
                duration: 1.0,
                smoothWheel: true,
                wheelMultiplier: 1.0,
                touchMultiplier: 0,
                autoRaf: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}
