import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications",
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
