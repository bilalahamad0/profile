"use client";

import dynamic from "next/dynamic";

const NavDock = dynamic(() => import("./nav-dock").then((mod) => mod.NavDock), {
    ssr: false,
});

export function NavDockWrapper() {
    return <NavDock />;
}
