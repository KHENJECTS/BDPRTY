"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useQualityTier } from "@/hooks/useQualityTier";
import { MEMORY } from "@/lib/constants";

type ConstellationProps = {
  center?: [number, number, number];
  color?: string;
};

// Konstelasi bintang ambient untuk kenangan ber-placement 'constellation'.
// Sekumpulan titik (PointsMaterial) di sekitar center; kepadatan mengikuti
// anggaran tier (§9, lihat ParticleField).
export function Constellation({
  center = [0, 0, 0],
  color = "#bcd2ff",
}: ConstellationProps) {
  const { moteCount } = useQualityTier();
  const count = Math.max(60, Math.floor(moteCount * 0.3));

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const spread = MEMORY.constellationSpread;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = center[0] + (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = center[1] + (Math.random() - 0.5) * spread * 0.5;
      arr[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, center]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.6}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
