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

/** Coursework link tracking. Deliberately NOT openVerifyUrl(): that helper
 *  fires `verify_certificate`, a claim no learning path can make. The verb is
 *  "open", not "verify", so a GA report can never merge these clicks into
 *  credential verifications. These helpers only TRACK — the <a> navigates
 *  itself, so the destinations stay real, crawlable, middle-clickable outbound
 *  links that work with JS off. */
export function trackCourseworkPage(meta: {
  id: string;
  issuer: string;
  title: string;
  urlLabel: string;
}) {
  trackEvent("open_coursework_page", {
    title: meta.title,
    issuer: meta.issuer,
    coursework_id: meta.id,
    destination: meta.urlLabel,
  });
}

/** One course badge's public page. `provider` comes from the DATA — the two
 *  lab-based skill badges link Credly, the other 18 link Google Skills — never
 *  hardcoded the way openBadgeUrl() hardcodes "Credly". `badge_kind`
 *  distinguishes a lab-based skill badge from an on-demand completion badge. */
export function trackCourseBadge(meta: {
  title: string;
  provider: "Google Skills" | "Credly";
  kind: "completion" | "skill";
  coursework: string;
}) {
  trackEvent("open_course_badge", {
    title: meta.title,
    provider: meta.provider,
    badge_kind: meta.kind,
    coursework: meta.coursework,
  });
}
