"use client";

import { useState } from "react";

interface ItemData {
  id: string;
  name: string;
  brandColor: string;
  outlineIcon: React.ReactNode;
  colorIcon: React.ReactNode;
}

// ────────────────────────────────────────────────────────────
// High-resolution SVG Brand Definitions matching Target UI
// ────────────────────────────────────────────────────────────

// Column 1: Frameworks (6 items: 2 rows of 3)
const FRAMEWORKS_ROW_1: ItemData[] = [
  {
    id: "nextjs",
    name: "Next.js",
    brandColor: "#ffffff",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8.5 7.5v9M8.5 8.5l7 8.5M15.5 7.5v5" strokeLinecap="round" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <circle cx="12" cy="12" r="9.5" fill="#ffffff" />
        <path d="M8.5 7.5v9M8.5 8.5l7 8.5M15.5 7.5v5" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "react",
    name: "React",
    brandColor: "#61dafb",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.3" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#61dafb" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="#61dafb" />
      </svg>
    ),
  },
  {
    id: "expo",
    name: "Expo",
    brandColor: "#818cf8",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5L12 4.5l8 15M8 19.5l4-7.5 4 7.5" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5L12 4.5l8 15M8 19.5l4-7.5 4 7.5" />
      </svg>
    ),
  },
];

const FRAMEWORKS_ROW_2: ItemData[] = [
  {
    id: "tanstack",
    name: "TanStack",
    brandColor: "#f59e0b",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
        <line x1="6" y1="16.5" x2="12" y2="12" />
        <line x1="18" y1="16.5" x2="12" y2="12" />
        <line x1="8.5" y1="7.5" x2="12" y2="12" />
        <line x1="15.5" y1="7.5" x2="12" y2="12" />
        <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
        <circle cx="6" cy="16.5" r="2" />
        <circle cx="18" cy="16.5" r="2" />
        <circle cx="12" cy="12" r="2.2" />
        <circle cx="8.5" cy="7.5" r="1.8" />
        <circle cx="15.5" cy="7.5" r="1.8" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#f59e0b" strokeWidth="1.3">
        <line x1="6" y1="16.5" x2="12" y2="12" />
        <line x1="18" y1="16.5" x2="12" y2="12" />
        <line x1="8.5" y1="7.5" x2="12" y2="12" />
        <line x1="15.5" y1="7.5" x2="12" y2="12" />
        <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
        <circle cx="6" cy="16.5" r="2" fill="#ef4444" stroke="#ef4444" />
        <circle cx="18" cy="16.5" r="2" fill="#f59e0b" stroke="#f59e0b" />
        <circle cx="12" cy="12" r="2.2" fill="#10b981" stroke="#10b981" />
        <circle cx="8.5" cy="7.5" r="1.8" fill="#3b82f6" stroke="#3b82f6" />
        <circle cx="15.5" cy="7.5" r="1.8" fill="#8b5cf6" stroke="#8b5cf6" />
      </svg>
    ),
  },
  {
    id: "redwoodjs",
    name: "RedwoodJS",
    brandColor: "#bf4722",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="16" cy="8.5" r="1.8" />
        <path d="M10 16c.8-2 1.2-4 1-6" strokeLinecap="round" />
        <path d="M11 10c-1.5-1.5-3.5-1-4 0" strokeLinecap="round" />
        <path d="M11 10c1-2 3-1.8 3.8-.5" strokeLinecap="round" />
        <path d="M11 10c0-2-1.8-3-3-2.5" strokeLinecap="round" />
        <path d="M5 16.5c3-1.5 7-1.2 14 .5" />
        <path d="M5.5 18.5c2.5-.8 5-.8 7.5 0s4.5.8 5.5 0" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#bf4722" strokeWidth="1.3">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="16" cy="8.5" r="1.8" fill="#f59e0b" stroke="#f59e0b" />
        <path d="M10 16c.8-2 1.2-4 1-6" strokeLinecap="round" />
        <path d="M11 10c-1.5-1.5-3.5-1-4 0" stroke="#10b981" strokeLinecap="round" />
        <path d="M11 10c1-2 3-1.8 3.8-.5" stroke="#10b981" strokeLinecap="round" />
        <path d="M11 10c0-2-1.8-3-3-2.5" stroke="#10b981" strokeLinecap="round" />
        <path d="M5 16.5c3-1.5 7-1.2 14 .5" stroke="#bf4722" />
        <path d="M5.5 18.5c2.5-.8 5-.8 7.5 0s4.5.8 5.5 0" stroke="#38bdf8" />
      </svg>
    ),
  },
  {
    id: "astro",
    name: "Astro",
    brandColor: "#ff5d01",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3">
        <path d="M8 18c-.8-1.2-1.5-3-1.5-5.5 0-3.5 2-7.5 5.5-10 3.5 2.5 5.5 6.5 5.5 10 0 2.5-.7 4.3-1.5 5.5" />
        <path d="M8.5 15h7" />
        <path d="M12 18c-.8 1.2-.5 2.3 0 3.2.5-.9 1.2-2 0-3.2z" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#ff5d01" strokeWidth="1.4">
        <path d="M8 18c-.8-1.2-1.5-3-1.5-5.5 0-3.5 2-7.5 5.5-10 3.5 2.5 5.5 6.5 5.5 10 0 2.5-.7 4.3-1.5 5.5" />
        <path d="M8.5 15h7" stroke="#ffffff" />
        <path d="M12 18c-.8 1.2-.5 2.3 0 3.2.5-.9 1.2-2 0-3.2z" fill="#ff5d01" />
      </svg>
    ),
  },
];

