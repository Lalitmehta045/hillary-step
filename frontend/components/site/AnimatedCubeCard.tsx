"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./AnimatedCubeCard.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type CubeProps = {
  className?: string;
};

function Cube({ className = "" }: CubeProps) {
  return (
    <svg
      className={`cube ${className}`}
      viewBox="0 0 100 115"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top */}
      <polygon
        className="cube-top"
        points="50,4 91,27 50,50 9,27"
      />

      {/* Left */}
      <polygon
        className="cube-left"
        points="9,27 50,50 50,96 9,73"
      />

      {/* Right */}
      <polygon
        className="cube-right"
        points="50,50 91,27 91,73 50,96"
      />
    </svg>
  );
}

interface AnimatedCubeCardProps {
  standalone?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export function AnimatedCubeCard({
  standalone = false,
  className = "",
  wrapperClassName = "",
}: AnimatedCubeCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cube1 = ".cube-1";
      const cube2 = ".cube-2";
      const cube3 = ".cube-3";

      /*
       * Initial position:
       * All cubes are stacked together in the center.
       */
      gsap.set([cube1, cube2, cube3], {
        x: 0,
        y: 0,
        scale: 0.9,
        opacity: 1,
      });

      /*
       * Timeline
       *
       * 0 → 1.4 sec
       * Cubes emerge from the center.
       *
       * 1.4 → 2.1 sec
       * Formation holds.
       *
       * 2.1 → 3.5 sec
       * Cubes return into the center.
       */
      const tl = gsap.timeline({
        repeat: -1,
        defaults: {
          ease: "power2.inOut",
        },
      });

      // Cube 1 — moves up/left
      tl.to(
        cube1,
        {
          x: -24,
          y: -6,
          scale: 1,
          duration: 1.25,
          ease: "power2.out",
        },
        0
      );

      // Cube 2 — moves upward (comfortable headroom, no clipping)
      tl.to(
        cube2,
        {
          x: 0,
          y: -19,
          scale: 1.04,
          duration: 1.25,
          ease: "power2.out",
        },
        0.12
      );

      // Cube 3 — moves right
      tl.to(
        cube3,
        {
          x: 25,
          y: -2,
          scale: 0.96,
          duration: 1.25,
          ease: "power2.out",
        },
        0.24
      );

      // Small hold
      tl.to({}, { duration: 0.55 });

      /*
       * Collapse back into the center.
       *
       * Slightly staggered so it feels like
       * the cubes are physically entering each other.
       */
      tl.to(
        cube3,
        {
          x: 0,
          y: 0,
          scale: 0.9,
          duration: 1.1,
          ease: "power2.inOut",
        },
        "collapse"
      );

      tl.to(
        cube1,
        {
          x: 0,
          y: 0,
          scale: 0.9,
          duration: 1.15,
          ease: "power2.inOut",
        },
        "collapse+=0.12"
      );

      tl.to(
        cube2,
        {
          x: 0,
          y: 0,
          scale: 0.9,
          duration: 1.15,
          ease: "power2.inOut",
        },
        "collapse+=0.24"
      );

      // Tiny pause before the next emergence
      tl.to({}, { duration: 0.3 });
    }, container);

    return () => ctx.revert();
  }, []);

  const cardContent = (
    <div className={`cube-card ${className}`}>
      <div className="cube-visual">
        <div className="cube-stage">
          <Cube className="cube-1" />
          <Cube className="cube-2" />
          <Cube className="cube-3" />
        </div>
      </div>

      <div className="cube-copy">
        <div>People-centric.</div>
        <div>AI-powered.</div>
        <div>Outcome-driven.</div>
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div ref={containerRef} className={`cube-card-wrapper ${wrapperClassName}`}>
        {cardContent}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {cardContent}
    </div>
  );
}

export default AnimatedCubeCard;
