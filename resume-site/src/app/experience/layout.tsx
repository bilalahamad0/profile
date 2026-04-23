import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience & Career Timeline",
  description:
    "18+ years of firmware quality, test automation, and IoT engineering at Amazon, Google, Rivian, Cruise, and Samsara. Full career timeline of Bilal Ahamad.",
  keywords: [
    // Personal brand
    "Bilal Ahamad", "Bilal Ahamad engineer", "bilalahamad.com",

    // Seniority & role
    "senior firmware quality lead", "staff QA engineer",
    "lead embedded systems engineer", "systems QA architect",
    "founding system architect", "technical QA lead",
    "principal QA engineer", "QA director",

    // Core competencies (Final 10)
    "strategic test leadership", "test automation architecture",
    "end-to-end quality ownership", "test infrastructure quality platforms",
    "firmware embedded systems validation", "AI ML product quality",
    "functional safety compliance", "release governance sign-off",
    "NPI V1 innovation bringup", "cross-functional program leadership",

    // Core discipline
    "firmware validation", "embedded systems testing",
    "systems integration testing", "hardware-in-the-loop testing",
    "HIL SIL validation", "CI/CD quality gates",
    "defect governance", "go no-go decision authority",
    "quality KPI dashboards", "release readiness",

    // Automotive & safety
    "automotive firmware engineer", "V2X firmware validation",
    "vehicle compute automation", "ASIL-D compliance",
    "ISO 26262 functional safety", "NPI bringup validation",
    "infotainment firmware validation", "OTA validation",
    "QNX Android automotive", "EVT DVT PVT quality",
    "L2 autonomy validation", "safety-critical systems",

    // IoT & embedded
    "IoT firmware quality", "Raspberry Pi automation",
    "ARM ESP32 validation", "RTOS embedded testing",
    "ADB Android automation", "BLE CAN bus testing",
    "LiDAR Radar sensor validation", "heterogeneous embedded stacks",

    // AI/ML product quality
    "AI ML product quality validation", "AI algorithm precision testing",
    "ML model validation", "AI-native engineering",
    "agentic development", "AI pair programming",
    "AI dashcam quality", "autonomous vehicle quality",

    // Company associations (SEO)
    "Amazon Lab126 QA", "Amazon Echo Buds Echo Auto quality",
    "Alexa Voice Service firmware", "Google Daydream VR testing",
    "Rivian V2X firmware validation", "Rivian R1T R1S R1 fleet quality",
    "Cruise vehicle compute automation", "Cruise L2 autonomy validation",
    "Samsara IoT dashcam firmware", "Samsara AI firmware quality",
    "Motorola Bluetooth qualification",

    // Stack & tools
    "Pytest automation", "Appium Selenium testing",
    "Python test automation", "Jenkins CI/CD",
    "Docker QEMU simulation", "Splunk Grafana observability",
    "Kibana Datadog Databricks", "Bazel build system",
    "Wireshark PCAP fault injection", "JIRA defect lifecycle",

    // Business impact
    "cost of quality optimization", "SDLC transformation",
    "release risk reduction", "post-launch escape reduction",
    "regression cycle time reduction", "operational savings QA",
  ],
  openGraph: {
    title: "Experience & Career Timeline | Bilal Ahamad",
    description:
      "18+ years of firmware quality, test automation, and IoT engineering at Amazon, Google, Rivian, Cruise, and Samsara.",
    url: "https://bilalahamad.com/experience",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bilalahamad.com" },
    { "@type": "ListItem", position: 2, name: "Experience", item: "https://bilalahamad.com/experience" },
  ],
};

export default function ExperienceLayout({
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
