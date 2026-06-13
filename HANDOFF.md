# HANDOFF — The Impossible Journey

> File ini ditulis agar siapa pun (atau sesi AI berikutnya) bisa melanjutkan tanpa
> menganalisis ulang project. Baca ini + `NEXT_TASK.md` lalu langsung lanjut.

**Terakhir diperbarui:** akhir sesi Sprint 7 (Polish & Perf) — **ROADMAP SELESAI**, lihat §14. (Dependency di jalur React 19, §8.)
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
- [x] **Sprint 2 — Player & Discovery**: player FREE (WASD + look + lari + lompat) via `useCharacterMovement`, sadar-gravity; `DiscoveryZone` + orb `Discoverable` (proximity highlight/SFX); transisi `awakening → discovery` (auto via minDuration) lalu `discovery → memories` (saat cukup orb ditemukan). Lihat §9.
- [x] **Sprint 3 — Memories**: `MemoryZone` membaca `public/data/memories.json`; portal shader (`memoryPortal/frag.glsl`) per kenangan + foto melayang (billboard, placeholder prosedural aman-aset) + dekor ambient (pohon / konstelasi sesuai `placement`). Mendekati portal membuka kenangan (`setActiveMemory`); setelah semua kenangan dibuka -> transisi `memories → impossible`. Lihat §10.
- [x] **Sprint 4 — Impossible**: gravity flip (sudah via `Director`) + kamera **RAIL** sinematik. `ImpossibleZone` menampilkan pulau yang "menggantung" tinggi (realm terbalik); kamera menyusuri spline `IMPOSSIBLE.railPoints` (`useCinematicRail` -> `railTarget`/`railLookAt`, dibaca `CameraDirector`) selama `railDuration`, lalu auto-advance `impossible -> revelation`. Lihat §11.
- [x] **Sprint 5 — Revelation**: partikel "berhamburan → menyatu" jadi wajah sang peraya (`FaceParticles`, fallback prosedural aman-aset bila `.glb` belum ada) + kamera **RAIL** khidmat menyusuri `REVELATION.railPoints` (pola `ImpossibleZone`), lalu auto-advance `revelation -> finale`. Lihat §12.
- [x] **Sprint 6 — Finale**: penutup hangat. `FinaleZone` mempertahankan wajah peraya (`FaceParticles`) + motes hangat; kamera **RAIL** menjauh perlahan lalu menahan (`PHASE_FLOW.finale.next === null` = AKHIR, tanpa `setPhase`). `FinaleOverlay` (DOM) menampilkan "selamat ulang tahun, {firstName}" dari `memories.json`. Lihat §13.
- [x] **Sprint 7 — Polish & Perf**: bloom membesar saat klimaks (`revelation`/`finale`) untuk kesan cahaya mekar (alternatif godrays, tanpa GodRays sun-mesh & tanpa dependency baru); `DisintegrationFX` (fx partikel naik/luruh reusable, tier-gated) dipasang sebagai bara perayaan di `FinaleZone`. **Seluruh roadmap (Sprint 0–7) selesai.** Lihat §14.

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
`PhaseManager` (zona per fase) + sistem hidup (`Clouds`, `Birds`, `ParticleField`, `AmbientAudio`).

`PlayerController` (Sprint 2) menggerakkan kamera saat `cameraMode === "FREE"`
memakai `useCharacterMovement` (WASD + pointer-lock look + Shift lari + Space
lompat), memutasi posisi via ref dan menghormati `gravity` store. `PhaseManager`
memilih zona: `threshold/awakening` -> `AwakeningZone`, `discovery` -> `DiscoveryZone`, `memories` -> `MemoryZone`, `impossible` -> `ImpossibleZone`; `revelation`/`finale` masih placeholder `MemoryZone`.

