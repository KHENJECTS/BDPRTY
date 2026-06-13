"use client";

import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useState } from "react";
import { Director } from "./Director";
import { PostFX } from "./fx/PostFX";
import { Threshold } from "@/ui/Threshold";
import { LoaderBreath } from "@/ui/LoaderBreath";
import { DiegeticHints } from "@/ui/DiegeticHints";
import { FinaleOverlay } from "@/ui/FinaleOverlay";
import { useExperienceStore } from "@/state/useExperienceStore";

export function Experience() {
  const setQuality = useExperienceStore((s) => s.setQuality);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  // Objek di-extract jadi const agar JSX tetap rapi (single-brace props)
  const glOptions = {
    antialias: false,
    powerPreference: "high-performance" as const,
    alpha: false,
  };
  const cameraOptions = {
    fov: 55,
    near: 0.1,
    far: 2000,
    position: [0, 2, 8] as [number, number, number],
  };

  return (
    <>
      <Canvas shadows dpr={dpr} gl={glOptions} camera={cameraOptions}>
        <PerformanceMonitor
          onIncline={() => setQuality("ultra")}
          onDecline={() => {
            setQuality("low");
            setDpr([0.6, 1]);
          }}
        />
        <color attach="background" args={["#05060f"]} />
        <Suspense fallback={null}>
          <Director />
          <PostFX />
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
      {/* DOM overlays (bukan WebGL) */}
      <LoaderBreath />
      <Threshold />
      {/* Sprint 1: hint gerak diegetik yang muncul-hilang di awal Awakening */}
      <DiegeticHints />
      {/* Sprint 6: pesan penutup + nama peraya, muncul saat phase === "finale" */}
      <FinaleOverlay />
    </>
  );
}
