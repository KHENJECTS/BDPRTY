import * as THREE from "three";
import { MathUtils } from "three";

// Frame-rate independent damping
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number,
) {
  return MathUtils.damp(current, target, lambda, dt);
}

export function damp3(
  v: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number,
) {
  v.x = MathUtils.damp(v.x, target.x, lambda, dt);
  v.y = MathUtils.damp(v.y, target.y, lambda, dt);
  v.z = MathUtils.damp(v.z, target.z, lambda, dt);
  return v;
}

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
