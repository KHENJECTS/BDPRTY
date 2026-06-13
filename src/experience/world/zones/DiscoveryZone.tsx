"use client";

import { FloatingIsland } from "../props/FloatingIsland";
import { Discoverable } from "../props/Discoverable";
import { DISCOVERY } from "@/lib/constants";

// Sprint 2 — Zona Discovery: lanjutan Awakening. Beberapa pulau parallax + orb
// "discoverable" yang memberi feedback proximity dan, setelah cukup ditemukan,
// memicu transisi fase ke 'memories' (lihat §11 Roadmap Sprint 2).
export function DiscoveryZone() {
  return (
    <group>
      {DISCOVERY.islands.map((isl, i) => (
        <FloatingIsland
          key={i}
          position={isl.pos}
          scale={isl.scale}
          seed={isl.seed}
        />
      ))}
      {DISCOVERY.orbs.map((orb) => (
        <Discoverable
          key={orb.id}
          id={orb.id}
          position={orb.pos}
          color={orb.color}
        />
      ))}
    </group>
  );
}
