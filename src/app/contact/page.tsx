"use client";

import { useEffect } from "react";
import { ContactSection } from "@/components/sections/contact";
import { BookingEmbed } from "@/components/sections/booking-embed";
import { motion } from "framer-motion";

export default function ContactPage() {
  // "Book a Call" from the home CTA / footer lands on /contact#book, but the
  // global ScrollToTop and the entry cover can beat the browser's native hash
  // scroll. So once we arrive with #book in the URL, poll until the section is
  // laid out and nothing is covering the page, then jump to it. Uses setTimeout
  // (not requestAnimationFrame) so it still fires if the tab is backgrounded.
  useEffect(() => {
    if (window.location.hash !== "#book") return;
    let timer = 0;
    let tries = 0;
    const scrollToBook = () => {
      const covered =
        document.documentElement.classList.contains("ba-prelaunch") ||
        document.body.style.overflow === "hidden"; // entry cover / splash up
      const el = document.getElementById("book");
      if (el && !covered) {
        el.scrollIntoView({ block: "start" });
        return;
      }
      if (tries++ < 60) timer = window.setTimeout(scrollToBook, 50); // retry ~3s
    };
    timer = window.setTimeout(scrollToBook, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-ink">

      {/* Header Section */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-36 lg:pb-12 px-6 lg:px-24 border-b border-line/10 dark:border-line/5">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="t-h1"
          >
            Get in <span className="text-blue-700 dark:text-blue-500">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="t-lead text-ink-muted font-light max-w-2xl"
          >
            Have a project in mind or just want to say hello? I&apos;m always open to discussing new opportunities and creative ideas.
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-12 md:py-16 lg:py-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto">
          <ContactSection />
        </div>
      </section>

      {/* Inline Booking Section — embedded Google scheduler */}
      <BookingEmbed />

      {/* Additional Info Section */}
      <section className="py-12 md:py-20 lg:py-24 px-6 text-center border-t border-line/10 dark:border-line/5 bg-ink/[0.03] dark:bg-ink/[0.02]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="t-h3">Based in Sunnyvale, CA</h2>
          <p className="text-ink-muted">
            Available for remote roles or local opportunities in the San Francisco Bay Area.
            I typically respond to inquiries within 24-48 business hours.
          </p>
        </div>
      </section>
    </div>
  );
}