// Column 2: Integrations (Row 1 has 3 items, Row 2 is empty)
const INTEGRATIONS_ROW_1: ItemData[] = [
  {
    id: "supabase",
    name: "Supabase",
    brandColor: "#3ecf8e",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M21.36 9.35H12V.31a.31.31 0 0 0-.53-.22L.12 11.41a.63.63 0 0 0 .44 1.06H12v9.04a.31.31 0 0 0 .53.22l12.35-11.31a.63.63 0 0 0-.44-1.07z" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#3ecf8e">
        <path d="M21.36 9.35H12V.31a.31.31 0 0 0-.53-.22L.12 11.41a.63.63 0 0 0 .44 1.06H12v9.04a.31.31 0 0 0 .53.22l12.35-11.31a.63.63 0 0 0-.44-1.07z" />
      </svg>
    ),
  },
  {
    id: "convex",
    name: "Convex",
    brandColor: "#ee342f",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3">
        <path d="M12 4a8 8 0 0 1 7.8 6.2l-2.4.6A5.6 5.6 0 0 0 12 6.4v-2.4z" />
        <path d="M20 12a8 8 0 0 1-6.2 7.8l-.6-2.4A5.6 5.6 0 0 0 17.6 12h2.4z" />
        <path d="M12 20a8 8 0 0 1-7.8-6.2l2.4-.6A5.6 5.6 0 0 0 12 17.6v2.4z" />
        <path d="M4 12a8 8 0 0 1 6.2-7.8l.6 2.4A5.6 5.6 0 0 0 6.4 12H4z" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#ee342f">
        <path d="M12 3.5a8.5 8.5 0 0 1 8.3 6.6l-2.7.7A5.8 5.8 0 0 0 12 6.2v-2.7z" />
        <path d="M20.5 12a8.5 8.5 0 0 1-6.6 8.3l-.7-2.7a5.8 5.8 0 0 0 4.6-5.6h2.7z" />
        <path d="M12 20.5a8.5 8.5 0 0 1-8.3-6.6l2.7-.7A5.8 5.8 0 0 0 12 17.8v2.7z" />
        <path d="M3.5 12a8.5 8.5 0 0 1 6.6-8.3l.7 2.7a5.8 5.8 0 0 0-4.6 5.6H3.5z" />
      </svg>
    ),
  },
  {
    id: "prisma",
    name: "Prisma",
    brandColor: "#16a394",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M12 3L20.5 19.5H3.5L12 3Z" />
        <path d="M12 3L10.2 19.5" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#16a394" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3L20.5 19.5H3.5L12 3Z" fill="rgba(22, 163, 148, 0.2)" />
        <path d="M12 3L10.2 19.5" stroke="#38bdf8" />
      </svg>
    ),
  },
];

