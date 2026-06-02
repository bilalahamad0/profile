import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "The architecture, system design and automated workflows behind bilalahamad.com — Next.js 16 App Router, server-rendered for ATS, a single typed source of truth, edge-cached API routes, and a blog-to-LinkedIn publishing pipeline.",
  keywords: [
    "Bilal Ahamad",
    "portfolio architecture",
    "Next.js 16 App Router",
    "React Server Components",
    "system design",
    "SSR for ATS",
    "Vercel edge",
    "CDN caching",
    "TypeScript strict",
    "Tailwind CSS v4",
    "Framer Motion",
    "MDX blog pipeline",
    "blog to LinkedIn automation",
    "CI/CD quality gates",
    "software architecture engineer",
  ],
  openGraph: {
    type: "website",
    title: "Architecture | Bilal Ahamad",
    description:
      "A live look at how bilalahamad.com is engineered — layered server-first architecture, request lifecycle, automated content pipelines, and the system-design principles behind it.",
    url: "https://bilalahamad.com/architecture",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Bilal Ahamad — System Architecture" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Architecture | Bilal Ahamad",
    description:
      "How bilalahamad.com is engineered — architecture, system design and automated workflows, animated.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/architecture" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bilalahamad.com" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Architecture",
      item: "https://bilalahamad.com/architecture",
    },
  ],
};

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
