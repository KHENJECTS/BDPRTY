"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";
import { IMPOSSIBLE } from "@/lib/constants";
import { PHASE_FLOW } from "@/experience/phases/phaseConfig";
import {
  useCinematicRail,
  railLookAt,
} from "@/experience/camera/useCinematicRail";
import { FloatingIsland } from "../props/FloatingIsland";

// Sprint 4 — Zona Impossible: realm terbalik. Gravitasi sudah dibalik oleh
// Director ([0, +9.81, 0]) saat fase ini sehingga pulau "menggantung" tinggi.
// Kamera berpindah ke mode RAIL (phaseConfig): kita menyusuri spline
// IMPOSSIBLE.railPoints selama railDuration, lalu memicu transisi ke
// 'revelation'. railTarget/railLookAt ditulis di sini & dibaca CameraDirector
// (mutasi ref/shared vector, tanpa setState — lihat §4 aturan).
export function ImpossibleZone() {
  const { sample } = useCinematicRail(IMPOSSIBLE.railPoints);
  const elapsed = useRef(0);
  const advanced = useRef(false);

  useFrame((_, dt) => {
    const store = useExperienceStore.getState();
    if (store.phase !== "impossible") return;

    // fokus kamera ke pusat realm terbalik selama fase ini.
    railLookAt.set(
      IMPOSSIBLE.lookAt[0],
      IMPOSSIBLE.lookAt[1],
      IMPOSSIBLE.lookAt[2],
    );

    elapsed.current += dt;
    const t = Math.min(elapsed.current / IMPOSSIBLE.railDuration, 1);
    sample(t); // menulis railTarget; CameraDirector men-damp kamera ke sana

    if (!advanced.current && t >= 1) {
      advanced.current = true;
      const next = PHASE_FLOW.impossible.next;
      if (next) store.setPhase(next);
    }
  });

  return (
    <group>
      {IMPOSSIBLE.islands.map((isl, i) => (
        <FloatingIsland
          key={i}
          position={isl.pos}
          scale={isl.scale}
          seed={isl.seed}
        />
      ))}
    </group>
  );
}
