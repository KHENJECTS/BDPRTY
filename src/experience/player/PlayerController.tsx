"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";

const keys = { w: false, a: false, s: false, d: false, shift: false };

export function PlayerController() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.w = true;
      if (e.code === "KeyA") keys.a = true;
      if (e.code === "KeyS") keys.s = true;
      if (e.code === "KeyD") keys.d = true;
      if (e.shiftKey) keys.shift = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.w = false;
      if (e.code === "KeyA") keys.a = false;
      if (e.code === "KeyS") keys.s = false;
      if (e.code === "KeyD") keys.d = false;
      if (!e.shiftKey) keys.shift = false;
    };
    const move = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current -= e.movementX * 0.0022;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - e.movementY * 0.0022,
          -1.2,
          1.2,
        );
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useFrame((_, dt) => {
    if (useExperienceStore.getState().cameraMode !== "FREE") return;
    const speed = (keys.shift ? 10 : 4) * dt;
    const dir = new THREE.Vector3();
    const forward = new THREE.Vector3(
      -Math.sin(yaw.current),
      0,
      -Math.cos(yaw.current),
    );
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    if (keys.w) dir.add(forward);
    if (keys.s) dir.sub(forward);
    if (keys.d) dir.add(right);
    if (keys.a) dir.sub(right);
    dir.normalize().multiplyScalar(speed);
    velocity.current.lerp(dir, 0.2);
    camera.position.add(velocity.current);
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);
  });

  return null;
}
