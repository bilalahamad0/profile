import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The homepage "who I am" section.
 *
 * This replaces an earlier role-by-role timeline. That timeline put the career
 * on the homepage, but it restated /experience beat for beat — same roles, same
 * dates, same bullets — so the two pages competed instead of leading into each
 * other. A visitor does not need the record twice; they need a reason to want
 * the record at all.
 *
 * So the homepage keeps the *person* and /experience keeps the *evidence*.
 * Every employer is still named here as plain text (which a crawler and a lay
 * reader both read far better than a row of greyscale logos), but as narrative
 * rather than a table, and the section ends by handing off to /experience.
 *
 * NO "use client" — this is static HTML, so the prose and every company name
 * are in the server response. The full career record, with dates and bullets,
 * remains statically rendered on /experience, which is what the ATS rule in
 * CLAUDE.md requires.
 *
 * CONTENT NOTE: the prose below is framing, not fact — the facts live in
 * src/data/portfolio.ts and every claim here is drawn from a role or project
 * defined there. If the roles change, this paragraph has to be re-read by hand;
 * it is deliberately not generated, because a generated bio reads like one.
 */

/** Employer and product names, lifted out of the body colour so they scan. */
function Name({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
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
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-500 font-mono t-caption uppercase tracking-widest mb-3">
          <div className="h-px w-6 bg-blue-500/50" />
          Profile
        </div>

        <h2 id="about-heading" className="t-h2 text-ink">
          Who I am
        </h2>

        <div className="mt-6 space-y-5 t-lead text-ink-muted leading-relaxed">
          <p>
            I&rsquo;m Bilal Ahamad, a systems validation architect in Sunnyvale,
            California. For eighteen years I&rsquo;ve worked on the half of
            engineering nobody demos: the benches, the automation and the release
            gates that decide whether firmware is actually ready to ship. That
            work has been on Alexa devices at <Name>Amazon Lab126</Name>, motion
            and sensor-fusion rigs at <Name>Google</Name>, vehicle software at{" "}
            <Name>Rivian</Name>, autonomous-driving compute at <Name>Cruise</Name>
            , and dash-cam firmware at <Name>Samsara</Name> — and, earlier, on
            handsets at <Name>Motorola Mobility</Name> and <Name>Wistron</Name>.
          </p>

          <p>
            What carries across all of them is a bias toward evidence. I would
            rather build the rig that reproduces a failure on demand than argue
            about whether it is real, and I would rather publish a number I
            measured than one that sounds better. Most of what I am proud of is
            unglamorous: a regression cycle cut from two weeks to five days, a
            sensor bring-up cycle cut by 70%, firmware escapes down 30%.
          </p>

          <p>
            That habit does not stop at work. A Raspberry Pi in my living room
            runs an embedded media caster I wrote, and I maintain a public layoff
            dashboard that now tracks WARN notices across 47 states — both open
            source, both with their failures written up as plainly as their wins.
            Lately I have been measuring my own AI-assisted development the same
            way I would measure any device under test: from transcripts, not from
            impressions.
          </p>
        </div>

        <Link
          href="/experience"
          className="group inline-flex min-h-11 items-center gap-2 mt-8 rounded-xl border border-line/10 bg-ink/5 px-5 py-2.5 t-small font-semibold text-ink transition-colors hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400"
        >
          The full eighteen years
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
