"use client";

import { m } from "framer-motion";

export function GradientMountain() {
  return (
    <div className="relative w-full h-full">
      {/* Back Mountain (Highest) */}
      <m.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          background: "linear-gradient(-45deg, #1a6cff, #40f600, #ff9500)",
          backgroundSize: "400% 400%",
          clipPath: "polygon(0% 100%, 25% 45%, 40% 55%, 60% 15%, 75% 35%, 90% 5%, 100% 20%, 100% 100%)",
        }}
      />
      
      {/* Middle Mountain */}
      <m.div
        animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          background: "linear-gradient(-45deg, #40f600, #ffcc00, #1a6cff)",
          backgroundSize: "400% 400%",
          clipPath: "polygon(0% 100%, 15% 65%, 35% 40%, 50% 50%, 75% 20%, 85% 40%, 100% 30%, 100% 100%)",
        }}
      />

      {/* Foreground Mountain (Lowest) */}
      <m.div
        animate={{ backgroundPosition: ["50% 100%", "50% 0%", "50% 100%"] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-0 w-full h-full opacity-80"
        style={{
          background: "linear-gradient(-45deg, #ff9500, #1a6cff, #40f600)",
          backgroundSize: "400% 400%",
          clipPath: "polygon(0% 100%, 10% 80%, 30% 60%, 45% 75%, 65% 45%, 85% 65%, 100% 50%, 100% 100%)",
        }}
      />
    </div>
  );
}
