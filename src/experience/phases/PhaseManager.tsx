"use client";

import { AwakeningZone } from "../world/zones/AwakeningZone";

// Memetakan phase -> zona aktif (di-stream by proximity/phase di sprint lanjut).
//
// Sprint 1: hanya Awakening Zone yang hidup. Zona berikutnya
// (Discovery, Memory, Inverted, Revelation, Finale) akan ditambahkan di sini
// pada Sprint 2+ tanpa mengubah arsitektur World/Director.
export function PhaseManager() {
  return <AwakeningZone />;
}
