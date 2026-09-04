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
  {
    id: "viaduct-interchange",
    title: "Viaduct Interchange",
    location: "North Corridor",
    tag: "EXPRESSWAY",
    image: "/images/pillar3/highway-overpass.jpg",
    alt: "Elevated highway interchange under active civil construction",
  },
  {
    id: "apex-bridge-seattle",
    title: "Apex Bridge - Seattle",
    location: "Seattle",
    tag: "CABLE-STAYED",
    image: "/images/pillar3/apex-bridge.jpg",
    alt: "Cable-stayed Apex Bridge in Seattle during sunset",
  },
  {
    id: "smart-city-beaocithe",
    title: "Smart City - Beaocithe",
    location: "Latino City",
    tag: "SMART ECO-SYSTEM",
    image: "/images/pillar3/smart-city.jpg",
    alt: "Futuristic eco-friendly smart city with vertical green architecture",
  },
  {
    id: "eco-transit-hub",
    title: "Eco Transit Hub",
    location: "Metropolitan Center",
    tag: "HIGH-SPEED RAIL",
    image: "/images/pillar3/metro-transit.jpg",
    alt: "Modern high-speed rail transit hub and terminal",
  },
  {
    id: "harbor-suspension-gateway",
    title: "Harbor Suspension Gateway",
    location: "Coastal Bay",
    tag: "DEEPWATER INFRA",
    image: "/images/pillar3/apex-bridge.jpg",
    alt: "Deepwater civil suspension bridge project",
  },
  {
    id: "sustainable-energy-district",
    title: "Sustainable Energy Grid",
    location: "Western Basin",
    tag: "CLEAN INFRA",
    image: "/images/pillar3/smart-city.jpg",
    alt: "Modern sustainable civil grid infrastructure",
  },
];

const EXPERTISE = [
  {
    title: "Structural Engineering",
    description: "Innovating resilient structures.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M8 10h.01" />
        <path d="M16 10h.01" />
        <path d="M8 14h.01" />
        <path d="M16 14h.01" />
      </svg>
    ),
  },
  {
    title: "Civil Works",
    description: "Essential public infrastructure.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Sustainability Consulting",
    description: "Eco-friendly solutions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
];

