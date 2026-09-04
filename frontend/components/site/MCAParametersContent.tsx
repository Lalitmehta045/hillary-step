"use client";

import { useEffect, useRef, useState } from "react";
import { GradientReveal } from "@/components/motion/GradientReveal";

import {
  FaBuildingColumns,
  FaFileLines,
  FaCompassDrafting,
  FaArrowsRotate,
  FaUserTie,
  FaShieldHalved,
  FaUsers,
  FaTriangleExclamation,
} from "react-icons/fa6";

interface MCAParametersContentProps {
  onClose?: () => void;
  onNavigateType?: (type: "privacy" | "msme" | "asic" | "labor") => void;
}

const TOC_ITEMS = [
  { id: "sec-01", num: "01.", label: "Introduction" },
  { id: "sec-02", num: "02.", label: "Applicability" },
  { id: "sec-03", num: "03.", label: "Objectives" },
  { id: "sec-04", num: "04.", label: "Legal Framework" },
  { id: "sec-05", num: "05.", label: "Key MCA Requirements" },
  { id: "sec-06", num: "06.", label: "Governance & Responsibilities" },
  { id: "sec-07", num: "07.", label: "Compliance Practices" },
  { id: "sec-08", num: "08.", label: "Filings & Disclosures" },
  { id: "sec-09", num: "09.", label: "Records & Maintenance" },
  { id: "sec-10", num: "10.", label: "Non-Compliance" },
  { id: "sec-11", num: "11.", label: "Continuous Improvement" },
  { id: "sec-12", num: "12.", label: "References" },
];

const STEPPER_ITEMS = [
  { label: "COMPLY", targetId: "sec-01" },
  { label: "DISCLOSE", targetId: "sec-08" },
  { label: "GOVERN", targetId: "sec-06" },
  { label: "ACCOUNT", targetId: "sec-09" },
  { label: "ASSURE", targetId: "sec-11" },
];

