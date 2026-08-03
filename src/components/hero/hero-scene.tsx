"use client";

import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { HeroSceneFallback } from "./hero-scene-fallback";

export function HeroScene() {
  const reduced = useReducedMotionSafe();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (reduced || !ready) return <HeroSceneFallback />;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,75,0.24),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[320px] w-[320px] md:h-[420px] md:w-[420px] [perspective:1000px]">
          <div className="absolute inset-[6%] rounded-full border border-gold/25 [transform:rotateX(72deg)] [transform-style:preserve-3d] animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-[14%] rounded-full border border-gold/35 [transform:rotateY(35deg)] animate-[spin_14s_linear_infinite]" style={{ animationDirection: "reverse" }} />
          <div className="absolute inset-[24%] rounded-full border border-gold/30 [transform:rotateX(-18deg)]" />
          <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(247,243,233,0.95),rgba(201,162,75,0.7)_40%,rgba(11,43,38,0.94)_100%)] shadow-[0_0_80px_rgba(201,162,75,0.22)] [transform:translateZ(60px)]" />
          <div className="absolute inset-[8%] rounded-full border border-white/25" />
          <div className="absolute inset-[42%] h-24 w-24 rounded-full bg-gold/20 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
