# NEXT TASK — Sprint 3: Memories

> Mulai dari sini. Baca `HANDOFF.md` §1 (aturan), §2 (status), §4 (mental model),
> dan §9 (apa yang baru dari Sprint 2) dulu. Jangan analisis ulang seluruh project.

## Tujuan Sprint 3 (§11 bible)

Bangun **zona Memory**: ruang kenangan yang muncul setelah Discovery. Player
menjelajah dan berinteraksi dengan artefak kenangan (foto melayang, pohon
kenangan, konstelasi, portal) yang membaca data dari `public/data/memories.json`.
Membuka kenangan mengisi `activeMemoryId`; setelah kenangan inti dilihat, memicu
transisi `memories → impossible`.

## Konteks yang sudah tersedia (JANGAN buat ulang)

- Store: `activeMemoryId` + `setActiveMemory(id)` sudah ada di `useExperienceStore`.
- Mood `memories` sudah ada di `PHASE_VISUALS` (`lib/constants.ts`).
- Shader portal sudah ada: `experience/shaders/memoryPortal/frag.glsl`.
- Data kenangan: `public/data/memories.json`.
- Pola zona & prop proximity: tiru `DiscoveryZone.tsx` + `Discoverable.tsx` (Sprint 2).
- `PhaseManager` kini menampilkan `DiscoveryZone` untuk fase >= discovery —
  tambahkan cabang `phase === "memories" → <MemoryZone />`.
- `PHASE_FLOW.memories.next === "impossible"`.

## Checklist konkret

1. **Loader data kenangan**
   - Baca `public/data/memories.json` (buat `hooks/useMemories.ts` atau loader kecil aman-SSR).
   - Definisikan tipe `Memory` sesuai isi json (jangan ubah skema json bila sudah ada).

2. **MemoryZone**
   - Buat `experience/world/zones/MemoryZone.tsx` (pola `DiscoveryZone.tsx`).
   - Daftarkan di `PhaseManager.tsx` (cabang `memories`).
   - Sesuaikan kepadatan artefak ke tier via `useQualityTier()` bila perlu.

3. **Artefak kenangan (props)**
   - `world/props/MemoryPhoto.tsx` — bidang foto melayang (texture dari memories.json; AMAN bila aset belum ada → fallback warna).
   - `world/props/MemoryTree.tsx` dan/atau `Constellation.tsx` — elemen ambient (low-poly / points, gaya selaras `FloatingIsland`/`ParticleField`).
   - `world/props/MemoryPortal.tsx` — pakai shader `memoryPortal/frag.glsl` (pola `shaderMaterial` + uniforms `useMemo` + `uTime` via `useFrame`, lihat §5 HANDOFF).

4. **Interaksi & transisi**
   - Proximity (pola `Discoverable`) untuk membuka kenangan → `setActiveMemory(id)` (mutasi ref di loop; panggil action hanya saat trigger).
   - Setelah kenangan inti dilihat (ambang jumlah/seleksi), `setPhase(PHASE_FLOW.memories.next)` (= `impossible`).
   - (Opsional) overlay DOM kecil judul kenangan aktif (pola `DiegeticHints`), mount di area overlay `Experience`.

## Definition of Done

- MemoryZone tampil saat `phase === "memories"`; min. 1 `MemoryPhoto` + 1 portal/konstelasi.
- Membuka kenangan mengisi `activeMemoryId` (TANPA setState di `useFrame`).
- Transisi `memories → impossible` berjalan via store + `PHASE_FLOW`.
- `npm run dev` jalan tanpa error; target 60fps tier high.
- Update `HANDOFF.md` §2 (Sprint 3 → `[x]`) + tambah §10 work log; pindahkan NEXT TASK ke Sprint 4; update `STATUS.md`.

## File yang kemungkinan disentuh

- BARU: `world/zones/MemoryZone.tsx`, `world/props/MemoryPhoto.tsx`, `world/props/MemoryPortal.tsx`, (opsional) `MemoryTree.tsx`/`Constellation.tsx`, `hooks/useMemories.ts`.
- EDIT KECIL: `phases/PhaseManager.tsx` (cabang memories), `lib/constants.ts` (konstanta `MEMORY` bila perlu).
- JANGAN sentuh: foundation §3 `HANDOFF.md` & kerja Sprint 0–2 kecuali wiring additif yang jelas.

## Risiko / hal pertama yang harus dicek

- **Jaringan**: sandbox tak bisa `npm install`. Di mesin Anda: `npm install && npm run dev`.
- Aset kenangan (foto/texture) mungkin belum ada di `public/` — komponen WAJIB aman tanpa aset (placeholder warna), seperti pola audio/aset Sprint 1.
- Impor `.glsl` ikut pola Sprint 1 (`asset/source` + `glsl.d.ts`).
- Player FREE + pointer-lock sudah aktif sejak Sprint 2 — MemoryZone tetap mode FREE (`PHASE_FLOW.memories`).
