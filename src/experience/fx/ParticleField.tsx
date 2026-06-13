"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useQualityTier } from "@/hooks/useQualityTier";

const moteVert = `
uniform float uTime;
uniform float uSize;
attribute float aPhase;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.3 + aPhase) * 1.2;
  p.x += cos(uTime * 0.2 + aPhase) * 0.8;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (60.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
  vAlpha = 0.4 + 0.6 * sin(uTime + aPhase);
}
`;

const moteFrag = `
precision highp float;
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor, a);
}
`;

type ParticleFieldProps = {
  color?: string;
  area?: number;
};

// Partikel hidup (motes) yang melayang — fondasi "living world" + cue diegetik
// (§2). Jumlah partikel mengikuti anggaran tier (§9).
export function ParticleField({
  color = "#cfe0ff",
  area = 80,
}: ParticleFieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { moteCount } = useQualityTier();

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(moteCount * 3);
    const phases = new Float32Array(moteCount);
    for (let i = 0; i < moteCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area;
      positions[i * 3 + 1] = Math.random() * area * 0.5 - 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * area - 20;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, [moteCount, area]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 6 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color],
  );

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={moteVert}
        fragmentShader={moteFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
