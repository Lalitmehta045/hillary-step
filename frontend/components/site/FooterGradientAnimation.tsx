"use client";

import React, { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hasGlow: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  colorProgress: number;
}

interface StreamParticle {
  progress: number;
  speed: number;
  waveIndex: number;
  offsetY: number;
  size: number;
  alpha: number;
}

export function FooterGradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

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

    // Color gradient stops precisely matched to the brand palette:
    const colorStops = [
      { stop: 0.0, r: 20, g: 99, b: 255 },
      { stop: 0.2, r: 0, g: 165, b: 235 },
      { stop: 0.4, r: 10, g: 205, b: 145 },
      { stop: 0.58, r: 64, g: 246, b: 0 },
      { stop: 0.76, r: 228, g: 212, b: 0 },
      { stop: 0.9, r: 255, g: 165, b: 0 },
      { stop: 1.0, r: 255, g: 106, b: 0 },
    ];

    const getColorAtProgress = (t: number, alpha: number = 1): string => {
      const clamped = Math.max(0, Math.min(1, t));
      let c1 = colorStops[0];
      let c2 = colorStops[colorStops.length - 1];

      for (let i = 0; i < colorStops.length - 1; i++) {
        if (clamped >= colorStops[i].stop && clamped <= colorStops[i + 1].stop) {
          c1 = colorStops[i];
          c2 = colorStops[i + 1];
          break;
        }
      }

      const range = c2.stop - c1.stop;
      const factor = range === 0 ? 0 : (clamped - c1.stop) / range;
      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);

      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getWaveBaselineY = (xRatio: number, time: number): number => {
      const trajectory =
        0.84 - 0.46 * Math.pow(xRatio, 1.25) + Math.sin(xRatio * Math.PI * 1.5) * 0.05;

      const dynamicWave =
        Math.sin(xRatio * 4.5 + time * 0.7) * 14 + Math.cos(xRatio * 2.8 - time * 0.5) * 10;

      return height * trajectory + dynamicWave;
    };

    const waveRibbons = [
      { freq: 3.6, speed: 0.7, amp: 22, phase: 0.0, yOffset: 0, width: 1.5, alpha: 0.4 },
      { freq: 4.8, speed: -0.6, amp: 18, phase: 1.4, yOffset: -16, width: 1.0, alpha: 0.3 },
      { freq: 3.2, speed: 0.85, amp: 26, phase: 2.7, yOffset: 12, width: 1.2, alpha: 0.35 },
      { freq: 5.4, speed: -0.75, amp: 15, phase: 3.9, yOffset: -28, width: 0.8, alpha: 0.25 },
      { freq: 4.2, speed: 0.55, amp: 20, phase: 4.8, yOffset: 20, width: 1.0, alpha: 0.25 },
      { freq: 6.0, speed: 1.0, amp: 12, phase: 0.8, yOffset: -8, width: 0.7, alpha: 0.2 },
      { freq: 2.8, speed: -0.45, amp: 28, phase: 1.8, yOffset: -40, width: 1.1, alpha: 0.2 },
      { freq: 4.5, speed: 0.9, amp: 16, phase: 5.5, yOffset: 32, width: 0.9, alpha: 0.2 },
    ];

    const nodes: NodePoint[] = [];

    const initNodes = () => {
      nodes.length = 0;
      const count = Math.min(85, Math.max(50, Math.floor(width / 18)));

      for (let i = 0; i < count; i++) {
        const xProgress = i / (count - 1);
        const x = (xProgress + (Math.random() - 0.5) * 0.06) * width;
        const clampedX = Math.max(15, Math.min(width - 15, x));
        const xRatio = clampedX / width;

        const baseY = getWaveBaselineY(xRatio, 0);
        const ySpread = (Math.random() - 0.5) * (height * 0.4);
        const y = Math.min(height - 8, Math.max(height * 0.2, baseY + ySpread));

        const isFeatured = i % 4 === 0 || Math.random() < 0.25;
        const radius = isFeatured ? 3.2 + Math.random() * 3.0 : 1.6 + Math.random() * 1.8;

        nodes.push({
          x: clampedX,
          y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.28,
          radius,
          hasGlow: isFeatured,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 1.0 + Math.random() * 1.5,
          colorProgress: xRatio,
        });
      }
    };

    const particles: StreamParticle[] = [];
    const TOTAL_PARTICLES = 320;
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      particles.push({
        progress: Math.random(),
        speed: 0.00025 + Math.random() * 0.00065,
        waveIndex: Math.floor(Math.random() * waveRibbons.length),
        offsetY: (Math.random() - 0.5) * 22,
        size: 0.9 + Math.random() * 1.8,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }

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
      initNodes();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const startTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      const time = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
      for (const stop of colorStops) {
        lineGrad.addColorStop(stop.stop, `rgb(${stop.r}, ${stop.g}, ${stop.b})`);
      }

      waveRibbons.forEach((wave, wIdx) => {
        const step = 6;
        const totalSteps = Math.ceil(width / step) + 1;

        ctx.beginPath();
        for (let i = 0; i <= totalSteps; i++) {
          const x = i * step;
          const xRatio = x / width;
          const baseY = getWaveBaselineY(xRatio, time * 0.25);
          const oscillation =
            Math.sin(xRatio * wave.freq * Math.PI + time * wave.speed + wave.phase) * wave.amp +
            Math.cos(xRatio * 3.0 - time * 0.35 + wIdx) * 8;
          const y = baseY + wave.yOffset + oscillation;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = wave.width;
        ctx.globalAlpha = wave.alpha;
        ctx.stroke();

        const dotGap = 16;
        for (let x = 0; x <= width; x += dotGap) {
          const xRatio = x / width;
          const baseY = getWaveBaselineY(xRatio, time * 0.25);
          const oscillation =
            Math.sin(xRatio * wave.freq * Math.PI + time * wave.speed + wave.phase) * wave.amp +
            Math.cos(xRatio * 3.0 - time * 0.35 + wIdx) * 8;
          const y = baseY + wave.yOffset + oscillation;

          const dotColor = getColorAtProgress(xRatio, 0.45);
          ctx.beginPath();
          ctx.arc(x, y, 1.0, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;

      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress -= 1;

        const x = p.progress * width;
        const xRatio = p.progress;
        const wave = waveRibbons[p.waveIndex];
        const baseY = getWaveBaselineY(xRatio, time * 0.25);
        const oscillation =
          Math.sin(xRatio * wave.freq * Math.PI + time * wave.speed + wave.phase) * wave.amp +
          Math.cos(xRatio * 3.0 - time * 0.35 + p.waveIndex) * 8;
        const y = baseY + wave.yOffset + oscillation + p.offsetY;

        const color = getColorAtProgress(xRatio, p.alpha);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      const mouse = mouseRef.current;
      const MAX_LINK_DIST = Math.min(125, width * 0.11);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        const xRatio = node.x / width;
        node.colorProgress = xRatio;
        const targetBaseY = getWaveBaselineY(xRatio, time * 0.25);
        const diffY = targetBaseY - node.y;
        node.y += diffY * 0.006;

        if (node.x < 12) {
          node.x = 12;
          node.vx = Math.abs(node.vx);
        } else if (node.x > width - 12) {
          node.x = width - 12;
          node.vx = -Math.abs(node.vx);
        }

        if (node.y < height * 0.16) {
          node.y = height * 0.16;
          node.vy = Math.abs(node.vy);
        } else if (node.y > height - 10) {
          node.y = height - 10;
          node.vy = -Math.abs(node.vy);
        }

        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const push = (130 - dist) / 130;
            node.x += (dx / dist) * push * 1.6;
            node.y += (dy / dist) * push * 1.6;
          }
        }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_LINK_DIST) {
            const alphaFactor = Math.pow(1 - dist / MAX_LINK_DIST, 1.2) * 0.5;
            const midXRatio = (n1.x + n2.x) / (2 * width);
            const strokeColor = getColorAtProgress(midXRatio, alphaFactor);

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = Math.max(0.5, 1.1 * (1 - dist / MAX_LINK_DIST));
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const xRatio = node.colorProgress;
        const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase);
        const currentRadius = Math.max(1.2, node.radius + (node.hasGlow ? pulse * 0.7 : 0));

        if (node.hasGlow) {
          const auraRadius = currentRadius * 4.2 + pulse * 2.0;
          const radial = ctx.createRadialGradient(
            node.x,
            node.y,
            currentRadius * 0.5,
            node.x,
            node.y,
            auraRadius,
          );
          radial.addColorStop(0, getColorAtProgress(xRatio, 0.45 + pulse * 0.15));
          radial.addColorStop(0.5, getColorAtProgress(xRatio, 0.18 + pulse * 0.08));
          radial.addColorStop(1, getColorAtProgress(xRatio, 0));

          ctx.beginPath();
          ctx.arc(node.x, node.y, auraRadius, 0, Math.PI * 2);
          ctx.fillStyle = radial;
          ctx.fill();

          const ringColor = getColorAtProgress(xRatio, 0.35 + pulse * 0.15);
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        const coreColor = getColorAtProgress(xRatio, 0.95);
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.fill();

        if (node.hasGlow) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(0.8, currentRadius * 0.38), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

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
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] w-full overflow-hidden select-none sm:h-[360px] md:h-[420px]"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
