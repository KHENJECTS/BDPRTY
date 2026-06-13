"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useQualityTier } from "@/hooks/useQualityTier";

const dummy = new THREE.Object3D();

type BirdSeed = {
  radius: number;
  height: number;
  speed: number;
  phase: number;
  wobble: number;
};

// Burung cahaya: instanced + flocking prosedural (orbit + noise sine), bukan
// physics (§4.3). Jumlah mengikuti anggaran tier (§9).
export function Birds() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { birdCount } = useQualityTier();

  const seeds = useMemo<BirdSeed[]>(
    () =>
      Array.from({ length: birdCount }, () => ({
        radius: 8 + Math.random() * 30,
        height: 4 + Math.random() * 20,
        speed: 0.1 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        wobble: 0.5 + Math.random() * 1.5,
      })),
    [birdCount],
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      const a = s.phase + t * s.speed;
      dummy.position.set(
        Math.cos(a) * s.radius,
        s.height + Math.sin(t * s.wobble + s.phase) * 1.5,
        Math.sin(a) * s.radius - 20,
      );
      dummy.rotation.set(0, -a + Math.PI / 2, Math.sin(t * 4 + s.phase) * 0.4);
      const flap = 0.4 + Math.sin(t * 6 + s.phase) * 0.12; // kepak sayap
      dummy.scale.set(flap, flap, flap);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, birdCount]}
      frustumCulled={false}
    >
      <coneGeometry args={[0.18, 0.9, 3]} />
      <meshBasicMaterial color="#ffe9c4" toneMapped={false} />
    </instancedMesh>
  );
}
