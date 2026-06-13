"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { makePlaceholderTexture } from "@/lib/placeholderTexture";
import { damp } from "@/lib/math";
import { MEMORY } from "@/lib/constants";
import fragmentShader from "@/experience/shaders/memoryPortal/frag.glsl";

// vertex minimal: teruskan uv ke frag (pola shaderMaterial §5, lihat SkyDome).
const portalVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

type MemoryPortalProps = {
  id: string;
  position: [number, number, number];
  onOpen: (id: string) => void;
};

// Portal kenangan: cakram shader (memoryPortal/frag.glsl). uActivation naik saat
// player mendekat; masuk openRadius -> setActiveMemory(id) + onOpen(id) (sekali).
// Foto memakai placeholder prosedural -> aman tanpa aset (.ktx2 belum tentu ada).
// Semua per-frame memutasi ref/uniform (tanpa setState); state global via store.
export function MemoryPortal({ id, position, onOpen }: MemoryPortalProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const opened = useRef(false);
  const basePos = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position],
  );
  const tex = useMemo(() => makePlaceholderTexture(id), [id]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActivation: { value: 0 },
      uPhoto: { value: tex },
    }),
    [tex],
  );

  useFrame(({ camera }, dt) => {
    const m = matRef.current;
    const g = group.current;
    if (!m || !g) return;

    m.uniforms.uTime.value += dt;
    g.rotation.y += dt * 0.2;

    // Portal melayang tinggi (posisi dari memories.json), sedangkan player
    // mengambang di dekat tanah. Pakai jarak HORIZONTAL (bidang XZ, abaikan Y)
    // agar kenangan bisa dibuka dengan berjalan di bawah/dekat portal -- tanpa
    // memindahkan portal atau mengubah desain melayangnya.
    const dx = camera.position.x - basePos.x;
    const dz = camera.position.z - basePos.z;
    const dist = Math.hypot(dx, dz);
    const near = THREE.MathUtils.clamp(
      1 - (dist - MEMORY.openRadius) / (MEMORY.glowRadius - MEMORY.openRadius),
      0,
      1,
    );
    m.uniforms.uActivation.value = damp(
      m.uniforms.uActivation.value,
      near,
      5,
      dt,
    );

    // buka kenangan (sekali) saat cukup dekat
    if (!opened.current && dist <= MEMORY.openRadius) {
      opened.current = true;
      useExperienceStore.getState().setActiveMemory(id);
      onOpen(id);
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <circleGeometry args={[MEMORY.portalRadius, 48]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={portalVert}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent
          toneMapped={false}
        />
      </mesh>
      <pointLight
        color="#9fd0ff"
        intensity={1.4}
        distance={MEMORY.glowRadius}
        decay={2}
      />
    </group>
  );
}
