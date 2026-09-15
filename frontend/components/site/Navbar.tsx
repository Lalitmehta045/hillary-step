"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";

const links = [
  { slug: "home", label: "Home", href: "/#home" },
  { slug: "about", label: "About The Ascent", href: "/#about" },
  { slug: "capabilities", label: "Capabilities", href: "/#pillars" },
  { slug: "peak-intelligence-core", label: "Peak Intelligence Core", href: "/#ai-experience" },
  { slug: "global-presence", label: "Global Presence", href: "/#global-presence" },
];

const regions = ["USA", "IND", "AUS"];
const flags: Record<string, string> = {
  USA: "https://flagcdn.com/us.svg",
  IND: "https://flagcdn.com/in.svg",
  AUS: "https://flagcdn.com/au.svg",
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [region, setRegion] = useState("USA");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      if (y > 50) {
        timer.current = setTimeout(() => {
          if (!hovered.current && !open) setVisible(false);
        }, 2500);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const id = href.startsWith("/#") ? href.slice(2) : "";
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#home");
        return;
      }
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${id}`);
      } else {
        window.location.href = href;
      }
    }, 250);
  };

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[9000]"
        onMouseEnter={() => {
          hovered.current = true;
          setVisible(true);
          if (timer.current) clearTimeout(timer.current);
        }}
        onMouseLeave={() => { hovered.current = false; }}
      >
        <m.header
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: visible ? 0 : "-120%", opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={open ? "pointer-events-none" : ""}
        >
          <div
            className={`relative mx-auto mt-3 flex h-[68px] w-[94%] max-w-[1400px] items-center rounded-full px-5 sm:px-7 transition-all duration-300 ${
              scrolled
                ? "border border-white/70 bg-white/80 text-[#111111] shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur-xl"
                : "border border-white/15 bg-black/10 text-white backdrop-blur-[6px]"
            }`}
          >
            <nav className="hidden lg:flex items-center gap-0.5 pr-[190px] font-display text-sm">
              {links.slice(0, 2).map((link) => (
                <a
                  key={link.slug}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); go(link.href); }}
                  className={`nav-link-grad rounded-full px-3.5 py-2 font-medium transition-colors ${scrolled ? "text-slate-700" : "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"}`}
                >{link.label}</a>
              ))}
            </nav>

            {/* Centered, larger brand logo */}
            <a
              href="/#home"
              onClick={(e) => { e.preventDefault(); go("/#home"); }}
              aria-label="Hillary Step Solutions home"
              className="absolute left-1/2 top-1/2 z-20 flex h-[60px] w-[200px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl px-2 transition-transform duration-300 hover:scale-[1.03]"
            >
              <Image
                src="/HillaryStepSolutionLogo.svg"
                alt="Hillary Step Solutions"
                width={190}
                height={58}
                priority
                className={`h-[56px] w-[184px] object-contain transition-[filter] duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
              />
            </a>

            <div className="ml-auto flex items-center gap-2.5">
              <nav className="hidden xl:flex items-center gap-0.5 font-display text-sm">
                {links.slice(2).map((link) => (
                  <a
                    key={link.slug}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); go(link.href); }}
                    className={`nav-link-grad rounded-full px-3 py-2 font-medium transition-colors ${scrolled ? "text-slate-700" : "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"}`}
                  >{link.label}</a>
                ))}
              </nav>

              <div className="relative hidden sm:block group">
                <button
                  type="button"
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-xs font-semibold ${scrolled ? "border-slate-200 bg-slate-100 text-slate-800" : "border-white/20 bg-black/20 text-white backdrop-blur-sm"}`}
                >
                  <img src={flags[region]} alt={`${region} flag`} className="h-3 w-4 rounded-[2px] object-cover" />
                  {region}<span className="text-[9px] opacity-60">▼</span>
                </button>
                <div className="invisible absolute right-0 top-full mt-2 w-28 rounded-xl border border-slate-200 bg-white py-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                  {regions.filter((r) => r !== region).map((r) => (
                    <button key={r} onClick={() => setRegion(r)} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                      <img src={flags[r]} alt={`${r} flag`} className="h-3 w-4 rounded-[2px] object-cover" />{r}
                    </button>
                  ))}
                </div>
              </div>

              <a href="/#contact" onClick={(e) => { e.preventDefault(); go("/#contact"); }} className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#1A6CFF] px-4 py-2 font-display text-xs font-medium text-white shadow-[0_4px_14px_rgba(26,108,255,0.3)] transition hover:bg-[#1556cc]">Contact Us <span>↗</span></a>
              <a href="/admin/login" className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-display text-xs font-medium transition ${scrolled ? "border-slate-300/80 bg-white/60 text-slate-800" : "border-white/30 bg-white/15 text-white backdrop-blur-md"}`}>Admin Portal <span>↗</span></a>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border ${scrolled ? "border-slate-200 bg-slate-100 text-slate-800" : "border-white/20 bg-black/20 text-white"}`}
              >
                <span className="flex flex-col gap-1.5">
                  <m.span animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} className="block h-[1.5px] w-5 bg-current" />
                  <m.span animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }} className="block h-[1.5px] w-5 bg-current" />
                </span>
              </button>
            </div>
          </div>
        </m.header>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            animate={{ clipPath: "circle(160% at calc(100% - 48px) 48px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-white text-[#111111] shadow-2xl"
          >
            <div className="relative flex items-center justify-center border-b border-slate-100 px-6 py-5">
              <Image src="/HillaryStepSolutionLogo.svg" alt="Hillary Step Solutions" width={180} height={56} className="h-12 w-[170px] object-contain" priority />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl">×</button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8 sm:px-16">
              {links.map((link, index) => (
                <a key={link.slug} href={link.href} onClick={(e) => { e.preventDefault(); go(link.href); }} className="flex items-center justify-between border-b border-slate-100 py-5 font-display text-2xl font-semibold sm:text-4xl">
                  <span>{link.label}</span><span className="text-sm text-slate-400">0{index + 1}</span>
                </a>
              ))}
              <a href="/#contact" onClick={(e) => { e.preventDefault(); go("/#contact"); }} className="mt-4 inline-flex w-fit rounded-full bg-[#1A6CFF] px-6 py-3 text-sm font-semibold text-white">Contact Us ↗</a>
            </nav>
            <div className="border-t border-slate-100 px-8 py-5 text-xs font-medium tracking-[0.18em] text-slate-400">USA · IND · AUS</div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
