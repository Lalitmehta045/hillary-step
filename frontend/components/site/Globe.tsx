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
  const threeCanvas = useRef<HTMLCanvasElement>(null);
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
    const threeCv = threeCanvas.current;
    if (!el || !cv || !threeCv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    // --- Three.js Setup for Real Earth Satellite Map ---
    const threeScene = new THREE.Scene();
    const threeCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCv,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.28;

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/assets/earth-blue-marble.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    // Group for matching tilt and spin
    const tiltGroup = new THREE.Group();
    threeScene.add(tiltGroup);

    // Realistic Satellite Earth Sphere (positioned right beneath the dots layer)
    const earthGeo = new THREE.SphereGeometry(0.998, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.68,
      metalness: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    tiltGroup.add(earthMesh);

    // Subtle atmospheric rim glow
    const atmosphereGeo = new THREE.SphereGeometry(1.025, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.2, 0.55, 1.0, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    tiltGroup.add(atmosphereMesh);

    // Lights for Three.js Satellite Earth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15); // Dark ambient for true night
    threeScene.add(ambientLight);

    // Dynamic sun light attached to the earth mesh
    const sunLight = new THREE.DirectionalLight(0xfffaed, 4.0);
    earthMesh.add(sunLight);

    // Aesthetic rim lights to gently highlight edges in the dark
    const rimLight1 = new THREE.DirectionalLight(0x7c6cf6, 1.2);
    rimLight1.position.set(5, 2, -5);
    threeScene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x3fa0ff, 0.8);
    rimLight2.position.set(-5, -2, -5);
    threeScene.add(rimLight2);

    const onEnter = () => {
      pausedRef.current = true;
    };
    const onLeave = () => {
      pausedRef.current = false;
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    const bgStars: { x: number, y: number, s: number, a: number, speed: number }[] = [];
    for (let i = 0; i < 250; i++) {
      bgStars.push({
        x: Math.random(),
        y: Math.random(),
        s: Math.random() * 1.5 + 0.5,
        a: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 2
      });
    }

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

      threeRenderer.setPixelRatio(dpr);
      threeRenderer.setSize(w, h, false);
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
        targetSpinRef.current += dt * 0.1;
      }

      const nowD = new Date();
      const utcHours = nowD.getUTCHours() + nowD.getUTCMinutes() / 60 + nowD.getUTCSeconds() / 3600;
      const sunLon = (12 - utcHours) * 15;
      const sunVecGeo = toVec(0, sunLon);

      // Sync Three.js sun light with our computed sun vector
      sunLight.position.set(sunVecGeo.x * 5, sunVecGeo.y * 5, sunVecGeo.z * 5);

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

      // Render background stars if the current view is looking at the night side
      const currentLon = -focusRef.current * (180 / Math.PI);
      let diffLon = Math.abs(currentLon - sunLon) % 360;
      if (diffLon > 180) diffLon = 360 - diffLon;

      let nightFactor = (diffLon - 70) / 30; // 0 at 70 deg diff, 1 at 100 deg diff
      nightFactor = Math.max(0, Math.min(1, nightFactor));

      if (nightFactor > 0) {
        for (const s of bgStars) {
          const sx = s.x * w;
          const sy = s.y * h;
          const twinkle = 0.3 + 0.7 * Math.sin(t * s.speed + s.a);
          if (twinkle > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(0.5 * twinkle * nightFactor).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, s.s, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Synchronize Three.js Earth satellite orientation & camera in real time
      tiltGroup.rotation.x = TILT;
      earthMesh.rotation.y = spin - Math.PI / 2;

      const fov = 2 * Math.atan((h / 2) / (R * cam)) * (180 / Math.PI);
      threeCamera.fov = fov;
      threeCamera.aspect = w / h;
      threeCamera.position.set(0, 0, cam);
      threeCamera.lookAt(0, 0, 0);
      threeCamera.updateProjectionMatrix();

      threeRenderer.render(threeScene, threeCamera);

      // Soft edge vignette & subtle atmospheric ring over satellite earth
      const edgeVignette = ctx.createRadialGradient(
        cx,
        cy,
        R * 0.82,
        cx,
        cy,
        R,
      );
      edgeVignette.addColorStop(0, "rgba(5,10,25,0)");
      edgeVignette.addColorStop(0.85, "rgba(5,10,25,0.2)");
      edgeVignette.addColorStop(1, "rgba(10,15,35,0.5)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = edgeVignette;
      ctx.fill();

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
        if (!isFront) continue;

        // Normalize position more broadly across the globe to span 0 to 1
        const g = 0.5 + ((p.x - cx) / R) * 0.5 - ((p.y - cy) / R) * 0.5;
        const k = Math.min(1, Math.max(0, g));

        let rCol = k < 0.5 ? BLUE[0]! + (GREEN[0]! - BLUE[0]!) * (k / 0.5) : GREEN[0]! + (ORANGE[0]! - GREEN[0]!) * ((k - 0.5) / 0.5);
        let gCol = k < 0.5 ? BLUE[1]! + (GREEN[1]! - BLUE[1]!) * (k / 0.5) : GREEN[1]! + (ORANGE[1]! - GREEN[1]!) * ((k - 0.5) / 0.5);
        let bCol = k < 0.5 ? BLUE[2]! + (GREEN[2]! - BLUE[2]!) * (k / 0.5) : GREEN[2]! + (ORANGE[2]! - GREEN[2]!) * ((k - 0.5) / 0.5);

        const twinkle = 0.78 + 0.22 * f2;
        const fade = Math.min(1, (p.z - 0.22) / 0.2);
        let opacity = Math.min(1, (0.9 + 0.5 * fade) * twinkle);

        const sunDot = drifted.x * sunVecGeo.x + drifted.y * sunVecGeo.y + drifted.z * sunVecGeo.z;
        const sunIntensity = Math.max(0.0, Math.min(1.0, (sunDot + 0.2) / 0.4));

        let rSize = Math.max(0.45, 0.8 * p.s * (R / 620));

        // Night time star/city lights effect
        if (sunDot < 0.0) {
          const nightDepth = Math.min(1, (-sunDot) * 2.5); // 0 at dusk, 1 deep night
          if (i % 6 === 0) {
            // City lights (Golden/Orange)
            const cityTwinkle = 0.3 + 0.7 * Math.max(0, Math.sin(t * sp * 3 + ph0[i]!));
            rCol = rCol * (1 - nightDepth) + 255 * nightDepth;
            gCol = gCol * (1 - nightDepth) + 200 * nightDepth;
            bCol = bCol * (1 - nightDepth) + 100 * nightDepth;

            opacity = Math.max(opacity * sunIntensity, cityTwinkle * nightDepth * 0.95);
            if (cityTwinkle > 0.8 && nightDepth > 0.5) {
              rSize *= 1.6; // Brighter city lights
            }
          } else {
            // Normal land mass at night (Deep blue/purple)
            rCol = rCol * (1 - nightDepth) + 25 * nightDepth;
            gCol = gCol * (1 - nightDepth) + 35 * nightDepth;
            bCol = bCol * (1 - nightDepth) + 90 * nightDepth;
            opacity = Math.max(opacity * sunIntensity, 0.35 * nightDepth * twinkle);
          }
        } else {
          opacity *= Math.max(0.25, sunIntensity); // normal day dots
        }

        ctx.fillStyle = `rgba(${rCol | 0},${gCol | 0},${bCol | 0},${opacity.toFixed(3)})`;
        ctx.fillRect(p.x - rSize, p.y - rSize, rSize * 2, rSize * 2);
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
            const isOccluded = pr.z < 0.22 && Math.hypot(pr.x - cx, pr.y - cy) < R * 0.99;
            if (isOccluded) {
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
      threeRenderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
    };
  }, []);

  return (
    <div ref={wrap} className={`relative h-full w-full overflow-hidden transition-colors duration-700 bg-slate-950`}>
      {/* Aesthetic warm sun-light leak on the left */}
      <div className="absolute left-[-25%] top-[10%] w-[70%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(255,160,60,0.08)_0%,rgba(255,160,60,0)_60%)] blur-3xl pointer-events-none z-0" />
      <div className="absolute left-[-15%] top-[25%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,200,100,0.12)_0%,rgba(255,200,100,0)_60%)] blur-3xl pointer-events-none z-0" />
      <div className="absolute left-[-5%] top-[40%] w-[25%] h-[25%] rounded-full bg-[radial-gradient(circle,rgba(255,240,150,0.15)_0%,rgba(255,240,150,0)_60%)] blur-2xl pointer-events-none z-0" />

      <canvas ref={threeCanvas} className="absolute inset-0 block h-full w-full pointer-events-none z-[5]" aria-hidden />
      <canvas ref={canvas} className="block h-full w-full relative z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-20">
        {labels.map((l) => (
          <div
            key={l.id}
            className="absolute flex -translate-y-1/2 items-center gap-2 rounded-lg px-2 py-1.5 shadow-[0_8px_24px_-8px_rgba(38,20,90,0.35)] ring-1 backdrop-blur transition-colors bg-slate-900/95 ring-white/10"
            style={{ left: l.x + 14, top: l.y - 22, opacity: l.o }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-primary-foreground"
              style={{ backgroundColor: l.def.tint }}
            >
              {l.def.glyph}
            </span>
            <span className="text-[13px] font-semibold text-slate-100">
              {l.def.city}{l.def.country ? "," : ""}
            </span>
            {l.def.country && (
              <span className="text-[13px] text-slate-400">{l.def.country}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
