"use client";

import { m } from "framer-motion";
import { hoverVariants } from "@/components/motion/variants";
import { ReactNode, memo } from "react";

// Hoisted — single object reused across all button instances
const defaultTransition = { duration: 0.25 };

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: keyof typeof hoverVariants;
  "aria-label"?: string;
}

export const AnimatedButton = memo(function AnimatedButton({
  children,
  className = "",
  href,
  onClick,
  type = "button",
  variant = "subtleShadow",
  "aria-label": ariaLabel,
}: AnimatedButtonProps) {
  const hoverVariant = hoverVariants[variant];
  const tapVariant = variant === "socialIcon" ? hoverVariants.socialTap : hoverVariants.tap;

  if (href) {
    return (
      <m.a
        href={href}
        className={className}
        whileHover={hoverVariant}
        whileTap={tapVariant}
        transition={defaultTransition}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </m.a>
    );
  }

  return (
    <m.button
      type={type}
      className={className}
      whileHover={hoverVariant}
      whileTap={tapVariant}
      transition={defaultTransition}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </m.button>
  );
});
