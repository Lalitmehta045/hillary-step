"use client";

import { useState } from "react";
import { GlobalTalentGlobe3D } from "./GlobalTalentGlobe3D";
import {
  FaHouse,
  FaLayerGroup,
  FaBrain,
  FaCube,
  FaEarthAmericas,
  FaUserGroup,
  FaShieldHalved,
  FaArrowTrendUp,
  FaArrowRight,
  FaCheck,
  FaFileLines,
  FaFilter,
  FaCircleCheck,
  FaRocket,
} from "react-icons/fa6";

interface GlobalTalentShowcaseProps {
  onSelectTab?: (tab: "post" | "find") => void;
}

const PARTNERS = [
  { name: "Microsoft", symbol: "⊞ Microsoft" },
  { name: "airbnb", symbol: "airbnb" },
  { name: "NVIDIA", symbol: "NVIDIA" },
  { name: "deel.", symbol: "deel." },
  { name: "stripe", symbol: "stripe" },
];

const NAV_TABS = [
  { id: "overview", label: "Overview", icon: FaHouse },
  { id: "capabilities", label: "Capabilities", icon: FaLayerGroup },
  { id: "ai-edge", label: "Cognitive AI Edge", icon: FaBrain },
  { id: "delivery", label: "Delivery Engine", icon: FaCube },
];

const VALUE_CARDS = [
  {
    num: "01",
    title: "Global Reach, Local Intelligence",
    desc: "We combine deep local market understanding with a vast global talent network to deliver the right match, faster.",
    icon: FaEarthAmericas,
    tabId: "overview",
  },
  {
    num: "02",
    title: "Specialized Talent Solutions",
    desc: "From IT to engineering, finance to operations — we provide skilled professionals tailored to your exact needs.",
    icon: FaUserGroup,
    tabId: "capabilities",
  },
  {
    num: "03",
    title: "Quality & Compliance First",
    desc: "Rigorous vetting, verified credentials, and compliance standards ensure you get reliable, job-ready talent.",
    icon: FaShieldHalved,
    tabId: "ai-edge",
  },
  {
    num: "04",
    title: "Scalable & Flexible Engagement",
    desc: "Scale your team up or down with ease. Our flexible hiring models adapt to your business goals.",
    icon: FaArrowTrendUp,
    tabId: "delivery",
  },
];

