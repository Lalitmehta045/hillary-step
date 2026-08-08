"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      smoothWheel: true,
      syncTouch: false,     // Disabled: let native touch handling work, avoids mobile jitter
      touchMultiplier: 1.5, // Reduced from 2 to prevent over-scrolling
      autoRaf: true,        // Let Lenis manage its own optimal RAF loop
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
