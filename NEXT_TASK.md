# NEXT TASK — Sprint 4: Impossible

> Mulai dari sini. Baca `HANDOFF.md` §1 (aturan), §2 (status), §4 (mental model),
> §5 (catatan teknis: GLSL/shaderMaterial/RAIL), dan §10 (apa yang baru dari
> Sprint 3) dulu. Jangan analisis ulang seluruh project.

## Tujuan Sprint 4 (§11 bible)

Bangun **fase "Impossible"**: dunia yang membalik. Setelah kenangan, gravitasi
ter-flip dan kamera beralih dari kontrol bebas (FREE) ke **rail sinematik (RAIL)**
yang digerakkan GSAP. Ini momen "mustahil" — geometri melayang ke atas, ruang
terasa terbalik, lalu menuntun pemain ke `revelation`.

## Konteks yang SUDAH tersedia (JANGAN buat ulang)

- **Gravity flip sudah ter-wire**: `Director.tsx` meng-set `gravity` ke `[0, 9.81, 0]`
  saat `phase === "impossible"` (selain itu `[0,-9.81,0]`). `PlayerController`
  (Sprint 2) sudah membaca `store.gravity` + meng-clamp `ceilingY` — jadi pemain
  otomatis "jatuh ke atas" tanpa kode baru.
- **RAIL sudah disiapkan**: `PHASE_FLOW.impossible.cameraMode === "RAIL"`,
  `usePhaseTimeline` meng-set cameraMode per fase. `CameraDirector` men-`damp3`
  posisi kamera ke `desired.current` HANYA saat mode RAIL/BLEND.
- **Spline rail**: `experience/camera/useCinematicRail.ts` mengekspor
  `useCinematicRail(points)` (CatmullRomCurve3 + `sample(t)`) + `railTarget`/`railLookAt`.
  CameraDirector BELUM membaca ini (sesuai desain) — Sprint 4 yang menyambungkannya.
- **Mood `impossible`** sudah ada di `PHASE_VISUALS` (bg `#0a001a`, fog ungu,
  sun `#39f0ff`) — `PhaseEnvironment` otomatis men-damp ke sana.
- **Transisi masuk**: `MemoryZone` (Sprint 3) memanggil `setPhase("impossible")`
  setelah semua kenangan dibuka.
- **Transisi keluar**: `PHASE_FLOW.impossible.next === "revelation"` (RAIL).
- Pola zona: tiru `AwakeningZone`/`DiscoveryZone`/`MemoryZone`. Pola shader: §5 + SkyDome.

## Checklist konkret

1. **ImpossibleZone**
   - Buat `experience/world/zones/ImpossibleZone.tsx` (pola zona lain).
   - Daftarkan di `PhaseManager.tsx`: tambah cabang `phase === "impossible" → <ImpossibleZone />`
     (saat ini fase itu masih jatuh ke `MemoryZone` placeholder — ganti).
   - Isi: geometri "terbalik" (pulau/puing melayang ke atas), selaras gaya low-poly
     `FloatingIsland`. Manfaatkan gravitasi terbalik untuk sense of wonder.

2. **Kamera RAIL sinematik**
   - Sambungkan `useCinematicRail` ke `CameraDirector` (atau via komponen rail
     terpisah yang men-set `desired.current` kamera) HANYA saat `cameraMode !== "FREE"`.
     Edit additif — JANGAN refactor CameraDirector.
   - Gunakan GSAP (jam `progress` global sudah jalan di `usePhaseTimeline`) atau
     `damp3` yang sudah ada untuk menggerakkan kamera menyusuri spline.
   - Definisikan titik rail di `lib/constants.ts` (mis. `IMPOSSIBLE.railPoints`).

3. **FX "mustahil" (opsional tapi diharapkan)**
   - Tingkatkan PostFX hanya lewat yang sudah ada (`fx/PostFX.tsx`) bila perlu —
     jangan tambah dependency. (`godrays`/`DisintegrationFX` boleh ditangguhkan.)

4. **Transisi keluar**
   - Setelah durasi/akhir rail, `setPhase(PHASE_FLOW.impossible.next)` (= `revelation`).
     Pakai `minDuration` di `PHASE_FLOW.impossible` (auto-advance `usePhaseTimeline`)
     bila sudah ada, atau trigger di akhir animasi rail.

## Definition of Done

- `phase === "impossible"` menampilkan `ImpossibleZone`; dunia terasa terbalik
  (gravitasi ke atas — pemain otomatis terangkat).
- Kamera beralih ke RAIL dan bergerak sinematik (GSAP/`damp3`) tanpa input pemain.
- Transisi `impossible → revelation` berjalan via store + `PHASE_FLOW`.
- `npm run dev` jalan tanpa error; target 60fps tier high.
- Update `HANDOFF.md` §2 (Sprint 4 → `[x]`) + tambah §11 work log; pindahkan
  NEXT TASK ke Sprint 5; update `STATUS.md`.

## File yang kemungkinan disentuh

- BARU: `world/zones/ImpossibleZone.tsx`, (opsional) komponen rail-kamera kecil
  di `experience/camera/`, props puing melayang di `world/props/`.
- EDIT KECIL: `phases/PhaseManager.tsx` (cabang impossible), `camera/CameraDirector.tsx`
  (baca rail saat non-FREE — additif), `lib/constants.ts` (`IMPOSSIBLE` + railPoints),
  mungkin `phases/phaseConfig.ts` bila perlu `minDuration` untuk auto-advance.
- JANGAN sentuh: foundation §3 & kerja Sprint 0–3 kecuali wiring additif yang jelas.

## Risiko / hal pertama yang harus dicek

- **Jaringan**: sandbox tak bisa `npm install`. Di mesin Anda: `npm install && npm run dev`.
- Saat masuk RAIL, pastikan pointer-lock/look pemain TIDAK melawan kamera rail
  (PlayerController `useFrame` sudah early-return kecuali `cameraMode === "FREE"` —
  pertahankan itu).
- Gravity flip memakai `PlayerController` clamp `ceilingY` (sudah ada) — uji nilai
  `floorY`/`ceilingY` di `PLAYER` agar pemain tidak melayang keluar dunia.
- Impor `.glsl` ikut pola Sprint 1 (`asset/source` + `glsl.d.ts`) bila menambah shader.
- Pertahankan: tanpa setState di `useFrame`, transisi diskret lewat store, single-brace props.