Flow fase: mulai di `threshold` -> klik tombol "tarik napas" (`Threshold.tsx`)
meng-unlock audio + pointer lock + set phase `awakening`. `usePhaseTimeline`
menyalakan jam global, meng-set cameraMode per `PHASE_FLOW`, dan auto-advance
fase ber-`minDuration` (`awakening` 8s -> `discovery`). Dari `discovery`,
mendekati cukup orb `Discoverable` memicu `setPhase("memories")`. Di `memories`,
`MemoryZone` menampilkan portal kenangan; mendekati portal membuka kenangan
(`setActiveMemory`) dan setelah semua kenangan dibuka memicu `setPhase("impossible")`. Di `impossible`, `Director` membalik gravitasi (`[0,9.81,0]`) dan cameraMode jadi `RAIL`: `ImpossibleZone` menyusuri spline kamera (`useCinematicRail` menulis `railTarget`/`railLookAt`, di-`damp3` oleh `CameraDirector`) lalu memicu `setPhase("revelation")` di akhir rail.

## 5. Catatan teknis penting

- **Impor GLSL**: `.glsl` dimuat sebagai string mentah via `next.config.mjs`
  (`type: "asset/source"`) + `shaders/glsl.d.ts`. Pakai pola yang sama untuk shader baru.
- **ShaderMaterial**: pakai `<shaderMaterial vertexShader=... fragmentShader=... uniforms=...>`
  dengan uniforms di-`useMemo`; update `uTime` via `useFrame` (mutasi `.value`). Hindari `extend()` kecuali perlu.
- **Tier perf**: `PerformanceMonitor` (di `Experience`) memanggil `setQuality`. Sistem
  hidup membaca `useQualityTier()` untuk jumlah partikel/burung. PostFX berat hanya di high/ultra.
- **Audio**: butuh gesture (sudah ditangani di `Threshold`). `AmbientAudio` fade-in saat `audioUnlocked`.
- **Aset belum ada**: app tetap jalan tanpa file di `public/models|audio|textures|hdri`.
- **CameraDirector** (Sprint 4) kini men-`damp3` kamera ke `railTarget` & menatap
  `railLookAt` (shared vector dari `useCinematicRail`) saat mode RAIL/BLEND. Rail
  sinematik fase aktif menulis kedua vektor itu (lihat `ImpossibleZone`). Mode FREE
  tetap dikendalikan `PlayerController`.

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

---

## 8. Fix log

### [Sesi 3] Migrasi ke React 19 + React Three Fiber v9

**Keputusan:** pindah dari jalur "pin React 18" (Sesi 2) ke jalur **React 19** — ini jalur native untuk Next 15. Mengganti seluruh lini 3D ke versi yang kompatibel React 19.

**Perubahan `package.json`:**
- `react` & `react-dom` → **`19.0.0`**
- `@types/react` & `@types/react-dom` → **`19.0.0`**
- `@react-three/fiber` → **`^9.6.1`** (lini React 19)
- `@react-three/drei` → **`^10.7.7`** (butuh fiber v9)
- `@react-three/postprocessing` → **`^3.0.4`** (butuh fiber v9)
- `postprocessing` tetap `^6.36.4` (peer dari @react-three/postprocessing v3 → cocok)
- `three` tetap `^0.169.0`, `@types/three` tetap `^0.169.0` (didukung fiber v9)
- **`overrides` (pin React 18.3.1) DIHAPUS.** ⚠️ Ini WAJIB — jika blok itu tertinggal, `npm install` memaksa React kembali ke 18.3.1 dan upgrade batal (fiber v9 butuh React 19). Inilah penyebab utama jika error `ReactCurrentOwner`/peer-dep muncul lagi.

**Audit kode (tanpa perlu ubah kode):** dipindai statis dan AMAN untuk React 19 / fiber v9:
- Tidak ada `useRef()` tanpa argumen (semua `useRef<T>(null)`) — tipe React 19 tidak mengizinkan ref tanpa nilai awal.
- Tidak ada pemakaian namespace `JSX` global (fiber v9 mengaugmentasi `React.JSX`).
- Tidak ada `React.FC`/`forwardRef` yang perlu disesuaikan.
- Impor `@react-three/{fiber,drei,postprocessing}` semua via entry-point standar yang tetap ada di v9/v10/v3 (`Canvas`, `useFrame`, `useThree`, `PerformanceMonitor`, `AdaptiveDpr`, `AdaptiveEvents`, `Preload`, `useProgress`, `EffectComposer`, `Bloom`, `DepthOfField`, `ChromaticAberration`, `Vignette`).
- `tsconfig`: `jsx: "preserve"` + default import source — sudah benar, tidak diubah.
- Komponen 3D (`SkyDome`, `PostFX`, dll.) tidak memakai API yang berubah di v9/v3.

