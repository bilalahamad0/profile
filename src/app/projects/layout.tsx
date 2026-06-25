import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList, projectsSchema } from "@/lib/structured-data";
import { projectsData } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production-grade open source projects — automation pipelines, IoT systems, AI-powered tools, and web applications by Bilal Ahamad.",
  alternates: { canonical: "/projects" },
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

const breadcrumb = breadcrumbList([
  { name: "Home", path: "" },
  { name: "Projects", path: "/projects" },
]);

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumb, projectsSchema(projectsData)]} />
      {children}
    </>
  );
}
