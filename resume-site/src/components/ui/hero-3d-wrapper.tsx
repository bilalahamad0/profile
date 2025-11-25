"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./hero-3d").then((mod) => mod.Hero3D), {
    ssr: false,
    loading: () => <div className="absolute inset-0 -z-5 opacity-0" />,
});

export function Hero3DWrapper() {
    return <Hero3D />;
}
