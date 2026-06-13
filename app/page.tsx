"use client";

import dynamic from "next/dynamic";

// WebGL hanya di client; hindari SSR untuk three
const Experience = dynamic(
  () => import("@/experience/Experience").then((m) => m.Experience),
  { ssr: false },
);

export default function Page() {
  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-black">
      <Experience />
    </main>
  );
}
