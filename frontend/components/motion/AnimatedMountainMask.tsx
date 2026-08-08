"use client";

import { m } from "framer-motion";

export function AnimatedMountainMask() {
  return (
    <m.div
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
      className="w-full h-full opacity-70"
      style={{
        background: "linear-gradient(-45deg, #1a6cff, #40f600, #ff9500, #1a6cff)",
        backgroundSize: "400% 400%",
        WebkitMaskImage: "url(/assets/mountain-outline.png)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "bottom right",
        maskImage: "url(/assets/mountain-outline.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "bottom right",
      }}
    />
  );
}
