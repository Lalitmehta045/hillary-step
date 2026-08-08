"use client";

import { m } from "framer-motion";

export function AnimatedMountainMask() {
  return (
    <div
      className="w-full h-full opacity-70 overflow-hidden"
      style={{
        WebkitMaskImage: "url(/assets/mountain-outline.png)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "bottom right",
        maskImage: "url(/assets/mountain-outline.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "bottom right",
      }}
    >
      {/* 
        Instead of animating backgroundPosition (triggers paint every frame),
        use a wider gradient div and animate translateX (compositor-only, GPU accelerated).
        The visual result is identical: a gradient that shifts across the mask.
      */}
      <m.div
        animate={{ x: ["0%", "-50%", "0%"] }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
        className="h-full will-change-transform transform-gpu"
        style={{
          width: "200%",
          background: "linear-gradient(-45deg, #1a6cff, #40f600, #ff9500, #1a6cff, #40f600, #ff9500)",
        }}
      />
    </div>
  );
}
