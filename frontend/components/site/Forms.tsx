"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "./Hero";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { m, useScroll, useTransform } from "framer-motion";

const PRACTICES = ["Engineering", "Data & AI", "Civil & Infrastructure", "Corporate"];
const LOCATIONS = ["USA", "Australia", "India"];

export function Forms() {
  return (
    <>
      {/* Candidacy */}
      <section className="w-full bg-white pt-[64px] pb-[40px] max-md:pt-[40px] max-md:pb-[20px]">
        <div className="mx-auto w-full max-w-[1280px] px-[32px] max-md:px-[24px]">
          <StaggerContainer>
            <StaggerItem>
              <p className="font-display text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
                Apply · Global Talent Programme
              </p>
            </StaggerItem>

            <StaggerItem>
              <h2 className="mt-[24px] font-display text-[60px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[48px] max-lg:leading-[48px] font-[590] leading-[60px] tracking-[-1.5px] max-md:tracking-[-1px] text-[#000000]">
                Submit your <GradientReveal className="grad-text-bgreen">candidacy.</GradientReveal>
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-[24px] max-md:mt-[16px] max-w-[650px] font-sans text-[18px] max-md:text-[16px] max-md:leading-[24px] font-[400] leading-[28px] text-[#4B5563]">
                Every application is reviewed by a principal within the discipline. Attach a résumé (PDF
                or Word, up to 5MB) — we will respond within ten business days.
              </p>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.2} className="mx-auto mt-[48px] max-md:mt-[32px] rounded-[24px] overflow-hidden bg-gradient-to-tr from-[#00FF11] via-[#007BFF] to-[#FF6200] p-[1px] shadow-sm">
            <form className="grid grid-cols-1 gap-[48px] max-md:gap-[32px] rounded-[23px] bg-[#F3F3F4] px-[48px] max-md:px-[24px] py-[48px] max-md:py-[32px] lg:grid-cols-[1fr_341px]">
              <div className="flex flex-col gap-[24px]">
                <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
                  <Field label="Full name" />
                  <Field label="Email" type="email" />
                  <PhoneField />
                  <Field label="LinkedIn Profile" />
                  <Select label="Practice" options={PRACTICES} />
                  <Select label="Preferred Location" options={LOCATIONS} />
                </div>

                <div>
                  <Label>Cover Note</Label>
                  <textarea
                    placeholder="Add a cover note."
                    className="mt-[8px] w-full min-h-[170px] resize-none rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] py-[12px] font-sans text-[16px] text-[#111111] placeholder:text-[#9a9a9a] shadow-sm focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label>Résumé · Required</Label>
                <label className="relative mt-[8px] flex h-[220px] w-full cursor-pointer flex-col items-center justify-center rounded-[24px] bg-white px-[24px] py-[64px] text-center hover:bg-black/[0.02] transition-colors">
                  <svg className="pointer-events-none absolute inset-0 h-full w-full rounded-[24px]">
                    <defs>
                      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007BFF" />
                        <stop offset="50%" stopColor="#00FF11" />
                        <stop offset="100%" stopColor="#FF6200" />
                      </linearGradient>
                    </defs>
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="23"
                      fill="none"
                      stroke="url(#dashGrad)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                  </svg>
                  <UploadIcon />
                  <span className="mt-[16px] font-sans text-[16px] font-[500] text-[#111111]">
                    Drop résumé here
                  </span>
                  <span className="mt-[4px] font-sans text-[14px] text-[#4B5563]">
                    or click to browse · PDF, DOC, DOCX · 5MB
                  </span>
                  <input type="file" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" accept=".pdf,.doc,.docx" />
                </label>

                <AnimatedButton
                  type="submit"
                  className="mt-[24px] flex h-[54px] w-full items-center justify-center gap-[8px] rounded-full bg-[#111111] font-sans text-[14px] font-[500] leading-[20px] text-white hover:bg-black transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                >
                  Submit Application
                  <ArrowRight />
                </AnimatedButton>

                <p className="mx-auto mt-[16px] max-w-[258px] text-center font-sans text-[10px] leading-[15px] text-[#6B7280]">
                  By submitting, you consent to Hillary Step Solutions reviewing your credentials in
                  accordance with our Privacy Statement.
                </p>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </>
  );
}

