"use client";

import React, { useEffect, useRef } from "react";

export function RegionsGradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) return;

    let animationFrame = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    /*
     * Existing Hillary Step color system
     *
     * Blue → Cyan → Turquoise → Green → Lime
     * → Yellow → Orange
     */
    const COLORS = [
      "#2563EB",
      "#0284C7",
      "#06B6D4",
      "#10B981",
      "#84CC16",
      "#EAB308",
      "#F97316",
      "#EA580C",
    ];

    /*
     * Mesh blobs.
     *
     * Their positions intentionally follow the same
     * left-bottom → right-top flow as the previous ribbon.
     */
    const blobs = [
      {
        x: 0.02,
        y: 0.80,
        radius: 0.32,
        color: COLORS[0],
        strength: 1.0,
        speed: 0.42,
        phase: 0.0,
      },
      {
        x: 0.12,
        y: 0.72,
        radius: 0.30,
        color: COLORS[1],
        strength: 0.95,
        speed: 0.38,
        phase: 1.2,
      },
      {
        x: 0.25,
        y: 0.64,
        radius: 0.28,
        color: COLORS[2],
        strength: 0.95,
        speed: 0.35,
        phase: 2.0,
      },
      {
        x: 0.39,
        y: 0.56,
        radius: 0.27,
        color: COLORS[3],
        strength: 0.95,
        speed: 0.32,
        phase: 0.7,
      },
      {
        x: 0.53,
        y: 0.47,
        radius: 0.27,
        color: COLORS[4],
        strength: 0.90,
        speed: 0.30,
        phase: 2.8,
      },
      {
        x: 0.67,
        y: 0.38,
        radius: 0.26,
        color: COLORS[5],
        strength: 0.85,
        speed: 0.28,
        phase: 1.6,
      },
      {
        x: 0.81,
        y: 0.29,
        radius: 0.25,
        color: COLORS[6],
        strength: 0.82,
        speed: 0.26,
        phase: 3.1,
      },
      {
        x: 0.94,
        y: 0.20,
        radius: 0.22,
        color: COLORS[7],
        strength: 0.78,
        speed: 0.24,
        phase: 2.2,
      },
    ];

    /*
     * Convert hex → RGB.
     */
    function hexToRgb(hex: string) {
      const value = hex.replace("#", "");

      return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
      };
    }

    /*
     * Organic wave from the original animation.
     *
     * This is deliberately retained so the mesh occupies
     * the same diagonal region as the existing animation.
     */
    function getWaveY(
      x: number,
      time: number,
      offset = 0,
    ) {
      const diagonal = height * 0.82 - x * 0.55;

      const waveA =
        Math.sin(x * 0.004 + time * 0.00045 + offset) *
        height *
        0.035;

      const waveB =
        Math.sin(x * 0.009 - time * 0.0003 + offset * 2) *
        height *
        0.018;

      const waveC =
        Math.sin(x * 0.0018 + time * 0.0007) *
        height *
        0.028;

      return diagonal + waveA + waveB + waveC;
    }

    /*
     * Resize canvas.
     */
    function resize() {
      const rect = container.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    /*
     * Create a soft radial mesh blob.
     *
     * The gradient fades naturally into transparency,
     * allowing neighboring colors to blend together.
     */
    function drawBlob(
      x: number,
      y: number,
      radius: number,
      color: string,
      alpha: number,
      scaleX = 1,
      scaleY = 1,
    ) {
      const rgb = hexToRgb(color);

      ctx.save();

      ctx.translate(x, y);
      ctx.scale(scaleX, scaleY);

      const gradient = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        radius,
      );

      gradient.addColorStop(
        0,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`,
      );

      gradient.addColorStop(
        0.22,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.92})`,
      );

      gradient.addColorStop(
        0.48,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.55})`,
      );

      gradient.addColorStop(
        0.72,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.20})`,
      );

      gradient.addColorStop(
        1,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`,
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    /*
     * Main mesh.
     */
    function drawMesh(time: number) {
      ctx.save();

      /*
       * Clip the mesh into the same broad organic diagonal
       * area occupied by the previous ribbon.
       */
      const clipPath = new Path2D();

      const startY = height * 0.98;

      clipPath.moveTo(-width * 0.10, startY);

      /*
       * Upper edge.
       */
      for (let i = 0; i <= 45; i++) {
        const x = -width * 0.08 + (width * 1.18 * i) / 45;

        const y =
          getWaveY(x, time, 0) -
          height * 0.12 -
          Math.sin(i * 0.4 + time * 0.0004) * height * 0.015;

        clipPath.lineTo(x, y);
      }

      /*
       * Right side.
       */
      clipPath.lineTo(width * 1.15, height * 0.52);

      /*
       * Lower edge.
       */
      for (let i = 45; i >= 0; i--) {
        const x = -width * 0.08 + (width * 1.18 * i) / 45;

        const y =
          getWaveY(x, time, 0) +
          height * 0.12 +
          Math.sin(i * 0.36 - time * 0.00035) * height * 0.02;

        clipPath.lineTo(x, y);
      }

      clipPath.closePath();

      ctx.clip(clipPath);

      /*
       * Base mesh.
       *
       * The blobs move very subtly so the animation feels
       * alive without becoming distracting.
       */
      blobs.forEach((blob, index) => {
        const driftX =
          Math.sin(
            time * 0.00045 * blob.speed +
              blob.phase,
          ) *
          width *
          0.018;

        const driftY =
          Math.cos(
            time * 0.00038 * blob.speed +
              blob.phase * 1.4,
          ) *
          height *
          0.018;

        /*
         * Follow the same diagonal wave.
         */
        const x =
          blob.x * width +
          driftX;

        const waveY =
          getWaveY(
            x,
            time,
            index * 0.15,
          );

        const y =
          blob.y * height +
          driftY +
          (waveY -
            height * 0.82 +
            x * 0.55) *
            0.22;

        drawBlob(
          x,
          y,
          Math.max(
            width,
            height,
          ) *
            blob.radius,
          blob.color,
          0.58 * blob.strength,
          1.35,
          0.78,
        );
      });

      /*
       * Additional large translucent fields.
       *
       * These remove the "individual blobs" feeling and make
       * the result look more like a true gradient mesh.
       */
      drawBlob(
        width * 0.18,
        height * 0.70,
        Math.max(width, height) * 0.42,
        "#0284C7",
        0.22,
        1.7,
        0.62,
      );

      drawBlob(
        width * 0.42,
        height * 0.54,
        Math.max(width, height) * 0.38,
        "#10B981",
        0.20,
        1.65,
        0.58,
      );

      drawBlob(
        width * 0.67,
        height * 0.38,
        Math.max(width, height) * 0.34,
        "#EAB308",
        0.18,
        1.55,
        0.58,
      );

      drawBlob(
        width * 0.86,
        height * 0.25,
        Math.max(width, height) * 0.30,
        "#F97316",
        0.18,
        1.5,
        0.58,
      );

      /*
       * Soft white blend over the center.
       *
       * This creates the premium "mesh on white paper"
       * appearance instead of a solid ribbon.
       */
      const whiteBlend = ctx.createLinearGradient(
        0,
        height * 0.25,
        width,
        height * 0.75,
      );

      whiteBlend.addColorStop(
        0,
        "rgba(255,255,255,0.00)",
      );

      whiteBlend.addColorStop(
        0.48,
        "rgba(255,255,255,0.10)",
      );

      whiteBlend.addColorStop(
        0.72,
        "rgba(255,255,255,0.32)",
      );

      whiteBlend.addColorStop(
        1,
        "rgba(255,255,255,0.82)",
      );

      ctx.fillStyle = whiteBlend;
      ctx.fillRect(
        0,
        0,
        width,
        height,
      );

      ctx.restore();
    }

    /*
     * Very subtle moving highlight.
     *
     * This replaces the sharper "shimmer line" feeling of
     * the old animation while retaining movement.
     */
    function drawHighlight(time: number) {
      ctx.save();

      const progress =
        (time % 8500) / 8500;

      const x =
        -width * 0.15 +
        progress * width * 1.35;

      const y =
        getWaveY(x, time, 0);

      const glow = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        width * 0.22,
      );

      glow.addColorStop(
        0,
        "rgba(255,255,255,0.18)",
      );

      glow.addColorStop(
        0.25,
        "rgba(255,255,255,0.08)",
      );

      glow.addColorStop(
        1,
        "rgba(255,255,255,0)",
      );

      ctx.fillStyle = glow;

      ctx.beginPath();
      ctx.arc(
        x,
        y,
        width * 0.22,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.restore();
    }

    /*
     * Bottom-left atmospheric blue shadow.
     */
    function drawBottomGlow() {
      ctx.save();

      const gradient = ctx.createRadialGradient(
        width * 0.04,
        height * 0.88,
        0,
        width * 0.04,
        height * 0.88,
        width * 0.55,
      );

      gradient.addColorStop(
        0,
        "rgba(37,99,235,0.12)",
      );

      gradient.addColorStop(
        0.35,
        "rgba(37,99,235,0.06)",
      );

      gradient.addColorStop(
        1,
        "rgba(37,99,235,0)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        height * 0.45,
        width * 0.65,
        height * 0.55,
      );

      ctx.restore();
    }

    /*
     * Far-right orange atmosphere.
     */
    function drawOrangeGlow() {
      ctx.save();

      const gradient = ctx.createRadialGradient(
        width * 0.94,
        height * 0.22,
        0,
        width * 0.94,
        height * 0.22,
        width * 0.32,
      );

      gradient.addColorStop(
        0,
        "rgba(249,115,22,0.13)",
      );

      gradient.addColorStop(
        0.35,
        "rgba(234,88,12,0.06)",
      );

      gradient.addColorStop(
        1,
        "rgba(234,88,12,0)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        width * 0.65,
        0,
        width * 0.35,
        height * 0.55,
      );

      ctx.restore();
    }

    /*
     * Main animation loop.
     */
    function render(time: number) {
      if (!isVisible) return;

      ctx.clearRect(
        0,
        0,
        width,
        height,
      );

      /*
       * Keep background completely transparent.
       * The parent section remains white.
       */
      drawBottomGlow();
      drawOrangeGlow();
      drawMesh(time);
      drawHighlight(time);

      animationFrame =
        requestAnimationFrame(render);
    }

    /*
     * Intersection observer.
     *
     * Same behavior as the previous animation:
     * don't animate when the section isn't visible.
     */
    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          isVisible =
            entry?.isIntersecting ?? true;

          if (isVisible) {
            cancelAnimationFrame(
              animationFrame,
            );

            animationFrame =
              requestAnimationFrame(
                render,
              );
          } else {
            cancelAnimationFrame(
              animationFrame,
            );
          }
        },
        {
          threshold: 0.01,
        },
      );

    observer.observe(container);

    animationFrame =
      requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );

      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none opacity-[0.82]"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}