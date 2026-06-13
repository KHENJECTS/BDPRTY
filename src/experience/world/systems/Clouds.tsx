"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const cloudVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFrag = `
precision highp float;
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float d = distance(vUv, vec2(0.5));
  float a = smoothstep(0.5, 0.05, d) * uOpacity;
  gl_FragColor = vec4(uColor, a);
}
`;

type CloudPlane = {
  pos: [number, number, number];
  scale: number;
  drift: number;
  phase: number;
};

// Awan volumetric "fake": billboard lembut additive yang melayang pelan
// (parallax). Murah & mobile-friendly (§9, alih-alih volumetrics penuh).
export function Clouds() {
  const group = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#9fb4e8") },
      uOpacity: { value: 0.28 },
    }),
    [],
  );

  const planes = useMemo<CloudPlane[]>(
    () =>
      Array.from({ length: 14 }, () => ({
        pos: [
          (Math.random() - 0.5) * 160,
          -6 + Math.random() * 40,
          -30 - Math.random() * 120,
        ] as [number, number, number],
        scale: 20 + Math.random() * 60,
        drift: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const p = planes[i];
      child.position.x = p.pos[0] + Math.sin(t * 0.05 * p.drift + p.phase) * 8;
      child.quaternion.copy(state.camera.quaternion); // billboard ke kamera
    });
  });

  return (
    <group ref={group}>
      {planes.map((p, i) => (
        <mesh key={i} position={p.pos} scale={[p.scale, p.scale * 0.55, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            vertexShader={cloudVert}
            fragmentShader={cloudFrag}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
