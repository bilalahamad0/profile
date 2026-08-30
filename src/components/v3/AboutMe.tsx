import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The homepage "who I am" section.
 *
 * This replaces an earlier role-by-role timeline, which restated /experience
 * beat for beat. The homepage keeps the *person*; /experience keeps the record.
 *
 * DELIBERATELY NUMBER-FREE. An earlier draft opened with "a regression cycle
 * cut from two weeks to five days, a sensor bring-up cycle cut by 70%, firmware
 * escapes down 30%" — KPI figures in what is meant to be an introduction. They
 * read as a performance review, not a person, and every one of them is already
 * on /experience where a reader who wants evidence will look for it. The span
 * of the career is gone for the same reason: the hero's stat card already says
 * "18+ Years", so repeating it here and again on the button made one fact the
 * loudest thing on the page.
 *
 * FRAMING — this is a QA OWNER, not a test enabler. An earlier draft opened
 * with "I build the apparatus… Python against real silicon", which described
 * the individual-contributor layer beneath the actual job and undersold every
 * role in portfolio.ts. Those entries say "Owned firmware quality… leading 4
 * engineers", "Charted the test-delivery roadmap", "Led the quality roadmap…
 * across 50+ localized SKUs", "firmware release sign-off… coordinating
 * readiness with 10+ stakeholders". Strategy, roadmap, release gate, sign-off
 * and the people are the story; the bench is how it gets enforced.
 *
 * VOICE — the hard part, and the reason this went through four drafts. Fixing
 * the undervaluing by ADDING ownership verbs, scope and numbers produced the
 * opposite failure: ASIL-D, NPI, SIL/HIL, "50+ localized SKUs", "10+
 * stakeholders" — the resume rewritten as paragraphs. An intro is not a
 * credentials list. The ownership is now carried in plain speech ("I sign the
 * release — or hold it"), the products are named in words anyone knows
 * (phones, Alexa devices, cars, dash cams), and the counts live on /experience
 * where someone who wants evidence will go looking for them.
 *
 * NO "use client" — the prose and every company name are in the static HTML.
 * The full dated career record stays statically rendered on /experience, which
 * is what the ATS rule in CLAUDE.md requires.
 *
 * CONTENT NOTE: this prose is framing, not fact. Every claim traces to a role
 * or project in src/data/portfolio.ts; if those change, re-read this by hand.
 */

/** Employer and product names, lifted just off the body colour so they scan. */
function Name({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-ink">{children}</span>;
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="t-label font-bold uppercase tracking-[0.2em] font-mono text-ink-muted">
        {label}
      </h3>
      <p className="t-lead text-ink-muted leading-relaxed mt-3">{children}</p>
    </div>
  );
}

export function AboutMe() {
  return (
    <section
      className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* A single measured column — every other section on this page is a grid
          of cards, so prose at a readable measure reads as deliberate. */}
      <div className="max-w-3xl mx-auto">
        <h2 id="about-heading" className="t-h2 text-ink">
          Who I am
        </h2>

        <div className="mt-10 space-y-9">
          <Block label="What I do">
            I decide whether a product is ready for real people to use. My teams
            build the tests and run them; I set what we are testing for, and I
            sign the release — or hold it, on the days when everyone would rather
            I did not.
          </Block>

          <Block label="What I care about">
            The quiet failures. Not the crash you can see, but the thing that
            goes wrong at 3am in someone&rsquo;s car, in a language I don&rsquo;t
            speak, on a device that has been running fine for six months.
            Catching those before a customer does is the whole job, and almost
            nobody thanks you for it. I like it anyway.
          </Block>

          <Block label="Where I&rsquo;ve done it">
            Phones at <Name>Google</Name> and <Name>Motorola</Name>. Alexa
            devices at <Name>Amazon</Name>. Cars at <Name>Rivian</Name> and{" "}
            <Name>Cruise</Name>. Dash cams at <Name>Samsara</Name>. These days,
            sensor platforms for autonomous systems.
          </Block>

          <Block label="Away from work">
            I build things for my own house. A Raspberry Pi in my living room
            runs a small AI model that coordinates a TV, a smart display and a
            speaker, so the call to prayer plays on time without anyone touching
            anything. It works about 99% of the time. I wrote up the time it
            didn&rsquo;t, in detail, because that is the more useful story.
          </Block>
        </div>

        <Link
          href="/experience"
          className="group inline-flex min-h-11 items-center gap-2 mt-10 rounded-xl border border-line/10 bg-ink/5 px-5 py-2.5 t-small font-semibold text-ink transition-colors hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400"
        >
          Full career history
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
