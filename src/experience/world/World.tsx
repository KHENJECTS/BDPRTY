"use client";

import { PhaseManager } from "../phases/PhaseManager";
import { PhaseEnvironment } from "./PhaseEnvironment";
import { Birds } from "./systems/Birds";
import { Clouds } from "./systems/Clouds";
import { AmbientAudio } from "./systems/AmbientAudio";
import { ParticleField } from "../fx/ParticleField";

// World root (§4.1): lighting/fog per phase + sistem hidup persisten + zona aktif.
// Sistem hidup berjalan lintas zona; PhaseManager memilih zona sesuai phase.
export function World() {
  return (
    <>
      <PhaseEnvironment />
      <PhaseManager />
      {/* Living systems (persisten lintas zona) */}
      <Clouds />
      <Birds />
      <ParticleField />
      <AmbientAudio />
    </>
  );
}
