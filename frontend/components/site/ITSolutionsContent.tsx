"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { itServices } from "@/lib/services-data";
import { ServiceDetailModal } from "./ServiceDetailModal";
import type { ServiceData } from "@/lib/services-data";

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
      <div className="w-full h-full relative cursor-pointer overflow-visible">
        
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

  return (
    <div className="w-full font-display px-[80px] pt-[80px] pb-[80px] max-md:px-[24px]">
      
      {/* Header */}
      <div className="mb-[64px] max-md:mb-[48px]">
        <p className="text-[14px] font-[600] tracking-wide text-[#1A6CFF] uppercase mb-[16px]">
          IT Solutions
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
          OUR IT SOLUTIONS
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
  );
}
