import { ShieldCheck, Cpu, Layers, Network, CheckCircle2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface Discipline {
  id: string;
  icon: React.ElementType;
  title: string;
  badge: string;
  lead: string;
  capabilities: string[];
  spotlight: string;
  accent: string;
}

const DISCIPLINES: Discipline[] = [
  {
    id: "safety-critical",
    icon: ShieldCheck,
    title: "Safety-Critical & Autonomous Compute",
    badge: "ASIL-D · ISO 26262",
    lead: "Architecting zero-escape validation protocols and fault-tolerance benchmarks for autonomous driving compute and mission-critical vehicle ECUs.",
    capabilities: [
      "ASIL-D functional safety verification & fault injection",
      "Multi-ECU handshake & arbitration validation",
      "Fail-safe state machine & redundancy stress testing",
      "CPU/GPU compute workload & PCAP replay simulation",
    ],
    spotlight: "rgba(139, 92, 246, 0.15)",
    accent: "text-violet-700 dark:text-violet-400 border-violet-500/30",
  },
  {
    id: "firmware-bringup",
    icon: Cpu,
    title: "Embedded Firmware & Hardware Bring-Up",
    badge: "RTOS · QNX · Linux",
    lead: "Guiding silicon and board bring-up from initial power-on through production firmware release, standardizing low-level bus protocols and physical-layer stability.",
    capabilities: [
      "Silicon bring-up across ARM, ESP32, and custom SoCs",
      "CAN bus, UART, I2C, SPI & Ethernet protocol validation",
      "Low-power state transitions & battery lifecycle profiling",
      "Optical bench camera module & image quality verification",
    ],
    spotlight: "rgba(6, 182, 212, 0.15)",
    accent: "text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  },
  {
    id: "simulation-virtualization",
    icon: Layers,
    title: "HIL / SIL Simulation & Virtualization",
    badge: "Virtual-ECU · QEMU · Docker",
    lead: "Creating pre-silicon virtualization harnesses and automated HIL benches that detach validation velocity from physical hardware availability.",
    capabilities: [
      "QEMU & Docker-based virtual-ECU simulation environments",
      "Automated Hardware-in-the-Loop (HIL) chassis test racks",
      "24/7 CI/CD release gating with automated regression suites",
      "Robotic physical stimulus fixtures & spatial tracking rigs",
    ],
    spotlight: "rgba(245, 158, 11, 0.15)",
    accent: "text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  {
    id: "edge-telematics",
    icon: Network,
    title: "Edge Intelligence & Connected Fleets",
    badge: "OTA · On-Device AI · IoT",
    lead: "Engineering resilient edge-to-cloud data pipelines, cryptographically verified OTA update mechanisms, and distributed video safety ecosystems.",
    capabilities: [
      "Dual-partition (A/B) OTA update & rollback verification",
      "On-device AI model precision & inference validation",
      "RTSP/RTP media streaming & TLS 1.3 edge security",
      "High-scale telematics telemetry & fleet-wide diagnostics",
    ],
    spotlight: "rgba(16, 185, 129, 0.15)",
    accent: "text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
];

export function DisciplinesSection() {
  return (
    <section
      className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden"
      id="disciplines"
      aria-labelledby="disciplines-heading"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-mono t-label uppercase tracking-widest">
              <div className="h-px w-6 bg-cyan-500/50" />
              Technical Horizons
            </div>
            <h2 id="disciplines-heading" className="t-h2 text-ink">
              Core Architectural{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 dark:from-cyan-400 dark:via-blue-400 dark:to-violet-400">
                Disciplines
              </span>
            </h2>
            <p className="t-lead text-ink-muted font-light">
              Deep systems mastery honed across autonomous vehicle compute, connected telematics,
              and high-volume consumer hardware programs.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {DISCIPLINES.map((discipline) => {
            const Icon = discipline.icon;
            return (
              <SpotlightCard
                key={discipline.id}
                spotlightColor={discipline.spotlight}
                className="p-8 sm:p-10 rounded-3xl border border-line/10 dark:border-line/[0.08] bg-surface-card/90 dark:bg-black/40 flex flex-col justify-between space-y-6 hover:border-line/20 transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-ink/[0.04] dark:bg-ink/[0.03] border border-line/10 w-fit">
                      <Icon className={`w-6 h-6 ${discipline.accent.split(" ")[0]}`} aria-hidden="true" />
                    </div>
                    <span className="t-label font-mono uppercase px-3 py-1 rounded-full bg-ink/[0.04] border border-line/10 text-ink-muted">
                      {discipline.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="t-h3 text-ink">{discipline.title}</h3>
                    <p className="t-body text-ink-muted font-light mt-2 leading-relaxed">
                      {discipline.lead}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-line/10" aria-label={`${discipline.title} capabilities`}>
                    {discipline.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5 t-small text-ink-muted">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${discipline.accent.split(" ")[0]}`} aria-hidden="true" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
