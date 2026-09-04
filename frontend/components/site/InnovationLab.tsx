"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { m, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";
import { Monitor, Users, Building2, Briefcase, Settings, Wrench, Layout, BarChart, Globe2 } from "lucide-react";

import { GlobalStaffingModal } from "@/components/site/GlobalStaffingModal";
import { ITSolutionsModal } from "@/components/site/ITSolutionsModal";
import { CivilInfraModal } from "@/components/site/CivilInfraModal";

// Load FluidBlob canvas dynamically to disable SSR rendering
const FluidBlob = dynamic(() => import("../ui/FluidBlob").then((mod) => mod.FluidBlob), {
  ssr: false,
});

export function InnovationLab() {
  const [isITModalOpen, setIsITModalOpen] = useState(false);
  const [isTalentModalOpen, setIsTalentModalOpen] = useState(false);
  const [isCivilModalOpen, setIsCivilModalOpen] = useState(false);

  // Animation Sequence State
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 4500); // 4.5s per pillar
    return () => clearInterval(interval);
  }, []);

  // Respect system prefers-reduced-motion
  const shouldReduceMotion = useReducedMotion();

  // Strict Timing Setup (Duration + Delays)
  const lineDur = shouldReduceMotion ? 0 : 1.0;
  const cardDur = shouldReduceMotion ? 0 : 0.6;
  const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1]; // Premium cubic-bezier

  // Use activeIndex for timing instead of static delays

  return (
    <section id="capabilities" className="relative w-full overflow-hidden bg-white pt-[100px] pb-10 max-md:pt-[60px]">
      <div className="relative mx-auto w-full max-w-[1280px] px-[64px] max-md:px-[24px]">
        {/* Section Header */}
        <div className="max-w-[800px] mb-[40px]">
          <FadeIn>
            <h2 className="font-display text-[48px] max-md:text-[32px] max-md:leading-[36px] max-lg:text-[40px] max-lg:leading-[44px] font-bold leading-[54px] tracking-[-1px] text-[#111111]">
              One Company. Three Pillars. <span className="text-[#64F21D]">Infinite</span> <GradientReveal className="from-[#FF9500] to-[#FF6B00]">Solutions.</GradientReveal>
            </h2>
            <p className="mt-[20px] font-sans text-[17px] max-md:text-[15px] max-md:leading-[22px] font-[300] leading-[26px] text-[#8E9094]">
              Hillary Step Solutions delivers integrated technology, staffing, and infrastructure services that help organizations innovate, build, and grow across global markets.
            </p>
          </FadeIn>
        </div>

        {/* Navigation Pill Bar */}
        <FadeIn delay={0.2}>
          <div className="inline-flex max-w-full overflow-x-auto pb-4 mb-10" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center bg-[#6B7280]/10 rounded-full text-[14px] text-[#4B5563] font-medium divide-x divide-[#6B7280]/20 border border-[#6B7280]/10 shadow-sm">
              <div className="px-6 py-3 flex items-center gap-2 hover:bg-[#6B7280]/5 cursor-pointer rounded-l-full transition-colors whitespace-nowrap"><Users className="w-4 h-4 text-brand-blue" /> Consulting</div>
              <div className="px-6 py-3 flex items-center gap-2 hover:bg-[#6B7280]/5 cursor-pointer transition-colors whitespace-nowrap"><Settings className="w-4 h-4 text-brand-green" /> Implementation</div>
              <div className="px-6 py-3 flex items-center gap-2 hover:bg-[#6B7280]/5 cursor-pointer transition-colors whitespace-nowrap"><Layout className="w-4 h-4 text-[#FF9500]" /> Managed Services</div>
              <div className="px-6 py-3 flex items-center gap-2 hover:bg-[#6B7280]/5 cursor-pointer rounded-r-full transition-colors whitespace-nowrap"><Wrench className="w-4 h-4 text-[#8B5CF6]" /> Support & Maintenance</div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Dark Mode Diagram Area (Full Bleed Background) */}
      <div className="relative w-full bg-[#1f2022] overflow-hidden shadow-2xl border-y border-[#ffffff]/5">
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[750px] xl:min-h-[850px] max-lg:min-h-auto py-12 max-lg:py-0">

          {/* DESKTOP DIAGRAM LAYOUT (lg and above) */}
          <div className="hidden lg:block absolute inset-0 w-full h-full">

            {/* Background Decorative Faint Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Decorative Side Squares */}
            <div className="absolute left-[2%] top-1/2 -translate-y-1/2 grid grid-cols-2 gap-2 opacity-30 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={`left-sq-${i}`} className="w-[42px] h-[42px] rounded-[10px] border border-white/10 bg-[#0f1115]/50" />
              ))}
            </div>
            <div className="absolute right-[2%] top-1/2 -translate-y-1/2 grid grid-cols-2 gap-2 opacity-30 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={`right-sq-${i}`} className="w-[42px] h-[42px] rounded-[10px] border border-white/10 bg-[#0f1115]/50" />
              ))}
            </div>

            {/* SVG Connecting Lines (Animated) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" fill="none">
              <defs>
                <clipPath id="techClip">
                  <m.circle cx="50%" cy="30%" initial={{ r: 0 }} whileInView={{ r: 1200 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                </clipPath>
                <clipPath id="talentClip">
                  <m.circle cx="50%" cy="30%" initial={{ r: 0 }} whileInView={{ r: 1200 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                </clipPath>
                <clipPath id="infraClip">
                  <m.circle cx="50%" cy="30%" initial={{ r: 0 }} whileInView={{ r: 1200 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                </clipPath>
              </defs>

              {/* === XL PATHS (Massive Screens) === */}
              <g className="hidden xl:block">
                {/* Technology Paths (Blue) */}
                <m.g animate={{ opacity: activeIndex === 0 ? 1 : 0.3, strokeDashoffset: activeIndex === 0 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} stroke="#1A6CFF" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" clipPath="url(#techClip)">
                  {/* Labels Output to Merge Point */}
                  <line x1="calc(50% - 240px)" y1="calc(30% - 45px)" x2="calc(50% - 330px)" y2="calc(30% - 45px)" />
                  <line x1="calc(50% - 240px)" y1="calc(30% + 45px)" x2="calc(50% - 330px)" y2="calc(30% + 45px)" />
                  
                  {/* Vertical Merge Lines */}
                  <line x1="calc(50% - 330px)" y1="calc(30% - 45px)" x2="calc(50% - 330px)" y2="30%" />
                  <line x1="calc(50% - 330px)" y1="calc(30% + 45px)" x2="calc(50% - 330px)" y2="30%" />
                  
                  {/* Unified Route into IT Solutions Card */}
                  <line x1="calc(50% - 330px)" y1="30%" x2="calc(2% + 220px)" y2="30%" />
                </m.g>

                {/* Talent Paths (Green) */}
                <m.g animate={{ opacity: activeIndex === 1 ? 1 : 0.3, strokeDashoffset: activeIndex === 1 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} stroke="#22c55e" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" clipPath="url(#talentClip)">
                  {/* Labels Output to Merge Point */}
                  <line x1="calc(50% + 240px)" y1="calc(30% - 45px)" x2="calc(50% + 330px)" y2="calc(30% - 45px)" />
                  <line x1="calc(50% + 240px)" y1="calc(30% + 45px)" x2="calc(50% + 330px)" y2="calc(30% + 45px)" />
                  
                  {/* Vertical Merge Lines */}
                  <line x1="calc(50% + 330px)" y1="calc(30% - 45px)" x2="calc(50% + 330px)" y2="30%" />
                  <line x1="calc(50% + 330px)" y1="calc(30% + 45px)" x2="calc(50% + 330px)" y2="30%" />
                  
                  {/* Unified Route into Talent Card */}
                  <line x1="calc(50% + 330px)" y1="30%" x2="calc(98% - 220px)" y2="30%" />
                </m.g>

                <m.g animate={{ opacity: activeIndex === 2 ? 1 : 0.3, strokeDashoffset: activeIndex === 2 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} stroke="#FF9500" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" clipPath="url(#infraClip)">
                  {/* Blob to Orchestration */}
                  <line x1="50%" y1="calc(30% + 150px)" x2="50%" y2="calc(30% + 170px)" />
                  {/* Orchestration to PSPs */}
                  <line x1="50%" y1="calc(30% + 170px)" x2="calc(50% - 80px)" y2="calc(30% + 210px)" />
                  <line x1="50%" y1="calc(30% + 170px)" x2="calc(50% + 80px)" y2="calc(30% + 210px)" />
                  {/* PSPs to Bottom Card */}
                  <line x1="calc(50% - 80px)" y1="calc(30% + 210px)" x2="calc(50% - 80px)" y2="calc(30% + 320px)" />
                  <line x1="calc(50% + 80px)" y1="calc(30% + 210px)" x2="calc(50% + 80px)" y2="calc(30% + 320px)" />
                </m.g>
              </g>

              {/* === LG PATHS (Laptops, 1024px to 1279px) === */}
              <g className="xl:hidden">
                {/* Technology Paths (Blue) */}
                <m.g animate={{ opacity: activeIndex === 0 ? 1 : 0.3, strokeDashoffset: activeIndex === 0 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} stroke="#1A6CFF" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" clipPath="url(#techClip)">
                  {/* Labels Output to Merge Point */}
                  <line x1="calc(50% - 210px)" y1="calc(30% - 45px)" x2="calc(50% - 290px)" y2="calc(30% - 45px)" />
                  <line x1="calc(50% - 210px)" y1="calc(30% + 45px)" x2="calc(50% - 290px)" y2="calc(30% + 45px)" />
                  
                  {/* Vertical Merge Lines */}
                  <line x1="calc(50% - 290px)" y1="calc(30% - 45px)" x2="calc(50% - 290px)" y2="30%" />
                  <line x1="calc(50% - 290px)" y1="calc(30% + 45px)" x2="calc(50% - 290px)" y2="30%" />
                  
                  {/* Unified Route into IT Solutions Card */}
                  <line x1="calc(50% - 290px)" y1="30%" x2="calc(2% + 180px)" y2="30%" />
                </m.g>

                {/* Talent Paths (Green) */}
                <m.g animate={{ opacity: activeIndex === 1 ? 1 : 0.3, strokeDashoffset: activeIndex === 1 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} stroke="#22c55e" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" clipPath="url(#talentClip)">
                  {/* Labels Output to Merge Point */}
                  <line x1="calc(50% + 210px)" y1="calc(30% - 45px)" x2="calc(50% + 290px)" y2="calc(30% - 45px)" />
                  <line x1="calc(50% + 210px)" y1="calc(30% + 45px)" x2="calc(50% + 290px)" y2="calc(30% + 45px)" />
                  
                  {/* Vertical Merge Lines */}
                  <line x1="calc(50% + 290px)" y1="calc(30% - 45px)" x2="calc(50% + 290px)" y2="30%" />
                  <line x1="calc(50% + 290px)" y1="calc(30% + 45px)" x2="calc(50% + 290px)" y2="30%" />
                  
                  {/* Unified Route into Talent Card */}
                  <line x1="calc(50% + 290px)" y1="30%" x2="calc(98% - 180px)" y2="30%" />
                </m.g>

                <m.g animate={{ opacity: activeIndex === 2 ? 1 : 0.3, strokeDashoffset: activeIndex === 2 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} stroke="#FF9500" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" clipPath="url(#infraClip)">
                  {/* Blob to Orchestration */}
                  <line x1="50%" y1="calc(30% + 130px)" x2="50%" y2="calc(30% + 150px)" />
                  {/* Orchestration to PSPs */}
                  <line x1="50%" y1="calc(30% + 150px)" x2="calc(50% - 70px)" y2="calc(30% + 190px)" />
                  <line x1="50%" y1="calc(30% + 150px)" x2="calc(50% + 70px)" y2="calc(30% + 190px)" />
                  {/* PSPs to Bottom Card */}
                  <line x1="calc(50% - 70px)" y1="calc(30% + 190px)" x2="calc(50% - 70px)" y2="calc(30% + 280px)" />
                  <line x1="calc(50% + 70px)" y1="calc(30% + 190px)" x2="calc(50% + 70px)" y2="calc(30% + 280px)" />
                </m.g>
              </g>
            </svg>

            {/* Floating Connector Labels */}
            {/* Left side labels */}
            <m.div initial={false} animate={{ opacity: activeIndex === 0 ? 1 : 0.4 }} transition={{ duration: activeIndex === 0 ? 0.6 : 0.4, delay: activeIndex === 0 ? 0.8 : 0 }} className={`absolute left-[calc(50%-210px)] xl:left-[calc(50%-240px)] top-[calc(30%-45px)] -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3 py-1.5 bg-[#12141a] border border-white/10 rounded-md text-[10px] xl:text-[11px] text-gray-300 shadow-lg whitespace-nowrap transition-all pointer-events-auto`}>
              <Settings className="w-3 h-3 text-[#1A6CFF]" /> Workflow Automation
            </m.div>
            <m.div initial={false} animate={{ opacity: activeIndex === 0 ? 1 : 0.4 }} transition={{ duration: activeIndex === 0 ? 0.6 : 0.4, delay: activeIndex === 0 ? 0.9 : 0 }} className={`absolute left-[calc(50%-210px)] xl:left-[calc(50%-240px)] top-[calc(30%+45px)] -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3 py-1.5 bg-[#12141a] border border-white/10 rounded-md text-[10px] xl:text-[11px] text-gray-300 shadow-lg whitespace-nowrap transition-all pointer-events-auto`}>
              <Monitor className="w-3 h-3 text-[#1A6CFF]" /> Digital Experience
            </m.div>

            {/* Right side labels */}
            <m.div initial={false} animate={{ opacity: activeIndex === 1 ? 1 : 0.4 }} transition={{ duration: activeIndex === 1 ? 0.6 : 0.4, delay: activeIndex === 1 ? 0.8 : 0 }} className={`absolute left-[calc(50%+210px)] xl:left-[calc(50%+240px)] top-[calc(30%-45px)] -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3 py-1.5 bg-[#22c55e] border border-[#22c55e] rounded-md text-[10px] xl:text-[11px] text-white font-medium shadow-[0_0_15px_rgba(34,197,94,0.3)] whitespace-nowrap transition-all pointer-events-auto`}>
              <BarChart className="w-3 h-3 text-white" /> Analytics & Reporting
            </m.div>
            <m.div initial={false} animate={{ opacity: activeIndex === 1 ? 1 : 0.4 }} transition={{ duration: activeIndex === 1 ? 0.6 : 0.4, delay: activeIndex === 1 ? 0.9 : 0 }} className={`absolute left-[calc(50%+210px)] xl:left-[calc(50%+240px)] top-[calc(30%+45px)] -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3 py-1.5 bg-[#12141a] border border-white/10 rounded-md text-[10px] xl:text-[11px] text-gray-300 shadow-lg whitespace-nowrap transition-all pointer-events-auto`}>
              <Users className="w-3 h-3 text-[#22c55e]" /> Talent Marketplace
            </m.div>

            {/* Bottom side labels */}
            <m.div 
              initial={false} 
              animate={{ opacity: activeIndex === 2 ? 1 : 0.4, scale: activeIndex === 2 ? 1 : 0.95 }} 
              transition={{ duration: activeIndex === 2 ? 0.6 : 0.4, delay: activeIndex === 2 ? 0.8 : 0 }} 
              className={`absolute left-[50%] top-[calc(30%+150px)] xl:top-[calc(30%+170px)] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center px-4 py-2 bg-[#12141a] border border-white/10 rounded-full text-[9px] xl:text-[10px] tracking-wider font-bold text-gray-300 shadow-lg uppercase whitespace-nowrap transition-all pointer-events-auto`}
            >
              SOLUTION ORCHESTRATION
            </m.div>

            <div className={`absolute left-[50%] top-[calc(30%+190px)] xl:top-[calc(30%+210px)] -translate-x-1/2 -translate-y-1/2 z-20 flex gap-4 transition-all pointer-events-auto`}>
              <m.div initial={false} animate={{ opacity: activeIndex === 2 ? 1 : 0.4, scale: activeIndex === 2 ? 1 : 0.95 }} transition={{ duration: activeIndex === 2 ? 0.6 : 0.4, delay: activeIndex === 2 ? 0.8 : 0 }} className="flex items-center gap-2 px-4 py-1.5 bg-[#12141a] border border-[#FF9500]/30 rounded-full text-[10px] xl:text-[11px] text-gray-300 shadow-lg whitespace-nowrap">
                <Globe2 className="w-3 h-3 text-[#FF9500]" /> PSP (India)
              </m.div>
              <m.div initial={false} animate={{ opacity: activeIndex === 2 ? 1 : 0.4, scale: activeIndex === 2 ? 1 : 0.95 }} transition={{ duration: activeIndex === 2 ? 0.6 : 0.4, delay: activeIndex === 2 ? 0.9 : 0 }} className="flex items-center gap-2 px-4 py-1.5 bg-[#12141a] border border-[#FF9500]/30 rounded-full text-[10px] xl:text-[11px] text-gray-300 shadow-lg whitespace-nowrap">
                <Briefcase className="w-3 h-3 text-[#FF9500]" /> PSP (International)
              </m.div>
            </div>

            {/* Central AI Core Wrapper */}
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
              className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] xl:w-[340px] xl:h-[340px] z-10 flex items-center justify-center pointer-events-auto"
            >
              {/* Interactive 3D Fluid Particle Blob */}
              <div className="absolute inset-0 flex items-center justify-center z-0 w-full h-full">
                <FluidBlob className="w-full h-full" interactive={true} />
              </div>
            </m.div>

            {/* 01 TECHNOLOGY Card */}
            <m.div
              initial={false}
              animate={{ opacity: activeIndex === 0 ? 1 : 0.4, y: 0, scale: activeIndex === 0 ? 1.05 : 0.95, filter: activeIndex === 0 ? 'brightness(1.1)' : 'brightness(0.9)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.25, ease: "easeOut", delay: 0 } }}
              onClick={() => setIsITModalOpen(true)}
              className={`absolute left-[2%] top-[30%] -translate-y-1/2 w-[180px] xl:w-[220px] rounded-[16px] p-[1.5px] bg-[#1A6CFF]/80 z-20 shadow-[0_0_20px_rgba(26,108,255,0.15)] cursor-pointer transition-all pointer-events-auto`}
            >
              <div className="w-full h-full rounded-[15px] bg-[#12141a] p-5 xl:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#1A6CFF]/10 flex items-center justify-center border border-[#1A6CFF]/20">
                    <Monitor className="w-4 h-4 text-[#1A6CFF]" />
                  </div>
                  <h4 className="font-display text-[#1A6CFF] font-bold tracking-[0.05em] text-[13px] xl:text-[15px] uppercase">COGNITIVE DIGITAL – PLATFORMS</h4>
                </div>
                <ul className="flex flex-col gap-3 xl:gap-4">
                  {["Custom Software Development", "AI & Machine Learning", "Cloud Solutions", "Web & Mobile Applications", "Data Engineering & Analytics", "Cybersecurity"].map((item, i) => (
                    <m.li
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className="flex items-start gap-2 xl:gap-3 text-[11px] xl:text-[12px] text-gray-300 hover:text-white transition-colors"
                    >
                      <div className="w-[5px] h-[5px] rounded-full bg-[#1A6CFF] mt-1.5 flex-shrink-0 shadow-[0_0_5px_#1A6CFF]" />
                      <span className="leading-[1.4]">{item}</span>
                    </m.li>
                  ))}
                </ul>
              </div>
            </m.div>

            {/* 02 TALENT Card */}
            <m.div
              initial={false}
              animate={{ opacity: activeIndex === 1 ? 1 : 0.4, y: 0, scale: activeIndex === 1 ? 1.05 : 0.95, filter: activeIndex === 1 ? 'brightness(1.1)' : 'brightness(0.9)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.25, ease: "easeOut", delay: 0 } }}
              onClick={() => setIsTalentModalOpen(true)}
              className={`absolute right-[2%] top-[30%] -translate-y-1/2 w-[180px] xl:w-[220px] rounded-[16px] p-[1.5px] bg-[#22c55e]/80 z-20 shadow-[0_0_20px_rgba(34,197,94,0.15)] cursor-pointer transition-all pointer-events-auto`}
            >
              <div className="w-full h-full rounded-[15px] bg-[#12141a] p-5 xl:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/20">
                    <Briefcase className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <h4 className="font-display text-[#22c55e] font-bold tracking-[0.05em] text-[13px] xl:text-[15px] uppercase">GLOBAL TALENT – PEOPLE</h4>
                </div>
                <ul className="flex flex-col gap-3 xl:gap-4">
                  {["International Recruitment", "Contract Staffing", "Permanent Hiring", "RPO Services", "Staff Augmentation", "Offshore Development Teams"].map((item, i) => (
                    <m.li
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className="flex items-start gap-2 xl:gap-3 text-[11px] xl:text-[12px] text-gray-300 hover:text-white transition-colors"
                    >
                      <div className="w-[5px] h-[5px] rounded-full bg-[#22c55e] mt-1.5 flex-shrink-0 shadow-[0_0_5px_#22c55e]" />
                      <span className="leading-[1.4]">{item}</span>
                    </m.li>
                  ))}
                </ul>
              </div>
            </m.div>

            {/* 03 INFRASTRUCTURE Card */}
            <m.div
              initial={false}
              animate={{ opacity: activeIndex === 2 ? 1 : 0.4, y: 0, scale: activeIndex === 2 ? 1.05 : 0.95, filter: activeIndex === 2 ? 'brightness(1.1)' : 'brightness(0.9)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.25, ease: "easeOut", delay: 0 } }}
              onClick={() => setIsCivilModalOpen(true)}
              className={`absolute left-1/2 top-[calc(30%+260px)] xl:top-[calc(30%+320px)] -translate-x-1/2 w-[440px] xl:w-[500px] rounded-[16px] p-[1.5px] bg-[#FF9500]/80 z-20 shadow-[0_0_20px_rgba(255,149,0,0.15)] cursor-pointer transition-all pointer-events-auto`}
            >
              <div className="w-full h-full rounded-[15px] bg-[#12141a] p-5 xl:p-6 px-6 xl:px-8">
                <div className="flex items-center gap-3 mb-4 xl:mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#FF9500]/10 flex items-center justify-center border border-[#FF9500]/20">
                    <Building2 className="w-4 h-4 text-[#FF9500]" />
                  </div>
                  <h4 className="font-display text-[#FF9500] font-bold tracking-[0.05em] text-[13px] xl:text-[15px] uppercase">ECO SMART INFRA – PROJECTS</h4>
                </div>
                <ul className="grid grid-cols-2 gap-x-6 xl:gap-x-8 gap-y-3 xl:gap-y-4">
                  {["Engineering Consultancy", "EPC Services", "Project Management", "Smart Cities", "Infrastructure Development", "Sustainable Infrastructure"].map((item, i) => (
                    <m.li
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className="flex items-start gap-2 xl:gap-3 text-[11px] xl:text-[12px] text-gray-300 hover:text-white transition-colors"
                    >
                      <div className="w-[5px] h-[5px] rounded-full bg-[#FF9500] mt-1.5 flex-shrink-0 shadow-[0_0_5px_#FF9500]" />
                      <span className="leading-[1.4]">{item}</span>
                    </m.li>
                  ))}
                </ul>
              </div>
            </m.div>
          </div>

          {/* RESPONSIVE LAYOUT (below lg - Mobile/Tablet Stack) */}
          <div className="lg:hidden flex flex-col items-center gap-[24px] py-[40px] px-4 z-10 relative">

            {/* Center: Interactive Blob & Box */}
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
              className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center pointer-events-auto"
            >
              <div className="absolute inset-0 flex items-center justify-center z-0 w-full h-full">
                <FluidBlob className="w-full h-full" interactive={true} />
              </div>
            </m.div>

            {/* SVG Mobile Connectors and Labels */}
            {/* 01 TECHNOLOGY */}
            <div className="flex flex-col items-center w-full gap-2 relative">
              <m.div initial={false} animate={{ opacity: activeIndex === 0 ? 1 : 0.4 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 px-3 py-1.5 bg-[#12141a] border border-[#1A6CFF]/30 rounded-md text-[10px] text-gray-300 transition-all">
                <Monitor className="w-3 h-3 text-[#1A6CFF]" /> Digital Experience
              </m.div>

              <m.svg animate={{ opacity: activeIndex === 0 ? 1 : 0.3, strokeDashoffset: activeIndex === 0 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} className="w-[4px] h-[30px]" viewBox="0 0 4 30" fill="none">
                <defs><clipPath id="mobileTechClip"><m.rect x="0" y="0" initial={{ height: 0 }} whileInView={{ height: 30 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} width="4" /></clipPath></defs>
                <line x1="2" y1="0" x2="2" y2="30" stroke="#1A6CFF" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 8" clipPath="url(#mobileTechClip)" />
              </m.svg>

              <m.div
                initial={false}
                animate={{ opacity: activeIndex === 0 ? 1 : 0.3, scale: activeIndex === 0 ? 1 : 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsITModalOpen(true)}
                className="w-full max-w-[320px] rounded-[16px] p-[1.5px] bg-[#1A6CFF]/80 z-20 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-full h-full rounded-[15px] bg-[#12141a] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#1A6CFF]/10 flex items-center justify-center border border-[#1A6CFF]/20">
                      <Monitor className="w-3.5 h-3.5 text-[#1A6CFF]" />
                    </div>
                    <h4 className="font-display text-[#1A6CFF] font-bold tracking-[0.05em] text-[14px] uppercase">COGNITIVE DIGITAL – PLATFORMS</h4>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {["Custom Software Development", "AI & Machine Learning", "Cloud Solutions", "Web & Mobile Applications", "Data Engineering & Analytics", "Cybersecurity"].map((item, i) => (
                      <m.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="flex items-start gap-3 text-[11px] text-gray-300"
                      >
                        <div className="w-1 h-1 rounded-full bg-[#1A6CFF] mt-1.5 flex-shrink-0" />
                        <span className="leading-[1.4]">{item}</span>
                      </m.li>
                    ))}
                  </ul>
                </div>
              </m.div>
            </div>

            {/* 02 TALENT */}
            <div className="flex flex-col items-center w-full gap-2 relative mt-4">
              <m.div initial={false} animate={{ opacity: activeIndex === 1 ? 1 : 0.4 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 px-3 py-1.5 bg-[#22c55e] rounded-md text-[10px] text-white font-medium shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all">
                <BarChart className="w-3 h-3 text-white" /> Analytics & Reporting
              </m.div>

              <m.svg animate={{ opacity: activeIndex === 1 ? 1 : 0.3, strokeDashoffset: activeIndex === 1 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} className="w-[4px] h-[30px]" viewBox="0 0 4 30" fill="none">
                <defs><clipPath id="mobileTalentClip"><m.rect x="0" y="0" initial={{ height: 0 }} whileInView={{ height: 30 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} width="4" /></clipPath></defs>
                <line x1="2" y1="0" x2="2" y2="30" stroke="#22c55e" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 8" clipPath="url(#mobileTalentClip)" />
              </m.svg>

              <m.div
                initial={false}
                animate={{ opacity: activeIndex === 1 ? 1 : 0.3, scale: activeIndex === 1 ? 1 : 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsTalentModalOpen(true)}
                className="w-full max-w-[320px] rounded-[16px] p-[1.5px] bg-[#22c55e]/80 z-20 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-full h-full rounded-[15px] bg-[#12141a] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/20">
                      <Briefcase className="w-3.5 h-3.5 text-[#22c55e]" />
                    </div>
                    <h4 className="font-display text-[#22c55e] font-bold tracking-[0.05em] text-[14px] uppercase">GLOBAL TALENT – PEOPLE</h4>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {["International Recruitment", "Contract Staffing", "Permanent Hiring", "RPO Services", "Staff Augmentation", "Offshore Development Teams"].map((item, i) => (
                      <m.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="flex items-start gap-3 text-[11px] text-gray-300"
                      >
                        <div className="w-1 h-1 rounded-full bg-[#22c55e] mt-1.5 flex-shrink-0" />
                        <span className="leading-[1.4]">{item}</span>
                      </m.li>
                    ))}
                  </ul>
                </div>
              </m.div>
            </div>

            {/* 03 INFRASTRUCTURE */}
            <div className="flex flex-col items-center w-full gap-2 relative mt-4">
              <m.div initial={false} animate={{ opacity: activeIndex === 2 ? 1 : 0.4 }} transition={{ duration: 0.4 }} className="flex items-center justify-center px-4 py-2 bg-[#12141a] border border-white/10 rounded-full text-[9px] tracking-wider font-bold text-gray-300 uppercase transition-all">
                SOLUTION ORCHESTRATION
              </m.div>

              <m.svg animate={{ opacity: activeIndex === 2 ? 1 : 0.3, strokeDashoffset: activeIndex === 2 ? [0, -32] : 0 }} transition={{ opacity: { duration: 0.5 }, strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 } }} className="w-[4px] h-[30px]" viewBox="0 0 4 30" fill="none">
                <defs><clipPath id="mobileInfraClip"><m.rect x="0" y="0" initial={{ height: 0 }} whileInView={{ height: 30 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} width="4" /></clipPath></defs>
                <line x1="2" y1="0" x2="2" y2="30" stroke="#FF9500" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 8" clipPath="url(#mobileInfraClip)" />
              </m.svg>

              <m.div
                initial={false}
                animate={{ opacity: activeIndex === 2 ? 1 : 0.3, scale: activeIndex === 2 ? 1 : 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsCivilModalOpen(true)}
                className="w-full max-w-[320px] rounded-[16px] p-[1.5px] bg-[#FF9500]/80 z-20 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-full h-full rounded-[15px] bg-[#12141a] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#FF9500]/10 flex items-center justify-center border border-[#FF9500]/20">
                      <Building2 className="w-3.5 h-3.5 text-[#FF9500]" />
                    </div>
                    <h4 className="font-display text-[#FF9500] font-bold tracking-[0.05em] text-[14px] uppercase">ECO SMART INFRA – PROJECTS</h4>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {["Engineering Consultancy", "EPC Services", "Project Management", "Smart Cities", "Infrastructure Development", "Sustainable Infrastructure"].map((item, i) => (
                      <m.li
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="flex items-start gap-2 text-[11px] text-gray-300"
                      >
                        <div className="w-1 h-1 rounded-full bg-[#FF9500] mt-1.5 flex-shrink-0" />
                        <span className="leading-[1.4]">{item}</span>
                      </m.li>
                    ))}
                  </ul>
                </div>
              </m.div>
            </div>
          </div>

        </div>
      </div>

      {/* Info Modals */}
      <ITSolutionsModal isOpen={isITModalOpen} onClose={() => setIsITModalOpen(false)} />
      <GlobalStaffingModal isOpen={isTalentModalOpen} onClose={() => setIsTalentModalOpen(false)} />
      <CivilInfraModal isOpen={isCivilModalOpen} onClose={() => setIsCivilModalOpen(false)} />
    </section>
  );
}
