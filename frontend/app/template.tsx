"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
