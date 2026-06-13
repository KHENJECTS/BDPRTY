import { useExperienceStore } from "./useExperienceStore";

// Selector hooks ringkas agar komponen hanya re-render saat slice-nya berubah.
// (Logika per-frame tetap membaca via useExperienceStore.getState() di useFrame.)
export const usePhase = () => useExperienceStore((s) => s.phase);
export const useCameraMode = () => useExperienceStore((s) => s.cameraMode);
export const useQuality = () => useExperienceStore((s) => s.quality);
export const useAudioUnlocked = () =>
  useExperienceStore((s) => s.audioUnlocked);
export const useProgress = () => useExperienceStore((s) => s.progress);
export const useActiveMemory = () =>
  useExperienceStore((s) => s.activeMemoryId);
