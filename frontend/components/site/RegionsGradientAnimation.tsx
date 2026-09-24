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
    let isTabHidden = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      // Lowered DPR cap from 2 → 1.5 for better performance
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Use ResizeObserver instead of global window resize for better perf
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    // Page Visibility API — pause animation on hidden tab
    const handleVisibilityChange = () => {
      isTabHidden = document.hidden;
      if (!isTabHidden && isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

    // Redesigned for a softer, premium ambient flow
    const ribbons = [
      { color: "#1A6CFF", width: 70, y: 0.65, amplitude: 35, phase: 0.0, speed: 0.0004 },
      { color: "#40F600", width: 50, y: 0.78, amplitude: 25, phase: 1.4, speed: 0.00035 },
      { color: "#FF9500", width: 55, y: 0.88, amplitude: 30, phase: 2.6, speed: 0.00045 },
    ];

    const drawRibbon = (ribbon: (typeof ribbons)[number], t: number, offset: number) => {
      const points = Math.max(80, Math.floor(width / 14));
      ctx.beginPath();

      for (let i = 0; i <= points; i++) {
        const x_norm = i / points;
        // Extend rendering slightly off-screen to prevent edge clipping artifacts
        const x = width * (x_norm * 1.2 - 0.1);

        // Smoothly scaling phase for natural wave curves across any screen size
        const p = x_norm * 2.0;

        const baseY = height * ribbon.y;
        const wave =
          Math.sin(p * 3.5 + t * ribbon.speed * 1000 + ribbon.phase) * ribbon.amplitude +
          Math.sin(p * 5.2 - t * ribbon.speed * 720 + ribbon.phase * 0.7) * (ribbon.amplitude * 0.35);

        const y = baseY + wave + offset * Math.sin(p * 2);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineWidth = ribbon.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = ribbon.color;
      ctx.globalAlpha = 0.3;
      ctx.stroke();

      // Core highlight for richer depth
      ctx.lineWidth = Math.max(15, ribbon.width * 0.4);
      ctx.globalAlpha = 0.18;
      ctx.stroke();
    };

    const render = (now: number) => {
      if (!isVisible || isTabHidden) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const t = now * 0.001;

      ctx.save();
      // NOTE: ctx.filter blur removed — CSS filter: blur() on the wrapper div
      // achieves the same visual result but is GPU-composited (not CPU software blur)

      // Removed previous harsh geometric clip paths to allow smooth ambient blending
      ribbons.forEach((ribbon, index) => drawRibbon(ribbon, t, index * 8));

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !isTabHidden && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // Expand to cover the full width and a larger vertical area for a continuous gradient
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[65%] w-full overflow-hidden select-none opacity-90"
      style={{
        // CSS filter: blur() on this div is GPU-composited — replaces ctx.filter which was CPU software blur
        filter: "blur(38px)",
        // Premium CSS mask to naturally fade the gradient into the background instead of cutting it
        maskImage: "linear-gradient(to top, black 25%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 25%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}