"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * IridescentLiquid
 * A GPU-driven soap-film / liquid-glass organic blob rendered with three.js.
 * - Vertex displacement via layered simplex noise (FBM) -> continuous organic morphing
 * - Thin-film interference shading -> iridescent rims, dark translucent center
 * - Pointer disturbance layer (position + velocity) smoothed with spring damping
 */

export type IridescentLiquidProps = {
  /** CSS size of the square canvas, e.g. 520 or "60vmin" */
  size?: number | string;
  className?: string;
  /** Global deformation multiplier */
  intensity?: number;
  /** Enable pointer disturbance */
  interactive?: boolean;
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform float uDisturb;      // 0..1 hover amount
uniform float uVelocity;     // 0..1 pointer speed energy
uniform vec3  uPointer;      // pointer ray direction target on unit sphere
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vObj;
varying float vDisp;

// --- simplex noise (Ashima) ---
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 mod289vec3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289vec3(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.zzww*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p, float t){
  float a = 0.5, s = 0.0, f = 1.0;
  for (int i = 0; i < 4; i++) {
    s += a * snoise(p * f + vec3(0.0, 0.0, t * (0.35 + 0.11 * float(i))));
    f *= 2.03;
    a *= 0.5;
  }
  return s;
}

// displacement field on the unit sphere direction n
float displace(vec3 n){
  float t = uTime;
  // large slow lobes: makes the silhouette flatten / fold / stretch
  float big = snoise(n * 0.55 + vec3(0.0, t * 0.13, t * 0.08));
  float fold = snoise(n * 0.95 - vec3(t * 0.09, 0.0, t * 0.14));
  // gentle surface breathing
  float fine = snoise(n * 1.7 + vec3(t * 0.2, t * 0.15, 0.0));

  float d = big * 0.13 + fold * 0.06 + fine * 0.02;

  // pointer disturbance: local push/pull + ripples around the pointer point
  float prox = max(0.0, dot(n, uPointer));
  float local = pow(prox, 3.0); // restored refined area falloff
  float energy = uDisturb * (1.1 + uVelocity * 1.3); // restored tasteful energy
  float ripple = sin(prox * 8.5 - t * 4.0) * 0.5 + 0.5;
  float turb = snoise(n * 2.2 + vec3(t * 1.0, -t * 0.6, t * 0.8));
  d += energy * local * (0.16 * ripple + 0.10 * turb - 0.03); // restored clean ripple distortion
  d += energy * pow(prox, 8.0) * 0.12; // restored snappy bulge warp

  return d * uIntensity;
}

void main(){
  vec3 n = normalize(position);
  float d = displace(n);
  vec3 p = n * (1.0 + d);

  // rebuild normal from displaced neighbours (tangent basis)
  vec3 tRef = abs(n.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(tRef, n));
  vec3 t2 = cross(n, t1);
  float e = 0.035;
  vec3 na = normalize(n + t1 * e);
  vec3 nb = normalize(n + t2 * e);
  vec3 pa = na * (1.0 + displace(na));
  vec3 pb = nb * (1.0 + displace(nb));
  vec3 nrm = normalize(cross(pa - p, pb - p));
  if (dot(nrm, n) < 0.0) nrm = -nrm;

  vObj = p;
  vDisp = d;
  vNormalW = normalize(mat3(modelMatrix) * nrm);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vPosW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3  uCamPos;
uniform float uDisturb;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vObj;
varying float vDisp;

// cheap hash noise for surface film thickness variation
float hash(vec3 p){ return fract(sin(dot(p, vec3(17.1, 31.7, 53.3))) * 43758.5453); }
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float n = mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                    mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                    mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  return n*2.0-1.0;
}

// thin-film interference: thickness (nm) -> spectral colour
vec3 thinFilm(float thickness, float cosT){
  // optical path difference; per-channel wavelengths (r,g,b) approx nm
  float opd = 2.0 * 1.34 * thickness * cosT;
  vec3 lambda = vec3(650.0, 545.0, 460.0);
  vec3 phase = 6.28318 * opd / lambda + 3.14159;
  vec3 c = 0.5 + 0.5 * cos(phase);
  return c * c; // sharpen bands
}

void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(uCamPos - vPosW);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);
  float rim  = pow(1.0 - ndv, 1.35);

  // film thickness varies with curvature, flow noise and viewing angle
  float flow = vnoise(vObj * 1.8 + vec3(0.0, uTime * 0.22, uTime * 0.15));
  float flow2 = vnoise(vObj * 4.0 - vec3(uTime * 0.35, 0.0, uTime * 0.2));
  float thickness = 400.0
    + 520.0 * flow
    + 280.0 * flow2
    + 430.0 * pow(1.0 - ndv, 1.5)
    + 1100.0 * vDisp
    + 60.0 * uDisturb * sin(uTime * 2.0 + vObj.x * 3.0);

  vec3 film = thinFilm(thickness, max(ndv, 0.15));
  film = pow(film, vec3(0.75, 1.1, 0.85)) * 1.25; // boost color saturation of rainbow bands

  // moving specular lights travelling over the surface
  vec3 l1 = normalize(vec3(sin(uTime * 0.42) * 1.4, 0.9, 1.1));
  vec3 l2 = normalize(vec3(-1.2, sin(uTime * 0.31) * 1.2, 0.7));
  vec3 h1 = normalize(l1 + V);
  vec3 h2 = normalize(l2 + V);
  float s1 = pow(max(dot(N, h1), 0.0), 240.0);
  float s2 = pow(max(dot(N, h2), 0.0), 26.0);

  // deep dark translucent interior core (rich violet-indigo instead of red-orange)
  vec3 interior = vec3(0.05, 0.02, 0.12) * (0.15 + 0.85 * pow(ndv, 2.2));
  interior += vec3(0.18, 0.0, 0.28) * pow(max(0.0, 1.0 - ndv), 3.0);

  vec3 col = interior;
  col += film * (0.05 + 3.0 * fres);           // iridescence strongest at grazing angles
  col += film * 0.14 * pow(max(dot(N, l1), 0.0), 4.0); // sparse surface color patches
  col += film * 0.11 * pow(max(dot(N, l2), 0.0), 4.5);
  col += vec3(1.0, 0.98, 0.92) * s1 * 1.1; // bright sharp specular
  col += film * s2 * 2.2; // secondary color specular

  // bright neon cyan/magenta outer rim
  float edge = smoothstep(0.78, 1.0, rim);
  vec3 edgeCol = mix(vec3(0.85, 0.0, 1.0), vec3(0.0, 0.95, 1.0), 0.5 + 0.5 * flow);
  col += mix(edgeCol, film * 2.2, 0.5) * edge * 2.4;
  
  // paper-thin bright white fresnel outline (ultra-realistic glass envelope refraction)
  col += vec3(1.0, 1.0, 1.0) * pow(1.0 - ndv, 14.0) * 1.8;

  // gentle tone shaping
  col = col / (1.0 + col * 0.55);
  col = pow(col, vec3(0.9));

  gl_FragColor = vec4(col, 1.0);
}
`;

const glowFragment = /* glsl */ `
precision highp float;
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float a = atan(p.y, p.x);
  float falloff = smoothstep(1.0, 0.12, r);
  falloff *= falloff;
  vec3 c = 0.5 + 0.5 * cos(vec3(0.0, 2.1, 4.2) + a * 1.5 + uTime * 0.4);
  c = mix(vec3(1.0, 0.25, 0.06), c, 0.55);
  gl_FragColor = vec4(c * falloff * 0.42, falloff * 0.42);
}
`;

const glowVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function IridescentLiquid({
  size = "min(70vmin, 620px)",
  className,
  intensity = 1,
  interactive = true,
}: IridescentLiquidProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const isSmall = window.innerWidth < 768;
    const detail = isSmall ? 4 : 5; // 4 -> ~2.5k tris, 5 -> ~10k tris
    const geometry = new THREE.IcosahedronGeometry(1, detail);

    const uniforms = {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uDisturb: { value: 0 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 1) },
      uCamPos: { value: camera.position.clone() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // soft atmospheric glow behind the object
    const glowUniforms = { uTime: { value: 0 } };
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 5.2),
      new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        uniforms: glowUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    );
    glow.position.z = -1.6;
    scene.add(glow);

    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ---- pointer state (refs only, no React re-renders) ----
    const pointer = { x: 0, y: 0, px: 0, py: 0, inside: false, speed: 0 };
    const targetDir = new THREE.Vector3(0, 0, 1);
    const smoothDir = new THREE.Vector3(0, 0, 1);
    let disturb = 0;
    let velEnergy = 0;

    const onMove = (e: PointerEvent) => {
      pointer.inside = true;
      const r = host.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.speed = Math.min(
        1,
        Math.hypot(x - pointer.px, y - pointer.py) * 9,
      );
      pointer.px = x;
      pointer.py = y;
      pointer.x = x;
      pointer.y = y;
    };
    const onEnter = (e: PointerEvent) => {
      pointer.inside = true;
      const r = host.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.x = x;
      pointer.y = y;
      pointer.px = x;
      pointer.py = y;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.speed = 0;
    };

    if (interactive && !reduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
    }

    // pause when offscreen / tab hidden
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => (visible = entries[0]?.isIntersecting ?? true),
      { threshold: 0 },
    );
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1.18);
    const hit = new THREE.Vector3();

    const render = () => {
      raf = requestAnimationFrame(render);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;

      if (reduced) {
        uniforms.uTime.value = 3.7;
        renderer.render(scene, camera);
        return;
      }

      uniforms.uTime.value += dt;
      glowUniforms.uTime.value = uniforms.uTime.value;

      // resolve pointer to a point on the object's bounding sphere
      if (interactive) {
        const active = pointer.inside;
        // Project 2D coordinates into a 3D target direction on the sphere
        targetDir.set(pointer.x, pointer.y, 0.75).normalize();

        const target = active ? 1 : 0;
        // spring-ish smoothing: fast attack (12.0), fast settle (6.0)
        const k = active ? 12.0 : 6.0;
        disturb += (target - disturb) * Math.min(1, k * dt);

        velEnergy += (pointer.speed - velEnergy) * Math.min(1, 6 * dt);
        pointer.speed *= 0.86;

        smoothDir.lerp(targetDir, Math.min(1, 10 * dt)).normalize();
        uniforms.uPointer.value.copy(smoothDir);
        uniforms.uDisturb.value = disturb;
        uniforms.uVelocity.value = velEnergy;
      }

      // slow drift / float, never a mechanical spin
      const t = uniforms.uTime.value;
      mesh.rotation.y = t * 0.09 + Math.sin(t * 0.21) * 0.25;
      mesh.rotation.x = Math.sin(t * 0.13) * 0.22;
      mesh.rotation.z = Math.cos(t * 0.17) * 0.12;
      mesh.position.y = Math.sin(t * 0.35) * 0.05;

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      glow.geometry.dispose();
      (glow.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host)
        host.removeChild(renderer.domElement);
    };
  }, [intensity, interactive]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        aspectRatio: "1 / 1",
        touchAction: "none",
        pointerEvents: "auto",
      }}
    />
  );
}
