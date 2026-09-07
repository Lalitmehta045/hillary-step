"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./AiEngineCard.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Grid Node definitions in a unified 240x130 coordinate space.
 * Every coordinate is mathematically aligned to the 30° isometric projection.
 * Center is at (120, 65).
 * Step along axes: dx = 38, dy = 22 (tan 30° ≈ 22/38 ≈ 0.578).
 */
const NODES = {
  center: { x: 120, y: 65, id: "center" },
  top: { x: 120, y: 21, id: "top" },
  bottom: { x: 120, y: 109, id: "bottom" },
  topLeft: { x: 82, y: 43, id: "topLeft" },
  topRight: { x: 158, y: 43, id: "topRight" },
  bottomLeft: { x: 82, y: 87, id: "bottomLeft" },
  bottomRight: { x: 158, y: 87, id: "bottomRight" },
  left: { x: 44, y: 65, id: "left" },
  right: { x: 196, y: 65, id: "right" },
} as const;

type NodeKey = keyof typeof NODES;

interface PatternNode {
  node: NodeKey;
  size: "small" | "large";
}

interface PatternConfig {
  name: string;
  cubes: PatternNode[];
  activeLines: [NodeKey, NodeKey][];
}

const PATTERNS: PatternConfig[] = [
  // Pattern 1: Core AI Synthesis (Large central processor with balanced diagonal nodes)
  {
    name: "AI Matching Core",
    cubes: [
      { node: "center", size: "large" },
      { node: "topLeft", size: "small" },
      { node: "topRight", size: "small" },
    ],
    activeLines: [
      ["topLeft", "center"],
      ["topRight", "center"],
    ],
  },

  // Pattern 2: Global Sourcing Triangulation (Equilateral isometric triangle)
  {
    name: "Predictive Sourcing",
    cubes: [
      { node: "top", size: "small" },
      { node: "bottomLeft", size: "small" },
      { node: "bottomRight", size: "large" },
    ],
    activeLines: [
      ["top", "bottomLeft"],
      ["bottomLeft", "bottomRight"],
      ["bottomRight", "top"],
    ],
  },

  // Pattern 3: Cognitive Multi-Vector Grid (Distributed intelligence)
  {
    name: "Smart Shortlisting",
    cubes: [
      { node: "center", size: "large" },
      { node: "topLeft", size: "small" },
      { node: "bottomRight", size: "small" },
      { node: "bottomLeft", size: "small" },
    ],
    activeLines: [
      ["topLeft", "center"],
      ["center", "bottomRight"],
      ["bottomLeft", "center"],
    ],
  },

  // Pattern 4: Linear Alignment & Precision Ranking
  {
    name: "Outcome Verification",
    cubes: [
      { node: "topLeft", size: "small" },
      { node: "center", size: "large" },
      { node: "bottomRight", size: "small" },
    ],
    activeLines: [
      ["topLeft", "center"],
      ["center", "bottomRight"],
    ],
  },
];

/**
 * Generates exact SVG polygon points for an isometric cube sitting at ground point (cx, cy).
 */
function getCubePoints(cx: number, cy: number, size: "small" | "large") {
  if (size === "large") {
    const rx = 20; // half width of base
    const ry = 11.6; // half height of base (ry / rx ≈ 0.58)
    const h = 24; // vertical extrusion height
    return {
      shadow: `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`,
      top: `${cx},${cy - h - ry} ${cx + rx},${cy - h} ${cx},${cy - h + ry} ${cx - rx},${cy - h}`,
      left: `${cx - rx},${cy - h} ${cx},${cy - h + ry} ${cx},${cy + ry} ${cx - rx},${cy}`,
      right: `${cx},${cy - h + ry} ${cx + rx},${cy - h} ${cx + rx},${cy} ${cx},${cy + ry}`,
      cx,
      cy,
    };
  } else {
    const rx = 15;
    const ry = 8.7;
    const h = 18;
    return {
      shadow: `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`,
      top: `${cx},${cy - h - ry} ${cx + rx},${cy - h} ${cx},${cy - h + ry} ${cx - rx},${cy - h}`,
      left: `${cx - rx},${cy - h} ${cx},${cy - h + ry} ${cx},${cy + ry} ${cx - rx},${cy}`,
      right: `${cx},${cy - h + ry} ${cx + rx},${cy - h} ${cx + rx},${cy} ${cx},${cy + ry}`,
      cx,
      cy,
    };
  }
}

