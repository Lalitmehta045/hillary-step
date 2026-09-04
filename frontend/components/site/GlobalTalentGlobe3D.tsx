"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isLand } from "./geo";

export function GlobalTalentGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.7, 6.0);
    camera.lookAt(0, -0.08, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Main Rotating Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0.22, 0);
    scene.add(globeGroup);

    // Base Pedestal Group (stationary, doesn't rotate with globe)
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -1.5, 0);
    scene.add(baseGroup);

    // --- Multi-Tiered Pedestal Discs (Matching Reference Luxury Base) ---
    const pedestalMatDark = new THREE.MeshStandardMaterial({
      color: 0xF3F4F6,
      roughness: 0.3,
      metalness: 0.08,
    });
    const pedestalMatLight = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.04,
    });

    // Lower wide ring
    const baseDisk1 = new THREE.Mesh(
      new THREE.CylinderGeometry(2.32, 2.4, 0.14, 64),
      pedestalMatDark
    );
    baseGroup.add(baseDisk1);

    // Middle stepped ring
    const baseDisk2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.88, 1.98, 0.16, 64),
      pedestalMatLight
    );
    baseDisk2.position.y = 0.14;
    baseGroup.add(baseDisk2);

    // Upper support ring
    const baseDisk3 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.48, 0.14, 64),
      pedestalMatDark
    );
    baseDisk3.position.y = 0.28;
    baseGroup.add(baseDisk3);

    // Soft green pedestal glow ring
    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.48, 1.84, 64),
      new THREE.MeshBasicMaterial({
        color: 0x22C55E,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
      })
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.36;
    baseGroup.add(glowRing);

    // --- Core Real Earth Satellite Sphere Beneath Dots ---
    const sphereRadius = 1.48;
    const coreGeometry = new THREE.SphereGeometry(sphereRadius * 0.995, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const satelliteTexture = textureLoader.load("/assets/earth-blue-marble.jpg");
    satelliteTexture.colorSpace = THREE.SRGBColorSpace;

    const coreMaterial = new THREE.MeshStandardMaterial({
      map: satelliteTexture,
      roughness: 0.65,
      metalness: 0.05,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.rotation.y = -Math.PI / 2;
    globeGroup.add(coreMesh);

    // Soft atmosphere glow shell
    const atmosphereGeometry = new THREE.SphereGeometry(sphereRadius * 1.015, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x86EFAC,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Subtle latitude circles (Parallels)
    [-30, 0, 30, 60].forEach((lat) => {
      const p = (lat * Math.PI) / 180;
      const ringRadius = sphereRadius * Math.cos(p) * 1.004;
      const ringY = sphereRadius * Math.sin(p) * 1.004;
      const ringGeo = new THREE.BufferGeometry();
      const ringPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        ringPts.push(
          new THREE.Vector3(
            Math.sin(theta) * ringRadius,
            ringY,
            Math.cos(theta) * ringRadius
          )
        );
      }
      ringGeo.setFromPoints(ringPts);
      const ringLine = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({
          color: 0x86EFAC,
          transparent: true,
          opacity: 0.18,
        })
      );
      globeGroup.add(ringLine);
    });

    // --- Helper function: Map (lat, lon) to 3D Sphere Coordinates ---
    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const p = (lat * Math.PI) / 180;
      const l = (lon * Math.PI) / 180;
      return new THREE.Vector3(
        radius * Math.cos(p) * Math.sin(l),
        radius * Math.sin(p),
        radius * Math.cos(p) * Math.cos(l)
      );
    };

    // --- Circular Dot Canvas Texture Generator ---
    const createCircleDotTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 64, 64);
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.75, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    // --- REAL WORLD MAP GENERATION USING NASA BITMASK (isLand) ---
    // Samples real geographical coastlines across North America, South America,
    // Europe, Africa, India, Asia, Australia, and islands.
    const points: number[] = [];
    const colors: number[] = [];
    const r = sphereRadius * 1.008;

    // Step across latitude lines from -58° to 74°
    const latStep = 1.5;
    for (let lat = -58; lat <= 74; lat += latStep) {
      const p = (lat * Math.PI) / 180;
      const cosLat = Math.cos(p);
      const sinLat = Math.sin(p);

      // Keep dot spacing uniform along longitude
      const lonStep = latStep / Math.max(0.12, cosLat);
      for (let lon = -180; lon < 180; lon += lonStep) {
        if (isLand(lat, lon)) {
          const l = (lon * Math.PI) / 180;
          const x = r * cosLat * Math.sin(l);
          const y = r * sinLat;
          const z = r * cosLat * Math.cos(l);

          points.push(x, y, z);

          // Vivid emerald & forest green shades matching reference design
          const rand = Math.random();
          if (rand > 0.8) {
            colors.push(0.13, 0.77, 0.36); // #22c55e (bright emerald)
          } else if (rand > 0.35) {
            colors.push(0.09, 0.64, 0.28); // #16a34a (forest green)
          } else {
            colors.push(0.28, 0.85, 0.48); // #4ade80 (light emerald)
          }
        }
      }
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    pointsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const dotTexture = createCircleDotTexture();
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.042,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.02,
      opacity: 0.95,
      sizeAttenuation: true,
    });

    const landPointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(landPointsMesh);

    // --- Key Talent Hub Markers (Pulsing Pins on Real Continents) ---
    const talentHubs = [
      { name: "New York", lat: 40.71, lon: -74.0 },
      { name: "San Francisco", lat: 37.77, lon: -122.41 },
      { name: "London", lat: 51.5, lon: -0.12 },
      { name: "Frankfurt", lat: 50.11, lon: 8.68 },
      { name: "Bangalore", lat: 12.97, lon: 77.59 },
      { name: "Mumbai", lat: 19.07, lon: 72.87 },
      { name: "Singapore", lat: 1.35, lon: 103.82 },
      { name: "Sydney", lat: -33.86, lon: 151.2 },
    ];

    const hubGroup = new THREE.Group();
    const pulseRings: { mesh: THREE.Mesh; baseScale: number; phase: number }[] = [];

    talentHubs.forEach((hub, idx) => {
      const pos = latLonToVector3(hub.lat, hub.lon, sphereRadius * 1.02);

      // Core Glowing Pin Sphere
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x16A34A })
      );
      pin.position.copy(pos);
      hubGroup.add(pin);

      // Inner Bright Dot
      const innerDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
      );
      innerDot.position.copy(pos);
      hubGroup.add(innerDot);

      // Concentric Radar Pulse Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.075, 32),
        new THREE.MeshBasicMaterial({
          color: 0x22C55E,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        })
      );
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      hubGroup.add(ring);

      pulseRings.push({
        mesh: ring,
        baseScale: 1,
        phase: (idx / talentHubs.length) * Math.PI * 2,
      });
    });
    globeGroup.add(hubGroup);

    // --- Great Circle Arcs Connecting Key International Hubs ---
    const connections = [
      { from: talentHubs[0], to: talentHubs[2] }, // NY -> London
      { from: talentHubs[1], to: talentHubs[6] }, // SF -> Singapore
      { from: talentHubs[2], to: talentHubs[4] }, // London -> Bangalore
      { from: talentHubs[4], to: talentHubs[7] }, // Bangalore -> Sydney
      { from: talentHubs[2], to: talentHubs[3] }, // London -> Frankfurt
      { from: talentHubs[5], to: talentHubs[6] }, // Mumbai -> Singapore
    ];

    connections.forEach(({ from, to }) => {
      const vFrom = latLonToVector3(from.lat, from.lon, sphereRadius * 1.02);
      const vTo = latLonToVector3(to.lat, to.lon, sphereRadius * 1.02);

      // Compute midpoint and lift outward for 3D arch
      const mid = new THREE.Vector3()
        .addVectors(vFrom, vTo)
        .multiplyScalar(0.5);
      const dist = vFrom.distanceTo(vTo);
      const lift = Math.min(1.38, 1.08 + dist * 0.16);
      mid.normalize().multiplyScalar(sphereRadius * lift);

      const curve = new THREE.QuadraticBezierCurve3(vFrom, mid, vTo);
      const curvePoints = curve.getPoints(50);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: 0x22C55E,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5,
      });
      const arc = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arc);
    });

    // --- Lights Setup ---
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.25);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const softFillLight = new THREE.DirectionalLight(0xF0FDF4, 0.8);
    softFillLight.position.set(-4, 3, 2);
    scene.add(softFillLight);

    const greenRimLight = new THREE.DirectionalLight(0x86EFAC, 0.85);
    greenRimLight.position.set(-4, -2, -3);
    scene.add(greenRimLight);

    // Initial globe orientation to show Europe, Asia & Americas nicely
    globeGroup.rotation.x = 0.2;
    globeGroup.rotation.y = 0.6;

    // --- Interactive Drag Controls with Smooth Inertia ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0.6;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.006;
        targetRotationX = Math.max(-0.65, Math.min(0.65, targetRotationX));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Touch events for mobile/tablet
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        targetRotationX = Math.max(-0.65, Math.min(0.65, targetRotationX));

        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    domEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Continuous ambient rotation when user is not dragging
      if (!isDragging) {
        targetRotationY += 0.0032;
      }

      // Smooth camera / rotation interpolation
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.06;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.06;

      // Animate pulsing radar rings on talent hubs
      pulseRings.forEach((p) => {
        const scale = 1 + (Math.sin(time * 3 + p.phase) + 1) * 0.6;
        p.mesh.scale.set(scale, scale, 1);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0.1, 0.8 - (scale - 1) * 0.6);
      });

      // Pulse glow on pedestal
      glowRing.scale.setScalar(1 + Math.sin(time * 2.2) * 0.035);

      // Soft ambient levitation
      globeGroup.position.y = 0.22 + Math.sin(time * 1.4) * 0.03;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width || 480;
        const newHeight = entry.contentRect.height || 480;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domEl.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* Soft background ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#22C55E]/10 via-transparent to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
