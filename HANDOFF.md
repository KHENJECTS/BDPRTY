# HANDOFF — The Impossible Journey

> File ini ditulis agar siapa pun (atau sesi AI berikutnya) bisa melanjutkan tanpa
> menganalisis ulang project. Baca ini + `NEXT_TASK.md` lalu langsung lanjut.

**Terakhir diperbarui:** akhir sesi Sprint 0 + Sprint 1.
**Stack:** Next.js 15 · TS · R3F · three · drei · @react-three/postprocessing · GSAP · framer-motion · zustand · howler · GLSL.

---

## 1. Aturan yang dipatuhi (jangan dilanggar)

- Jangan ulang pekerjaan selesai · jangan redesign · jangan refactor besar tanpa alasan.
- Pertahankan arsitektur (§4 bible) dan style coding yang ada.
- Konvensi style yang HARUS diikuti:
  - `"use client"` di atas tiap komponen/hook yang pakai React/three.
  - Alias `@/*` -> `src/*`.
  - Props objek/array di-_extract jadi const_ sebelum JSX (single-brace props).
  - Logika per-frame **memutasi ref / objek three** (jangan `setState` di `useFrame`).
  - Store hanya untuk transisi diskret (phase, mode, quality, progress).
  - Baca transient di loop via `useExperienceStore.getState()`, bukan subscribe.

## 2. Status roadmap (§11 bible)

- [x] **Sprint 0 — Skeleton**: Next 15 + R3F + store + Threshold + PostFX + loop. Skeleton kini lengkap & runnable (semua import foundation ter-resolve).
- [x] **Sprint 1 — Awakening**: skydome shader, fog volumetric (damped), pulau terapung, burung cahaya, awan parallax, motes, ambient audio, kamera floating (FREE), hint diegetik. **Mood lock tercapai.**
- [ ] **Sprint 2 — Player & Discovery** ← NEXT TASK (lihat `NEXT_TASK.md`)
- [ ] **Sprint 3 — Memories**
- [ ] **Sprint 4 — Impossible** (gravity flip, camera RAIL/GSAP)
- [ ] **Sprint 5 — Revelation**
- [ ] **Sprint 6 — Finale**
- [ ] **Sprint 7 — Polish & Perf**

## 3. Apa yang dikerjakan sesi ini

### Foundation (dari bible §8 + §10) — dimaterialisasi verbatim, TIDAK diubah
`package.json`, `app/page.tsx`, `src/experience/Experience.tsx`*, `Director.tsx`,
`camera/CameraDirector.tsx`, `lib/math.ts`, `player/PlayerController.tsx`,
`fx/PostFX.tsx`, `shaders/memoryPortal/frag.glsl`, `ui/Threshold.tsx`,
`public/data/memories.json`, `state/useExperienceStore.ts`.

\*Satu-satunya penyesuaian pada file foundation: `Experience.tsx` menambahkan
`<DiegeticHints />` di area DOM overlay (1 baris + import). Alasan: hint gerak
diegetik adalah deliverable Sprint 1 dan overlay DOM hanya bisa di-mount di sini.
Bukan refactor/redesign.

### Glue Sprint 0 (baru) — membuat skeleton benar-benar jalan
- `state/selectors.ts` — selector hooks ringkas.
- `lib/constants.ts` — `PHASE_VISUALS` (palet/mood per fase), `SKY`, `AWAKENING`.
- `experience/phases/phaseConfig.ts` — `PHASE_FLOW`, `PHASE_ORDER`.
- `experience/phases/usePhaseTimeline.ts` — set cameraMode per phase + jam global GSAP (`progress`).
- `experience/phases/PhaseManager.tsx` — seam pemilih zona (kini hanya Awakening).
- `experience/world/World.tsx` — root: environment + zona + sistem hidup.
- `experience/camera/useCinematicRail.ts` — scaffold RAIL (railTarget/spline) untuk Sprint 4.
- `experience/player/useCharacterMovement.ts` — scaffold input terpadu untuk Sprint 2.
- `hooks/useQualityTier.ts` — anggaran render per tier (§9).
- `hooks/useProgressiveAssets.ts` — jembatan loader R3F -> `store.progress`.
- `hooks/useAudio.ts` — wrapper Howler aman-SSR.
- `ui/LoaderBreath.tsx` — "napas" loading.
- `ui/DiegeticHints.tsx` — hint gerak diegetik.
- `experience/shaders/glsl.d.ts` — deklarasi impor `.glsl` (raw via webpack rule).
- Config: `next.config.mjs` (rule GLSL `asset/source`), `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`, `next-env.d.ts`, `.gitignore`.

