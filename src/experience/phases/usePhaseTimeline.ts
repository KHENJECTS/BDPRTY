"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { useExperienceStore } from "@/state/useExperienceStore";
import type { Phase } from "@/state/useExperienceStore";
import { PHASE_FLOW } from "./phaseConfig";

// Master timeline pengalaman:
//  1) Setiap kali phase berubah, set cameraMode dari PHASE_FLOW.
//  2) Auto-advance fase ber-minDuration (mis. awakening 8s -> discovery) via
//     PHASE_FLOW.next; fase tanpa minDuration lanjut manual (discovery menunggu
//     cukup discoverable -> memories).
//  3) Menjalankan jam global (store.progress 0..1) selama ≈ 8 menit, dipause
//     saat di threshold. progress dipakai FX & kamera rail di sprint berikutnya.
export function usePhaseTimeline() {
  useEffect(() => {
    const applyCameraMode = (phase: ReturnType<typeof phaseOf>) => {
      useExperienceStore.getState().setCameraMode(PHASE_FLOW[phase].cameraMode);
    };
    function phaseOf() {
      return useExperienceStore.getState().phase;
    }
    applyCameraMode(phaseOf());

    const unsub = useExperienceStore.subscribe(
      (s) => s.phase,
      (phase) => applyCameraMode(phase),
    );
    return unsub;
  }, []);

  // Auto-advance berbasis minDuration (Sprint 2): menggerakkan
  // awakening -> discovery setelah durasi minimal. Dibatalkan jika fase berubah
  // lebih dulu (mis. transisi manual via discoverable).
  useEffect(() => {
    let pending: gsap.core.Tween | null = null;
    const schedule = (phase: Phase) => {
      pending?.kill();
      pending = null;
      const cfg = PHASE_FLOW[phase];
      if (cfg.minDuration != null && cfg.next) {
        const next = cfg.next;
        pending = gsap.delayedCall(cfg.minDuration, () => {
          const s = useExperienceStore.getState();
          if (s.phase === phase) s.setPhase(next);
        });
      }
    };
    schedule(useExperienceStore.getState().phase);
    const unsub = useExperienceStore.subscribe(
      (s) => s.phase,
      (phase) => schedule(phase),
    );
    return () => {
      pending?.kill();
      unsub();
    };
  }, []);

  useEffect(() => {
    const proxy = { p: useExperienceStore.getState().progress };
    const tween = gsap.to(proxy, {
      p: 1,
      duration: 8 * 60,
      ease: "none",
      paused: useExperienceStore.getState().phase === "threshold",
      onUpdate: () => useExperienceStore.getState().setProgress(proxy.p),
    });

    const unsub = useExperienceStore.subscribe(
      (s) => s.phase,
      (phase) => {
        if (phase === "threshold") tween.pause();
        else tween.resume();
      },
    );

    return () => {
      tween.kill();
      unsub();
    };
  }, []);
}
