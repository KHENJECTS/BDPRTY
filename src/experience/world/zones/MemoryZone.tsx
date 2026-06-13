"use client";

import { useRef } from "react";
import { useMemories } from "@/hooks/useMemories";
import { useExperienceStore } from "@/state/useExperienceStore";
import { PHASE_FLOW } from "@/experience/phases/phaseConfig";
import { MEMORY } from "@/lib/constants";
import { MemoryPortal } from "../props/MemoryPortal";
import { MemoryPhoto } from "../props/MemoryPhoto";
import { MemoryTree } from "../props/MemoryTree";
import { Constellation } from "../props/Constellation";

// Zona Memory: membaca memories.json lalu menempatkan satu portal interaktif per
// kenangan (+ dekor ambient sesuai placement). Membuka kenangan mengisi
// activeMemoryId (di MemoryPortal). Saat kenangan inti telah dibuka -> transisi
// memories -> impossible (store + PHASE_FLOW). Hitungan kenangan dibuka disimpan
// di ref (tanpa setState); logika transisi dipusatkan di sini.
export function MemoryZone() {
  const { memories } = useMemories();
  const opened = useRef<Set<string>>(new Set());

  const handleOpen = (id: string) => {
    opened.current.add(id);
    const required = Math.max(
      1,
      Math.ceil(memories.length * MEMORY.requiredRatio),
    );
    const state = useExperienceStore.getState();
    if (state.phase === "memories" && opened.current.size >= required) {
      const next = PHASE_FLOW.memories.next;
      if (next) state.setPhase(next);
    }
  };

  return (
    <group>
      {memories.map((mem) => (
        <group key={mem.id}>
          <MemoryPortal
            id={mem.id}
            position={mem.position}
            onOpen={handleOpen}
          />
          <MemoryPhoto
            id={mem.id}
            position={[
              mem.position[0],
              mem.position[1] + MEMORY.photoLift,
              mem.position[2],
            ]}
          />
          {mem.placement === "tree" && (
            <MemoryTree
              position={[
                mem.position[0],
                mem.position[1] - MEMORY.portalRadius - 2,
                mem.position[2],
              ]}
            />
          )}
          {mem.placement === "constellation" && (
            <Constellation center={mem.position} />
          )}
        </group>
      ))}
    </group>
  );
}