function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const contentX = useTransform(scrollYProgress, (v) => (isDesktop ? 312 * (1 - v) : 0));
  const formX = useTransform(scrollYProgress, (v) => (isDesktop ? 150 * (1 - v) : 0));
  const formOpacity = useTransform(scrollYProgress, (v) => {
    if (!isDesktop) return 1;
    if (v < 0.4) return 0;
    return (v - 0.4) / 0.6;
  });

  return (
    <section ref={containerRef} id="contact" className="relative w-full bg-white lg:h-[200vh]">
      <div className="pt-[40px] pb-[100px] max-md:pt-[20px] max-md:pb-[60px] lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-[40px]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[96px] max-md:gap-[48px] max-lg:gap-[64px] px-[32px] max-md:px-[24px] lg:flex-row">
          <m.div style={{ x: contentX }} className="flex-1">
            <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
              CONTACT
            </p>
            <h2 className="mt-[24px] max-w-[560px] font-display text-[60px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[48px] max-lg:leading-[48px] font-[590] leading-[60px] tracking-[-1.5px] max-md:tracking-[-1px] text-[#000000]">
              Speak with us.
            </h2>
            <div className="pt-[48px] max-md:pt-[32px] flex flex-col gap-[40px] max-md:gap-[32px]">
              <Address label="Global Headquarters" lines={["Four World Trade Center, 78F", "New York, NY 10007 · United States"]} />
              <Address label="Pacific" lines={["1 Bligh Street, Level 32", "Sydney NSW 2000 · Australia"]} />
              <Address label="South Asia" lines={["Maker Maxity, BKC", "Mumbai 400051 · India"]} />
              <Address label="General Enquiries" lines={["info@hillarystepsolutions.com"]} />
            </div>
          </m.div>

          <m.div style={{ x: formX, opacity: formOpacity }} className="w-full shrink-0 rounded-[24px] overflow-hidden bg-gradient-to-br from-[#007BFF] via-[#00FF11] to-[#FF6200] p-[1px] shadow-sm lg:w-[560px]">
            <form className="h-full w-full rounded-[23px] bg-[#F3F3F4] px-[48px] max-md:px-[24px] py-[48px] max-md:py-[32px]">
              <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
                <Field label="Name" />
                <Field label="Email" type="email" />
                <PhoneField />
                <Field label="Organization" />
                <Select label="Region" options={LOCATIONS} />
              </div>

              <div className="mt-[24px]">
                <Label>Message</Label>
                <textarea className="mt-[8px] w-full min-h-[170px] resize-none rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] py-[12px] font-sans text-[16px] text-[#111111] shadow-sm focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-hidden" />
              </div>

              <AnimatedButton
                type="submit"
                className="mt-[24px] flex h-[54px] w-fit items-center justify-center gap-[8px] rounded-full bg-[#111111] px-[32px] font-sans text-[14px] font-[500] leading-[20px] text-white hover:bg-black transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
              >
                Send Enquiry
                <ArrowRight />
              </AnimatedButton>
            </form>
          </m.div>
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-sans text-[12px] font-[600] uppercase tracking-[1.2px] text-[#8B8B8B]">
      {children}
    </span>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <input
        type={type}
        className="mt-[8px] h-[50px] w-full rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] font-sans text-[16px] text-[#111111] shadow-sm focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-hidden"
      />
    </div>
  );
}

function Select({ label, options }: { label: string; options: readonly string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-w-0" ref={dropdownRef}>
      <Label>{label}</Label>
      <div className="relative mt-[8px]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-[50px] w-full items-center justify-between rounded-[16px] border bg-white px-[16px] font-sans text-[16px] text-[#111111] shadow-sm transition-all focus:outline-hidden ${isOpen ? "border-[#007BFF] ring-1 ring-[#007BFF]" : "border-[#E5E7EB] hover:border-[#d1d5db]"}`}
        >
          {selected}
          <svg
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a4a4a"
            strokeWidth="1.8"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white py-[8px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] transform-gpu animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setSelected(o);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-[16px] py-[10px] text-left font-sans text-[15px] transition-colors ${selected === o ? "bg-[#F8F9FB] text-[#007BFF] font-[500]" : "text-[#111111] hover:bg-[#F8F9FB] hover:text-[#007BFF]"}`}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneField() {
  const COUNTRY_CODES = ["+1 (USA)", "+91 (IND)", "+61 (AUS)"];
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(COUNTRY_CODES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-w-0">
      <Label>Phone</Label>
      <div className="mt-[8px] flex h-[50px] w-full rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm focus-within:border-[#007BFF] focus-within:ring-1 focus-within:ring-[#007BFF]">
        <div className="relative flex items-center border-r border-[#E5E7EB] bg-[#F8F9FB] rounded-l-[16px]" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-full items-center justify-between gap-[8px] pl-[12px] pr-[12px] font-sans text-[14px] text-[#111111] focus:outline-hidden whitespace-nowrap"
          >
            {selected}
            <svg
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a4a4a"
              strokeWidth="1.8"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[140px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white py-[8px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] transform-gpu animate-in fade-in slide-in-from-top-2 duration-200">
              {COUNTRY_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelected(code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-[16px] py-[10px] text-left font-sans text-[14px] transition-colors ${selected === code ? "bg-[#F8F9FB] text-[#007BFF] font-[500]" : "text-[#111111] hover:bg-[#F8F9FB] hover:text-[#007BFF]"}`}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="tel"
          className="h-full min-w-0 flex-1 bg-transparent px-[16px] font-sans text-[16px] text-[#111111] focus:outline-hidden rounded-r-[16px]"
        />
      </div>
    </div>
  );
}

function Address({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <Label>{label}</Label>
      <div className="flex flex-col">
        {lines.map((l) => (
          <p key={l} className="font-sans text-[16px] leading-[24px] text-[#111111]">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <path d="M12 17V4M12 4l-5 5M12 4l5 5M4 19h16" />
    </svg>
  );
}
