"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
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

const IND_MUM = { lat: 19.07, lon: 72.87 },
  IND_DEL = { lat: 28.61, lon: 77.2 },
  IND_BLR = { lat: 12.97, lon: 77.59 },
  IND_HYD = { lat: 17.38, lon: 78.48 },
  IND_MAA = { lat: 13.08, lon: 80.27 };

const USA_LA = { lat: 34.05, lon: -118.24 },
  USA_SJ = { lat: 37.33, lon: -121.88 },
  USA_NY = { lat: 40.71, lon: -74 },
  USA_DAL = { lat: 32.77, lon: -96.79 },
  USA_BOS = { lat: 42.36, lon: -71.05 },
  USA_CHI = { lat: 41.87, lon: -87.62 };

const AUS_SYD = { lat: -33.86, lon: 151.2 },
  AUS_MEL = { lat: -37.81, lon: 144.96 },
  AUS_BNE = { lat: -27.47, lon: 153.03 },
  AUS_PER = { lat: -31.95, lon: 115.86 };

const ARCS: ArcDef[] = [
  { from: IND_MUM, to: USA_NY, hue: "#ff3d9e", delay: 0, duration: 5.5, label: { city: "New York", country: "NY", tint: "#7c6cf6", glyph: "◈" } },
  { from: USA_NY, to: AUS_SYD, hue: "#6f5bf5", delay: 1.8, duration: 6.8, label: { city: "Sydney", country: "NSW", tint: "#3fa0ff", glyph: "●" } },
  { from: AUS_SYD, to: IND_DEL, hue: "#ff8a3d", delay: 3.6, duration: 5.6, label: { city: "Delhi NCR", country: "", tint: "#f0b429", glyph: "◐" } },
  { from: IND_DEL, to: USA_LA, hue: "#e0399f", delay: 5.4, duration: 6, label: { city: "Los Angeles", country: "CA", tint: "#ff3d9e", glyph: "▲" } },
  { from: USA_LA, to: AUS_MEL, hue: "#5b8def", delay: 7.2, duration: 6.5, label: { city: "Melbourne", country: "VIC", tint: "#ff7a59", glyph: "◆" } },
  { from: AUS_MEL, to: IND_BLR, hue: "#8b5cf6", delay: 9, duration: 5.4, label: { city: "Bengaluru", country: "KA", tint: "#22b07d", glyph: "◼" } },
  { from: IND_BLR, to: USA_SJ, hue: "#ff3d9e", delay: 10.8, duration: 5.8, label: { city: "San Jose", country: "CA", tint: "#e0399f", glyph: "◈" } },
  { from: USA_SJ, to: AUS_BNE, hue: "#6f5bf5", delay: 12.6, duration: 7.2, label: { city: "Brisbane", country: "QLD", tint: "#ff8a3d", glyph: "●" } },
  { from: AUS_BNE, to: IND_HYD, hue: "#ff8a3d", delay: 14.4, duration: 5.6, label: { city: "Hydrabad", country: "TN", tint: "#7c6cf6", glyph: "▲" } },
  { from: IND_HYD, to: USA_DAL, hue: "#e0399f", delay: 16.2, duration: 5.8, label: { city: "Dallas", country: "TX", tint: "#3fa0ff", glyph: "◐" } },
  { from: USA_DAL, to: AUS_PER, hue: "#5b8def", delay: 18, duration: 6.2, label: { city: "Perth", country: "WA", tint: "#ff7a59", glyph: "◆" } },
  { from: AUS_PER, to: IND_MAA, hue: "#8b5cf6", delay: 19.8, duration: 6.5, label: { city: "Chennai", country: "TN", tint: "#0f4bd8", glyph: "◼" } },
  { from: IND_MAA, to: USA_CHI, hue: "#ff3d9e", delay: 21.6, duration: 5.8, label: { city: "Chicago", country: "IL", tint: "#7c6cf6", glyph: "◈" } },
  { from: USA_CHI, to: USA_BOS, hue: "#6f5bf5", delay: 23.4, duration: 3.5, label: { city: "Boston", country: "MA", tint: "#3fa0ff", glyph: "●" } },
  { from: USA_BOS, to: IND_MUM, hue: "#ff8a3d", delay: 25.2, duration: 5.6, label: { city: "Mumbai", country: "MH", tint: "#f0b429", glyph: "◐" } },
];

