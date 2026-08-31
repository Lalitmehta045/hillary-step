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
      className="group relative w-full h-[320px] max-md:h-[300px] hover:z-50"
    >
      <div
        className="w-full h-full relative cursor-pointer overflow-visible"
        onClick={onExplore}
      >

        {/* Left side: Entire card scales down as one unit */}
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.80] z-10"
          style={{ transformOrigin: 'left center' }}
        >
          <div className="w-full h-full flex flex-col overflow-hidden bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-100/50 transition-shadow duration-700">
            {/* Image */}
            <div className="w-full h-[140px] max-md:h-[130px] relative overflow-hidden">
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
        <div className="absolute right-0 top-[5%] h-[90%] w-[52%] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] translate-x-[110%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 z-20 pointer-events-none group-hover:pointer-events-auto">
          <div className="w-full h-full bg-gradient-to-br from-[#153B8C] to-[#0D2459] rounded-3xl shadow-[-8px_0_30px_rgba(21,59,140,0.35)] p-[20px] pt-[24px] border border-white/10 flex flex-col overflow-hidden relative">
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
    <div className="w-full font-display bg-[#f8f6f3] pb-24">
      {/* HERO SECTION */}
      <m.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-4 md:px-12 py-4 bg-[#f8f6f3]"
      >
        <div className="relative w-full max-w-[1136px] mx-auto h-[500px] rounded-[32px] overflow-hidden flex flex-col justify-center">
          <img src="/images/it_workspace_hero.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 w-full px-8 md:px-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-col">
              <p className="text-[13px] font-[600] tracking-wide text-[#3b82f6] uppercase mb-[12px]">
                IT Solutions
              </p>
              <h1 className="text-white text-[40px] md:text-[48px] lg:text-[56px] font-bold leading-[1.1] max-w-[600px]">
                Technology that powers your business forward.
              </h1>
            </div>
            <div className="flex flex-col items-start md:items-end gap-6 max-w-[400px]">
              <p className="text-white text-[13px] md:text-[14px] leading-relaxed opacity-90 md:text-right">
                From strategy to deployment, we build secure, scalable, and future-ready solutions to help your business adapt, innovate, and grow.
              </p>
              <button className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-[13px]">
                Start Your Furnishing Journey
              </button>
            </div>
          </div>
        </div>
      </m.div>



      {/* RESTORED SERVICES SECTION */}
      <div className="px-8 md:px-16 pt-8 pb-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center w-full">
          <p className="text-[14px] font-[700] tracking-[1px] text-[#1A6CFF] uppercase mb-[12px] text-center">
            SERVICES
          </p>
          <h3 className="font-display text-[28px] max-md:text-[24px] font-[700] text-[#111111] mb-[48px] text-center">
            Our Technology Solutions
          </h3>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-[24px] gap-y-[40px] w-full max-w-[1200px] mx-auto">
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
      </div>

      <ServiceDetailModal
        isOpen={!!detailService}
        onClose={() => setDetailService(null)}
        service={detailService}
      />

      {/* STATS & WHO WE ARE */}
      <div className="px-8 md:px-16 py-8">
        <div className="grid lg:grid-cols-3 gap-6 max-w-[1136px] mx-auto">
          {/* Stats Card */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 rounded-[32px] p-8 text-white flex flex-col justify-between lg:h-[228px]"
            style={{ backgroundColor: 'rgba(14, 77, 183, 1)' }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-bold tracking-widest uppercase opacity-90">OUR COMPANY<br />IN NUMBERS</span>
              <span className="text-[32px] opacity-70 font-light leading-none">$</span>
            </div>
            <div className="flex gap-8 mt-4">
              <div>
                <div className="text-[40px] font-bold leading-none mb-1">150+</div>
                <div className="text-[12px] opacity-90">Furniture Suppliers</div>
              </div>
              <div>
                <div className="text-[40px] font-bold leading-none mb-1">15+</div>
                <div className="text-[12px] opacity-90">Years of Industry<br />Experience</div>
              </div>
            </div>
          </m.div>

          {/* Who We Are Card */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-[#b4c9e8] rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden lg:h-[228px]"
          >
            <div className="flex-1 max-w-[500px] flex flex-col justify-center">
              <h3 className="text-[24px] font-bold text-[#1a2b4c] mb-3">Who We Are</h3>
              <p className="text-[#3b4c6b] text-[13px] leading-relaxed mb-3">
                At Compotto, we understand the challenges of creating exceptional spaces that blend elegance, quality, and functionality.
              </p>
              <p className="text-[#3b4c6b] text-[13px] leading-relaxed line-clamp-2">
                As Greece's premier furniture solutions provider, we've made it our mission to simplify the furnishing process, ensuring that every project is executed flawlessly from initial consultation to final installation.
              </p>
            </div>
            <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden shrink-0 border-[4px] border-white/40">
              <img src="/images/who_we_are.jpg" alt="Who We Are" className="w-full h-full object-cover" />
            </div>
          </m.div>
        </div>
      </div>

      {/* HOW WE SIMPLIFY */}
      <div className="px-8 md:px-16 py-12 relative">
        <div className="max-w-[1400px] mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-16 max-w-[500px] leading-[1.2]"
          >
            How We <span className="text-[#3b82f6]">Simplify</span> Your Furnishing Experience
          </m.h2>

          <div className="flex flex-col gap-[100vh] pb-[20vh] relative">
            {[
              {
                num: "1",
                title: "Initial Consultation",
                highlight: "Consultation",
                desc: "We begin by understanding your space, aesthetic preferences, and practical needs. Our team collaborates with you to define the perfect furnishing strategy for your project.",
                img: "/images/hero_bg.jpg"
              },
              {
                num: "2",
                title: "Space Planning & Design",
                highlight: "Design",
                desc: "Our design experts create detailed layouts and visual concepts, ensuring every piece of furniture fits harmoniously into your environment while maximizing functionality.",
                img: "/images/who_we_are.jpg"
              },
              {
                num: "3",
                title: "Sourcing & Procurement",
                highlight: "Sourcing",
                desc: "Leveraging our extensive network of premium suppliers, we source high-quality, bespoke furniture pieces that match your exact specifications and design vision.",
                img: "/images/hero_bg.jpg"
              },
              {
                num: "4",
                title: "Delivery & Installation",
                highlight: "Installation",
                desc: "Our professional logistics team handles everything from safe transportation to precise on-site assembly, ensuring a flawless setup with zero hassle for you.",
                img: "/images/who_we_are.jpg"
              },
              {
                num: "5",
                title: "After-Sales Support and Maintenance",
                highlight: "Support",
                desc: "Our commitment to your satisfaction extends beyond the final installation. We conduct a thorough final walkthrough to ensure your satisfaction, and also offer comprehensive after-sales support for warranty claims, maintenance, and care instructions.",
                img: "/images/after_sales.jpg"
              }
            ].map((step, i) => {
              const parts = step.title.split(step.highlight);
              return (
                <div
                  key={i}
                  className="sticky top-[120px] lg:top-[160px] w-full"
                  style={{ marginTop: i === 0 ? "0" : "-95vh" }}
                >
                  <m.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col md:flex-row overflow-hidden relative origin-top w-full"
                  >
                    <div className="flex-1 p-10 md:p-16 relative bg-white z-10">
                      <div className="absolute top-4 left-8 text-[180px] font-bold text-[#f0f4f8] leading-none z-0 pointer-events-none select-none">
                        {step.num}
                      </div>
                      <div className="relative z-10 pt-16 max-w-[400px]">
                        <h3 className="text-[24px] font-bold text-[#111111] mb-6">
                          {parts[0]}<span className="text-[#3b82f6]">{step.highlight}</span>{parts[1]}
                        </h3>
                        <p className="text-[#49454F] text-[14px] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 h-[300px] md:h-auto min-h-[400px] bg-white z-10">
                      <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                    </div>
                  </m.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="px-8 md:px-16 py-12">
        <div className="max-w-[1400px] mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-10"
          >
            Why <span className="text-[#3b82f6]">Choose</span> Hillary step solutions
          </m.h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left & Middle (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Top Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <m.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="rounded-[32px] p-8 md:p-10 flex flex-col items-center justify-center text-center relative"
                  style={{ background: 'linear-gradient(180deg, rgba(221,224,240,1) 0%, rgba(96,122,253,1) 100%)' }}
                >
                  <h3 className="font-bold text-[#152759] mb-4 text-[18px]">End-to-End Solutions</h3>
                  <p className="text-[14px] text-[#2c4380] leading-relaxed px-4">
                    We manage every aspect of your furnishing project, saving you time and resources.
                  </p>
                  <div className="mt-8 text-[#5c7ae6]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-[32px] p-8 md:p-10 flex flex-col items-center justify-center text-center text-white"
                  style={{ background: 'linear-gradient(180deg, rgba(221,224,240,1) 0%, rgba(96,122,253,1) 100%)' }}
                >
                  <h3 className="font-bold text-[18px] mb-4">After-Sales Support</h3>
                  <p className="text-[14px] leading-relaxed px-4 opacity-90">
                    We are committed to providing ongoing support & after-sales service to address any future needs or concerns.
                  </p>
                </m.div>
              </div>

              {/* Bottom Row */}
              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden text-white min-h-[250px]"
              >
                <img src="/images/hero_bg.jpg" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 max-w-[600px]">
                  <h3 className="font-bold text-[22px] mb-4">Superior Quality</h3>
                  <p className="text-[14px] opacity-90 leading-relaxed">
                    Our partnerships with the best suppliers guarantee access to the finest materials, craftsmanship, and quality control processes.
                  </p>
                </div>
              </m.div>
            </div>

            {/* Right Column (1/3 width) */}
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-[32px] p-8 md:p-12 flex flex-col justify-center text-white text-center gap-12"
              style={{ background: 'linear-gradient(180deg, rgba(78,88,134,1) 0%, rgba(2,4,126,1) 100%)' }}
            >
              <div>
                <h3 className="font-bold text-[18px] mb-4">No Variety<br />Restrictions</h3>
                <p className="text-[13px] opacity-80 leading-relaxed">
                  We partner with any vendor meeting our quality standards, providing the broadest selection of furniture solutions to suit your needs and preferences.
                </p>
              </div>
              <div className="w-full h-[1px] bg-white/10 my-4"></div>
              <div>
                <h3 className="font-bold text-[18px] mb-4">Bespoke Furniture</h3>
                <p className="text-[13px] opacity-80 leading-relaxed">
                  We specialize in sourcing custom-made furniture pieces that perfectly match your unique vision and requirements.
                </p>
              </div>
            </m.div>
          </div>
        </div>
      </div>

    </div>
  );
}