**WAJIB saat menerapkan (versi mayor berubah — install harus bersih):**
```bash
rm -rf node_modules package-lock.json   # Windows: rmdir /s /q node_modules & del package-lock.json
npm install
npm run dev
```
Verifikasi satu salinan React 19: `npm ls react react-dom` → harus **19.0.0** di semua cabang, dan `npm ls @react-three/fiber` → 9.x.

**Catatan peer-deps yang perlu dicek saat install:**
- `framer-motion ^11.11.0` — mendukung React 19. Jika npm mengeluh peer, naikkan ke `framer-motion@^11.18.0`.
- `zustand ^5` — sudah mendukung React 19. OK.
- Jika ada peer warning three, pastikan satu salinan three 0.169 (`npm ls three`).

**Status jalur ini vs Sesi 2:** entri Sesi 2 (§7, pin React 18.3.1 + overrides) kini **digantikan** oleh Sesi 3. Jangan terapkan keduanya bersamaan.

---

## 9. Work log — Sprint 2 (Player & Discovery)

**Hasil:** kamera floating pasif (Sprint 1) kini jadi player yang bisa digerakkan, plus orb discoverable pertama di zona Discovery + wiring transisi fase.

**File baru:**
- `experience/world/zones/DiscoveryZone.tsx` — zona Discovery: pulau parallax (pola AwakeningZone) + sebaran orb `Discoverable`.
- `experience/world/props/Discoverable.tsx` — orb bercahaya; cek proximity di `useFrame` (mutasi ref), `store.discover(id)` saat masuk `proximityRadius`, SFX opsional, lalu `setPhase` ke fase berikut via `PHASE_FLOW.discovery.next` saat `requiredToAdvance` tercapai.

**File diisi (sebelumnya scaffold):**
- `experience/player/useCharacterMovement.ts` — input terpadu: WASD + Shift (lari) + Space (lompat) + look pointer-lock; mengembalikan ref (tanpa setState).

**Edit kecil (additif):**
- `experience/player/PlayerController.tsx` — memakai `useCharacterMovement`; gerak horizontal relatif yaw + integrasi gravitasi vertikal (baca `store.gravity`, clamp lantai/plafon) + lompat. Tetap mutasi ref di `useFrame`, hanya saat `cameraMode === "FREE"`.
- `experience/phases/PhaseManager.tsx` — pemilihan zona per fase (`threshold/awakening` -> Awakening, selebihnya -> Discovery), subscribe selektif slice `phase`.
- `experience/phases/usePhaseTimeline.ts` — tambah efek auto-advance berbasis `PHASE_FLOW.minDuration` (awakening 8s -> discovery), dibatalkan bila fase berubah lebih dulu. Dua efek lama (cameraMode + jam GSAP) tidak diubah.
- `lib/constants.ts` — tambah `PLAYER` (kecepatan/look/gravityScale/floor) & `DISCOVERY` (islands, orbs, radius, requiredToAdvance, sfx).

**Definition of Done Sprint 2:**
- [x] Player gerak mulus WASD + look; tanpa setState di `useFrame`.
- [x] 4 discoverable (>=3 disyaratkan) memberi feedback proximity.
- [x] Transisi `awakening -> discovery -> memories` via store + `PHASE_FLOW`.
- [x] Checklist roadmap §2 Sprint 2 -> `[x]`, NEXT TASK dipindah ke Sprint 3.
- [ ] `npm run dev` + 60fps tier high — **belum diverifikasi** (sandbox offline; jalankan di mesin Anda).