const TILT = 0.2;
const BLUE = [26, 108, 255];
const GREEN = [64, 246, 0];
const ORANGE = [255, 149, 0];

type Label = {
  id: number;
  x: number;
  y: number;
  o: number;
  def: ArcDef["label"];
};

export function Globe({ active = "India" }: { active?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const threeCanvas = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<Label[]>([]);

  const targetLon =
    active === "United States" ? -95 : active === "Australia" ? 135 : 80;
  const targetSpin = (-targetLon * Math.PI) / 180;
  const targetSpinRef = useRef(targetSpin);
  const focusRef = useRef(targetSpin);
  const lastTime = useRef(performance.now());
  const pausedRef = useRef(false);

  useEffect(() => {
    targetSpinRef.current = (-targetLon * Math.PI) / 180;
  }, [active, targetLon]);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const threeCv = threeCanvas.current;
    if (!el || !cv || !threeCv) return;

    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: threeCv,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;

    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load("/assets/earth-blue-marble.jpg", () => {
      earthMat.needsUpdate = true;
    });
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const lightsTexture = loader.load("/assets/earth-lights.png", () => {
      earthMat.needsUpdate = true;
    });
    lightsTexture.colorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    scene.add(group);
    const geo = new THREE.SphereGeometry(0.998, 48, 48); // Optimized segment count (48 vs 64) for smooth 60fps

    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: earthTexture },
        nightTexture: { value: lightsTexture },
        sunDirection: { value: new THREE.Vector3(0, 0, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 tex = texture2D(dayTexture, vUv).rgb;
          vec3 lights = texture2D(nightTexture, vUv).rgb;
          float sunDot = dot(normalize(vNormal), normalize(sunDirection));
          float dayFactor = smoothstep(-0.18, 0.08, sunDot);
          float blueDominance = tex.b - max(tex.r, tex.g) * 0.45;
          float oceanMask = smoothstep(-0.035, 0.10, blueDominance);
          float luminance = dot(tex, vec3(0.299, 0.587, 0.114));
          vec3 royalBlue = vec3(0.10196, 0.32157, 0.83529);
          vec3 royalOcean = royalBlue * (0.92 + 0.28 * luminance);
          vec3 oceanColor = mix(tex, royalOcean, oceanMask * 0.82);
          float sunlight = 0.88 + 0.55 * max(0.0, sunDot);
          vec3 dayColor = oceanColor * sunlight * 1.55;
          float cloudSignal = smoothstep(0.55, 0.88, luminance) * (1.0 - oceanMask * 0.75);
          dayColor = mix(dayColor, vec3(1.0), cloudSignal * 0.24);
          vec3 nightTerrain = tex * 0.035;
          vec3 cityLights = pow(lights, vec3(0.92)) * 3.8 * vec3(1.28, 1.10, 0.85);
          vec3 nightColor = nightTerrain + cityLights;
          gl_FragColor = vec4(mix(nightColor, dayColor, dayFactor), 1.0);
        }
      `,
    });

    const earth = new THREE.Mesh(geo, earthMat);
    group.add(earth);

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const sun = new THREE.DirectionalLight(0xfffaed, 4);
    group.add(sun);
    const rim1 = new THREE.DirectionalLight(0x7c6cf6, 1.2);
    rim1.position.set(5, 2, -5);
    scene.add(rim1);
    const rim2 = new THREE.DirectionalLight(0x3fa0ff, 0.8);
    rim2.position.set(-5, -2, -5);
    scene.add(rim2);

    const enter = () => {
      pausedRef.current = true;
    };
    const leave = () => {
      pausedRef.current = false;
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    // Optimized starfield: 200 stars with fast rect blit
    const stars: {
      x: number;
      y: number;
      s: number;
      a: number;
      speed: number;
      bright: number;
    }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        s: Math.random() * 1.2 + 0.4,
        a: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 2.0,
        bright: 0.35 + Math.random() * 0.65,
      });
    }

    const comets: {
      x: number;
      y: number;
      angle: number;
      speed: number;
      length: number;
      phase: number;
      size: number;
    }[] = [];
    for (let i = 0; i < 3; i++) {
      comets.push({
        x: Math.random(),
        y: 0.08 + Math.random() * 0.84,
        angle: (Math.random() * 0.55 + 0.18) * (Math.random() < 0.5 ? -1 : 1),
        speed: 0.035 + Math.random() * 0.045,
        length: 0.08 + Math.random() * 0.1,
        phase: Math.random(),
        size: 0.7 + Math.random() * 0.7,
      });
    }

    // High performance dots: 16,000 sampling points yields ~3,500 crisp land dots
    const dots = landPoints(16000);
    const n = dots.length;
    const ph0 = new Float32Array(n);
    const ph1 = new Float32Array(n);
    const spd = new Float32Array(n);
    const amp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      ph0[i] = Math.random() * Math.PI * 2;
      ph1[i] = Math.random() * Math.PI * 2;
      spd[i] = 0.35 + Math.random() * 0.9;
      amp[i] = 0.006 + Math.random() * 0.03;
    }

    const drifted: Vec3 = { x: 0, y: 0, z: 0 };
    const arcs = ARCS.map((a) => ({
      def: a,
      a: toVec(a.from.lat, a.from.lon),
      b: toVec(a.to.lat, a.to.lon),
    }));

    let w = 0,
      h = 0,
      dpr = 1,
      t = 0;
    let R = 0,
      cx = 0,
      cy = 0;
    const cam = 4.2;

    const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);

      const mobile = w < 768;
      R = mobile ? Math.min(w, h) * 0.42 : Math.min(w, h) * 0.35;
      cx = w * 0.5;
      cy = h * 0.5;

      // Update camera projection matrix only on resize
      camera.fov = (2 * Math.atan(h / 2 / (R * cam)) * 180) / Math.PI;
      camera.aspect = w / h;
      camera.position.set(0, 0, cam);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]) visible = e[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    const start = performance.now();
    lastTime.current = start;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frameCount = 0;

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible) return;

      const dt = Math.min((now - lastTime.current) / 1000, 0.1);
      lastTime.current = now;
      t = (now - start) / 1000 + 15;
      frameCount++;

      if (!reduce && !pausedRef.current) {
        targetSpinRef.current += dt * 0.1;
      }

      const d = new Date();
      const utc =
        d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
      const sunLon = (12 - utc) * 15;
      const sunGeo = toVec(0, sunLon);

      let diff = targetSpinRef.current - focusRef.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      focusRef.current += diff * 0.08;

      const spin = focusRef.current;
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      const cs = Math.cos(spin);
      const ss = Math.sin(spin);

      const sx = sunGeo.x * cs + sunGeo.z * ss;
      const sz = -sunGeo.x * ss + sunGeo.z * cs;
      sun.position.set(sx * 5, sunGeo.y * 5, sz * 5);

      const project = (v: Vec3) => {
        const x1 = v.x * cs + v.z * ss;
        const z1 = -v.x * ss + v.z * cs;
        const y2 = v.y * ct - z1 * st;
        const z2 = v.y * st + z1 * ct;
        const persp = cam / (cam - z2);
        return {
          x: cx + x1 * R * persp,
          y: cy - y2 * R * persp,
          z: z2,
          s: persp,
        };
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Fast starfield
      const rSquared = R * R * 1.05;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]!;
        const x = s.x * w;
        const y = s.y * h;
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy < rSquared) continue;
        const tw = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(t * s.speed + s.a));
        const alpha = Math.min(1, s.bright * tw * 0.72);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fillRect(x - s.s * 0.5, y - s.s * 0.5, s.s, s.s);
      }

      // Comets
      const cometRSquared = R * R * 1.02;
      for (let i = 0; i < comets.length; i++) {
        const c = comets[i]!;
        const p = (t * c.speed + c.phase) % 1;
        const travel = 1.35;
        const cosA = Math.cos(c.angle);
        const sinA = Math.sin(c.angle);
        const hx = ((c.x + cosA * p * travel + 1) % 1) * w;
        const hy = c.y * h + sinA * p * travel * h * 0.72;
        const tx = hx - cosA * c.length * w;
        const ty = hy - sinA * c.length * h * 0.72;

        for (let j = 0; j < 8; j++) {
          const u = j / 7;
          const x = hx + (tx - hx) * u;
          const y = hy + (ty - hy) * u;
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy < cometRSquared) continue;
          const a = (1 - u) * 0.24 * (1 - j / 10);
          ctx.fillStyle = `rgba(220,235,255,${a.toFixed(2)})`;
          const sz = Math.max(0.5, c.size * (1 - u));
          ctx.fillRect(x - sz * 0.5, y - sz * 0.5, sz, sz);
        }
      }

      // Render Three.js Earth
      group.rotation.x = TILT;
      earth.rotation.y = spin - Math.PI / 2;
      group.updateMatrixWorld(true);
      const sw = new THREE.Vector3();
      sun.getWorldPosition(sw);
      earthMat.uniforms.sunDirection.value.copy(
        earth.worldToLocal(sw).normalize()
      );
      renderer.render(scene, camera);

      // Atmosphere vignette
      const vg = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
      vg.addColorStop(0, "rgba(5,10,25,0)");
      vg.addColorStop(0.85, "rgba(5,10,25,.2)");
      vg.addColorStop(1, "rgba(10,15,35,.5)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = vg;
      ctx.fill();

      // Render Land Dots
      const dotScale = R / 620;
      for (let i = 0; i < n; i++) {
        const d = dots[i]!;
        const a = amp[i]!;
        const sp = spd[i]!;
        const f1 = Math.sin(t * sp + ph0[i]!);
        const f2 = Math.sin(t * sp * 0.83 + ph1[i]!);
        const lift = 1 + a * 1.6 * (0.5 + 0.5 * f2);

        drifted.x = d.x * lift + a * f1;
        drifted.y = d.y * lift + a * f2;
        drifted.z = d.z * lift + a * f1;

        const q = project(drifted);
        if (q.z < 0.22) continue;

        const g = 0.5 + ((q.x - cx) / R) * 0.5 - ((q.y - cy) / R) * 0.5;
        const k = Math.max(0, Math.min(1, g));

        const rc =
          k < 0.5
            ? BLUE[0]! + ((GREEN[0]! - BLUE[0]!) * k) / 0.5
            : GREEN[0]! + ((ORANGE[0]! - GREEN[0]!) * (k - 0.5)) / 0.5;
        const gc =
          k < 0.5
            ? BLUE[1]! + ((GREEN[1]! - BLUE[1]!) * k) / 0.5
            : GREEN[1]! + ((ORANGE[1]! - GREEN[1]!) * (k - 0.5)) / 0.5;
        const bc =
          k < 0.5
            ? BLUE[2]! + ((GREEN[2]! - BLUE[2]!) * k) / 0.5
            : GREEN[2]! + ((ORANGE[2]! - GREEN[2]!) * (k - 0.5)) / 0.5;

        const tw = 0.78 + 0.22 * f2;
        const fade = Math.min(1, (q.z - 0.22) / 0.2);
        let op = Math.min(1, (1.05 + 0.55 * fade) * tw);
        const sd =
          drifted.x * sunGeo.x + drifted.y * sunGeo.y + drifted.z * sunGeo.z;
        const si = Math.max(0, Math.min(1, (sd + 0.2) / 0.4));
        const size = Math.max(0.6, 1.05 * q.s * dotScale);
        op *= sd < 0 ? Math.max(0, 1 + sd * 4) : Math.max(0.32, si);

        ctx.fillStyle = `rgba(${rc | 0},${gc | 0},${bc | 0},${op.toFixed(2)})`;
        ctx.fillRect(q.x - size, q.y - size, size * 2, size * 2);
      }

      // Arcs & Flight lines
      const next: Label[] = [];
      const cycle = 28;
      const arcScale = R / 520;

      for (let idx = 0; idx < arcs.length; idx++) {
        const arc = arcs[idx]!;
        const off = t - arc.def.delay;
        const local = ((off % cycle) + cycle) % cycle;
        const hp = local / arc.def.duration;
        const tp = hp - 0.55;
        const head = Math.min(1, Math.max(0, hp));
        const tail = Math.min(1, Math.max(0, tp));

        const point = (u: number) => {
          const b = slerp(arc.a, arc.b, u);
          const alt = 1 + 0.28 * Math.sin(Math.PI * u);
          return { x: b.x * alt, y: b.y * alt, z: b.z * alt };
        };

        const ring = (v: Vec3, alpha: number) => {
          const q = project(v);
          if (q.z < 0 || alpha <= 0) return null;
          const r = 5 * q.s * (R / 620);
          ctx.beginPath();
          ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `${arc.def.hue}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = Math.max(1.2, arcScale);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(q.x, q.y, r * 0.36, 0, Math.PI * 2);
          ctx.fillStyle = `${arc.def.hue}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();
          return q;
        };

        if (tail < 1 && head > 0) {
          ctx.lineWidth = Math.max(1.3, R / 420);
          ctx.lineCap = "round";
          ctx.beginPath();
          let started = false;

          for (let s = 0; s <= 32; s++) {
            const u = tail + ((head - tail) * s) / 32;
            const q = project(point(u));
            const occ =
              q.z < 0.22 && Math.hypot(q.x - cx, q.y - cy) < R * 0.99;
            if (occ) {
              started = false;
              continue;
            }
            if (!started) {
              ctx.moveTo(q.x, q.y);
              started = true;
            } else {
              ctx.lineTo(q.x, q.y);
            }
          }

          const pa = project(point(tail));
          const pb = project(point(head));
          if ((pb.x - pa.x) ** 2 + (pb.y - pa.y) ** 2 > 0.5) {
            const gr = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
            gr.addColorStop(0, `${arc.def.hue}00`);
            gr.addColorStop(1, `${arc.def.hue}ee`);
            ctx.strokeStyle = gr;
            ctx.stroke();
          }

          ring(arc.a, Math.min(1, hp * 6) * (1 - tail));
        }

        let da = 0;
        const arrival = arc.def.duration * 1.55;
        const end = arrival + 1.5;
        if (hp > 0.9) {
          const fi = Math.min(1, (hp - 0.9) / 0.1);
          const fo = local <= end ? Math.min(1, (end - local) / 0.6) : 0;
          da = Math.min(fi, fo);
        }

        const dest = ring(arc.b, da);
        if (dest && hp >= 0.9) {
          next.push({
            id: idx,
            x: dest.x,
            y: dest.y,
            o: Math.max(0, Math.min(1, da)),
            def: arc.def.label,
          });
        }
      }

      // Throttle React state updates to every 4th frame (~15fps) to prevent main thread blocking
      if (frameCount % 4 === 0) {
        next.sort((a, b) => a.y - b.y);
        for (let i = 0; i < next.length; i++) {
          for (let j = 0; j < i; j++) {
            if (
              Math.abs(next[i]!.x - next[j]!.x) < 160 &&
              Math.abs(next[i]!.y - next[j]!.y) < 42
            ) {
              next[i]!.y = next[j]!.y + 42;
            }
          }
        }
        next.sort((a, b) => a.id - b.id);

        setLabels((prev) =>
          prev.length === next.length &&
          prev.every(
            (p, i) =>
              p.id === next[i]?.id &&
              Math.abs(p.x - next[i]!.x) < 1 &&
              Math.abs(p.y - next[i]!.y) < 1 &&
              Math.abs(p.o - next[i]!.o) < 0.05
          )
            ? prev
            : next
        );
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      renderer.dispose();
      geo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      lightsTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative h-full w-full overflow-hidden bg-slate-950"
      style={{ contain: "strict" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_52%,rgba(255,180,100,0.10),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(20,55,120,0.16),transparent_38%)] pointer-events-none z-0" />
      <canvas
        ref={threeCanvas}
        className="absolute inset-0 block h-full w-full pointer-events-none z-[5]"
        aria-hidden
      />
      <canvas
        ref={canvas}
        className="block h-full w-full relative z-10 pointer-events-none"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-20">
        {labels.map((l) => (
          <div
            key={l.id}
            className="absolute flex -translate-y-1/2 items-center gap-2 rounded-lg px-2 py-1.5 shadow-[0_8px_24px_-8px_rgba(38,20,90,0.35)] ring-1 backdrop-blur bg-slate-900/95 ring-white/10 transition-opacity duration-150"
            style={{
              left: l.x + 14,
              top: l.y - 22,
              opacity: l.o,
              willChange: "transform, opacity",
            }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-primary-foreground"
              style={{ backgroundColor: l.def.tint }}
            >
              {l.def.glyph}
            </span>
            <span className="text-[13px] font-semibold text-slate-100">
              {l.def.city}
              {l.def.country ? "," : ""}
            </span>
            {l.def.country && (
              <span className="text-[13px] text-slate-400">
                {l.def.country}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
