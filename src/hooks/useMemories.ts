"use client";

import { useEffect, useState } from "react";

export type MemoryPlacement = "tree" | "constellation";

export type Memory = {
  id: string;
  photo: string;
  caption: string;
  date: string;
  placement: MemoryPlacement;
  position: [number, number, number];
};

export type MemoriesData = {
  celebrant: { fullName: string; firstName: string };
  faceModel: string;
  memories: Memory[];
};

// Loader data kenangan (public/data/memories.json). Aman-SSR: fetch hanya di
// client via useEffect; mengembalikan list kosong sampai data tiba sehingga
// scene tidak crash bila file belum termuat (pola aset progresif Sprint 1).
export function useMemories(): {
  data: MemoriesData | null;
  memories: Memory[];
} {
  const [data, setData] = useState<MemoriesData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/memories.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setData(json as MemoriesData);
      })
      .catch(() => {
        // diam: zona tetap render tanpa artefak bila data tak tersedia
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, memories: data?.memories ?? [] };
}
