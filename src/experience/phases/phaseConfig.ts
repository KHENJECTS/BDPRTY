import type { CameraMode, Phase } from "@/state/useExperienceStore";

export type PhaseConfig = {
  cameraMode: CameraMode;
  // Durasi minimal (detik) sebelum auto-advance diizinkan; null = lanjut manual.
  minDuration: number | null;
  next: Phase | null;
};

// Alur fase (lihat §2 User Journey + §11 Roadmap). cameraMode di-set otomatis
// oleh usePhaseTimeline saat phase berubah.
export const PHASE_FLOW: Record<Phase, PhaseConfig> = {
  threshold: { cameraMode: "FREE", minDuration: null, next: "awakening" },
  awakening: { cameraMode: "FREE", minDuration: 8, next: "discovery" },
  discovery: { cameraMode: "FREE", minDuration: null, next: "memories" },
  memories: { cameraMode: "FREE", minDuration: null, next: "impossible" },
  impossible: { cameraMode: "RAIL", minDuration: null, next: "revelation" },
  revelation: { cameraMode: "RAIL", minDuration: null, next: "finale" },
  finale: { cameraMode: "RAIL", minDuration: null, next: null },
};

export const PHASE_ORDER: Phase[] = [
  "threshold",
  "awakening",
  "discovery",
  "memories",
  "impossible",
  "revelation",
  "finale",
];
