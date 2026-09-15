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
    targetElement.addEventListener("scroll", handleScrollUpdate, { passive: true });
    window.addEventListener("resize", handleScrollUpdate, { passive: true });
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
      targetElement.removeEventListener("scroll", handleScrollUpdate);
      window.removeEventListener("resize", handleScrollUpdate);
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
    <div className="w-full text-[#111827] font-display antialiased">
      {/* 1. HERO BANNER */}
      <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative w-full rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 w-full h-full">
          <img src="/assets/ChatGPT Image Sep 4, 2026, 09_48_06 AM.png" alt="Civil engineering and infrastructure construction" className="w-full h-full object-cover" style={{ objectPosition: "right top" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7200] via-[#FFA000] via-38% md:via-48% to-transparent mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/80 via-[#FFA200]/60 via-42% to-transparent pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-[620px] p-7 sm:p-10 md:p-14 lg:p-16 flex flex-col items-start justify-center min-h-[400px] md:min-h-[470px]">
          <m.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.20 }} className="font-display text-[32px] sm:text-[42px] md:text-[48px] font-[800] leading-[1.1] tracking-[-1px] text-[#111827]"><span className="text-[#FF4A00] font-[900]">Building</span> durable foundations for tomorrow&apos;s world<span className="text-[#10B981]">.</span></m.h1>
          <m.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }} className="mt-4 sm:mt-5 text-[14px] sm:text-[15.5px] leading-[1.65] text-[#27272A] font-[450] max-w-[480px]">We connect businesses with qualified professionals across markets, helping organizations build reliable teams without the complexity of international hiring.</m.p>
          <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 1, 1], delay: 0.50 }}>
            <a href="#civil-services-section" onClick={handleBuildTogetherClick} className="mt-6 sm:mt-8 group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-[14px] font-[600] tracking-wide shadow-[0_8px_20px_rgba(0,102,255,0.35)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">Let&apos;s Build Together<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" /></a>
          </m.div>
        </div>
      </m.div>

      {/* 2. PINNED HORIZONTAL SCROLL CAROUSEL */}
      <div ref={trackRef} className="relative w-full h-[2200px] mt-16 md:mt-20">
        <div ref={stickyRef} className="sticky top-0 w-full pt-4 pb-8 overflow-hidden bg-white z-20">
          <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
            <div><p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase">PROJECT HIGHLIGHTS</p><p className="text-[11.5px] text-gray-400 font-sans mt-0.5 hidden sm:block">Scroll down to slide through all projects</p></div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2"><div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#EA580C] to-[#F59E0B] rounded-full transition-all duration-150 ease-out" style={{ width: `${Math.max(10, scrollProgress * 100)}%` }} /></div><span className="font-mono text-[11px] font-semibold text-gray-400">{String(activeCardIndex + 1).padStart(2, "0")}/{String(HIGHLIGHTS.length).padStart(2, "0")}</span></div>
              <div className="flex items-center gap-2"><button onClick={handlePrev} disabled={activeCardIndex === 0} aria-label="Previous project" className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center text-gray-600 transition-colors shadow-sm cursor-pointer active:scale-95"><ChevronLeft className="w-4 h-4" /></button><button onClick={handleNext} disabled={activeCardIndex === HIGHLIGHTS.length - 1} aria-label="Next project" className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center text-gray-600 transition-colors shadow-sm cursor-pointer active:scale-95"><ChevronRight className="w-4 h-4" /></button></div>
            </div>
          </div>
          <div className="relative w-full overflow-visible py-2"><div ref={cardsRowRef} className="flex items-stretch gap-6 will-change-transform" style={{ transform: "translate3d(0px, 0, 0)" }}>{HIGHLIGHTS.map((item, index) => <div key={item.id} onClick={() => scrollToCard(index)} className="group relative shrink-0 w-[300px] sm:w-[330px] md:w-[350px] h-[360px] sm:h-[390px] rounded-[24px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.09)] border border-gray-100 bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-[0_16px_44px_rgba(234,88,12,0.18)]"><img src={item.image} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" /><div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase">{item.tag}</div><div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-colors duration-300" /><div className="absolute bottom-5 left-5 right-5 p-3.5 sm:p-4 rounded-[16px] bg-white/95 backdrop-blur-md shadow-lg border border-white/80 transition-transform duration-300 group-hover:-translate-y-1"><h4 className="font-display text-[15px] font-[700] text-[#111827] leading-snug">{item.title}</h4><p className="font-sans text-[12.5px] text-[#6B7280] font-[450] mt-0.5">{item.location}</p></div></div>)}</div></div>
          <div className="flex items-center justify-between mt-5 px-2"><div className="flex items-center gap-1.5">{HIGHLIGHTS.map((_, i) => <button key={i} onClick={() => scrollToCard(i)} aria-label={`Jump to project ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeCardIndex === i ? "w-7 bg-[#EA580C]" : "w-2 bg-gray-200 hover:bg-gray-300"}`} />)}</div><div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 font-sans"><span>Scroll down to continue</span><ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#EA580C]" /></div></div>
        </div>
      </div>

      {/* 3. SMART ECO INFRASTRUCTURE SYSTEM */}
      <section className="relative mt-12 md:mt-20 rounded-[28px] overflow-hidden bg-[#F5F7F2] border border-[#E5E7EB] px-6 py-14 sm:px-10 md:px-14 lg:px-16">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#D1FAE5]/70 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-[1180px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 md:mb-14">
            <div className="max-w-[650px]"><p className="text-[12px] font-[800] tracking-[0.2em] text-[#059669] uppercase mb-4">SMART ECO INFRASTRUCTURE</p><h2 className="font-display text-[34px] sm:text-[46px] md:text-[54px] font-[800] leading-[1.04] tracking-[-1.8px] text-[#111827]">Infrastructure that <span className="text-[#059669]">thinks in systems.</span></h2><p className="mt-5 max-w-[600px] text-[15px] sm:text-[16px] leading-[1.7] text-[#64748B] font-sans">We design connected infrastructure where energy, water, mobility and materials work together — reducing waste while improving resilience, efficiency and long-term performance.</p></div>
            <div className="shrink-0 rounded-2xl bg-white border border-[#E5E7EB] px-5 py-4 shadow-sm"><p className="text-[10px] font-[800] tracking-[0.18em] text-[#94A3B8] uppercase">SYSTEM STATUS</p><div className="flex items-center gap-2 mt-2"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /><span className="font-mono text-[12px] text-[#334155]">4 NETWORKS CONNECTED</span></div></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{SYSTEMS.map((system, index) => <m.div key={system.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: index * 0.08 }} whileHover={{ y: -6 }} className="group rounded-[22px] bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)] transition-shadow duration-300"><div className="flex items-center justify-between"><span className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center text-[20px] font-semibold group-hover:scale-105 transition-transform">{system.icon}</span><span className="font-mono text-[10px] tracking-[0.16em] text-[#94A3B8]">0{index + 1}</span></div><p className="mt-6 text-[11px] font-[800] tracking-[0.18em] text-[#64748B]">{system.label}</p><div className="flex items-end justify-between mt-1"><span className="font-display text-[36px] font-[800] tracking-[-1px] text-[#111827]">{system.value}</span><span className="text-[11px] text-[#10B981] font-semibold mb-1">ACTIVE</span></div><p className="mt-1 text-[12.5px] text-[#64748B] font-sans">{system.detail}</p><div className="mt-5 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><m.div initial={{ width: 0 }} whileInView={{ width: `${system.metric}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.12 }} className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399]" /></div></m.div>)}</div>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-4"><m.div whileHover={{ scale: 1.005 }} className="relative min-h-[220px] rounded-[22px] bg-[#111827] overflow-hidden p-6 sm:p-8 text-white"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "34px 34px" }} /><div className="relative z-10 max-w-[520px]"><p className="text-[10px] font-[800] tracking-[0.2em] text-[#6EE7B7] uppercase">CONNECTED INFRASTRUCTURE</p><h3 className="mt-3 font-display text-[25px] sm:text-[31px] font-[750] leading-tight">One network. Multiple systems. Measurable impact.</h3><p className="mt-3 text-[13px] leading-relaxed text-white/60 font-sans">Digital monitoring, resilient engineering and sustainable planning come together to keep infrastructure adaptive from construction through operation.</p></div><div className="absolute right-8 bottom-7 hidden sm:block"><div className="relative w-32 h-20"><span className="absolute left-0 top-8 w-4 h-4 rounded-full bg-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.7)]" /><span className="absolute right-0 top-0 w-3 h-3 rounded-full bg-[#60A5FA]" /><span className="absolute right-4 bottom-0 w-3 h-3 rounded-full bg-[#F59E0B]" /><svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 80" fill="none"><path d="M8 40L104 7M8 40L100 70" stroke="rgba(255,255,255,.25)" strokeDasharray="4 5" /></svg></div></div></m.div><m.div whileHover={{ y: -4 }} className="rounded-[22px] bg-white border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div><p className="text-[10px] font-[800] tracking-[0.2em] text-[#94A3B8] uppercase">DESIGN PRINCIPLE</p><div className="mt-5 w-12 h-12 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] flex items-center justify-center text-[#059669] text-xl">↻</div><h3 className="mt-5 font-display text-[22px] font-[800] text-[#111827]">Build for the next cycle.</h3><p className="mt-2 text-[13px] leading-relaxed text-[#64748B] font-sans">Plan beyond the handover with systems designed for maintenance, adaptation and continuous improvement.</p></div><div className="mt-7 flex items-center gap-2 text-[12px] font-semibold text-[#059669]">RESILIENT BY DESIGN <ArrowRight className="w-4 h-4" /></div></m.div></div>
        </div>
      </section>

      {/* 4. SMART INFRASTRUCTURE CONTROL LAYERS */}
      <section className="mt-12 md:mt-20 rounded-[28px] overflow-hidden bg-[#111827] text-white px-6 py-14 sm:px-10 md:px-14 lg:px-16">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-[700px]">
            <p className="text-[11px] sm:text-[12px] font-[800] tracking-[0.2em] text-[#6EE7B7] uppercase">INFRASTRUCTURE CONTROL LAYERS</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[46px] md:text-[52px] font-[800] leading-[1.05] tracking-[-1.6px]">See how the <span className="text-[#6EE7B7]">eco-system connects.</span></h2>
            <p className="mt-5 text-[14px] sm:text-[16px] leading-[1.7] text-white/60 font-sans">Smart infrastructure is not one technology. It is a coordinated network of physical assets, environmental systems and operational intelligence.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {SMART_LAYERS.map((layer, index) => (
                <button key={layer.id} onClick={() => setActiveLayer(index)} className={`text-left rounded-[18px] border p-4 sm:p-5 transition-all duration-300 cursor-pointer ${activeLayer === index ? "bg-white text-[#111827] border-white shadow-[0_14px_40px_rgba(0,0,0,0.2)]" : "bg-white/[0.04] text-white border-white/10 hover:bg-white/[0.08] hover:border-white/20"}`}>
                  <div className="flex items-center justify-between"><span className={`font-mono text-[10px] tracking-[0.16em] ${activeLayer === index ? "text-[#059669]" : "text-white/40"}`}>{layer.signal}</span><span className={`w-2 h-2 rounded-full ${activeLayer === index ? "bg-[#10B981]" : "bg-white/20"}`} /></div>
                  <p className={`mt-5 text-[11px] font-[800] tracking-[0.16em] ${activeLayer === index ? "text-[#64748B]" : "text-white/50"}`}>{layer.label}</p>
                  <h3 className="mt-1 font-display text-[17px] sm:text-[19px] font-[750]">{layer.title}</h3>
                </button>
              ))}
            </div>

            <m.div key={selectedLayer.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="relative min-h-[360px] rounded-[22px] border border-white/10 bg-[#182231] overflow-hidden p-6 sm:p-8 md:p-10">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 75% 25%, rgba(110,231,183,.22) 0, transparent 28%), linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)", backgroundSize: "100% 100%, 30px 30px, 30px 30px" }} />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between"><span className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#6EE7B7] text-[10px] font-[800] tracking-[0.15em]">{selectedLayer.label}</span><span className="font-mono text-[10px] text-white/30">LIVE SYSTEM VIEW</span></div>
                  <h3 className="mt-8 font-display text-[28px] sm:text-[36px] font-[800] tracking-[-1px]">{selectedLayer.title}</h3>
                  <p className="mt-4 max-w-[620px] text-[13.5px] sm:text-[14px] leading-[1.75] text-white/60 font-sans">{selectedLayer.text}</p>
                </div>
                <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <div><span className="font-display text-[54px] sm:text-[68px] font-[800] tracking-[-3px] text-[#6EE7B7]">{selectedLayer.stat}</span><p className="text-[10px] tracking-[0.18em] text-white/35 font-[800]">{selectedLayer.statLabel}</p></div>
                  <div className="w-full sm:max-w-[260px]"><div className="flex justify-between text-[9px] font-mono text-white/30 mb-2"><span>SYSTEM LOAD</span><span>{selectedLayer.stat}</span></div><div className="h-2 rounded-full bg-white/10 overflow-hidden"><m.div initial={{ width: 0 }} animate={{ width: selectedLayer.stat }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#6EE7B7]" /></div></div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* 5. EXPERTISE & SERVICES */}
      <div className="mt-12 md:mt-16 pt-16 border-t border-gray-100 w-full">
        <p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase text-center mb-10 sm:mb-14">EXPERTISE & SERVICES</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-[960px] mx-auto text-left">
          {EXPERTISE.map((exp, idx) => <m.div key={exp.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ duration: 0.4, delay: idx * 0.15 }} className="flex flex-col items-start group"><m.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 + 0.1, ease: "easeOut" }} className="w-12 h-12 rounded-xl flex items-center justify-center text-[#111827] group-hover:text-[#EA580C] transition-colors duration-300">{exp.icon}</m.div><m.h3 initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 + 0.2, ease: "easeOut" }} className="mt-2 font-display text-[17px] sm:text-[18px] font-[700] text-[#111827] leading-snug">{exp.title}</m.h3><m.p initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 + 0.3, ease: "easeOut" }} className="mt-1 font-sans text-[13.5px] sm:text-[14px] text-[#64748B] leading-relaxed">{exp.description}</m.p></m.div>)}
        </div>
      </div>

      {/* 6. OUR PROCESS */}
      <div className="mt-20 md:mt-24 pt-12 border-t border-gray-100 w-full pb-8">
        <p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase text-center mb-12 sm:mb-16">OUR PROCESS</p>
        <div className="relative max-w-[960px] mx-auto"><div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-[#E2E8F0] z-0" /><div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">{PROCESS_STEPS.map((step, idx) => <m.div key={step.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="flex flex-col items-center text-center"><div className={`w-9 h-9 rounded-full ${step.badgeBg} ${step.badgeText} border ${step.badgeBorder} font-bold text-[14px] flex items-center justify-center shadow-xs mb-4`}>{step.number}</div><div className="flex items-center gap-2 text-[#111827] mt-1 mb-1"><span className="text-[#374151]">{step.icon}</span><h4 className="font-display text-[13px] sm:text-[14px] font-[800] tracking-[0.08em] text-[#111827] uppercase">{step.label}</h4></div><p className="font-sans text-[12.5px] sm:text-[13px] text-[#64748B] leading-normal">{step.description}</p></m.div>)}</div></div>
      </div>
    </div>
  );
}
