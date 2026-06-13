"use client";

import { useExperienceStore } from "@/state/useExperienceStore";
import { AwakeningZone } from "../world/zones/AwakeningZone";
import { DiscoveryZone } from "../world/zones/DiscoveryZone";
import { MemoryZone } from "../world/zones/MemoryZone";
import { ImpossibleZone } from "../world/zones/ImpossibleZone";
import { RevelationZone } from "../world/zones/RevelationZone";

// Memetakan phase -> zona aktif. Subscribe selektif (hanya slice `phase`) agar
// re-render minimal; zona ditukar saat fase berubah.
//
// Sprint 1: Awakening. Sprint 2: Discovery. Sprint 3: Memory.
// Zona berikut (Inverted, Revelation, Finale) menyusul di sini tanpa mengubah
// arsitektur World/Director. Sementara zona lanjutan belum ada, fase >= memories
// menampilkan MemoryZone agar dunia tidak kosong.
export function PhaseManager() {
  const phase = useExperienceStore((s) => s.phase);

  if (phase === "threshold" || phase === "awakening") {
    return <AwakeningZone />;
  }
  if (phase === "discovery") {
    return <DiscoveryZone />;
  }
  if (phase === "memories") {
    return <MemoryZone />;
  }
  if (phase === "impossible") {
    return <ImpossibleZone />;
  }
  if (phase === "revelation") {
    return <RevelationZone />;
  }
  // finale (Sprint 6) belum dibuat: MemoryZone sbg placeholder.
  return <MemoryZone />;
}