**Catatan / risiko untuk sesi berikut:**
- Sandbox offline: validasi sejauh ini = Prettier parse + grep pola React 19; tidak ada `npm install`/`next build`. Jalankan `npm run dev` untuk verifikasi runtime/fps.
- SFX `/audio/discover.webm` opsional; aman bila belum ada (Howler tak crash).
- Gerak vertikal sengaja gentle (`PLAYER.gravityScale` 0.35, hover di `floorY`); Sprint 4 membalik gravitasi via `Director` (sudah set `[0,9.81,0]` saat `impossible`) — clamp plafon (`ceilingY`) sudah disiapkan.
- `PhaseManager` kini menampilkan `DiscoveryZone` sebagai placeholder untuk fase >= discovery; ganti cabang saat `MemoryZone` (Sprint 3) dibuat.

---

## 10. Work log — Sprint 3 (Memories)

**Hasil:** zona Memory interaktif. Saat `phase === "memories"`, `MemoryZone` membaca `public/data/memories.json` dan menempatkan satu portal kenangan per entri + foto melayang + dekor ambient sesuai `placement`. Mendekati portal membuka kenangan; setelah semua kenangan dibuka, transisi ke `impossible`.

**File baru:**
- `hooks/useMemories.ts` — loader aman-SSR untuk `memories.json` (fetch di `useEffect`, list kosong sampai data tiba). Ekspor tipe `Memory` / `MemoriesData`.
- `experience/world/zones/MemoryZone.tsx` — orchestrator: map kenangan -> `MemoryPortal` (+ `MemoryPhoto`), dekor `MemoryTree` (placement `tree`) / `Constellation` (placement `constellation`). Hitungan kenangan dibuka disimpan di `ref` (tanpa setState); transisi `memories -> impossible` (`PHASE_FLOW.memories.next`) dipusatkan di sini saat `requiredRatio` tercapai.
- `experience/world/props/MemoryPortal.tsx` — cakram shader (`memoryPortal/frag.glsl`, pola SkyDome): `uActivation` di-damp oleh proximity, `uTime` via `useFrame`. Masuk `openRadius` -> `setActiveMemory(id)` + `onOpen(id)` (sekali). Foto = placeholder prosedural.
- `experience/world/props/MemoryPhoto.tsx` — bidang foto melayang (billboard menghadap kamera, bob lembut); lebih terang saat kenangan aktif. Texture placeholder aman-aset.
- `experience/world/props/MemoryTree.tsx` — pohon kenangan low-poly (ambient, gaya FloatingIsland).
- `experience/world/props/Constellation.tsx` — titik bintang ambient (`pointsMaterial`), kepadatan per tier (pola ParticleField).
- `lib/placeholderTexture.ts` — `makePlaceholderTexture(seed)`: `DataTexture` gradien prosedural (SSR-safe), pengganti `.ktx2` yang mungkin belum ada di `public/`.

**Edit kecil (additif):**
- `experience/phases/PhaseManager.tsx` — tambah cabang `discovery -> DiscoveryZone`, `memories` (dan fase lanjut yang belum punya zona) -> `MemoryZone`.
- `lib/constants.ts` — tambah `MEMORY` (portalRadius, photoSize, photoLift, openRadius, glowRadius, requiredRatio, constellationSpread).

**Definition of Done Sprint 3:**
- [x] `MemoryZone` tampil saat `phase === "memories"`; >=1 `MemoryPhoto` + portal/konstelasi.
- [x] Membuka kenangan mengisi `activeMemoryId` (tanpa setState di `useFrame`).
- [x] Transisi `memories -> impossible` via store + `PHASE_FLOW`.
- [x] Checklist §2 Sprint 3 -> `[x]`; NEXT TASK dipindah ke Sprint 4.
- [ ] `npm run dev` + 60fps tier high — **belum diverifikasi** (sandbox offline; jalankan di mesin Anda).

