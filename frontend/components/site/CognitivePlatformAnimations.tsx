"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

// High-resolution SVG path definitions matching the reference screenshots
const ICONS = {
  clerk: {
    name: "Clerk",
    viewBox: "0 0 24 24",
    path: "m21.47 20.829-2.881-2.881a.572.572 0 0 0-.7-.084 6.854 6.854 0 0 1-7.081 0 .576.576 0 0 0-.7.084l-2.881 2.881a.576.576 0 0 0-.103.69.57.57 0 0 0 .166.186 12 12 0 0 0 14.113 0 .58.58 0 0 0 .239-.423.576.576 0 0 0-.172-.453Zm.002-17.668-2.88 2.88a.569.569 0 0 1-.701.084A6.857 6.857 0 0 0 8.724 8.08a6.862 6.862 0 0 0-1.222 3.692 6.86 6.86 0 0 0 .978 3.764.573.573 0 0 1-.083.699l-2.881 2.88a.567.567 0 0 1-.864-.063A11.993 11.993 0 0 1 6.771 2.7a11.99 11.99 0 0 1 14.637-.405.566.566 0 0 1 .232.418.57.57 0 0 1-.168.448Zm-7.118 12.261a3.427 3.427 0 1 0 0-6.854 3.427 3.427 0 0 0 0 6.854Z",
  },
  claudeSpark: {
    name: "Anthropic / Claude",
    isSpark: true,
  },
  openai: {
    name: "OpenAI",
    viewBox: "0 0 24 24",
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4947zm-9.66-4.7654a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4997 4.4997 0 0 1-6.1402-2.2864zM2.3445 8.7809a4.466 4.466 0 0 1 2.3662-1.9728V12.4a.7665.7665 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.5045 4.5045 0 0 1 2.3445 8.7809zm15.5985 3.852-5.8428-3.3685 2.02-1.1683a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4947 4.4947 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.6815zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L8.4099 10.1114V7.779a.0804.0804 0 0 1 .0332-.0615l4.9343-2.8529a4.5 4.5 0 0 1 6.5786 2.9734zm-11.085-1.5714l2.02-1.1683a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4947 4.4947 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.6815zm1.505 5.5684l2.8764-1.6565 2.8764 1.6565v3.313l-2.8764 1.6565-2.8764-1.6565z",
  },
  prisma: {
    name: "Prisma",
    viewBox: "0 0 24 24",
    path: "M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z",
  },
  notion: {
    name: "Notion",
    viewBox: "0 0 24 24",
    path: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z",
  },
  planetscale: {
    name: "PlanetScale",
    viewBox: "0 0 24 24",
    path: "M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z",
  },
  dropbox: {
    name: "Dropbox",
    viewBox: "0 0 24 24",
    path: "M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z",
  },
  atlassian: {
    name: "Atlassian",
    viewBox: "0 0 24 24",
    path: "M7.12 11.084a.683.683 0 00-1.16.126L.075 22.974a.703.703 0 00.63 1.018h8.19a.678.678 0 00.63-.39c1.767-3.65.696-9.203-2.406-12.52zM11.434.386a15.515 15.515 0 00-.906 15.317l3.95 7.9a.703.703 0 00.628.388h8.19a.703.703 0 00.63-1.017L12.63.38a.664.664 0 00-1.196.006z",
  },
  github: {
    name: "GitHub",
    viewBox: "0 0 24 24",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  googlecloud: {
    name: "Google Cloud",
    viewBox: "0 0 24 24",
    path: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
  },
  supabase: {
    name: "Supabase",
    viewBox: "0 0 24 24",
    path: "M21.362 9.354H12V.312a.312.312 0 0 0-.532-.22L.116 11.41a.625.625 0 0 0 .442 1.063H12v9.043a.312.312 0 0 0 .532.22L23.884 10.417a.625.625 0 0 0-.442-1.063z",
  },
  docker: {
    name: "Docker",
    viewBox: "0 0 24 24",
    path: "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.186V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.185-.186H2.208a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m21.432.404c-.382-.24-1.748-.484-3.522.427-.478-.37-1.12-.563-1.85-.563-.448 0-.898.073-1.32.222l-.128.046c-.053-.02-.107-.04-.162-.057a6.2 6.2 0 00-1.833-.274H1.05A1.05 1.05 0 000 12.04v.328c0 1.258.423 2.454 1.192 3.372 1.343 1.6 3.666 2.428 6.905 2.463 6.945.074 11.233-3.09 12.83-8.892.833.092 1.666.012 2.378-.454.492-.323.593-.654.59-.728a.428.428 0 00-.248-.352",
  },
};

type IconKey = keyof typeof ICONS;

function IconRenderer({ iconKey, className = "w-4 h-4" }: { iconKey: IconKey; className?: string }) {
  const item = ICONS[iconKey];
  if (!item) return null;

  if ("isSpark" in item && item.isSpark) {
    // Anthropic / Claude iconic multi-ray starburst spark
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    );
  }

  const regular = item as { name: string; viewBox: string; path: string };
  return (
    <svg viewBox={regular.viewBox || "0 0 24 24"} className={className} fill="currentColor">
      <path d={regular.path} />
    </svg>
  );
}

