"use client";

import { useEffect, useRef } from "react";

export type MovementInput = {
  forward: number; // -1..1
  right: number; // -1..1
  run: boolean;
};

// Scaffold input gerak terpadu. PlayerController saat ini menangani input
// keyboard + pointer-lock secara internal (lihat PlayerController.tsx).
// Hook ini disiapkan untuk Sprint 2 guna menyatukan desktop (WASD) dengan
// mobile (virtual joystick + gyro) tanpa refactor besar PlayerController.
export function useCharacterMovement() {
  const input = useRef<MovementInput>({ forward: 0, right: 0, run: false });

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
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return input;
}
