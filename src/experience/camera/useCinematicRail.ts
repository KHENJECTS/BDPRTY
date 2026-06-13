"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Target kamera bersama untuk mode RAIL/BLEND. CameraDirector men-damp posisi
// kamera menuju railTarget saat sprint sinematik (Sprint 4+) aktif.
// Disiapkan di sini agar wiring rail tidak perlu refactor CameraDirector.
export const railTarget = new THREE.Vector3(0, 2, 8);
export const railLookAt = new THREE.Vector3(0, 1.5, 0);

// Buat spline dari array titik dan sediakan sampler progress 0..1 yang menulis
// hasilnya ke railTarget (mutasi ref, bukan setState).
export function useCinematicRail(points: Array<[number, number, number]>) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
        false,
        "catmullrom",
        0.5,
      ),
    [points],
  );

  const sample = (t: number) => {
    curve.getPointAt(THREE.MathUtils.clamp(t, 0, 1), railTarget);
    return railTarget;
  };

  return { curve, sample };
}
