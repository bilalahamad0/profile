import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { Footer } from "@/components/layout/footer";
import { NavDockWrapper } from "@/components/layout/nav-dock-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bilal Ahamad - Technical QA Lead",
  description: "Portfolio of Bilal Ahamad, Technical QA Lead and Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-sans bg-background text-foreground antialiased")}>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SmoothScroll>
            <main className="min-h-screen relative flex flex-col">
              {children}

              {/* ThemeToggle archived — light mode needs redesign pass before re-enabling */}
              {/* <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
              </div> */}

              <Footer />
            </main>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
