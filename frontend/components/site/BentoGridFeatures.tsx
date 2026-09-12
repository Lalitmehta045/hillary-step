"use client";

import React, { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaPlus,
  FaGear,
  FaEnvelope,
} from "react-icons/fa6";

// Roles for Card 1 continuous scrolling ticker
const ROLES = [
  "Product Member",
  "Administrator",
  "Editor",
  "QA Tester",
  "Owner",
  "Engineer",
  "Marketing",
  "Human Resources",
  "DevOps",
  "Security Analyst",
];

// Quadrupled list to allow endless seamless scrolling
const EXTENDED_ROLES = [...ROLES, ...ROLES, ...ROLES, ...ROLES];

// 4 photo avatars with background gradient styling matching the screenshot
const PHOTO_TILES = [
  {
    id: "top-mid",
    gridPos: "col-start-2 row-start-1",
    img: "/assets/bento/card1-top.jpg",
    alt: "Product Member",
    gradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/20",
  },
  {
    id: "mid-left",
    gridPos: "col-start-1 row-start-2",
    img: "/assets/bento/card1-left.jpg",
    alt: "Administrator",
    gradient: "from-amber-400/15 via-orange-300/10 to-yellow-200/20",
  },
  {
    id: "mid-right",
    gridPos: "col-start-3 row-start-2",
    img: "/assets/bento/card1-right.jpg",
    alt: "Editor",
    gradient: "from-rose-400/15 via-pink-300/15 to-purple-300/20",
  },
  {
    id: "bot-mid",
    gridPos: "col-start-2 row-start-3",
    img: "/assets/bento/card1-bottom.jpg",
    alt: "Owner",
    gradient: "from-amber-500/20 via-yellow-400/15 to-amber-200/20",
  },
];

// 5 empty placeholder tiles
const PLACEHOLDER_TILES = [
  { id: "p-0-0", gridPos: "col-start-1 row-start-1" },
  { id: "p-0-2", gridPos: "col-start-3 row-start-1" },
  { id: "p-1-1", gridPos: "col-start-2 row-start-2" },
  { id: "p-2-0", gridPos: "col-start-1 row-start-3" },
  { id: "p-2-2", gridPos: "col-start-3 row-start-3" },
];

