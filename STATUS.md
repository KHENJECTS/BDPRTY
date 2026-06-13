# STATUS

| Sprint | Nama | Status |
| --- | --- | --- |
| 0 | Skeleton (Next 15 + R3F + store + loop) | ✅ Selesai |
| 1 | Awakening (sky, fog, pulau, burung, awan, motes, audio, kamera FREE) | ✅ Selesai |
| 2 | Player & Discovery | ⏭️ NEXT TASK |
| 3 | Memories | ⬛ Belum |
| 4 | Impossible (gravity flip, camera RAIL) | ⬛ Belum |
| 5 | Revelation | ⬛ Belum |
| 6 | Finale | ⬛ Belum |
| 7 | Polish & Perf | ⬛ Belum |

**Verifikasi:** JSON valid (jq); 36 file TS/TSX/CSS/mjs ter-parse Prettier tanpa error & diformat.

**[Sesi 2] Fix dependency:** runtime error `ReactCurrentOwner` (R3F v8 di atas React 19) sudah diperbaiki — React/react-dom dipin ke 18.3.1 + `overrides`. Setelah update WAJIB `rm -rf node_modules package-lock.json && npm install`. Detail di `HANDOFF.md` §7.

**Lanjut di:** `NEXT_TASK.md` · **Konteks lengkap:** `HANDOFF.md`

## Ditangguhkan ke sprint berikut (jangan dianggap hilang)

Komponen ini disebut di bible namun memang baru relevan di Sprint 3–6:
`ui/FinaleOverlay.tsx`, `world/props/MemoryPhoto|MemoryTree|Constellation`,
`MemoryPortal` (shader portal sudah ada di `shaders/memoryPortal/frag.glsl`),
shader `godrays`, zona `Discovery|Memories|Impossible|Revelation|Finale`,
`DisintegrationFX`, `FaceParticles`.