### Sprint 1 — Awakening (baru)
- `experience/shaders/skydome/vertex.glsl` + `frag.glsl` — gradient 3-stop + sun glow + bintang.
- `experience/world/props/SkyDome.tsx` — dome BackSide pakai shader di atas.
- `experience/world/PhaseEnvironment.tsx` — ambient+directional light & fog di-damp ke `PHASE_VISUALS[phase]`.
- `experience/world/props/FloatingIsland.tsx` — pulau low-poly ter-displace + bob prosedural.
- `experience/world/zones/AwakeningZone.tsx` — 1 pulau utama + 4 pulau parallax.
- `experience/world/systems/Birds.tsx` — burung cahaya instanced (orbit + flap).
- `experience/world/systems/Clouds.tsx` — awan billboard additive.
- `experience/world/systems/AmbientAudio.tsx` — ambient fade-in setelah unlock.
- `experience/fx/ParticleField.tsx` — motes melayang (points shader).

## 4. Alur runtime (mental model)

`app/page.tsx` -> `Experience` (Canvas + PerformanceMonitor + PostFX + DOM overlays)
-> `Director` (`usePhaseTimeline`, set gravity per phase) -> `CameraDirector` +
`PlayerController` + `World`. `World` -> `PhaseEnvironment` (+`SkyDome`) +
`PhaseManager` (`AwakeningZone`) + sistem hidup (`Clouds`, `Birds`, `ParticleField`, `AmbientAudio`).

Flow fase: mulai di `threshold` -> klik tombol "tarik napas" (`Threshold.tsx`)
meng-unlock audio + pointer lock + set phase `awakening`. `usePhaseTimeline`
menyalakan jam global & meng-set cameraMode `FREE`.

## 5. Catatan teknis penting

- **Impor GLSL**: `.glsl` dimuat sebagai string mentah via `next.config.mjs`
  (`type: "asset/source"`) + `shaders/glsl.d.ts`. Pakai pola yang sama untuk shader baru.
- **ShaderMaterial**: pakai `<shaderMaterial vertexShader=... fragmentShader=... uniforms=...>`
  dengan uniforms di-`useMemo`; update `uTime` via `useFrame` (mutasi `.value`). Hindari `extend()` kecuali perlu.
- **Tier perf**: `PerformanceMonitor` (di `Experience`) memanggil `setQuality`. Sistem
  hidup membaca `useQualityTier()` untuk jumlah partikel/burung. PostFX berat hanya di high/ultra.
- **Audio**: butuh gesture (sudah ditangani di `Threshold`). `AmbientAudio` fade-in saat `audioUnlocked`.
- **Aset belum ada**: app tetap jalan tanpa file di `public/models|audio|textures|hdri`.
- **CameraDirector** belum membaca `railTarget` dari `useCinematicRail` (sesuai
  desain, RAIL baru dipakai Sprint 4). Wiring-nya additif, jangan refactor sekarang.

## 6. Verifikasi yang sudah dilakukan

- JSON tervalidasi (`jq`).
- Seluruh 36 file TS/TSX/CSS/mjs ter-_parse_ oleh Prettier (tanpa syntax error) lalu diformat.
- **Belum** dijalankan `npm install` / `next build` di sesi ini (sandbox tanpa
  jaringan). Langkah pertama sesi berikutnya: `npm install && npm run dev`, perbaiki
  error tipe/peer-deps kecil bila muncul (lihat §Risiko di `NEXT_TASK.md`).

---

## 7. Fix log

### [Sesi 2] Runtime error `ReactCurrentOwner` saat `npm run dev`

**Gejala:** `Runtime TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')` di `@react-three/fiber/dist/events-*.esm.js`, dipicu saat me-render `<Experience />` (Next 15.5.19).

**Akar masalah:** `@react-three/fiber` v8 membaca internal React `ReactCurrentOwner`, yang **dihapus di React 19**. Range caret `next ^15.0.0` ter-resolve ke 15.5.19 dan saat `npm install`, React 19 ikut masuk ke dependency tree — padahal bible menetapkan React 18.3.1. Jadi R3F v8 berjalan di atas React 19 -> internal undefined -> crash.

**Perbaikan (minimal, tanpa redesign/refactor, tanpa ubah kode):**
- `package.json`: pin `react` & `react-dom` ke **`18.3.1`** (hapus caret).
- Tambah blok **`overrides`** `{ react: 18.3.1, react-dom: 18.3.1 }` agar SELURUH transitive deps (drei, postprocessing, framer-motion, dst.) memakai satu salinan React 18.3.1.
- Tambah `@types/react-dom ^18.3.0` (sebelumnya hilang).
- Tidak menyentuh versi Next/R3F/three — Next 15 resmi mendukung React ^18.2.0, jadi Next 15 + React 18.3.1 + R3F v8 adalah kombinasi valid sesuai desain.

**WAJIB saat menerapkan (overrides hanya berlaku pada install bersih):**
```bash
rm -rf node_modules package-lock.json   # Windows: rmdir /s /q node_modules & del package-lock.json
npm install
npm run dev
```
Verifikasi satu salinan React 18: `npm ls react react-dom` -> harus 18.3.1 di semua cabang.

**Catatan untuk sprint berikut:** jika suatu saat ingin pindah ke React 19, itu butuh upgrade ke @react-three/fiber v9 + drei v10 + @react-three/postprocessing v3 (perubahan major, di luar scope sekarang — JANGAN dilakukan tanpa alasan).
