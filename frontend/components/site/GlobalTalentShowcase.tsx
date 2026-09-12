"use client";

import { useState } from "react";
import { m } from "framer-motion";
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
import { AnimatedCubeCard } from "./AnimatedCubeCard";
import { AiEngineVisual } from "./AiEngineCard";
import { ProfileFlowCard } from "./ProfileFlowCard";
import { BentoGridFeatures } from "./BentoGridFeatures";

interface GlobalTalentShowcaseProps {
  onSelectTab?: (tab: "post" | "find") => void;
}

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
    <div className="w-full bg-[#FFFFFF] text-[#111827] font-display antialiased select-none border-t border-gray-100 mt-12 pt-6">
      {/* ============================================================ */}
      {/* SECTION 2: INTERACTIVE VALUE PROPS WITH LEFT NAV TABS        */}
      {/* ============================================================ */}
      <section className="relative w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Card */}
          <div className="lg:col-span-4 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/70 p-5 sm:p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 relative">
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
                    className={`group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-left transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "text-[#111827] font-[700]"
                        : "text-[#4B5563] hover:text-[#111827] font-[500]"
                    }`}
                  >
                    {isActive && (
                      <m.div
                        layoutId="activeNavTabIndicator"
                        className="absolute inset-0 bg-white rounded-[14px] shadow-xs border border-gray-100/90 z-0"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors duration-200 ${
                        isActive
                          ? "bg-[#EAF8EE] text-[#16A34A]"
                          : "bg-transparent text-[#9CA3AF] group-hover:text-[#111827] group-hover:bg-white/40"
                      }`}
                    >
                      <Icon className="text-[15px]" />
                    </div>
                    <span className="relative z-10 text-[14px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Mini 3D Feature Card */}
            <AnimatedCubeCard />
          </div>

          {/* Right Embossed Feature Cards List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {VALUE_CARDS.map((card, idx) => {
              const Icon = card.icon;
              const isSelected = activeCardIndex === idx;
              return (
                <m.div
                  key={card.num}
                  onClick={() => {
                    setActiveCardIndex(idx);
                    setActiveTab(card.tabId);
                  }}
                  animate={{
                    scale: isSelected ? 1.012 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 28,
                  }}
                  className={`group relative w-full bg-white rounded-[20px] p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex items-center justify-between gap-6 overflow-hidden ${
                    isSelected
                      ? "border-[#16A34A]/50 shadow-[0_10px_32px_rgb(22,163,74,0.10)]"
                      : "border-[#E2E8F0]/80 hover:border-gray-300 hover:shadow-xs"
                  }`}
                >
                  {isSelected && (
                    <m.div
                      layoutId="activeCardGlow"
                      className="absolute inset-0 bg-gradient-to-r from-white via-white to-[#F0FDF4]/30 pointer-events-none -z-0"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 28,
                      }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col gap-1.5 max-w-[540px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[14px] font-[700] transition-colors duration-200 ${
                          isSelected ? "text-[#16A34A]" : "text-[#111827]"
                        }`}
                      >
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

                  <div
                    className={`relative z-10 shrink-0 w-[52px] h-[52px] rounded-[16px] border shadow-xs flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-[#EAF8EE] border-[#86EFAC] text-[#16A34A] scale-105"
                        : "bg-[#F4FDF7] border-[#DCFCE7] text-[#16A34A] group-hover:scale-105"
                    }`}
                  >
                    <Icon className="text-[20px]" />
                  </div>
                </m.div>
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
          <div className="md:col-span-7 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/80 p-5 sm:p-7 flex flex-col justify-between gap-5 sm:gap-6 hover:shadow-sm transition-all duration-300">
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

            <AiEngineVisual className="!mt-0" />
          </div>

          {/* Card 2 */}
          <div className="md:col-span-5 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/80 p-5 sm:p-7 flex flex-col justify-between gap-5 sm:gap-6 hover:shadow-sm transition-all duration-300">
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
              <style>{`
                @keyframes spin-ring {
                  100% {
                    stroke-dashoffset: 0;
                  }
                  0% {
                    stroke-dashoffset: 100;
                  }
                }
                .animate-spin-ring {
                  animation: spin-ring 3.75s linear infinite;
                }
              `}</style>
              <svg width="150" height="110" viewBox="0 0 150 110" fill="none">
                <ellipse cx="75" cy="85" rx="55" ry="16" fill="#E2E8F0" opacity="0.6" />
                {/* Background Ring */}
                <path
                  d="M35,50 C35,30 60,20 85,30 C110,40 120,65 95,75 C70,85 45,70 35,50 Z"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Animated Foreground Ring Segment */}
                <path
                  d="M35,50 C35,30 60,20 85,30 C110,40 120,65 95,75 C70,85 45,70 35,50 Z"
                  stroke="#22C55E"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                  pathLength="100"
                  strokeDasharray="25 75"
                  className="animate-spin-ring"
                />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-12 bg-[#F8FAFC] rounded-[22px] border border-[#E2E8F0]/80 p-5 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-8 hover:shadow-sm transition-all duration-300">
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

            <div className="w-full lg:w-[460px]">
              <ProfileFlowCard />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3.5: ORGANIZATION & TALENT ARCHITECTURE (BENTO GRID) */}
      {/* ============================================================ */}
      <BentoGridFeatures />

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
