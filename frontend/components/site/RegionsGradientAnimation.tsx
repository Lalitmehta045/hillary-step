"use client";

import React, { useEffect, useRef } from "react";

interface SpeedLine {
  offset: number; // random horizontal offset
  lengthRatio: number;
  width: number;
  baseAlpha: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  isDark: boolean;
}

export function RegionsGradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Angle of diagonal rays: -22 degrees for a sweeping look
    const angleRad = (-22 * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const speedLines: SpeedLine[] = [];
    const NUM_LINES = 150; // High density for the textured look

    const initLines = () => {
      speedLines.length = 0;
      for (let i = 0; i < NUM_LINES; i++) {
        speedLines.push({
          offset: Math.random(),
          lengthRatio: 0.6 + Math.random() * 0.4,
          width: Math.random() < 0.1 ? 3 : Math.random() < 0.4 ? 1.5 : 0.8,
          baseAlpha: 0.1 + Math.random() * 0.25,
          alpha: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.3 + Math.random() * 1.2,
          isDark: Math.random() > 0.8, // 20% dark lines
        });
      }
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      initLines();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const startTime = performance.now();

    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw vibrant horizontal gradient at the bottom
      const baseGrad = ctx.createLinearGradient(0, 0, width, 0);
      baseGrad.addColorStop(0, "#0055FF"); // Deep Blue
      baseGrad.addColorStop(0.25, "#00E5FF"); // Cyan
      baseGrad.addColorStop(0.5, "#15FF00"); // Vibrant Green
      baseGrad.addColorStop(0.75, "#FFF000"); // Bright Yellow
      baseGrad.addColorStop(1, "#FF8800"); // Orange

      ctx.fillStyle = baseGrad;
      // Fill the bottom half
      ctx.fillRect(0, height * 0.3, width, height * 0.7);

      // 2. Draw diagonal speed lines
      const originXMin = -width * 0.4;
      const originXMax = width * 1.4;
      const originY = height + 100; // Start slightly below the canvas
      const diagLength = width * 2.5;

      speedLines.forEach((line) => {
        const pulse = Math.sin(time * line.pulseSpeed + line.pulsePhase);
        line.alpha = Math.max(0.02, line.baseAlpha + pulse * 0.1);

        const startX = originXMin + (originXMax - originXMin) * line.offset;
        const startY = originY;

        const currentLength = diagLength * line.lengthRatio;
        const endX = startX + cosA * currentLength;
        const endY = startY + sinA * currentLength;

        // Animate the line moving slightly
        const moveOffset = (time * line.pulseSpeed * 20) % (width * 0.2);
        const animStartX = startX + moveOffset;
        const animEndX = endX + moveOffset;

        ctx.beginPath();
        ctx.moveTo(animStartX, startY);
        ctx.lineTo(animEndX, endY);

        ctx.strokeStyle = line.isDark
          ? `rgba(0, 0, 0, ${line.alpha * 0.4})`
          : `rgba(255, 255, 255, ${line.alpha * 1.5})`;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });

      // 3. Draw white fade from top down to blend smoothly
      // This makes the colors only appear at the bottom and fade into the white background
      const fadeGrad = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.95);
      fadeGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      fadeGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.75)");
      fadeGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, 0, width, height);

      // Solid white block at the top to ensure no gradient bleeds up
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillRect(0, 0, width, height * 0.2);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
