import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bilal Ahamad — Lead Embedded Firmware & Systems QA",
    short_name: "Bilal Ahamad",
    description:
      "Portfolio of Bilal Ahamad — 18+ years engineering quality for Amazon, Google, Rivian, Cruise & Samsara.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
