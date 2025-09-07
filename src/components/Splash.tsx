"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 1400); return () => clearTimeout(t); }, []);
  if (done) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-pink-100 dark:bg-black">
      <div className="neon-border rounded-2xl px-8 py-10 text-center bg-white/70 dark:bg-black/70 shadow-glow">
        <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white drop-shadow-neon animate-pulseNeon">
          NeonPDF
        </h1>
        <p className="mt-3 text-sm text-black/70 dark:text-white/70">sliding in…</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-neon-pink animate-slideUp" />
    </div>
  );
}
