"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";
import { CameraDirector } from "./camera/CameraDirector";
import { PlayerController } from "./player/PlayerController";
import { World } from "./world/World";
import { usePhaseTimeline } from "./phases/usePhaseTimeline";

export function Director() {
  const phase = useExperienceStore((s) => s.phase);
  usePhaseTimeline(); // GSAP master timeline yg mendorong transisi phase

  useEffect(() => {
    // contoh: ubah gravitasi saat masuk realm terbalik
    const set = useExperienceStore.getState();
    if (phase === "impossible") set.setGravity([0, 9.81, 0]);
    else set.setGravity([0, -9.81, 0]);
  }, [phase]);

  return (
    <>
      <CameraDirector />
      <PlayerController />
      <World />
    </>
  );
}
