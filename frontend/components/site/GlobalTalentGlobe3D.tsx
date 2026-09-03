"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function GlobalTalentGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);
    camera.lookAt(0, -0.1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Group for globe and rings
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0.2, 0);
    scene.add(globeGroup);

    // Base Pedestal Group (stationary, doesn't rotate with globe)
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -1.5, 0);
    scene.add(baseGroup);

    // --- Pedestal Discs ---
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0xF3F4F6,
      roughness: 0.25,
      metalness: 0.1,
    });
    const pedestalRingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.15,
      metalness: 0.05,
    });

    // Lower wide ring
    const baseDisk1 = new THREE.Mesh(
      new THREE.CylinderGeometry(2.3, 2.38, 0.12, 64),
      pedestalMaterial
    );
    baseGroup.add(baseDisk1);

    // Middle stepped ring
    const baseDisk2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.85, 1.95, 0.15, 64),
      pedestalRingMaterial
    );
    baseDisk2.position.y = 0.12;
    baseGroup.add(baseDisk2);

    // Inner support ring
    const baseDisk3 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.45, 0.12, 64),
      pedestalMaterial
    );
    baseDisk3.position.y = 0.24;
    baseGroup.add(baseDisk3);

    // Soft green accent glow on base
    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.45, 1.8, 64),
      new THREE.MeshBasicMaterial({
        color: 0x22C55E,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.26;
    baseGroup.add(glowRing);

    // --- Main Sphere (Globe Inner Core) ---
    const sphereRadius = 1.48;
    const coreGeometry = new THREE.SphereGeometry(sphereRadius * 0.99, 64, 64);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.35,
      metalness: 0.05,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // Soft atmosphere glow shell
    const atmosphereGeometry = new THREE.SphereGeometry(sphereRadius * 1.01, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x86EFAC,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // --- Continents Particle Landmass Generation ---
    // Approximate land coordinates (lat, lon ranges)
    const landmassBounds = [
      // North America
      { minLat: 15, maxLat: 68, minLon: -140, maxLon: -55 },
      // Central & South America
      { minLat: -54, maxLat: 12, minLon: -80, maxLon: -35 },
      // Europe
      { minLat: 36, maxLat: 68, minLon: -10, maxLon: 45 },
      // Africa
      { minLat: -34, maxLat: 36, minLon: -16, maxLon: 50 },
      // Asia / Middle East / Russia
      { minLat: 10, maxLat: 72, minLon: 40, maxLon: 145 },
      // India & South Asia
      { minLat: 8, maxLat: 35, minLon: 68, maxLon: 92 },
      // East Asia / Japan
      { minLat: 20, maxLat: 46, minLon: 100, maxLon: 145 },
      // Australia & NZ
      { minLat: -42, maxLat: -12, minLon: 112, maxLon: 154 },
      // UK & Ireland
      { minLat: 50, maxLat: 59, minLon: -10, maxLon: 2 },
    ];

    const isLand = (lat: number, lon: number) => {
      // General land check based on clustered bounds
      return landmassBounds.some(
        (b) => lat >= b.minLat && lat <= b.maxLat && lon >= b.minLon && lon <= b.maxLon
      );
    };

    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Create dotted landmass points
    const points: number[] = [];
    const colors: number[] = [];

    // Dense grid of points
    for (let lat = -80; lat <= 80; lat += 2.2) {
      const circumferenceAtLat = Math.cos((lat * Math.PI) / 180);
      const lonStep = circumferenceAtLat > 0.05 ? 2.4 / circumferenceAtLat : 10;
      for (let lon = -180; lon < 180; lon += lonStep) {
        if (isLand(lat, lon)) {
          // Add slight jitter for organic look
          const jitterLat = lat + (Math.random() - 0.5) * 0.5;
          const jitterLon = lon + (Math.random() - 0.5) * 0.5;
          const v = latLonToVector3(jitterLat, jitterLon, sphereRadius * 1.006);
          points.push(v.x, v.y, v.z);

          // Emerald green variations
          const isHighlight = Math.random() > 0.8;
          if (isHighlight) {
            colors.push(0.13, 0.77, 0.36); // Bright emerald (#22c55e)
          } else {
            colors.push(0.08, 0.55, 0.24); // Deep forest green (#15803d)
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

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });

    const landPoints = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(landPoints);

    // --- Key Talent Hub Markers (Pulsing Pins) ---
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
    talentHubs.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, sphereRadius * 1.02);
      // Small glowing sphere at hub
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.042, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x22C55E })
      );
      pin.position.copy(pos);
      hubGroup.add(pin);

      // Pulse ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.085, 24),
        new THREE.MeshBasicMaterial({
          color: 0x4ADE80,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        })
      );
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      hubGroup.add(ring);
    });
    globeGroup.add(hubGroup);

    // --- Great Circle Arcs Connecting Key Hubs ---
    const connections = [
      { from: talentHubs[0], to: talentHubs[2] }, // NY -> London
      { from: talentHubs[1], to: talentHubs[6] }, // SF -> Singapore
      { from: talentHubs[2], to: talentHubs[4] }, // London -> Bangalore
      { from: talentHubs[4], to: talentHubs[7] }, // Bangalore -> Sydney
      { from: talentHubs[2], to: talentHubs[3] }, // London -> Frankfurt
    ];

    connections.forEach(({ from, to }) => {
      const vFrom = latLonToVector3(from.lat, from.lon, sphereRadius * 1.02);
      const vTo = latLonToVector3(to.lat, to.lon, sphereRadius * 1.02);

      // Compute midpoint and lift outward
      const mid = new THREE.Vector3()
        .addVectors(vFrom, vTo)
        .multiplyScalar(0.5);
      const dist = vFrom.distanceTo(vTo);
      const lift = Math.min(1.4, 1.08 + dist * 0.18);
      mid.normalize().multiplyScalar(sphereRadius * lift);

      const curve = new THREE.QuadraticBezierCurve3(vFrom, mid, vTo);
      const curvePoints = curve.getPoints(40);
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

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x86EFAC, 0.9);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Initial globe tilt
    globeGroup.rotation.x = 0.22;
    globeGroup.rotation.y = 0.45;

    // --- Interactive Drag & Mouse Tracking ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.22;
    let targetRotationY = 0.45;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

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

        targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));

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

    // Touch support
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
        targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));

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
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous ambient rotation when not dragging
      if (!isDragging) {
        targetRotationY += 0.0035;
      }

      // Smooth interpolation (lerp)
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.06;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.06;

      // Pulse glow ring on pedestal
      glowRing.scale.setScalar(1 + Math.sin(time * 2.5) * 0.04);

      // Subtle float
      globeGroup.position.y = 0.2 + Math.sin(time * 1.5) * 0.035;

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
