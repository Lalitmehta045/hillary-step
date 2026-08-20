"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { ServiceData } from "@/lib/services-data";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceData | null;
}

export function ServiceDetailModal({ isOpen, onClose, service }: ServiceDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // @ts-ignore
    window.lenis?.stop();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // @ts-ignore
      window.lenis?.start();
    };
  }, [isOpen]);

  if (!service) return null;

  const accent = service.accentColor;
  const accentDark = service.accentColorDark;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            onClick={onClose}
          />

          <m.div
            ref={modalRef}
            data-lenis-prevent="true"
            initial={{ opacity: 0, x: "100%", scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: "100%", scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col w-full max-w-[900px] max-md:max-w-[calc(100vw-24px)] h-[calc(100vh-48px)] max-md:h-[calc(100vh-24px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-[20px] shadow-2xl z-10 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Close + Back Header */}
            <div className="sticky top-0 z-50 w-full flex items-center justify-between pointer-events-none px-[24px] py-[16px] -mb-[56px]">
              <button
                onClick={onClose}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-gray-200 text-[13px] font-[600] text-gray-700 transition-all hover:bg-white hover:shadow-lg hover:scale-105"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={onClose}
                className="pointer-events-auto w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md border text-gray-600 transition-all hover:scale-110"
                style={{ borderColor: `${accent}30` }}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ===== HERO SECTION ===== */}
            <div className="relative w-full h-[400px] max-md:h-[300px] overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accentDark}ee, ${accentDark}80 40%, transparent)` }} />
              
              {/* Hero Content */}
              <div className="absolute bottom-0 left-0 right-0 p-[48px] max-md:p-[24px]">
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-[700] tracking-[1px] uppercase mb-4"
                    style={{ backgroundColor: `${accent}30`, color: 'white', border: `1px solid ${accent}50` }}
                  >
                    {service.category === "it-solutions" ? "IT Solutions" : "Civil & Infrastructure"}
                  </div>
                  <h1 className="font-display text-[40px] max-md:text-[28px] font-[700] leading-[1.1] text-white mb-[12px] tracking-[-0.5px]">
                    {service.title}
                  </h1>
                  <p className="text-[16px] max-md:text-[14px] leading-[26px] text-white/80 max-w-[600px]">
                    {service.desc}
                  </p>
                </m.div>
              </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="px-[48px] max-md:px-[24px] py-[48px] max-md:py-[32px]">

              {/* Detailed Description */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-[56px]"
              >
                <p className="text-[17px] max-md:text-[15px] leading-[30px] text-[#4B5563] max-w-[700px]">
                  {service.detailedDescription}
                </p>
              </m.div>

              {/* ===== KEY CAPABILITIES ===== */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-[56px]"
              >
                <h2 className="text-[12px] font-[700] tracking-[2px] uppercase mb-[8px]" style={{ color: accent }}>
                  Key Capabilities
                </h2>
                <h3 className="font-display text-[28px] max-md:text-[22px] font-[700] text-[#111] mb-[32px]">
                  What We Deliver
                </h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[16px]">
                  {service.points.map((point, i) => (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-center gap-[14px] p-[16px] rounded-[14px] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all duration-300"
                    >
                      <div className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}20` }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-[14px] font-[500] text-[#374151]">{point}</span>
                    </m.div>
                  ))}
                </div>
              </m.div>

              {/* ===== STATS ===== */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-[56px] p-[32px] max-md:p-[20px] rounded-[20px]"
                style={{ background: `linear-gradient(135deg, ${accentDark}, ${accent})` }}
              >
                <div className="grid grid-cols-4 max-md:grid-cols-2 gap-[24px] max-md:gap-[16px]">
                  {service.stats.map((stat, i) => (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="text-center"
                    >
                      <div className="font-display text-[32px] max-md:text-[24px] font-[800] text-white mb-[4px] tracking-[-1px]">
                        {stat.value}
                      </div>
                      <div className="text-[12px] font-[500] text-white/70 uppercase tracking-[1px]">
                        {stat.label}
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>

              {/* ===== PROCESS ===== */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-[56px]"
              >
                <h2 className="text-[12px] font-[700] tracking-[2px] uppercase mb-[8px]" style={{ color: accent }}>
                  Our Process
                </h2>
                <h3 className="font-display text-[28px] max-md:text-[22px] font-[700] text-[#111] mb-[32px]">
                  How We Work
                </h3>
                <div className="flex flex-col gap-[0px] relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-[32px] bottom-[32px] w-[2px] rounded-full" style={{ backgroundColor: `${accent}20` }} />

                  {service.processSteps.map((step, i) => (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-[20px] py-[20px] relative group"
                    >
                      {/* Step number circle */}
                      <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-[800] text-white z-10 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: accent }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-[4px]">
                        <h4 className="font-display text-[16px] font-[700] text-[#111] mb-[6px]">
                          {step.title}
                        </h4>
                        <p className="text-[14px] leading-[22px] text-[#6B7280]">
                          {step.desc}
                        </p>
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>

              {/* ===== BENEFITS ===== */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-[56px]"
              >
                <h2 className="text-[12px] font-[700] tracking-[2px] uppercase mb-[8px]" style={{ color: accent }}>
                  Benefits
                </h2>
                <h3 className="font-display text-[28px] max-md:text-[22px] font-[700] text-[#111] mb-[32px]">
                  Why Choose Us
                </h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                  {service.benefits.map((benefit, i) => (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="p-[24px] rounded-[16px] bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-gray-200 transition-all duration-300 group"
                    >
                      <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center mb-[14px] transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}25` }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </div>
                      <h4 className="font-display text-[15px] font-[700] text-[#111] mb-[8px]">
                        {benefit.title}
                      </h4>
                      <p className="text-[13px] leading-[20px] text-[#6B7280]">
                        {benefit.desc}
                      </p>
                    </m.div>
                  ))}
                </div>
              </m.div>

              {/* ===== CTA ===== */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center p-[40px] max-md:p-[24px] rounded-[20px] border border-gray-100 bg-[#FAFAFA]"
              >
                <h3 className="font-display text-[24px] max-md:text-[20px] font-[700] text-[#111] mb-[12px]">
                  Ready to get started?
                </h3>
                <p className="text-[14px] leading-[22px] text-[#6B7280] mb-[24px] max-w-[400px] mx-auto">
                  Let&apos;s discuss how our {service.title.toLowerCase()} services can transform your business.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    // Small delay then scroll to contact form
                    setTimeout(() => {
                      document.getElementById("careers")?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  }}
                  className="inline-flex items-center gap-2 px-[28px] py-[14px] rounded-full text-white text-[14px] font-[700] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: accent }}
                >
                  Contact Us
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </m.div>

            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
