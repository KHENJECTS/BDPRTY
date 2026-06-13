"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useExperienceStore } from "@/state/useExperienceStore";
import { damp3 } from "@/lib/math";
import { railLookAt, railTarget } from "./useCinematicRail";

// Saat mode RAIL/BLEND, kamera di-damp menuju railTarget & menatap railLookAt.
// Keduanya diisi oleh rail sinematik fase aktif (mis. ImpossibleZone Sprint 4)
// lewat useCinematicRail — sehingga menambah sprint sinematik tidak perlu
// menyentuh komponen ini. Mode FREE: PlayerController yang menggerakkan kamera.
export function CameraDirector() {
  const { camera } = useThree();

  useFrame((_, dt) => {
    const mode = useExperienceStore.getState().cameraMode;
    if (mode === "RAIL" || mode === "BLEND") {
      damp3(camera.position, railTarget, 0.25, dt);
      camera.lookAt(railLookAt);
    }
  });

  return null;
}
