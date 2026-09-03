"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaGear,
  FaShareNodes,
  FaTriangleExclamation,
  FaPlus,
  FaMinus,
} from "react-icons/fa6";

interface PrivacySecurityContentProps {
  onClose?: () => void;
  onNavigateType?: (type: "mca" | "asic" | "labor" | "msme") => void;
}

const TOC_ITEMS = [
  { id: "sec-01", num: "01.", label: "Introduction" },
  { id: "sec-02", num: "02.", label: "Information Collection" },
  { id: "sec-03", num: "03.", label: "Use of Information" },
  { id: "sec-04", num: "04.", label: "AI & Processing" },
  { id: "sec-05", num: "05.", label: "Data Security" },
  { id: "sec-06", num: "06.", label: "Your Rights" },
];

const STEPPER_ITEMS = [
  { label: "COLLECT", targetId: "sec-02" },
  { label: "USE", targetId: "sec-03" },
  { label: "PROTECT", targetId: "sec-05" },
  { label: "GOVERN", targetId: "sec-06" },
];

export function PrivacySecurityContent({
  onClose,
  onNavigateType,
}: PrivacySecurityContentProps) {
  const [activeSection, setActiveSection] = useState<string>("sec-01");
  const [openRight, setOpenRight] = useState<string | null>("access");
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-10% 0px -65% 0px",
        threshold: 0,
      }
    );

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      ref={contentContainerRef}
      className="relative w-full bg-white text-[#191C1E] font-sans antialiased"
    >
      {/* Main Document Wrapper */}
      <div className="mx-auto w-full max-w-[1140px] px-6 md:px-12 pt-14 md:pt-16 pb-12">
        {/* Category Header */}
        <p className="font-sans text-[12px] md:text-[13px] font-[600] tracking-[0.16em] text-[#1A6CFF] uppercase mb-4">
          LEGAL / PRIVACY &amp; SECURITY
        </p>

        {/* Main Title: PRIVACY (Blue) & (Green) TERMS (Orange) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 select-none mb-10 md:mb-12">
          <h1 className="font-display text-[44px] sm:text-[54px] md:text-[64px] font-[800] leading-none tracking-[-0.03em] text-[#007BFF]">
            PRIVACY
          </h1>
          <h1 className="font-display text-[44px] sm:text-[54px] md:text-[64px] font-[800] leading-none tracking-[-0.03em] text-[#10B981]">
            &amp;
          </h1>
          <h1 className="font-display text-[44px] sm:text-[54px] md:text-[64px] font-[800] leading-none tracking-[-0.03em] text-[#FF6A00]">
            TERMS
          </h1>
        </div>

        {/* Stepper Pipeline */}
        <div className="relative w-full border-t border-b border-gray-100/90 py-7 my-6">
          {/* Connecting Line */}
          <div className="absolute top-[34px] left-[5%] right-[5%] h-[1.5px] bg-[#E5E7EB] z-0" />

          <div className="relative z-10 flex items-center justify-between max-w-[760px] mx-auto px-4">
            {STEPPER_ITEMS.map((step) => (
              <button
                key={step.label}
                type="button"
                onClick={() => scrollToSection(step.targetId)}
                className="group flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              >
                {/* Orange checkpoint dot */}
                <span className="w-[10px] h-[10px] rounded-full bg-[#FF6A00] ring-4 ring-white shadow-xs transition-transform duration-300 group-hover:scale-125" />
                <span className="font-sans text-[10px] md:text-[11px] font-[600] tracking-[0.16em] text-[#333333] mt-3 group-hover:text-[#1A6CFF] transition-colors">
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Document Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 pt-6">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="relative">
            <div className="lg:sticky lg:top-8 flex flex-col">
              <h2 className="font-sans text-[11px] font-[700] tracking-[0.18em] text-[#9CA3AF] uppercase mb-4">
                CONTENTS
              </h2>

              <nav aria-label="Privacy and Terms Contents">
                <ul className="flex flex-col gap-[7px] max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  {TOC_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`group w-full text-left text-[13px] leading-[20px] transition-all cursor-pointer bg-transparent border-0 p-0 flex items-center ${
                            isActive
                              ? "border-l-[2.5px] border-[#FF6A00] pl-2.5 text-[#1A6CFF] font-[600]"
                              : "border-l-[2.5px] border-transparent pl-2.5 text-[#4B5563] hover:text-[#111827] font-[400]"
                          }`}
                        >
                          <span
                            className={`transition-colors ${
                              isActive
                                ? "text-[#1A6CFF] font-[600]"
                                : "text-[#4B5563] group-hover:text-[#111827]"
                            }`}
                          >
                            {item.num} {item.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Right Column: 6 Detailed Sections */}
          <main className="flex flex-col gap-10 text-[#374151]">
            {/* 01. Introduction */}
            <section id="sec-01" className="scroll-mt-12 flex flex-col gap-2.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">01.</span>
                <span>Introduction</span>
              </h3>
              <p className="font-sans text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Hillary Step Solutions (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
                architectural precision in protecting your privacy. This Privacy
                Policy describes how we collect, use, process, and govern your
                personal information across our global infrastructure and
                AI-driven platforms.
              </p>
              <p className="font-sans text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                By accessing or using our services, you acknowledge that you have
                read and understood this Privacy Policy. We maintain strict
                operational rigor in ensuring that data is handled with the
                highest level of security and compliance.
              </p>
            </section>

            {/* 02. Information Collection */}
            <section id="sec-02" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">02.</span>
                <span>Information Collection</span>
              </h3>

              {/* 3 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaUser />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Provided Data
                  </h4>
                  <p className="font-sans text-[12.5px] leading-[1.5] text-[#64748B]">
                    Information you directly supply through forms, account
                    creation, and direct communication.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaGear />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Automated
                  </h4>
                  <p className="font-sans text-[12.5px] leading-[1.5] text-[#64748B]">
                    Telemetry, usage metrics, and IP data collected automatically
                    via our operational infrastructure.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaShareNodes />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Third Parties
                  </h4>
                  <p className="font-sans text-[12.5px] leading-[1.5] text-[#64748B]">
                    Data obtained from integrated services, verification
                    partners, and public databases.
                  </p>
                </div>
              </div>
            </section>

            {/* 03. Use of Information */}
            <section id="sec-03" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">03.</span>
                <span>Use of Information</span>
              </h3>
              <p className="font-sans text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We utilize collected information solely to architect, operate,
                and enhance our enterprise services, ensure regulatory and
                statutory compliance, deliver personalized cognitive workflows,
                and maintain transparent communication with our clients and
                partners.
              </p>
            </section>

            {/* 04. AI & Automated Processing */}
            <section id="sec-04" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">04.</span>
                <span>AI &amp; Automated Processing</span>
              </h3>
              <p className="font-sans text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Our intelligence layer utilizes advanced machine learning models.
                We enforce strict isolation between analytical processing and
                personal identity mapping.
              </p>
            </section>

            {/* 05. Security Architecture */}
            <section id="sec-05" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">05.</span>
                <span>Security Architecture</span>
              </h3>
              <p className="font-sans text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We deploy defense-in-depth methodologies. Security is not a
                feature; it is the foundational layer.
              </p>
            </section>

            {/* 06. Your Rights */}
            <section id="sec-06" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">06.</span>
                <span>Your Rights</span>
              </h3>

              {/* Rights Accordion list */}
              <div className="flex flex-col border-t border-b border-gray-200 divide-y divide-gray-100">
                {/* Right 1: Right to Access */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRight(openRight === "access" ? null : "access")
                    }
                    className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-0 p-0 group"
                  >
                    <span className="font-mono text-[13px] md:text-[13.5px] text-[#111827] tracking-wider uppercase font-[500] group-hover:text-[#1A6CFF] transition-colors">
                      Right to Access
                    </span>
                    <span className="text-[#9CA3AF] text-[11px]">
                      {openRight === "access" ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>
                  {openRight === "access" && (
                    <p className="pt-2 text-[12.5px] md:text-[13px] leading-[1.6] text-[#64748B] font-sans">
                      Full transparency into your personal data stored within our
                      systems, including processing purposes, data recipients,
                      and retention parameters.
                    </p>
                  )}
                </div>

                {/* Right 2: Right to Deletion */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRight(openRight === "deletion" ? null : "deletion")
                    }
                    className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-0 p-0 group"
                  >
                    <span className="font-mono text-[13px] md:text-[13.5px] text-[#111827] tracking-wider uppercase font-[500] group-hover:text-[#1A6CFF] transition-colors">
                      Right to Deletion
                    </span>
                    <span className="text-[#9CA3AF] text-[11px]">
                      {openRight === "deletion" ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>
                  {openRight === "deletion" && (
                    <p className="pt-2 text-[12.5px] md:text-[13px] leading-[1.6] text-[#64748B] font-sans">
                      Request permanent cryptographic deletion of non-statutory
                      personal data across active databases and secondary backup
                      layers upon verified identification.
                    </p>
                  )}
                </div>

                {/* Right 3: Right to Rectification */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRight(
                        openRight === "rectification" ? null : "rectification"
                      )
                    }
                    className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-0 p-0 group"
                  >
                    <span className="font-mono text-[13px] md:text-[13.5px] text-[#111827] tracking-wider uppercase font-[500] group-hover:text-[#1A6CFF] transition-colors">
                      Right to Rectification
                    </span>
                    <span className="text-[#9CA3AF] text-[11px]">
                      {openRight === "rectification" ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>
                  {openRight === "rectification" && (
                    <p className="pt-2 text-[12.5px] md:text-[13px] leading-[1.6] text-[#64748B] font-sans">
                      Expedited rectification or completion of any inaccurate or
                      incomplete personal information upon receipt of valid
                      notification.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Important Notice Box */}
            <div className="bg-[#FFFDF7] rounded-[12px] p-4.5 sm:p-5 border border-[#FDE68A] flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-[#D97706] font-sans text-[12px] font-[700] tracking-[0.14em] uppercase">
                <FaTriangleExclamation className="text-[13px] text-[#F59E0B]" />
                <span>IMPORTANT NOTICE</span>
              </div>
              <p className="font-sans text-[12.5px] md:text-[13px] leading-[1.6] text-[#4B5563]">
                This document is a technical abstraction of our legal framework.
                For specific jurisdictional inquiries, please contact our Data
                Protection Officer at{" "}
                <a
                  href="mailto:legal@hillarystep.com"
                  className="text-[#1A6CFF] font-[500] hover:underline"
                >
                  legal@hillarystep.com
                </a>
                .
              </p>
            </div>

            {/* Internal Document Mini Footer */}
            <div className="border-t border-gray-100 pt-8 pb-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[13px] font-[700] tracking-[0.06em] text-[#111827] uppercase">
                  HILLARY STEP SOLUTIONS
                </span>
                <span className="font-sans text-[11px] font-[400] text-[#9CA3AF] tracking-[0.04em] uppercase">
                  © 2024 HILLARY STEP SOLUTIONS. ARCHITECTING ASCENT.
                </span>
              </div>

              <div className="flex items-center gap-4 text-[12px] font-sans">
                <button
                  type="button"
                  onClick={() => onNavigateType?.("mca")}
                  className="text-[#FF6A00] font-[500] hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Privacy Policy
                </button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button
                  type="button"
                  onClick={() => onNavigateType?.("asic")}
                  className="text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Terms of Service
                </button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button
                  type="button"
                  onClick={() => onNavigateType?.("labor")}
                  className="text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Security Architecture
                </button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button
                  type="button"
                  onClick={() => onNavigateType?.("msme")}
                  className="text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Sitemap
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
