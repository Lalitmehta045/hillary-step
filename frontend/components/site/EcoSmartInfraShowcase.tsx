"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowDown } from "lucide-react";

interface ProjectHighlight {
  id: string;
  title: string;
  location: string;
  tag: string;
  image: string;
  alt: string;
}

const HIGHLIGHTS: ProjectHighlight[] = [
  { id: "viaduct-interchange", title: "Viaduct Interchange", location: "North Corridor", tag: "EXPRESSWAY", image: "/images/pillar3/highway-overpass.jpg", alt: "Elevated highway interchange under active civil construction" },
  { id: "apex-bridge-seattle", title: "Apex Bridge - Seattle", location: "Seattle", tag: "CABLE-STAYED", image: "/images/pillar3/apex-bridge.jpg", alt: "Cable-stayed Apex Bridge in Seattle during sunset" },
  { id: "smart-city-beaocithe", title: "Smart City - Beaocithe", location: "Latino City", tag: "SMART ECO-SYSTEM", image: "/images/pillar3/smart-city.jpg", alt: "Futuristic eco-friendly smart city with vertical green architecture" },
  { id: "eco-transit-hub", title: "Eco Transit Hub", location: "Metropolitan Center", tag: "HIGH-SPEED RAIL", image: "/images/pillar3/metro-transit.jpg", alt: "Modern high-speed rail transit hub and terminal" },
  { id: "harbor-suspension-gateway", title: "Harbor Suspension Gateway", location: "Coastal Bay", tag: "DEEPWATER INFRA", image: "/images/pillar3/apex-bridge.jpg", alt: "Deepwater civil suspension bridge project" },
  { id: "sustainable-energy-district", title: "Sustainable Energy Grid", location: "Western Basin", tag: "CLEAN INFRA", image: "/images/pillar3/smart-city.jpg", alt: "Modern sustainable civil grid infrastructure" },
];

const EXPERTISE = [
  { title: "Structural Engineering", description: "Innovating resilient structures.", icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>) },
  { title: "Civil Works", description: "Essential public infrastructure.", icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>) },
  { title: "Sustainability Consulting", description: "Eco-friendly solutions.", icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>) },
];

const PROCESS_STEPS = [
  { number: "1", label: "PLAN", description: "Strategic roadmap.", badgeBg: "bg-[#D1FAE5]", badgeText: "text-[#059669]", badgeBorder: "border-[#A7F3D0]", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>) },
  { number: "2", label: "DESIGN", description: "Creative solutions.", badgeBg: "bg-[#DBEAFE]", badgeText: "text-[#2563EB]", badgeBorder: "border-[#BFDBFE]", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>) },
  { number: "3", label: "BUILD", description: "Execution & construction.", badgeBg: "bg-[#EDE9FE]", badgeText: "text-[#7C3AED]", badgeBorder: "border-[#DDD6FE]", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>) },
  { number: "4", label: "OPTIMIZE", description: "Continuous improvement.", badgeBg: "bg-[#FCE7F3]", badgeText: "text-[#DB2777]", badgeBorder: "border-[#FBCFE8]", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>) },
];

const SYSTEMS = [
  { label: "ENERGY", value: "82%", detail: "Renewable integration", metric: 82, icon: "↗" },
  { label: "WATER", value: "91%", detail: "Recovery efficiency", metric: 91, icon: "◌" },
  { label: "MOBILITY", value: "74%", detail: "Low-carbon network", metric: 74, icon: "→" },
  { label: "MATERIAL", value: "68%", detail: "Circular material use", metric: 68, icon: "◇" },
];