const INTEGRATIONS_ROW_2: ItemData[] = [
  {
    id: "stripe",
    name: "Stripe",
    brandColor: "#635bff",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3">
        <path d="M8 8.2c0-1.4 1.2-2 3-2 2.2 0 3.8.8 4.2 1.2l.8-2C15 4.8 13.5 4.2 11 4.2c-3.2 0-5.2 1.8-5.2 4.2 0 4.2 5.5 3.5 5.5 5.5 0 1.2-1.2 1.8-2.8 1.8-2.2 0-4.2-1-4.8-1.5l-.8 2c.8.6 2.8 1.5 5.6 1.5 3.5 0 5.5-1.8 5.5-4.5 0-4.5-6-3.8-6-5z" strokeLinecap="round" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#635bff">
        <path d="M8 8.2c0-1.4 1.2-2 3-2 2.2 0 3.8.8 4.2 1.2l.8-2C15 4.8 13.5 4.2 11 4.2c-3.2 0-5.2 1.8-5.2 4.2 0 4.2 5.5 3.5 5.5 5.5 0 1.2-1.2 1.8-2.8 1.8-2.2 0-4.2-1-4.8-1.5l-.8 2c.8.6 2.8 1.5 5.6 1.5 3.5 0 5.5-1.8 5.5-4.5 0-4.5-6-3.8-6-5z" />
      </svg>
    ),
  },
  {
    id: "neon",
    name: "Neon",
    brandColor: "#00e5bf",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3">
        <rect x="5" y="5" width="14" height="14" rx="3.5" />
        <path d="M9 15V9l6 6V9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <rect x="5" y="5" width="14" height="14" rx="3.5" stroke="#00e5bf" strokeWidth="1.5" />
        <path d="M9 15V9l6 6V9" stroke="#00e5bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "firebase",
    name: "Firebase",
    brandColor: "#ffca28",
    outlineIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M4.5 18.5L8 4.5l4.2 6.5 5.8-11L4.5 18.5z" />
        <path d="M18 0l-5.8 11L8 4.5 4.5 18.5 12 23l7.5-4.5L18 0z" />
      </svg>
    ),
    colorIcon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" strokeLinejoin="round">
        <path d="M4.5 18.5L8 4.5l4.2 6.5 5.8-11L4.5 18.5z" fill="#ffa000" />
        <path d="M12 23l-7.5-4.5L12 11l7.5 7.5L12 23z" fill="#ffca28" />
        <path d="M12 11l5.8-11 1.7 18.5-7.5-7.5z" fill="#f57c00" />
      </svg>
    ),
  },
];

