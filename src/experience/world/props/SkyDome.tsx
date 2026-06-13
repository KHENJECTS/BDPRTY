"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SKY } from "@/lib/constants";
import vertexShader from "@/experience/shaders/skydome/vertex.glsl";
import fragmentShader from "@/experience/shaders/skydome/frag.glsl";

// Skydome prosedural untuk Awakening: bola raksasa BackSide, gradient + sun glow.
export function SkyDome() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Uniforms di-extract jadi const agar JSX tetap rapi (single-brace props)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTopColor: { value: new THREE.Color(SKY.topColor) },
      uMidColor: { value: new THREE.Color(SKY.midColor) },
      uBottomColor: { value: new THREE.Color(SKY.bottomColor) },
      uSunColor: { value: new THREE.Color(SKY.sunColor) },
      uSunDir: {
        value: new THREE.Vector3(
          SKY.sunDir[0],
          SKY.sunDir[1],
          SKY.sunDir[2],
        ).normalize(),
      },
    }),
    [],
  );

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[900, 48, 24]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
