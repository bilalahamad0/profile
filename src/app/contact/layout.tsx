import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer. Open to senior engineering, QA leadership, and AI consulting opportunities.",
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

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bilalahamad.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://bilalahamad.com/contact" },
  ],
};

export default function ContactLayout({
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
