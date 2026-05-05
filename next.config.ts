import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // Image optimisation
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "bilalahamad0.github.io" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },

  async redirects() {
    return [
      {
        source: "/blog/adhan-caster-story",
        destination: "/blog/media-caster-story",
        permanent: true,
      },
    ];
  },

  // Static asset + API caching headers
  async headers() {
    return [
      {
        // All Next.js static assets — very long cache, fingerprinted by Webpack
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Public assets — logo PNGs, PDFs, etc.
        source: "/((?!_next).*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|pdf|woff2?))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        // Cached API routes — repos, badges
        source: "/api/(repos|badges)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=7200" },
        ],
      },
      {
        // Global Security Headers
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://bilalahamad0.github.io https://www.youtube.com; media-src 'self' https: data: blob:;"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          }
        ]
      },
    ];
  },
};

export default nextConfig;
