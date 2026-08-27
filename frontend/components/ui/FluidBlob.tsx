"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const DEFAULT_COUNT = 5200;
const PALETTE = ["#00E5FF", "#00FF87", "#FF6B00"];
const WEIGHTS = [0.42, 0.34, 0.24];

const createDotTexture = (): THREE.CanvasTexture | null => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export interface FluidBlobProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export function FluidBlob({
  className = "w-full h-full",
  particleCount = DEFAULT_COUNT,
  interactive = true,
}: FluidBlobProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shatterTriggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const parent = parentRef.current;
    const container = containerRef.current;
    if (!parent || !container) return;

    // Dimensions
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Move camera back by 2.5x to compensate for the 250% container size, preventing clipping
    camera.position.set(0, 0, 16.0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    container.appendChild(renderer.domElement);

    // Particles Data
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const homes = new Float32Array(count * 3);
    const scatters = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    const tempColor = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.15 * Math.cbrt(Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = r * Math.cos(phi) * 0.9;

      homes.set([x, y, z], i * 3);
      positions.set([x, y, z], i * 3);

      const rv = Math.random();
      tempColor.set(
        rv < WEIGHTS[0]
          ? PALETTE[0]
          : rv < WEIGHTS[0] + WEIGHTS[1]
            ? PALETTE[1]
            : PALETTE[2]
      );
      colors.set([tempColor.r, tempColor.g, tempColor.b], i * 3);
      seeds[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(positions, 3);
    const colorAttr = new THREE.BufferAttribute(colors, 3);
    geometry.setAttribute("position", positionAttr);
    geometry.setAttribute("color", colorAttr);

    const dotTex = createDotTexture();
    const material = new THREE.PointsMaterial({
      size: 0.05,
      map: dotTex || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Interaction State
    const pointer = { x: 9999, y: 9999, active: false };
    const ray = new THREE.Vector3();
    const localPos = new THREE.Vector3();
    let shatterStart = -1;
    let pendingShatter = false;

    const triggerShatter = () => {
      pendingShatter = true;
    };
    shatterTriggerRef.current = triggerShatter;

    // Pointer Events
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = 9999;
      pointer.y = 9999;
    };

    const handlePointerDown = () => {
      triggerShatter();
    };

    if (interactive) {
      parent.addEventListener("pointermove", handlePointerMove, { passive: true });
      parent.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      parent.addEventListener("pointerdown", handlePointerDown, { passive: true });
    }

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 300;
      height = container.clientHeight || 300;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Animation Loop with Clock & Delta
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    // Intersection Observer to stop rendering when not visible
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      // Handle Shatter Trigger
      if (pendingShatter) {
        pendingShatter = false;
        shatterStart = t;
        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const dir = new THREE.Vector3(
            homes[ix] + (Math.random() - 0.5) * 1.4,
            homes[ix + 1] + (Math.random() - 0.5) * 1.4,
            homes[ix + 2] + (Math.random() - 0.5) * 1.4
          ).normalize();
          const mag = 1.5 + Math.random() * 2.5;
          scatters.set(
            [
              homes[ix] + dir.x * mag,
              homes[ix + 1] + dir.y * mag,
              homes[ix + 2] + dir.z * mag,
            ],
            ix
          );
        }
      }

      // Pointer Ray Calculation
      let mx = 9999;
      let my = 9999;
      let mz = 9999;

      if (pointer.active) {
        ray.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
        const s = -camera.position.z / (ray.z || 0.0001);
        localPos.set(camera.position.x + ray.x * s, camera.position.y + ray.y * s, 0);
        points.worldToLocal(localPos);
        mx = localPos.x;
        my = localPos.y;
        mz = localPos.z;
      }

      // Shatter Progress
      let m = 0;
      if (shatterStart >= 0) {
        const el = t - shatterStart;
        if (el >= 2.0) {
          shatterStart = -1;
        } else {
          m = el < 0.22 ? easeOutCubic(el / 0.22) : 1 - easeInOutCubic((el - 0.22) / 1.78);
        }
      }

      const k = Math.min(1, delta * 4.2);
      const attr = (1 - m) * 0.6;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const seed = seeds[i];
        const sp = 0.5 + seed * 0.9;
        const ph = seed * Math.PI * 2;
        let tx = homes[ix] + Math.sin(t * sp + ph) * 0.09;
        let ty = homes[ix + 1] + Math.cos(t * sp * 1.3 + ph) * 0.09;
        let tz = homes[ix + 2] + Math.sin(t * sp * 0.7 + ph * 2) * 0.09;

        if (pointer.active) {
          const dx = mx - positions[ix];
          const dy = my - positions[ix + 1];
          const dz = mz - positions[ix + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < 2.9) {
            const f = (1 - Math.sqrt(d2) / 1.7) * attr;
            tx += dx * f;
            ty += dy * f;
            tz += dz * f;
          }
        }

        if (m > 0) {
          tx += (scatters[ix] - tx) * m;
          ty += (scatters[ix + 1] - ty) * m;
          tz += (scatters[ix + 2] - tz) * m;
        }

        positions[ix] += (tx - positions[ix]) * k;
        positions[ix + 1] += (ty - positions[ix + 1]) * k;
        positions[ix + 2] += (tz - positions[ix + 2]) * k;
      }

      positionAttr.needsUpdate = true;
      points.rotation.y = t * 0.09;
      points.rotation.x = Math.sin(t * 0.14) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      shatterTriggerRef.current = null;

      if (interactive) {
        parent.removeEventListener("pointermove", handlePointerMove);
        parent.removeEventListener("pointerleave", handlePointerLeave);
        parent.removeEventListener("pointerdown", handlePointerDown);
      }

      geometry.dispose();
      material.dispose();
      dotTex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, interactive]);

  return (
    <div
      ref={parentRef}
      className={`relative cursor-crosshair select-none touch-none ${className}`}
      aria-label="Interactive 3D Fluid Particle Blob Animation"
    >
      <div
        ref={containerRef}
        className="absolute pointer-events-none"
        style={{ inset: "-75%" }}
      />
    </div>
  );
}
