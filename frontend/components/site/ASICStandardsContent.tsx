"use client";

import { useEffect, useRef, useState } from "react";
import { GradientReveal } from "@/components/motion/GradientReveal";

import {
  FaUsers,
  FaShieldHalved,
  FaMagnifyingGlass,
  FaUser,
  FaRegHeart,
  FaTriangleExclamation,
} from "react-icons/fa6";

interface ASICStandardsContentProps {
  onClose?: () => void;
  onNavigateType?: (type: "privacy" | "msme" | "mca" | "labor") => void;
}

const TOC_ITEMS = [
  { id: "sec-01", num: "01.", label: "Introduction" },
  { id: "sec-02", num: "02.", label: "Objectives" },
  { id: "sec-03", num: "03.", label: "Scope" },
  { id: "sec-04", num: "04.", label: "Governance Framework" },
  { id: "sec-05", num: "05.", label: "Key Requirements" },
  { id: "sec-06", num: "06.", label: "Compliance & Monitoring" },
  { id: "sec-07", num: "07.", label: "Enforcement" },
  { id: "sec-08", num: "08.", label: "Continuous Improvement" },
  { id: "sec-09", num: "09.", label: "Responsibilities" },
  { id: "sec-10", num: "10.", label: "References" },
];

const STEPPER_ITEMS = [
  { label: "ALIGN", targetId: "sec-01" },
  { label: "STANDARDIZE", targetId: "sec-04" },
  { label: "IMPLEMENT", targetId: "sec-05" },
  { label: "COMPLY", targetId: "sec-06" },
  { label: "ASSURE", targetId: "sec-08" },
];

