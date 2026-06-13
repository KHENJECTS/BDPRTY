"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useQualityTier } from "@/hooks/useQualityTier";

// Vertex: tiap titik punya "umur" yang berulang (`fract`) sehingga partikel
// naik & memudar terus-menerus — efek luruh/bara yang reusable. Hidup-mati via
// `vAlpha` (sinus umur); drift naik (`uRise`) + ayun halus. Pola points sama
// dengan `ParticleField`.
const disVert = `
uniform float uTime;
uniform float uSize;
uniform float uRise;
attribute float aSeed;
attribute float aSpeed;
varying float vAlpha;
void main() {
  float life = fract(uTime * aSpeed * 0.1 + aSeed);
  vec3 p = position;
  p.y += life * uRise;
  p.x += sin((aSeed + life) * 6.2831) * 0.6;
  p.z += cos((aSeed + life) * 6.2831) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (60.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
  vAlpha = sin(life * 3.14159);
}
`;

const disFrag = `
precision highp float;
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor, a);
}
`;

type DisintegrationFXProps = {
  color?: string;
  area?: number;
  rise?: number;
  count?: number;
};

// FX partikel "luruh/naik" yang reusable (disebut bible). Default jumlah titik
// mengikuti anggaran tier (§9) lewat `useQualityTier` agar tier `low` tetap
// ringan; bisa di-override via `count`. Additif & tanpa dependency baru — cocok
// untuk bara perayaan (Finale) atau transisi disintegrasi.
export function DisintegrationFX({
  color = "#ffd9a0",
  area = 20,
  rise = 14,
  count,
}: DisintegrationFXProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { moteCount } = useQualityTier();
  const total = count ?? moteCount;

  const { positions, seeds, speeds } = useMemo(() => {
    const positions = new Float32Array(total * 3);
    const seeds = new Float32Array(total);
    const speeds = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area;
      positions[i * 3 + 1] = Math.random() * area * 0.3 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * area - 6;
      seeds[i] = Math.random();
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, seeds, speeds };
  }, [total, area]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 8 },
      uRise: { value: rise },
      uColor: { value: new THREE.Color(color) },
    }),
    [color, rise],
  );

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={disVert}
        fragmentShader={disFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
