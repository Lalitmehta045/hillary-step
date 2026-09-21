import { useState } from "react";
import { m } from "framer-motion";
import { civilServices } from "@/lib/services-data";
import { ServiceDetailModal } from "./ServiceDetailModal";
import type { ServiceData } from "@/lib/services-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      className="group relative w-full h-[470px] max-md:h-[450px] hover:z-50"
    >
      <div
        className="w-full h-full relative cursor-pointer overflow-visible"
        onClick={onExplore}
      >

        {/* Left side: Entire card scales down as one unit */}
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.76] z-10"
          style={{ transformOrigin: 'left center' }}
        >
          <div className="w-full h-full flex flex-col overflow-hidden bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_20px_50px_rgba(194,65,12,0.18)] border border-orange-100 transition-shadow duration-700">
            {/* Image */}
            <div className="w-full h-[180px] max-md:h-[160px] relative overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              <div className="absolute bottom-3 left-4 right-4 text-white flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-all duration-500 group-hover:bg-[#EA580C]">
                  {icon}
                </div>
                <h4 className="font-display text-[18px] max-md:text-[16px] font-[700] leading-tight text-white drop-shadow-md">
                  {service.title}
                </h4>
              </div>
            </div>
            {/* Description area */}
            <div className="p-[20px] flex-1 flex flex-col bg-white">
              <p className="text-[13px] leading-[21px] text-gray-600 mb-3 line-clamp-3">
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
        <div className="absolute right-0 top-[4%] h-[92%] w-[54%] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] translate-x-[110%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 z-20 pointer-events-none group-hover:pointer-events-auto">
          <div className="w-full h-full bg-gradient-to-br from-[#C2410C] to-[#7C2D12] rounded-3xl shadow-[-8px_0_30px_rgba(194,65,12,0.35)] p-[20px] pt-[24px] border border-orange-400/20 flex flex-col overflow-hidden relative">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#EA580C]/15 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[80px] h-[80px] bg-[#FDBA74]/10 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="flex flex-col h-full relative z-10">
              <h4 className="font-display text-[15px] font-[700] text-white mb-[16px] tracking-wide transition-all duration-500 delay-[100ms] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                Key Capabilities
              </h4>
              <ul className="flex flex-col gap-[10px]">
                {service.points.map((pt: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    style={{ transitionDelay: `${150 + i * 50}ms` }}
                  >
                    <div className="mt-[2.5px] shrink-0 text-[#FFEDD5]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-sans text-[12px] sm:text-[12.5px] leading-[1.4] text-white/90">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 w-full h-[50px] bg-gradient-to-t from-[#7C2D12] to-transparent rounded-b-3xl pointer-events-none z-20"></div>
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
      <div className="px-4 md:px-8 pt-5 pb-[80px]">
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

        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-[24px] gap-y-[40px] w-full max-w-[1240px] mx-auto">
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

      
      </div>
    );
  }
