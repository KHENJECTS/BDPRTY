import type { Phase } from "@/state/useExperienceStore";

export type PhaseVisual = {
  background: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientColor: string;
  ambientIntensity: number;
  sunColor: string;
  sunIntensity: number;
};

// Palet & mood lighting per fase (lihat §1.3 Bahasa Visual / Art Direction).
// Nilai ini didamp oleh PhaseEnvironment untuk transisi mood yang halus.
export const PHASE_VISUALS: Record<Phase, PhaseVisual> = {
  threshold: {
    background: "#000000",
    fogColor: "#05060f",
    fogNear: 5,
    fogFar: 60,
    ambientColor: "#1b2740",
    ambientIntensity: 0.2,
    sunColor: "#ffd9a0",
    sunIntensity: 0.4,
  },
  awakening: {
    background: "#070b1f",
    fogColor: "#16203f",
    fogNear: 8,
    fogFar: 130,
    ambientColor: "#2b3a66",
    ambientIntensity: 0.6,
    sunColor: "#ffcf8f",
    sunIntensity: 1.4,
  },
  discovery: {
    background: "#0a1622",
    fogColor: "#234a4a",
    fogNear: 14,
    fogFar: 200,
    ambientColor: "#3e6b63",
    ambientIntensity: 0.85,
    sunColor: "#ffe6b0",
    sunIntensity: 1.9,
  },
  memories: {
    background: "#1a0f1e",
    fogColor: "#3a2030",
    fogNear: 10,
    fogFar: 150,
    ambientColor: "#6b3f57",
    ambientIntensity: 0.9,
    sunColor: "#ffb27a",
    sunIntensity: 1.3,
  },
  impossible: {
    background: "#0a001a",
    fogColor: "#1a0535",
    fogNear: 6,
    fogFar: 240,
    ambientColor: "#3a1f7a",
    ambientIntensity: 0.7,
    sunColor: "#39f0ff",
    sunIntensity: 1.6,
  },
  revelation: {
    background: "#101018",
    fogColor: "#2a2a40",
    fogNear: 20,
    fogFar: 400,
    ambientColor: "#8888aa",
    ambientIntensity: 1.2,
    sunColor: "#ffffff",
    sunIntensity: 2.2,
  },
  finale: {
    background: "#fdf6e3",
    fogColor: "#f5e6c8",
    fogNear: 30,
    fogFar: 500,
    ambientColor: "#fff0d0",
    ambientIntensity: 1.6,
    sunColor: "#fff7e0",
    sunIntensity: 2.6,
  },
};

// Skydome (Awakening): gradient tiga-stop + arah matahari untuk god-glow.
export const SKY = {
  topColor: "#0a1a4f",
  midColor: "#3a2e6e",
  bottomColor: "#e6a45c",
  sunColor: "#ffe7bd",
  sunDir: [-0.4, 0.3, -0.85] as [number, number, number],
};

// Konstanta zona Awakening (Sprint 1).
export const AWAKENING = {
  islandPosition: [0, -2, -6] as [number, number, number],
  cameraFloatAmplitude: 0.25,
  cameraFloatSpeed: 0.35,
  birdCount: 24,
  moteCount: 600,
};

// Konstanta player (Sprint 2) — fly/hover bergaya dream-like, bukan physics berat.
export const PLAYER = {
  walkSpeed: 4,
  runSpeed: 9,
  accel: 0.18, // faktor lerp velocity (0..1) agar gerak halus
  lookSensitivity: 0.0022,
  jumpImpulse: 5.5,
  gravityScale: 0.35, // skala gravitasi store; <1 = terasa melayang (§4.3)
  floorY: 1.8, // ketinggian hover saat gravitasi ke bawah (clamp lantai)
  ceilingY: 80, // batas saat gravitasi terbalik (Sprint 4)
};

