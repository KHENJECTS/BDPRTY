# NEXT TASK — Sprint 7: Polish & Perf

> Mulai dari sini. Baca `HANDOFF.md` §1 (aturan), §2 (status), §4 (mental model),
> §5 (catatan teknis), §9 (anggaran tier), dan §13 (apa yang baru dari Sprint 6)
> dulu. Jangan analisis ulang seluruh project.

## Konteks penting

**Alur naratif 7 fase kini LENGKAP end-to-end** (threshold → awakening → discovery
→ memories → impossible → revelation → finale). Sprint 7 **bukan** menambah fase/
fitur alur baru — ini sprint **pemolesan & performa**. Jangan redesign; semua
perubahan harus additif & beralasan.

## Tujuan Sprint 7 (§11 bible)

Mengangkat kualitas sinematik & menjaga 60fps di tier `high`: efek penutup (godrays),
disintegrasi/komposisi partikel, audit performa per-tier, dan penghalusan transisi.

## Kandidat pekerjaan (pilih sesuai dampak; semua OPSIONAL & additif)

1. **Godrays / light shafts** (ditangguhkan dari sprint sebelumnya)
   - Tambah di `fx/PostFX.tsx` bila `@react-three/postprocessing` sudah menyediakannya,
     ATAU shader `experience/shaders/godrays/` (pola `skydome`). **Jangan tambah
     dependency baru.** Aktifkan terutama di `revelation`/`finale`.
   - Gating per tier (mis. hanya `high`/`ultra`) lewat `useQualityTier`.

2. **DisintegrationFX** (disebut bible)
   - Efek partikel "luruh/menyatu" yang reusable (pola `FaceParticles`/`ParticleField`).
     Boleh dipakai saat transisi `impossible → revelation` agar perpindahan mulus.

3. **Audit performa & anggaran tier (§9)**
   - Tinjau `hooks/useQualityTier.ts`: jumlah partikel (`moteCount`), `FaceParticles`
     (`max(1500, moteCount*3)`), `IMPOSSIBLE.islands`, bloom. Pastikan tier `low`
     turun mulus (sudah ada `PerformanceMonitor` onDecline di `Experience.tsx`).
   - Verifikasi `AdaptiveDpr`/`AdaptiveEvents` & `frustumCulled` pada points besar.

4. **Penghalusan transisi kamera**
   - Tinjau `BLEND` di `CameraDirector` saat pergantian FREE↔RAIL (mis. awal `impossible`)
     agar tidak ada lonjakan. Pakai `damp3`/durasi yang ada; jangan ubah arsitektur.

5. **Audio (howler)** — opsional
   - Cue audio per fase (mis. swell di `revelation`/`finale`) via `useAudio` yang ada.
     Aman-SSR; jangan autoplay tanpa `audioUnlocked`.

## Definition of Done (sesuaikan dengan item yang dikerjakan)

- Tiap efek baru ter-gate per tier & tidak menurunkan fps tier `high` (<60fps).
- Tidak ada dependency baru; arsitektur & style dipertahankan.
- `npm run dev` jalan tanpa error; transisi antar fase mulus.
- Update `HANDOFF.md` §2 (Sprint 7 → `[x]`) + tambah §14 work log; update `STATUS.md`.
  Bila ini sprint terakhir, tandai roadmap selesai & catat backlog sisa di NEXT_TASK.

## File yang kemungkinan disentuh

- `fx/PostFX.tsx`, `experience/shaders/godrays/*` (baru, bila dipilih),
  `experience/fx/DisintegrationFX.tsx` (baru, bila dipilih), `hooks/useQualityTier.ts`,
  `experience/camera/CameraDirector.tsx` (penghalusan BLEND), `lib/constants.ts`.
- JANGAN sentuh: alur fase §3–§13 & kerja Sprint 0–6 kecuali pemolesan additif yang jelas.

## Risiko / catatan

- Sandbox offline: validasi statis saja (Prettier/jq); `npm run dev`/fps diuji di mesin Anda.
- Godrays/postprocessing berat — WAJIB gating tier; uji `low` tidak drop.
- `FaceParticles` masih wajah prosedural (lihat §12) sampai `public/models/face-pointcloud.glb`
  disediakan; bila ditambah, pakai drei `useGLTF` + guard Suspense.
- Jangan memecah invariant: `PlayerController` early-return saat non-FREE; per-frame
  memutasi ref/objek three (bukan `setState`); baca transient via `getState()`.
