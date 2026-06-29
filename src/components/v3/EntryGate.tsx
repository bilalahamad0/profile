"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ensureSession, hasEntered, markEntered } from "@/lib/security/client";
import { isLikelyBot } from "@/lib/security/bots";

/**
 * The entry splash — a metropolitan-night skyline whose data converges into a
 * session core. The single "enter" gesture is the anti-automation handshake: it
 * mints the signed `ba_entry` cookie (via /api/session) that protected actions
 * require. A real visitor just walks through a door; they never see a challenge.
 *
 * SEO-safe by construction:
 *  - rendered client-only (returns null on the server), so the static HTML the
 *    crawlers read is the full page — the overlay is never in the markup they see;
 *  - skipped entirely for verified/likely bots and for returning visitors;
 *  - respects prefers-reduced-motion with a calm, static variant.
 */

type Star = { x: number; y: number; r: number; b: number; p: number; s: number };
type Win = { x: number; y: number; lit: boolean; rise: number };
type Building = { x: number; w: number; h: number; base: number; wins: Win[] };
type Layer = { depth: number; col: string; win: string; lit: string; blds: Building[] };
type Node = { x: number; y: number; r: number; on: number; onAt: number; seed: number };
type Edge = { a: number; b: number };
type Pulse = { e: number; t: number; sp: number };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export function EntryGate() {
  const [show, setShow] = useState(false);
  const [entering, setEntering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const igniteRef = useRef(0);
  const reducedRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    // If we won't show the splash, drop the pre-paint cover so the page isn't
    // stuck behind it (matches the inline script's skip conditions).
    const clearCover = () => document.documentElement.classList.remove("ba-prelaunch");
    if (isLikelyBot(navigator.userAgent)) return clearCover();
    if (hasEntered()) return clearCover();
    const r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    reducedRef.current = r;
    setReduced(r);
    setShow(true);
  }, []);

  const handleEnter = useCallback(() => {
    setEntering((already) => {
      if (already) return already;
      void ensureSession();
      markEntered();
      const dur = reducedRef.current ? 200 : 950;
      const start = performance.now();
      const tick = (now: number) => {
        igniteRef.current = Math.min(1, (now - start) / dur);
        if (igniteRef.current < 1) {
          requestAnimationFrame(tick);
        } else {
          // Hand off to the home page: drop the cover, start its entrance, then
          // let the splash zoom-and-dissolve over the top (cross-dissolve, not a cut).
          const root = document.documentElement;
          root.classList.remove("ba-prelaunch");
          root.classList.add("ba-revealing");
          window.setTimeout(() => root.classList.remove("ba-revealing"), 1300);
          setShow(false);
        }
      };
      requestAnimationFrame(tick);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => buttonRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.key === "Enter" && document.activeElement !== buttonRef.current)) {
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [show, handleEnter]);

  useEffect(() => {
    if (!show || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let layers: Layer[] = [];
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let t0 = 0;
    let tmx = 0;
    let tmy = 0;

    const build = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = W < 720;

      stars = [];
      const starCount = small ? 70 : 150;
      for (let i = 0; i < starCount; i += 1) {
        stars.push({ x: rnd(0, W), y: rnd(0, H * 0.62), r: rnd(0.3, 1.4), b: rnd(0.2, 0.9), p: rnd(0, 6.28), s: rnd(0.6, 1.8) });
      }

      const defs = [
        { depth: 9, base: H * 0.66, col: "#15162b", win: "#2a2c52", lit: "#7d7df2", p: 0.18, bw: [34, 62] as const, gap: 6 },
        { depth: 22, base: H * 0.8, col: "#0d0e1f", win: "#23254a", lit: "#a78bfa", p: 0.28, bw: [42, 82] as const, gap: 7 },
        { depth: 40, base: H * 1.05, col: "#070710", win: "#1c1d3a", lit: "#fcd34d", p: 0.32, bw: [50, 98] as const, gap: 9 },
      ];
      layers = defs.map((d) => {
        const blds: Building[] = [];
        let x = -rnd(10, 50);
        while (x < W + 100) {
          const w = rnd(d.bw[0], d.bw[1]);
          const h = rnd(H * 0.12, H * 0.3) + d.depth * 2;
          const wins: Win[] = [];
          const pad = 7;
          const cell = 11;
          for (let wy = d.base - h + pad; wy < d.base - pad; wy += cell) {
            for (let wx = x + pad; wx < x + w - pad; wx += cell) {
              wins.push({ x: wx, y: wy, lit: Math.random() < d.p, rise: Math.random() });
            }
          }
          blds.push({ x, w, h, base: d.base, wins });
          x += w + rnd(2, d.gap);
        }
        return { depth: d.depth, col: d.col, win: d.win, lit: d.lit, blds };
      });

      const cx = W / 2;
      const cy = H * 0.46;
      const n = small ? 10 : 15;
      nodes = [{ x: cx, y: cy, r: 0, on: 1, onAt: 0, seed: 0 }];
      for (let i = 0; i < n; i += 1) {
        const ang = (i / n) * 6.283 + rnd(-0.16, 0.16);
        const rad = rnd(Math.min(W, H) * 0.22, Math.min(W, H) * 0.42);
        const x = Math.max(30, Math.min(W - 30, cx + Math.cos(ang) * rad * 1.35));
        const y = Math.max(60, Math.min(H * 0.78, cy + Math.sin(ang) * rad * 0.9));
        nodes.push({ x, y, r: rnd(2, 3.6), on: 0, onAt: 280 + i * 80 + rnd(0, 70), seed: rnd(0, 6.28) });
      }
      edges = [];
      for (let j = 1; j < nodes.length; j += 1) edges.push({ a: j, b: 0 });
      for (let k = 0; k < 7; k += 1) {
        const a = 1 + Math.floor(rnd(0, n));
        const b = 1 + Math.floor(rnd(0, n));
        if (a !== b) edges.push({ a, b });
      }
      pulses = [];
      for (let p = 0; p < edges.length; p += 1) {
        if (Math.random() < 0.6) pulses.push({ e: p, t: rnd(0, 1), sp: rnd(0.003, 0.0065) });
      }
    };

    const draw = (ts: number) => {
      if (!t0) t0 = ts;
      const el = ts - t0;
      const ignite = igniteRef.current;
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      tmx += (px - tmx) * 0.05;
      tmy += (py - tmy) * 0.05;
      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(ts * 0.001 * s.s + s.p);
        ctx.globalAlpha = s.b * tw * (1 - ignite * 0.4);
        ctx.fillStyle = "#cdd1ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const hz = H * 0.62;
      const g1 = ctx.createRadialGradient(W * 0.3, hz, 0, W * 0.3, hz, W * 0.55);
      g1.addColorStop(0, `rgba(139,92,246,${0.14 + 0.22 * ignite})`);
      g1.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);
      const g2 = ctx.createRadialGradient(W * 0.72, hz, 0, W * 0.72, hz, W * 0.55);
      g2.addColorStop(0, `rgba(34,211,238,${0.1 + 0.18 * ignite})`);
      g2.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      const ox = tmx * 14;
      const oy = tmy * 8;

      const cx = W / 2 + ox * 0.4;
      const cy = H * 0.46 + oy * 0.4;
      const coreR = 26 + 16 * ignite + 2 * Math.sin(ts * 0.004);
      const ccol = ignite > 0.05 ? "52,211,153" : "139,92,246";
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.4);
      cg.addColorStop(0, `rgba(${ccol},${0.26 + 0.4 * ignite})`);
      cg.addColorStop(1, `rgba(${ccol},0)`);
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.4, 0, 6.283);
      ctx.fill();

      for (let i = 1; i < nodes.length; i += 1) {
        const node = nodes[i];
        node.on += ((el > node.onAt ? 1 : 0) - node.on) * 0.08;
      }
      const ec = ignite > 0.05 ? "52,211,153" : "34,211,238";
      for (const edge of edges) {
        const A = nodes[edge.a];
        const B = nodes[edge.b];
        const act = Math.min(A.on, edge.b === 0 ? 1 : B.on);
        ctx.strokeStyle = `rgba(${ec},${0.05 + 0.14 * act + 0.22 * ignite})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(A.x + ox * 0.4, A.y + oy * 0.4);
        ctx.lineTo(B.x + ox * 0.4, B.y + oy * 0.4);
        ctx.stroke();
      }
      const pc = ignite > 0.05 ? "52,211,153" : "125,211,252";
      for (const pulse of pulses) {
        const e = edges[pulse.e];
        const A = nodes[e.a];
        const B = nodes[e.b];
        pulse.t += pulse.sp * (1 + ignite * 2.6);
        if (pulse.t > 1) pulse.t = 0;
        const x = A.x + (B.x - A.x) * pulse.t + ox * 0.4;
        const y = A.y + (B.y - A.y) * pulse.t + oy * 0.4;
        ctx.fillStyle = `rgba(${pc},0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, 6.283);
        ctx.fill();
      }
      const nb = ignite > 0.05 ? "52,211,153" : "167,139,250";
      for (let i = 1; i < nodes.length; i += 1) {
        const node = nodes[i];
        const pl = 0.6 + 0.4 * Math.sin(ts * 0.002 + node.seed);
        ctx.globalAlpha = node.on;
        ctx.fillStyle = `rgba(${nb},${0.5 + 0.5 * pl})`;
        ctx.beginPath();
        ctx.arc(node.x + ox * 0.4, node.y + oy * 0.4, node.r, 0, 6.283);
        ctx.fill();
        ctx.globalAlpha = node.on * 0.22;
        ctx.beginPath();
        ctx.arc(node.x + ox * 0.4, node.y + oy * 0.4, node.r * 3, 0, 6.283);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.save();
      const sc = 1 + 0.08 * ignite;
      ctx.translate(W / 2, H * 0.85);
      ctx.scale(sc, sc);
      ctx.translate(-W / 2, -H * 0.85);
      for (const ly of layers) {
        const off = tmx * ly.depth;
        ctx.save();
        ctx.translate(off, 0);
        for (const bld of ly.blds) {
          ctx.fillStyle = ly.col;
          ctx.fillRect(bld.x, bld.base - bld.h, bld.w, bld.h);
          for (const win of bld.wins) {
            const on = win.lit || ignite > win.rise;
            if (on) {
              ctx.fillStyle = ly.lit;
              ctx.globalAlpha = 0.85;
            } else {
              ctx.fillStyle = ly.win;
              ctx.globalAlpha = 0.5;
            }
            ctx.fillRect(win.x, win.y, 5, 5);
          }
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      pointerRef.current = { x: (e.clientX / window.innerWidth - 0.5) * -1, y: (e.clientY / window.innerHeight - 0.5) * -1 };
    };

    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onPointer);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [show, reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to bilalahamad.com — select enter to continue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: reduced ? 1 : 1.14,
            transition: { duration: reduced ? 0.25 : 0.85, ease: [0.4, 0, 0.2, 1] },
          }}
          transition={{ duration: reduced ? 0.2 : 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#09090b",
            overflow: "hidden",
            transformOrigin: "50% 46%",
            willChange: "opacity, transform",
          }}
        >
          <style>{`@keyframes ba-shimmer{to{background-position:-200% center}}`}</style>
          {!reduced && (
            <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
          )}
          {reduced && (
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 30% 55%, rgba(139,92,246,0.16), transparent), radial-gradient(60% 50% at 72% 55%, rgba(34,211,238,0.12), transparent)" }} />
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: entering ? 0 : 1, y: entering ? -8 : 0, scale: entering ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 1.5rem",
              pointerEvents: entering ? "none" : "auto",
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: "0.32em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 16 }}>
              Embedded firmware · systems QA
            </div>
            <div
              style={{
                fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                backgroundImage: "linear-gradient(100deg,#e4e4e7,#a78bfa,#22d3ee,#e4e4e7)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "ba-shimmer 4.5s linear infinite",
              }}
            >
              Bilal Ahamad
            </div>
            <p style={{ fontSize: 14, color: "#a1a1aa", marginTop: 14, maxWidth: 380 }}>
              Lead engineer — autonomy, IoT and safety-critical systems
            </p>
            <button
              ref={buttonRef}
              type="button"
              onClick={handleEnter}
              style={{
                marginTop: 28,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 30px",
                borderRadius: 999,
                border: "0.5px solid rgba(139,92,246,0.55)",
                background: "rgba(139,92,246,0.14)",
                color: "#ede9fe",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              Enter
              <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>→</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
