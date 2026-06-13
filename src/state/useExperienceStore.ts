import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Phase =
  | "threshold"
  | "awakening"
  | "discovery"
  | "memories"
  | "impossible"
  | "revelation"
  | "finale";

export type CameraMode = "FREE" | "RAIL" | "BLEND";

export type QualityTier = "low" | "medium" | "high" | "ultra";

interface ExperienceState {
  phase: Phase;
  cameraMode: CameraMode;
  quality: QualityTier;
  audioUnlocked: boolean;
  gravity: [number, number, number];
  discoveredObjects: Set<string>;
  activeMemoryId: string | null;
  progress: number;
  setPhase: (p: Phase) => void;
  setCameraMode: (m: CameraMode) => void;
  setQuality: (q: QualityTier) => void;
  unlockAudio: () => void;
  setGravity: (g: [number, number, number]) => void;
  discover: (id: string) => void;
  setActiveMemory: (id: string | null) => void;
  setProgress: (v: number) => void;
}

export const useExperienceStore = create<ExperienceState>()(
  subscribeWithSelector((set) => ({
    phase: "threshold",
    cameraMode: "FREE",
    quality: "high",
    audioUnlocked: false,
    gravity: [0, -9.81, 0],
    discoveredObjects: new Set(),
    activeMemoryId: null,
    progress: 0,
    setPhase: (phase) => set({ phase }),
    setCameraMode: (cameraMode) => set({ cameraMode }),
    setQuality: (quality) => set({ quality }),
    unlockAudio: () => set({ audioUnlocked: true }),
    setGravity: (gravity) => set({ gravity }),
    discover: (id) =>
      set((s) => {
        const next = new Set(s.discoveredObjects);
        next.add(id);
        return { discoveredObjects: next };
      }),
    setActiveMemory: (activeMemoryId) => set({ activeMemoryId }),
    setProgress: (progress) => set({ progress }),
  })),
);
