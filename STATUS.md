# STATUS

| Sprint | Nama | Status |
| --- | --- | --- |
| 0 | Skeleton (Next 15 + R3F + store + loop) | ✅ Selesai |
| 1 | Awakening (sky, fog, pulau, burung, awan, motes, audio, kamera FREE) | ✅ Selesai |
| 2 | Player & Discovery | ✅ Selesai |
| 3 | Memories | ✅ Selesai |
| 4 | Impossible (gravity flip, camera RAIL) | ✅ Selesai |
| 5 | Revelation | ✅ Selesai |
| 6 | Finale | ✅ Selesai |
| 7 | Polish & Perf | ✅ Selesai |

**Verifikasi:** JSON valid (jq); seluruh src TS/TSX ter-parse Prettier tanpa error & diformat.

**[Sesi 2] Fix dependency:** runtime error `ReactCurrentOwner` (R3F v8 di atas React 19) — sempat diperbaiki dengan pin React 18.3.1 + `overrides`. **Digantikan oleh Sesi 3.**

**[Sesi 3] Migrasi React 19:** beralih ke React 19 + @react-three/fiber v9 + drei v10 + postprocessing v3 (jalur native Next 15). **`overrides` pin React 18 DIHAPUS** (wajib, kalau tidak upgrade batal). Audit kode statis: AMAN, tanpa perubahan kode. Setelah update WAJIB `rm -rf node_modules package-lock.json && npm install`. Detail di `HANDOFF.md` §8.

**[Sprint 2] Player & Discovery — selesai:** player FREE bisa digerakkan (WASD + look + Shift lari + Space lompat) via `useCharacterMovement`, sadar-gravity; `DiscoveryZone` + orb `Discoverable` (proximity highlight/SFX); auto-advance `awakening→discovery` (minDuration) & `discovery→memories` (saat cukup orb). Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §9.

**[Sprint 3] Memories — selesai:** `MemoryZone` membaca `memories.json`; portal shader (`memoryPortal/frag.glsl`) per kenangan + foto melayang (billboard, placeholder prosedural aman-aset) + dekor ambient (pohon/konstelasi). Mendekat -> `setActiveMemory`; semua kenangan dibuka -> transisi `memories→impossible`. Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §10.

**[Sprint 4] Impossible — selesai:** `ImpossibleZone` (realm terbalik, pulau menggantung) + kamera **RAIL** sinematik (`useCinematicRail` spline -> `CameraDirector` damp3). Gravity flip via `Director`. Auto-advance `impossible→revelation` di akhir rail. Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §11.

**[Sprint 5] Revelation — selesai:** `RevelationZone` (pola `ImpossibleZone`) + `FaceParticles`: partikel berhamburan -> menyatu jadi wajah (fallback prosedural aman-aset; `.glb` belum wajib) diiringi kamera **RAIL** khidmat; auto-advance `revelation→finale`. Gravity normal di fase ini. Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §12.

**[Sprint 6] Finale — selesai:** `FinaleZone` (pola `RevelationZone`, tanpa transisi karena `next === null`) mempertahankan wajah peraya + motes hangat; kamera **RAIL** menjauh perlahan lalu menahan. `FinaleOverlay` (DOM, pola `DiegeticHints`) menampilkan pesan ulang tahun + `celebrant.firstName`. Semua 7 fase kini lengkap end-to-end. Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §13.

**[Sprint 7] Polish & Perf — selesai:** PostFX bloom membesar saat klimaks (`revelation`/`finale`) — kesan cahaya/godrays mekar tanpa GodRays sun-mesh & tanpa dependency baru, tetap tier-gated. `DisintegrationFX` (komponen fx partikel naik/luruh reusable, jumlah titik ikut anggaran tier `useQualityTier`) dipasang sebagai bara perayaan di `FinaleZone`. **Roadmap Sprint 0–7 SELESAI** — alur naratif lengkap + dipoles. Validasi statis OK (Prettier); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §14.

**Status proyek:** semua sprint selesai. Backlog opsional (aset nyata, godrays-shader, audio cue, tuning lanjut) tercatat di `NEXT_TASK.md`.

## Backlog opsional (di luar roadmap inti — bukan blocker)

- `DisintegrationFX` — **SUDAH dibuat** (Sprint 7) & dipakai di `FinaleZone`.
- shader `godrays` penuh — saat ini didekati lewat bloom klimaks; shader sun-shaft sejati opsional (lihat `NEXT_TASK.md`).
- Aset nyata (`.glb` wajah, `.ktx2` foto, audio) & tuning fps per-perangkat — lihat `NEXT_TASK.md`.
