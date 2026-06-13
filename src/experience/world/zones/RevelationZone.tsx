"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";
import { REVELATION } from "@/lib/constants";
import { PHASE_FLOW } from "@/experience/phases/phaseConfig";
import {
  useCinematicRail,
  railLookAt,
} from "@/experience/camera/useCinematicRail";
import { FaceParticles } from "../props/FaceParticles";

// Sprint 5 — Zona Revelation: puncak emosional. Partikel berhamburan menyatu
// jadi wajah sang peraya (`FaceParticles`) sementara kamera RAIL mendekat dengan
// khidmat. Pola identik `ImpossibleZone`: menyusuri spline REVELATION.railPoints
// selama railDuration, lalu memicu transisi ke 'finale'. railTarget/railLookAt
// ditulis di sini & dibaca CameraDirector (mutasi shared vector, tanpa setState).
export function RevelationZone() {
  const { sample } = useCinematicRail(REVELATION.railPoints);
  const elapsed = useRef(0);
  const advanced = useRef(false);

  useFrame((_, dt) => {
    const store = useExperienceStore.getState();
    if (store.phase !== "revelation") return;

    railLookAt.set(
      REVELATION.lookAt[0],
      REVELATION.lookAt[1],
      REVELATION.lookAt[2],
    );

    elapsed.current += dt;
    const t = Math.min(elapsed.current / REVELATION.railDuration, 1);
    sample(t); // menulis railTarget; CameraDirector men-damp kamera ke sana

    if (!advanced.current && t >= 1) {
      advanced.current = true;
      const next = PHASE_FLOW.revelation.next;
      if (next) store.setPhase(next);
    }
  });

  return (
    <group>
      <FaceParticles />
    </group>
  );
}
