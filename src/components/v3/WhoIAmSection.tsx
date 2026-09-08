import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Cpu, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface Pillar {
  icon: React.ElementType;
  title: string;
  tagline: string;
  body: string;
  color: string;
  spotlight: string;
}

const PHILOSOPHY_PILLARS: Pillar[] = [
  {
    icon: Cpu,
    title: "The Physical-Digital Frontier",
    tagline: "Where failure has physical consequences",
    body: "Most software architectures live in the cloud, where an unhandled exception restarts a container in milliseconds. Embedded firmware, autonomous vehicles, and industrial telematics operate under entirely different stakes. Silicon interacts with physical forces, high voltage, and irreversible mechanical states. My career is dedicated to this boundary—ensuring bare-metal code, real-time operating systems, and distributed intelligence behave predictably under real-world conditions.",
    color: "text-violet-700 dark:text-violet-400",
    spotlight: "rgba(139, 92, 246, 0.12)",
  },
  {
    icon: ShieldCheck,
    title: "Determinism in an Asynchronous World",
    tagline: "Forcing edge cases to reveal themselves",
    body: "Real-world hardware is inherently unpredictable: thermal throttling, sensor drift, CAN bus contention, and power-state transitions. Quality is not verified by running happy-path checks after a build; it is engineered by creating the exact conditions where edge cases are forced to reveal themselves. Through hardware-in-the-loop (HIL) simulation, virtual-ECU modeling, and automated fault injection, I transform erratic physical phenomena into reproducible engineering signals.",
    color: "text-cyan-700 dark:text-cyan-400",
    spotlight: "rgba(6, 182, 212, 0.12)",
  },
  {
    icon: Compass,
    title: "Systems-Level Stewardship",
    tagline: "Quality as an architectural foundation",
    body: "Over nearly two decades across Amazon Lab126, Google, Rivian, Cruise, and Samsara, I have observed how ambitious hardware programs stumble: through uncommunicated assumptions between silicon, firmware, software, and operations. True quality is an architectural discipline established at NPI bring-up. It means designing multi-ECU arbitration, cryptographically verified A/B rollbacks, and zero-escape release gates that let engineering teams ship fearlessly.",
    color: "text-amber-700 dark:text-amber-400",
    spotlight: "rgba(245, 158, 11, 0.12)",
  },
  {
    icon: Sparkles,
    title: "Intelligent Engineering Leverage",
    tagline: "Multiplying verification rigor with modern AI",
    body: "Modern AI and edge SLMs offer immense leverage for systems engineering when applied with rigor. Rather than treating AI as a superficial coding assistant, I leverage agentic automation to synthesize complex fault scenarios, automate high-throughput protocol validation, and extract deep telemetry patterns from massive hardware test sweeps—achieving levels of empirical verification once thought impossible for lean teams.",
    color: "text-emerald-700 dark:text-emerald-400",
    spotlight: "rgba(16, 185, 129, 0.12)",
  },
];

export function WhoIAmSection() {
  return (
    <section
      className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden"
      id="who-i-am"
      aria-labelledby="who-i-am-heading"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.05] blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-600/[0.05] blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 font-mono t-label uppercase tracking-widest">
            <div className="h-px w-6 bg-violet-500/50" />
            Engineering Philosophy &amp; Mindset
          </div>
          <h2 id="who-i-am-heading" className="t-h2 text-ink">
            The Architecture of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400">
              Reliability
            </span>
          </h2>
          <p className="t-lead text-ink-muted font-light leading-relaxed">
            Software operating in the physical world cannot afford the luxury of undefined behavior.
            Here is the engineering mental model that guides my work across firmware, silicon, and autonomous systems.
          </p>
        </div>

        {/* 2x2 Grid of Philosophical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PHILOSOPHY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <SpotlightCard
                key={pillar.title}
                spotlightColor={pillar.spotlight}
                className="p-8 sm:p-10 rounded-3xl border border-line/10 dark:border-line/[0.08] bg-surface-card/90 dark:bg-black/40 flex flex-col justify-between space-y-6 hover:border-line/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-ink/[0.04] dark:bg-ink/[0.03] border border-line/10 w-fit">
                      <Icon className={`w-6 h-6 ${pillar.color}`} aria-hidden="true" />
                    </div>
                    <span className="t-label font-mono uppercase text-ink-muted tracking-wider">
                      Core Principle
                    </span>
                  </div>
                  <div>
                    <h3 className="t-h3 text-ink">{pillar.title}</h3>
                    <p className={`t-small ${pillar.color} font-mono mt-1`}>
                      {pillar.tagline}
                    </p>
                  </div>
                  <p className="t-body text-ink-muted leading-relaxed font-light">
                    {pillar.body}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Career Link Footer Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-ink/[0.03] dark:bg-ink/[0.02] border border-line/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="t-h3 text-ink">Proven Across 18+ Years of High-Stakes Launches</h3>
            <p className="t-small text-ink-muted">
              From Amazon Alexa hardware and Google Pixel robotics to Rivian electric vehicles, Cruise autonomous compute, and Samsara fleet IoT.
            </p>
          </div>
          <Link
            href="/experience"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-ink text-surface font-semibold t-small hover:bg-ink/85 dark:hover:bg-zinc-200 transition-all shrink-0"
          >
            <span>Full Career Roadmap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
