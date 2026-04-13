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
                lerp: 0.1, 
                duration: 1.2, 
                smoothWheel: true, 
                wheelMultiplier: 1.2, 
                autoRaf: true
            }}
        >
            {children}
        </ReactLenis>
    );
}
