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
    <div className="w-full font-display bg-[#f8f6f3]">
      
      {/* 1. NEW HERO SECTION */}
      <m.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 md:px-12 pt-10 pb-8"
      >
        <div className="relative w-full h-[600px] rounded-[32px] overflow-hidden">
          <img src="/images/hero_bg.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-24 text-white">
             <h1 className="text-[36px] md:text-[56px] lg:text-[72px] font-bold leading-[1.1] max-w-[800px] mb-6 md:mb-8 drop-shadow-lg">
               Turning Technology Challenges<br />Into Digital Progress
             </h1>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[1200px] w-full">
                <p className="text-base md:text-lg lg:text-xl font-medium max-w-[500px] drop-shadow-md">
                  Hillary Step Solutions helps businesses navigate complex technology challenges with reliable, scalable, and purpose-built digital solutions.
                </p>
                <button className="bg-white text-black font-semibold px-6 py-4 md:px-8 md:py-4 rounded-full hover:bg-gray-100 transition-colors w-full md:w-fit text-center shadow-lg">
                  Start Your Digital Journey
                </button>
             </div>
          </div>
        </div>
      </m.div>

      <div className="px-[80px] pt-[40px] pb-[40px] max-md:px-[24px]">

      {/* Header */}
      <m.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-[64px] max-md:mb-[48px]"
      >
        <p className="text-[14px] font-[600] tracking-wide text-[#1A6CFF] uppercase mb-[16px]">
          IT Solutions
        </p>
        <h2 className="font-display text-[48px] max-md:text-[36px] font-[700] leading-[1.1] tracking-[-1px] text-[#111111] mb-[20px]">
          Technology that powers<br className="max-md:hidden" /> your business forward.
        </h2>
        <p className="text-[18px] max-md:text-[16px] leading-[28px] text-[#6B7280] max-w-[700px]">
          From strategy to deployment, we build secure, scalable, and future-ready solutions to help your business adapt, innovate, and grow.
        </p>
        <button className="text-[#1A6CFF] font-bold uppercase tracking-wide text-sm mt-8 hover:underline">
           OUT IT SOLUTIONS
        </button>
      </m.div>

      {/* Grid Section */}
      <div className="flex flex-col items-center w-full">
        <p className="text-[14px] font-[700] tracking-[1px] text-[#1A6CFF] uppercase mb-[12px] text-center">
          SERVICES
        </p>
        <h3 className="font-display text-[28px] max-md:text-[24px] font-[700] text-[#111111] mb-[48px] text-center">
          Our Technology Solutions
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

      {/* 3. NEW STATS & WHO WE ARE */}
      <div className="px-6 md:px-12 py-12 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-6 w-full max-w-[1400px] mx-auto">
           {/* Stats Block */}
           <m.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
             className="bg-[#b39b7d] rounded-[24px] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[250px] md:min-h-[300px]"
           >
              <div className="flex justify-between items-start">
                 <h3 className="font-bold tracking-widest text-sm uppercase opacity-90">Stats / Small Card</h3>
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-70">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                 </svg>
              </div>
              <div className="flex gap-10 md:gap-12 items-end mt-8 md:mt-0">
                 <div>
                    <div className="text-[48px] md:text-[64px] font-bold leading-none">01</div>
                    <div className="text-sm mt-2 opacity-90">Technology Partner</div>
                 </div>
                 <div>
                    <div className="text-[48px] md:text-[64px] font-bold leading-none">02</div>
                    <div className="text-sm mt-2 opacity-90">Digital Solutions</div>
                 </div>
              </div>
           </m.div>

           {/* Who We Are Block */}
           <m.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
             className="bg-[#f4efe8] rounded-[24px] p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-sm"
           >
              <div className="flex-1 text-center lg:text-left">
                 <h3 className="text-[24px] md:text-[28px] font-bold text-[#3d3832] mb-4">Technology Built Around Your Goals</h3>
                 <p className="text-[#6c6760] text-sm md:text-base leading-relaxed mb-4">
                    At Hillary Step Solutions, we believe technology should make progress simpler — not more complicated.
                 </p>
                 <p className="text-[#6c6760] text-sm md:text-base leading-relaxed">
                    We combine strategic thinking, modern technology, and practical execution to help businesses build, improve, and scale their digital operations.
                 </p>
              </div>
              <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden shrink-0 border-4 border-[#f8f6f3] shadow-lg">
                 <img src="/images/who_we_are.jpg" alt="Who We Are" className="w-full h-full object-cover" />
              </div>
           </m.div>
        </div>
      </div>

      {/* 4. NEW HOW WE SIMPLIFY */}
      <div className="px-6 md:px-12 py-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <m.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-8"
          >
            How We Simplify Your<br />Technology Journey
          </m.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { num: "01", title: "Understand Your Challenge", desc: "We begin by understanding your business, your objectives, and the technology challenges standing in your way." },
               { num: "02", title: "Build With Purpose", desc: "We transform requirements into practical digital solutions designed around how your business actually works." },
               { num: "03", title: "Connect Your Ecosystem", desc: "We bring applications, infrastructure, data, and digital experiences together to create a connected technology environment." },
               { num: "04", title: "Scale With Confidence", desc: "Our solutions are built with scalability, performance, security, and future growth in mind." },
               { num: "05", title: "Support Your Next Step", desc: "Technology doesn't stop at deployment. We continue to support, improve, and evolve your digital ecosystem as your needs change." }
             ].map((step, i) => (
                <m.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: i * 0.1 }}
                  className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-gray-100 relative overflow-hidden"
                >
                   <div className="text-[80px] md:text-[120px] font-bold text-[#f8f6f3] leading-none absolute -top-4 -left-4 z-0 pointer-events-none select-none tracking-tighter">
                     {step.num}
                   </div>
                   <div className="relative z-10 pt-4">
                      <h3 className="text-[22px] font-bold text-[#111111] mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-[#49454F] leading-relaxed text-[15px]">
                        {step.desc}
                      </p>
                   </div>
                </m.div>
             ))}
          </div>
        </div>
      </div>

      {/* 5. NEW WHY CHOOSE */}
      <div className="px-6 md:px-12 py-12 mb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <m.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-8"
          >
            Why Choose Hillary Step
          </m.h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left & Middle (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
               {/* Top Row: Two blocks */}
               <div className="grid md:grid-cols-2 gap-6 flex-1">
                  <m.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-[#f4efe8] rounded-[24px] p-8 py-12 flex flex-col items-center justify-center text-center shadow-sm"
                  >
                      <h3 className="font-bold text-[#3d3832] mb-3 text-lg">Business-First Technology</h3>
                      <p className="text-sm text-[#6c6760] leading-relaxed px-4">We start with your business challenge — not the technology.</p>
                      <div className="mt-8 text-[#b39b7d]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </div>
                  </m.div>
                  <m.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-[#f4efe8] rounded-[24px] p-8 py-12 flex flex-col items-center justify-center text-center shadow-sm"
                  >
                      <h3 className="font-bold text-[#3d3832] mb-3 text-lg">Built For Your Needs</h3>
                      <p className="text-sm text-[#6c6760] leading-relaxed px-4">Every solution is designed around your objectives, users, and operational requirements.</p>
                  </m.div>
               </div>
               {/* Bottom Row: One wide block */}
               <m.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.6, delay: 0.3 }}
                 className="rounded-[24px] p-8 md:p-12 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden text-white shadow-sm"
               >
                  <img src="/images/hero_bg.jpg" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="relative z-10 max-w-[800px]">
                    <h3 className="font-bold text-2xl md:text-3xl mb-4">Technology That Moves You Forward</h3>
                    <p className="text-[15px] opacity-90 leading-relaxed mb-4">The right technology can turn a difficult step into a defining advantage.</p>
                    <p className="text-[15px] opacity-90 leading-relaxed mb-6">From your first idea to your next stage of growth, Hillary Step Solutions helps you navigate the technical challenges along the way.</p>
                    <p className="font-bold tracking-widest uppercase text-sm">Build. Scale. Move Forward.</p>
                  </div>
               </m.div>
            </div>
            {/* Right Column (1/3 width) */}
            <m.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
              className="bg-[#4a3c31] rounded-[24px] p-8 md:p-12 flex flex-col justify-center text-white text-center gap-12 shadow-md h-full"
            >
                <div>
                   <h3 className="font-bold text-xl mb-3">Scalable By Design</h3>
                   <p className="text-sm opacity-90 leading-relaxed">We build technology that can evolve as your business grows.</p>
                </div>
                <div>
                   <h3 className="font-bold text-xl mb-3">End-to-End Expertise</h3>
                   <p className="text-sm opacity-90 leading-relaxed">From strategy and design to development, deployment, and support.</p>
                </div>
                <div>
                   <h3 className="font-bold text-xl mb-3">Long-Term Technology Partner</h3>
                   <p className="text-sm opacity-90 leading-relaxed">We don't just deliver a project. We help you keep moving forward.</p>
                </div>
            </m.div>
          </div>
        </div>
      </div>

    </div>
  );
}
