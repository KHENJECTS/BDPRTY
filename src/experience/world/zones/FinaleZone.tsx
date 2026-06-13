"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";
import { FINALE } from "@/lib/constants";
import {
  useCinematicRail,
  railLookAt,
} from "@/experience/camera/useCinematicRail";
import { FaceParticles } from "../props/FaceParticles";
import { ParticleField } from "@/experience/fx/ParticleField";
import { DisintegrationFX } from "@/experience/fx/DisintegrationFX";

// Sprint 6 — Zona Finale: penutup hangat. Wajah peraya (`FaceParticles`) tetap
// hadir sementara kamera RAIL menjauh perlahan lalu MENAHAN — `PHASE_FLOW.finale`
// `next === null` (akhir perjalanan), jadi JANGAN panggil `setPhase`. Pesan
// penutup ditangani `FinaleOverlay` (DOM, di `Experience.tsx`). railTarget/
// railLookAt ditulis di sini & dibaca `CameraDirector` (mutasi shared vector,
// tanpa setState). Pola identik `RevelationZone`, minus transisi fase.
export function FinaleZone() {
  const { sample } = useCinematicRail(FINALE.railPoints);
  const elapsed = useRef(0);

  useFrame((_, dt) => {
    const store = useExperienceStore.getState();
    if (store.phase !== "finale") return;

    railLookAt.set(FINALE.lookAt[0], FINALE.lookAt[1], FINALE.lookAt[2]);

    elapsed.current += dt;
    const t = Math.min(elapsed.current / FINALE.railDuration, 1);
    sample(t); // menulis railTarget; CameraDirector men-damp kamera ke sana
    // next === null: akhir perjalanan — tanpa transisi fase. Saat t === 1 kamera
    // ditahan di titik akhir (sample(1) idempoten).
  });

  return (
    <group>
      <FaceParticles />
      <ParticleField color="#fff0d0" area={60} />
      {/* Sprint 7: bara perayaan yang naik perlahan (additif, tier-gated) */}
      <DisintegrationFX color="#ffd9a0" area={22} rise={16} />
    </group>
  );
}