// Konstanta zona Discovery (Sprint 2).
export const DISCOVERY = {
  // Pulau-pulau penanda area discovery (pola parallax seperti Awakening).
  islands: [
    { pos: [0, -3, -10], scale: 1.8, seed: 11 },
    { pos: [-18, -7, -28], scale: 2.0, seed: 12 },
    { pos: [22, -2, -34], scale: 2.6, seed: 13 },
  ] as Array<{ pos: [number, number, number]; scale: number; seed: number }>,
  // Discoverables: orb bercahaya dengan radius proximity.
  orbs: [
    { id: "orb-echo", pos: [4, 1.5, -8], color: "#ffd27a" },
    { id: "orb-spark", pos: [-6, 2.2, -12], color: "#7adfff" },
    { id: "orb-bloom", pos: [1, 3.0, -16], color: "#ff9ad1" },
    { id: "orb-drift", pos: [9, 2.0, -20], color: "#b6ff8a" },
  ] as Array<{ id: string; pos: [number, number, number]; color: string }>,
  proximityRadius: 3.2, // jarak trigger penemuan
  glowRadius: 7, // jarak mulai highlight/scale halus
  requiredToAdvance: 3, // jumlah penemuan untuk lanjut ke 'memories'
  sfx: "/audio/discover.webm", // opsional; aman jika belum ada (Howler tak crash)
};

// ----------------------------------------------------------------------------
// Sprint 3 — Memory zone
// Konstanta zona kenangan (jarak interaksi, ukuran artefak, ambang transisi).
// ----------------------------------------------------------------------------
export const MEMORY = {
  portalRadius: 1.6, // jari-jari cakram portal kenangan
  photoSize: 2.2, // sisi bidang foto melayang
  photoLift: 2.6, // foto melayang di atas portal
  openRadius: 3.0, // jarak untuk membuka kenangan (setActiveMemory)
  glowRadius: 9, // jarak mulai aktivasi/cahaya portal
  requiredRatio: 1, // rasio kenangan yang harus dibuka -> lanjut ke 'impossible'
  constellationSpread: 36, // sebaran titik konstelasi
} as const;

// Konstanta zona Impossible (Sprint 4) — realm terbalik + rail kamera sinematik.
export const IMPOSSIBLE = {
  // Titik rail kamera (CatmullRom) menaiki realm terbalik; dipakai useCinematicRail.
  railPoints: [
    [0, 2, 8],
    [10, 6, 1],
    [7, 14, -10],
    [-9, 22, -8],
    [-5, 30, 6],
    [0, 27, 15],
  ] as Array<[number, number, number]>,
  railDuration: 18, // detik menempuh rail sebelum auto-advance ke 'revelation'
  lookAt: [0, 14, -4] as [number, number, number], // fokus kamera ke pusat realm
  // Pulau terapung yang kini "menggantung" tinggi (gravitasi terbalik, §4.3).
  islands: [
    { pos: [0, 14, -6], scale: 2.4, seed: 41 },
    { pos: [-14, 22, -16], scale: 1.6, seed: 42 },
    { pos: [12, 26, -10], scale: 2.0, seed: 43 },
    { pos: [4, 34, 4], scale: 1.4, seed: 44 },
  ] as Array<{ pos: [number, number, number]; scale: number; seed: number }>,
};

// Konstanta zona Revelation (Sprint 5) — point-cloud wajah + rail kamera khidmat.
export const REVELATION = {
  facePosition: [0, 6, -10] as [number, number, number], // pusat wajah di dunia
  faceScale: 5, // skala kepala ellipsoid (unit -> dunia)
  assembleDuration: 7, // detik: partikel berhamburan -> menyatu jadi wajah
  // Rail kamera mendekati wajah dengan khidmat (dari jauh -> dekat).
  railPoints: [
    [0, 7, 26],
    [6, 8, 16],
    [-4, 7, 9],
    [0, 6, 3],
  ] as Array<[number, number, number]>,
  lookAt: [0, 6, -10] as [number, number, number], // selalu menatap wajah
  railDuration: 20, // detik menempuh rail sebelum auto-advance ke 'finale'
};
