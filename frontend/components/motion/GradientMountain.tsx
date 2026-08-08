"use client";

import { m } from "framer-motion";

export function GradientMountain() {
  return (
    <div className="relative w-full h-full">
      {/* Back Mountain (Highest) — translateX shimmer instead of backgroundPosition */}
      <div
        className="absolute inset-0 w-full h-full opacity-40 overflow-hidden"
        style={{
          clipPath: "polygon(0% 100%, 25% 45%, 40% 55%, 60% 15%, 75% 35%, 90% 5%, 100% 20%, 100% 100%)",
        }}
      >
        <m.div
          animate={{ x: ["0%", "-50%", "0%"] }}
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
          className="h-full will-change-transform transform-gpu"
          style={{
            width: "200%",
            background: "linear-gradient(-45deg, #1a6cff, #40f600, #ff9500, #1a6cff, #40f600, #ff9500)",
          }}
        />
      </div>
      
      {/* Middle Mountain */}
      <div
        className="absolute inset-0 w-full h-full opacity-60 overflow-hidden"
        style={{
          clipPath: "polygon(0% 100%, 15% 65%, 35% 40%, 50% 50%, 75% 20%, 85% 40%, 100% 30%, 100% 100%)",
        }}
      >
        <m.div
          animate={{ x: ["-50%", "0%", "-50%"] }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
          className="h-full will-change-transform transform-gpu"
          style={{
            width: "200%",
            background: "linear-gradient(-45deg, #40f600, #ffcc00, #1a6cff, #40f600, #ffcc00, #1a6cff)",
          }}
        />
      </div>

      {/* Foreground Mountain (Lowest) */}
      <div
        className="absolute inset-0 w-full h-full opacity-80 overflow-hidden"
        style={{
          clipPath: "polygon(0% 100%, 10% 80%, 30% 60%, 45% 75%, 65% 45%, 85% 65%, 100% 50%, 100% 100%)",
        }}
      >
        <m.div
          animate={{ x: ["0%", "-50%", "0%"] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
          className="h-full will-change-transform transform-gpu"
          style={{
            width: "200%",
            background: "linear-gradient(-45deg, #ff9500, #1a6cff, #40f600, #ff9500, #1a6cff, #40f600)",
          }}
        />
      </div>
    </div>
  );
}
