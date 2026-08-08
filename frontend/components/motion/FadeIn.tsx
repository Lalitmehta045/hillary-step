"use client";

import { m } from "framer-motion";
import { ReactNode, memo } from "react";

export const EASING: [number, number, number, number] = [0.25, 1, 0.5, 1]; // easeOut
export const DURATION = 0.8;

// Hoisted outside component — prevents re-creation on every render
const fadeInInitial = { opacity: 0, y: 32 };
const fadeInAnimate = { opacity: 1, y: 0 };
const staggerContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const staggerItemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASING },
  },
};

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: "some" | "all" | number;
}

// Viewport config hoisted — same reference reused across all FadeIn instances
const fadeInViewport = { once: true, amount: 0.3 as const };

export const FadeIn = memo(function FadeIn({ children, delay = 0, className = "", amount = 0.3 }: FadeInProps) {
  const viewport = amount === 0.3 ? fadeInViewport : { once: true, amount };
  return (
    <m.div
      initial={fadeInInitial}
      whileInView={fadeInAnimate}
      viewport={viewport}
      transition={{
        duration: DURATION,
        ease: EASING,
        delay,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
});

// Viewport config for stagger containers
const staggerViewport = { once: true, amount: 0.1 as const };

export const StaggerContainer = memo(function StaggerContainer({ children, className = "", animateOnMount = false }: { children: ReactNode; className?: string; animateOnMount?: boolean }) {
  const animationProps = animateOnMount ? { animate: "visible" as const } : { whileInView: "visible" as const };

  return (
    <m.div
      initial="hidden"
      {...animationProps}
      viewport={staggerViewport}
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </m.div>
  );
});

export const StaggerItem = memo(function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      variants={staggerItemVariants}
      className={className}
    >
      {children}
    </m.div>
  );
});