export function MCAParametersContent({
  onClose,
  onNavigateType,
}: MCAParametersContentProps) {
  const [activeSection, setActiveSection] = useState<string>("sec-01");
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Robust IntersectionObserver scroll-spy for container or window scrolling
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
      {/* Top Container */}
      <div className="mx-auto w-full max-w-[1140px] px-6 md:px-12 pt-14 md:pt-16 pb-12">
        {/* Category Header */}
        <p className="font-display text-[12px] md:text-[13px] font-[600] tracking-[0.16em] text-[#1A6CFF] uppercase mb-4">
          LEGAL / COMPLIANCE &amp; GOVERNANCE
        </p>

        {/* Main Title: MCA COMPLIANCE */}
        <div className="flex flex-col select-none mb-10 md:mb-12">
          <h1 className="font-display text-[48px] sm:text-[58px] md:text-[68px] font-[800] leading-[0.95] tracking-[-0.03em] w-fit">
            <GradientReveal className="grad-text">MCA</GradientReveal>
          </h1>
          <h1 className="font-display text-[48px] sm:text-[58px] md:text-[68px] font-[800] leading-[0.95] tracking-[-0.03em] w-fit">
            <GradientReveal className="grad-text">COMPLIANCE</GradientReveal>
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

              <nav aria-label="MCA Compliance Contents">
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

          {/* Right Column: 12 Detailed Sections */}
          <main className="flex flex-col gap-10 text-[#374151]">
            {/* 01. Introduction */}
            <section id="sec-01" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">01.</span>
                <span>Introduction</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Hillary Step Solutions is committed to full compliance with the
                provisions of the Companies Act, 2013 and the regulations, rules,
                circulars, and notifications issued by the Ministry of Corporate
                Affairs (MCA), Government of India.
              </p>
            </section>

            {/* 02. Applicability */}
            <section id="sec-02" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">02.</span>
                <span>Applicability</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                This policy applies to the company, its directors, officers,
                employees, and all stakeholders to ensure compliance with all
                applicable MCA requirements.
              </p>
            </section>

            {/* 03. Objectives */}
            <section id="sec-03" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">03.</span>
                <span>Objectives</span>
              </h3>
              <ul className="flex flex-col gap-2 pt-1">
                {[
                  "Ensure compliance with the Companies Act, 2013 and MCA guidelines.",
                  "Promote good corporate governance and ethical business conduct.",
                  "Ensure timely filings, disclosures, and maintenance of statutory registers.",
                  "Safeguard stakeholder interests through transparency and accountability.",
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

            {/* 04. Legal Framework */}
            <section id="sec-04" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">04.</span>
                <span>Legal Framework</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Our compliance is governed by the following:
              </p>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-4.5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaBuildingColumns />
                  </div>
                  <h4 className="font-display text-[13.5px] font-[700] text-[#111827] leading-snug">
                    Companies Act, 2013
                  </h4>
                  <p className="font-display text-[12px] leading-[1.5] text-[#64748B]">
                    Primary legislation governing companies in India.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-4.5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaFileLines />
                  </div>
                  <h4 className="font-display text-[13.5px] font-[700] text-[#111827] leading-snug">
                    MCA Rules &amp; Notifications
                  </h4>
                  <p className="font-display text-[12px] leading-[1.5] text-[#64748B]">
                    Rules framed under the Companies Act.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-4.5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaCompassDrafting />
                  </div>
                  <h4 className="font-display text-[13.5px] font-[700] text-[#111827] leading-snug">
                    Secretarial Standards (SS-1 &amp; SS-2)
                  </h4>
                  <p className="font-display text-[12px] leading-[1.5] text-[#64748B]">
                    Board meetings and General Meetings.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-4.5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaArrowsRotate />
                  </div>
                  <h4 className="font-display text-[13.5px] font-[700] text-[#111827] leading-snug">
                    MCA Circulars
                  </h4>
                  <p className="font-display text-[12px] leading-[1.5] text-[#64748B]">
                    Guidance and directions issued from time to time.
                  </p>
                </div>
              </div>
            </section>

            {/* 05. Key MCA Requirements */}
            <section id="sec-05" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">05.</span>
                <span>Key MCA Requirements</span>
              </h3>
              <ul className="flex flex-col gap-2.5 pt-1">
                {[
                  {
                    title: "Incorporation & Registration:",
                    desc: "Ensure valid incorporation and updated registration details.",
                  },
                  {
                    title: "Board & Committee Meetings:",
                    desc: "Conduct meetings as per statutory requirements and record minutes.",
                  },
                  {
                    title: "Statutory Registers:",
                    desc: "Maintain all registers and records as prescribed.",
                  },
                  {
                    title: "Annual Compliances:",
                    desc: "File annual returns, financial statements, and other forms within due timelines.",
                  },
                  {
                    title: "Shareholder Communications:",
                    desc: "Ensure transparent communication and proper documentation.",
                  },
                  {
                    title: "Management Changes:",
                    desc: "Timely filing of forms for appointment, resignation, or changes in directors/KMP.",
                  },
                ].map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]"
                  >
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>
                      <strong className="font-[600] text-[#111827]">
                        {req.title}
                      </strong>{" "}
                      {req.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 06. Governance & Responsibilities */}
            <section id="sec-06" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">06.</span>
                <span>Governance &amp; Responsibilities</span>
              </h3>

              {/* 3 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaUserTie />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Board of Directors
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Overall responsibility for compliance and governance oversight.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaShieldHalved />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Company Secretary / Compliance Officer
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Ensure timely compliance, filings, and maintenance of records.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2 transition-all duration-300 hover:shadow-xs hover:border-[#1A6CFF]/30">
                  <div className="text-[#334155] text-[18px]">
                    <FaUsers />
                  </div>
                  <h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">
                    Employees
                  </h4>
                  <p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">
                    Cooperate and support in maintaining compliance and documentation.
                  </p>
                </div>
              </div>
            </section>

            {/* 07. Compliance Practices */}
            <section id="sec-07" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">07.</span>
                <span>Compliance Practices</span>
              </h3>
              <ul className="flex flex-col gap-2 pt-1">
                {[
                  "Maintain a compliance calendar for all MCA due dates.",
                  "Conduct periodic internal audits and compliance reviews.",
                  "Ensure accuracy and timeliness in all filings and records.",
                  "Implement systems for tracking regulatory changes and updates.",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]"
                  >
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 08. Filings & Disclosures */}
            <section id="sec-08" className="scroll-mt-12 flex flex-col gap-2.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">08.</span>
                <span>Filings &amp; Disclosures</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We ensure timely and accurate filing of all forms and returns on the
                MCA portal, including but not limited to:
              </p>

              {/* 2-Column Filings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]">
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>Annual Return (MGT-7 / MGT-7A)</span>
                  </div>
                  <div className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]">
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>Financial Statements (AOC-4)</span>
                  </div>
                  <div className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]">
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>Director KYC (DIR-3 KYC)</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]">
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>Appointment &amp; Resignation (DIR-12)</span>
                  </div>
                  <div className="flex items-start gap-2.5 font-display text-[14px] md:text-[14.5px] leading-[1.6] text-[#4B5563]">
                    <span className="text-[#1A6CFF] mt-1.5 text-[8px] leading-none shrink-0">
                      ●
                    </span>
                    <span>Charges, Allotments &amp; Other Filings</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 09. Records & Maintenance */}
            <section id="sec-09" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">09.</span>
                <span>Records &amp; Maintenance</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                All statutory registers, records, and documents are maintained at
                the registered office in accordance with the Companies Act, 2013
                and MCA rules.
              </p>
            </section>

            {/* 10. Non-Compliance */}
            <section id="sec-10" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">10.</span>
                <span>Non-Compliance</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                Any non-compliance may result in penalties, fines, or legal action.
                Disciplinary action will be taken against individuals responsible
                for non-compliance.
              </p>
            </section>

            {/* 11. Continuous Improvement */}
            <section id="sec-11" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">11.</span>
                <span>Continuous Improvement</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                We regularly review and enhance our compliance framework to ensure
                alignment with regulatory changes and best governance practices.
              </p>
            </section>

            {/* 12. References */}
            <section id="sec-12" className="scroll-mt-12 flex flex-col gap-2">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
                <span className="text-[#1A6CFF] font-[700]">12.</span>
                <span>References</span>
              </h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">
                This policy is aligned with:
              </p>
              <ul className="flex flex-col gap-2 pt-1">
                {[
                  "Companies Act, 2013",
                  "Companies (Accounts) Rules, 2014",
                  "Secretarial Standards (SS-1 & SS-2)",
                  "MCA Circulars & Notifications (as amended)",
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
                This document is intended for informational purposes only and does
                not constitute legal advice. For specific concerns, please
                consult our Compliance Officer at{" "}
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