**Catatan / risiko untuk sesi berikut:**
- Foto kenangan di `memories.json` menunjuk `.ktx2` (mis. `/textures/memories/01.ktx2`) yang mungkin belum ada; komponen sengaja memakai placeholder prosedural. Untuk foto nyata `.ktx2`, perlu `KTX2Loader` + transcoder basis (mis. drei `useKTX2`), tambahkan saat aset tersedia — JANGAN paksakan loader sekarang (offline, bisa crash).
- `requiredRatio: 1` artinya SEMUA kenangan harus dibuka untuk lanjut ke `impossible`. Turunkan bila ingin lebih longgar.
- **Trigger buka kenangan memakai jarak HORIZONTAL (XZ)**, bukan jarak 3D. Alasan: portal di `memories.json` melayang tinggi (mis. `m1` y=8, `m2` y=40) sedangkan player mengambang di dekat tanah (`floorY` 1.8) -> jarak 3D tak pernah <= `openRadius` -> soft-lock. Dengan XZ, cukup berjalan di bawah/dekat portal. Bila Sprint 4+ menambah mode terbang/RAIL melewati portal, pertimbangkan kembali ke jarak 3D.
- `MemoryZone` kini juga jadi placeholder untuk fase `impossible`/`revelation`/`finale` sampai zona Sprint 4–6 dibuat (lihat `PhaseManager`).
- Mode tetap FREE (`PHASE_FLOW.memories`); player Sprint 2 tetap aktif menjelajah.

---

## 11. Work log — Sprint 4 (Impossible)

**Hasil:** fase `impossible` kini punya zona & kamera sinematik sendiri. Saat `MemoryZone` memicu `setPhase("impossible")`: `Director` membalik gravitasi ke `[0,9.81,0]` (sudah ada sejak Sprint 0) sehingga player "jatuh ke atas", `usePhaseTimeline` menyetel cameraMode ke `RAIL`, dan `ImpossibleZone` mengambil alih kamera menyusuri spline lalu menuntun ke `revelation`.

**File baru:**
- `experience/world/zones/ImpossibleZone.tsx` — realm terbalik: pulau `FloatingIsland` yang "menggantung" tinggi (`IMPOSSIBLE.islands`). Di `useFrame` (hanya saat `phase === "impossible"`): set `railLookAt` ke pusat realm, majukan `elapsed`, `sample(t)` menulis `railTarget`, dan saat `t >= 1` panggil `setPhase(PHASE_FLOW.impossible.next)` sekali (guard ref). Tanpa setState di loop.

**Edit kecil (additif / wiring):**
- `experience/camera/CameraDirector.tsx` — disambungkan ke rail: saat mode `RAIL`/`BLEND`, `damp3` kamera ke `railTarget` (shared vector `useCinematicRail`) + `lookAt(railLookAt)`. Ini wiring yang memang disiapkan scaffold (alasan jelas: mengaktifkan RAIL Sprint 4); `desired` ref lokal yang tak terpakai dihapus. Bukan redesign.
- `experience/phases/PhaseManager.tsx` — tambah cabang `impossible -> ImpossibleZone`; `memories -> MemoryZone` dieksplisitkan; `revelation`/`finale` tetap placeholder `MemoryZone`.
- `lib/constants.ts` — tambah `IMPOSSIBLE` (`railPoints` spline CatmullRom, `railDuration` 18s, `lookAt`, `islands`).

**Definition of Done Sprint 4:**
- [x] `phase === "impossible"` menampilkan `ImpossibleZone`; gravitasi terbalik (player terangkat, via `Director` + `PlayerController` clamp `ceilingY`).
- [x] Kamera beralih ke RAIL & bergerak sinematik (`damp3` menyusuri spline) tanpa input pemain.
- [x] Transisi `impossible -> revelation` via store + `PHASE_FLOW` (di akhir rail).
- [x] Checklist §2 Sprint 4 -> `[x]`; NEXT TASK dipindah ke Sprint 5.
- [ ] `npm run dev` + 60fps tier high — **belum diverifikasi** (sandbox offline; jalankan di mesin Anda).

