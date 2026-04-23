"use client";

import { Download } from "lucide-react";
import { trackEvent } from "@/components/analytics/google-analytics";

export function DownloadButton() {
  return (
    <a
      href="/Bilal_Ahamad_Resume.pdf"
      download
      onClick={() => trackEvent("resume_download", { location: "ExperiencePage" })}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-95"
    >
      <Download className="w-5 h-5" aria-hidden="true" />
      Download PDF
    </a>
  );
}
