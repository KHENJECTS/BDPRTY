"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useExperienceStore } from "@/state/useExperienceStore";

// Variants di-extract jadi const agar JSX tetap single-brace & rapi
const overlayInitial = { opacity: 0 };
const overlayAnimate = { opacity: 1 };
const overlayExit = { opacity: 0, transition: { duration: 1.4 } };
const breatheAnimate = { opacity: [0.3, 1, 0.3] };
const breatheTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function Threshold() {
  const phase = useExperienceStore((s) => s.phase);
  const unlockAudio = useExperienceStore((s) => s.unlockAudio);
  const setPhase = useExperienceStore((s) => s.setPhase);
  const visible = phase === "threshold";

  const begin = async () => {
    unlockAudio();
    await document.body.requestPointerLock?.();
    setPhase("awakening");
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          onClick={begin}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white/80"
          initial={overlayInitial}
          animate={overlayAnimate}
          exit={overlayExit}
        >
          <motion.span
            className="text-lg tracking-[0.4em] uppercase"
            animate={breatheAnimate}
            transition={breatheTransition}
          >
            tarik napas
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