**Catatan / risiko untuk sesi berikut:**
- `revelation` & `finale` masih memakai `MemoryZone` sebagai placeholder (lihat `PhaseManager`). Keduanya bermode `RAIL` di `PHASE_FLOW` dengan `next` terisi tapi BELUM punya rail/zona — Sprint 5+ harus menambah zona ber-rail + auto-advance (pola `ImpossibleZone`), jika tidak fase akan diam (rail Sprint 4 hanya jalan saat `phase === "impossible"`).
- `railDuration` (18s) menentukan kecepatan tur kamera; sesuaikan bila terasa lambat/cepat. `IMPOSSIBLE.railPoints`/`lookAt` bisa di-tweak untuk komposisi.
- Saat RAIL, `PlayerController` early-return (`cameraMode !== "FREE"`), jadi tidak ada konflik kontrol kamera. Pertahankan invariant itu di sprint sinematik berikutnya.
- Gravitasi hanya terbalik di `impossible`; `Director` mengembalikan `[0,-9.81,0]` di fase lain (termasuk `revelation`) — pertimbangkan saat membangun Revelation.

---

## 12. Work log — Sprint 5 (Revelation)

**Hasil:** fase `revelation` kini punya zona & kamera sinematik sendiri (tidak lagi placeholder `MemoryZone`). Saat `ImpossibleZone` memicu `setPhase("revelation")`: `usePhaseTimeline` menyetel cameraMode `RAIL`, `Director` mengembalikan gravitasi normal `[0,-9.81,0]`, dan `RevelationZone` mengambil alih kamera + menampilkan wajah sang peraya yang terbentuk dari partikel, lalu menuntun ke `finale`.

**File baru:**
- `experience/world/props/FaceParticles.tsx` — point-cloud wajah. Tiap titik beranimasi "berhamburan -> menyatu" (`uProgress` digerakkan `elapsed`/`assembleDuration`, easing cubic + `aDelay` per-titik). Shader points (vert/frag inline) pola `ParticleField`: additive blending, soft circle, `gl_PointSize` per-jarak. **Fallback aman-aset**: selama `memories.json.faceModel` (.glb) belum ada / loader offline, `home` di-generate prosedural (kepala ellipsoid condong ke depan + rongga mata & mulut sebagai negative space) sehingga terbaca sebagai wajah. Jumlah titik ikut tier (`useQualityTier`, `max(1500, moteCount*3)`). Saat `.glb` tersedia, ganti generator `home` dengan sampling vertex model (drei `useGLTF` + guard) — pipeline shader tak perlu berubah.
- `experience/world/zones/RevelationZone.tsx` — pola `ImpossibleZone`: `useCinematicRail(REVELATION.railPoints)`; di `useFrame` (hanya saat `phase === "revelation"`) set `railLookAt`, majukan `elapsed`, `sample(t)` menulis `railTarget`, dan saat `t >= 1` panggil `setPhase(PHASE_FLOW.revelation.next)` (= `finale`) sekali (guard ref). Merender `<FaceParticles />`. Tanpa setState di loop.

**Edit kecil (additif):**
- `experience/phases/PhaseManager.tsx` — tambah cabang `revelation -> RevelationZone`; kini hanya `finale` yang memakai `MemoryZone` sebagai placeholder.
- `lib/constants.ts` — tambah `REVELATION` (`facePosition`, `faceScale`, `assembleDuration` 7s, `railPoints` spline, `lookAt`, `railDuration` 20s). `PHASE_VISUALS.revelation` SUDAH ada (putih terang) — tidak diubah.

**Definition of Done Sprint 5:**
- [x] `phase === "revelation"` menampilkan `RevelationZone`; wajah tersingkap via fallback prosedural elegan (`.glb` belum wajib).
- [x] Kamera RAIL bergerak sinematik tanpa input pemain (`PlayerController` early-return saat non-FREE).
- [x] Transisi `revelation -> finale` via store + `PHASE_FLOW` (di akhir rail).
- [x] Checklist §2 Sprint 5 -> `[x]`; NEXT TASK dipindah ke Sprint 6 (Finale).
- [ ] `npm run dev` + 60fps tier high — **belum diverifikasi** (sandbox offline; jalankan di mesin Anda).

