"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { PHASE_VISUALS } from "@/lib/constants";
import { damp } from "@/lib/math";
import { SkyDome } from "./props/SkyDome";

// Lighting rig + fog yang nilainya didamp menuju target phase aktif (§4.1).
// Director men-set phase; di sini mood (warna/kabut/intensitas) ditransisikan.
export function PhaseEnvironment() {
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.Fog("#16203f", 8, 130), []);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);

  const tmpFog = useMemo(() => new THREE.Color(), []);
  const tmpAmbient = useMemo(() => new THREE.Color(), []);
  const tmpSun = useMemo(() => new THREE.Color(), []);

  useFrame((_, dt) => {
    const v = PHASE_VISUALS[useExperienceStore.getState().phase];
    const k = 1 - Math.exp(-3 * dt); // faktor lerp warna frame-independent

    if (!scene.fog) scene.fog = fog;
    const f = scene.fog as THREE.Fog;
    tmpFog.set(v.fogColor);
    f.color.lerp(tmpFog, k);
    f.near = damp(f.near, v.fogNear, 2, dt);
    f.far = damp(f.far, v.fogFar, 2, dt);

    if (ambientRef.current) {
      tmpAmbient.set(v.ambientColor);
      ambientRef.current.color.lerp(tmpAmbient, k);
      ambientRef.current.intensity = damp(
        ambientRef.current.intensity,
        v.ambientIntensity,
        3,
        dt,
      );
    }
    if (sunRef.current) {
      tmpSun.set(v.sunColor);
      sunRef.current.color.lerp(tmpSun, k);
      sunRef.current.intensity = damp(
        sunRef.current.intensity,
        v.sunIntensity,
        3,
        dt,
      );
    }
  });

  const sunPos: [number, number, number] = [-40, 24, -80];
  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.2} color="#1b2740" />
      <directionalLight
        ref={sunRef}
        position={sunPos}
        intensity={0.4}
        color="#ffcf8f"
        castShadow
      />
      <SkyDome />
    </>
  );
}
