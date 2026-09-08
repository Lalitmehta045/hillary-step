"use client";

import React, { useEffect, useRef } from "react";

export function RegionsGradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let isVisible = false;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;

      canvas.width = width;
      canvas.height = height;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      const time = now * 0.00015;

      ctx.clearRect(0, 0, width, height);

      /*
       * Base white background
       */
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      /*
       * Main diagonal gradient
       *
       * Pink → Magenta → Purple → Blue → Peach/Orange
       *
       * The gradient moves very slowly to create
       * a subtle fluid feeling.
       */
      const driftX = Math.sin(time) * width * 0.025;
      const driftY = Math.cos(time * 0.8) * height * 0.02;

      const gradient = ctx.createLinearGradient(
        width * 0.18 + driftX,
        height * 0.02 + driftY,
        width * 0.78 + driftX,
        height * 0.98 + driftY
      );

      /*
       * Very soft pink at the top
       */
      gradient.addColorStop(
        0,
        "rgba(255, 184, 230, 0.08)"
      );

      /*
       * Bright pink / magenta
       */
      gradient.addColorStop(
        0.18,
        "rgba(238, 70, 202, 0.30)"
      );

      gradient.addColorStop(
        0.32,
        "rgba(207, 55, 222, 0.34)"
      );

      /*
       * Purple
       */
      gradient.addColorStop(
        0.47,
        "rgba(133, 70, 222, 0.34)"
      );

      /*
       * Violet / blue
       */
      gradient.addColorStop(
        0.60,
        "rgba(89, 83, 224, 0.30)"
      );

      gradient.addColorStop(
        0.70,
        "rgba(106, 77, 211, 0.26)"
      );

      /*
       * Soft peach / orange
       */
      gradient.addColorStop(
        0.82,
        "rgba(255, 150, 122, 0.26)"
      );

      gradient.addColorStop(
        0.92,
        "rgba(255, 188, 156, 0.15)"
      );

      /*
       * Fade back toward white
       */
      gradient.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      /*
       * Large soft pink glow
       */
      const pinkGlow = ctx.createRadialGradient(
        width * 0.58 + driftX,
        height * 0.18 + driftY,
        0,
        width * 0.58 + driftX,
        height * 0.18 + driftY,
        width * 0.48
      );

      pinkGlow.addColorStop(
        0,
        "rgba(245, 70, 215, 0.22)"
      );

      pinkGlow.addColorStop(
        0.45,
        "rgba(224, 83, 224, 0.12)"
      );

      pinkGlow.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = pinkGlow;
      ctx.fillRect(0, 0, width, height);

      /*
       * Purple / blue lower-left glow
       */
      const purpleGlow = ctx.createRadialGradient(
        width * 0.18 + driftX,
        height * 0.82 + driftY,
        0,
        width * 0.18 + driftX,
        height * 0.82 + driftY,
        width * 0.52
      );

      purpleGlow.addColorStop(
        0,
        "rgba(76, 65, 215, 0.30)"
      );

      purpleGlow.addColorStop(
        0.40,
        "rgba(107, 73, 220, 0.18)"
      );

      purpleGlow.addColorStop(
        0.75,
        "rgba(170, 100, 230, 0.07)"
      );

      purpleGlow.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = purpleGlow;
      ctx.fillRect(0, 0, width, height);

      /*
       * Soft peach/orange glow on the right
       */
      const orangeGlow = ctx.createRadialGradient(
        width * 0.86 + driftX,
        height * 0.68 + driftY,
        0,
        width * 0.86 + driftX,
        height * 0.68 + driftY,
        width * 0.40
      );

      orangeGlow.addColorStop(
        0,
        "rgba(255, 137, 102, 0.18)"
      );

      orangeGlow.addColorStop(
        0.45,
        "rgba(255, 174, 135, 0.10)"
      );

      orangeGlow.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      /*
       * Very subtle white wash on the right side.
       * This creates the clean white negative space
       * seen in the reference image.
       */
      const whiteFade = ctx.createLinearGradient(
        width * 0.60,
        0,
        width,
        0
      );

      whiteFade.addColorStop(
        0,
        "rgba(255, 255, 255, 0)"
      );

      whiteFade.addColorStop(
        0.65,
        "rgba(255, 255, 255, 0.18)"
      );

      whiteFade.addColorStop(
        1,
        "rgba(255, 255, 255, 0.65)"
      );

      ctx.fillStyle = whiteFade;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    /*
     * Only animate while Global Presence
     * is visible in the viewport.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          if (isVisible && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        });
      },
      {
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
      />
    </div>
  );
}