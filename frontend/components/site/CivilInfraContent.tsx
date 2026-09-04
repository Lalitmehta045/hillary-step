import { useState } from "react";
import { m } from "framer-motion";
import { civilServices } from "@/lib/services-data";
import { ServiceDetailModal } from "./ServiceDetailModal";
import type { ServiceData } from "@/lib/services-data";
import Link from "next/link";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";
import { EcoSmartInfraShowcase } from "./EcoSmartInfraShowcase";
// @ts-ignore
import { pillars } from "@/app/new-one/mock";

const icons: Record<string, React.ReactNode> = {
  building: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  bridge: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19L12 5l8 14" />
      <path d="M6 15h12" />
    </svg>
  ),
  structure: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z" />
    </svg>
  ),
  water: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  compass: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  construction: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M6 20V10l6-6 6 6v10" />
      <path d="M12 4v16" />
    </svg>
  ),
};

const HoverCard = ({ service, index, onExplore }: { service: ServiceData, index: number, onExplore: () => void }) => {
  const icon = icons[service.iconId];
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-full h-[500px] max-md:h-[480px] hover:z-50"
    >
      <div className="w-full h-full relative cursor-pointer overflow-visible">

        {/* Left side: Entire card scales down as one unit */}
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.72] z-10"
          style={{ transformOrigin: 'left center' }}
        >
          <div className="w-full h-full flex flex-col overflow-hidden bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_20px_50px_rgba(194,65,12,0.18)] border border-orange-100 transition-shadow duration-700">
            {/* Image */}
            <div className="w-full h-[220px] max-md:h-[180px] relative overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              <div className="absolute bottom-4 left-5 right-5 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-all duration-500 group-hover:bg-[#EA580C]">
                  {icon}
                </div>
                <h4 className="font-display text-[20px] font-[700] leading-tight text-white drop-shadow-md">
                  {service.title}
                </h4>
              </div>
            </div>
            {/* Description area */}
            <div className="p-[24px] flex-1 flex flex-col bg-white">
              <p className="text-[14px] leading-[22px] text-gray-600 mb-4 line-clamp-3">
                {service.desc}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onExplore(); }}
                className="mt-auto flex items-center gap-2 text-[13px] font-[700] text-[#EA580C] group-hover:text-[#9A3412] transition-colors cursor-pointer hover:gap-3"
              >
                Explore Details
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#EA580C]/10 group-hover:bg-[#EA580C]/20 transition-colors duration-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Capabilities Panel (slides in from the right) */}
        <div className="absolute right-0 top-[5%] h-[90%] w-[52%] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] translate-x-[110%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 z-20">
          <div className="w-full h-full bg-gradient-to-br from-[#C2410C] to-[#7C2D12] rounded-3xl shadow-[-8px_0_30px_rgba(194,65,12,0.35)] p-[28px] pt-[32px] border border-orange-400/20 flex flex-col overflow-hidden relative">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#EA580C]/15 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[80px] h-[80px] bg-[#FDBA74]/10 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="flex flex-col h-full relative z-10">
              <h4 className="font-display text-[17px] font-[700] text-white mb-[20px] tracking-wide transition-all duration-500 delay-[100ms] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                Key Capabilities
              </h4>
              <ul className="flex flex-col gap-[14px]">
                {service.points.map((pt: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-[12px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    style={{ transitionDelay: `${150 + i * 60}ms` }}
                  >
                    <div className="mt-[3px] shrink-0 text-[#FFEDD5]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-sans text-[13px] leading-[1.5] text-white/90">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-[#7C2D12] to-transparent rounded-b-3xl pointer-events-none z-20"></div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export function CivilInfraContent() {
  const [detailService, setDetailService] = useState<ServiceData | null>(null);
  const ecoPillar = pillars.find((p: any) => p.slug === "eco-smart-infra");
  const c = ecoPillar?.color || "#f5a623";

  return (
    <div className="w-full font-display">
      <div className="px-[64px] pt-[40px] pb-[80px] max-md:px-[20px] max-md:pt-[24px]">
        {/* Figma UI Showcase: Hero Banner, Project Highlights Carousel, Expertise & Services, Our Process */}
        <EcoSmartInfraShowcase />

        {/* Existing Grid Section (Preserved) */}
        <div id="civil-services-section" className="flex flex-col items-center w-full mt-24 pt-16 border-t border-gray-100">
          <p className="text-[13px] font-[700] tracking-[1.5px] text-[#EA580C] uppercase mb-[12px] text-center">
            OUR INFRASTRUCTURE SERVICES
          </p>
          <h3 className="font-display text-[28px] max-md:text-[24px] font-[700] text-[#111111] mb-[48px] text-center">
            Engineering Excellence Across Every Scale
          </h3>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-[32px] gap-y-[48px] w-full max-w-[900px] mx-auto">
          {civilServices.map((service, idx) => (
            <HoverCard
              key={idx}
              service={service}
              index={idx}
              onExplore={() => setDetailService(service)}
            />
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={!!detailService}
        onClose={() => setDetailService(null)}
        service={detailService}
      />
      </div>

      {/* Added Sections from PillarPage */}
      {ecoPillar && (
        <div className="bg-[#0a0e1a] text-white font-sans">
          {/* OVERVIEW */}
          <section className="py-24 lg:py-32">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <p className="font-mono text-[11px] mb-6 uppercase tracking-wider" style={{ color: ecoPillar.colorSoft }}>Overview</p>
                <h2 className="hs-heading text-[32px] sm:text-[46px] leading-tight font-display font-bold">
                  Where ambition meets execution.
                </h2>
                <p className="mt-7 text-white/60 text-lg leading-relaxed">{ecoPillar.intro}</p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href="/#contact"
                    className="group inline-flex items-center gap-2.5 text-white font-semibold px-7 py-3.5 rounded-full transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: c }}
                  >
                    Start a conversation
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </m.div>
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="relative rounded-[24px] overflow-hidden border border-white/8">
                  <img src={ecoPillar.altImage} alt={ecoPillar.title} className="w-full h-[420px] object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${c}22 100%)` }} />
                </div>
              </m.div>
            </div>
          </section>

          {/* OUTCOMES */}
          <section className="py-24 bg-[#0f1526]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <div className="relative rounded-[24px] overflow-hidden border border-white/8">
                  <img src={ecoPillar.heroImage} alt={ecoPillar.title} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c}44, transparent)` }} />
                </div>
              </m.div>
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }}>
                <p className="font-mono text-[11px] mb-6 uppercase tracking-wider" style={{ color: ecoPillar.colorSoft }}>What we deliver</p>
                <h2 className="hs-heading text-[32px] sm:text-[46px] mb-8 font-display font-bold">Outcomes that speak.</h2>
                <ul className="space-y-4">
                  {ecoPillar.outcomes.map((o: string) => (
                    <li key={o} className="flex items-start gap-3.5">
                      <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c}22`, color: ecoPillar.colorSoft }}>
                        <Check size={14} />
                      </span>
                      <span className="text-white/75 leading-relaxed">{o}</span>
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>
          </section>

          {/* CTA */}
          <section className="pb-28 pt-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <div className="relative rounded-[28px] overflow-hidden border border-white/8 p-12 lg:p-16 text-center" style={{ background: `linear-gradient(135deg, ${c}22, #0f1526 60%)` }}>
                  <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30" style={{ backgroundColor: c }} />
                  <div className="relative z-10">
                    <h2 className="hs-heading text-[34px] sm:text-[56px] max-w-[18ch] mx-auto font-display font-bold">
                      The next ascent starts with {ecoPillar.title}.
                    </h2>
                    <Link
                      href="/#contact"
                      className="group mt-10 inline-flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-full transition-transform hover:scale-[1.03]"
                      style={{ backgroundColor: c }}
                    >
                      Partner with us
                      <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </m.div>
            </div>
          </section>

          {/* Figma Matching Footer */}
          <footer className="w-full bg-[#070A12] text-white/80 py-12 px-8 sm:px-12 border-t border-white/8">
            <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-white font-[700] text-[14px] mb-4">Footer</h4>
                <ul className="space-y-2.5 text-[13px] text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Footer Links</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-[700] text-[14px] mb-4">Company</h4>
                <ul className="space-y-2.5 text-[13px] text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="/#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-[700] text-[14px] mb-4">Contact Us</h4>
                <ul className="space-y-2.5 text-[13px] text-white/60">
                  <li>+1 782-346-0680</li>
                  <li>contact@hillarystep.com</li>
                </ul>
              </div>
              <div className="flex items-start md:justify-end gap-3 pt-2">
                <a href="#" aria-label="X (Twitter)" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.874 0-2.384.72-2.384 2.457v1.527h4.743l-.688 3.667h-4.055v7.98z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
