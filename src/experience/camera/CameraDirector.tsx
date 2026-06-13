"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { damp3 } from "@/lib/math";

const tmpTarget = new THREE.Vector3();

export function CameraDirector() {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3(0, 2, 8));

  useFrame((_, dt) => {
    const mode = useExperienceStore.getState().cameraMode;
    if (mode === "RAIL" || mode === "BLEND") {
      // posisi target diisi oleh useCinematicRail (menulis ke desired.current)
      damp3(camera.position, desired.current, 0.25, dt);
      camera.lookAt(tmpTarget.set(0, 1.5, 0));
    }
    // mode FREE: PlayerController yg menggerakkan kamera
  });

  return null;
}
