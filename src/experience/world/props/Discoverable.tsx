"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { useAudio } from "@/hooks/useAudio";
import { DISCOVERY } from "@/lib/constants";
import { PHASE_FLOW } from "@/experience/phases/phaseConfig";
import { damp } from "@/lib/math";

type DiscoverableProps = {
  id: string;
  position: [number, number, number];
  color?: string;
};

// Objek bisa-ditemukan: orb melayang bercahaya. Saat kamera (player) masuk
// glowRadius -> highlight/scale halus; masuk proximityRadius -> tercatat via
// store.discover(id) + SFX. Saat penemuan mencukupi -> setPhase('memories').
// Semua logika per-frame memutasi ref (tanpa setState); state global via store.
export function Discoverable({
  id,
  position,
  color = "#ffd27a",
}: DiscoverableProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const triggered = useRef(false);
  const basePos = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position],
  );
  const bobPhase = useMemo(() => seedPhase(id), [id]);
  const sfx = useAudio(DISCOVERY.sfx, { volume: 0.5 });

  useFrame(({ camera, clock }, dt) => {
    const g = group.current;
    const m = mat.current;
    if (!g || !m) return;

    // bob + spin prosedural (selaras gaya FloatingIsland)
    const t = clock.elapsedTime;
    g.position.y = basePos.y + Math.sin(t * 0.9 + bobPhase) * 0.3;
    g.rotation.y = t * 0.4;

    const dist = camera.position.distanceTo(basePos);
    const found = useExperienceStore.getState().discoveredObjects.has(id);

    // highlight: makin dekat = makin terang & sedikit membesar
    const near = THREE.MathUtils.clamp(
      1 -
        (dist - DISCOVERY.proximityRadius) /
          (DISCOVERY.glowRadius - DISCOVERY.proximityRadius),
      0,
      1,
    );
    m.emissiveIntensity = damp(
      m.emissiveIntensity,
      (found ? 2.2 : 0.5) + near * 1.6,
      6,
      dt,
    );
    g.scale.setScalar(damp(g.scale.x, (found ? 1.25 : 1) + near * 0.15, 6, dt));

    // trigger penemuan (sekali)
    if (!triggered.current && dist <= DISCOVERY.proximityRadius) {
      triggered.current = true;
      useExperienceStore.getState().discover(id);
      sfx?.play();
      // re-baca state SETELAH discover agar size terbarui
      const after = useExperienceStore.getState();
      if (
        after.phase === "discovery" &&
        after.discoveredObjects.size >= DISCOVERY.requiredToAdvance
      ) {
        const next = PHASE_FLOW.discovery.next;
        if (next) after.setPhase(next);
      }
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.1}
          flatShading
        />
      </mesh>
      {/* halo lembut */}
      <pointLight color={color} intensity={1.2} distance={6} decay={2} />
    </group>
  );
}

// fase bob deterministik dari id (agar tiap orb tidak sinkron)
function seedPhase(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return (h / 1000) * Math.PI * 2;
}
