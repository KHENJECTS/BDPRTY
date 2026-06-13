"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useExperienceStore } from "@/state/useExperienceStore";
import { useMemories } from "@/hooks/useMemories";

// Variants di-extract jadi const agar JSX tetap single-brace & rapi
const wrapInitial = { opacity: 0 };
const wrapAnimate = { opacity: 1 };
const wrapExit = { opacity: 0 };
const wrapTransition = { duration: 2.4, ease: "easeInOut" as const };
const lineInitial = { opacity: 0, y: 12 };
const lineAnimate = { opacity: 1, y: 0 };
const nameTransition = {
  duration: 2.6,
  delay: 1.2,
  ease: "easeInOut" as const,
};
const subTransition = {
  duration: 2.4,
  delay: 2.6,
  ease: "easeInOut" as const,
};

// Overlay penutup (DOM, di luar Canvas — pola `DiegeticHints`). Muncul saat
// `phase === "finale"` dengan pesan hangat + nama peraya (dari `memories.json`
// via `useMemories`). Tetap minimal demi No-Chrome Doctrine (§1.1);
// `pointer-events-none` agar tak mengganggu scene.
export function FinaleOverlay() {
  const phase = useExperienceStore((s) => s.phase);
  const { data } = useMemories();
  const firstName = data?.celebrant.firstName ?? "";

  return (
    <AnimatePresence>
      {phase === "finale" ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-end pb-24 text-center"
          initial={wrapInitial}
          animate={wrapAnimate}
          exit={wrapExit}
          transition={wrapTransition}
        >
          <motion.h1
            className="text-3xl font-light tracking-[0.3em] text-white/90 md:text-5xl"
            initial={lineInitial}
            animate={lineAnimate}
            transition={nameTransition}
          >
            selamat ulang tahun{firstName ? `, ${firstName}` : ""}
          </motion.h1>
          <motion.p
            className="mt-6 text-xs uppercase tracking-[0.5em] text-white/50"
            initial={lineInitial}
            animate={lineAnimate}
            transition={subTransition}
          >
            perjalanan ini untukmu
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
