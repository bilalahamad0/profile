"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, ShieldCheck, Play, Pause, RefreshCw, Cpu, Car,
  Zap, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

type SystemDomain = "cruise" | "rivian" | "google" | "samsara";

interface DomainConfig {
  id: SystemDomain;
  title: string;
  company: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  testSuite: string;
  metric: { value: string; label: string };
  signals: { name: string; value: string; status: "good" | "nominal" | "active" }[];
  logStream: string[];
}

const DOMAINS: DomainConfig[] = [
  {
    id: "cruise",
    title: "Autonomous Vehicle Compute HIL",
    company: "Cruise LLC",
    badge: "ASIL-D / ISO 26262",
    icon: Car,
    accentColor: "text-violet-700 dark:text-violet-400",
    borderColor: "border-violet-500/30",
    testSuite: "AV_Compute::ASIL_D_Fault_Injection_Replay",
    metric: { value: "75%", label: "Automation Coverage (0 Escapes)" },
    signals: [
      { name: "Sensor Replay", value: "60.2 FPS (LiDAR/Radar)", status: "good" },
      { name: "CPU/GPU Interconnect", value: "Peak Load Stress PASS", status: "good" },
      { name: "Fail-Safe Latch", value: "Zero Fail-Open Violations", status: "good" },
      { name: "HIL Bench Latency", value: "8.4 ms (Target <15ms)", status: "nominal" },
    ],
    logStream: [
      "[INIT] Mounting QEMU virtual ECU container on HIL chassis #04...",
      "[V2X] Injecting PCAP radar packet stream (10,000 frames)...",
      "[FAULT] Injected simulated CAN bus packet corruption at T+4.2s...",
      "[ASIL-D] Redundant fail-safe executed within 4.1ms. Zero unhandled states.",
      "[RESULT] Test Suite Passed. Release candidate verified for bench sign-off.",
    ],
  },
  {
    id: "rivian",
    title: "Multi-ECU Infotainment & OTA",
    company: "Rivian Automotive LLC",
    badge: "R1T / R1S / Fleet EDV",
    icon: ShieldCheck,
    accentColor: "text-cyan-700 dark:text-cyan-400",
    borderColor: "border-cyan-500/30",
    testSuite: "OTA_Gateway::Dual_Partition_AB_Recovery",
    metric: { value: "40%", label: "Blocking Defects Pre-FCS Cut" },
    signals: [
      { name: "ECU Arbitration", value: "QNX ↔ Android AAOS Sync", status: "good" },
      { name: "OTA A/B Partition", value: "Cryptographic Hash Verified", status: "good" },
      { name: "Rollback Protection", value: "Active & Reversible", status: "good" },
      { name: "12V Body Sleep", value: "Deep Sleep Current < 15mA", status: "nominal" },
    ],
    logStream: [
      "[OTA] Flashing signed payload to Partition B via Buildkite CI...",
      "[HANDSHAKE] Infotainment ECU synced with Telematics Gateway (TCU)...",
      "[VERIFY] Out-of-Box Experience (OOBE) regression: 142/142 tests passed.",
      "[SECURITY] Secure boot RSA signature check confirmed intact.",
      "[RESULT] Release train cleared for over-the-air fleet staged rollout.",
    ],
  },
  {
    id: "google",
    title: "Robotic IMU Stimulus Fixture",
    company: "Google Inc / Daydream",
    badge: "3DOF Motion Robotics",
    icon: Cpu,
    accentColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-500/30",
    testSuite: "Motion_Fidelity::IMU_SensorFusion_Tracking",
    metric: { value: "80%", label: "Manual Execution Hours Cut" },
    signals: [
      { name: "Robotic Stimulus", value: "3DOF Servo Sweep Active", status: "active" },
      { name: "Sensor-Fusion Drift", value: "< 0.015° / axis", status: "good" },
      { name: "UART Bus Trace", value: "115200 Baud / 0 packet loss", status: "good" },
      { name: "Battery Profiling", value: "DoD Cycle Nominal", status: "nominal" },
    ],
    logStream: [
      "[FIXTURE] Initializing Arduino servo motion-stimulus rig...",
      "[CALIBRATE] Spatial tracking zeroed at (0, 0, 0) reference axis...",
      "[STIMULUS] Sweeping angular velocity 0° to 180° across 500 cycles...",
      "[TELEMETRY] IMU sensor-fusion filter accuracy: 99.8% correlation.",
      "[RESULT] Firmware sign-off gate passed across Pixel/VR hardware.",
    ],
  },
  {
    id: "samsara",
    title: "IoT Dash Cam Edge-to-Cloud",
    company: "Samsara Inc",
    badge: "Edge AI / Embedded Linux",
    icon: Zap,
    accentColor: "text-amber-700 dark:text-amber-400",
    borderColor: "border-amber-500/30",
    testSuite: "Edge_Pipeline::RTSP_Encode_Upload_Precision",
    metric: { value: "5 Days", label: "Regression Cycle (Was 2 Wks)" },
    signals: [
      { name: "Edge RTSP Stream", value: "1080p @ 30fps H.264", status: "good" },
      { name: "On-Device AI Precision", value: "99.4% Event Classification", status: "good" },
      { name: "Optical Bench IQ", value: "Low-Light Dynamic Range Verified", status: "good" },
      { name: "Network Resilience", value: "TLS 1.3 / LTE Failover Pass", status: "nominal" },
    ],
    logStream: [
      "[EDGE] Booting Dash Cam Embedded Linux v6.1 kernel...",
      "[OPTICAL] Calibrating camera module on optical bench (lux: 0.5)...",
      "[AI_INFERENCE] Running on-device driver-safety neural net...",
      "[RESILIENCE] Network severed for 30s: local flash buffer stored all events.",
      "[RESULT] 0 packet escapes. Firmware regression sign-off achieved in 5 days.",
    ],
  },
];

