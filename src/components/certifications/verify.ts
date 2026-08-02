import { trackEvent } from "@/components/analytics/google-analytics";

export function openVerifyUrl(
  url: string,
  meta: {
    title: string;
    issuer: string;
    step?: number;
    specialization?: string;
  }
) {
  trackEvent("verify_certificate", {
    title: meta.title,
    issuer: meta.issuer,
    ...(meta.specialization !== undefined && {
      specialization: meta.specialization,
    }),
    ...(meta.step !== undefined && { course_step: String(meta.step) }),
  });
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openBadgeUrl(
  url: string,
  meta: { title: string; specialization: string; step?: number }
) {
  trackEvent("verify_badge", {
    title: meta.title,
    provider: "Credly",
    specialization: meta.specialization,
    ...(meta.step !== undefined && { course_step: String(meta.step) }),
  });
  window.open(url, "_blank", "noopener,noreferrer");
}
