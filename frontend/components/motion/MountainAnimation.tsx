"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

export function MountainAnimation({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Subtle parallax effect based on scroll position
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  // As we scroll down (progress 0 to 1), move the mountain slightly down 
  // (relative to its container) so it appears to be further away and moves slower than foreground text.
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 80]); 
  
  return (
    <m.div
      ref={ref}
      style={{ y: yParallax }}
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        duration: 1.8, 
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a very premium, smooth deceleration
        delay: 0.2
      }}
    >
      {/* Continuous breathing effect — GPU-only: translate3d + scale */}
      <m.div
        animate={{ 
          y: [0, -12, 0],
          scale: [1, 1.015, 1],
        }}
        transition={{ 
          duration: 14, 
          ease: "easeInOut", 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="w-full h-full transform-gpu will-change-transform"
      >
        {children}
      </m.div>
    </m.div>
  );
}
