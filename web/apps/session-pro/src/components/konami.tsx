"use client";

import { useEffect, useState } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function KonamiEasterEgg() {
  const [index, setIndex] = useState(0);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[index]) {
        if (index === KONAMI.length - 1) {
          setActivated(true);
          setIndex(0);
        } else {
          setIndex((i) => i + 1);
        }
      } else {
        setIndex(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index]);

  if (!activated) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
      onClick={() => setActivated(false)}
    >
      <div className="text-center animate-pulse">
        <div className="text-6xl mb-4">🎮</div>
        <p className="text-2xl font-bold text-green-400">Achievement Unlocked!</p>
        <p className="text-gray-400 mt-2">Deployed with Claude Code + Vercel</p>
        <p className="text-gray-600 text-sm mt-4">(click to close)</p>
      </div>
    </div>
  );
}