const SMART_LAYERS = [
  { id: "energy", label: "ENERGY", title: "Energy that responds", text: "Connect renewable generation, storage and demand monitoring so infrastructure can respond to changing loads instead of operating in isolation.", stat: "82%", statLabel: "RENEWABLE INTEGRATION", signal: "01 / ENERGY" },
  { id: "water", label: "WATER", title: "Water that circulates", text: "Design recovery, reuse and monitoring into the network to reduce pressure on fresh-water supply and improve operational resilience.", stat: "91%", statLabel: "RECOVERY EFFICIENCY", signal: "02 / WATER" },
  { id: "mobility", label: "MOBILITY", title: "Mobility that connects", text: "Coordinate transit corridors, pedestrian movement and low-carbon mobility so infrastructure supports efficient movement across the wider system.", stat: "74%", statLabel: "LOW-CARBON NETWORK", signal: "03 / MOBILITY" },
  { id: "materials", label: "MATERIAL", title: "Materials with another life", text: "Plan for durability, maintenance and reuse from the beginning, reducing lifecycle waste while extending the value of built assets.", stat: "68%", statLabel: "CIRCULAR MATERIAL USE", signal: "04 / MATERIAL" },
];

export function EcoSmartInfraShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);

  const findScrollParent = (node: HTMLElement | null): HTMLElement | null => {
    if (!node) return null;
    let current: HTMLElement | null = node.parentElement;
    while (current) {
      const style = window.getComputedStyle(current);
      if ((style.overflowY === "auto" || style.overflowY === "scroll") && current.scrollHeight > current.clientHeight) return current;
      current = current.parentElement;
    }
    return null;
  };

  const handleScrollUpdate = useCallback(() => {
    if (!trackRef.current || !stickyRef.current || !cardsRowRef.current) return;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const cardsRow = cardsRowRef.current;
    const scrollParent = scrollParentRef.current;
    const parentRect = scrollParent ? scrollParent.getBoundingClientRect() : { top: 0, height: window.innerHeight };
    const trackRect = track.getBoundingClientRect();
    const totalTrackScroll = track.offsetHeight - sticky.offsetHeight;
    if (totalTrackScroll <= 0) return;
    const scrolled = parentRect.top - trackRect.top;
    const p = Math.min(Math.max(0, scrolled / totalTrackScroll), 1);
    setScrollProgress(p);
    const maxTranslate = Math.max(0, cardsRow.scrollWidth - sticky.clientWidth + 48);
    targetXRef.current = p * maxTranslate;
    const active = Math.min(Math.round((p * maxTranslate) / 380), HIGHLIGHTS.length - 1);
    setActiveCardIndex(Math.max(0, active));
  }, []);

  useEffect(() => {
    const parent = findScrollParent(trackRef.current);
    scrollParentRef.current = parent;
    const targetElement = parent || window;
    
    let scrollRaf: number | null = null;
    const onScroll = () => {
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        handleScrollUpdate();
        scrollRaf = null;
      });
    };

    targetElement.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScrollUpdate();

    const tick = () => {
      if (cardsRowRef.current) {
        const diff = targetXRef.current - currentXRef.current;
        if (Math.abs(diff) > 0.05) {
          currentXRef.current += diff * 0.12;
          cardsRowRef.current.style.transform = `translate3d(-${currentXRef.current}px, 0, 0)`;
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      targetElement.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleScrollUpdate]);

  const scrollToCard = (index: number) => {
    if (!trackRef.current || !scrollParentRef.current) return;
    const scrollParent = scrollParentRef.current;
    const trackRect = trackRef.current.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();
    const totalTrackScroll = trackRef.current.offsetHeight - (stickyRef.current?.offsetHeight || 0);
    const targetFraction = index / (HIGHLIGHTS.length - 1);
    const targetScrollInTrack = targetFraction * totalTrackScroll;
    const trackStartTop = scrollParent.scrollTop + (trackRect.top - parentRect.top);
    scrollParent.scrollTo({ top: trackStartTop + targetScrollInTrack, behavior: "smooth" });
  };

  const handleNext = () => scrollToCard(Math.min(activeCardIndex + 1, HIGHLIGHTS.length - 1));
  const handlePrev = () => scrollToCard(Math.max(activeCardIndex - 1, 0));

  const handleBuildTogetherClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const servicesSection = document.getElementById("civil-services-section");
    if (servicesSection) servicesSection.scrollIntoView({ behavior: "smooth" });
    else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectedLayer = SMART_LAYERS[activeLayer];

  return (
    <div className="w-full bg-white text-[#111827] font-display antialiased">

      {/* 1. HERO BANNER */}
      <m.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="px-3 md:px-6 py-3.5 bg-white"
      >
        <div className="relative w-full rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.14)] bg-[#111827]">
          <div className="absolute inset-0">
            <img
              src="/assets/ChatGPT Image Sep 4, 2026, 09_48_06 AM.png"
              alt="Civil engineering and smart infrastructure construction"
              className="w-full h-full object-cover"
              style={{ objectPosition: "right center" }}
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/48 via-48% to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 min-h-[400px] md:min-h-[500px] px-5 sm:px-10 md:px-16 lg:px-16 py-10 md:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 md:gap-10">
            <div className="max-w-[570px]">
              <m.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="text-[12px] font-[800] tracking-[0.12em] uppercase text-[#FF7A18] mb-3 md:mb-4"
              >
                SMART INFRASTRUCTURE
              </m.p>
              <m.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-[30px] sm:text-[46px] md:text-[58px] font-[800] leading-[1.05] tracking-[-1.5px] max-md:tracking-[-1px] text-white"
              >
                Infrastructure<br />
                that moves the<br />
                world forward<span className="text-[#7CFF00]">.</span>
              </m.h1>
            </div>

            <div className="max-w-[420px] lg:mr-2">
              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="text-[14px] sm:text-[15px] leading-[1.65] text-white/85"
              >
                From civil engineering and project delivery to smart-city systems and sustainable infrastructure, we build the physical backbone that resilient economies depend on.
              </m.p>
              <m.a
                href="#civil-services-section"
                onClick={handleBuildTogetherClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48 }}
                className="mt-6 md:mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-6 md:px-7 py-3 md:py-3.5 text-[13px] font-[700] text-[#111827] shadow-[0_8px_25px_rgba(0,0,0,0.22)] hover:bg-[#F4FFF0] hover:-translate-y-0.5 transition-all duration-300"
              >
                Build With HSS <ArrowRight className="w-4 h-4" />
              </m.a>
            </div>
          </div>
        </div>
      </m.div>

      <div className="px-3 sm:px-4 md:px-8">
      {/* 2. PINNED HORIZONTAL SCROLL CAROUSEL */}
      <div ref={trackRef} className="relative w-full h-[1500px] md:h-[2200px] mt-12 md:mt-20">
        <div ref={stickyRef} className="sticky top-0 w-full pt-4 pb-8 overflow-hidden bg-white z-20">
          <div className="flex items-center justify-between mb-4 sm:mb-8 px-1">
            <div><p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase">PROJECT HIGHLIGHTS</p><p className="text-[11.5px] text-gray-400 font-sans mt-0.5 hidden sm:block">Scroll down to slide through all projects</p></div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2"><div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#EA580C] to-[#F59E0B] rounded-full transition-all duration-150 ease-out" style={{ width: `${Math.max(10, scrollProgress * 100)}%` }} /></div><span className="font-mono text-[11px] font-semibold text-gray-400">{String(activeCardIndex + 1).padStart(2, "0")}/{String(HIGHLIGHTS.length).padStart(2, "0")}</span></div>
              <div className="flex items-center gap-2"><button onClick={handlePrev} disabled={activeCardIndex === 0} aria-label="Previous project" className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center text-gray-600 transition-colors shadow-sm cursor-pointer active:scale-95"><ChevronLeft className="w-4 h-4" /></button><button onClick={handleNext} disabled={activeCardIndex === HIGHLIGHTS.length - 1} aria-label="Next project" className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center text-gray-600 transition-colors shadow-sm cursor-pointer active:scale-95"><ChevronRight className="w-4 h-4" /></button></div>
            </div>
          </div>
          <div className="relative w-full overflow-visible py-2"><div ref={cardsRowRef} className="flex items-stretch gap-4 sm:gap-6 will-change-transform" style={{ transform: "translate3d(0px, 0, 0)" }}>{HIGHLIGHTS.map((item, index) => <div key={item.id} onClick={() => scrollToCard(index)} className="group relative shrink-0 w-[270px] sm:w-[330px] md:w-[350px] h-[340px] sm:h-[390px] rounded-[20px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.09)] border border-gray-100 bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-[0_16px_44px_rgba(234,88,12,0.18)]"><img src={item.image} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" /><div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase">{item.tag}</div><div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-colors duration-300" /><div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 p-3 sm:p-4 rounded-[16px] bg-white/95 backdrop-blur-md shadow-lg border border-white/80 transition-transform duration-300 group-hover:-translate-y-1"><h4 className="font-display text-[14px] sm:text-[15px] font-[700] text-[#111827] leading-snug">{item.title}</h4><p className="font-sans text-[12px] sm:text-[12.5px] text-[#6B7280] font-[450] mt-0.5">{item.location}</p></div></div>)}</div></div>
          <div className="flex items-center justify-between mt-4 sm:mt-5 px-1 sm:px-2"><div className="flex items-center gap-1.5">{HIGHLIGHTS.map((_, i) => <button key={i} onClick={() => scrollToCard(i)} aria-label={`Jump to project ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeCardIndex === i ? "w-6 sm:w-7 bg-[#EA580C]" : "w-2 bg-gray-200 hover:bg-gray-300"}`} />)}</div><div className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] text-gray-400 font-sans"><span>Scroll down</span><ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#EA580C]" /></div></div>
        </div>
      </div>

      {/* 3. SMART INFRASTRUCTURE — INTERACTIVE SYSTEM MAP */}
      <section className="relative mt-10 md:mt-20 rounded-[20px] overflow-hidden bg-white border border-[#E2E8F0] px-4 sm:px-10 md:px-14 lg:px-16 py-8 md:py-14 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-[#40F600]/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-[#1A6CFF]/[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1180px] mx-auto">
          <div className="max-w-[720px]">
            <p className="text-[11px] sm:text-[12px] font-[800] tracking-[0.2em] text-[#16A34A] uppercase">SMART ECO INFRASTRUCTURE</p>
            <h2 className="mt-3 md:mt-4 font-display text-[26px] sm:text-[42px] md:text-[56px] font-[800] leading-[1.08] tracking-[-1px] text-[#111827]">
              One ecosystem.<br />
              <span className="text-[#1A6CFF]">Four connected systems.</span>
            </h2>
            <p className="mt-4 md:mt-5 max-w-[650px] text-[13.5px] sm:text-[16px] leading-[1.7] text-[#64748B] font-sans">
              Smart infrastructure works when energy, water, mobility and materials are planned as one coordinated system — from the first design decision through long-term operation.
            </p>
          </div>

          <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-5 items-stretch">
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2.5 sm:gap-3">
              {SYSTEMS.map((system, index) => {
                const layerIndex = Math.min(index, SMART_LAYERS.length - 1);
                const active = activeLayer === layerIndex;
                return (
                  <m.button
                    key={system.label}
                    type="button"
                    onClick={() => setActiveLayer(layerIndex)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative text-left rounded-[18px] border p-4 sm:p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
                      active
                        ? "bg-[#F8FBFF] border-[#1A6CFF]/30 shadow-[0_14px_35px_rgba(26,108,255,0.10)]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] flex items-center justify-center text-[16px] sm:text-[18px] font-semibold transition-all duration-300 ${
                        active ? "bg-[#1A6CFF] text-white shadow-[0_6px_18px_rgba(26,108,255,0.28)]" : "bg-white text-[#64748B] border border-[#E2E8F0]"
                      }`}>{system.icon}</span>
                      <span className="font-mono text-[9px] tracking-[0.16em] text-[#94A3B8]">0{index + 1}</span>
                    </div>
                    <p className="mt-4 sm:mt-6 text-[10px] font-[800] tracking-[0.18em] text-[#64748B]">{system.label}</p>
                    <p className="mt-1 font-display text-[24px] sm:text-[31px] font-[800] text-[#111827]">{system.value}</p>
                    <p className="mt-1 text-[11px] sm:text-[11.5px] leading-relaxed text-[#64748B]">{system.detail}</p>
                    <div className="mt-3 sm:mt-4 h-1 rounded-full bg-[#E2E8F0] overflow-hidden">
                      <m.div initial={{ width: 0 }} whileInView={{ width: `${system.metric}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.1 }} className={`h-full rounded-full ${active ? "bg-gradient-to-r from-[#1A6CFF] to-[#40F600]" : "bg-[#94A3B8]"}`} />
                    </div>
                  </m.button>
                );
              })}
            </div>

            <m.div
              key={selectedLayer.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[350px] sm:min-h-[390px] rounded-[18px] bg-[#07111F] overflow-hidden border border-[#10243D] p-5 sm:p-8"
            >
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#1A6CFF]/20 blur-3xl" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="px-3 py-1 rounded-full bg-[#40F600]/10 border border-[#40F600]/20 text-[#7CFF00] text-[9px] font-[800] tracking-[0.16em]">{selectedLayer.signal}</span>
                    <span className="font-mono text-[9px] text-white/35">HSS SYSTEM VIEW</span>
                  </div>
                  <h3 className="mt-8 font-display text-[28px] sm:text-[38px] font-[800] leading-tight tracking-[-1px] text-white">{selectedLayer.title}</h3>
                  <p className="mt-4 max-w-[600px] text-[13px] sm:text-[14px] leading-[1.75] text-white/60 font-sans">{selectedLayer.text}</p>
                </div>

                <div className="relative mt-8 h-[105px]">
                  <svg viewBox="0 0 520 105" className="absolute inset-0 w-full h-full overflow-visible" fill="none">
                    <path d="M20 70 C120 12 170 12 260 52 S405 92 500 30" stroke="rgba(255,255,255,.13)" strokeWidth="1.5" strokeDasharray="5 7" />
                    <path d="M20 70 C120 12 170 12 260 52 S405 92 500 30" stroke="url(#hssSystemFlow)" strokeWidth="2" strokeDasharray="34 180" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" from="0" to="-214" dur="2.8s" repeatCount="indefinite" />
                    </path>
                    <defs>
                      <linearGradient id="hssSystemFlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#1A6CFF" />
                        <stop offset=".5" stopColor="#40F600" />
                        <stop offset="1" stopColor="#FF7A18" />
                      </linearGradient>
                    </defs>
                    {[{x:20,y:70,c:"#1A6CFF"},{x:170,y:20,c:"#40F600"},{x:330,y:68,c:"#7CFF00"},{x:500,y:30,c:"#FF7A18"}].map((node) => (
                      <circle key={node.x} cx={node.x} cy={node.y} r="4" fill={node.c}>
                        <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values=".65;1;.65" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    ))}
                  </svg>
                  <div className="absolute left-0 bottom-0 text-[8px] font-mono tracking-[0.14em] text-white/35">SOURCE</div>
                  <div className="absolute right-0 bottom-0 text-[8px] font-mono tracking-[0.14em] text-white/35">IMPACT</div>
                </div>

                <div className="flex items-end justify-between gap-5 pt-4">
                  <div>
                    <span className="font-display text-[48px] sm:text-[60px] font-[800] tracking-[-2px] text-[#7CFF00]">{selectedLayer.stat}</span>
                    <p className="text-[9px] tracking-[0.16em] text-white/35 font-[800]">{selectedLayer.statLabel}</p>
                  </div>
                  <div className="w-[42%] min-w-[130px]">
                    <div className="flex justify-between text-[8px] font-mono text-white/30 mb-2"><span>NETWORK LOAD</span><span>{selectedLayer.stat}</span></div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <m.div initial={{ width: 0 }} animate={{ width: selectedLayer.stat }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-[#1A6CFF] via-[#40F600] to-[#FF7A18]" />
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
            <span className="text-[11px] font-[700] tracking-[0.14em] text-[#64748B] uppercase">Click a system to inspect its role in the network</span>
            <span className="font-mono text-[10px] text-[#16A34A]">4 SYSTEMS / 1 NETWORK</span>
          </div>
        </div>
      </section>

      {/* 4. INFRASTRUCTURE INTELLIGENCE — SCROLL STORY */}
      <section className="mt-12 md:mt-20 rounded-[20px] overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-14 sm:px-10 md:px-14 lg:px-16">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-[720px]">
            <p className="text-[11px] sm:text-[12px] font-[800] tracking-[0.2em] text-[#1A6CFF] uppercase">INFRASTRUCTURE INTELLIGENCE</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[46px] md:text-[52px] font-[800] leading-[1.04] tracking-[-1.7px] text-[#111827]">From blueprint to <span className="text-[#16A34A]">better cycles.</span></h2>
            <p className="mt-5 text-[14px] sm:text-[16px] leading-[1.7] text-[#64748B] font-sans">A resilient project is designed to keep learning after construction. HSS connects planning, engineering, execution and optimization into one continuous delivery cycle.</p>
          </div>

          <div className="mt-12 relative">
            <div className="hidden md:block absolute left-[12%] right-[12%] top-[44px] h-[2px] bg-[#DCE3EA]" />
            <m.div
              className="hidden md:block absolute left-[12%] top-[44px] h-[2px] bg-gradient-to-r from-[#1A6CFF] via-[#40F600] to-[#FF7A18]"
              initial={{ width: 0 }}
              whileInView={{ width: "76%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-5 relative z-10">
              {[
                ["01","PLAN","Site intelligence + feasibility.","Planning"],
                ["02","DESIGN","Engineering + systems architecture.","Design"],
                ["03","BUILD","Execution + project coordination.","Delivery"],
                ["04","OPTIMIZE","Monitoring + lifecycle improvement.","Optimization"],
              ].map(([num,label,desc,meta], index) => (
                <m.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: index * 0.12 }} className="group">
                  <m.div whileHover={{ scale: 1.08 }} className={`w-[88px] h-[88px] rounded-full bg-white border-4 border-[#F8FAFC] shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex items-center justify-center mx-auto md:mx-0 transition-all duration-300 ${
                    index === 0 ? "ring-2 ring-[#1A6CFF]/20" : index === 1 ? "ring-2 ring-[#40F600]/20" : index === 2 ? "ring-2 ring-[#7CFF00]/20" : "ring-2 ring-[#FF7A18]/20"
                  }`}>
                    <span className="font-mono text-[16px] font-[800] text-[#111827]">{num}</span>
                  </m.div>
                  <div className="mt-5 text-center md:text-left">
                    <p className="text-[9px] font-mono tracking-[0.16em] text-[#94A3B8] uppercase">{meta}</p>
                    <h3 className="mt-1 font-display text-[17px] font-[800] tracking-[0.08em] text-[#111827]">{label}</h3>
                    <p className="mt-2 text-[12.5px] leading-[1.6] text-[#64748B]">{desc}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPERTISE — SERVICE ARCHITECTURE */}
      <section className="mt-12 md:mt-20 px-2 sm:px-4">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-9">
            <div>
              <p className="text-[11px] sm:text-[12px] font-[800] tracking-[0.2em] text-[#64748B] uppercase">EXPERTISE & SERVICES</p>
              <h2 className="mt-3 font-display text-[34px] sm:text-[44px] font-[800] tracking-[-1.5px] text-[#111827]">Built around the <span className="text-[#EA580C]">whole project.</span></h2>
            </div>
            <p className="max-w-[390px] text-[13.5px] leading-[1.65] text-[#64748B]">Engineering, delivery and sustainability work together to create infrastructure that performs beyond handover.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num:"01", title:"ENGINEERING", desc:"Structural engineering, civil planning and infrastructure design grounded in performance and resilience.", icon:"⌁", accent:"#1A6CFF" },
              { num:"02", title:"DELIVERY", desc:"Construction execution, project coordination and practical delivery across complex built environments.", icon:"◈", accent:"#40F600" },
              { num:"03", title:"SUSTAINABILITY", desc:"Resource-aware planning, eco infrastructure and lifecycle thinking for long-term value.", icon:"↗", accent:"#FF7A18" },
            ].map((service,index) => (
              <m.div key={service.title} whileHover={{ y:-6 }} className="group relative rounded-[18px] border border-[#E2E8F0] bg-white p-6 sm:p-7 overflow-hidden shadow-[0_8px_28px_rgba(15,23,42,0.035)] hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition-shadow duration-300">
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }} />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[#94A3B8]">{service.num}</span>
                  <m.span whileHover={{ rotate: 12 }} className="w-11 h-11 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[22px] text-[#111827]">{service.icon}</m.span>
                </div>
                <h3 className="mt-8 font-display text-[19px] font-[800] tracking-[0.06em] text-[#111827]">{service.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-[#64748B]">{service.desc}</p>
                <div className="mt-7 h-1 w-0 group-hover:w-full rounded-full transition-all duration-700" style={{ background: service.accent }} />
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BUILD WHAT COMES NEXT */}
      <section className="mt-14 md:mt-20 px-2 sm:px-4 pb-8">
        <m.div whileHover={{ y:-2 }} className="relative max-w-[1180px] mx-auto rounded-[20px] overflow-hidden bg-[#07111F] px-7 py-12 sm:px-12 md:px-16 md:py-14 shadow-[0_22px_60px_rgba(7,17,31,0.18)]">
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize:"36px 36px" }} />
          <div className="absolute -right-20 -bottom-28 w-80 h-80 rounded-full bg-[#1A6CFF]/20 blur-3xl" />
          <div className="absolute right-24 -top-20 w-56 h-56 rounded-full bg-[#40F600]/10 blur-3xl" />
          <div className="relative z-10 max-w-[760px]">
            <p className="text-[10px] font-[800] tracking-[0.2em] text-[#7CFF00] uppercase">THE NEXT ASCENT</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[46px] md:text-[54px] font-[800] leading-[1.03] tracking-[-2px] text-white">Build what comes next.</h2>
            <p className="mt-5 max-w-[650px] text-[14px] sm:text-[16px] leading-[1.7] text-white/60">Bring HSS into the project early — from infrastructure planning and engineering through delivery, sustainability and long-term optimization.</p>
            <a href="#contact" className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[13px] font-[800] text-[#07111F] hover:bg-[#F4FFF0] transition-all duration-300 hover:-translate-y-0.5">Talk to the Sherpas <ArrowRight className="w-4 h-4" /></a>
          </div>
          <div className="absolute right-8 sm:right-14 bottom-8 hidden md:block">
            <div className="relative w-52 h-36">
              <svg viewBox="0 0 208 144" className="w-full h-full" fill="none">
                <path d="M12 118 L72 58 L110 88 L160 24 L198 118" stroke="rgba(255,255,255,.18)" strokeWidth="1.5" />
                <path d="M12 118 L72 58 L110 88 L160 24 L198 118" stroke="url(#ctaFlow)" strokeWidth="2" strokeDasharray="8 10" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.4s" repeatCount="indefinite" />
                </path>
                <defs>
                  <linearGradient id="ctaFlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#1A6CFF" />
                    <stop offset=".55" stopColor="#40F600" />
                    <stop offset="1" stopColor="#FF7A18" />
                  </linearGradient>
                </defs>
                <circle cx="72" cy="58" r="5" fill="#40F600"><animate attributeName="r" values="5;8;5" dur="1.8s" repeatCount="indefinite" /></circle>
                <circle cx="160" cy="24" r="5" fill="#FF7A18"><animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </m.div>
      </section>

      </div>
    </div>
  );
}
