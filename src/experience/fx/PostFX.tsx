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
  const phase = useExperienceStore((s) => s.phase);
  const heavy = quality === "high" || quality === "ultra";
  // Klimaks (revelation/finale): bloom membesar untuk kesan cahaya/godrays
  // mekar — additif, tanpa GodRays sun-mesh yang rapuh & tanpa dependency baru.
  const climax = phase === "revelation" || phase === "finale";
  const caOffset: [number, number] = [0.0006, 0.0006];

  return (
    <EffectComposer multisampling={heavy ? 4 : 0}>
      <Bloom
        intensity={climax ? 1.9 : 1.2}
        luminanceThreshold={climax ? 0.45 : 0.6}
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
