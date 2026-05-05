"use client";
import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,
                duration: 0.8,
                smoothWheel: true,
                wheelMultiplier: 1.0,
                touchMultiplier: 1.5,
                autoRaf: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}
