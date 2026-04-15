import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production-grade open source projects — automation pipelines, IoT systems, AI-powered tools, and web applications by Bilal Ahamad.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
