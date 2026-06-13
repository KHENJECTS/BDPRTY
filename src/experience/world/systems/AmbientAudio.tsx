"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";
import { useAudio } from "@/hooks/useAudio";

// Ambient stem yang fade-in setelah audio di-unlock (gesture di Threshold).
// Asset opsional: jika /audio/awakening-ambient.webm belum ada, Howler tetap
// aman (tidak crash) — audio bisa ditambahkan tanpa mengubah kode.
export function AmbientAudio() {
  const audioUnlocked = useExperienceStore((s) => s.audioUnlocked);
  const ambient = useAudio("/audio/awakening-ambient.webm", {
    loop: true,
    volume: 0,
  });

  useEffect(() => {
    if (!audioUnlocked || !ambient) return;
    ambient.play();
    ambient.fade(0, 0.6, 4000);
    return () => {
      ambient.fade(ambient.volume(), 0, 1500);
    };
  }, [audioUnlocked, ambient]);

  return null;
}
