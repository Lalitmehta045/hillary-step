"use client";

import { m } from "framer-motion";
import { hoverVariants } from "@/components/motion/variants";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: keyof typeof hoverVariants;
  "aria-label"?: string;
}

export function AnimatedButton({
  children,
  className = "",
  href,
  onClick,
  type = "button",
  variant = "subtleShadow",
  "aria-label": ariaLabel,
}: AnimatedButtonProps) {
  const hoverVariant = hoverVariants[variant];

  if (href) {
    return (
      <m.a
        href={href}
        className={className}
        whileHover={hoverVariant}
        whileTap={variant === "socialIcon" ? hoverVariants.socialTap : hoverVariants.tap}
        transition={{ duration: 0.25 }}
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
      whileTap={variant === "socialIcon" ? hoverVariants.socialTap : hoverVariants.tap}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </m.button>
  );
}
