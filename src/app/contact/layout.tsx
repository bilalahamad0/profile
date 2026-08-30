import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Bilal Ahamad — Systems Validation Architect, embedded firmware and safety-critical systems. Open to senior engineering, QA leadership, and AI consulting opportunities.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact | Bilal Ahamad",
    description:
      "Get in touch with Bilal Ahamad — open to senior engineering, QA leadership, and AI consulting opportunities.",
    url: "https://bilalahamad.com/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Bilal Ahamad" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Bilal Ahamad",
    description:
      "Get in touch with Bilal Ahamad — open to senior engineering, QA leadership, and AI consulting opportunities.",
    images: ["/og-image.png"],
  },
};

const breadcrumb = breadcrumbList([
  { name: "Home", path: "" },
  { name: "Contact", path: "/contact" },
]);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
