"use client";

import { useEffect, useRef } from "react";

type WaveNode = {
  t: number;
  amp: number;
  phase: number;
  speed: number;
  r: number;
};

/**
 * Animated network wave: flowing mesh ribbons + connected particle nodes
 * tinted blue -> green -> orange across the width. Pure canvas, no image.
 *
 * Performance:
 *  - IntersectionObserver pauses the rAF loop when offscreen
 *  - Node count reduced to 55 (from 110)
 *  - Spatial grid replaces O(n²) brute-force connection check
 */
export function FooterWave({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── visibility tracking via IntersectionObserver ── */
    let isVisible = false;
    let raf = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = !!entry?.isIntersecting;
        if (isVisible && !raf) {
          // resume animation loop
          raf = requestAnimationFrame(draw);
        }
        // when invisible, the loop self-stops (see end of draw())
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    /* ── sizing ── */
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── colour helpers ── */
    const stops: Array<[number, [number, number, number]]> = [
      [0, [37, 99, 235]],
      [0.42, [34, 197, 94]],
      [0.72, [140, 200, 40]],
      [1, [249, 146, 20]],
    ];

    const colorAt = (p: number): [number, number, number] => {
      const x = Math.min(1, Math.max(0, p));
      for (let i = 1; i < stops.length; i++) {
        const cur = stops[i]!;
        const prev = stops[i - 1]!;
        if (x <= cur[0]) {
          const k = (x - prev[0]) / (cur[0] - prev[0] || 1);
          return [
            Math.round(prev[1][0] + (cur[1][0] - prev[1][0]) * k),
            Math.round(prev[1][1] + (cur[1][1] - prev[1][1]) * k),
            Math.round(prev[1][2] + (cur[1][2] - prev[1][2]) * k),
          ];
        }
      }
      return stops[stops.length - 1]![1];
    };

    /* ── wave maths ── */
    const baseY = (px: number) => h * (0.9 - 0.38 * Math.pow(px, 1.7));

    const waveY = (px: number, time: number, band: number) =>
      baseY(px) +
      Math.sin(px * 6.0 + time * 0.5) * 70 * (0.5 + px * 0.5) +
      Math.sin(px * 4.6 - time * 0.4) * 30 +
      Math.sin(px * 15 + time * 0.9 + band * 0.35) * 7;

    /* ── nodes (halved from 110 → 55) ── */
    const nodes: WaveNode[] = Array.from({ length: 55 }, () => ({
      t: Math.random(),
      amp: (Math.random() - 0.5) * 350, // Increased amplitude to spread nodes wider
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.012,
      r: Math.random() < 0.18 ? 4 + Math.random() * 3 : 1 + Math.random() * 2.2,
    }));

    const start = performance.now();

    /* ── draw loop ── */
    const draw = (now: number) => {
      /* stop loop when offscreen */
      if (!isVisible) {
        raf = 0;
        return;
      }

      const time = reduced ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      /* gradient */
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      for (const [p] of stops) {
        const c = colorAt(p);
        grad.addColorStop(p, "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.30)");
      }

      /* wave bands */
      const bands = 34;
      for (let b = 0; b < bands; b++) {
        const off = (b - bands / 2) * 4.0; // Increased offset multiplier to make the band cluster wider
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const px = i / 90;
          const x = px * w;
          const y =
            waveY(px, time, b) +
            off * (0.35 + px * 0.75) +
            Math.sin(px * 11 + time * 0.9 + b * 0.4) * 4;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2; // Slightly thicker lines
        ctx.stroke();
      }

      /* compute particle positions */
      const pts = nodes.map((n) => {
        const px = n.t;
        return {
          px,
          x: px * w,
          y:
            waveY(px, time, 13) +
            n.amp * (0.35 + px * 0.8) * 0.75 +
            Math.sin(time * 0.5 + n.phase) * 6,
          r: n.r,
        };
      });

      /* ── spatial-grid accelerated connections ── */
      const maxDist = Math.max(140, w * 0.15); // Increased connection distance for wider spread
      const maxDistSq = maxDist * maxDist; // avoid sqrt per-pair
      const cellSize = maxDist; // one cell per max-connection range

      // grid dimensions
      const cols = Math.max(1, Math.ceil(w / cellSize));
      const rows = Math.max(1, Math.ceil(h / cellSize));
      const grid: number[][] = new Array(cols * rows);

      // bucket nodes into cells
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!;
        const cx = Math.min(cols - 1, Math.max(0, (p.x / cellSize) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (p.y / cellSize) | 0));
        const key = cy * cols + cx;
        if (!grid[key]) grid[key] = [];
        grid[key]!.push(i);
      }

      // only check neighbouring cells (3×3 around each cell)
      const visited = new Uint8Array(pts.length * pts.length); // dedup flag
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cell = grid[cy * cols + cx];
          if (!cell) continue;

          // iterate over this cell + right / bottom neighbours to avoid duplication
          for (let dy = 0; dy <= 1; dy++) {
            for (let dx = dy === 0 ? 0 : -1; dx <= 1; dx++) {
              const nx = cx + dx;
              const ny = cy + dy;
              if (nx < 0 || nx >= cols || ny >= rows) continue;
              const neighbour = grid[ny * cols + nx];
              if (!neighbour) continue;

              const same = dx === 0 && dy === 0;
              for (const i of cell) {
                for (const j of neighbour) {
                  if (i >= j && same) continue; // avoid self & duplicate in same cell
                  if (i === j) continue;

                  // canonical order for dedup across cells
                  const lo = i < j ? i : j;
                  const hi = i < j ? j : i;
                  const key = lo * pts.length + hi;
                  if (visited[key]) continue;
                  visited[key] = 1;

                  const a = pts[lo]!;
                  const b = pts[hi]!;
                  const ddx = a.x - b.x;
                  const ddy = a.y - b.y;
                  const dSq = ddx * ddx + ddy * ddy;
                  if (dSq < maxDistSq) {
                    const d = Math.sqrt(dSq);
                    const c = colorAt((a.px + b.px) / 2);
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle =
                      "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + 0.3 * (1 - d / maxDist) + ")";
                    ctx.lineWidth = 0.8; // Slightly thicker connection lines
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
      }

      /* draw particles */
      for (const p of pts) {
        const c = colorAt(p.px);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.95)";
        ctx.fill();
      }

      /* advance positions */
      if (!reduced) {
        for (const n of nodes) {
          n.t += n.speed * 0.06;
          if (n.t > 1.02) n.t = -0.02;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    /* initial kick — only if already visible */
    if (isVisible) {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
