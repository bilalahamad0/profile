"use client";
import { useState, useEffect } from "react";
import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Detect touch capability
        setIsTouchDevice(
            'ontouchstart' in window || 
            navigator.maxTouchPoints > 0
        );
    }, []);

    // Return native scroll for touch devices (Mobile/Tablets)
    if (isTouchDevice) {
        return <>{children}</>;
    }

    return (
        <ReactLenis 
            root 
            options={{ 
                lerp: 0.12, 
                duration: 0.8, 
                smoothWheel: true, 
                wheelMultiplier: 1.0, 
                autoRaf: true
            }}
        >
            {children}
        </ReactLenis>
    );
}
