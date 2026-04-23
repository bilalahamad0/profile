import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Professional certifications of Bilal Ahamad — ISTQB CTFL, AI/ML testing, leadership, and Scrum. 18+ years of continuous learning in firmware quality and test automation.",
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

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bilalahamad.com" },
    { "@type": "ListItem", position: 2, name: "Certifications", item: "https://bilalahamad.com/certifications" },
  ],
};

export default function CertificationsLayout({
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
