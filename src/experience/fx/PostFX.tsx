"use client";

import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { useExperienceStore } from "@/state/useExperienceStore";

export function PostFX() {
  const quality = useExperienceStore((s) => s.quality);
  const heavy = quality === "high" || quality === "ultra";
  const caOffset: [number, number] = [0.0006, 0.0006];

  return (
    <EffectComposer multisampling={heavy ? 4 : 0}>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      {heavy ? (
        <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={3} />
      ) : null}
      <ChromaticAberration offset={caOffset} />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  );
}
