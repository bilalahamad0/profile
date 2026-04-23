import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production-grade open source projects — automation pipelines, IoT systems, AI-powered tools, and web applications by Bilal Ahamad.",
  openGraph: {
    type: "website",
    title: "Projects | Bilal Ahamad",
    description:
      "Production-grade open source projects — automation pipelines, IoT systems, AI-powered tools, and web applications by Bilal Ahamad.",
    url: "https://bilalahamad.com/projects",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bilal Ahamad — Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Bilal Ahamad",
    description:
      "Production-grade open source projects — automation pipelines, IoT systems, AI-powered tools, and web applications by Bilal Ahamad.",
    images: ["/og-image.png"],
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bilalahamad.com" },
    { "@type": "ListItem", position: 2, name: "Projects", item: "https://bilalahamad.com/projects" },
  ],
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
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
