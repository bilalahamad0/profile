import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production-grade open source projects — automation pipelines, IoT systems, AI-powered tools, and web applications by Bilal Ahamad.",
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
