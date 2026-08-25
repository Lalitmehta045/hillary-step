"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const NAV = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Our Capabilities", href: "/#capabilities" },
  { name: "Global Presence", href: "/#global-presence" },
  { name: "Contact", href: "/#contact" }
];
const TOP_TRIGGER_ZONE = 75; // px from top of viewport
const HIDE_DELAY_MS = 250; // ms to wait before hiding on mouse leave
const SCROLL_THRESHOLD = 80; // px scroll offset considered "Hero / top of page"

export function Navbar() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("USA");

  const REGIONS = ["USA", "IND", "AUS"];
  const REGION_FLAGS: Record<string, string> = {
    USA: "https://flagcdn.com/us.svg",
    IND: "https://flagcdn.com/in.svg",
    AUS: "https://flagcdn.com/au.svg"
  };

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOverNavbarRef = useRef(false);

  // Clear hide timer helper
  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // Schedule hiding the navbar after HIDE_DELAY_MS
  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setIsRevealed(false);
      hideTimerRef.current = null;
    }, HIDE_DELAY_MS);
  }, [clearHideTimer]);

  // Reveal navbar immediately
  const revealNavbar = useCallback(() => {
    clearHideTimer();
    setIsRevealed(true);
  }, [clearHideTimer]);

  // Scroll detection — efficient passive listener
  useEffect(() => {
    const handleScroll = () => {
      const atTop = window.scrollY <= SCROLL_THRESHOLD;
      setIsAtTop((prev) => (prev !== atTop ? atTop : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Viewport & Pointer tracking for desktop hover reveal
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore touch events or mobile viewports
      if (e.pointerType === "touch" || window.innerWidth < 1024) return;

      if (e.clientY <= TOP_TRIGGER_ZONE) {
        revealNavbar();
      } else if (!isOverNavbarRef.current) {
        // Pointer is below trigger zone and not over the navbar
        if (!hideTimerRef.current && isRevealed) {
          scheduleHide();
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", checkDesktop);
      window.removeEventListener("pointermove", handlePointerMove);
      clearHideTimer();
    };
  }, [revealNavbar, scheduleHide, clearHideTimer, isRevealed]);

  // Body scroll lock on mobile menu open
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

  // Determine visibility state
  // On mobile (< 1024px) or when at the top of the page (Hero), always visible.
  // When scrolled down on desktop, visible only when revealed by hover.
  const isVisible = !isDesktop || isAtTop || isRevealed;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && window.location.pathname === '/') {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      } else if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '#home');
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <>
      {/* Invisible desktop top hover trigger zone (active only when scrolled down) */}
      {isDesktop && !isAtTop && (
        <div
          className="fixed top-0 inset-x-0 h-[75px] z-40 pointer-events-auto"
          onMouseEnter={revealNavbar}
          aria-hidden="true"
        />
      )}

      {/* Main Navbar Header */}
      <header
        onMouseEnter={() => {
          if (!isDesktop) return;
          isOverNavbarRef.current = true;
          revealNavbar();
        }}
        onMouseLeave={(e) => {
          if (!isDesktop) return;
          isOverNavbarRef.current = false;
          // If cursor exited directly into the top trigger zone, stay revealed
          if (e.clientY <= TOP_TRIGGER_ZONE) return;
          scheduleHide();
        }}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          backgroundColor: isAtTop ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.82)",
          backdropFilter: isAtTop ? "none" : "blur(12px)",
          WebkitBackdropFilter: isAtTop ? "none" : "blur(12px)",
          borderBottom: isAtTop ? "1px solid rgba(0, 0, 0, 0)" : "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: isAtTop ? "none" : "0 4px 24px rgba(0, 0, 0, 0.03)",
          transition:
            "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease, backdrop-filter 300ms ease, -webkit-backdrop-filter 300ms ease",
        }}
        className="fixed top-0 inset-x-0 z-50 will-change-[transform,opacity]"
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-[64px] max-md:px-[24px] max-lg:px-[40px] py-[24px]">
          <a href="#" className="shrink-0 leading-none">
            <Image
              src="/assets/Hillary Step Solutions  logo.png"
              alt="Hillary Step Solutions Logo"
              width={63}
              height={43}
              priority
              className="object-contain"
            />
          </a>

          <nav className="hidden items-center gap-[36px] lg:flex">
            {NAV.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="group relative font-display text-[14px] font-[510] leading-[20px] text-[#111111]"
              >
                <span className="relative pb-[4px] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-right after:scale-x-0 after:bg-brand-blue after:transition-transform after:duration-300 group-hover:after:origin-left group-hover:after:scale-x-100">
                  {item.name}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[16px] max-lg:hidden">
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-[7px] font-display text-[14px] font-[510] leading-[20px] text-[#111111] cursor-pointer py-[10px]"
              >
                <span className="flex items-center gap-[6px]">
                  <img src={REGION_FLAGS[selectedRegion]} alt={`${selectedRegion} flag`} className="w-[24px] h-[18px] object-contain rounded-[2px]" />
                  {selectedRegion}
                </span>
                <ChevronIcon />
              </button>

              {/* Invisible bridge for hover continuity */}
              <div className="absolute top-full left-0 right-0 h-[10px]" />

              {/* Dropdown Menu */}
              <div className="absolute top-[100%] right-0 mt-[4px] w-[140px] rounded-[12px] bg-white border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-[8px] z-50 translate-y-[-10px] group-hover:translate-y-0">
                {REGIONS.filter(r => r !== selectedRegion).map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className="flex w-full items-center gap-[8px] px-[16px] py-[10px] text-left font-display text-[14px] font-[510] text-[#111111] hover:bg-[#F8F9FB] hover:text-[#1A6CFF] transition-colors"
                  >
                    <img src={REGION_FLAGS[region]} alt={`${region} flag`} className="w-[24px] h-[18px] object-contain rounded-[2px]" />
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <AnimatedButton
              href="/admin/login"
              variant="subtleShadow"
              className="flex h-[44px] items-center gap-[9px] rounded-full border border-[#111111]/10 bg-white/50 px-[22px] font-display text-[14px] font-[510] leading-[20px] text-[#111111] backdrop-blur-sm hover:bg-black/5 transition-colors"
            >
              Admin Portal
              <ArrowUpRight />
            </AnimatedButton>
          </div>

          <button
            className="lg:hidden flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-black/10 text-ink"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-in fade-in duration-300">
          <div className="mx-auto flex w-full items-center justify-between px-[24px] pt-[24px] pb-[24px]">
            <a href="#" className="shrink-0 leading-none" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/assets/Hillary Step Solutions  logo.png"
                alt="Hillary Step Solutions Logo"
                width={63}
                height={43}
                className="object-contain"
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
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  handleSmoothScroll(e, item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="font-display text-[32px] font-[600] leading-[36px] text-[#111111]"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-[40px] flex flex-col gap-[16px] border-t border-black/10 pt-[40px]">
              <a
                href="/admin/login"
                className="flex h-[54px] w-full items-center justify-center gap-[9px] rounded-full bg-brand-blue px-[22px] font-sans text-[16px] font-semibold text-white"
              >
                Admin Portal
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
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

function ArrowUpRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
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
