import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // The root layout's title template appends " | Bilal Ahamad".
  title: "Privacy Policy",
  description:
    "What bilalahamad.com collects, why, how long it is kept, and how to exercise your privacy rights.",
  alternates: { canonical: "https://bilalahamad.com/privacy" },
};

/** Kept in one place so the page and its footer agree. */
const EFFECTIVE_DATE = "29 August 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <section className="border-b border-line/10 dark:border-line/5 px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:px-24 lg:pt-36">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="t-h1">
            Privacy <span className="text-blue-700 dark:text-blue-400">Policy</span>
          </h1>
          <p className="t-lead font-light text-ink-muted">
            This is a personal portfolio run by one individual. It collects as little as it can,
            sells nothing, and shows no advertising.
          </p>
          <p className="t-caption text-ink-muted">Effective {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-24">
        <div className="mx-auto max-w-3xl space-y-10">
          <Block title="Who is responsible">
            <P>
              Bilal Ahamad is the data controller for this site. For any privacy question or
              request, use the{" "}
              <Link href="/contact" className="text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                contact form
              </Link>{" "}
              and say what you would like done.
            </P>
          </Block>

          <Block title="What is collected, and why">
            <Item label="Contact form">
              When you submit the form, your name, email address, subject and message are sent to
              Bilal by email so he can reply. Legal basis: your consent, given by submitting the
              form (GDPR Art. 6(1)(a)) and the legitimate interest in answering you. The message is
              not written to any database by this site; it lives in the recipient mailbox. A hashed
              copy of your email address is held briefly in memory to rate-limit submissions.
            </Item>
            <Item label="Spam protection">
              There is no CAPTCHA here — nothing for you to solve. Instead a submission has to pass
              three quiet checks. Vercel BotID runs an invisible bot check on the request; Vercel,
              not Google, is the processor for it, and its challenge script loads only when a
              protected request is actually made. The submission must also carry the signed entry
              cookie described below, which the form requests as soon as you focus one of its
              fields. Finally, submissions are rate-limited — by network address, and by a hashed
              copy of the email address given.
            </Item>
            <Item label="Entry check">
              A first visit sets a short-lived signed cookie named <Code>ba_entry</Code> (about two
              hours) and a browser storage flag named <Code>ba_entered</Code> (about 30 days). These
              exist to keep automated scrapers out, not to identify you. The cookie carries a
              timestamp and your browser&apos;s timezone name — no name, email or account. It is
              strictly necessary for that security function.
            </Item>
            <Item label="Audience measurement">
              Vercel Web Analytics and Vercel Speed Insights count page views and measure loading
              performance. Per Vercel&apos;s documentation these use no cookies and identify
              visitors only by a hash of the incoming request that is discarded within 24 hours; the
              results are aggregate.
            </Item>
            <Item label="Google Analytics">
              Google Analytics 4 is also loaded, and it does set cookies (including{" "}
              <Code>_ga</Code>) containing a randomly generated identifier used to recognise a
              returning browser. It records pages viewed and a small number of interaction events,
              such as a resume download. If you would rather not be counted, use your browser&apos;s
              tracking protection, an ad blocker, or Google&apos;s{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                opt-out add-on
              </a>
              .
            </Item>
            <Item label="Hosting logs">
              The site is hosted on Vercel, which processes standard request data (including IP
              address) to serve and secure the site.
            </Item>
          </Block>

          <Block title="What is never done here">
            <P>
              No personal data is sold or shared for cross-context behavioural advertising. There is
              no advertising network, no newsletter list, no profiling, and no automated
              decision-making. Nothing on this site requires an account, and downloading the resume
              requires no form.
            </P>
          </Block>

          <Block title="How long it is kept">
            <P>
              Contact messages are kept in the recipient mailbox for as long as the conversation is
              useful, and can be deleted on request. The entry cookie expires in about two hours and
              the browser flag in about 30 days. Analytics data is retained under the providers&apos;
              own schedules — Vercel&apos;s hashed identifier is discarded within 24 hours, and
              Google Analytics retention is set to Google&apos;s default for this property.
            </P>
          </Block>

          <Block title="Who else processes it">
            <P>
              Vercel (hosting, analytics, and the contact form&apos;s bot check), Google (Google
              Analytics), and the email provider that delivers contact messages. These providers may
              process data outside your country, including in the United States, under their own
              transfer safeguards.
            </P>
          </Block>

          <Block title="Your rights">
            <P>
              If you are in the UK, EU or EEA, you may request access to your personal data, and its
              correction, deletion, restriction or portability; you may object to processing based
              on legitimate interests; and where processing rests on consent you may withdraw it at
              any time without affecting what came before. You may also complain to your data
              protection authority — in the UK that is the Information Commissioner&apos;s Office.
            </P>
            <P>
              If you are a California resident, you may request the categories and specific pieces
              of personal information collected, ask for deletion or correction, and you will not be
              treated differently for asking. This site does not sell or share personal information.
            </P>
            <P>
              Requests go through the{" "}
              <Link href="/contact" className="text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                contact form
              </Link>
              . There is no charge, and you will get a reply.
            </P>
          </Block>

          <Block title="Do Not Track">
            <P>
              Browsers can send a Do Not Track signal. There is still no agreed standard for
              honouring it, so this site does not respond to it. The opt-out routes described under
              Google Analytics above are effective.
            </P>
          </Block>

          <Block title="Third-party links">
            <P>
              Pages here link to GitHub, LinkedIn, browser extension stores, and live project
              dashboards. Those sites have their own privacy policies, and this one does not cover
              them.
            </P>
          </Block>

          <Block title="Changes">
            <P>
              If this policy changes materially, the effective date at the top of the page changes
              with it, and the current version is always the one published here.
            </P>
          </Block>
        </div>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="t-h3 text-ink">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="t-body leading-relaxed text-ink/88">{children}</p>;
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line/10 dark:border-line/5 bg-surface-card dark:bg-ink/[0.02] p-5">
      <h3 className="t-small mb-1.5 font-bold text-ink">{label}</h3>
      <p className="t-small leading-relaxed text-ink/88">{children}</p>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[0.85em] text-ink dark:text-zinc-200">
      {children}
    </code>
  );
}