**Catatan / risiko untuk sesi berikut:**
- Risiko §11 soal "`revelation` masih placeholder" kini **teratasi**; hanya `finale` yang tersisa sebagai placeholder `MemoryZone` (RAIL di `PHASE_FLOW`, `next: null`). Sprint 6 harus menambah `FinaleZone` ber-rail + overlay penutup (`ui/FinaleOverlay.tsx` masih ditangguhkan) — jika tidak, `finale` akan diam.
- Wajah saat ini **prosedural** (kepala ellipsoid + rongga mata/mulut), bukan wajah peraya sebenarnya. Untuk wajah asli: sediakan `public/models/face-pointcloud.glb` lalu ganti generator `home` di `FaceParticles` (drei `useGLTF` + guard Suspense/fallback).
- `assembleDuration` (7s) < `railDuration` (20s): wajah selesai menyatu sebelum kamera tiba dekat — sesuaikan bila ingin sinkron berbeda. `REVELATION.railPoints`/`lookAt`/`facePosition` bisa di-tweak untuk komposisi.
- Gravitasi normal di `revelation`; bila ingin efek melayang khusus, atur di zona, jangan ubah `Director` global.

---

## 13. Work log — Sprint 6 (Finale)

**Hasil:** fase `finale` kini punya zona + overlay penutup sendiri — **alur 7 fase lengkap end-to-end** (threshold → awakening → discovery → memories → impossible → revelation → finale). Saat `RevelationZone` memicu `setPhase("finale")`: cameraMode tetap `RAIL`, `Director` menjaga gravitasi normal, `FinaleZone` mempertahankan wajah peraya & menggerakkan kamera menjauh perlahan lalu menahan, dan `FinaleOverlay` (DOM) memunculkan pesan ulang tahun. `PHASE_FLOW.finale.next === null` — ini akhir, tanpa transisi lanjut.

**File baru:**
- `experience/world/zones/FinaleZone.tsx` — pola `RevelationZone` MINUS transisi fase. `useCinematicRail(FINALE.railPoints)`; di `useFrame` (hanya saat `phase === "finale"`) set `railLookAt`, majukan `elapsed`, `sample(t)` menulis `railTarget`. Karena `next === null`, **tidak ada `setPhase`**; saat `t === 1` kamera ditahan di titik akhir (`sample(1)` idempoten). Merender `<FaceParticles />` (wajah peraya tetap hadir) + `<ParticleField color="#fff0d0" area={60} />` (motes hangat). Tanpa setState di loop, tanpa dependency baru.
- `ui/FinaleOverlay.tsx` — overlay DOM (di luar Canvas, pola `DiegeticHints`). Subscribe `phase`; saat `phase === "finale"` menampilkan "selamat ulang tahun, {firstName}" + subjudul, fade-in bertahap via framer-motion (variants di-extract jadi const). Nama dari `useMemories().data.celebrant.firstName` (fallback string kosong bila data belum tiba). `pointer-events-none` agar tak mengganggu scene.

**Edit kecil (additif):**
- `experience/phases/PhaseManager.tsx` — tambah cabang `finale -> FinaleZone`. Tidak ada lagi fase yang memakai `MemoryZone` sebagai placeholder (fallback terakhir tetap ada sebagai jaring pengaman).
- `experience/Experience.tsx` — mount `<FinaleOverlay />` di area DOM overlay (1 baris + import, bergaya seperti `<DiegeticHints />`). Bukan refactor.
- `lib/constants.ts` — tambah `FINALE` (`railPoints` menjauh dari wajah, `lookAt`, `railDuration` 16s). `PHASE_VISUALS.finale` SUDAH ada (emas hangat) — tidak diubah.

**Definition of Done Sprint 6:**
- [x] `phase === "finale"` menampilkan `FinaleZone` + `FinaleOverlay` dengan nama peraya.
- [x] Kamera RAIL bergerak sinematik tanpa input pemain; menahan di akhir (tanpa transisi).
- [x] Tidak ada fase yang lagi memakai `MemoryZone` sebagai placeholder.
- [x] Checklist §2 Sprint 6 -> `[x]`; NEXT TASK dipindah ke Sprint 7 (Polish & Perf).
- [ ] `npm run dev` + 60fps tier high — **belum diverifikasi** (sandbox offline; jalankan di mesin Anda).

