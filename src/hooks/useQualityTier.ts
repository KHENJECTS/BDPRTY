"use client";

import {
  useExperienceStore,
  type QualityTier,
} from "@/state/useExperienceStore";
import { AWAKENING } from "@/lib/constants";

export type TierBudget = {
  birdCount: number;
  moteCount: number;
  shadows: boolean;
};

// Anggaran render adaptif per quality tier (§9). PerformanceMonitor di
// Experience menaikkan/menurunkan tier; sistem hidup membaca anggaran ini.
const BUDGETS: Record<QualityTier, TierBudget> = {
  low: { birdCount: 8, moteCount: 150, shadows: false },
  medium: { birdCount: 16, moteCount: 350, shadows: true },
  high: {
    birdCount: AWAKENING.birdCount,
    moteCount: AWAKENING.moteCount,
    shadows: true,
  },
  ultra: { birdCount: 40, moteCount: 1200, shadows: true },
};

export function useQualityTier(): TierBudget {
  const quality = useExperienceStore((s) => s.quality);
  return BUDGETS[quality];
}
