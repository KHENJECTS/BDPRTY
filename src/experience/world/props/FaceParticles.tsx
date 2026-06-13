"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useQualityTier } from "@/hooks/useQualityTier";
import { REVELATION } from "@/lib/constants";

// Vertex: tiap titik "berhamburan -> menyatu". `position` = rumah (bentuk wajah),
// `aScatter` = posisi awal acak. `uProgress` 0..1 (digerakkan elapsed) mencampur
// keduanya dengan easing + delay per-titik agar perakitan terasa organik.
const faceVert = `
uniform float uTime;
uniform float uSize;
uniform float uProgress;
attribute vec3 aScatter;
attribute float aDelay;
attribute float aPhase;
varying float vAlpha;
void main() {
  float p = clamp((uProgress - aDelay) / (1.0 - aDelay), 0.0, 1.0);
  p = p < 0.5 ? 4.0 * p * p * p : 1.0 - pow(-2.0 * p + 2.0, 3.0) / 2.0;
  vec3 pos = mix(aScatter, position, p);
  pos.x += sin(uTime * 0.5 + aPhase) * 0.09 * (1.0 - p);
  pos.y += cos(uTime * 0.4 + aPhase) * 0.09 * (1.0 - p);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (90.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
  vAlpha = 0.45 + 0.55 * p;
}
`;

const faceFrag = `
precision highp float;
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor, a);
}
`;

type FaceParticlesProps = {
  color?: string;
};

// Point-cloud wajah sang peraya. Catatan aset: model nyata ada di
// `memories.json.faceModel` (.glb); selama aset/loader belum tersedia (offline),
// dipakai fallback prosedural — kepala ellipsoid dengan rongga mata & mulut
// (negative space) agar terbaca sebagai wajah. Saat .glb tersedia, ganti
// generator `home` dengan sampling vertex model (mis. drei `useGLTF`, pakai guard).
export function FaceParticles({ color = "#fdf6ff" }: FaceParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const elapsed = useRef(0);
  const { moteCount } = useQualityTier();
  const count = Math.max(1500, moteCount * 3);

  const { home, scatter, delays, phases } = useMemo(() => {
    const home = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const delays = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // --- rumah: titik pada permukaan kepala ellipsoid, condong ke depan,
      // dengan rongga mata & mulut untuk kesan wajah ---
      let x = 0;
      let y = 0;
      let z = 0;
      for (let tries = 0; tries < 24; tries++) {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * Math.PI * 2;
        let sx = Math.sin(theta) * Math.cos(phi);
        const sy = Math.cos(theta);
        let sz = Math.sin(theta) * Math.sin(phi);
        if (sz < -0.2 && Math.random() < 0.7) continue; // condong ke depan
        sx *= 0.92;
        const ey = sy * 1.22;
        sz *= 0.86;
        // rongga (negative space) di bagian depan wajah
        if (sz > 0.45) {
          const ax = Math.abs(sx);
          const isEye = ey > 0.12 && ey < 0.42 && ax > 0.16 && ax < 0.5;
          const isMouth = ey > -0.58 && ey < -0.32 && ax < 0.34;
          if (isEye || isMouth) continue;
        }
        x = sx;
        y = ey;
        z = sz;
        break;
      }
      home[i * 3] = x;
      home[i * 3 + 1] = y;
      home[i * 3 + 2] = z;

      // --- scatter: cangkang bola acak besar (berhamburan) ---
      const st = Math.acos(2 * Math.random() - 1);
      const sp = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 4;
      scatter[i * 3] = Math.sin(st) * Math.cos(sp) * r;
      scatter[i * 3 + 1] = Math.cos(st) * r;
      scatter[i * 3 + 2] = Math.sin(st) * Math.sin(sp) * r;

      delays[i] = Math.random() * 0.45;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { home, scatter, delays, phases };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 7 },
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color],
  );

  useFrame((_, dt) => {
    elapsed.current += dt;
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += dt;
    matRef.current.uniforms.uProgress.value = Math.min(
      elapsed.current / REVELATION.assembleDuration,
      1,
    );
  });

  return (
    <group position={REVELATION.facePosition} scale={REVELATION.faceScale}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[home, 3]} />
          <bufferAttribute attach="attributes-aScatter" args={[scatter, 3]} />
          <bufferAttribute attach="attributes-aDelay" args={[delays, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          vertexShader={faceVert}
          fragmentShader={faceFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