const PROCESS_STEPS = [
  {
    number: "1",
    label: "PLAN",
    description: "Strategic roadmap.",
    badgeBg: "bg-[#D1FAE5]",
    badgeText: "text-[#059669]",
    badgeBorder: "border-[#A7F3D0]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    number: "2",
    label: "DESIGN",
    description: "Creative solutions.",
    badgeBg: "bg-[#DBEAFE]",
    badgeText: "text-[#2563EB]",
    badgeBorder: "border-[#BFDBFE]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    number: "3",
    label: "BUILD",
    description: "Execution & construction.",
    badgeBg: "bg-[#EDE9FE]",
    badgeText: "text-[#7C3AED]",
    badgeBorder: "border-[#DDD6FE]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    number: "4",
    label: "OPTIMIZE",
    description: "Continuous improvement.",
    badgeBg: "bg-[#FCE7F3]",
    badgeText: "text-[#DB2777]",
    badgeBorder: "border-[#FBCFE8]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export function EcoSmartInfraShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);

  // Helper to find the scrollable modal container
  const findScrollParent = (node: HTMLElement | null): HTMLElement | null => {
    if (!node) return null;
    let current: HTMLElement | null = node.parentElement;
    while (current) {
      const style = window.getComputedStyle(current);
      if (
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        current.scrollHeight > current.clientHeight
      ) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  };

  // Update calculation on scroll
  const handleScrollUpdate = useCallback(() => {
    if (!trackRef.current || !stickyRef.current || !cardsRowRef.current) return;

    const track = trackRef.current;
    const sticky = stickyRef.current;
    const cardsRow = cardsRowRef.current;
    const scrollParent = scrollParentRef.current;

    const parentRect = scrollParent
      ? scrollParent.getBoundingClientRect()
      : { top: 0, height: window.innerHeight };

    const trackRect = track.getBoundingClientRect();

    // The scrollable distance of the outer track
    const totalTrackScroll = track.offsetHeight - sticky.offsetHeight;
    if (totalTrackScroll <= 0) return;

    // Scrolled distance inside the track
    const scrolled = parentRect.top - trackRect.top;
    const rawProgress = scrolled / totalTrackScroll;
    const p = Math.min(Math.max(0, rawProgress), 1);

    setScrollProgress(p);

    // Max horizontal translation distance needed to reveal all cards
    const maxTranslate = Math.max(0, cardsRow.scrollWidth - sticky.clientWidth + 48);
    targetXRef.current = p * maxTranslate;

    // Active card index
    const singleCardWidth = 380;
    const active = Math.min(
      Math.round((p * maxTranslate) / singleCardWidth),
      HIGHLIGHTS.length - 1
    );
    setActiveCardIndex(Math.max(0, active));
  }, []);

  useEffect(() => {
    const parent = findScrollParent(trackRef.current);
    scrollParentRef.current = parent;
    const targetElement = parent || window;

    targetElement.addEventListener("scroll", handleScrollUpdate, { passive: true });
    window.addEventListener("resize", handleScrollUpdate, { passive: true });
    handleScrollUpdate();

    // Ultra-smooth lerp animation loop (60fps/120fps fluid motion)
    const tick = () => {
      if (cardsRowRef.current) {
        const diff = targetXRef.current - currentXRef.current;
        if (Math.abs(diff) > 0.05) {
          // Lerp damping factor 0.12 gives a butter-smooth inertia glide
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

  // Navigate by step with arrows
  const scrollToCard = (index: number) => {
    if (!trackRef.current || !scrollParentRef.current) return;
    const scrollParent = scrollParentRef.current;
    const trackRect = trackRef.current.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();
    const totalTrackScroll =
      trackRef.current.offsetHeight - (stickyRef.current?.offsetHeight || 0);

    const targetFraction = index / (HIGHLIGHTS.length - 1);
    const targetScrollInTrack = targetFraction * totalTrackScroll;
    const trackStartTop = scrollParent.scrollTop + (trackRect.top - parentRect.top);

    scrollParent.scrollTo({
      top: trackStartTop + targetScrollInTrack,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    const nextIndex = Math.min(activeCardIndex + 1, HIGHLIGHTS.length - 1);
    scrollToCard(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(activeCardIndex - 1, 0);
    scrollToCard(prevIndex);
  };

  const handleBuildTogetherClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const servicesSection = document.getElementById("civil-services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full text-[#111827] font-display antialiased">
      {/* ============================================================ */}
      {/* 1. HERO BANNER                                               */}
      {/* ============================================================ */}
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-orange-200/50 bg-[#F59E0B]"
      >
        {/* Background Image & Ambient Lighting */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/pillar3/hero-banner.jpg"
            alt="Civil engineering and infrastructure construction"
            className="w-full h-full object-cover object-right md:object-center"
          />
          {/* Vibrant Figma-accurate Gradient Layer: Orange glow on left transitioning to cyan/clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] via-[#FFAE00]/90 via-40% md:via-50% to-[#0284C7]/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/95 via-[#FFA800]/80 via-45% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[620px] p-7 sm:p-10 md:p-14 lg:p-16 flex flex-col items-start justify-center min-h-[380px] md:min-h-[440px]">
          <h1 className="font-display text-[32px] sm:text-[42px] md:text-[48px] font-[800] leading-[1.1] tracking-[-1px] text-[#111827]">
            <span className="text-[#FF4A00] font-[900]">Building</span> durable foundations for tomorrow&apos;s world<span className="text-[#10B981]">.</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-[14px] sm:text-[15.5px] leading-[1.65] text-[#27272A] font-[450] max-w-[480px]">
            We connect businesses with qualified professionals across markets, helping organizations build reliable teams without the complexity of international hiring.
          </p>

          <a
            href="#civil-services-section"
            onClick={handleBuildTogetherClick}
            className="mt-6 sm:mt-8 group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-[14px] font-[600] tracking-wide shadow-[0_8px_20px_rgba(0,102,255,0.35)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Let&apos;s Build Together</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </m.div>

      {/* ============================================================ */}
      {/* 2. PINNED HORIZONTAL SCROLL CAROUSEL                         */}
      {/* Tall outer track: provides scrollable height for pinning!    */}
      {/* ============================================================ */}
      <div
        ref={trackRef}
        className="relative w-full h-[2200px] mt-16 md:mt-20"
      >
        {/* Sticky Viewport Container: stays pinned while scrolling! */}
        <div
          ref={stickyRef}
          className="sticky top-0 w-full pt-4 pb-8 overflow-hidden bg-white z-20"
        >
          {/* Section Header & Navigation Controls */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase">
                  PROJECT HIGHLIGHTS
                </p>
                <p className="text-[11.5px] text-gray-400 font-sans mt-0.5 hidden sm:block">
                  Scroll down to slide through all projects
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress Bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#EA580C] to-[#F59E0B] rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-semibold text-gray-400">
                  {String(activeCardIndex + 1).padStart(2, "0")}/{String(HIGHLIGHTS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={activeCardIndex === 0}
                  aria-label="Previous project"
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeCardIndex === HIGHLIGHTS.length - 1}
                  aria-label="Next project"
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sliding Cards Track: Translated smoothly via lerp */}
          <div className="relative w-full overflow-visible py-2">
            <div
              ref={cardsRowRef}
              className="flex items-stretch gap-6 will-change-transform"
              style={{ transform: "translate3d(0px, 0, 0)" }}
            >
              {HIGHLIGHTS.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => scrollToCard(index)}
                  className="group relative shrink-0 w-[300px] sm:w-[330px] md:w-[350px] h-[360px] sm:h-[390px] rounded-[24px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.09)] border border-gray-100 bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-[0_16px_44px_rgba(234,88,12,0.18)]"
                >
                  {/* Background Image */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  />

                  {/* Top Pill Tag */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase">
                    {item.tag}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-colors duration-300" />

                  {/* Floating Bottom Card Pill matching Figma screenshot */}
                  <div className="absolute bottom-5 left-5 right-5 p-3.5 sm:p-4 rounded-[16px] bg-white/95 backdrop-blur-md shadow-lg border border-white/80 transition-transform duration-300 group-hover:-translate-y-1">
                    <h4 className="font-display text-[15px] font-[700] text-[#111827] leading-snug">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[12.5px] text-[#6B7280] font-[450] mt-0.5">
                      {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Pagination Dots & Scroll Guidance Indicator */}
          <div className="flex items-center justify-between mt-5 px-2">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {HIGHLIGHTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  aria-label={`Jump to project ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeCardIndex === i
                      ? "w-7 bg-[#EA580C]"
                      : "w-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Scroll Hint */}
            <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 font-sans">
              <span>Scroll down to continue</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#EA580C]" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. EXPERTISE & SERVICES                                      */}
      {/* ============================================================ */}
      <div className="mt-12 md:mt-16 pt-16 border-t border-gray-100 w-full">
        <p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase text-center mb-10 sm:mb-14">
          EXPERTISE & SERVICES
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-[960px] mx-auto text-left">
          {EXPERTISE.map((exp, idx) => (
            <m.div
              key={exp.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="flex flex-col items-start group"
            >
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 + 0.1, ease: "easeOut" }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-[#111827] group-hover:text-[#EA580C] transition-colors duration-300"
              >
                {exp.icon}
              </m.div>
              <m.h3
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 + 0.2, ease: "easeOut" }}
                className="mt-2 font-display text-[17px] sm:text-[18px] font-[700] text-[#111827] leading-snug"
              >
                {exp.title}
              </m.h3>
              <m.p
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 + 0.3, ease: "easeOut" }}
                className="mt-1 font-sans text-[13.5px] sm:text-[14px] text-[#64748B] leading-relaxed"
              >
                {exp.description}
              </m.p>
            </m.div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. OUR PROCESS                                               */}
      {/* ============================================================ */}
      <div className="mt-20 md:mt-24 pt-12 border-t border-gray-100 w-full pb-8">
        <p className="text-[12px] sm:text-[13px] font-[700] tracking-[0.18em] text-[#64748B] uppercase text-center mb-12 sm:mb-16">
          OUR PROCESS
        </p>

        <div className="relative max-w-[960px] mx-auto">
          {/* Subtle Connecting Line across the badges */}
          <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-[#E2E8F0] z-0" />

          {/* 4 Process Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {PROCESS_STEPS.map((step, idx) => (
              <m.div
                key={step.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Numbered Badge */}
                <div
                  className={`w-9 h-9 rounded-full ${step.badgeBg} ${step.badgeText} border ${step.badgeBorder} font-bold text-[14px] flex items-center justify-center shadow-xs mb-4`}
                >
                  {step.number}
                </div>

                {/* Step Icon & Title */}
                <div className="flex items-center gap-2 text-[#111827] mt-1 mb-1">
                  <span className="text-[#374151]">{step.icon}</span>
                  <h4 className="font-display text-[13px] sm:text-[14px] font-[800] tracking-[0.08em] text-[#111827] uppercase">
                    {step.label}
                  </h4>
                </div>

                {/* Step Description */}
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#64748B] leading-normal">
                  {step.description}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
