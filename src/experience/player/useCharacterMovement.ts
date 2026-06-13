"use client";

import { useEffect, useRef } from "react";
import { MathUtils } from "three";
import { PLAYER } from "@/lib/constants";

export type MovementInput = {
  forward: number; // -1..1
  right: number; // -1..1
  run: boolean;
  jump: boolean; // impuls sekali-pakai; konsumen mereset ke false setelah dipakai
  yaw: number; // radian, look kiri/kanan
  pitch: number; // radian, look atas/bawah (clamped)
};

// Input gerak terpadu (Sprint 2): WASD + Shift (lari) + Space (lompat) dan look
// via pointer-lock. Mengembalikan ref agar PlayerController membacanya di
// useFrame tanpa setState (lihat aturan §4: jangan setState per-frame).
// Disatukan di sini agar dukungan mobile (joystick/gyro) bisa ditambahkan nanti
// tanpa menyentuh PlayerController.
export function useCharacterMovement() {
  const input = useRef<MovementInput>({
    forward: 0,
    right: 0,
    run: false,
    jump: false,
    yaw: 0,
    pitch: 0,
  });

  useEffect(() => {
    const keys = { w: false, a: false, s: false, d: false };
    const sync = () => {
      input.current.forward = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
      input.current.right = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    };
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.w = true;
      if (e.code === "KeyA") keys.a = true;
      if (e.code === "KeyS") keys.s = true;
      if (e.code === "KeyD") keys.d = true;
      if (e.code === "Space") input.current.jump = true;
      if (e.shiftKey) input.current.run = true;
      sync();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.w = false;
      if (e.code === "KeyA") keys.a = false;
      if (e.code === "KeyS") keys.s = false;
      if (e.code === "KeyD") keys.d = false;
      if (!e.shiftKey) input.current.run = false;
      sync();
    };
    const look = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      input.current.yaw -= e.movementX * PLAYER.lookSensitivity;
      input.current.pitch = MathUtils.clamp(
        input.current.pitch - e.movementY * PLAYER.lookSensitivity,
        -1.2,
        1.2,
      );
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("mousemove", look);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("mousemove", look);
    };
  }, []);

  return input;
}
