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

    /*
     * Soft gradient mesh points.
     *
     * These positions intentionally follow the same general
     * left-bottom → right-top composition of the old animation.
     */
    const blobs = [
      {
        x: 0.10,
        y: 0.76,
        radius: 0.55,
        color: [29, 78, 216],
        strength: 0.82,
        speed: 0.00042,
        phase: 0.0,
      },
      {
        x: 0.25,
        y: 0.55,
        radius: 0.48,
        color: [2, 132, 199],
        strength: 0.78,
        speed: 0.00038,
        phase: 1.2,
      },
      {
        x: 0.42,
        y: 0.40,
        radius: 0.46,
        color: [6, 182, 212],
        strength: 0.72,
        speed: 0.00035,
        phase: 2.1,
      },
      {
        x: 0.56,
        y: 0.32,
        radius: 0.43,
        color: [16, 185, 129],
        strength: 0.70,
        speed: 0.00032,
        phase: 3.0,
      },
      {
        x: 0.69,
        y: 0.38,
        radius: 0.40,
        color: [132, 204, 22],
        strength: 0.64,
        speed: 0.0003,
        phase: 4.0,
      },
      {
        x: 0.80,
        y: 0.49,
        radius: 0.38,
        color: [234, 179, 8],
        strength: 0.58,
        speed: 0.00028,
        phase: 4.8,
      },
      {
        x: 0.90,
        y: 0.61,
        radius: 0.35,
        color: [249, 115, 22],
        strength: 0.48,
        speed: 0.00025,
        phase: 5.6,
      },
    ];

    const drawBlob = (
      x: number,
      y: number,
      radius: number,
      color: number[],
      alpha: number
    ) => {
      const gradient = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

      gradient.addColorStop(
        0,
        `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
      );

      gradient.addColorStop(
        0.28,
        `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
          alpha * 0.82
        })`
      );

      gradient.addColorStop(
        0.55,
        `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
          alpha * 0.48
        })`
      );

      gradient.addColorStop(
        0.78,
        `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
          alpha * 0.16
        })`
      );

      gradient.addColorStop(
        1,
        `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
      );
    };

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      /*
       * Pure white base.
       */
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      /*
       * Slow global movement.
       */
      const t = now * 0.00018;

      /*
       * Slight blur makes the individual gradient fields
       * merge into one continuous mesh.
       */
      ctx.save();

      const blurAmount = Math.max(
        24,
        Math.min(width, height) * 0.055
      );

      ctx.filter = `blur(${blurAmount}px)`;

      /*
       * Draw the individual color fields.
       */
      blobs.forEach((blob, index) => {
        const movementX =
          Math.sin(
            t * (1.0 + blob.speed * 1000) +
              blob.phase
          ) *
          width *
          0.045;

        const movementY =
          Math.cos(
            t * (0.8 + blob.speed * 850) +
              blob.phase * 1.35
          ) *
          height *
          0.055;

        /*
         * Organic breathing.
         */
        const breathing =
          1 +
          Math.sin(
            t * 1.6 +
              blob.phase +
              index * 0.35
          ) *
            0.08;

        const x =
          width * blob.x +
          movementX +
          Math.sin(t * 0.55 + index) *
            width *
            0.018;

        const y =
          height * blob.y +
          movementY +
          Math.cos(t * 0.48 + index) *
            height *
            0.018;

        const radius =
          Math.min(width, height) *
          blob.radius *
          breathing;

        drawBlob(
          x,
          y,
          radius,
          blob.color,
          blob.strength
        );
      });

      ctx.restore();

      /*
       * Additional large soft blue field at the lower-left.
       * This gives the composition the same visual weight
       * as the reference image.
       */
      ctx.save();

      ctx.filter = `blur(${Math.min(
        width,
        height
      ) * 0.08}px)`;

      const blueGlow = ctx.createRadialGradient(
        width * 0.12,
        height * 0.82,
        0,
        width * 0.12,
        height * 0.82,
        Math.min(width, height) * 0.72
      );

      blueGlow.addColorStop(
        0,
        "rgba(29, 78, 216, 0.42)"
      );

      blueGlow.addColorStop(
        0.35,
        "rgba(37, 99, 235, 0.25)"
      );

      blueGlow.addColorStop(
        0.68,
        "rgba(6, 182, 212, 0.09)"
      );

      blueGlow.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      /*
       * Soft central green/cyan atmosphere.
       */
      ctx.save();

      ctx.filter = `blur(${Math.min(
        width,
        height
      ) * 0.075}px)`;

      const greenGlow = ctx.createRadialGradient(
        width * 0.48,
        height * 0.38,
        0,
        width * 0.48,
        height * 0.38,
        Math.min(width, height) * 0.58
      );

      greenGlow.addColorStop(
        0,
        "rgba(16, 185, 129, 0.24)"
      );

      greenGlow.addColorStop(
        0.38,
        "rgba(132, 204, 22, 0.14)"
      );

      greenGlow.addColorStop(
        0.72,
        "rgba(234, 179, 8, 0.05)"
      );

      greenGlow.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = greenGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      /*
       * Warm orange field toward the right side.
       */
      ctx.save();

      ctx.filter = `blur(${Math.min(
        width,
        height
      ) * 0.065}px)`;

      const orangeGlow = ctx.createRadialGradient(
        width * 0.88,
        height * 0.58,
        0,
        width * 0.88,
        height * 0.58,
        Math.min(width, height) * 0.48
      );

      orangeGlow.addColorStop(
        0,
        "rgba(249, 115, 22, 0.25)"
      );

      orangeGlow.addColorStop(
        0.38,
        "rgba(234, 179, 8, 0.13)"
      );

      orangeGlow.addColorStop(
        0.72,
        "rgba(249, 115, 22, 0.045)"
      );

      orangeGlow.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      /*
       * Large white wash on the right.
       *
       * This keeps the design premium and prevents the
       * gradient from becoming a full saturated background.
       */
      const whiteFade = ctx.createLinearGradient(
        width * 0.58,
        0,
        width,
        0
      );

      whiteFade.addColorStop(
        0,
        "rgba(255, 255, 255, 0)"
      );

      whiteFade.addColorStop(
        0.55,
        "rgba(255, 255, 255, 0.10)"
      );

      whiteFade.addColorStop(
        0.82,
        "rgba(255, 255, 255, 0.38)"
      );

      whiteFade.addColorStop(
        1,
        "rgba(255, 255, 255, 0.82)"
      );

      ctx.fillStyle = whiteFade;
      ctx.fillRect(0, 0, width, height);

      /*
       * Subtle top white atmospheric fade.
       */
      const topFade = ctx.createLinearGradient(
        0,
        0,
        0,
        height * 0.28
      );

      topFade.addColorStop(
        0,
        "rgba(255, 255, 255, 0.62)"
      );

      topFade.addColorStop(
        0.65,
        "rgba(255, 255, 255, 0.10)"
      );

      topFade.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, height);

      /*
       * Very subtle moving highlight.
       * This is what gives the mesh a "living" quality.
       */
      ctx.save();

      ctx.globalCompositeOperation = "screen";
      ctx.filter = `blur(${Math.min(
        width,
        height
      ) * 0.045}px)`;

      const highlightX =
        width *
        (0.45 +
          Math.sin(t * 0.42) * 0.08);

      const highlightY =
        height *
        (0.30 +
          Math.cos(t * 0.36) * 0.06);

      const highlight = ctx.createRadialGradient(
        highlightX,
        highlightY,
        0,
        highlightX,
        highlightY,
        Math.min(width, height) * 0.32
      );

      highlight.addColorStop(
        0,
        "rgba(255, 255, 255, 0.18)"
      );

      highlight.addColorStop(
        0.45,
        "rgba(255, 255, 255, 0.06)"
      );

      highlight.addColorStop(
        1,
        "rgba(255, 255, 255, 0)"
      );

      ctx.fillStyle = highlight;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          if (isVisible && !animationFrameId) {
            animationFrameId =
              requestAnimationFrame(render);
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

      window.removeEventListener(
        "resize",
        resize
      );
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