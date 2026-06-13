# NEXT TASK — Sprint 5: Revelation

> Mulai dari sini. Baca `HANDOFF.md` §1 (aturan), §2 (status), §4 (mental model),
> §5 (catatan teknis), dan §11 (apa yang baru dari Sprint 4) dulu. Jangan analisis
> ulang seluruh project.

## Tujuan Sprint 5 (§11 bible)

Bangun **fase "Revelation"**: puncak emosional sesudah realm terbalik. Di sinilah
identitas/wajah sang peraya tersingkap — partikel berhamburan lalu menyatu
membentuk wajah (`FaceParticles` dari point-cloud `memories.json.faceModel`),
diiringi kamera RAIL yang khidmat, sebelum menuntun ke `finale`.

## Konteks yang SUDAH tersedia (JANGAN buat ulang)

- **cameraMode RAIL**: `PHASE_FLOW.revelation.cameraMode === "RAIL"`, `next === "finale"`.
  `usePhaseTimeline` sudah men-set mode per fase.
- **Rail kamera (pola Sprint 4)**: pakai `useCinematicRail(points)` (`sample(t)`
  menulis `railTarget`; set `railLookAt`), keduanya di-`damp3` oleh `CameraDirector`.
  **Tiru `ImpossibleZone`** untuk menyusuri rail + auto-advance di akhir (guard ref).
- **Data wajah**: `public/data/memories.json` punya `faceModel: "/models/face-pointcloud.glb"`
  + `celebrant.fullName`/`firstName`. Model `.glb` mungkin **BELUM** ada di
  `public/models/` — siapkan fallback aman (mis. point-cloud prosedural, pola
  `placeholderTexture`/`Constellation`) agar tak crash offline. JANGAN paksakan
  `GLTFLoader` tanpa guard.
- **Gravity**: `Director` mengembalikan `[0,-9.81,0]` di `revelation` (hanya `impossible`
  yang terbalik) — pertimbangkan untuk komposisi.
- **Mood**: cek `PHASE_VISUALS.revelation` di `lib/constants.ts`; `PhaseEnvironment`
  otomatis men-damp ke sana (tambah entri bila belum ada — additif).
- Pola zona: tiru `ImpossibleZone`/`MemoryZone`. Pola points: `ParticleField`/`Constellation`.

## Checklist konkret

1. **RevelationZone**
   - Buat `experience/world/zones/RevelationZone.tsx` (pola `ImpossibleZone`).
   - Daftarkan di `PhaseManager.tsx`: cabang `phase === "revelation" → <RevelationZone />`
     (saat ini fase itu masih jatuh ke `MemoryZone` placeholder — ganti).
   - Isi: `FaceParticles` (point-cloud wajah dari `faceModel`, dengan fallback prosedural)
     + animasi "berhamburan → menyatu" digerakkan progress/elapsed (mutasi ref/attribute).

2. **Kamera RAIL + auto-advance**
   - Definisikan `REVELATION.railPoints`/`lookAt`/`railDuration` di `lib/constants.ts`.
   - Di `useFrame` (hanya saat `phase === "revelation"`): set `railLookAt`, `sample(t)`,
     dan saat `t >= 1` panggil `setPhase(PHASE_FLOW.revelation.next)` (= `finale`).
     Guard dengan ref agar dipanggil sekali (pola `ImpossibleZone`).

3. **FX (opsional, lewat yang sudah ada)**
   - Boleh perkuat `fx/PostFX.tsx` (bloom dll.) — jangan tambah dependency. `godrays`
     boleh ditangguhkan ke Sprint 7.

## Definition of Done

- `phase === "revelation"` menampilkan `RevelationZone`; wajah tersingkap (atau fallback
  prosedural yang elegan bila `.glb` belum ada).
- Kamera RAIL bergerak sinematik tanpa input pemain.
- Transisi `revelation → finale` via store + `PHASE_FLOW` (di akhir rail).
- `npm run dev` jalan tanpa error; target 60fps tier high.
- Update `HANDOFF.md` §2 (Sprint 5 → `[x]`) + tambah §12 work log; pindahkan
  NEXT TASK ke Sprint 6 (Finale); update `STATUS.md`.

## File yang kemungkinan disentuh

- BARU: `world/zones/RevelationZone.tsx`, `world/props/FaceParticles.tsx` (atau di `fx/`),
  mungkin shader points di `experience/shaders/`.
- EDIT KECIL: `phases/PhaseManager.tsx` (cabang revelation), `lib/constants.ts`
  (`REVELATION` + railPoints, mungkin `PHASE_VISUALS.revelation`).
- JANGAN sentuh: foundation §3 & kerja Sprint 0–4 kecuali wiring additif yang jelas.

## Risiko / hal pertama yang harus dicek

- **Jaringan**: sandbox tak bisa `npm install`. Di mesin Anda: `npm install && npm run dev`.
- `faceModel` `.glb` mungkin tak ada → WAJIB fallback (jangan crash). Pakai pola aman-aset
  seperti `placeholderTexture`/`useMemories`.
- Saat RAIL, `PlayerController` early-return — pertahankan invariant (jangan kendalikan
  kamera dari player).
- Banyak partikel wajah bisa berat: hormati `useQualityTier()` untuk jumlah titik.
- Pertahankan: tanpa setState di `useFrame`, transisi diskret lewat store, single-brace props,
  impor `.glsl` pola `asset/source`.
