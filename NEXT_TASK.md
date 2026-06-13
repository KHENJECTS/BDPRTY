# NEXT TASK — Sprint 6: Finale

> Mulai dari sini. Baca `HANDOFF.md` §1 (aturan), §2 (status), §4 (mental model),
> §5 (catatan teknis), dan §12 (apa yang baru dari Sprint 5) dulu. Jangan analisis
> ulang seluruh project.

## Tujuan Sprint 6 (§11 bible)

Bangun **fase "Finale"**: penutup yang hangat sesudah wajah tersingkap. Pesan
selamat untuk sang peraya muncul (overlay DOM, `ui/FinaleOverlay.tsx`), diiringi
kamera RAIL terakhir yang tenang. Ini akhir perjalanan (`PHASE_FLOW.finale.next === null`).

## Konteks yang SUDAH tersedia (JANGAN buat ulang)

- **cameraMode RAIL**: `PHASE_FLOW.finale.cameraMode === "RAIL"`, `next === null` (akhir).
  `usePhaseTimeline` sudah men-set mode per fase.
- **Rail kamera (pola Sprint 4/5)**: pakai `useCinematicRail(points)` (`sample(t)`
  menulis `railTarget`; set `railLookAt`), keduanya di-`damp3` oleh `CameraDirector`.
  **Tiru `RevelationZone`/`ImpossibleZone`**. Karena `next === null`, di akhir rail
  JANGAN panggil `setPhase`; cukup tahan kamera (atau loop lembut) — guard ref tetap.
- **Nama peraya**: `public/data/memories.json` -> `celebrant.fullName`/`firstName`.
  Muat lewat pola yang sama dengan `MemoryZone` (fetch JSON aman-SSR). Untuk overlay
  DOM, ikuti pola `ui/DiegeticHints.tsx` (di-mount di `Experience.tsx`, bukan di Canvas).
- **Wajah Sprint 5**: `FaceParticles` + `RevelationZone` sudah ada. Boleh dipertahankan
  terlihat saat masuk finale (mis. render ulang/pertahankan), tapi JANGAN refactor besar.
- **Mood**: `PHASE_VISUALS.finale` SUDAH ada di `lib/constants.ts` (cek nilainya;
  `PhaseEnvironment` otomatis men-damp ke sana). Tweak additif bila perlu.
- **Gravity**: `Director` mengembalikan `[0,-9.81,0]` di `finale` (hanya `impossible` terbalik).
- **Ditangguhkan & kini relevan**: `ui/FinaleOverlay.tsx`, shader `godrays`, `DisintegrationFX`.
  `godrays` boleh ditangguhkan ke Sprint 7 (Polish) bila menambah risiko.

## Checklist konkret

1. **FinaleZone**
   - Buat `experience/world/zones/FinaleZone.tsx` (pola `RevelationZone`).
   - Daftarkan di `PhaseManager.tsx`: cabang `phase === "finale" → <FinaleZone />`
     (saat ini fase itu masih jatuh ke `MemoryZone` placeholder — ganti).
   - Isi: pertahankan/menampilkan wajah + elemen perayaan (mis. partikel naik / cahaya
     lembut) memakai komponen yang ada. Hindari dependency baru.

2. **FinaleOverlay (DOM)**
   - Buat `ui/FinaleOverlay.tsx`: pesan penutup + `celebrant.firstName` (fade-in via
     framer-motion, pola overlay yang ada). Mount di `Experience.tsx` (1 baris + import,
     bergaya seperti `DiegeticHints`). Tampil hanya saat `phase === "finale"`.

3. **Kamera RAIL terakhir**
   - Definisikan `FINALE.railPoints`/`lookAt`/`railDuration` di `lib/constants.ts`.
   - Di `useFrame` (hanya saat `phase === "finale"`): set `railLookAt`, `sample(t)`.
     Karena `next === null`, di akhir rail TIDAK ada `setPhase` — tahan/loop lembut.

## Definition of Done

- `phase === "finale"` menampilkan `FinaleZone` + `FinaleOverlay` dengan nama peraya.
- Kamera RAIL bergerak sinematik tanpa input pemain; berhenti/tenang di akhir (tanpa transisi).
- Tidak ada fase yang lagi memakai `MemoryZone` sebagai placeholder.
- `npm run dev` jalan tanpa error; target 60fps tier high.
- Update `HANDOFF.md` §2 (Sprint 6 → `[x]`) + tambah §13 work log; pindahkan
  NEXT TASK ke Sprint 7 (Polish & Perf); update `STATUS.md`.

## File yang kemungkinan disentuh

- BARU: `world/zones/FinaleZone.tsx`, `ui/FinaleOverlay.tsx`.
- EDIT KECIL: `phases/PhaseManager.tsx` (cabang finale), `lib/constants.ts`
  (`FINALE` + railPoints), `experience/Experience.tsx` (mount overlay, pola `DiegeticHints`).
- JANGAN sentuh: foundation §3 & kerja Sprint 0–5 kecuali wiring additif yang jelas.

## Risiko / catatan

- `next === null` di `finale`: pastikan tidak memanggil `setPhase` di akhir rail (beda
  dari Sprint 4/5) — kalau tidak bisa error/loop fase. Guard ref tetap dipakai.
- Overlay DOM harus di luar `<Canvas>` (di `Experience.tsx`), bukan di dalam scene.
- `celebrant.fullName` masih placeholder ("Nama Lengkap") di `memories.json` — overlay
  harus tetap rapi dengan teks placeholder; isi nyata diisi belakangan oleh user.
- `FaceParticles` masih wajah prosedural (lihat §12) sampai `.glb` disediakan.
- Sandbox offline: validasi statis saja (Prettier/jq), `npm run dev`/fps diuji di mesin Anda.
