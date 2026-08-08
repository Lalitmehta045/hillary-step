"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";

export const EASING: [number, number, number, number] = [0.25, 1, 0.5, 1]; // easeOut
export const DURATION = 0.8;

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: "some" | "all" | number;
}

export function FadeIn({ children, delay = 0, className = "", amount = 0.3 }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
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
}

export function StaggerContainer({ children, className = "", animateOnMount = false }: { children: ReactNode; className?: string; animateOnMount?: boolean }) {
  const animationProps = animateOnMount ? { animate: "visible" } : { whileInView: "visible" };

  return (
    <m.div
      initial="hidden"
      {...animationProps}
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION, ease: EASING },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