// Card 1 pool for rotating satellite nodes
const CARD1_POOL: IconKey[] = [
  "claudeSpark",
  "openai",
  "prisma",
  "github",
  "googlecloud",
  "supabase",
  "docker",
  "notion",
];

// Card 2 distinct pools for 4 independently shuffling satellites
const CARD2_POOL_A: IconKey[] = ["notion", "github", "claudeSpark", "docker"];
const CARD2_POOL_B: IconKey[] = ["planetscale", "supabase", "prisma", "googlecloud"];
const CARD2_POOL_C: IconKey[] = ["dropbox", "openai", "notion", "github"];
const CARD2_POOL_D: IconKey[] = ["atlassian", "docker", "planetscale", "claudeSpark"];

/* ──────────────────────────────────────────────────────────
   CARD 1 — Cognitive Digital Platform
   ────────────────────────────────────────────────────────── */
function DigitalPlatformCard() {
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % CARD1_POOL.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const slot0Key = CARD1_POOL[(cycleIndex + 0) % CARD1_POOL.length];
  const slot1Key = CARD1_POOL[(cycleIndex + 1) % CARD1_POOL.length];
  const slot2Key = CARD1_POOL[(cycleIndex + 2) % CARD1_POOL.length];

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#121316] p-6 flex flex-col justify-between shadow-[0_18px_50px_rgba(0,0,0,0.25)] select-none">
      {/* Subtle radial ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_44%_56%,rgba(0,229,255,0.035),transparent_65%)] pointer-events-none" />

      {/* Top Header: bold white title + 2-line gray-400 description */}
      <div className="relative z-20">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-white">
          Cognitive Digital Platform
        </h3>
        <p className="mt-1 text-[13px] leading-[20px] text-gray-400 max-w-[400px]">
          Connect applications, data, and intelligent agents through one unified neural backbone. No complex configuration or manual API plumbing required.
        </p>
      </div>

      {/* Diagram Canvas */}
      <div className="relative w-full h-[220px] mt-1 overflow-hidden">
        {/* SVG Connector Lines and Flow Animations */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Connector from left window panel to hero node (2-segment angular elbow) */}
          <path
            d="M 12 35 L 23 35 L 30 52 L 38 52"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 12 67 L 23 67 L 30 52 L 38 52"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Hero Node to Top-Right Satellite (dim angular connector) */}
          <path
            d="M 48 52 L 58 52 L 71 25 L 81 25"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Hero Node to Bottom-Right Satellite (dim angular connector) */}
          <path
            d="M 48 52 L 58 52 L 67 82 L 73 82"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Hero Node to Middle-Right Satellite (base line) */}
          <line
            x1="48"
            y1="52"
            x2="66"
            y2="52"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Active Flowing Dotted Pulse along Middle Connector */}
          <m.line
            x1="48"
            y1="52"
            x2="66"
            y2="52"
            stroke="rgba(0, 229, 255, 0.85)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />

          {/* Flowing Pulse Dot traveling from hero toward satellite */}
          <m.circle
            r="2.5"
            fill="#00f0ff"
            filter="drop-shadow(0 0 5px rgba(0,240,255,0.9))"
            cy="52"
            animate={{ cx: [48, 66], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Off-canvas Dark Terminal/Dashboard Panel peeking from left edge */}
        <div className="absolute left-0 top-[18%] bottom-[18%] w-[68px] -translate-x-2 rounded-r-2xl border-y border-r border-white/[0.08] bg-[#1a1b22]/90 backdrop-blur-md p-3 flex flex-col justify-between shadow-2xl pointer-events-none z-10">
          <div className="flex items-center gap-1 opacity-45">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
          <div className="space-y-1.5 opacity-25">
            <div className="h-1 w-7 rounded-full bg-white" />
            <div className="h-1 w-9 rounded-full bg-white" />
            <div className="h-1 w-5 rounded-full bg-white" />
          </div>
        </div>

        {/* Hero Node Container */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
          style={{ left: "44%", top: "52%" }}
        >
          {/* Breathing/Pulsing Glow Ring behind hero node (~2.6s cycle) */}
          <m.div
            className="absolute w-24 h-24 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(0,229,255,0.4) 0%, rgba(6,182,212,0.14) 48%, transparent 72%)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.95, 0.45] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hero Node Circle */}
          <m.div
            className="relative flex items-center justify-center w-[58px] h-[58px] rounded-full bg-[#181a22] border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)]"
            animate={{ scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Center Product Emblem: Glowing Cyan 'C' */}
            <div className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.85)]">
              <IconRenderer iconKey="clerk" className="w-6 h-6" />
            </div>
          </m.div>
        </div>

        {/* 3 Satellite Nodes stacked diagonally to the right */}
        {/* Top-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "85%", top: "25%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={slot0Key}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={slot0Key} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>

        {/* Mid-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.14] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "71%", top: "52%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={slot1Key}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={slot1Key} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>

        {/* Bottom-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "77%", top: "82%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={slot2Key}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={slot2Key} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   CARD 2 — Cognitive AI Runtime
   ────────────────────────────────────────────────────────── */
function RuntimeCard() {
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);
  const [indexC, setIndexC] = useState(0);
  const [indexD, setIndexD] = useState(0);

  // Staggered independent timers for the 4 satellite nodes
  useEffect(() => {
    const timerA = setInterval(() => {
      setIndexA((prev) => (prev + 1) % CARD2_POOL_A.length);
    }, 2300);

    const timeoutB = setTimeout(() => {
      const timerB = setInterval(() => {
        setIndexB((prev) => (prev + 1) % CARD2_POOL_B.length);
      }, 2750);
      return () => clearInterval(timerB);
    }, 600);

    const timeoutC = setTimeout(() => {
      const timerC = setInterval(() => {
        setIndexC((prev) => (prev + 1) % CARD2_POOL_C.length);
      }, 2450);
      return () => clearInterval(timerC);
    }, 1200);

    const timeoutD = setTimeout(() => {
      const timerD = setInterval(() => {
        setIndexD((prev) => (prev + 1) % CARD2_POOL_D.length);
      }, 2900);
      return () => clearInterval(timerD);
    }, 1800);

    return () => {
      clearInterval(timerA);
      clearTimeout(timeoutB);
      clearTimeout(timeoutC);
      clearTimeout(timeoutD);
    };
  }, []);

  const iconA = CARD2_POOL_A[indexA];
  const iconB = CARD2_POOL_B[indexB];
  const iconC = CARD2_POOL_C[indexC];
  const iconD = CARD2_POOL_D[indexD];

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#121316] p-6 flex flex-col justify-between shadow-[0_18px_50px_rgba(0,0,0,0.25)] select-none">
      {/* Subtle radial ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.04),transparent_65%)] pointer-events-none" />

      {/* Hub-style Node Diagram at Top */}
      <div className="relative w-full h-[215px] overflow-hidden">
        {/* SVG Connector Trunk Lines & Angular Feeder Paths */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Top Trunk Lines extending slightly off-canvas left & right */}
          {/* Left Trunk branch feeding into Hero Tile */}
          <path
            d="M -5 10 L 41 10 L 46 34"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Right Trunk branch feeding into Hero Tile */}
          <path
            d="M 105 10 L 59 10 L 54 34"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Drops from Trunk into Upper-Left Satellite */}
          <path
            d="M 15 10 L 15 14"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Drops from Trunk into Lower-Left Satellite */}
          <path
            d="M 27 10 L 27 50"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Drops from Trunk into Upper-Right Satellite */}
          <path
            d="M 85 10 L 85 14"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Drops from Trunk into Lower-Right Satellite */}
          <path
            d="M 73 10 L 73 50"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Constant Downward Flowing Dotted Pulse above Hero Tile */}
          <m.line
            x1="50"
            y1="0"
            x2="50"
            y2="34"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
            animate={{ strokeDashoffset: [0, 16] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />

          {/* Incoming Pulse Dot cascading into the Hero Tile */}
          <m.circle
            r="2"
            fill="#ffffff"
            filter="drop-shadow(0 0 4px rgba(255,255,255,0.9))"
            cx="50"
            animate={{ cy: [0, 34], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Center Hero Tile: Fixed Rounded-Square with subtle constant glow */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
          style={{ left: "50%", top: "42%" }}
        >
          {/* Subtle constant ambient glow behind tile */}
          <div className="absolute w-20 h-20 rounded-2xl bg-blue-500/10 blur-xl pointer-events-none" />

          {/* Rounded-Square Tile */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-[18px] bg-[#1e2027] border border-white/[0.14] shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
            {/* Sleek Cloud / Platform Core Glyph (fixed, does not change) */}
            <div className="text-white/80">
              <IconRenderer iconKey="googlecloud" className="w-6 h-6 opacity-75" />
            </div>
          </div>
        </div>

        {/* 4 Satellite Nodes in Zig-Zag Layout */}
        {/* Upper-Left Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "15%", top: "22%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={iconA}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={iconA} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>

        {/* Lower-Left Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "27%", top: "58%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={iconB}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={iconB} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>

        {/* Upper-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "85%", top: "22%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={iconC}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={iconC} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>

        {/* Lower-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "73%", top: "58%" }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={iconD}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-white/85 flex items-center justify-center"
            >
              <IconRenderer iconKey={iconD} className="w-4 h-4" />
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Header: bold white title + 2-line gray-400 description */}
      <div className="relative z-20 mt-auto">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-white">
          Cognitive AI Runtime
        </h3>
        <p className="mt-1 text-[13px] leading-[20px] text-gray-400 max-w-[400px]">
          Add high-performance AI execution and agent orchestration to your stack in minutes. 20+ models and enterprise tools supported.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN EXPORT
   ────────────────────────────────────────────────────────── */
export function CognitivePlatformAnimations() {
  return (
    <section className="mx-auto mb-12 mt-2 w-full max-w-[1400px] px-8 md:px-16">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DigitalPlatformCard />
        <RuntimeCard />
      </div>
    </section>
  );
}
