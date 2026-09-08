"use client";

import { useEffect, useRef } from "react";

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
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;

    /*
     * EXISTING HILLARY STEP COLOR SYSTEM
     */
    const COLORS = [
      "#2563EB", // Royal Blue
      "#0284C7", // Cyan Blue
      "#06B6D4", // Turquoise
      "#10B981", // Emerald
      "#84CC16", // Lime
      "#EAB308", // Yellow
      "#F97316", // Orange
      "#EA580C", // Deep Orange
    ];

    /*
     * -------------------------------------------------------
     * RESIZE
     * -------------------------------------------------------
     */

    function resize() {
      const rect = container.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    /*
     * -------------------------------------------------------
     * ORIGINAL ORGANIC DIAGONAL PATH
     *
     * The entire mesh follows this path.
     *
     * Bottom-left → Top-right
     * -------------------------------------------------------
     */

    function getWaveY(
      x: number,
      time: number,
      offset = 0,
    ) {
      const diagonal =
        height * 0.82 -
        x * 0.55;

      const waveA =
        Math.sin(
          x * 0.004 +
            time * 0.00045 +
            offset,
        ) *
        height *
        0.035;

      const waveB =
        Math.sin(
          x * 0.009 -
            time * 0.0003 +
            offset * 2,
        ) *
        height *
        0.018;

      const waveC =
        Math.sin(
          x * 0.0018 +
            time * 0.0007,
        ) *
        height *
        0.028;

      return (
        diagonal +
        waveA +
        waveB +
        waveC
      );
    }

    /*
     * -------------------------------------------------------
     * HEX → RGB
     * -------------------------------------------------------
     */

    function hexToRgb(hex: string) {
      const value = hex.replace("#", "");

      return {
        r: parseInt(
          value.substring(0, 2),
          16,
        ),
        g: parseInt(
          value.substring(2, 4),
          16,
        ),
        b: parseInt(
          value.substring(4, 6),
          16,
        ),
      };
    }

    /*
     * -------------------------------------------------------
     * COLOR INTERPOLATION
     * -------------------------------------------------------
     */

    function interpolateColor(
      colorA: string,
      colorB: string,
      amount: number,
    ) {
      const a = hexToRgb(colorA);
      const b = hexToRgb(colorB);

      const t = Math.max(
        0,
        Math.min(1, amount),
      );

      return {
        r: Math.round(
          a.r +
            (b.r - a.r) * t,
        ),
        g: Math.round(
          a.g +
            (b.g - a.g) * t,
        ),
        b: Math.round(
          a.b +
            (b.b - a.b) * t,
        ),
      };
    }

    /*
     * -------------------------------------------------------
     * MULTI-COLOR MESH COLOR
     * -------------------------------------------------------
     */

    function getMeshColor(
      progress: number,
    ) {
      const scaled =
        Math.max(0, Math.min(0.999, progress)) *
        (COLORS.length - 1);

      const index = Math.floor(scaled);
      const local =
        scaled - index;

      return interpolateColor(
        COLORS[index],
        COLORS[index + 1],
        local,
      );
    }

    /*
     * -------------------------------------------------------
     * MAIN LIQUID MESH
     *
     * Instead of blobs, this creates MANY overlapping
     * translucent gradient fields along the exact wave.
     * -------------------------------------------------------
     */

    function drawMesh(time: number) {
      /*
       * Work on a transparent layer.
       */
      ctx.save();

      /*
       * Soft blur gives the mesh the smooth,
       * premium gradient-mesh appearance.
       */
      ctx.filter = "blur(28px)";

      /*
       * The mesh consists of many overlapping sections.
       */
      const sections = 70;

      for (let i = 0; i < sections; i++) {
        const progress =
          i / (sections - 1);

        /*
         * Slight organic movement.
         */
        const x =
          -width * 0.16 +
          progress *
            width *
            1.32;

        /*
         * Exact wave position.
         */
        const centerY =
          getWaveY(
            x,
            time,
            progress * 0.45,
          );

        /*
         * Make the mesh itself breathe slightly.
         */
        const breathing =
          Math.sin(
            time * 0.00045 +
              progress * 8,
          ) *
          height *
          0.012;

        const y =
          centerY +
          breathing;

        /*
         * Color follows the exact left→right progression.
         */
        const color =
          getMeshColor(progress);

        /*
         * Different widths create the organic
         * gradient-mesh deformation.
         */
        const radiusX =
          width *
          (
            0.11 +
            Math.sin(
              progress * 7 +
                time * 0.0002,
            ) *
              0.018
          );

        const radiusY =
          height *
          (
            0.14 +
            Math.cos(
              progress * 6 -
                time * 0.00018,
            ) *
              0.025
          );

        /*
         * Fade the ends.
         */
        const edgeFade =
          Math.sin(
            progress * Math.PI,
          );

        const alpha =
          0.15 +
          edgeFade * 0.34;

        /*
         * Individual soft radial field.
         */
        const gradient =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            Math.max(
              radiusX,
              radiusY,
            ),
          );

        gradient.addColorStop(
          0,
          `rgba(${color.r},${color.g},${color.b},${alpha})`,
        );

        gradient.addColorStop(
          0.22,
          `rgba(${color.r},${color.g},${color.b},${alpha * 0.82})`,
        );

        gradient.addColorStop(
          0.48,
          `rgba(${color.r},${color.g},${color.b},${alpha * 0.42})`,
        );

        gradient.addColorStop(
          0.72,
          `rgba(${color.r},${color.g},${color.b},${alpha * 0.14})`,
        );

        gradient.addColorStop(
          1,
          `rgba(${color.r},${color.g},${color.b},0)`,
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          radiusX,
          radiusY,
          -0.35,
          0,
          Math.PI * 2,
        );

        ctx.fill();
      }

      ctx.restore();
    }

    /*
     * -------------------------------------------------------
     * SECOND MESH PASS
     *
     * Adds depth and removes the appearance of individual
     * radial circles.
     * -------------------------------------------------------
     */

    function drawMeshDepth(time: number) {
      ctx.save();

      ctx.filter = "blur(55px)";

      const sections = 34;

      for (let i = 0; i < sections; i++) {
        const progress =
          i / (sections - 1);

        const x =
          -width * 0.10 +
          progress *
            width *
            1.18;

        const y =
          getWaveY(
            x,
            time,
            1.4,
          );

        const color =
          getMeshColor(
            Math.min(
              0.999,
              progress * 1.03,
            ),
          );

        const radius =
          Math.max(
            width,
            height,
          ) *
          0.19;

        const gradient =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius,
          );

        gradient.addColorStop(
          0,
          `rgba(${color.r},${color.g},${color.b},0.15)`,
        );

        gradient.addColorStop(
          0.45,
          `rgba(${color.r},${color.g},${color.b},0.07)`,
        );

        gradient.addColorStop(
          1,
          `rgba(${color.r},${color.g},${color.b},0)`,
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          radius * 1.35,
          radius * 0.58,
          -0.42,
          0,
          Math.PI * 2,
        );

        ctx.fill();
      }

      ctx.restore();
    }

    /*
     * -------------------------------------------------------
     * WHITE FEATHERING
     *
     * Keeps the mesh integrated into the white Global
     * Presence section.
     * -------------------------------------------------------
     */

    function drawWhiteFeather() {
      ctx.save();

      const gradient =
        ctx.createLinearGradient(
          0,
          height * 0.15,
          width,
          height * 0.85,
        );

      gradient.addColorStop(
        0,
        "rgba(255,255,255,0.00)",
      );

      gradient.addColorStop(
        0.35,
        "rgba(255,255,255,0.02)",
      );

      gradient.addColorStop(
        0.60,
        "rgba(255,255,255,0.10)",
      );

      gradient.addColorStop(
        0.78,
        "rgba(255,255,255,0.32)",
      );

      gradient.addColorStop(
        1,
        "rgba(255,255,255,0.78)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );

      ctx.restore();
    }

    /*
     * -------------------------------------------------------
     * SUBTLE MOVING LIGHT
     * -------------------------------------------------------
     */

    function drawMovingLight(
      time: number,
    ) {
      ctx.save();

      ctx.filter = "blur(30px)";

      const progress =
        (time % 9000) / 9000;

      const x =
        -width * 0.15 +
        progress *
          width *
          1.30;

      const y =
        getWaveY(
          x,
          time,
          0,
        );

      const gradient =
        ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          width * 0.20,
        );

      gradient.addColorStop(
        0,
        "rgba(255,255,255,0.22)",
      );

      gradient.addColorStop(
        0.3,
        "rgba(255,255,255,0.08)",
      );

      gradient.addColorStop(
        1,
        "rgba(255,255,255,0)",
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        width * 0.20,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.restore();
    }

    /*
     * -------------------------------------------------------
     * BOTTOM LEFT BLUE ATMOSPHERE
     * -------------------------------------------------------
     */

    function drawBottomAtmosphere() {
      ctx.save();

      ctx.filter = "blur(40px)";

      const gradient =
        ctx.createRadialGradient(
          width * 0.02,
          height * 0.92,
          0,
          width * 0.02,
          height * 0.92,
          width * 0.40,
        );

      gradient.addColorStop(
        0,
        "rgba(37,99,235,0.16)",
      );

      gradient.addColorStop(
        0.45,
        "rgba(37,99,235,0.06)",
      );

      gradient.addColorStop(
        1,
        "rgba(37,99,235,0)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        height * 0.55,
        width * 0.50,
        height * 0.45,
      );

      ctx.restore();
    }

    /*
     * -------------------------------------------------------
     * TOP RIGHT ORANGE ATMOSPHERE
     * -------------------------------------------------------
     */

    function drawOrangeAtmosphere() {
      ctx.save();

      ctx.filter = "blur(40px)";

      const gradient =
        ctx.createRadialGradient(
          width * 0.98,
          height * 0.16,
          0,
          width * 0.98,
          height * 0.16,
          width * 0.32,
        );

      gradient.addColorStop(
        0,
        "rgba(249,115,22,0.14)",
      );

      gradient.addColorStop(
        0.42,
        "rgba(234,88,12,0.06)",
      );

      gradient.addColorStop(
        1,
        "rgba(234,88,12,0)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        width * 0.68,
        0,
        width * 0.32,
        height * 0.48,
      );

      ctx.restore();
    }

    /*
     * -------------------------------------------------------
     * RENDER
     * -------------------------------------------------------
     */

    function render(time: number) {
      if (!visible) return;

      ctx.clearRect(
        0,
        0,
        width,
        height,
      );

      /*
       * Atmospheric depth.
       */
      drawBottomAtmosphere();
      drawOrangeAtmosphere();

      /*
       * Main continuous mesh.
       */
      drawMesh(time);

      /*
       * Deeper color layer.
       */
      drawMeshDepth(time);

      /*
       * Moving light through the mesh.
       */
      drawMovingLight(time);

      /*
       * Integrate into white background.
       */
      drawWhiteFeather();

      animationFrame =
        requestAnimationFrame(
          render,
        );
    }

    /*
     * -------------------------------------------------------
     * INTERSECTION OBSERVER
     * -------------------------------------------------------
     */

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          visible =
            entry?.isIntersecting ??
            true;

          if (visible) {
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
      requestAnimationFrame(
        render,
      );

    /*
     * -------------------------------------------------------
     * CLEANUP
     * -------------------------------------------------------
     */

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
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}