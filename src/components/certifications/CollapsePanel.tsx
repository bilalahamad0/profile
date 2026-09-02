"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Height animates 0 → auto on permanently-mounted content: every credential
// detail stays in the server-rendered HTML (ATS requirement) whether the row
// is open or not. Never gate panel children behind conditional rendering.
const EASE = [0.32, 0.72, 0, 1] as const;

const panelVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0.4,
    transition: { duration: 0.4, ease: EASE, when: "afterChildren" },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: EASE,
      when: "beforeChildren",
      delayChildren: 0.12,
      staggerChildren: 0.045,
    },
  },
};

const reducedPanelVariants: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0 } },
  open: { height: "auto", opacity: 1, transition: { duration: 0 } },
};

/** Item variants for staggered course rows inside an opening panel.
 *  (whileInView misfires inside a height-0 container, so children inherit
 *  these states from the panel instead.) */
export const panelItemVariants: Variants = {
  collapsed: { opacity: 0, x: -12, transition: { duration: 0.12 } },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

/** Variant pair for badge tiles in the 2-3-2 grid. */
export const panelBadgeVariants: Variants = {
  collapsed: { opacity: 0, scale: 0.85, y: 10, transition: { duration: 0.12 } },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

/** "Power-on" bloom for the parent badge halo when a panel opens. */
export const haloBloomVariants: Variants = {
  collapsed: { opacity: 0.5, scale: 1 },
  open: {
    opacity: [0, 0.9, 0.6],
    scale: [0.7, 1.15, 1],
    transition: { duration: 0.9, delay: 0.25 },
  },
};

export function CollapsePanel({
  id,
  labelledBy,
  open,
  children,
}: {
  id: string;
  labelledBy: string;
  open: boolean;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      id={id}
      // Deliberately NOT role="region". Each panel sits inside a
      // <section aria-labelledby={headingId}> wrapper that is already a region
      // landmark with this exact name, so the role made every specialization
      // row two identically-named landmarks (axe `landmark-unique`). ARIA APG
      // treats the role as optional here and warns against landmark
      // proliferation; the toggle's aria-expanded/aria-controls carry the
      // accordion semantics.
      aria-labelledby={labelledBy}
      initial={false}
      animate={open ? "open" : "collapsed"}
      variants={reduceMotion ? reducedPanelVariants : panelVariants}
      inert={open ? undefined : true}
      data-collapsible
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
