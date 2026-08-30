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
 * What replaces them is concrete nouns — Alexa devices, LiDAR bring-up, a
 * Raspberry Pi in a living room. Specific things are more convincing than
 * percentages and do not ask the reader to audit anything.
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
            I build the apparatus that decides whether firmware is ready to
            ship — test benches, automation frameworks, hardware-in-the-loop
            rigs, and the release gates a build has to survive. In practice that
            means Python against real silicon, simulation environments that
            exercise a board before the board exists, and settling what
            &ldquo;done&rdquo; means while there is still time to change it.
          </Block>

          <Block label="What I care about">
            The moment a failure stops being a mystery. Most of my work is
            creating the conditions under which a defect has to show itself — on
            demand, in front of the people who can fix it. A device feels solid
            in someone&rsquo;s hands because, somewhere upstream, an engineer
            declined to accept &ldquo;it works on my bench.&rdquo;
          </Block>

          <Block label="Where I&rsquo;ve been">
            Alexa devices at <Name>Amazon Lab126</Name>. Motion and sensor-fusion
            rigs at <Name>Google</Name>. Vehicle software at <Name>Rivian</Name>,
            autonomous-driving compute at <Name>Cruise</Name>, dash-cam firmware
            at <Name>Samsara</Name> — and, earlier, handsets at{" "}
            <Name>Motorola Mobility</Name> and <Name>Wistron</Name>. Today I
            architect validation for a sensor-integration platform: LiDAR and
            radar bring-up, and the virtual-ECU environments that make it
            repeatable.
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
