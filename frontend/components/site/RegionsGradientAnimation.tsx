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

    let animationFrameId: number = 0;
    let width = 0;
    let height = 0;
    let isVisible = false;

    // These three gradients never change over time — only their size does.
    // Recreating a CanvasGradient is real work (color-stop interpolation table
    // build), so instead of doing it 60x/sec we build these once per resize
    // and just reuse the same objects in the render loop.
    let rightOrangeGlow: CanvasGradient | null = null;
    let botRightWhite: CanvasGradient | null = null;
    let botLeftShadow: CanvasGradient | null = null;

    const buildStaticGradients = () => {
      rightOrangeGlow = ctx.createLinearGradient(width * 0.75, 0, width, 0);
      rightOrangeGlow.addColorStop(0, "rgba(249, 115, 22, 0)");
      rightOrangeGlow.addColorStop(0.5, "rgba(249, 115, 22, 0.4)");
      rightOrangeGlow.addColorStop(1.0, "rgba(234, 88, 12, 0.85)");

      botRightWhite = ctx.createRadialGradient(width, height, 0, width, height, width * 0.35);
      botRightWhite.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      botRightWhite.addColorStop(1, "rgba(255, 255, 255, 0)");

      botLeftShadow = ctx.createRadialGradient(0, height, 0, 0, height, width * 0.28);
      botLeftShadow.addColorStop(0, "rgba(79, 70, 229, 0.55)");
      botLeftShadow.addColorStop(1, "rgba(79, 70, 229, 0)");
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      // Cap at DPR 1: this is a decorative background of soft gradients &
      // thin wave lines — rendering at native 2x resolution wastes 75% of
      // fill-rate for zero perceptible quality gain. CSS upscales smoothly.
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

    const startTime = performance.now();
    let frameCount = 0;
    let cachedRibbonGrad: CanvasGradient | null = null;

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      const time = (now - startTime) * 0.0012; // smooth 60fps animation speed
      ctx.clearRect(0, 0, width, height);

      // Organic fluid wave height calculation at normalized x (u from 0 to 1)
      const getWaveY = (u: number, lineOffset: number = 0, lineRatio: number = 0) => {
        // Curve starts at 88% height on left, gently curving up to 32% height on right
        const baseCurve = height * (0.88 - 0.56 * Math.pow(u, 1.15) - 0.10 * Math.sin(u * Math.PI));

        // Multi-frequency liquid wave ripples
        const wave1 = Math.sin(u * 5.2 - time * 2.2 + lineRatio * 2.0) * (8 + lineRatio * 6);
        const wave2 = Math.cos(u * 3.4 + time * 1.6 - lineRatio * 1.5) * 5;

        return baseCurve + wave1 + wave2 + lineOffset;
      };

      // Fill top background area above wave curve with pure white
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, width, height);

      const STEPS = 45;

      // 1. Draw Main Continuous Gradient Wave Ribbon Fill ONLY below wave curve
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, getWaveY(0, 0, 0));
      for (let s = 1; s <= STEPS; s++) {
        const u = s / STEPS;
        ctx.lineTo(u * width, getWaveY(u, 0, 0));
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      // Shimmering horizontal gradient shift over time. This one DOES need to
      // change over time (it's the shimmer), but it doesn't need to be rebuilt
      // on every single frame to look smooth — every 3rd frame is visually
      // indistinguishable and cuts this gradient's rebuild cost by ~66%.
      frameCount++;
      if (!cachedRibbonGrad || frameCount % 3 === 0) {
        const shiftX = Math.sin(time * 0.5) * 20;
        cachedRibbonGrad = ctx.createLinearGradient(shiftX, height * 0.8, width + shiftX, height * 0.2);
        cachedRibbonGrad.addColorStop(0.0, "#2563EB");   // Deep Royal Blue
        cachedRibbonGrad.addColorStop(0.18, "#0284C7");  // Cyan Blue
        cachedRibbonGrad.addColorStop(0.35, "#06B6D4");  // Vibrant Turquoise
        cachedRibbonGrad.addColorStop(0.52, "#10B981");  // Emerald Green
        cachedRibbonGrad.addColorStop(0.68, "#84CC16");  // Lime Green
        cachedRibbonGrad.addColorStop(0.82, "#EAB308");  // Warm Yellow
        cachedRibbonGrad.addColorStop(0.92, "#F97316");  // Vibrant Orange
        cachedRibbonGrad.addColorStop(1.0, "#EA580C");   // Deep Amber
      }

      ctx.fillStyle = cachedRibbonGrad;
      ctx.fill();

      // Clip subsequent orange glow & hatching to the wave ribbon area
      ctx.clip();

      // 2. Orange Glow Block (Clipped inside wave ribbon) — cached, built on resize only
      if (rightOrangeGlow) {
        ctx.fillStyle = rightOrangeGlow;
        ctx.fillRect(width * 0.75, 0, width * 0.25, height);
      }

      // Bottom-right corner white fade — cached, built on resize only
      if (botRightWhite) {
        ctx.fillStyle = botRightWhite;
        ctx.fillRect(width * 0.65, height * 0.65, width * 0.35, height * 0.35);
      }

      // Bottom-left blue/purple shadow accent — cached, built on resize only
      if (botLeftShadow) {
        ctx.fillStyle = botLeftShadow;
        ctx.fillRect(0, height * 0.55, width * 0.35, height * 0.45);
      }

      // 3. Fluid Wave Fanning Lines (Animated vector lines flowing inside the wave)
      const NUM_LINES = 30;
      for (let i = 0; i < NUM_LINES; i++) {
        const lineRatio = i / (NUM_LINES - 1);
        const yOffset = Math.pow(lineRatio, 1.35) * (height * 0.52);

        ctx.beginPath();
        ctx.moveTo(0, getWaveY(0, yOffset, lineRatio));

        for (let s = 1; s <= STEPS; s++) {
          const u = s / STEPS;
          const dynamicSpread = u * lineRatio * (12 + Math.sin(time * 2 + u * 3) * 4);
          ctx.lineTo(u * width, getWaveY(u, yOffset + dynamicSpread, lineRatio));
        }

        ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
        ctx.lineWidth = i < 12 ? 1.25 : 0.85;
        ctx.globalAlpha = Math.max(0.1, 0.78 - lineRatio * 0.65);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;

      // 4. Far-Right White Diagonal Hatching Lines (Clipped inside wave ribbon)
      const hatchStartX = width * 0.94;
      const HATCH_COUNT = 14;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 1.0;

      for (let h = 0; h < HATCH_COUNT; h++) {
        const yPos = (h / HATCH_COUNT) * height * 0.9 + Math.sin(time * 1.5 + h * 0.3) * 2;
        ctx.beginPath();
        ctx.moveTo(hatchStartX, yPos);
        ctx.lineTo(width, yPos - height * 0.15);
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver to only run animation when section is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none opacity-[0.06]"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}