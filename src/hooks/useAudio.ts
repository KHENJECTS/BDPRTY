"use client";

import { useEffect, useState } from "react";
import { Howl } from "howler";

type UseAudioOptions = {
  loop?: boolean;
  volume?: number;
  html5?: boolean;
};

// Wrapper Howler aman-SSR. Mengembalikan instance Howl (atau null saat SSR).
// html5:true => streaming progresif (opus/webm), sesuai §1.4 Sound Design.
export function useAudio(src: string, options: UseAudioOptions = {}) {
  const [howl, setHowl] = useState<Howl | null>(null);
  const { loop, volume, html5 } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sound = new Howl({
      src: [src],
      loop: loop ?? false,
      volume: volume ?? 1,
      html5: html5 ?? true,
      preload: true,
    });
    setHowl(sound);
    return () => {
      sound.unload();
    };
  }, [src, loop, volume, html5]);

  return howl;
}
