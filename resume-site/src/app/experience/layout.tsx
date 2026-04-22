import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
