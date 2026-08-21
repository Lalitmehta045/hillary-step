import { useEffect, useRef, useState } from "react";
import { landPoints, slerp, toVec, type Vec3 } from "./geo";

type Rt = { lat: number; lon: number };



type ArcDef = {
  from: Rt;
  to: Rt;
  hue: string;
  delay: number;
  duration: number;
  label: { city: string; country: string; tint: string; glyph: string };
};

const IND_MUM = { lat: 19.07, lon: 72.87 };
const IND_DEL = { lat: 28.61, lon: 77.20 };
const IND_BLR = { lat: 12.97, lon: 77.59 };
const IND_HYD = { lat: 17.38, lon: 78.48 };
const IND_MAA = { lat: 13.08, lon: 80.27 };

const USA_LA = { lat: 34.05, lon: -118.24 };
const USA_SJ = { lat: 37.33, lon: -121.88 };
const USA_NY = { lat: 40.71, lon: -74.00 };
const USA_DAL = { lat: 32.77, lon: -96.79 };
const USA_BOS = { lat: 42.36, lon: -71.05 };
const USA_CHI = { lat: 41.87, lon: -87.62 };

const AUS_SYD = { lat: -33.86, lon: 151.2 };
const AUS_MEL = { lat: -37.81, lon: 144.96 };
const AUS_BNE = { lat: -27.47, lon: 153.03 };
const AUS_PER = { lat: -31.95, lon: 115.86 };

const ARCS: ArcDef[] = [
  {
    from: IND_MUM,
    to: USA_NY,
    hue: "#ff3d9e",
    delay: 0,
    duration: 5.5,
    label: { city: "New York", country: "NY", tint: "#7c6cf6", glyph: "◈" },
  },
  {
    from: USA_NY,
    to: AUS_SYD,
    hue: "#6f5bf5",
    delay: 1.8,
    duration: 6.8,
    label: { city: "Sydney", country: "NSW", tint: "#3fa0ff", glyph: "●" },
  },
  {
    from: AUS_SYD,
    to: IND_DEL,
    hue: "#ff8a3d",
    delay: 3.6,
    duration: 5.6,
    label: { city: "Delhi NCR", country: "", tint: "#f0b429", glyph: "◐" },
  },
  {
    from: IND_DEL,
    to: USA_LA,
    hue: "#e0399f",
    delay: 5.4,
    duration: 6.0,
    label: { city: "Los Angeles", country: "CA", tint: "#ff3d9e", glyph: "▲" },
  },
  {
    from: USA_LA,
    to: AUS_MEL,
    hue: "#5b8def",
    delay: 7.2,
    duration: 6.5,
    label: { city: "Melbourne", country: "VIC", tint: "#ff7a59", glyph: "◆" },
  },
  {
    from: AUS_MEL,
    to: IND_BLR,
    hue: "#8b5cf6",
    delay: 9.0,
    duration: 5.4,
    label: { city: "Bengaluru", country: "KA", tint: "#22b07d", glyph: "◼" },
  },
  {
    from: IND_BLR,
    to: USA_SJ,
    hue: "#ff3d9e",
    delay: 10.8,
    duration: 5.8,
    label: { city: "San Jose", country: "CA", tint: "#e0399f", glyph: "◈" },
  },
  {
    from: USA_SJ,
    to: AUS_BNE,
    hue: "#6f5bf5",
    delay: 12.6,
    duration: 7.2,
    label: { city: "Brisbane", country: "QLD", tint: "#ff8a3d", glyph: "●" },
  },
  {
    from: AUS_BNE,
    to: IND_HYD,
    hue: "#ff8a3d",
    delay: 14.4,
    duration: 5.6,
    label: { city: "Hydrabad", country: "TN", tint: "#7c6cf6", glyph: "▲" },
  },
  {
    from: IND_HYD,
    to: USA_DAL,
    hue: "#e0399f",
    delay: 16.2,
    duration: 5.8,
    label: { city: "Dallas", country: "TX", tint: "#3fa0ff", glyph: "◐" },
  },
  {
    from: USA_DAL,
    to: AUS_PER,
    hue: "#5b8def",
    delay: 18.0,
    duration: 6.2,
    label: { city: "Perth", country: "WA", tint: "#ff7a59", glyph: "◆" },
  },
  {
    from: AUS_PER,
    to: IND_MAA,
    hue: "#8b5cf6",
    delay: 19.8,
    duration: 6.5,
    label: { city: "Chennai", country: "TN", tint: "#0f4bd8", glyph: "◼" },
  },
  {
    from: IND_MAA,
    to: USA_CHI,
    hue: "#ff3d9e",
    delay: 21.6,
    duration: 5.8,
    label: { city: "Chicago", country: "IL", tint: "#7c6cf6", glyph: "◈" },
  },
  {
    from: USA_CHI,
    to: USA_BOS,
    hue: "#6f5bf5",
    delay: 23.4,
    duration: 3.5,
    label: { city: "Boston", country: "MA", tint: "#3fa0ff", glyph: "●" },
  },
  {
    from: USA_BOS,
    to: IND_MUM,
    hue: "#ff8a3d",
    delay: 25.2,
    duration: 5.6,
    label: { city: "Mumbai", country: "MH", tint: "#f0b429", glyph: "◐" },
  },
];

