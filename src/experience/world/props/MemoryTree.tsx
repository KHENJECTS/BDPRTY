"use client";

import { useMemo } from "react";
import * as THREE from "three";

type MemoryTreeProps = {
  position: [number, number, number];
  scale?: number;
};

// Pohon kenangan low-poly (ambient, non-interaktif). Gaya selaras FloatingIsland:
// bentuk sederhana + flatShading + warna gelap-hangat sesuai mood 'memories'.
export function MemoryTree({ position, scale = 1 }: MemoryTreeProps) {
  const foliage = useMemo(() => new THREE.Color("#6b3f57"), []);
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 2, 6]} />
        <meshStandardMaterial color="#3a2630" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0, 2.4, 0]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color={foliage}
          emissive={foliage}
          emissiveIntensity={0.25}
          roughness={0.6}
          flatShading
        />
      </mesh>
    </group>
  );
}
