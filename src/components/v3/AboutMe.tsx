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
 * Each company is named by what was OWNED there, not by an artifact built
 * there. "Motion and sensor-fusion rigs at Google" was a second version of the
 * same mistake: it reduced end-to-end ownership of Daydream VR controller
 * firmware validation, plus Pixel 2/3 release sign-off, to one fixture.
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
          <Block label="What I own">
            Quality for a product line, end to end — the test strategy, the
            automation that enforces it, the release gate, and the sign-off that
            says it ships. Building the bench is the easy half. The job is
            defining what &ldquo;ready&rdquo; means, holding that line when a
            launch date is pushing against it, and owning the consequences either
            way.
          </Block>

          <Block label="How I lead">
            Through the teams that build the thing, not around them. I have led
            engineers directly and through matrixed reporting, synchronized DSP,
            acoustic and firmware groups onto one schedule, run three squads on a
            bi-weekly release train, and carried release readiness to senior
            leadership and 10+ stakeholders. Most quality problems turn out to be
            coordination problems wearing a technical costume.
          </Block>

          <Block label="Where I&rsquo;ve done it">
            At <Name>Google</Name> I owned firmware validation for the Daydream VR
            controller end to end and held release sign-off across Pixel 2 and
            Pixel 3. At <Name>Amazon Lab126</Name> I led the quality roadmap for
            Alexa Voice Service across 50+ localized SKUs. I directed test
            strategy across <Name>Rivian</Name>&rsquo;s R1T, R1S and commercial
            fleet, charted the test-delivery roadmap and ASIL-D protocols for{" "}
            <Name>Cruise</Name>&rsquo;s autonomous compute platform, and owned
            firmware quality for <Name>Samsara</Name>&rsquo;s dash-cam line —
            earlier, handsets at <Name>Motorola Mobility</Name> and{" "}
            <Name>Wistron</Name>. Today I lead architecture and validation for a
            sensor-integration platform, from LiDAR and radar bring-up through to
            production release gates.
          </Block>

          <Block label="Away from the job">
            I keep building. A Raspberry Pi in my living room casts prayer-time
            audio to the TV, a browser extension does the same for open tabs, and
            a public dashboard follows layoff notices across the country. All of
            it is open source, with the failures written up as plainly as the
            wins.
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
