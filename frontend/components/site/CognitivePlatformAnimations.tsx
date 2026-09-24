"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

// High-resolution SVG path definitions matching the reference screenshots
const ICONS = {
  clerk: {
    name: "Clerk",
    isClerk: true,
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
    path: "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.186V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.186.186.185m-2.928 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.185-.186H2.208a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m21.432.404c-.382-.24-1.748-.484-3.522.427-.478-.37-1.12-.563-1.85-.563-.448 0-.898.073-1.32.222l-.128.046c-.053-.02-.107-.04-.162-.057a6.2 6.2 0 00-1.833-.274H1.05A1.05 1.05 0 000 12.04v.328c0 1.258.423 2.454 1.192 3.372 1.343 1.6 3.666 2.428 6.905 2.463 6.945.074 11.233-3.09 12.83-8.892.833.092 1.666.012 2.378-.454.492-.323.593-.654.59-.728a.428.428 0 00-.248-.352",
  },
  google: {
    name: "Google",
    viewBox: "0 0 24 24",
    path: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z",
  },
  microsoft: {
    name: "Microsoft",
    viewBox: "0 0 24 24",
    path: "M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z",
  },
  slack: {
    name: "Slack",
    viewBox: "0 0 24 24",
    path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
  },
};

type IconKey = keyof typeof ICONS;

function IconRenderer({ iconKey, className = "w-4 h-4" }: { iconKey: IconKey; className?: string }) {
  const item = ICONS[iconKey];
  if (!item) return null;

  if ("isClerk" in item && item.isClerk) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none">
        <path
          d="M 23.5 10.5 A 9.5 9.5 0 1 0 23.5 21.5"
          stroke="currentColor"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.6" fill="currentColor" />
      </svg>
    );
  }

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

/**
 * True simultaneous cross-dissolve:
 * Outgoing icon (opacity 1 -> 0) and incoming icon (opacity 0 -> 1) animate concurrently
 * without mode="wait" to prevent any blank/empty frames.
 */
function CrossfadeIcon({
  iconKey,
  className = "w-4 h-4",
}: {
  iconKey: IconKey;
  className?: string;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        <m.div
          key={iconKey}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <IconRenderer iconKey={iconKey} className={`${className} text-white/85`} />
        </m.div>
      </AnimatePresence>
    </div>
  );
}

// Card 1 pool for rotating satellite nodes
// Default (idle): slot0 = github, slot1 = docker, slot2 = supabase
const CARD1_POOL: IconKey[] = [
  "github",
  "docker",
  "supabase",
  "slack",
  "prisma",
  "notion",
];

// Card 2 distinct pools for 4 independently shuffling satellites
const CARD2_POOL_A: IconKey[] = ["google", "notion", "github", "docker"];
const CARD2_POOL_B: IconKey[] = ["github", "planetscale", "supabase", "prisma"];
const CARD2_POOL_C: IconKey[] = ["atlassian", "dropbox", "openai", "notion"];
const CARD2_POOL_D: IconKey[] = ["microsoft", "docker", "planetscale", "claudeSpark"];

/* ──────────────────────────────────────────────────────────
   CARD 1 — Clerk CLI
   - IDLE by default (static diagram, calm soft glow, default icons: GitHub, Docker, Supabase)
   - HOVER ONLY: Flowing dotted pulse, moving cyan pulse dot, breathing hero glow, cycling satellite icons
   ────────────────────────────────────────────────────────── */
function ClerkCliCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [activeNode, setActiveNode] = useState(-1);

  // Rotate icons ONLY when hovered
  useEffect(() => {
    if (!isHovered) {
      setCycleIndex(0);
      setActiveNode(-1);
      return;
    }
    const timer = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % CARD1_POOL.length);
    }, 1800);
    const nodeTimer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 3);
    }, 1050);
    return () => {
      clearInterval(timer);
      clearInterval(nodeTimer);
    };
  }, [isHovered]);

  const slot0Key = CARD1_POOL[(cycleIndex + 0) % CARD1_POOL.length];
  const slot1Key = CARD1_POOL[(cycleIndex + 1) % CARD1_POOL.length];
  const slot2Key = CARD1_POOL[(cycleIndex + 2) % CARD1_POOL.length];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-[360px] w-full overflow-hidden rounded-[18px] border border-white/[0.08] bg-gradient-to-br from-[#07152F] via-[#0D2459] to-[#10251A] p-6 flex flex-col justify-between shadow-[0_18px_50px_rgba(0,0,0,0.25)] select-none transition-colors duration-500 hover:border-white/[0.14]"
    >
      {/* Subtle radial ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_44%_56%,rgba(26,108,255,0.10),transparent_65%)] pointer-events-none" />

      {/* Top Header: bold white title + 2-line gray-400 description */}
      <div className="relative z-20">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-white">
          Clerk CLI
        </h3>
        <p className="mt-1 text-[13px] leading-[20px] text-gray-400 max-w-[400px]">
          Manage your users, organizations, and authentication directly from the terminal. Streamline your development workflow with powerful CLI commands.
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
            d="M 12 42 L 28 42 L 38 52"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Hero Node to Top-Right Satellite (dim angular connector) */}
          <path
            d="M 48 52 L 58 52 L 71 25 L 77 25"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Hero Node to Bottom-Right Satellite (dim angular connector) */}
          <path
            d="M 48 52 L 58 52 L 71 82 L 77 82"
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

          {/* Active Flowing Dotted Pulse along Middle Connector (ONLY ON HOVER) */}
          {isHovered && (
            <>
              <m.line
                x1="48"
                y1="52"
                x2="66"
                y2="52"
                stroke="rgba(0, 229, 255, 0.85)"
                strokeWidth="1"
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
                animate={{ strokeDashoffset: [14, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <m.ellipse
                rx="0.8"
                ry="1.5"
                fill="#ffffff"
                filter="drop-shadow(0 0 4px rgba(255,255,255,0.9))"
                cy="52"
                animate={{ cx: [48, 66], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
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
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 transition-[left,top] duration-700 ease-in-out"
          style={{
            left: activeNode === 0 ? "81%" : activeNode === 1 ? "71%" : activeNode === 2 ? "81%" : "44%",
            top: activeNode === 0 ? "25%" : activeNode === 1 ? "52%" : activeNode === 2 ? "82%" : "52%",
          }}
        >
          {/* Breathing/Pulsing Glow Ring behind hero node (ONLY active on HOVER) */}
          <m.div
            className="absolute w-24 h-24 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(0,229,255,0.4) 0%, rgba(6,182,212,0.14) 48%, transparent 72%)",
            }}
            animate={
              isHovered
                ? { scale: [1, 1.2, 1], opacity: [0.45, 0.95, 0.45] }
                : { scale: 1, opacity: 0.3 }
            }
            transition={
              isHovered
                ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />

          {/* Hero Node Circle */}
          <m.div
            className="relative flex items-center justify-center w-[58px] h-[58px] rounded-full bg-[#181a22] border border-[#1A6CFF]/50 shadow-[0_0_30px_rgba(26,108,255,0.35)]"
            animate={isHovered ? { scale: [0.97, 1.03, 0.97] } : { scale: 1 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Center Product Emblem: Glowing Cyan 'C' */}
            <div className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.85)]">
              <IconRenderer iconKey="clerk" className="w-6 h-6" />
            </div>
          </m.div>
        </div>

        {/* 3 Satellite Nodes stacked diagonally to the right */}
        {/* Top-Right Satellite (default: Docker) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "81%", top: "25%" }}
        >
          <CrossfadeIcon iconKey={slot0Key} />
        </div>

        {/* Mid-Right Satellite (default: Notion) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.14] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "71%", top: "52%" }}
        >
          <CrossfadeIcon iconKey={slot1Key} />
        </div>

        {/* Bottom-Right Satellite (default: Claude Spark / Starburst) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "81%", top: "82%" }}
        >
          <CrossfadeIcon iconKey={slot2Key} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   CARD 2 — Cognitive AI Runtime
   - Exact visual reproduction of the user's reference diagram
   - IDLE by default (static lines, fixed default icons)
   - HOVER ONLY: Cascading downward pulse line into hero tile, independent satellite icon cycling
   ────────────────────────────────────────────────────────── */
function RuntimeCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);
  const [indexC, setIndexC] = useState(0);
  const [indexD, setIndexD] = useState(0);

  // Staggered independent timers for the 4 satellite nodes ONLY when hovered
  useEffect(() => {
    if (!isHovered) {
      setIndexA(0);
      setIndexB(0);
      setIndexC(0);
      setIndexD(0);
      return;
    }

    const timerA = setInterval(() => {
      setIndexA((prev) => (prev + 1) % CARD2_POOL_A.length);
    }, 2300);

    let timerB: NodeJS.Timeout | undefined;
    let timerC: NodeJS.Timeout | undefined;
    let timerD: NodeJS.Timeout | undefined;

    const timeoutB = setTimeout(() => {
      timerB = setInterval(() => {
        setIndexB((prev) => (prev + 1) % CARD2_POOL_B.length);
      }, 2750);
    }, 600);

    const timeoutC = setTimeout(() => {
      timerC = setInterval(() => {
        setIndexC((prev) => (prev + 1) % CARD2_POOL_C.length);
      }, 2450);
    }, 1200);

    const timeoutD = setTimeout(() => {
      timerD = setInterval(() => {
        setIndexD((prev) => (prev + 1) % CARD2_POOL_D.length);
      }, 2900);
    }, 1800);

    return () => {
      clearInterval(timerA);
      clearTimeout(timeoutB);
      clearTimeout(timeoutC);
      clearTimeout(timeoutD);
      clearInterval(timerB);
      clearInterval(timerC);
      clearInterval(timerD);
    };
  }, [isHovered]);

  const iconA = CARD2_POOL_A[indexA];
  const iconB = CARD2_POOL_B[indexB];
  const iconC = CARD2_POOL_C[indexC];
  const iconD = CARD2_POOL_D[indexD];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-[360px] w-full overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#121316] p-6 flex flex-col justify-between shadow-[0_18px_50px_rgba(0,0,0,0.25)] select-none transition-colors duration-500 hover:border-white/[0.14]"
    >
      {/* Subtle radial ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(64,246,0,0.07),transparent_65%)] pointer-events-none" />

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

          {/* Constant Downward Flowing Dotted Pulse above Hero Tile (ONLY ON HOVER) */}
          {isHovered && (
            <>
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
              <m.circle
                r="2"
                fill="#7CFF00"
                filter="drop-shadow(0 0 6px rgba(124,255,0,0.95))"
                cx="50"
                animate={{ cy: [0, 34], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </svg>

        {/* Center Hero Tile: Fixed Rounded-Square with subtle constant glow */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
          style={{ left: "50%", top: "42%" }}
        >
          {/* Subtle ambient glow behind tile */}
          <div className="absolute w-20 h-20 rounded-2xl bg-[#40F600]/10 blur-xl pointer-events-none" />

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
          <CrossfadeIcon iconKey={iconA} />
        </div>

        {/* Lower-Left Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "27%", top: "58%" }}
        >
          <CrossfadeIcon iconKey={iconB} />
        </div>

        {/* Upper-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "85%", top: "22%" }}
        >
          <CrossfadeIcon iconKey={iconC} />
        </div>

        {/* Lower-Right Satellite */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#202127] border border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.35)] z-20 overflow-hidden"
          style={{ left: "73%", top: "58%" }}
        >
          <CrossfadeIcon iconKey={iconD} />
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
    <section className="mx-auto mb-12 mt-2 w-full max-w-[1400px] px-8 md:px-16 select-none">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ClerkCliCard />
        <RuntimeCard />
      </div>
    </section>
  );
}