**Catatan / risiko untuk sesi berikut:**
- `finale` adalah akhir (`next: null`): JANGAN menambah `setPhase` di akhir rail — akan memutus/looping fase. Bila ingin pengulangan lembut, biarkan kamera menahan (perilaku sekarang) atau loop di dalam zona.
- `celebrant.fullName`/`firstName` masih placeholder ("Nama"/"Nama Lengkap") di `memories.json`; overlay tetap rapi dengan teks placeholder — user mengisi nama nyata belakangan.
- `FaceParticles` masih wajah prosedural (lihat §12) sampai `public/models/face-pointcloud.glb` disediakan.
- Sprint 7 (Polish & Perf) tinggal pemolesan additif: godrays, `DisintegrationFX`, audit anggaran tier, penghalusan BLEND kamera — lihat `NEXT_TASK.md`. Tak ada lagi fitur alur yang tersisa.

---

## 14. Work log — Sprint 7 (Polish & Perf) — ROADMAP SELESAI

**Hasil:** sprint pemolesan additif, tanpa fitur alur baru & tanpa dependency baru. Dengan ini **seluruh roadmap Sprint 0–7 selesai**: alur naratif 7 fase lengkap end-to-end + dipoles secara sinematik/performa.

**File baru:**
- `experience/fx/DisintegrationFX.tsx` — FX partikel "naik/luruh" reusable (disebut bible). Pola points + shaderMaterial seperti `ParticleField`: tiap titik punya `aSeed`/`aSpeed`, umur berulang (`fract`) menggerakkan drift naik (`uRise`) + ayun halus, fade hidup-mati via `vAlpha` (sinus umur), `AdditiveBlending` + soft-circle. Jumlah titik default mengikuti anggaran tier (`useQualityTier().moteCount`) agar `low` tetap ringan; bisa di-override via prop `count`. Per-frame hanya memutasi `uTime` (tanpa `setState`). Props: `{ color, area, rise, count }`.

**Edit kecil (additif):**
- `experience/fx/PostFX.tsx` — subscribe `phase`; saat `climax = phase === "revelation" || "finale"`, `Bloom.intensity` 1.2→1.9 & `luminanceThreshold` 0.6→0.45. Memberi kesan cahaya/godrays **mekar** di klimaks tanpa `GodRays` sun-mesh yang rapuh & tanpa dependency baru. `multisampling`/DoF tetap tier-gated (`heavy`).
- `experience/world/zones/FinaleZone.tsx` — tambah `<DisintegrationFX color="#ffd9a0" area={22} rise={16} />` sebagai bara perayaan yang naik perlahan (1 baris + import). Tak mengubah logika rail/`next === null`.

**Definition of Done Sprint 7:**
- [x] Efek baru ter-gate per tier (`DisintegrationFX` ikut `moteCount`; DoF/multisampling tetap `heavy`-only) — tier `low` tidak terbebani.
- [x] Tidak ada dependency baru; arsitektur & style dipertahankan (points+shader pola `ParticleField`; subscribe selektif zustand; per-frame mutate uniform).
- [x] Roadmap §2 → Sprint 7 `[x]`; STATUS → semua ✅; `NEXT_TASK.md` → status "roadmap selesai" + backlog opsional.
- [ ] `npm run dev` + 60fps tier high — **belum diverifikasi** (sandbox offline; jalankan di mesin Anda; profil bila bloom klimaks terasa berat di perangkat lemah).

**Catatan / backlog (opsional, bukan blocker) — lihat `NEXT_TASK.md`:**
- Aset nyata: `public/models/face-pointcloud.glb` (wajah), `.ktx2` foto kenangan, audio cue (howler/`useAudio`, hormati `audioUnlocked`), serta isi nama nyata di `memories.json` (langsung tampil di `FinaleOverlay`).
- Godrays sun-shaft volumetrik sejati (saat ini didekati bloom klimaks) — bila ditambah, gating tier & TANPA dependency baru.
- Tuning fps per-perangkat; profil `FaceParticles`/`DisintegrationFX`/`ParticleField`. `PerformanceMonitor` sudah menurunkan tier saat fps turun.
- Invariant tetap: `PlayerController` early-return non-FREE; per-frame mutate ref/objek three (bukan `setState`); transient via `getState()`.
