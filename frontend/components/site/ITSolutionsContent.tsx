import { useState } from "react";
import { m } from "framer-motion";
import { itServices } from "@/lib/services-data";
import { ServiceDetailModal } from "./ServiceDetailModal";
import type { ServiceData } from "@/lib/services-data";
import Link from "next/link";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";
// @ts-ignore
import { pillars } from "@/app/new-one/mock";

const icons: Record<string, React.ReactNode> = {
  code: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  cloud: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ai: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h.01" />
      <path d="M17 7h.01" />
      <path d="M7 17h.01" />
      <path d="M17 17h.01" />
      <path d="M12 12h.01" />
    </svg>
  ),
  mobile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
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
      <div 
        className="w-full h-full relative cursor-pointer overflow-visible"
        onClick={onExplore}
      >

        {/* Left side: Entire card scales down as one unit */}
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.72] z-10"
          style={{ transformOrigin: 'left center' }}
        >
          <div className="w-full h-full flex flex-col overflow-hidden bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-100/50 transition-shadow duration-700">
            {/* Image */}
            <div className="w-full h-[220px] max-md:h-[180px] relative overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              <div className="absolute bottom-4 left-5 right-5 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-all duration-500 group-hover:bg-[#1A6CFF]">
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
                className="mt-auto flex items-center gap-2 text-[13px] font-[700] text-[#1A6CFF] group-hover:text-[#0D2459] transition-colors cursor-pointer hover:gap-3"
              >
                Explore Details
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1A6CFF]/10 group-hover:bg-[#1A6CFF]/20 transition-colors duration-500">
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
          <div className="w-full h-full bg-gradient-to-br from-[#153B8C] to-[#0D2459] rounded-3xl shadow-[-8px_0_30px_rgba(21,59,140,0.35)] p-[28px] pt-[32px] border border-white/10 flex flex-col overflow-hidden relative">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#1A6CFF]/15 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[80px] h-[80px] bg-[#60A5FA]/10 rounded-full blur-[40px] pointer-events-none"></div>

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
                    <div className="mt-[3px] shrink-0 text-[#A5C3FF]">
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
            <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-[#0D2459] to-transparent rounded-b-3xl pointer-events-none z-20"></div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export function ITSolutionsContent() {
  const [detailService, setDetailService] = useState<ServiceData | null>(null);
  const pillar = pillars.find((p: any) => p.slug === "cognitive-digital");
  const c = pillar?.color || "#2563eb";

  return (
    <div className="w-full font-display">
      <div className="px-[80px] pt-[80px] pb-[80px] max-md:px-[24px]">

      {/* Header */}
      <div className="mb-[64px] max-md:mb-[48px]">
        <p className="text-[14px] font-[600] tracking-wide text-[#1A6CFF] uppercase mb-[16px]">
          Cognitive Digital – Platforms
        </p>
        <h2 className="font-display text-[48px] max-md:text-[36px] font-[700] leading-[1.1] tracking-[-1px] text-[#111111] mb-[20px]">
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#1E3A8A] to-[#60A5FA] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">Technology</span> that powers<br className="max-md:hidden" /> your business forward.
        </h2>
        <p className="text-[18px] max-md:text-[16px] leading-[28px] text-[#6B7280] max-w-[700px]">
          From strategy to deployment, we build secure, scalable, and future-ready solutions to help your business adapt, innovate, and grow.
        </p>
      </div>

      {/* Grid Section */}
      <div className="flex flex-col items-center w-full">
        <p className="text-[14px] font-[700] tracking-[1px] text-[#1A6CFF] uppercase mb-[12px] text-center">
          OUR COGNITIVE DIGITAL PLATFORMS
        </p>
        <h3 className="font-display text-[28px] max-md:text-[24px] font-[700] text-[#111111] mb-[48px] text-center">
          Comprehensive Solutions for Every Need
        </h3>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-[32px] gap-y-[48px] w-full max-w-[900px] mx-auto">
          {itServices.map((service, idx) => (
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
      {pillar && (
        <div className="bg-[#0a0e1a] text-white font-sans">
          {/* OVERVIEW */}
          <section className="py-24 lg:py-32">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
                <p className="font-mono text-[11px] mb-6 uppercase tracking-wider" style={{ color: pillar.colorSoft }}>Overview</p>
                <h2 className="hs-heading text-[32px] sm:text-[46px] leading-tight font-display font-bold">
                  Where ambition meets execution.
                </h2>
                <p className="mt-7 text-white/60 text-lg leading-relaxed">{pillar.intro}</p>
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
                  <img src={pillar.altImage} alt={pillar.title} className="w-full h-[420px] object-cover" />
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
                  <img src={pillar.heroImage} alt={pillar.title} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c}44, transparent)` }} />
                </div>
              </m.div>
              <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }}>
                <p className="font-mono text-[11px] mb-6 uppercase tracking-wider" style={{ color: pillar.colorSoft }}>What we deliver</p>
                <h2 className="hs-heading text-[32px] sm:text-[46px] mb-8 font-display font-bold">Outcomes that speak.</h2>
                <ul className="space-y-4">
                  {pillar.outcomes.map((o: string) => (
                    <li key={o} className="flex items-start gap-3.5">
                      <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c}22`, color: pillar.colorSoft }}>
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
                      The next ascent starts with {pillar.title}.
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
        </div>
      )}
    </div>
  );
}
