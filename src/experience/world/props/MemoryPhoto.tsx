"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { makePlaceholderTexture } from "@/lib/placeholderTexture";
import { damp } from "@/lib/math";
import { MEMORY } from "@/lib/constants";

type MemoryPhotoProps = {
  id: string;
  position: [number, number, number];
};

// Bidang foto kenangan melayang (billboard). Texture nyata (.ktx2) mungkin belum
// ada di public/, jadi memakai placeholder gradient prosedural -> aman tanpa
// aset. Bob lembut + menghadap kamera; sedikit lebih terang saat kenangan aktif.
export function MemoryPhoto({ id, position }: MemoryPhotoProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const basePos = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position],
  );
  const tex = useMemo(() => makePlaceholderTexture(id), [id]);

  useFrame(({ camera, clock }, dt) => {
    const g = group.current;
    const m = mat.current;
    if (!g || !m) return;
    g.position.y = basePos.y + Math.sin(clock.elapsedTime * 0.6) * 0.25;
    g.quaternion.copy(camera.quaternion); // billboard menghadap kamera
    const active = useExperienceStore.getState().activeMemoryId === id;
    m.opacity = damp(m.opacity, active ? 1 : 0.78, 4, dt);
  });

  return (
    <group ref={group} position={position}>
      {/* bingkai gelap di belakang foto */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry
          args={[MEMORY.photoSize * 1.08, MEMORY.photoSize * 1.08]}
        />
        <meshBasicMaterial color="#0b0710" side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <planeGeometry args={[MEMORY.photoSize, MEMORY.photoSize]} />
        <meshBasicMaterial
          ref={mat}
          map={tex}
          transparent
          opacity={0.78}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
