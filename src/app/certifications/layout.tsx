import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList, certificationsSchema } from "@/lib/structured-data";
import { certifications } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Professional certifications of Bilal Ahamad — Google Project Management, ISTQB CTFL, AI/ML testing, leadership & Scrum. 18+ years advancing firmware quality & test automation.",
  alternates: { canonical: "/certifications" },
  openGraph: {
    type: "website",
    title: "Certifications | Bilal Ahamad",
    description:
      "Professional certifications of Bilal Ahamad — ISTQB CTFL, AI/ML testing, leadership, and Scrum.",
    url: "https://bilalahamad.com/certifications",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bilal Ahamad — Certifications" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certifications | Bilal Ahamad",
    description:
      "Professional certifications of Bilal Ahamad — ISTQB CTFL, AI/ML testing, leadership, and Scrum.",
    images: ["/og-image.png"],
  },
};

const breadcrumb = breadcrumbList([
  { name: "Home", path: "" },
  { name: "Certifications", path: "/certifications" },
]);

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[breadcrumb, certificationsSchema(certifications)]} />
      {children}
    </>
  );
}
