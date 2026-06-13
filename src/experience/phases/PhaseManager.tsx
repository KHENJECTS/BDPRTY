"use client";

import { useExperienceStore } from "@/state/useExperienceStore";
import { AwakeningZone } from "../world/zones/AwakeningZone";
import { DiscoveryZone } from "../world/zones/DiscoveryZone";

// Memetakan phase -> zona aktif. Subscribe selektif (hanya slice `phase`) agar
// re-render minimal; zona ditukar saat fase berubah.
//
// Sprint 1: Awakening. Sprint 2: Discovery (+ transisi ke memories).
// Zona berikut (Memory, Inverted, Revelation, Finale) menyusul di sini tanpa
// mengubah arsitektur World/Director. Sementara zona lanjutan belum ada,
// fase >= discovery tetap menampilkan DiscoveryZone agar dunia tidak kosong.
export function PhaseManager() {
  const phase = useExperienceStore((s) => s.phase);

  if (phase === "threshold" || phase === "awakening") {
    return <AwakeningZone />;
  }
  return <DiscoveryZone />;
}
