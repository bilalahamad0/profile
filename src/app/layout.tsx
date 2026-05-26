import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { NavbarV2 } from "@/components/v2/NavbarV2";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",          // Prevent FOIT
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bilalahamad.com"),
  title: {
    default: "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer",
    template: "%s | Bilal Ahamad",
  },
  description:
    "Portfolio of Bilal Ahamad — 18+ years engineering quality for Amazon, Google, Rivian, Cruise & Samsara. Specializing in IoT automation, test architecture, and AI-native development.",
  keywords: [
    "Technical QA Lead", "IoT Engineer", "Test Automation", "Amazon", "Google",
    "Rivian", "Cruise", "Samsara", "QA Manager", "Software Engineer", "AI",
    "Bilal Ahamad", "portfolio",
  ],
  authors: [{ name: "Bilal Ahamad", url: "https://bilalahamad.com" }],
  creator: "Bilal Ahamad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bilalahamad.com",
    siteName: "Bilal Ahamad Portfolio",
    title: "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer",
    description:
      "18+ years engineering quality for Amazon, Google, Rivian, Cruise & Samsara. Specializing in IoT automation, test architecture, and AI-native development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer",
    description:
      "18+ years engineering quality for Amazon, Google, Rivian, Cruise & Samsara.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "36aoiHz6Nnk5XvQlVxjaN3ObsM4AdVl_RKGzVQMVx7I",
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          inter.variable,
          "font-sans bg-[#09090b] text-foreground antialiased"
        )}
      >
        {/* Skip to main content — WCAG 2.4.1 */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {/* Scroll-to-top on every route change */}
          <ScrollToTop />
          <NavbarV2 />
          <main id="main-content" className="min-h-screen relative flex flex-col">
            {children}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
