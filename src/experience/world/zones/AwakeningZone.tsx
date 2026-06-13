"use client";

import { FloatingIsland } from "../props/FloatingIsland";
import { AWAKENING } from "@/lib/constants";

type DistantIsland = {
  pos: [number, number, number];
  scale: number;
  seed: number;
};

// Sprint 1 — Zona Awakening: 1 pulau utama tempat user "membuka mata" +
// beberapa pulau parallax di kejauhan (lihat Storyboard Phase 1, Shot 1.5).
export function AwakeningZone() {
  const distantIslands: DistantIsland[] = [
    { pos: [-26, -6, -40], scale: 1.6, seed: 2 },
    { pos: [34, 4, -64], scale: 2.4, seed: 3 },
    { pos: [12, -14, -30], scale: 1.1, seed: 4 },
    { pos: [-44, 10, -90], scale: 3.2, seed: 5 },
  ];

  return (
    <group>
      <FloatingIsland
        position={AWAKENING.islandPosition}
        scale={1.4}
        seed={1}
      />
      {distantIslands.map((isl, i) => (
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