export function ASICStandardsContent({
  onClose,
  onNavigateType,
}: ASICStandardsContentProps) {
  const [activeSection, setActiveSection] = useState<string>("sec-01");
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
      className="relative w-full bg-white text-[#191C1E] font-display antialiased"
    >
      {/* Main Document Wrapper */}
      <div className="mx-auto w-full max-w-[1140px] px-6 md:px-12 pt-14 md:pt-16 pb-12">
        {/* Category Header */}
        <p className="font-display text-[12px] md:text-[13px] font-[600] tracking-[0.16em] text-[#1A6CFF] uppercase mb-4">
          LEGAL / COMPLIANCE &amp; GOVERNANCE
        </p>

        {/* Main Title: ASIC STANDARD */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 select-none mb-10 md:mb-12">
          <h1 className="font-display text-[44px] sm:text-[54px] md:text-[64px] font-[800] leading-none tracking-[-0.03em]">
            <GradientReveal className="grad-text">ASIC STANDARD</GradientReveal>
          </h1>
        </div>

        {/* Stepper Pipeline */}
        <div className="relative w-full border-t border-b border-gray-100/90 py-7 my-6">
          {/* Connecting Line */}
          <div className="absolute top-[34px] left-[5%] right-[5%] h-[1.5px] bg-[#E5E7EB] z-0" />

          <div className="relative z-10 flex items-center justify-between max-w-[860px] mx-auto px-4">
            {STEPPER_ITEMS.map((step) => (
              <button
                key={step.label}
                type="button"
                onClick={() => scrollToSection(step.targetId)}
                className="group flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              >
                {/* Orange checkpoint dot */}
                <span className="w-[10px] h-[10px] rounded-full bg-[#FF6A00] ring-4 ring-white shadow-xs transition-transform duration-300 group-hover:scale-125" />
                <span className="font-display text-[10px] md:text-[11px] font-[600] tracking-[0.16em] text-[#333333] mt-3 group-hover:text-[#1A6CFF] transition-colors">
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
              <h2 className="font-display text-[11px] font-[700] tracking-[0.18em] text-[#9CA3AF] uppercase mb-4">
                CONTENTS
              </h2>

              <nav aria-label="ASIC Standard Contents">
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

          {/* Right Column: 10 Detailed Sections */}
          <main className="flex flex-col gap-10 text-[#374151]">
            {/* 01. Introduction */}
            <section id="sec-01" className="scroll-mt-12 flex flex-col gap-2.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">01.</span>
                <span>Introduction</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Hillary Step Solutions is committed to upholding the highest
                standards of integrity, transparency, and accountability in
                alignment with the ASIC (Australian Securities and Investments
                Commission) principles and regulatory expectations.
              </p>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                This ASIC Standard outlines our approach to corporate
                governance, financial reporting, risk management, and ethical
                conduct.
              </p>
            </section>

            {/* 02. Objectives */}
            <section id="sec-02" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">02.</span>
                <span>Objectives</span>
              </h3>
              <ul className="flex flex-col gap-2 pt-1">
                {[
                  "Ensure compliance with ASIC laws, regulations, and guidance.",
                  "Promote fair, transparent, and ethical business practices.",
                  "Safeguard stakeholder interests through strong governance and risk management.",
                  "Maintain accurate financial reporting and disclosure.",
                ].map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]"
                  >
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 03. Scope */}
            <section id="sec-03" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">03.</span>
                <span>Scope</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                This Standard applies to all employees, contractors,
                consultants, and third-party partners engaged by Hillary Step
                Solutions across all operations and jurisdictions.
              </p>
            </section>

            {/* 04. Governance Framework */}
            <section id="sec-04" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">04.</span>
                <span>Governance Framework</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We maintain a robust governance structure that ensures oversight,
                accountability, and transparency at all levels.
              </p>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Our governance framework is built on:
              </p>

              {/* 3 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaUsers />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Board Oversight
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Independent oversight to ensure strategic alignment and compliance.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaShieldHalved />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Policies &amp; Procedures
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Documented policies that guide ethical behavior and regulatory compliance.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaMagnifyingGlass />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Risk Management
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Proactive identification and mitigation of legal, operational, and financial risks.
                  </p>
                </div>
              </div>
            </section>

            {/* 05. Key Requirements */}
            <section id="sec-05" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">05.</span>
                <span>Key Requirements</span>
              </h3>
              <ul className="flex flex-col gap-2 pt-1">
                {[
                  "Maintain accurate and complete financial records.",
                  "Ensure timely and transparent disclosure of material information.",
                  "Prevent insider trading and market misconduct.",
                  "Manage conflicts of interest effectively.",
                  "Report and address breaches or concerns promptly.",
                ].map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]"
                  >
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 06. Compliance & Monitoring */}
            <section id="sec-06" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">06.</span>
                <span>Compliance &amp; Monitoring</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We implement continuous monitoring, internal audits, and
                reporting mechanisms to ensure ongoing compliance with ASIC
                standards and industry best practices.
              </p>
            </section>

            {/* 07. Enforcement */}
            <section id="sec-07" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">07.</span>
                <span>Enforcement</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Non-compliance with this Standard may result in disciplinary
                action, including termination of employment or contract, and
                potential legal proceedings.
              </p>
            </section>

            {/* 08. Continuous Improvement */}
            <section id="sec-08" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">08.</span>
                <span>Continuous Improvement</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We regularly review and update our policies and practices to
                adapt to regulatory changes and emerging risks.
              </p>
            </section>

            {/* 09. Responsibilities */}
            <section id="sec-09" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">09.</span>
                <span>Responsibilities</span>
              </h3>

              {/* 3 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaUser />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Leadership
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Ensure compliance culture and provide oversight.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaUsers />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Employees
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Understand and adhere to policies and report concerns.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaRegHeart />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Partners
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Comply with this Standard in all engagements.
                  </p>
                </div>
              </div>
            </section>

            {/* 10. References */}
            <section id="sec-10" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">10.</span>
                <span>References</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                This Standard aligns with the following:
              </p>
              <ul className="flex flex-col gap-2 pt-1">
                {[
                  "Corporations Act 2001 (Cth)",
                  "ASIC Regulatory Guides and Information Sheets",
                  "ASX Corporate Governance Principles",
                  "International Financial Reporting Standards (IFRS)",
                ].map((refItem, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]"
                  >
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>{refItem}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Important Notice Box */}
            <div className="bg-[#FFFDF7] rounded-[12px] p-4.5 sm:p-5 border border-[#FDE68A] flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-[#D97706] font-display text-[12px] font-[700] tracking-[0.14em] uppercase">
                <FaTriangleExclamation className="text-[13px] text-[#F59E0B]" />
                <span>IMPORTANT NOTICE</span>
              </div>
              <p className="font-display text-[12.5px] md:text-[13px] leading-[1.6] text-[#4B5563]">
                This ASIC Standard is a corporate compliance framework and not a
                substitute for legal advice. For specific inquiries, please
                contact our Compliance Officer at{" "}
                <a
                  href="mailto:compliance@hillarystep.com"
                  className="text-[#1A6CFF] font-[500] hover:underline"
                >
                  compliance@hillarystep.com
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
                <span className="font-display text-[11px] font-[400] text-[#9CA3AF] tracking-[0.04em] uppercase">
                  © 2024 HILLARY STEP SOLUTIONS. ARCHITECTING ASCENT.
                </span>
              </div>

              <div className="flex items-center gap-4 text-[12px] font-display">
                <button
                  type="button"
                  onClick={() => onNavigateType?.("privacy")}
                  className="text-[#FF6A00] font-[500] hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Privacy Policy
                </button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button
                  type="button"
                  onClick={() => onNavigateType?.("mca")}
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
