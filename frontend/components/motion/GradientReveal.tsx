"use client";

import { m, useReducedMotion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface GradientRevealProps {
  children: ReactNode;
  className?: string;
}

const parentVariants: Variants = {
  hidden: {},
  visible: {},
};

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const textVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const sweepVariants: Variants = {
  hidden: { opacity: 0, backgroundPosition: "-250% 0" },
  visible: {
    opacity: [0, 0.4, 0.4, 0],
    backgroundPosition: ["-250% 0", "-250% 0", "250% 0", "250% 0"],
    transition: {
      duration: 1.2,
      times: [0, 0.1, 0.7, 1.0],
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function GradientReveal({ children, className = "" }: GradientRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <m.span
      className="relative inline-block"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={parentVariants}
    >
      {/* Base Text */}
      <m.span
        className={`inline-block ${className}`}
        variants={textVariants}
      >
        {children}
      </m.span>

      {/* Sweep Overlay */}
      <m.span
        className={`absolute left-0 top-0 w-full h-full pointer-events-none select-none sweep-overlay ${className}`}
        variants={sweepVariants}
        style={{ animation: "none" }} // Force remove infinite shimmer
        aria-hidden="true"
      >
        {children}
      </m.span>
    </m.span>
  );
}
