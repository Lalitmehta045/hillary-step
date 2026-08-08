"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motion/FadeIn";

const NAV = ["Home", "About", "Global Presence", "Careers", "Contact"];

export function Hero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(scrollY, [0, 80], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]);
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(12px)"]);
  const headerBorder = useTransform(scrollY, [0, 80], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.05)"]);

  // Parallax for background
  const y = useTransform(scrollY, [0, 1000], [0, 150]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <section className="relative min-h-[1190px] max-md:min-h-[850px] max-lg:min-h-[1000px] w-full overflow-hidden bg-white">
      <motion.img
        style={{ y }}
        src="/assets/hero-towers.png"
        alt="Glass skyscrapers photographed from street level against an overcast sky"
        className="absolute inset-0 h-[110%] w-full object-cover brightness-[1.55] contrast-[0.9] saturate-0"
      />
      <div className="absolute inset-x-0 top-0 h-[120px] bg-linear-to-b from-white/80 to-transparent pointer-events-none" />

      {/* Navigation */}
      <motion.header 
        style={{ 
          backgroundColor: headerBackground, 
          backdropFilter: headerBlur,
          borderBottomWidth: 1,
          borderBottomColor: headerBorder
        }}
        className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-[64px] max-md:px-[24px] max-lg:px-[40px] py-[24px]">
          <a href="#" className="shrink-0 leading-none">
            <img
              src="/assets/logo-hillary-step.png"
              alt="Hillary Step Solutions Logo"
              className="h-[43px] w-[63px] object-contain"
            />
          </a>

          <nav className="hidden items-center gap-[36px] lg:flex">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans text-[14px] font-[510] leading-[20px] text-[#111111] transition-opacity hover:opacity-70"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[24px] max-lg:hidden">
            <button
              type="button"
              className="flex items-center gap-[7px] font-sans text-[14px] font-[510] leading-[20px] text-[#111111]"
            >
              <GlobeIcon />
              USA
              <ChevronIcon />
            </button>
            <motion.a
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
              href="#"
              className="flex h-[44px] items-center gap-[9px] rounded-full border border-[#111111]/10 bg-white/50 px-[22px] font-sans text-[14px] font-[510] leading-[20px] text-[#111111] backdrop-blur-sm"
            >
              Admin Portal
              <ArrowUpRight />
            </motion.a>
          </div>

          <button
            className="lg:hidden flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-black/10 text-ink"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-in fade-in duration-300">
          <div className="mx-auto flex w-full items-center justify-between px-[24px] pt-[24px] pb-[24px]">
            <a href="#" className="shrink-0 leading-none" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="/assets/logo-hillary-step.png"
                alt="Hillary Step Solutions Logo"
                className="h-[43px] w-[63px] object-contain"
              />
            </a>
            <button
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-black/5 border border-black/10 text-black"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex flex-col px-[24px] pt-[40px] gap-[32px]">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-[32px] font-[600] leading-[36px] text-[#111111]"
              >
                {item}
              </a>
            ))}
            <div className="mt-[40px] flex flex-col gap-[16px] border-t border-black/10 pt-[40px]">
              <a
                href="#"
                className="flex h-[54px] w-full items-center justify-center gap-[9px] rounded-full bg-brand-blue px-[22px] font-sans text-[16px] font-semibold text-white"
              >
                Admin Portal
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero copy */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[64px] max-md:px-[24px] max-lg:px-[40px] pt-[262px] max-md:pt-[120px] max-lg:pt-[180px]">
        <StaggerContainer>
          <StaggerItem>
            <h1 className="max-w-[690px] max-md:max-w-full font-display text-[88px] max-md:text-[44px] max-lg:text-[64px] font-[700] leading-[88px] max-md:leading-[48px] max-lg:leading-[68px] tracking-[-2.2px] max-md:tracking-[-1px] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.28)] max-md:[text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
              Connecting Technology, Talent, and Global Growth.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[38px] max-md:mt-[24px] max-w-[620px] max-md:max-w-full font-sans text-[20px] max-md:text-[17px] font-normal leading-[28px] max-md:leading-[24px] text-[#1B1B1C] max-md:text-white max-md:[text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
              A global technology and workforce partner delivering AI, software engineering, digital
              transformation, and international staffing solutions.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-[24px] max-md:mt-[32px] flex items-center gap-[16px] max-md:flex-col max-md:items-stretch max-md:gap-[12px]">
              <motion.a
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0px 8px 20px rgba(0,85,255,0.3)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                href="#"
                className="flex h-[54px] max-md:justify-center items-center gap-[13px] rounded-full bg-brand-blue px-[30px] font-sans text-[17px] font-semibold text-white shadow-[0px_4px_10px_rgba(0,85,255,0.2)]"
              >
                Explore Global Projects
                <ArrowRight />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                href="#"
                className="flex h-[54px] max-md:justify-center items-center gap-[12px] rounded-full border border-white/60 bg-white/20 px-[30px] font-sans text-[17px] font-semibold text-ink max-md:text-white max-md:bg-black/30 max-md:border-white/30 backdrop-blur-sm shadow-[0px_4px_10px_rgba(0,0,0,0.05)]"
              >
                Partner With Us
                <ArrowUpRight />
              </motion.a>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Bottom row */}
      <div className="absolute inset-x-0 bottom-[38px] max-md:bottom-[24px] z-10 pointer-events-none">
        <FadeIn delay={0.6}>
          <div className="mx-auto flex w-full max-w-[1440px] h-[48px] items-center px-[64px] max-md:px-[24px] max-lg:px-[40px]">
            <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#252525]">
              <span className="font-serif text-[22px] italic text-white">N</span>
            </div>
            <span className="mx-auto font-sans text-[14px] tracking-[0.22em] text-white/60">
              SCROLL
            </span>
            <div className="w-[54px]" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}


