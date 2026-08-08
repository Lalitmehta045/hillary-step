"use client";

import React, { useEffect, useRef } from "react";

interface Hub {
  name: string;
  xPercent: number; // 0 to 1
  yPercent: number; // 0 to 1
}

const HUBS: Record<string, Hub> = {
  "United States": { name: "United States", xPercent: 0.3, yPercent: 0.47 },
  India: { name: "India", xPercent: 0.65, yPercent: 0.54 },
  Australia: { name: "Australia", xPercent: 0.77, yPercent: 0.74 },
};

// Continent dot clusters to render a minimalist, high-tech world dot-matrix
const CONTINENT_CLUSTERS = [
  // North America
  { cx: 0.26, cy: 0.4, rx: 0.12, ry: 0.14, count: 55 },
  // South America
  { cx: 0.35, cy: 0.7, rx: 0.08, ry: 0.16, count: 40 },
  // Europe
  { cx: 0.52, cy: 0.36, rx: 0.07, ry: 0.09, count: 35 },
  // Africa
  { cx: 0.53, cy: 0.58, rx: 0.09, ry: 0.16, count: 50 },
  // Asia
  { cx: 0.68, cy: 0.42, rx: 0.16, ry: 0.15, count: 85 },
  // Australia / Oceania
  { cx: 0.79, cy: 0.73, rx: 0.08, ry: 0.09, count: 35 },
];

export function WorldMapCanvas({ activeRegion }: { activeRegion: string }) {
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

    // Generate static world map dot points once per resize
    interface WorldDot {
      x: number;
      y: number;
      size: number;
      alpha: number;
    }
    const worldDots: WorldDot[] = [];

    const initDots = () => {
      worldDots.length = 0;
      CONTINENT_CLUSTERS.forEach((cluster) => {
        for (let i = 0; i < cluster.count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random());
          const x = (cluster.cx + Math.cos(angle) * cluster.rx * r) * width;
          const y = (cluster.cy + Math.sin(angle) * cluster.ry * r) * height;
          worldDots.push({
            x,
            y,
            size: 1.2 + Math.random() * 1.3,
            alpha: 0.12 + Math.random() * 0.18,
          });
        }
      });

      // Background subtle grid coordinate intersections
      const gridSpacing = 42;
      for (let x = 20; x < width - 20; x += gridSpacing) {
        for (let y = 20; y < height - 20; y += gridSpacing) {
          if (Math.random() < 0.18) {
            worldDots.push({
              x,
              y,
              size: 0.9,
              alpha: 0.06,
            });
          }
        }
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
      initDots();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Arcs between hubs: US <-> India, India <-> Australia, US <-> Australia
    const connections = [
      { from: "United States", to: "India", progress: 0.2 },
      { from: "India", to: "Australia", progress: 0.6 },
      { from: "Australia", to: "United States", progress: 0.8 },
    ];

    const startTime = performance.now();

    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient background grid lines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.035)";
      ctx.lineWidth = 1;
      const gridGap = 44;
      for (let x = 0; x < width; x += gridGap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw World Matrix Dots
      worldDots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(18, 32, 58, ${dot.alpha})`;
        ctx.fill();
      });

      // 3. Draw Curved Geodesic Connection Flight Arcs Between Hubs
      connections.forEach((conn, idx) => {
        const h1 = HUBS[conn.from];
        const h2 = HUBS[conn.to];
        if (!h1 || !h2) return;

        const p1 = { x: h1.xPercent * width, y: h1.yPercent * height };
        const p2 = { x: h2.xPercent * width, y: h2.yPercent * height };

        // Control point for smooth curved arc
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - 55 - (idx === 2 ? 30 : 0);

        // Draw dashed arc line
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
        ctx.strokeStyle = "rgba(255, 149, 0, 0.28)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated traveling light packet
        conn.progress = (conn.progress + 0.0035) % 1;
        const t = conn.progress;
        // Quadratic bezier formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const curX = Math.pow(1 - t, 2) * p1.x + 2 * (1 - t) * t * midX + Math.pow(t, 2) * p2.x;
        const curY = Math.pow(1 - t, 2) * p1.y + 2 * (1 - t) * t * midY + Math.pow(t, 2) * p2.y;

        // Glowing photon head
        const packetGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, 8);
        packetGrad.addColorStop(0, "rgba(255, 149, 0, 0.9)");
        packetGrad.addColorStop(0.5, "rgba(255, 149, 0, 0.4)");
        packetGrad.addColorStop(1, "rgba(255, 149, 0, 0)");

        ctx.beginPath();
        ctx.arc(curX, curY, 8, 0, Math.PI * 2);
        ctx.fillStyle = packetGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      // 4. Draw Animated Sonar / Radar Pulse Rings from the Active Hub
      const activeHub = HUBS[activeRegion];
      if (activeHub) {
        const ax = activeHub.xPercent * width;
        const ay = activeHub.yPercent * height;

        // Expanding concentric sonar waves
        for (let ring = 0; ring < 3; ring++) {
          const ringProgress = (time * 0.8 + ring * 0.33) % 1;
          const radius = 10 + ringProgress * 42;
          const alpha = (1 - ringProgress) * 0.45;

          ctx.beginPath();
          ctx.arc(ax, ay, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 149, 0, ${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // Soft radial glow under active hub
        const glow = ctx.createRadialGradient(ax, ay, 0, ax, ay, 36);
        glow.addColorStop(0, "rgba(255, 149, 0, 0.35)");
        glow.addColorStop(0.6, "rgba(255, 149, 0, 0.12)");
        glow.addColorStop(1, "rgba(255, 149, 0, 0)");
        ctx.beginPath();
        ctx.arc(ax, ay, 36, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeRegion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none rounded-[26px]"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
