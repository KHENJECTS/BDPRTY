"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useExperienceStore } from "@/state/useExperienceStore";
import { useProgressiveAssets } from "@/hooks/useProgressiveAssets";

// Variants di-extract jadi const agar JSX tetap single-brace & rapi
const overlayShown = { opacity: 1 };
const overlayExit = { opacity: 0, transition: { duration: 1.2 } };
const breatheAnimate = { scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] };
const breatheTransition = {
  duration: 3.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

// "Napas": progress asset disembunyikan sebagai denyut titik cahaya (§2, T-0).
// Tampil hanya saat masih di threshold & loader R3F aktif.
export function LoaderBreath() {
  const phase = useExperienceStore((s) => s.phase);
  const { active } = useProgressiveAssets();
  const visible = phase === "threshold" && active;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black"
          initial={overlayShown}
          animate={overlayShown}
          exit={overlayExit}
        >
          <motion.span
            className="block h-3 w-3 rounded-full bg-white"
            animate={breatheAnimate}
            transition={breatheTransition}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
