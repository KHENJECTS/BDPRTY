# NEXT TASK — Sprint 2: Player & Discovery

> Mulai dari sini. Baca `HANDOFF.md` §1–§5 dulu (aturan + status + mental model),
> lalu kerjakan tugas di bawah. Jangan analisis ulang seluruh project.

## Tujuan Sprint 2 (§11 bible)

Mengubah kamera floating pasif (Sprint 1) menjadi **player yang bisa digerakkan**
dan menanam **objek bisa-ditemukan (discoverables)** pertama di zona Discovery.
Saat player mendekat, objek memberi feedback halus dan memicu transisi fase
`awakening → discovery → memories`.

## Checklist konkret

1. **Karakter / kontrol gerak**
   - Implementasikan isi `src/experience/player/useCharacterMovement.ts` (scaffold sudah ada):
     baca input WASD/drag + pointer-lock look, hasilkan vektor gerak.
   - Hubungkan ke `PlayerController.tsx` (sudah ada) — mutasi posisi via ref di `useFrame`,
     hormati `gravity` dari store (Sprint 4 akan flip-nya). JANGAN setState per-frame.
   - Mode kamera `FREE` mengikuti player (third/first-person sesuai §5 bible).

2. **Zona Discovery**
   - Buat `src/experience/world/zones/DiscoveryZone.tsx` mengikuti pola `AwakeningZone.tsx`.
   - Daftarkan di `PhaseManager.tsx` (tambahkan cabang `phase === "discovery"`).
   - Tambahkan visual/mood `discovery` jika perlu di `lib/constants.ts -> PHASE_VISUALS`
     (sudah ada entri; sesuaikan nilai, jangan ganti struktur).

3. **Discoverables**
   - Buat `src/experience/world/props/Discoverable.tsx` (atau folder `interactables/`):
     objek dengan radius proximity; saat player dalam radius -> highlight/scale/audio cue.
   - Gunakan `useExperienceStore.getState()` di loop untuk cek jarak; panggil action
     `discover(id)` (sudah ada di store) saat ter-trigger.
   - Saat jumlah discover mencukupi -> `setPhase("memories")` (pakai `PHASE_FLOW.next`).

4. **Audio cue** (opsional kecil): pakai `useAudio()` untuk SFX penemuan.

## Definition of Done

- Player bergerak mulus dengan WASD + look; tidak ada setState di `useFrame`.
- Minimal 3 discoverable di DiscoveryZone memberi feedback proximity.
- Transisi `awakening -> discovery -> memories` berjalan via store + `PHASE_FLOW`.
- `npm run dev` jalan tanpa error; 60fps di tier `high`.
- Update checklist Sprint 2 di `HANDOFF.md` §2 menjadi `[x]` dan pindahkan
  NEXT TASK ke Sprint 3.

## File yang kemungkinan disentuh

- BARU: `world/zones/DiscoveryZone.tsx`, `world/props/Discoverable.tsx`.
- ISI: `player/useCharacterMovement.ts`.
- EDIT KECIL: `player/PlayerController.tsx`, `phases/PhaseManager.tsx`, `lib/constants.ts`.
- JANGAN sentuh: file foundation di §3 `HANDOFF.md` kecuali wiring additif yang jelas.

## Risiko / hal pertama yang harus dicek

- **Jaringan**: sesi ini tak bisa `npm install`. Sesi berikut: jalankan
  `npm install` lalu `npm run dev`. Jika ada peer-dep R3F/three mismatch, samakan
  versi di `package.json` (three 0.169 <-> @types/three 0.169 sudah selaras).
- Pointer-lock butuh gesture user (sudah dipicu di `Threshold.tsx`).
- Pastikan pola impor `.glsl` tetap (lihat `HANDOFF.md` §5) bila menambah shader.
