"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { m, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const links = [
  { slug: "home", label: "Home", href: "/#home", num: "01", subtitle: "Ecosystem Overview" },
  { slug: "about", label: "About", href: "/#about", num: "02", subtitle: "Mission & Leadership" },
  { slug: "pillars", label: "Pillars", href: "/#pillars", num: "03", subtitle: "Civil, Staffing & IT" },
  { slug: "capabilities", label: "Capabilities", href: "/#capabilities", num: "04", subtitle: "Global Delivery" },
  { slug: "global-presence", label: "Global Presence", href: "/#global-presence", num: "05", subtitle: "USA · IND · AUS" },
  { slug: "contact", label: "Contact Us", href: "/#contact", num: "06", subtitle: "Start a Conversation" },
];

const REGIONS = ["USA", "IND", "AUS"];
const REGION_FLAGS: Record<string, string> = {
  USA: "https://flagcdn.com/us.svg",
  IND: "https://flagcdn.com/in.svg",
  AUS: "https://flagcdn.com/au.svg",
};

// Reusable Magnetic Button with spring physics
function MagneticButton({
  children,
  href,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.35 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.35 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left - r.width / 2) * 0.22);
    my.set((e.clientY - r.top - r.height / 2) * 0.32);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <m.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </m.a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("USA");
  const [isHovered, setIsHovered] = useState(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);
  const openRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      // If at top of the page, header is always visible
      if (currentScrollY <= 50) {
        setIsVisible(true);
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        return;
      }

      // During active scrolling, header moves along with user ("scroll me sath sath chalega")
      setIsVisible(true);

      // Reset hold/inactivity timer
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }

      // If user holds / pauses on the page, hide after 2.5s ("if anyone holds on a page it will go off")
      holdTimerRef.current = setTimeout(() => {
        if (!isHoveredRef.current && !openRef.current && window.scrollY > 50) {
          setIsVisible(false);
        }
      }, 2500);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (window.scrollY > 50) {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      holdTimerRef.current = setTimeout(() => {
        if (!isHoveredRef.current && !openRef.current && window.scrollY > 50) {
          setIsVisible(false);
        }
      }, 2500);
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      if (href.startsWith("/#")) {
        const id = href.replace("/#", "");
        if (id === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "#home");
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${id}`);
        } else {
          window.location.href = href;
        }
      } else if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = href;
      }
    }, 450);
  };

  const shouldHide = !isVisible && !isHovered && !open;

  return (
    <>
      <div
        className="fixed top-0 inset-x-0 z-[9000]"
        style={{ pointerEvents: "none" }}
      >
        {/* Invisible Hover Trigger at top edge of viewport */}
        <div 
          className="absolute top-0 inset-x-0 h-7" 
          style={{ pointerEvents: "auto" }} 
          onMouseEnter={handleMouseEnter}
        />

        {/* Top Header Bar */}
        <m.header
          initial={{ y: 0, opacity: 1 }}
          animate={{ 
            y: shouldHide ? "-120%" : 0, 
            opacity: open ? 0 : shouldHide ? 0 : 1
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ pointerEvents: shouldHide ? "none" : "auto" }}
          className={`relative w-full transition-all duration-200 ${
            open ? "pointer-events-none" : scrolled ? "py-3" : "py-5 md:py-6"
          }`}
        >
        <div
          className={`mx-auto w-[94%] max-w-[1400px] flex items-center justify-between transition-all duration-200 rounded-full px-5 sm:px-8 py-2.5 ${
            scrolled
              ? "bg-white/70 text-[#111111] backdrop-blur-xl border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.07)]"
              : "bg-transparent text-white border border-transparent shadow-none backdrop-blur-none"
          }`}
        >
          {/* Logo */}
          <a
            href="/#home"
            onClick={(e) => {
              e.preventDefault();
              go("/#home");
            }}
            className="flex items-center gap-3 shrink-0 group cursor-pointer"
          >
            <Image
              src="/assets/Hillary Step Solutions  logo.png"
              alt="Hillary Step Solutions Logo"
              width={54}
              height={36}
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 font-display text-sm">
            {links.slice(0, 5).map((l) => (
              <a
                key={l.slug}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
                className={`link-underline px-4 py-2 font-medium text-sm transition-colors cursor-pointer ${
                  scrolled
                    ? "text-slate-700 hover:text-[#1A6CFF]"
                    : "text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            {/* Region Selector */}
            <div className="relative group hidden sm:block">
              <button
                type="button"
                className={`flex items-center gap-1.5 font-display text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  scrolled
                    ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80"
                    : "bg-black/20 text-white hover:bg-black/30 border border-white/20 backdrop-blur-sm drop-shadow-sm"
                }`}
              >
                <img
                  src={REGION_FLAGS[selectedRegion]}
                  alt={`${selectedRegion} flag`}
                  className="w-4 h-3 object-cover rounded-[2px]" 
                />
                <span>{selectedRegion}</span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-[100%] right-0 mt-2 w-28 rounded-xl bg-white border border-slate-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1.5 z-50">
                {REGIONS.filter((r) => r !== selectedRegion).map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#1A6CFF] transition-colors cursor-pointer"
                  >
                    <img
                      src={REGION_FLAGS[region]}
                      alt={`${region} flag`}
                      className="w-4 h-3 object-cover rounded-[2px]"
                    />
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                go("/#contact");
              }}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#1A6CFF] text-white px-4 py-2 font-display text-xs font-medium hover:bg-[#1556cc] shadow-[0_4px_14px_rgba(26,108,255,0.3)] transition cursor-pointer"
            >
              Contact Us
              <span className="text-xs">↗</span>
            </a>

            {/* Admin Portal Button - Frosted Glass Style */}
            <a
              href="/admin/login"
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-medium transition-all duration-300 cursor-pointer ${
                scrolled
                  ? "border border-slate-300/80 bg-white/50 hover:bg-white/80 text-slate-800 backdrop-blur-md shadow-sm"
                  : "border border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md shadow-sm drop-shadow-sm"
              }`}
            >
              Admin Portal
              <span className="text-xs">↗</span>
            </a>

            {/* Circular Hamburger Button - Mobile Only */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className={`lg:hidden relative h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                scrolled
                  ? "bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200"
                  : "bg-black/20 border border-white/20 text-white hover:bg-black/30 backdrop-blur-sm"
              }`}
            >
              <span className="flex flex-col gap-1.5">
                <m.span
                  animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-[1.5px] w-5 bg-current"
                />
                <m.span
                  animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-[1.5px] w-5 bg-current"
                />
              </span>
            </button>
          </div>
        </div>
        </m.header>
      </div>

      {/* Full-Screen Circular ClipPath Overlay Menu — Clean, Simple White Background */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 40px)" }}
            animate={{ clipPath: "circle(160% at calc(100% - 48px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 40px)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] bg-white text-[#111111] flex flex-col justify-between overflow-hidden shadow-2xl"
          >
            {/* Overlay Top Bar */}
            <div className="w-full px-6 sm:px-12 md:px-16 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 bg-white">
              <a
                href="/#home"
                onClick={(e) => {
                  e.preventDefault();
                  go("/#home");
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Image
                  src="/assets/Hillary Step Solutions  logo.png"
                  alt="Hillary Step Solutions Logo"
                  width={52}
                  height={35}
                  priority
                  className="object-contain"
                />
                <span className="font-display font-bold text-sm tracking-wider uppercase text-slate-900 hidden sm:inline">
                  Hillary Step Solutions
                </span>
              </a>

              {/* Clean Close Button */}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Main Interactive Content */}
            <div className="flex-1 w-full px-6 sm:px-12 md:px-16 lg:px-24 py-8 flex flex-col lg:flex-row gap-8 lg:gap-16 justify-between items-stretch overflow-y-auto">
              {/* Left Column: Navigation Index */}
              <div className="w-full lg:w-3/5 flex flex-col justify-center">
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#1A6CFF] font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1A6CFF]" />
                  Navigation
                </div>

                <nav className="flex flex-col">
                  {links.map((l, i) => (
                    <m.a
                      key={l.slug}
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(l.href);
                      }}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="group flex items-center justify-between border-b border-slate-100 py-3.5 sm:py-4.5 cursor-pointer transition-all duration-200 hover:pl-2"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs text-[#1A6CFF] font-semibold w-6">
                          {l.num}
                        </span>
                        <span className="font-display font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 group-hover:text-[#1A6CFF] transition-colors duration-200">
                          {l.label}
                        </span>
                        <span className="hidden sm:inline-block text-xs text-slate-400 font-normal ml-3">
                          {l.subtitle}
                        </span>
                      </div>
                      <span className="text-slate-300 group-hover:text-[#1A6CFF] group-hover:translate-x-1 group-hover:-translate-y-1 text-xl sm:text-2xl transition-all duration-200">
                        ↗
                      </span>
                    </m.a>
                  ))}
                </nav>
              </div>

              {/* Right Column: Clean White Cards */}
              <div className="w-full lg:w-2/5 flex flex-col gap-4 justify-center">
                {/* Global Command Hubs Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-[#F8F9FB] p-6 shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#40F600]" />
                    Global Command Hubs
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200/50">
                      <span className="flex items-center gap-2 font-medium">
                        <img src="https://flagcdn.com/us.svg" alt="USA" className="w-4 h-3 object-cover rounded-[2px]" />
                        United States
                      </span>
                      <span className="text-slate-500">New York · LA · Dallas</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200/50">
                      <span className="flex items-center gap-2 font-medium">
                        <img src="https://flagcdn.com/in.svg" alt="India" className="w-4 h-3 object-cover rounded-[2px]" />
                        India
                      </span>
                      <span className="text-slate-500">Delhi NCR · Bengaluru · Mumbai</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="flex items-center gap-2 font-medium">
                        <img src="https://flagcdn.com/au.svg" alt="Australia" className="w-4 h-3 object-cover rounded-[2px]" />
                        Australia
                      </span>
                      <span className="text-slate-500">Sydney · Melbourne · Brisbane</span>
                    </div>
                  </div>
                </div>

                {/* Direct Project Action Card */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm">
                  <h4 className="font-display font-bold text-base text-slate-900 mb-1">
                    Ready to scale global operations?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Connect with our team for civil infrastructure, high-velocity software engineering, and global staffing.
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href="/#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        go("/#contact");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#1A6CFF] hover:bg-[#1556cc] text-white px-5 py-2 font-display text-xs font-semibold shadow-[0_4px_12px_rgba(26,108,255,0.25)] transition"
                    >
                      Start Project
                      <span>↗</span>
                    </a>
                    <a
                      href="/admin/login"
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 font-display text-xs font-medium transition shadow-sm"
                    >
                      Admin Portal
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Row */}
            <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-display bg-white">
              <div>
                Inquiries:{" "}
                <a href="mailto:info@hillarystep.com" className="text-[#1A6CFF] hover:underline lowercase font-medium">
                  info@hillarystep.com
                </a>
              </div>
              <div className="hidden md:block text-slate-400">
                Civil Infrastructure · Global Staffing · IT Solutions
              </div>
              <div>
                © {new Date().getFullYear()} Hillary Step Solutions Private Limited
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
