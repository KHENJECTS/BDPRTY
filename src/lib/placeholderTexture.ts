import * as THREE from "three";

// Membuat texture gradient prosedural sebagai placeholder foto kenangan.
// memories.json menunjuk aset .ktx2 yang mungkin BELUM ada di public/, jadi
// komponen kenangan WAJIB aman tanpa aset (lihat NEXT_TASK Sprint 3 + pola
// aset/audio Sprint 1). DataTexture murni array -> SSR-safe (tanpa DOM/canvas).
export function makePlaceholderTexture(
  seed: string,
  size = 64,
): THREE.DataTexture {
  const hue = hashHue(seed);
  const top = new THREE.Color().setHSL(hue, 0.55, 0.55);
  const bottom = new THREE.Color().setHSL((hue + 0.12) % 1, 0.6, 0.22);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    const t = y / (size - 1);
    const r = THREE.MathUtils.lerp(top.r, bottom.r, t);
    const g = THREE.MathUtils.lerp(top.g, bottom.g, t);
    const b = THREE.MathUtils.lerp(top.b, bottom.b, t);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = b * 255;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// hue deterministik dari id agar tiap kenangan punya warna placeholder berbeda.
function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h / 360;
}