export function GlobalTalentShowcase({ onSelectTab }: GlobalTalentShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const handleAction = (tab: "post" | "find") => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      const el = document.getElementById("staffing-toggle-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#111827] font-display antialiased select-none border-t border-gray-100 mt-16 pt-8">
      {/* ============================================================ */}
      {/* SECTION 1: HERO SECTION                                      */}
      {/* ============================================================ */}
      <section className="relative w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 pt-8 md:pt-12 pb-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF8EE] border border-[#DCFCE7]">
              <span className="text-[11.5px] font-[700] tracking-[0.14em] text-[#16A34A] uppercase">
                GLOBAL STAFFING
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[44px] sm:text-[56px] md:text-[64px] font-[800] leading-[1.05] tracking-[-0.03em] text-[#111827]">
              Global <span className="text-[#16A34A]">Talent.</span>
              <br />
              Local Understanding.
            </h1>

            {/* Subtitle */}
            <p className="font-display text-[15px] sm:text-[16.5px] leading-[1.6] text-[#4B5563] max-w-[500px]">
              We connect businesses with qualified professionals across markets,
              helping organizations build reliable teams without the complexity
              of international hiring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => handleAction("post")}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#111111] hover:bg-black text-white text-[14px] font-[600] tracking-[-0.01em] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <span>Post a Job</span>
                <FaArrowRight className="text-[12px] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleAction("find")}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#111111] text-[14px] font-[600] tracking-[-0.01em] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Find a Job</span>
                <FaArrowRight className="text-[12px] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Trust Proof */}
            <div className="pt-6 flex flex-col gap-3">
              <p className="text-[12px] font-[500] text-[#9CA3AF] tracking-wide">
                Trusted by 500+ companies worldwide
              </p>
              <div className="flex flex-wrap items-center gap-6 text-[#9CA3AF] font-[600] text-[13px] sm:text-[14px]">
                {PARTNERS.map((p) => (
                  <span
                    key={p.name}
                    className="hover:text-[#4B5563] transition-colors cursor-default"
                  >
                    {p.symbol}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive 3D WebGL Globe */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <GlobalTalentGlobe3D />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: INTERACTIVE VALUE PROPS WITH LEFT NAV TABS        */}
      {/* ============================================================ */}
      <section className="relative w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Card */}
          <div className="lg:col-span-4 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/70 p-5 sm:p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              {NAV_TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setActiveCardIndex(idx);
                    }}
                    className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white text-[#111827] font-[700] shadow-xs border border-gray-100"
                        : "text-[#4B5563] hover:text-[#111827] hover:bg-white/60 font-[500]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[#EAF8EE] text-[#16A34A]"
                          : "bg-transparent text-[#9CA3AF] group-hover:text-[#111827]"
                      }`}
                    >
                      <Icon className="text-[15px]" />
                    </div>
                    <span className="text-[14px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Mini 3D Feature Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0]/80 p-4.5 flex flex-col gap-3 shadow-xs">
              <div className="w-full h-[88px] rounded-[12px] bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] flex items-center justify-center overflow-hidden relative">
                <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
                  <g opacity="0.85" transform="translate(14, 18)">
                    <polygon points="18,0 36,10 18,20 0,10" fill="#86EFAC" />
                    <polygon points="0,10 18,20 18,42 0,32" fill="#4ADE80" />
                    <polygon points="18,20 36,10 36,32 18,42" fill="#22C55E" />
                  </g>
                  <g transform="translate(42, 8)">
                    <polygon points="18,0 36,10 18,20 0,10" fill="#BBF7D0" />
                    <polygon points="0,10 18,20 18,42 0,32" fill="#22C55E" />
                    <polygon points="18,20 36,10 36,32 18,42" fill="#15803D" />
                  </g>
                  <g opacity="0.75" transform="translate(62, 22)">
                    <polygon points="14,0 28,8 14,16 0,8" fill="#86EFAC" />
                    <polygon points="0,8 14,16 14,34 0,26" fill="#4ADE80" />
                    <polygon points="14,16 28,8 28,26 14,34" fill="#22C55E" />
                  </g>
                </svg>
              </div>
              <p className="text-[12.5px] leading-[1.5] text-[#4B5563] font-[500]">
                People-centric.
                <br />
                AI-powered.
                <br />
                Outcome-driven.
              </p>
            </div>
          </div>

          {/* Right Embossed Feature Cards List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {VALUE_CARDS.map((card, idx) => {
              const Icon = card.icon;
              const isSelected = activeCardIndex === idx;
              return (
                <div
                  key={card.num}
                  onClick={() => {
                    setActiveCardIndex(idx);
                    setActiveTab(card.tabId);
                  }}
                  className={`group relative w-full bg-white rounded-[20px] p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex items-center justify-between gap-6 ${
                    isSelected
                      ? "border-[#16A34A]/40 shadow-[0_8px_30px_rgb(22,163,74,0.08)] bg-gradient-to-r from-white to-[#F0FDF4]/30"
                      : "border-[#E2E8F0]/80 hover:border-gray-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 max-w-[540px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-[700] text-[#111827]">
                        {card.num}
                      </span>
                      <span className="text-[#9CA3AF] text-[13px] font-[600]">
                        //
                      </span>
                      <h3 className="text-[16px] sm:text-[17px] font-[700] text-[#111827]">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-[13.5px] sm:text-[14px] leading-[1.6] text-[#64748B]">
                      {card.desc}
                    </p>
                  </div>

                  <div className="shrink-0 w-[52px] h-[52px] rounded-[16px] bg-[#F4FDF7] border border-[#DCFCE7] shadow-xs flex items-center justify-center text-[#16A34A] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="text-[20px]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: THE COGNITIVE ENGINE - HOW WE STAY AHEAD          */}
      {/* ============================================================ */}
      <section className="relative w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11.5px] font-[700] tracking-[0.16em] text-[#16A34A] uppercase">
              THE COGNITIVE ENGINE
            </span>
            <h2 className="font-display text-[32px] sm:text-[40px] font-[800] leading-tight tracking-[-0.02em] text-[#111827]">
              How We Stay Ahead
            </h2>
          </div>
          <p className="text-[13.5px] sm:text-[14.5px] leading-[1.5] text-[#64748B] max-w-[340px]">
            Technology, data and academic partnerships that keep our talent
            network future-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1 */}
          <div className="md:col-span-7 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/80 p-7 flex flex-col justify-between gap-6 hover:shadow-sm transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h3 className="text-[18px] sm:text-[20px] font-[700] text-[#111827]">
                Tech Asset Pool &amp; AI Engine
              </h3>
              <p className="text-[13.5px] sm:text-[14px] leading-[1.6] text-[#64748B]">
                Our proprietary AI engine scans millions of data points across
                global talent pools to predict the best-fit candidates with
                higher accuracy and speed.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["AI Matching", "Predictive Sourcing", "Smart Shortlisting"].map(
                  (t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[12px] font-[600] text-[#16A34A] shadow-xs"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="w-full h-[150px] rounded-[16px] bg-gradient-to-br from-white to-[#F0FDF4] border border-[#E2E8F0]/60 flex items-center justify-center overflow-hidden relative">
              <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
                <polygon
                  points="110,10 200,55 110,100 20,55"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />
                <line x1="65" y1="32" x2="155" y2="78" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="110" y1="10" x2="110" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="155" y1="32" x2="65" y2="78" stroke="#E2E8F0" strokeWidth="1" />
                <g transform="translate(94, 28)">
                  <polygon points="16,0 32,9 16,18 0,9" fill="#86EFAC" />
                  <polygon points="0,9 16,18 16,36 0,27" fill="#22C55E" />
                  <polygon points="16,18 32,9 32,27 16,36" fill="#15803D" />
                </g>
                <g transform="translate(60, 42)">
                  <polygon points="10,0 20,6 10,12 0,6" fill="#BBF7D0" />
                  <polygon points="0,6 10,12 10,24 0,18" fill="#4ADE80" />
                  <polygon points="10,12 20,6 20,18 10,24" fill="#22C55E" />
                </g>
                <g transform="translate(138, 44)">
                  <polygon points="10,0 20,6 10,12 0,6" fill="#BBF7D0" />
                  <polygon points="0,6 10,12 10,24 0,18" fill="#4ADE80" />
                  <polygon points="10,12 20,6 20,18 10,24" fill="#22C55E" />
                </g>
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-5 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/80 p-7 flex flex-col justify-between gap-6 hover:shadow-sm transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h3 className="text-[18px] sm:text-[20px] font-[700] text-[#111827]">
                Continuous Upgrades
              </h3>
              <p className="text-[13.5px] sm:text-[14px] leading-[1.6] text-[#64748B]">
                We continuously upgrade our tools, processes, and tech stack to
                stay ahead of industry shifts and client expectations.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["Modern Stack", "Future Ready"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[12px] font-[600] text-[#16A34A] shadow-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full h-[150px] rounded-[16px] bg-gradient-to-br from-white to-[#F0FDF4] border border-[#E2E8F0]/60 flex items-center justify-center overflow-hidden relative">
              <svg width="150" height="110" viewBox="0 0 150 110" fill="none">
                <ellipse cx="75" cy="85" rx="55" ry="16" fill="#E2E8F0" opacity="0.6" />
                <path
                  d="M35,50 C35,30 60,20 85,30 C110,40 120,65 95,75 C70,85 45,70 35,50 Z"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="none"
                />
                <path
                  d="M45,45 C50,30 75,25 95,35 C115,45 110,65 90,70"
                  stroke="#22C55E"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-12 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/80 p-7 flex flex-col lg:flex-row items-center justify-between gap-8 hover:shadow-sm transition-all duration-300">
            <div className="flex flex-col gap-3 max-w-[560px]">
              <h3 className="text-[18px] sm:text-[20px] font-[700] text-[#111827]">
                Academic Synergy &amp; Fresh Talent Pipelines
              </h3>
              <p className="text-[13.5px] sm:text-[14px] leading-[1.6] text-[#64748B]">
                Strong partnerships with universities and training institutes
                help us build a pipeline of job-ready, just-graduated talent for
                tomorrow.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[
                  "Campus Connect",
                  "Training Partnerships",
                  "Future Workforce",
                ].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[12px] font-[600] text-[#16A34A] shadow-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[460px] h-[150px] rounded-[16px] bg-gradient-to-br from-white to-[#F0FDF4] border border-[#E2E8F0]/60 flex items-center justify-center overflow-hidden relative px-6">
              <div className="flex items-center justify-between w-full max-w-[380px]">
                <div className="w-16 h-16 rounded-[16px] bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[#16A34A]">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>

                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-[#86EFAC]" />
                </div>

                <div className="flex items-center -space-x-3">
                  <div className="w-11 h-11 rounded-full ring-3 ring-white bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-[700] text-[13px] shadow-sm">
                    JD
                  </div>
                  <div className="w-11 h-11 rounded-full ring-3 ring-white bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-[700] text-[13px] shadow-sm">
                    SK
                  </div>
                  <div className="w-11 h-11 rounded-full ring-3 ring-white bg-[#FEF3C7] text-[#B45309] flex items-center justify-center font-[700] text-[13px] shadow-sm">
                    AL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: DELIVERY METHODOLOGY - 4-STAGE DELIVERY PROCESS   */}
      {/* ============================================================ */}
      <section className="relative w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[11.5px] font-[700] tracking-[0.16em] text-[#16A34A] uppercase">
            DELIVERY METHODOLOGY
          </span>
          <h2 className="font-display text-[32px] sm:text-[40px] font-[800] leading-tight tracking-[-0.02em] text-[#111827]">
            Our 4-Stage Delivery Process
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0]/80 p-6 flex flex-col gap-4 hover:shadow-xs transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[14px] bg-[#EAF8EE] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <FaFileLines className="text-[18px]" />
              </div>
              <span className="text-[18px] font-[800] text-[#16A34A]">01</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[15.5px] font-[700] text-[#111827] leading-snug">
                Requirement Blueprinting
              </h4>
              <p className="text-[13px] leading-[1.6] text-[#64748B]">
                We analyze your business needs and role expectations to create a
                precise hiring blueprint.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0]/80 p-6 flex flex-col gap-4 hover:shadow-xs transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[14px] bg-[#EAF8EE] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <FaFilter className="text-[18px]" />
              </div>
              <span className="text-[18px] font-[800] text-[#16A34A]">02</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[15.5px] font-[700] text-[#111827] leading-snug">
                Talent Sourcing &amp; Vetting
              </h4>
              <p className="text-[13px] leading-[1.6] text-[#64748B]">
                AI-powered sourcing combined with multi-layered vetting to
                shortlist the most qualified candidates.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0]/80 p-6 flex flex-col gap-4 hover:shadow-xs transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[14px] bg-[#EAF8EE] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <FaCircleCheck className="text-[18px]" />
              </div>
              <span className="text-[18px] font-[800] text-[#16A34A]">03</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[15.5px] font-[700] text-[#111827] leading-snug">
                Technical &amp; Cultural Validation
              </h4>
              <p className="text-[13px] leading-[1.6] text-[#64748B]">
                Rigorous technical tests and cultural alignment checks ensure
                the right fit for your team.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0]/80 p-6 flex flex-col gap-4 hover:shadow-xs transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[14px] bg-[#EAF8EE] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <FaRocket className="text-[18px]" />
              </div>
              <span className="text-[18px] font-[800] text-[#16A34A]">04</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[15.5px] font-[700] text-[#111827] leading-snug">
                Onboarding &amp; Ongoing Integration
              </h4>
              <p className="text-[13px] leading-[1.6] text-[#64748B]">
                Seamless onboarding with continuous support for long-term
                success and retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: READY TO GROW TOGETHER - BOTTOM DARK CTA BANNER    */}
      {/* ============================================================ */}
      <section className="relative w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
        <div className="w-full bg-[#0A0D12] text-white rounded-[26px] p-8 sm:p-12 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#22C55E]/15 filter blur-3xl pointer-events-none" />

          <div className="flex flex-col items-start gap-4 max-w-[540px] z-10">
            <span className="text-[11px] font-[700] tracking-[0.16em] text-[#22C55E] uppercase">
              READY TO GROW TOGETHER
            </span>
            <h2 className="font-display text-[36px] sm:text-[46px] font-[800] leading-[1.1] tracking-[-0.03em] text-white">
              Let&apos;s Build Stronger Teams,
              <br />
              Together.
            </h2>
            <p className="text-[14.5px] sm:text-[15.5px] leading-[1.6] text-gray-300">
              Partner with Hillary Step to access global talent, local expertise
              and measurable impact.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 z-10">
            <div className="flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => handleAction("post")}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white text-[15px] font-[700] tracking-[-0.01em] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-green-900/30 cursor-pointer"
              >
                <span>Start Hiring Smarter</span>
                <FaArrowRight className="text-[13px]" />
              </button>

              <div className="flex flex-col gap-2 pt-1 text-[13px] text-gray-300 font-[500]">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-[#22C55E] text-[12px]" />
                  <span>Global Talent, Local Understanding.</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-[#22C55E] text-[12px]" />
                  <span>Reliable Hiring, Scalable Growth.</span>
                </div>
              </div>
            </div>

            <div className="w-[120px] h-[120px] rounded-full bg-radial from-[#15803D] via-[#052E16] to-[#0A0D12] border border-[#22C55E]/30 flex items-center justify-center relative shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#4ADE80] animate-spin-slow" />
              <div className="absolute w-4 h-4 rounded-full bg-[#22C55E] shadow-[0_0_15px_#22C55E]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