/**
 * Master SVG-native AI Engine Visualization
 * Mathematically locked to the isometric grid floor with real ground shadows and glowing connection pulses.
 */
export function AiEngineVisual({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [patternIndex, setPatternIndex] = useState(0);

  // References to animate elements smoothly with GSAP
  const cubesGroupRef = useRef<SVGGElement>(null);
  const shadowsGroupRef = useRef<SVGGElement>(null);
  const linesGroupRef = useRef<SVGGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const ctx = gsap.context(() => {
      // Animate cubes entrance
      const cubes = cubesGroupRef.current?.querySelectorAll(".iso-cube-group");
      const shadows = shadowsGroupRef.current?.querySelectorAll(".iso-shadow");
      const pulseLines = linesGroupRef.current?.querySelectorAll(".iso-pulse-line");

      if (cubes && cubes.length > 0) {
        gsap.fromTo(
          cubes,
          {
            opacity: 0,
            y: -8,
            scale: 0.75,
            transformOrigin: "50% 100%",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.12,
            ease: "power2.out",
          }
        );
      }

      if (shadows && shadows.length > 0) {
        gsap.fromTo(
          shadows,
          {
            opacity: 0,
            scale: 0.4,
            transformOrigin: "50% 50%",
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.12,
            ease: "power2.out",
          }
        );
      }

      if (pulseLines && pulseLines.length > 0) {
        gsap.fromTo(
          pulseLines,
          { strokeDashoffset: 100, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.25, ease: "power2.out" }
        );
      }

      // Schedule next pattern transition after comfortable hold (~3.7s total cycle)
      timer = setTimeout(() => {
        if (!isMounted) return;

        // Smooth exit animation
        if (cubes && cubes.length > 0) {
          gsap.to(cubes, {
            opacity: 0,
            y: -5,
            scale: 0.8,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.inOut",
          });
        }

        if (shadows && shadows.length > 0) {
          gsap.to(shadows, {
            opacity: 0,
            scale: 0.3,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.inOut",
          });
        }

        if (pulseLines && pulseLines.length > 0) {
          gsap.to(pulseLines, {
            opacity: 0,
            duration: 0.65,
            ease: "power2.inOut",
            onComplete: () => {
              if (!isMounted) return;
              setPatternIndex((prev) => (prev + 1) % PATTERNS.length);
            },
          });
        } else {
          setTimeout(() => {
            if (!isMounted) return;
            setPatternIndex((prev) => (prev + 1) % PATTERNS.length);
          }, 450);
        }
      }, 3500);
    }, container);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      ctx.revert();
    };
  }, [patternIndex]);

  const activePattern = PATTERNS[patternIndex];

  // Pre-calculate active nodes for quick styling
  const activeNodeKeys = new Set(activePattern.cubes.map((c) => c.node));

  return (
    <div ref={containerRef} className={`ai-visual ${className}`}>
      <svg
        className="ai-master-svg"
        viewBox="0 -32 240 162"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle glow filter for active pulse lines */}
          <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================ */}
        {/* 1. ISOMETRIC FLOOR PLANE                                     */}
        {/* ============================================================ */}
        {/* Outer Isometric Diamond Floor Boundary */}
        <polygon
          points="120,15 206,65 120,115 34,65"
          fill="#F7FAF8"
          stroke="#D6E2DB"
          strokeWidth="1.2"
        />

        {/* Primary Floor Grid Lines */}
        {/* Vertical Center Axis */}
        <line
          x1="120"
          y1="15"
          x2="120"
          y2="115"
          stroke="#E2EAE5"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        {/* Horizontal Center Axis */}
        <line
          x1="34"
          y1="65"
          x2="206"
          y2="65"
          stroke="#E2EAE5"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Diagonal 1: Top-Left to Bottom-Right */}
        <line
          x1="44"
          y1="21"
          x2="196"
          y2="109"
          stroke="#E2EAE5"
          strokeWidth="1"
        />
        {/* Diagonal 2: Top-Right to Bottom-Left */}
        <line
          x1="196"
          y1="21"
          x2="44"
          y2="109"
          stroke="#E2EAE5"
          strokeWidth="1"
        />

        {/* Sub-grid Inner Isometric Diamond */}
        <polygon
          points="120,37 166,65 120,93 74,65"
          fill="none"
          stroke="#E5ECE7"
          strokeWidth="0.8"
        />

        {/* ============================================================ */}
        {/* 2. ACTIVE GLOWING PULSE LINES                                */}
        {/* ============================================================ */}
        <g ref={linesGroupRef} className="iso-lines-group">
          {activePattern.activeLines.map(([n1, n2], idx) => {
            const p1 = NODES[n1];
            const p2 = NODES[n2];
            return (
              <line
                key={`line-${patternIndex}-${idx}`}
                className="iso-pulse-line"
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#10B981"
                strokeWidth="1.6"
                strokeLinecap="round"
                filter="url(#emerald-glow)"
              />
            );
          })}
        </g>

        {/* ============================================================ */}
        {/* 3. GRID INTERSECTION NODE DOTS                              */}
        {/* ============================================================ */}
        <g className="iso-nodes-group">
          {(Object.keys(NODES) as NodeKey[]).map((key) => {
            const node = NODES[key];
            const isActive = activeNodeKeys.has(key);
            return (
              <g key={key}>
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
                    fill="#10B981"
                    opacity="0.25"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? "2.2" : "1.6"}
                  fill={isActive ? "#10B981" : "#CBD5E1"}
                  style={{ transition: "all 0.3s ease" }}
                />
              </g>
            );
          })}
        </g>

        {/* ============================================================ */}
        {/* 4. REALISTIC GROUND SHADOWS                                 */}
        {/* ============================================================ */}
        <g ref={shadowsGroupRef} className="iso-shadows-group">
          {activePattern.cubes.map(({ node, size }) => {
            const { x, y } = NODES[node];
            const pts = getCubePoints(x, y, size);
            return (
              <g key={`shadow-${node}-${size}`} className="iso-shadow">
                {/* Soft diffuse ambient shadow */}
                <polygon
                  points={pts.shadow}
                  fill="#059669"
                  opacity="0.14"
                />
                {/* Contact shadow right under cube base */}
                <polygon
                  points={pts.shadow}
                  fill="#047857"
                  opacity="0.16"
                  transform={`scale(0.85) translate(${x * 0.176}, ${y * 0.176})`}
                />
              </g>
            );
          })}
        </g>

        {/* ============================================================ */}
        {/* 5. 3D ISOMETRIC CUBES (SORTED BY DEPTH)                      */}
        {/* ============================================================ */}
        <g ref={cubesGroupRef} className="iso-cubes-group">
          {/* Sort cubes by Y coordinate so back cubes render behind front cubes */}
          {[...activePattern.cubes]
            .sort((a, b) => NODES[a.node].y - NODES[b.node].y)
            .map(({ node, size }) => {
              const { x, y } = NODES[node];
              const pts = getCubePoints(x, y, size);
              return (
                <g
                  key={`cube-${node}-${size}`}
                  className={`iso-cube-group iso-cube-${size}`}
                >
                  {/* Left Face */}
                  <polygon
                    className="cube-left"
                    points={pts.left}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="0.6"
                    strokeLinejoin="round"
                  />
                  {/* Right Face */}
                  <polygon
                    className="cube-right"
                    points={pts.right}
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeWidth="0.6"
                    strokeLinejoin="round"
                  />
                  {/* Top Face */}
                  <polygon
                    className="cube-top"
                    points={pts.top}
                    stroke="rgba(255, 255, 255, 0.7)"
                    strokeWidth="0.75"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
        </g>
      </svg>
    </div>
  );
}

interface AiEngineCardProps {
  title?: string;
  description?: string;
  tags?: string[];
  className?: string;
}

export function AiEngineCard({
  title = "Tech Asset Pool & AI Engine",
  description = "Our proprietary AI engine scans millions of data points across global talent pools to predict the best-fit candidates with higher accuracy and speed.",
  tags = ["AI Matching", "Predictive Sourcing", "Smart Shortlisting"],
  className = "",
}: AiEngineCardProps) {
  return (
    <div className={`ai-card-wrapper ${className}`}>
      <div className="ai-card">
        {/* HEADER */}
        <div className="ai-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {/* TAGS */}
        {tags && tags.length > 0 && (
          <div className="ai-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        {/* VISUALIZATION */}
        <AiEngineVisual />
      </div>
    </div>
  );
}

export default AiEngineCard;