// ────────────────────────────────────────────────────────────
// GridCell Component with independent dot-matrix & hover animation
// ────────────────────────────────────────────────────────────
function GridCell({ item }: { item: ItemData | null }) {
  const [isHovered, setIsHovered] = useState(false);

  // Empty cell (used for Column 2 Row 2 to guarantee equal height)
  if (!item) {
    return (
      <div className="relative h-[140px] w-full border-r border-white/[0.14] pointer-events-none select-none" />
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-[140px] w-full flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden border-r border-white/[0.14] select-none transition-colors duration-200"
    >
      {/* Dot-matrix background pattern: tinted to brand color, vertical opacity mask */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-250 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `radial-gradient(${item.brandColor} 1.2px, transparent 1.2px)`,
          backgroundSize: "10px 10px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Ambient radial glow at the top of the cell */}
      <div
        className={`absolute top-0 inset-x-0 h-24 pointer-events-none transition-opacity duration-250 ease-out ${
          isHovered ? "opacity-25" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(circle at 50% 20%, ${item.brandColor}, transparent 75%)`,
        }}
      />

      {/* Centered Icon Container with crossfade from monochrome outline to color version */}
      <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-250 ease-out group-hover:scale-108 z-10">
        {/* Monochrome outline icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-250 ease-out ${
            isHovered ? "opacity-0" : "opacity-75"
          }`}
        >
          {item.outlineIcon}
        </div>

        {/* Full-color / filled brand icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-250 ease-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {item.colorIcon}
        </div>
      </div>

      {/* Reserved Label Container: prevents layout shift, fades and slides up on hover */}
      <div className="h-5 mt-2.5 flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <span
          className={`text-[12px] font-bold text-white tracking-tight transition-all duration-250 ease-out ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
          }`}
        >
          {item.name}
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────
export function FrameworksIntegrationsSection() {
  return (
    <section className="w-full bg-gradient-to-br from-[#07152F] via-[#0D2459] to-[#10251A] text-white pt-16 pb-20 select-none">
      <div className="mx-auto max-w-[1240px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ══════════════════════════════════════════════════════
              COLUMN 1 — Frameworks
              ══════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center">
            {/* Eyebrow / Kicker (Title Case, Cyan) */}
            <span className="text-[14px] font-medium text-[#7CFF00] tracking-tight text-center">
              Frameworks
            </span>

            {/* 2-line bold white heading */}
            <h2 className="mt-3 text-center text-[32px] md:text-[38px] font-bold text-white leading-[1.12] tracking-[-0.02em] max-w-[440px]">
              Build with SDKs for<br />modern frameworks
            </h2>

            {/* 2-line gray subtext */}
            <p className="mt-4 text-center text-[14px] leading-[22px] text-white/65 max-w-[440px]">
              Clerk keeps developer experience front-and-center by providing helpful SDKs for most modern frameworks on web and mobile.
            </p>

            {/* Text link with right arrow */}
            <a
              href="#frameworks"
              className="group mt-5 flex items-center gap-1.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:text-[#7CFF00] cursor-pointer"
            >
              <span>All frameworks</span>
              <span className="text-[11px] transition-transform duration-200 group-hover:translate-x-0.5 text-white/90">
                ▸
              </span>
            </a>

            {/* Sharp Hairline Grid with Top & Bottom Decorative Slivers (No rounded corners, no icons in slivers) */}
            <div className="mt-10 w-full max-w-[540px]">
              {/* Top Extension Sliver (hairline vertical lines extending up, empty) */}
              <div className="h-6 grid grid-cols-3 border-l border-white/[0.14]">
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
              </div>

              {/* Row 1 (3 cells) */}
              <div className="grid grid-cols-3 border-t border-b border-l border-white/[0.14]">
                {FRAMEWORKS_ROW_1.map((item) => (
                  <GridCell key={item.id} item={item} />
                ))}
              </div>

              {/* Row 2 (3 cells) */}
              <div className="grid grid-cols-3 border-b border-l border-white/[0.14]">
                {FRAMEWORKS_ROW_2.map((item) => (
                  <GridCell key={item.id} item={item} />
                ))}
              </div>

              {/* Bottom Extension Sliver (hairline vertical lines extending down, empty) */}
              <div className="h-6 grid grid-cols-3 border-l border-white/[0.14]">
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              COLUMN 2 — Integrations
              ══════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center">
            {/* Eyebrow / Kicker (Title Case, Purple) */}
            <span className="text-[14px] font-medium text-[#FF7A18] tracking-tight text-center">
              Integrations
            </span>

            {/* 2-line bold white heading */}
            <h2 className="mt-3 text-center text-[32px] md:text-[38px] font-bold text-white leading-[1.12] tracking-[-0.02em] max-w-[440px]">
              Integrate with<br />the tools you love
            </h2>

            {/* 2-line gray subtext */}
            <p className="mt-4 text-center text-[14px] leading-[22px] text-white/65 max-w-[440px]">
              Leverage Clerk as the source of truth for your user data and integrate with the tools that you already depend on.
            </p>

            {/* Text link with right arrow */}
            <a
              href="#integrations"
              className="group mt-5 flex items-center gap-1.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:text-[#FF7A18] cursor-pointer"
            >
              <span>All integrations</span>
              <span className="text-[11px] transition-transform duration-200 group-hover:translate-x-0.5 text-white/90">
                ▸
              </span>
            </a>

            {/* Sharp Hairline Grid: Exactly identical height as Column 1 (Row 1 has items, Row 2 is empty) */}
            <div className="mt-10 w-full max-w-[540px]">
              {/* Top Extension Sliver (hairline vertical lines extending up, empty) */}
              <div className="h-6 grid grid-cols-3 border-l border-white/[0.14]">
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
              </div>

              {/* Row 1 (3 items: Supabase, Convex, Prisma) */}
              <div className="grid grid-cols-3 border-t border-b border-l border-white/[0.14]">
                {INTEGRATIONS_ROW_1.map((item) => (
                  <GridCell key={item.id} item={item} />
                ))}
              </div>

              {/* Row 2 (3 items: Stripe, Neon, Firebase) */}
              <div className="grid grid-cols-3 border-b border-l border-white/[0.14]">
                {INTEGRATIONS_ROW_2.map((item) => (
                  <GridCell key={item.id} item={item} />
                ))}
              </div>

              {/* Bottom Extension Sliver (hairline vertical lines extending down, empty) */}
              <div className="h-6 grid grid-cols-3 border-l border-white/[0.14]">
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
                <div className="border-r border-white/[0.14]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
