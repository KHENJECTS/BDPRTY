# STATUS

| Sprint | Nama | Status |
| --- | --- | --- |
| 0 | Skeleton (Next 15 + R3F + store + loop) | ✅ Selesai |
| 1 | Awakening (sky, fog, pulau, burung, awan, motes, audio, kamera FREE) | ✅ Selesai |
| 2 | Player & Discovery | ✅ Selesai |
| 3 | Memories | ✅ Selesai |
| 4 | Impossible (gravity flip, camera RAIL) | ⏭️ NEXT TASK |
| 5 | Revelation | ⬛ Belum |
| 6 | Finale | ⬛ Belum |
| 7 | Polish & Perf | ⬛ Belum |

**Verifikasi:** JSON valid (jq); 36 file TS/TSX/CSS/mjs ter-parse Prettier tanpa error & diformat.

**[Sesi 2] Fix dependency:** runtime error `ReactCurrentOwner` (R3F v8 di atas React 19) — sempat diperbaiki dengan pin React 18.3.1 + `overrides`. **Digantikan oleh Sesi 3.**

**[Sesi 3] Migrasi React 19:** beralih ke React 19 + @react-three/fiber v9 + drei v10 + postprocessing v3 (jalur native Next 15). **`overrides` pin React 18 DIHAPUS** (wajib, kalau tidak upgrade batal). Audit kode statis: AMAN, tanpa perubahan kode. Setelah update WAJIB `rm -rf node_modules package-lock.json && npm install`. Detail di `HANDOFF.md` §8.

**[Sprint 2] Player & Discovery — selesai:** player FREE bisa digerakkan (WASD + look + Shift lari + Space lompat) via `useCharacterMovement`, sadar-gravity; `DiscoveryZone` + orb `Discoverable` (proximity highlight/SFX); auto-advance `awakening→discovery` (minDuration) & `discovery→memories` (saat cukup orb). Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §9.

**[Sprint 3] Memories — selesai:** `MemoryZone` membaca `memories.json`; portal shader (`memoryPortal/frag.glsl`) per kenangan + foto melayang (billboard, placeholder prosedural aman-aset) + dekor ambient (pohon/konstelasi). Mendekat -> `setActiveMemory`; semua kenangan dibuka -> transisi `memories→impossible`. Validasi statis OK (Prettier parse); runtime/fps **belum** diuji (offline). Detail di `HANDOFF.md` §10.

**Lanjut di:** `NEXT_TASK.md` · **Konteks lengkap:** `HANDOFF.md`

## Ditangguhkan ke sprint berikut (jangan dianggap hilang)

Komponen ini disebut di bible namun memang baru relevan di Sprint 4–6:
`ui/FinaleOverlay.tsx`, shader `godrays`, zona `Impossible|Revelation|Finale`,
`DisintegrationFX`, `FaceParticles`.
