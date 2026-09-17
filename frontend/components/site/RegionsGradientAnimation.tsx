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
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const ribbons = [
      { color: "#1A6CFF", width: 26, y: 0.78, amplitude: 18, phase: 0.0, speed: 0.0007 },
      { color: "#40F600", width: 18, y: 0.815, amplitude: 14, phase: 1.4, speed: 0.00062 },
      { color: "#FF9500", width: 20, y: 0.85, amplitude: 16, phase: 2.6, speed: 0.00078 },
    ];

    const drawRibbon = (ribbon: (typeof ribbons)[number], t: number, offset: number) => {
      const points = Math.max(90, Math.floor(width / 8));
      ctx.beginPath();

      for (let i = 0; i <= points; i++) {
        const p = i / points;
        const x = width * (p - 0.08);
        const baseY = height * ribbon.y;
        const wave =
          Math.sin(p * 7.2 + t * ribbon.speed * 1000 + ribbon.phase) * ribbon.amplitude +
          Math.sin(p * 13.5 - t * ribbon.speed * 720 + ribbon.phase * 0.7) * 5;
        const y = baseY + wave + offset * (p - 0.5);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineWidth = ribbon.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = ribbon.color;
      ctx.globalAlpha = 0.22;
      ctx.stroke();

      ctx.lineWidth = Math.max(2, ribbon.width * 0.16);
      ctx.globalAlpha = 0.12;
      ctx.stroke();
    };

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const t = now * 0.001;

      ctx.save();
      ctx.filter = `blur(${Math.max(10, Math.min(width, height) * 0.018)}px)`;
      ctx.beginPath();
      ctx.rect(width * 0.42, height * 0.58, width * 0.66, height * 0.5);
      ctx.clip();

      ribbons.forEach((ribbon, index) => drawRibbon(ribbon, t, index * 4));

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) animationFrameId = requestAnimationFrame(render);
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute bottom-0 right-0 z-0 h-[42%] w-[58%] overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
