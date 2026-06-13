import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Impossible Journey",
  description:
    "Sebuah dunia yang dibangun bukan untuk dilihat, tapi untuk dimasuki.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
