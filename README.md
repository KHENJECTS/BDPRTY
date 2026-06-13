# The Impossible Journey

Pengalaman web 3D sinematik (Next.js 15 · TypeScript · React Three Fiber · Three.js · Drei · GSAP · Framer Motion · @react-three/postprocessing · GLSL · Zustand · Howler).

> Sebuah dunia yang dibangun bukan untuk dilihat, tapi untuk _dimasuki_.

Dokumen desain lengkap ("production bible") adalah sumber kebenaran arsitektur: lihat **THE IMPOSSIBLE JOURNEY — Experience Design & Production Bible**.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Butuh Node 18+ (disarankan 20+). WebGL2 di-render hanya di client (`app/page.tsx` memuat `Experience` via `dynamic({ ssr: false })`).

## Arsitektur singkat

Satu `<Canvas>` persisten. `Director` mengorkestrasi kamera + player + world. Fase
(`threshold → awakening → … → finale`) adalah **state** di Zustand, bukan halaman.
`PhaseEnvironment` men-damp lighting/fog menuju mood fase aktif; `PhaseManager`
memilih zona yang aktif. Logika per-frame **memutasi ref/objek three**, store hanya
untuk transisi diskret.

Detail status & langkah berikutnya: lihat `HANDOFF.md`.

## Aset (belum disertakan)

Letakkan aset di `public/` sesuai manifest `public/data/memories.json`:
`models/`, `hdri/`, `audio/`, `textures/`. Kode aman jika aset belum ada
(mis. ambient audio gagal load tidak meng-crash app).