const TILT = 0.2;

const BLUE = [26, 108, 255];
const GREEN = [64, 246, 0];
const ORANGE = [255, 149, 0];

type Label = { id: number; x: number; y: number; o: number; def: ArcDef["label"] };

export function Globe({ active = "India" }: { active?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  // target longitude for each region
  const targetLon = active === "United States" ? -95 : active === "Australia" ? 135 : 80;
  const targetSpin = -targetLon * (Math.PI / 180);
  const targetSpinRef = useRef(targetSpin);
  const focusRef = useRef(targetSpin);
  const lastTime = useRef(performance.now());
  const pausedRef = useRef(false);

  useEffect(() => {
    targetSpinRef.current = -targetLon * (Math.PI / 180);
  }, [active, targetLon]);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const onEnter = () => {
      pausedRef.current = true;
    };
    const onLeave = () => {
      pausedRef.current = false;
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    const dots = landPoints(60000);
    // per-dot drift parameters (floating petal motion)
    const n = dots.length;
    const ph0 = new Float32Array(n);
    const ph1 = new Float32Array(n);
    const ph2 = new Float32Array(n);
    const spd = new Float32Array(n);
    const amp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      ph0[i] = Math.random() * Math.PI * 2;
      ph1[i] = Math.random() * Math.PI * 2;
      ph2[i] = Math.random() * Math.PI * 2;
      spd[i] = 0.35 + Math.random() * 0.9;
      amp[i] = 0.006 + Math.random() * 0.03;
    }
    const drifted: Vec3 = { x: 0, y: 0, z: 0 };
    const arcs = ARCS.map((a) => ({
      def: a,
      a: toVec(a.from.lat, a.from.lon),
      b: toVec(a.to.lat, a.to.lon),
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let isVisible = true;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]) isVisible = entries[0].isIntersecting;
    });
    io.observe(el);

    const start = performance.now();
    lastTime.current = start;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!isVisible) return;

      const dt = (now - lastTime.current) / 1000;
      lastTime.current = now;
      const t = (now - start) / 1000 + 15;

      // Continuously spin; pause while the pointer is over the globe
      if (!reduce && !pausedRef.current) {
        targetSpinRef.current += dt * 0.055;
      }

      let diff = targetSpinRef.current - focusRef.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      // smoothly seek the target
      focusRef.current += diff * 0.08;

      const spin = focusRef.current;

      const isMobile = w < 768;
      // Keep globe perfectly centered and scaled to avoid cutting off at the bottom
      const R = isMobile ? Math.min(w, h) * 0.42 : Math.min(w, h) * 0.35;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const cam = 4.2; // camera distance in radii
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      const cosS = Math.cos(spin);
      const sinS = Math.sin(spin);

      const project = (p: Vec3) => {
        // spin around Y, then tilt around X
        const x1 = p.x * cosS + p.z * sinS;
        const z1 = -p.x * sinS + p.z * cosS;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;
        const persp = cam / (cam - z2);
        return { x: cx + x1 * R * persp, y: cy - y2 * R * persp, z: z2, s: persp };
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // soft sphere body
      const body = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.45,
        R * 0.1,
        cx,
        cy,
        R * 1.05,
      );
      // Soft translucent sphere to give volume without being a solid white block
      body.addColorStop(0, "rgba(255,255,255,0.9)");
      body.addColorStop(0.72, "rgba(222,235,255,0.85)");
      body.addColorStop(1, "rgba(222,235,255,0.35)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(124,92,246,0.08)";
      ctx.stroke();

      // dots — floating / drifting like petals
      for (let i = 0; i < n; i++) {
        const d = dots[i]!;
        const sp = spd[i]!;
        const a = amp[i]!;
        const f1 = Math.sin(t * sp + ph0[i]!);
        const f2 = Math.sin(t * sp * 0.83 + ph1[i]!);
        const f3 = Math.sin(t * sp * 1.27 + ph2[i]!);
        const lift = 1 + a * 1.6 * (0.5 + 0.5 * f3);
        drifted.x = d.x * lift + a * f1;
        drifted.y = d.y * lift + a * f2;
        drifted.z = d.z * lift + a * f3;
        const p = project(drifted);

        const isFront = p.z >= 0.22;

        // Normalize position more broadly across the globe to span 0 to 1
        const g = 0.5 + ((p.x - cx) / R) * 0.5 - ((p.y - cy) / R) * 0.5;
        const k = Math.min(1, Math.max(0, g));

        const rCol = k < 0.5 ? BLUE[0]! + (GREEN[0]! - BLUE[0]!) * (k / 0.5) : GREEN[0]! + (ORANGE[0]! - GREEN[0]!) * ((k - 0.5) / 0.5);
        const gCol = k < 0.5 ? BLUE[1]! + (GREEN[1]! - BLUE[1]!) * (k / 0.5) : GREEN[1]! + (ORANGE[1]! - GREEN[1]!) * ((k - 0.5) / 0.5);
        const bCol = k < 0.5 ? BLUE[2]! + (GREEN[2]! - BLUE[2]!) * (k / 0.5) : GREEN[2]! + (ORANGE[2]! - GREEN[2]!) * ((k - 0.5) / 0.5);

        const twinkle = 0.78 + 0.22 * f2;

        let opacity = 0;
        if (isFront) {
          const fade = Math.min(1, (p.z - 0.22) / 0.2);
          opacity = Math.min(1, (0.9 + 0.5 * fade) * twinkle);
        } else {
          // Back dots are faint
          opacity = 0.05;
        }

        ctx.fillStyle = `rgba(${rCol | 0},${gCol | 0},${bCol | 0},${opacity.toFixed(3)})`;
        const r = Math.max(0.45, (isFront ? 0.8 : 0.6) * p.s * (R / 620));
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }


      // arcs
      const nextLabels: Label[] = [];
      const cycle = 28; // Increased cycle to allow full animation sequence gracefully

      arcs.forEach((arc, idx) => {
        const timeOffset = t - arc.def.delay;
        const local = ((timeOffset % cycle) + cycle) % cycle;

        const headProg = local / arc.def.duration;
        const tailProg = headProg - 0.55;

        const head = Math.min(1, Math.max(0, headProg));
        const tail = Math.min(1, Math.max(0, tailProg));
        const lift = 0.28;

        const pointAt = (u: number) => {
          const base = slerp(arc.a, arc.b, u);
          const alt = 1 + lift * Math.sin(Math.PI * u);
          return { x: base.x * alt, y: base.y * alt, z: base.z * alt };
        };

        // endpoint rings helper
        const ring = (v: Vec3, alpha: number) => {
          const pr = project(v);
          if (pr.z < 0 || alpha <= 0) return null;
          const rr = 5 * pr.s * (R / 620);
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `${arc.def.hue}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = Math.max(1.2, R / 520);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rr * 0.36, 0, Math.PI * 2);
          ctx.fillStyle = `${arc.def.hue}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();
          return pr;
        };

        if (tail < 1 && head > 0) {
          ctx.lineWidth = Math.max(1.3, R / 420);
          ctx.lineCap = "round";
          const steps = 64;
          ctx.beginPath();
          let started = false;
          for (let s = 0; s <= steps; s++) {
            const u = tail + ((head - tail) * s) / steps;
            const pr = project(pointAt(u));
            if (pr.z < -0.35) {
              started = false;
              continue;
            }
            if (!started) {
              ctx.moveTo(pr.x, pr.y);
              started = true;
            } else ctx.lineTo(pr.x, pr.y);
          }
          const pa = project(pointAt(tail));
          const pb = project(pointAt(head));

          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > 0.5) {
            const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
            grad.addColorStop(0, `${arc.def.hue}00`);
            grad.addColorStop(1, `${arc.def.hue}ee`);
            ctx.strokeStyle = grad;
            ctx.stroke();
          }

          // start ring
          const startRingAlpha = Math.min(1, headProg * 6) * (1 - tail);
          ring(arc.a, startRingAlpha);
        }

        let destAlpha = 0;
        const tailArrivalTime = arc.def.duration * 1.55;
        const labelEndTime = tailArrivalTime + 1.5;

        if (headProg > 0.9) {
          const fadeIn = Math.min(1, (headProg - 0.9) / 0.1);
          const fadeOut = local <= labelEndTime ? Math.min(1, (labelEndTime - local) / 0.6) : 0;
          destAlpha = Math.min(fadeIn, fadeOut);
        }

        const dest = ring(arc.b, destAlpha);

        if (dest && headProg >= 0.9) {
          nextLabels.push({
            id: idx,
            x: dest.x,
            y: dest.y,
            o: Math.max(0, Math.min(1, destAlpha)),
            def: arc.def.label,
          });
        }
      });

      // Resolve label overlaps to prevent text stacking
      nextLabels.sort((a, b) => a.y - b.y);
      for (let i = 0; i < nextLabels.length; i++) {
        for (let j = 0; j < i; j++) {
          const a = nextLabels[j];
          const b = nextLabels[i];
          if (Math.abs(a.x - b.x) < 160 && Math.abs(a.y - b.y) < 42) {
            b.y = a.y + 42;
          }
        }
      }
      // Re-sort by ID to keep array order stable for React state comparison
      nextLabels.sort((a, b) => a.id - b.id);

      setLabels((prev) => {
        if (
          prev.length === nextLabels.length &&
          prev.every(
            (p, i) =>
              p.id === nextLabels[i]!.id &&
              Math.abs(p.x - nextLabels[i]!.x) < 0.5 &&
              Math.abs(p.y - nextLabels[i]!.y) < 0.5 &&
              Math.abs(p.o - nextLabels[i]!.o) < 0.02,
          )
        )
          return prev;
        return nextLabels;
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} className="relative h-full w-full overflow-hidden">
      <canvas ref={canvas} className="block h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0">
        {labels.map((l) => (
          <div
            key={l.id}
            className="absolute flex -translate-y-1/2 items-center gap-2 rounded-lg bg-card/95 px-2 py-1.5 shadow-[0_8px_24px_-8px_rgba(38,20,90,0.35)] ring-1 ring-border backdrop-blur"
            style={{ left: l.x + 14, top: l.y - 22, opacity: l.o }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-primary-foreground"
              style={{ backgroundColor: l.def.tint }}
            >
              {l.def.glyph}
            </span>
            <span className="text-[13px] font-semibold text-foreground">
              {l.def.city}{l.def.country ? "," : ""}
            </span>
            {l.def.country && (
              <span className="text-[13px] text-muted-foreground">{l.def.country}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
