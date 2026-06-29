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
import { EntryGate } from "@/components/v3/EntryGate";

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
    "Portfolio of Bilal Ahamad — 18+ years engineering quality at Amazon, Google, Rivian, Cruise & Samsara. IoT automation, test architecture & AI-native dev.",
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

/**
 * Runs before the body paints (first child of <body>). For a human who hasn't
 * entered yet, it instantly drops an opaque #09090b cover (via the
 * `html.ba-prelaunch` rule in globals.css) so the home page never flashes before
 * the entry splash mounts. Skipped for bots and returning visitors, so crawlers
 * still get the full page and repeat visitors see no cover. Mirrors EntryGate's
 * show decision.
 */
const ENTRY_PRELAUNCH = `(function(){try{
var ua=navigator.userAgent||"";
if(/bot|crawl|spider|slurp|googlebot|bingbot|duckduckbot|baiduspider|yandex|headless|lighthouse|facebookexternalhit|embedly|preview|whatsapp|telegram|slackbot|discordbot/i.test(ua))return;
var r=null;try{r=localStorage.getItem("ba_entered")}catch(e){}
if(r){var t=Number(r);if(isFinite(t)&&Date.now()-t<2592000000)return;}
document.documentElement.classList.add("ba-prelaunch");
}catch(e){}})();`;

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
        {/* Pre-paint cover to prevent the home page flashing before the splash. */}
        <script dangerouslySetInnerHTML={{ __html: ENTRY_PRELAUNCH }} />

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
          {/* Client-only entry splash + anti-automation handshake. Renders nothing
              on the server, so the static HTML crawlers read is the full page. */}
          <EntryGate />
        </ThemeProvider>
      </body>
    </html>
  );
}
