"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroSceneFallback } from "./hero-scene-fallback";

const HeroSceneDynamic = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

export function HeroSceneLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="absolute inset-0">{visible ? <HeroSceneDynamic /> : <HeroSceneFallback />}</div>;
}
