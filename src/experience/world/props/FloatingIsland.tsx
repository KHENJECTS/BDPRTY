"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AWAKENING } from "@/lib/constants";

type FloatingIslandProps = {
  position?: [number, number, number];
  scale?: number;
  seed?: number;
};

// Pulau terapung low-poly: ikosahedron ter-displace yang meruncing ke bawah,
// dengan puncak rumput. Gerak bob prosedural (sine), bukan physics (§4.3).
export function FloatingIsland({
  position = [0, 0, 0],
  scale = 1,
  seed = 1,
}: FloatingIslandProps) {
  const group = useRef<THREE.Group>(null);

  const rockGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(3, 4);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const taper = THREE.MathUtils.clamp(1 + v.y * 0.35, 0.15, 1.6);
      const n =
        Math.sin(v.x * 1.7 + seed) * 0.25 +
        Math.cos(v.z * 1.9 + seed * 2.0) * 0.25;
      v.x *= taper;
      v.z *= taper;
      v.y = v.y < 0 ? v.y * 2.2 : v.y; // bagian bawah meruncing (batu menjuntai)
      v.multiplyScalar(1 + n * 0.12);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);

  const bobPhase = useMemo(() => seed * 1.37, [seed]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y =
      position[1] + Math.sin(t * AWAKENING.cameraFloatSpeed + bobPhase) * 0.3;
    group.current.rotation.y = t * 0.02;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh geometry={rockGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#5b4a3f"
          roughness={1}
          metalness={0}
          flatShading
        />
      </mesh>
      {/* puncak rumput dengan emissive lembut */}
      <mesh position={[0, 1.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.45, 0.5, 7]} />
        <meshStandardMaterial
          color="#3f6b52"
          roughness={0.9}
          emissive="#16331f"
          emissiveIntensity={0.3}
          flatShading
        />
      </mesh>
    </group>
  );
}
