"use client";

import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true, wheelMultiplier: 1.5, touchMultiplier: 2 }}>
            {children}
        </ReactLenis>
    );
}
