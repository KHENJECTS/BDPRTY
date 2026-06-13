# NEXT TASK — 🎉 ROADMAP SELESAI (Sprint 0–7)

> Seluruh roadmap inti sudah selesai. **Tidak ada NEXT TASK wajib.** Alur naratif
> 7 fase lengkap end-to-end dan sudah dipoles (Sprint 7). Berkas ini kini berisi
> **backlog opsional** — ambil hanya jika ingin meningkatkan kualitas; semuanya
> additif & tidak memblokir rilis. Baca `HANDOFF.md` §1 (aturan) & §14 (Sprint 7)
> sebelum mulai.

## Status

| Sprint | Status |
| --- | --- |
| 0 Foundation → 6 Finale | ✅ Selesai |
| 7 Polish & Perf | ✅ Selesai |

Alur: threshold → awakening → discovery → memories → impossible → revelation → finale (`next: null`).

## Backlog opsional (urut perkiraan dampak)

1. **Aset nyata menggantikan placeholder prosedural**
   - `public/models/face-pointcloud.glb` → ganti generator `home` di `FaceParticles`
     (drei `useGLTF` + guard Suspense/fallback; fallback prosedural tetap aman bila aset hilang).
   - Foto kenangan `.ktx2` (`public/textures/01.ktx2`, `02.ktx2`) untuk `MemoryZone`.
   - Isi nama nyata di `public/data/memories.json` (`celebrant.fullName`/`firstName`)
     — langsung muncul di `FinaleOverlay`.
   - Audio (howler via `useAudio`): cue swell di `revelation`/`finale`; hormati `audioUnlocked`, aman-SSR.

2. **Godrays / light-shaft shader sejati** (saat ini didekati bloom klimaks di `PostFX`)
   - Bila ingin sinar matahari volumetrik: tambah di `fx/PostFX.tsx` bila tersedia di
     `@react-three/postprocessing`, ATAU shader `experience/shaders/godrays/` (pola `skydome`).
     **Jangan tambah dependency baru.** Gating tier (`high`/`ultra`) lewat `useQualityTier`.

3. **Audit performa lanjut (§9)**
   - Verifikasi 60fps tier `high` di perangkat target; profil partikel
     (`FaceParticles` `max(1500, moteCount*3)`, `DisintegrationFX` `moteCount`, `ParticleField`).
   - `PerformanceMonitor` (onDecline) sudah menurunkan tier; pastikan `low` mulus.

4. **Penghalusan transisi kamera (opsional)**
   - `CameraDirector` damp `RAIL`/`BLEND` (lambda 0.25). Bila ada lonjakan saat FREE→RAIL
     (mis. awal `impossible`), pertimbangkan ramp lambda; pakai `damp3` yang ada, jangan ubah arsitektur.

## Aturan yang tetap berlaku

- Additif saja; jangan redesign/refactor besar; pertahankan arsitektur & style.
- Invariant: `PlayerController` early-return saat non-FREE; per-frame memutasi ref/objek
  three (bukan `setState`); baca transient via `useExperienceStore.getState()`; `"use client"` di komponen client.
- Sandbox offline: validasi statis saja (Prettier/jq); `npm run dev`/fps diuji di mesin Anda.
- Selesai mengerjakan butir backlog: perbarui `HANDOFF.md` (+work log) & `STATUS.md`.