export function BentoGridFeatures() {
  // Global step counter for perfectly synchronized pulse across all cards
  const [step, setStep] = useState<number>(0);

  // Card 3 focus / blur reveal cycle
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Synchronized pulse timer for Card 1 and Card 2 (every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Active indices derived from step
  const activeRoleIndex = step % ROLES.length;
  // Offset in extended array to ensure continuous forward motion
  const currentItemIndex = ROLES.length + activeRoleIndex;
  const activePhotoIdx = step % PHOTO_TILES.length;
  const activeAutoJoinAvatar = step % 3;

  // Card 3 Blur / Focus reveal loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const loopFocus = () => {
      setIsFocused(true);
      timeoutId = setTimeout(() => {
        setIsFocused(false);
      }, 1800);
    };

    const intervalId = setInterval(loopFocus, 4200);
    // Initial trigger after 1.2s
    const initialTimer = setTimeout(loopFocus, 1200);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#F5F5F6] py-14 px-4 sm:px-8 lg:px-14 border-t border-gray-200/70 font-display">
      <div className="max-w-[1240px] mx-auto">
        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* ============================================================ */}
          {/* COLUMN 1: CUSTOM ROLES & PERMISSIONS                         */}
          {/* ============================================================ */}
          <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-7 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden min-h-[520px]">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[17.5px] sm:text-[18px] font-bold text-[#111827] tracking-tight">
                Custom roles and permissions
              </h3>
              <p className="text-[13.5px] sm:text-[14px] text-[#64748B] leading-[1.5] max-w-[320px]">
                Powerful primitives to fully customize your app&apos;s authorization story.
              </p>
            </div>

            {/* 3x3 Tile Grid Visual */}
            <div className="my-auto py-5 flex items-center justify-center">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 w-fit relative p-3">
                {/* 5 Placeholder Tiles */}
                {PLACEHOLDER_TILES.map((tile) => (
                  <div
                    key={tile.id}
                    className={`${tile.gridPos} w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-[18px] bg-[#F7F8FA] border border-black/[0.04] transition-all`}
                  />
                ))}

                {/* 4 Photo Tiles */}
                {PHOTO_TILES.map((photo, idx) => {
                  const isActive = activePhotoIdx === idx;
                  return (
                    <div
                      key={photo.id}
                      className={`${photo.gridPos} relative w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-[18px] transition-all duration-300 ${
                        isActive
                          ? "z-20 scale-[1.06]"
                          : "z-10 scale-100 opacity-90"
                      }`}
                    >
                      {/* Active Ring & Elevation Glow */}
                      <AnimatePresence>
                        {isActive && (
                          <m.div
                            layoutId="activeAvatarRing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute -inset-[3px] rounded-[21px] ring-[3px] ring-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] pointer-events-none"
                          />
                        )}
                      </AnimatePresence>

                      <div
                        className={`w-full h-full rounded-[18px] overflow-hidden relative border ${
                          isActive ? "border-white" : "border-gray-200/70"
                        } bg-gradient-to-br ${photo.gradient}`}
                      >
                        <img
                          src={photo.img}
                          alt={photo.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Role Ticker (Centering the active role continuously in the middle) */}
            <div className="relative w-full pt-3 overflow-hidden border-t border-gray-100">
              {/* Fade Edges for Marquee */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

              <div className="relative h-[44px] overflow-hidden w-full">
                <div
                  className="absolute top-1/2 -translate-y-1/2 flex items-center transition-transform duration-500 ease-out"
                  style={{
                    left: "50%",
                    transform: `translateX(-${currentItemIndex * 140 + 70}px)`,
                  }}
                >
                  {EXTENDED_ROLES.map((role, idx) => {
                    const isActive = idx === currentItemIndex;
                    return (
                      <div
                        key={`${role}-${idx}`}
                        className="shrink-0 flex items-center justify-center"
                        style={{ width: "140px" }}
                      >
                        <span
                          className={`inline-block px-3.5 py-1.5 rounded-full text-[13px] text-center transition-all duration-300 ${
                            isActive
                              ? "bg-white border border-gray-200/90 text-[#111827] font-semibold shadow-xs scale-100"
                              : "text-[#9CA3AF] font-medium scale-95"
                          }`}
                        >
                          {role}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* COLUMN 2: SPLIT STACK (CARD 2A: AUTO-JOIN & 2B: INVITATIONS) */}
          {/* ============================================================ */}
          <div className="flex flex-col gap-6">
            {/* CARD 2A — AUTO-JOIN */}
            <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-7 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex-1 min-h-[250px]">
              {/* Top Visual Area: Radar Ripple + 3 Avatars + Connector Lines */}
              <div className="relative w-full h-[120px] flex flex-col items-center justify-start pt-1">
                {/* Sonar / Radar Pulse Rings */}
                <div className="absolute top-[28px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                  <div className="absolute -inset-10 rounded-full border border-gray-200/50 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
                  <div className="absolute -inset-16 rounded-full border border-gray-200/40 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite] [animation-delay:1.1s] opacity-25" />
                  <div className="absolute -inset-24 rounded-full border border-gray-200/30 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite] [animation-delay:2.2s] opacity-20" />
                </div>

                {/* 3 Circular Avatars */}
                <div className="relative z-10 flex items-center justify-center gap-10">
                  {[
                    { id: "aj-1", img: "/assets/bento/card2-1.jpg" },
                    { id: "aj-2", img: "/assets/bento/card2-2.jpg" },
                    { id: "aj-3", img: "/assets/bento/card2-3.jpg" },
                  ].map((av, idx) => {
                    const isActive = activeAutoJoinAvatar === idx;
                    return (
                      <div
                        key={av.id}
                        className={`relative rounded-full transition-all duration-300 ${
                          isActive ? "scale-110 z-10" : "scale-100 opacity-80"
                        }`}
                      >
                        {isActive && (
                          <m.div
                            layoutId="autoJoinAvatarRing"
                            className="absolute -inset-1 rounded-full ring-2 ring-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <img
                          src={av.img}
                          alt="Team member"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Converging SVG Curved Connector Lines */}
                <div className="relative w-[240px] h-[36px] -mt-1">
                  <svg
                    viewBox="0 0 240 36"
                    className="w-full h-full overflow-visible"
                    fill="none"
                  >
                    {/* Left avatar curve */}
                    <path
                      d="M 58 0 C 58 20, 120 18, 120 36"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* Center avatar straight line */}
                    <path
                      d="M 120 0 L 120 36"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* Right avatar curve */}
                    <path
                      d="M 182 0 C 182 20, 120 18, 120 36"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* + Auto-join Pill Button with Ambient Glow */}
                <div className="relative z-10 -mt-0.5">
                  <div className="absolute inset-0 bg-indigo-500/15 rounded-full blur-md" />
                  <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200/90 shadow-xs text-[12.5px] font-semibold text-[#111827]">
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-600 font-bold">
                      +
                    </span>
                    <span>Auto-join</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="flex flex-col gap-1.5 pt-4">
                <h4 className="text-[16.5px] sm:text-[17px] font-bold text-[#111827]">
                  Auto-join
                </h4>
                <p className="text-[13.5px] text-[#64748B] leading-[1.5]">
                  Let your users discover and join organizations based on their email domain.
                </p>
              </div>
            </div>

            {/* CARD 2B — INVITATIONS */}
            <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-7 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex-1 min-h-[250px]">
              {/* Upper Area: Signal Path with Traveling Pulse Dot & Dark Button */}
              <div className="relative w-full h-[100px] flex items-center justify-center">
                {/* Curved SVG Signal Path */}
                <svg
                  viewBox="0 0 280 80"
                  className="absolute inset-0 w-full h-full overflow-visible"
                  fill="none"
                >
                  <defs>
                    <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22C55E" floodOpacity="0.8" />
                    </filter>
                  </defs>

                  {/* Main Connector Path */}
                  <path
                    id="invitationPath"
                    d="M 10 15 C 60 15, 60 40, 95 40 L 185 40 C 220 40, 220 70, 270 70"
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  {/* Traveling Pulse Dot along Path */}
                  <circle r="3.5" fill="#22C55E" filter="url(#dot-glow)">
                    <animateMotion
                      path="M 10 15 C 60 15, 60 40, 95 40 L 185 40 C 220 40, 220 70, 270 70"
                      dur="3.2s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                </svg>

                {/* Dark Pill Button */}
                <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181B] text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:bg-black transition-colors cursor-default">
                  <div className="w-4 h-4 rounded-[4px] border border-white/30 flex items-center justify-center bg-white/10 text-[9px]">
                    <FaEnvelope className="text-[9px] text-white" />
                  </div>
                  <span className="text-[13px] font-medium tracking-tight">
                    Invite this person
                  </span>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="flex flex-col gap-1.5 pt-4">
                <h4 className="text-[16.5px] sm:text-[17px] font-bold text-[#111827]">
                  Invitations
                </h4>
                <p className="text-[13.5px] text-[#64748B] leading-[1.5]">
                  Fuel your application&apos;s growth by making it simple for your customers to invite their team.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* COLUMN 3: ORGANIZATION UI COMPONENTS                         */}
          {/* ============================================================ */}
          <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-7 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden min-h-[520px]">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[17.5px] sm:text-[18px] font-bold text-[#111827] tracking-tight">
                Organization UI Components
              </h3>
              <p className="text-[13.5px] sm:text-[14px] text-[#64748B] leading-[1.5]">
                Clerk&apos;s UI components add turn-key simplicity to complex Organization management tasks.
              </p>
            </div>

            {/* Dropdown Pill Chip */}
            <div className="flex justify-center pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/90 shadow-xs text-[12px] font-medium text-gray-800">
                <span className="w-2 h-2 rounded-full bg-black" />
                <span>Clerk</span>
                <FaChevronDown className="text-[9px] text-gray-400 ml-0.5" />
              </div>
            </div>

            {/* Preview Window with Mocked UI Panel */}
            <div className="relative my-auto py-2">
              {/* Outer Dashed Border Container */}
              <div className="relative rounded-[20px] border border-dashed border-gray-200 p-2 bg-[#FAFAFC]/40">
                {/* Ambient Glow behind panel */}
                <div className="absolute inset-4 bg-gradient-to-tr from-purple-200/30 via-emerald-100/20 to-indigo-200/30 rounded-2xl blur-xl pointer-events-none" />

                {/* Inner Mocked UI Panel with Looping Blur Reveal */}
                <m.div
                  animate={{
                    filter: isFocused ? "blur(0px)" : "blur(4px)",
                    opacity: isFocused ? 1 : 0.88,
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative z-10 bg-white rounded-[16px] border border-gray-200/90 p-3 sm:p-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  {/* Faint Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                  </div>

                  {/* List Rows */}
                  <div className="flex flex-col gap-2 relative z-10">
                    {/* Row 1: Bluth Company */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                      <div className="flex items-center gap-3">
                        {/* Bluth Green Split Icon */}
                        <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-r-transparent rotate-45" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[13px] font-semibold text-[#111827] leading-tight">
                            Bluth Company
                          </span>
                          <span className="text-[11px] text-gray-400 font-normal">
                            Mr. Manager
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Settings"
                      >
                        <FaGear className="text-[12px]" />
                      </button>
                    </div>

                    {/* Row 2: Dunder Mifflin */}
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center text-white shrink-0">
                        <span className="text-[11px] font-bold tracking-tighter text-blue-300">
                          DM
                        </span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[13px] font-semibold text-[#111827] leading-tight">
                          Dunder Mifflin
                        </span>
                        <span className="text-[11px] text-gray-400 font-normal">
                          Asst (to the) Regional Manager
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Personal Account */}
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                      <img
                        src="/assets/bento/card3-user.jpg"
                        alt="Personal account"
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                      <span className="text-[13px] font-medium text-gray-700">
                        Personal account
                      </span>
                    </div>

                    {/* Row 4: Create Organization */}
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <FaPlus className="text-[10px]" />
                      </div>
                      <span className="text-[12.5px] font-medium text-gray-600">
                        Create organization
                      </span>
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] text-gray-400">
                    <span>Secured by</span>
                    <span className="font-semibold text-gray-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      clerk
                    </span>
                  </div>
                </m.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BentoGridFeatures;
