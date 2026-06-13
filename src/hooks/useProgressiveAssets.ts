"use client";

import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useExperienceStore } from "@/state/useExperienceStore";

// Menjembatani loader R3F -> store.progress agar LoaderBreath bisa menyembunyikan
// loading sebagai "napas" titik cahaya (§2, T-0 Preload & Threshold).
export function useProgressiveAssets() {
  const { progress, active } = useProgress();
  const setProgress = useExperienceStore((s) => s.setProgress);

  useEffect(() => {
    setProgress(progress / 100);
  }, [progress, setProgress]);

  return { progress: progress / 100, active };
}
