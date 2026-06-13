"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";

// Variants di-extract jadi const agar JSX tetap single-brace & rapi
const hintInitial = { opacity: 0, y: 8 };
const hintAnimate = { opacity: 1, y: 0 };
const hintExit = { opacity: 0, y: -8, transition: { duration: 1.6 } };
const hintTransition = { duration: 2.0, ease: "easeInOut" as const };

// Hint gerak diegetik yang halus: muncul sebentar lalu memudar di awal
// Awakening (§2). Tetap minimal demi No-Chrome Doctrine (§1.1).
export function DiegeticHints() {
  const phase = useExperienceStore((s) => s.phase);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (phase !== "awakening") return;
    setShow(true);
    const id = setTimeout(() => setShow(false), 5200);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="pointer-events-none absolute bottom-16 left-0 right-0 z-30 flex justify-center"
          initial={hintInitial}
          animate={hintAnimate}
          exit={hintExit}
          transition={hintTransition}
        >
          <span className="text-xs uppercase tracking-[0.5em] text-white/40">
            bergerak — wasd
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
