// Single source of truth for the "Book a Call" scheduling link.
//
// This is the CANONICAL Google Appointment Scheduling booking-page URL — the
// stable, permanent address of the schedule itself (from Calendar → the
// appointment schedule → "Open booking page"). Prefer this over the
// `calendar.app.google/xxxx` short links: those are disposable Firebase
// Dynamic Link redirects that Google mints fresh on every "Share → Copy link",
// so they change constantly and add a redirect hop. This URL never changes as
// long as the schedule exists. Surfaced across the site's reach-out touchpoints
// (contact page, home CTA, footer).
export const SCHEDULING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ14lnc6LVy-nceAIiRyn7RaW59unMdDTzbv339oUbnWNMS-qaxfyYXNcytKJJzUqxAOW6bbGjdh";

// Same schedule, rendered in Google's embeddable booking view. The `?gv=true`
// flag is what Google's own "Add to your website" iframe snippet uses. Framed
// inline on /contact (see BookingEmbed); allowed by the `frame-src
// https://calendar.google.com` entry in the CSP — the ONLY host added there.
export const SCHEDULING_EMBED_URL = `${SCHEDULING_URL}?gv=true`;

// In-page anchor to the embedded scheduler section on /contact. All "Book a
// Call" affordances point here so booking happens on-site (inline), not via a
// link-out to Google.
export const BOOKING_ANCHOR = "/contact#book";