export function SystemsConsole() {
  const [activeTab, setActiveTab] = useState<SystemDomain>("cruise");
  const [isRunning, setIsRunning] = useState(true);
  const [logIndex, setLogIndex] = useState(0);
  const [progress, setProgress] = useState(65);

  const activeDomain = DOMAINS.find((d) => d.id === activeTab) ?? DOMAINS[0];

  // Simulated live execution loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % activeDomain.logStream.length);
      setProgress((prev) => (prev >= 100 ? 25 : prev + 15));
    }, 2800);
    return () => clearInterval(interval);
  }, [isRunning, activeDomain]);

  const handleTabChange = useCallback((id: SystemDomain) => {
    setActiveTab(id);
    setLogIndex(0);
    setProgress(35);
  }, []);

  const handleRestart = useCallback(() => {
    setProgress(15);
    setLogIndex(0);
    setIsRunning(true);
  }, []);

  return (
    <div
      className="w-full rounded-2xl border border-line/10 bg-surface-card/90 dark:bg-black/75 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300"
      aria-label="Interactive Systems Validation Workbench"
    >
      {/* ── Console Header Chrome ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-line/10 bg-ink/[0.03] dark:bg-ink/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="t-label font-mono uppercase text-ink-muted ml-2 tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-violet-600 dark:text-violet-400" aria-hidden="true" />
            Systems Validation Workbench
          </span>
        </div>

        {/* Live execution status indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 t-label font-mono uppercase text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isRunning ? "Live Telemetry" : "Paused"}
          </span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
            aria-label={isRunning ? "Pause Telemetry" : "Resume Telemetry"}
            title={isRunning ? "Pause" : "Resume"}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleRestart}
            className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
            aria-label="Restart Test Suite"
            title="Restart Run"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Domain Switcher Tabs ── */}
      <div className="flex overflow-x-auto border-b border-line/10 bg-ink/[0.01] p-1.5 gap-1.5 scrollbar-none">
        {DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isActive = domain.id === activeTab;
          return (
            <button
              key={domain.id}
              onClick={() => handleTabChange(domain.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 shrink-0",
                isActive
                  ? "bg-surface shadow-sm border border-line/10 text-ink"
                  : "text-ink-muted hover:text-ink hover:bg-ink/[0.04]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? domain.accentColor : "text-ink-muted"
                )}
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="t-caption font-bold leading-none">{domain.company}</span>
                <span className="t-label text-ink-muted uppercase tracking-tighter mt-0.5">
                  {domain.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Console Body & Real-Time Telemetry ── */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Test Suite Banner & Primary Metric */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-ink/[0.02] border border-line/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="t-label font-mono uppercase tracking-widest text-ink-muted">Active Test Suite:</span>
              <span className="t-caption font-mono font-bold text-ink">{activeDomain.testSuite}</span>
            </div>
            <p className="t-label text-ink-muted">{activeDomain.title} — Continuous HIL/SIL Verification Gate</p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-surface border border-line/10 shadow-xs">
            <div className="flex flex-col text-right">
              <span className="t-h3 text-ink leading-none font-black">{activeDomain.metric.value}</span>
              <span className="t-label text-ink-muted uppercase tracking-tight mt-0.5">{activeDomain.metric.label}</span>
            </div>
          </div>
        </div>

        {/* Real-time Hardware Signals Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {activeDomain.signals.map((signal) => (
            <div
              key={signal.name}
              className="p-2.5 rounded-lg bg-ink/[0.02] border border-line/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="t-label font-mono uppercase text-ink-muted truncate">{signal.name}</span>
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    signal.status === "good" ? "bg-emerald-500" :
                    signal.status === "nominal" ? "bg-cyan-500" : "bg-violet-500 animate-pulse"
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className="t-caption font-mono font-semibold text-ink leading-tight truncate">
                {signal.value}
              </span>
            </div>
          ))}
        </div>

        {/* Live Execution Terminal Log */}
        <div className="relative rounded-xl bg-black/90 p-3.5 font-mono text-xs text-zinc-300 border border-white/10 shadow-inner overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2 border-b border-white/10 pb-1.5 t-label uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" aria-hidden="true" /> Live Verification Stream
            </span>
            <span>HIL Pipeline: {progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={activeDomain.logStream[logIndex]}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="t-caption font-mono text-cyan-300/90 leading-relaxed min-h-[2.5rem] flex items-center"
            >
              <span className="text-emerald-400 mr-2 shrink-0">➜</span>
              {activeDomain.logStream[logIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
