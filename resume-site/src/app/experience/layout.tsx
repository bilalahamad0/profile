import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience & Career Timeline",
  description:
    "18+ years of firmware quality, test automation, and IoT engineering at Amazon, Google, Rivian, Cruise, and Samsara. Full career timeline of Bilal Ahamad.",
  keywords: [
    "Bilal Ahamad experience", "firmware quality lead", "test automation engineer",
    "Amazon Lab126 QA", "Google VR testing", "Rivian infotainment", "Cruise automation",
    "Samsara IoT", "senior QA engineer", "embedded systems testing",
  ],
  openGraph: {
    title: "Experience & Career Timeline | Bilal Ahamad",
    description:
      "18+ years of firmware quality, test automation, and IoT engineering at Amazon, Google, Rivian, Cruise, and Samsara.",
    url: "https://bilalahamad.com/experience",
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
