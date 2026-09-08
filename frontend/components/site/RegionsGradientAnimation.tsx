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

    /*
     * ------------------------------------------------------------
     * STATIC GRADIENTS
     * ------------------------------------------------------------
     */

    let rightOrangeGlow: CanvasGradient | null = null;
    let botRightWhite: CanvasGradient | null = null;
    let botLeftShadow: CanvasGradient | null = null;

    const buildStaticGradients = () => {
      /*
       * Soft orange glow toward the far right.
       */
      rightOrangeGlow = ctx.createLinearGradient(
        width * 0.70,
        0,
        width,
        0
      );

      rightOrangeGlow.addColorStop(
        0,
        "rgba(249, 115, 22, 0)"
      );

      rightOrangeGlow.addColorStop(
        0.55,
        "rgba(249, 115, 22, 0.20)"
      );

      rightOrangeGlow.addColorStop(
        1,
        "rgba(234, 88, 12, 0.48)"
      );

      /*
       * White fade toward bottom-right.
       */
      botRightWhite = ctx.createRadialGradient(
        width,
        height,
        0,
        width,
        height,
        width * 0.42
      );

      botRightWhite.addColorStop(
        0,
        "rgba(255, 255, 255, 0.88)"
      );

      botRightWhite.addColorStop(
        0.55,
        "rgba(255, 255, 255, 0.35)"
      );

      botRightWhite.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      /*
       * Deep blue / purple shadow toward bottom-left.
       *
       * Purple is introduced very subtly while keeping
       * your original blue-green-orange palette.
       */
      botLeftShadow = ctx.createRadialGradient(
        0,
        height,
        0,
        0,
        height,
        width * 0.38
      );

      botLeftShadow.addColorStop(
        0,
        "rgba(79, 70, 229, 0.32)"
      );

      botLeftShadow.addColorStop(
        0.45,
        "rgba(37, 99, 235, 0.16)"
      );

      botLeftShadow.addColorStop(
        1,
        "rgba(79, 70, 229, 0)"
      );
    };

    /*
     * ------------------------------------------------------------
     * RESIZE
     * ------------------------------------------------------------
     */

    const handleResize = () => {
      if (!container || !canvas) return;

      const dpr = 1;

      width = container.clientWidth;
      height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      buildStaticGradients();
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    /*
     * ------------------------------------------------------------
     * ANIMATION
     * ------------------------------------------------------------
     */

    const startTime = performance.now();

    let frameCount = 0;

    let cachedRibbonGrad: CanvasGradient | null = null;
    let cachedSoftRibbonGrad: CanvasGradient | null = null;

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      /*
       * Same animation speed as your original version.
       */
      const time = (now - startTime) * 0.0012;

      ctx.clearRect(0, 0, width, height);

      /*
       * ----------------------------------------------------------
       * ORIGINAL ORGANIC WAVE
       * ----------------------------------------------------------
       *
       * Kept intentionally.
       */

      const getWaveY = (
        u: number,
        lineOffset: number = 0,
        lineRatio: number = 0
      ) => {
        /*
         * Main ascending curve.
         */
        const baseCurve =
          height *
          (
            0.88 -
            0.56 * Math.pow(u, 1.15) -
            0.10 * Math.sin(u * Math.PI)
          );

        /*
         * Main liquid movement.
         */
        const wave1 =
          Math.sin(
            u * 5.2 -
            time * 2.2 +
            lineRatio * 2.0
          ) *
          (8 + lineRatio * 6);

        /*
         * Secondary organic movement.
         */
        const wave2 =
          Math.cos(
            u * 3.4 +
            time * 1.6 -
            lineRatio * 1.5
          ) * 5;

        return (
          baseCurve +
          wave1 +
          wave2 +
          lineOffset
        );
      };

      /*
       * ----------------------------------------------------------
       * WHITE BASE
       * ----------------------------------------------------------
       */

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, width, height);

      const STEPS = 45;

      /*
       * ----------------------------------------------------------
       * MAIN RIBBON
       * ----------------------------------------------------------
       */

      ctx.save();

      ctx.beginPath();

      ctx.moveTo(
        0,
        getWaveY(0, 0, 0)
      );

      for (let s = 1; s <= STEPS; s++) {
        const u = s / STEPS;

        ctx.lineTo(
          u * width,
          getWaveY(u, 0, 0)
        );
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);

      ctx.closePath();

      /*
       * ----------------------------------------------------------
       * MAIN COLOR GRADIENT
       * ----------------------------------------------------------
       *
       * SAME ORIGINAL COLOR FAMILY:
       *
       * Blue
       * Cyan
       * Turquoise
       * Emerald
       * Lime
       * Yellow
       * Orange
       *
       * But with much smoother transitions.
       */

      frameCount++;

      if (
        !cachedRibbonGrad ||
        frameCount % 3 === 0
      ) {
        /*
         * Keep the shimmer movement from the original.
         */
        const shiftX =
          Math.sin(time * 0.5) * 20;

        cachedRibbonGrad =
          ctx.createLinearGradient(
            shiftX,
            height * 0.82,
            width + shiftX,
            height * 0.18
          );

        /*
         * Deep Royal Blue
         */
        cachedRibbonGrad.addColorStop(
          0.00,
          "#2563EB"
        );

        /*
         * Cyan Blue
         */
        cachedRibbonGrad.addColorStop(
          0.15,
          "#0284C7"
        );

        /*
         * Vibrant Turquoise
         */
        cachedRibbonGrad.addColorStop(
          0.30,
          "#06B6D4"
        );

        /*
         * Emerald
         */
        cachedRibbonGrad.addColorStop(
          0.47,
          "#10B981"
        );

        /*
         * Lime
         */
        cachedRibbonGrad.addColorStop(
          0.62,
          "#84CC16"
        );

        /*
         * Warm Yellow
         */
        cachedRibbonGrad.addColorStop(
          0.78,
          "#EAB308"
        );

        /*
         * Orange
         */
        cachedRibbonGrad.addColorStop(
          0.90,
          "#F97316"
        );

        /*
         * Deep Orange
         */
        cachedRibbonGrad.addColorStop(
          1.00,
          "#EA580C"
        );
      }

      /*
       * ----------------------------------------------------------
       * SOFT UNDER-GLOW
       * ----------------------------------------------------------
       *
       * Creates the soft blurred feeling from your reference
       * without changing the actual wave animation.
       */

      if (
        !cachedSoftRibbonGrad ||
        frameCount % 3 === 0
      ) {
        const glowShift =
          Math.sin(time * 0.5) * 20;

        cachedSoftRibbonGrad =
          ctx.createLinearGradient(
            glowShift,
            height * 0.90,
            width + glowShift,
            height * 0.10
          );

        cachedSoftRibbonGrad.addColorStop(
          0,
          "rgba(37, 99, 235, 0.28)"
        );

        cachedSoftRibbonGrad.addColorStop(
          0.25,
          "rgba(6, 182, 212, 0.22)"
        );

        cachedSoftRibbonGrad.addColorStop(
          0.50,
          "rgba(16, 185, 129, 0.22)"
        );

        cachedSoftRibbonGrad.addColorStop(
          0.72,
          "rgba(234, 179, 8, 0.20)"
        );

        cachedSoftRibbonGrad.addColorStop(
          1,
          "rgba(249, 115, 22, 0.24)"
        );
      }

      /*
       * Soft glow first.
       */
      ctx.globalAlpha = 0.55;

      ctx.fillStyle =
        cachedSoftRibbonGrad;

      ctx.fill();

      /*
       * Main ribbon.
       */
      ctx.globalAlpha = 1;

      ctx.fillStyle =
        cachedRibbonGrad;

      ctx.fill();

      /*
       * ----------------------------------------------------------
       * CLIP
       * ----------------------------------------------------------
       */

      ctx.clip();

      /*
       * ----------------------------------------------------------
       * ORANGE RIGHT GLOW
       * ----------------------------------------------------------
       */

      if (rightOrangeGlow) {
        ctx.fillStyle =
          rightOrangeGlow;

        ctx.fillRect(
          width * 0.70,
          0,
          width * 0.30,
          height
        );
      }

      /*
       * ----------------------------------------------------------
       * BOTTOM RIGHT WHITE FADE
       * ----------------------------------------------------------
       */

      if (botRightWhite) {
        ctx.fillStyle =
          botRightWhite;

        ctx.fillRect(
          width * 0.58,
          height * 0.58,
          width * 0.42,
          height * 0.42
        );
      }

      /*
       * ----------------------------------------------------------
       * BOTTOM LEFT BLUE / PURPLE DEPTH
       * ----------------------------------------------------------
       */

      if (botLeftShadow) {
        ctx.fillStyle =
          botLeftShadow;

        ctx.fillRect(
          0,
          height * 0.52,
          width * 0.40,
          height * 0.48
        );
      }

      /*
       * ----------------------------------------------------------
       * FLUID FANNING LINES
       * ----------------------------------------------------------
       *
       * SAME animation concept as your original.
       */

      const NUM_LINES = 30;

      for (let i = 0; i < NUM_LINES; i++) {
        const lineRatio =
          i / (NUM_LINES - 1);

        const yOffset =
          Math.pow(
            lineRatio,
            1.35
          ) *
          (height * 0.52);

        ctx.beginPath();

        ctx.moveTo(
          0,
          getWaveY(
            0,
            yOffset,
            lineRatio
          )
        );

        for (
          let s = 1;
          s <= STEPS;
          s++
        ) {
          const u = s / STEPS;

          const dynamicSpread =
            u *
            lineRatio *
            (
              12 +
              Math.sin(
                time * 2 +
                u * 3
              ) *
              4
            );

          ctx.lineTo(
            u * width,
            getWaveY(
              u,
              yOffset +
                dynamicSpread,
              lineRatio
            )
          );
        }

        /*
         * Softer white lines.
         */
        ctx.strokeStyle =
          "rgba(255, 255, 255, 0.52)";

        ctx.lineWidth =
          i < 12
            ? 1.15
            : 0.75;

        ctx.globalAlpha =
          Math.max(
            0.08,
            0.58 -
              lineRatio * 0.48
          );

        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      /*
       * ----------------------------------------------------------
       * FAR RIGHT HATCHING
       * ----------------------------------------------------------
       */

      const hatchStartX =
        width * 0.94;

      const HATCH_COUNT = 14;

      ctx.strokeStyle =
        "rgba(255, 255, 255, 0.45)";

      ctx.lineWidth = 0.8;

      for (
        let h = 0;
        h < HATCH_COUNT;
        h++
      ) {
        const yPos =
          (h / HATCH_COUNT) *
            height *
            0.9 +
          Math.sin(
            time * 1.5 +
            h * 0.3
          ) *
            2;

        ctx.beginPath();

        ctx.moveTo(
          hatchStartX,
          yPos
        );

        ctx.lineTo(
          width,
          yPos -
            height * 0.15
        );

        ctx.stroke();
      }

      ctx.restore();

      /*
       * ----------------------------------------------------------
       * NEXT FRAME
       * ----------------------------------------------------------
       */

      animationFrameId =
        requestAnimationFrame(
          render
        );
    };

    /*
     * ------------------------------------------------------------
     * INTERSECTION OBSERVER
     * ------------------------------------------------------------
     */

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              isVisible =
                entry.isIntersecting;

              if (
                isVisible &&
                !animationFrameId
              ) {
                animationFrameId =
                  requestAnimationFrame(
                    render
                  );
              }
            }
          );
        },
        {
          threshold: 0,
        }
      );

    observer.observe(container);

    /*
     * ------------------------------------------------------------
     * CLEANUP
     * ------------------------------------------------------------
     */

    return () => {
      observer.disconnect();

      if (animationFrameId) {
        cancelAnimationFrame(
          animationFrameId
        );
      }

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none opacity-[0.28]"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
      />
    </div>
  );
}