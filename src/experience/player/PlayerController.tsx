"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { useCharacterMovement } from "./useCharacterMovement";
import { PLAYER } from "@/lib/constants";

// Player mode FREE (Sprint 2): WASD + look (pointer-lock), Shift lari,
// Space lompat. Posisi/orientasi kamera dimutasi via ref di useFrame (tanpa
// setState — lihat §4 aturan). Input bersumber dari useCharacterMovement agar
// dukungan mobile bisa ditambah tanpa menyentuh komponen ini. Gravitasi dibaca
// dari store agar Sprint 4 dapat membaliknya tanpa refactor.
export function PlayerController() {
  const { camera } = useThree();
  const input = useCharacterMovement();
  const velocity = useRef(new THREE.Vector3());
  const verticalVel = useRef(0);

  const forward = useRef(new THREE.Vector3());
  const strafe = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useFrame((_, dtRaw) => {
    const state = useExperienceStore.getState();
    if (state.cameraMode !== "FREE") return;

    const dt = Math.min(dtRaw, 0.05); // redam lonjakan dt saat tab tak fokus
    const i = input.current;

    // --- look ---
    euler.current.set(i.pitch, i.yaw, 0, "YXZ");
    camera.quaternion.setFromEuler(euler.current);

    // --- gerak horizontal relatif yaw ---
    const speed = (i.run ? PLAYER.runSpeed : PLAYER.walkSpeed) * dt;
    forward.current.set(-Math.sin(i.yaw), 0, -Math.cos(i.yaw));
    strafe.current.set(forward.current.z, 0, -forward.current.x);
    dir.current.set(0, 0, 0);
    dir.current.addScaledVector(forward.current, i.forward);
    dir.current.addScaledVector(strafe.current, i.right);
    if (dir.current.lengthSq() > 0) dir.current.normalize();
    dir.current.multiplyScalar(speed);
    velocity.current.lerp(dir.current, PLAYER.accel);
    camera.position.x += velocity.current.x;
    camera.position.z += velocity.current.z;

    // --- vertikal: hormati gravity dari store (Sprint 4 membaliknya) ---
    const g = state.gravity[1];
    if (i.jump) {
      verticalVel.current = -Math.sign(g || -1) * PLAYER.jumpImpulse;
      i.jump = false;
    }
    verticalVel.current += g * PLAYER.gravityScale * dt;
    camera.position.y += verticalVel.current * dt;

    // clamp hover sesuai arah gravitasi
    if (g < 0 && camera.position.y < PLAYER.floorY) {
      camera.position.y = PLAYER.floorY;
      verticalVel.current = 0;
    } else if (g > 0 && camera.position.y > PLAYER.ceilingY) {
      camera.position.y = PLAYER.ceilingY;
      verticalVel.current = 0;
    }
  });

  return null;
}
