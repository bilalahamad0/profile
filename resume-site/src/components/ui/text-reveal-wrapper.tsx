"use client";

import dynamic from "next/dynamic";

const TextReveal = dynamic(() => import("./text-reveal").then((mod) => mod.TextReveal), {
    ssr: false,
});

export function TextRevealWrapper({ text }: { text: string }) {
    return <TextReveal text={text} />;
}
