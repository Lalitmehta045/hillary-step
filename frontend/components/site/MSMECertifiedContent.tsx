"use client";

import { useEffect, useRef, useState } from "react";
import { GradientReveal } from "@/components/motion/GradientReveal";

import {
  FaBuildingUser,
  FaScaleBalanced,
  FaShieldHalved,
  FaFileContract,
  FaAward,
  FaHandshakeAngle,
  FaTriangleExclamation,
  FaPlus,
  FaMinus,
  FaCheck,
} from "react-icons/fa6";

interface MSMECertifiedContentProps {
  onClose?: () => void;
  onNavigateType?: (type: "mca" | "asic" | "labor" | "privacy") => void;
}

const TOC_ITEMS = [
  { id: "msme-01", num: "01.", label: "Executive Overview" },
  { id: "msme-02", num: "02.", label: "Statutory Framework" },
  { id: "msme-03", num: "03.", label: "Enterprise Classification" },
  { id: "msme-04", num: "04.", label: "Procurement & Tenders" },
  { id: "msme-05", num: "05.", label: "Quality & Innovation" },
  { id: "msme-06", num: "06.", label: "Statutory Governance" },
];

const STEPPER_ITEMS = [
  { label: "REGISTER", targetId: "msme-02" },
  { label: "CLASSIFY", targetId: "msme-03" },
  { label: "DELIVER", targetId: "msme-04" },
  { label: "GOVERN", targetId: "msme-06" },
];

export function MSMECertifiedContent({
  onClose,
  onNavigateType,
}: MSMECertifiedContentProps) {
  const [activeSection, setActiveSection] = useState<string>("msme-01");
  const [openRight, setOpenRight] = useState<string | null>("payment");
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-10% 0px -65% 0px", threshold: 0 }
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
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={contentContainerRef} className="relative w-full bg-white text-[#191C1E] font-display antialiased">
      <div className="mx-auto w-full max-w-[1140px] px-6 md:px-12 pt-14 md:pt-16 pb-12">
        <p className="font-display text-[12px] md:text-[13px] font-[600] tracking-[0.16em] text-[#1A6CFF] uppercase mb-4">
          STATUTORY COMPLIANCE / MINISTRY OF MSME
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 select-none mb-10 md:mb-12">
          <h1 className="font-display text-[44px] sm:text-[54px] md:text-[64px] font-[800] leading-none tracking-[-0.03em]">
            <GradientReveal className="grad-text">MSME &amp; CERTIFIED</GradientReveal>
          </h1>
        </div>
        <div className="relative w-full border-t border-b border-gray-100/90 py-7 my-6">
          <div className="absolute top-[34px] left-[5%] right-[5%] h-[1.5px] bg-[#E5E7EB] z-0" />
          <div className="relative z-10 flex items-center justify-between max-w-[760px] mx-auto px-4">
            {STEPPER_ITEMS.map((step) => (
              <button key={step.label} type="button" onClick={() => scrollToSection(step.targetId)} className="group flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 focus:outline-none">
                <span className="w-[10px] h-[10px] rounded-full bg-[#FF6A00] ring-4 ring-white shadow-xs transition-transform duration-300 group-hover:scale-125" />
                <span className="font-display text-[10px] md:text-[11px] font-[600] tracking-[0.16em] text-[#333333] mt-3 group-hover:text-[#1A6CFF] transition-colors">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 pt-6">
          <aside className="relative">
            <div className="lg:sticky lg:top-8 flex flex-col">
              <h2 className="font-display text-[11px] font-[700] tracking-[0.18em] text-[#9CA3AF] uppercase mb-4">CONTENTS</h2>
              <nav aria-label="MSME Statutory Contents">
                <ul className="flex flex-col gap-[7px] max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  {TOC_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button type="button" onClick={() => scrollToSection(item.id)} className={`group w-full text-left text-[13px] leading-[20px] transition-all cursor-pointer bg-transparent border-0 p-0 flex items-center ${isActive ? "border-l-[2.5px] border-[#FF6A00] pl-2.5 text-[#1A6CFF] font-[600]" : "border-l-[2.5px] border-transparent pl-2.5 text-[#4B5563] hover:text-[#111827] font-[400]"}`}>
                          <span className={`transition-colors ${isActive ? "text-[#1A6CFF] font-[600]" : "text-[#4B5563] group-hover:text-[#111827]"}`}>{item.num} {item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>
          <main className="flex flex-col gap-10 text-[#374151]">
            <section id="msme-01" className="scroll-mt-12 flex flex-col gap-2.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">01.</span><span>Executive Overview</span></h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">Hillary Step Solutions is proudly recognized and registered under the Ministry of Micro, Small &amp; Medium Enterprises (MSME), Government of India. This statutory validation solidifies our commitment to pioneering technological innovation, generating high-skilled employment, and operating in strict accordance with national economic governance protocols.</p>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">Our certified status provides enterprise clients, public sector undertakings, and international partners with verified transparency, rigorous statutory adherence, and verified compliance benchmarks across our IT platforms, global workforce talent pipelines, and eco-smart civil infrastructure operations.</p>
            </section>
            <section id="msme-02" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">02.</span><span>Statutory Framework &amp; UDYAM Registration</span></h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">Our registration is codified under the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, and formally registered on the Government of India&apos;s digital Udyam portal.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2"><div className="text-[#1A6CFF] text-[18px]"><FaAward /></div><h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">Udyam Certified</h4><p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">Authenticated under the Government of India national portal with perpetual statutory recognition.</p></div>
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2"><div className="text-[#10B981] text-[18px]"><FaScaleBalanced /></div><h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">MSMED Act 2006</h4><p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">Full alignment with corporate governance, priority status, and statutory dispute protocols.</p></div>
                <div className="bg-[#F8FAFC] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0]/60 flex flex-col gap-2"><div className="text-[#FF6A00] text-[18px]"><FaBuildingUser /></div><h4 className="font-display text-[14px] font-[700] text-[#111827] leading-snug">Enterprise Class</h4><p className="font-display text-[12.5px] leading-[1.5] text-[#64748B]">Certified service provider in advanced cognitive engineering, IT consulting, and infrastructure delivery.</p></div>
              </div>
            </section>
            <section id="msme-03" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">03.</span><span>Enterprise Classification &amp; Metrics</span></h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">Following the revised composite criteria notification by the Ministry of MSME, enterprises are classified based on cumulative investment in plant &amp; machinery/equipment and audited annual turnover.</p>
<<<<<<< HEAD
              <div className="overflow-x-auto rounded-[12px] border border-gray-200/80 bg-white"><table className="w-full text-left font-display text-[12.5px] md:text-[13px]"><thead className="bg-[#F8FAFC] border-b border-gray-200/80 text-[#111827] font-[700]"><tr><th className="py-3 px-4">Classification</th><th className="py-3 px-4">Investment Ceiling</th><th className="py-3 px-4">Annual Turnover Ceiling</th><th className="py-3 px-4">Status</th></tr></thead><tbody className="divide-y divide-gray-100 text-[#4B5563]"><tr><td className="py-3 px-4 font-[600] text-[#111827]">Micro Enterprise</td><td className="py-3 px-4">Up to ₹1 Crore</td><td className="py-3 px-4">Up to ₹5 Crore</td><td className="py-3 px-4 text-[#64748B]">HSS Certified <Solution></Solution></td></tr><tr className="bg-[#F0F7FF]/50"><td className="py-3 px-4 font-[700] text-[#007BFF] flex items-center gap-2"><FaCheck className="text-[#10B981] text-[12px]" /><span>Small / Medium Enterprise</span></td><td className="py-3 px-4 font-[600] text-[#111827]">₹10 Cr to ₹50 Cr</td><td className="py-3 px-4 font-[600] text-[#111827]">₹50 Cr to ₹250 Cr</td><td className="py-3 px-4">Small / Medium Enterprise</td></tr><tr><td className="py-3 px-4 font-[600] text-[#111827]">Medium Enterprise</td><td className="py-3 px-4">Up to ₹50 Crore</td><td className="py-3 px-4">Up to ₹250 Crore</td><td className="py-3 px-4 text-[#64748B]">Enterprise scale</td></tr></tbody></table></div>
=======
              <div className="overflow-x-auto rounded-[12px] border border-gray-200/80 bg-white"><table className="w-full text-left font-display text-[12.5px] md:text-[13px]"><thead className="bg-[#F8FAFC] border-b border-gray-200/80 text-[#111827] font-[700]"><tr><th className="py-3 px-4">Classification</th><th className="py-3 px-4">Investment Ceiling</th><th className="py-3 px-4">Annual Turnover Ceiling</th><th className="py-3 px-4">Status</th></tr></thead><tbody className="divide-y divide-gray-100 text-[#4B5563]"><tr className="bg-[#F0F7FF]/50"><td className="py-3 px-4 font-[700] text-[#007BFF] flex items-center gap-2"><FaCheck className="text-[#10B981] text-[12px]" /><span>Micro Enterprise</span></td><td className="py-3 px-4 font-[600] text-[#111827]">Up to ₹1 Crore</td><td className="py-3 px-4 font-[600] text-[#111827]">Up to ₹5 Crore</td><td className="py-3 px-4 text-[#64748B]">HSS Certified</td></tr><tr><td className="py-3 px-4 font-[600] text-[#111827]">Small / Medium Enterprise</td><td className="py-3 px-4">₹10 Cr to ₹50 Cr</td><td className="py-3 px-4">₹50 Cr to ₹250 Cr</td><td className="py-3 px-4">Hillary Step Certified</td></tr><tr><td className="py-3 px-4 font-[600] text-[#111827]">Medium Enterprise</td><td className="py-3 px-4">Up to ₹50 Crore</td><td className="py-3 px-4">Up to ₹250 Crore</td><td className="py-3 px-4 text-[#64748B]">Enterprise scale</td></tr></tbody></table></div>
>>>>>>> 72574d35a59260117d06984a688c958455f79977
            </section>
            <section id="msme-04" className="scroll-mt-12 flex flex-col gap-2.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">04.</span><span>Public Procurement &amp; Tender Benefits</span></h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">As an accredited MSME, Hillary Step Solutions benefits from and complies with national Public Procurement Policy frameworks, ensuring competitive agility, statutory bid exemptions, and expedited vendor onboarding:</p>
              <ul className="flex flex-col gap-2 pt-1 font-display text-[13px] md:text-[13.5px] text-[#4B5563]"><li className="flex items-start gap-2.5"><span className="w-[6px] h-[6px] rounded-full bg-[#FF6A00] mt-2 shrink-0" /><span><strong className="text-[#111827]">EMD &amp; Tender Fee Waivers:</strong> Exemption from Earnest Money Deposit (EMD) and tender document fees in central and state government digital procurements.</span></li><li className="flex items-start gap-2.5"><span className="w-[6px] h-[6px] rounded-full bg-[#FF6A00] mt-2 shrink-0" /><span><strong className="text-[#111827]">25% Mandatory Procurement Policy:</strong> Direct qualification under the statutory 25% annual procurement quota reserved for MSEs by Central Ministries and PSUs.</span></li><li className="flex items-start gap-2.5"><span className="w-[6px] h-[6px] rounded-full bg-[#FF6A00] mt-2 shrink-0" /><span><strong className="text-[#111827]">Priority Vendor Onboarding:</strong> Streamlined commercial due diligence across both domestic government bids and international enterprise subcontracts.</span></li></ul>
            </section>
            <section id="msme-05" className="scroll-mt-12 flex flex-col gap-2.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">05.</span><span>Quality Standards &amp; Technological Innovation</span></h3>
              <p className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">MSME certification is deeply integrated with our engineering philosophy. We maintain zero-defect standards across digital systems, infrastructure planning, and workforce deployment. Our technology stack leverages machine intelligence, containerized pipelines, and global best practices to bridge local innovation with international enterprise requirements.</p>
            </section>
            <section id="msme-06" className="scroll-mt-12 flex flex-col gap-3">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">06.</span><span>Statutory Governance &amp; Compliance Safeguards</span></h3>
              <div className="flex flex-col border-t border-b border-gray-200 divide-y divide-gray-100"><div className="py-3.5"><button type="button" onClick={() => setOpenRight(openRight === "payment" ? null : "payment")} className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-0 p-0 group"><span className="font-mono text-[13px] md:text-[13.5px] text-[#111827] tracking-wider uppercase font-[500] group-hover:text-[#1A6CFF] transition-colors">Delayed Payment Protection (Section 15, MSMED Act)</span><span className="text-[#9CA3AF] text-[11px]">{openRight === "payment" ? <FaMinus /> : <FaPlus />}</span></button>{openRight === "payment" && <p className="pt-2 text-[12.5px] md:text-[13px] leading-[1.6] text-[#64748B] font-display">Under Section 15 of the MSMED Act, buyers are legally bound to make payments within 45 days of agreement. Failure triggers compound interest with monthly rests at 3x the RBI bank rate, safeguarding liquidity and operational integrity.</p>}</div><div className="py-3.5"><button type="button" onClick={() => setOpenRight(openRight === "dispute" ? null : "dispute")} className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-0 p-0 group"><span className="font-mono text-[13px] md:text-[13.5px] text-[#111827] tracking-wider uppercase font-[500] group-hover:text-[#1A6CFF] transition-colors">MSEFC Statutory Arbitration &amp; Conciliation</span><span className="text-[#9CA3AF] text-[11px]">{openRight === "dispute" ? <FaMinus /> : <FaPlus />}</span></button>{openRight === "dispute" && <p className="pt-2 text-[12.5px] md:text-[13px] leading-[1.6] text-[#64748B] font-display">Any contractual disputes are referenceable to the Micro and Small Enterprises Facilitation Council (MSEFC) for swift statutory conciliation and arbitration, bypassing protracted commercial litigation.</p>}</div><div className="py-3.5"><button type="button" onClick={() => setOpenRight(openRight === "audit" ? null : "audit")} className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-0 p-0 group"><span className="font-mono text-[13px] md:text-[13.5px] text-[#111827] tracking-wider uppercase font-[500] group-hover:text-[#1A6CFF] transition-colors">Corporate Transparency &amp; MCA Disclosures</span><span className="text-[#9CA3AF] text-[11px]">{openRight === "audit" ? <FaMinus /> : <FaPlus />}</span></button>{openRight === "audit" && <p className="pt-2 text-[12.5px] md:text-[13px] leading-[1.6] text-[#64748B] font-display">Full transparency is maintained with mandatory statutory disclosures in audited balance sheets, corporate filings, and periodic returns submitted to the Registrar of Companies and Ministry of Corporate Affairs.</p>}</div></div>
            </section>
            <div className="bg-[#FFFDF7] rounded-[12px] p-4.5 sm:p-5 border border-[#FDE68A] flex flex-col gap-1.5 mt-2"><div className="flex items-center gap-2 text-[#D97706] font-display text-[12px] font-[700] tracking-[0.14em] uppercase"><FaTriangleExclamation className="text-[13px] text-[#F59E0B]" /><span>OFFICIAL STATUTORY DISCLOSURE</span></div><p className="font-display text-[12.5px] md:text-[13px] leading-[1.6] text-[#4B5563]">This document confirms the statutory registration and compliance standing of Hillary Step Solutions under the Ministry of Micro, Small &amp; Medium Enterprises, Government of India. For tender verifications, certificate extracts, or corporate compliance inquiries, contact <a href="mailto:info@hillarystepsolutions.com" className="text-[#1A6CFF] font-[500] hover:underline">info@hillarystepsolutions.com</a>.</p></div>
            <section id="msme-07" className="scroll-mt-12 flex flex-col gap-3.5">
              <h3 className="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2"><span className="text-[#1A6CFF] font-[700]">07.</span><span>Statutory Compliance (MSME Validations)</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="rounded-[12px] border border-[#E2E8F0]/70 bg-[#F8FAFC] p-4 sm:p-5 flex flex-col gap-3">
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Enterprise Name</span><span className="font-display text-[14px] leading-[1.6] font-[600] text-[#111827]">Hillary Step Solutions Private Limited</span></div>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Udyam Registration Number</span><span className="font-display text-[14px] leading-[1.6] text-[#4B5563]">UDYAM-UP-29-0242718</span></div>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Enterprise Type</span><span className="font-display text-[14px] leading-[1.6] text-[#4B5563]">Micro Enterprise</span></div>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Major Activity</span><span className="font-display text-[14px] leading-[1.6] text-[#4B5563]">IT Solutions | Global Staffing | Civil Construction</span></div>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">National Industry Classification (NIC) Code</span><span className="font-display text-[14px] leading-[1.6] text-[#4B5563]">62011, 78100, 42101, 62020, 78200, 63111, 41001, 71100, 73100, 42909, 62099, 78300</span></div>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Validation Status</span><span className="font-display text-[14px] leading-[1.6] font-[600] text-[#059669]">Verified &amp; Active (Pursuant to MSMED Act, 2006)</span></div>
                </div>
                <div className="rounded-[12px] border border-[#E2E8F0]/70 bg-[#F8FAFC] p-4 sm:p-5 flex flex-col gap-3">
                  <span className="font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#FF9500]">Registered Unit Details</span>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Official Address</span><span className="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">E-842, 8th Floor, Gaur Global Village, GH Plot No. 4, Crossings Republik, Ghaziabad, Uttar Pradesh – 201016</span></div>
                  <div><span className="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Official Email ID</span><a href="mailto:info@hillarystepsolutions.com" className="font-display text-[14px] leading-[1.6] text-[#1A6CFF] hover:underline">info@hillarystepsolutions.com</a></div>
                </div>
              </div>
            </section>
            <div className="border-t border-gray-100 pt-8 pb-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5"><span className="font-display text-[13px] font-[700] tracking-[0.06em] text-[#111827] uppercase">HILLARY STEP SOLUTIONS</span><span className="font-display text-[11px] font-[400] text-[#9CA3AF] tracking-[0.04em] uppercase">© 2026 HILLARY STEP SOLUTIONS. ARCHITECTING ASCENT.</span></div>
              <div className="flex items-center gap-4 text-[12px] font-display">
                <button type="button" onClick={() => onNavigateType?.("mca")} className="us-corporate-gradient-footer-link font-[500] text-[#6B7280] hover:text-transparent hover:bg-clip-text hover:[-webkit-background-clip:text] hover:bg-[linear-gradient(90deg,#1A6CFF_0%,#40F600_33%,#FF9500_66%,#1A6CFF_100%)] hover:bg-[length:300%_100%] transition-all duration-300 cursor-pointer bg-transparent border-0 p-0">MCA Parameters</button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button type="button" onClick={() => onNavigateType?.("asic")} className="us-corporate-gradient-footer-link font-[500] text-[#6B7280] hover:text-transparent hover:bg-clip-text hover:[-webkit-background-clip:text] hover:bg-[linear-gradient(90deg,#1A6CFF_0%,#40F600_33%,#FF9500_66%,#1A6CFF_100%)] hover:bg-[length:300%_100%] transition-all duration-300 cursor-pointer bg-transparent border-0 p-0">ASIC Standards</button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button type="button" onClick={() => onNavigateType?.("labor")} className="us-corporate-gradient-footer-link font-[500] text-[#6B7280] hover:text-transparent hover:bg-clip-text hover:[-webkit-background-clip:text] hover:bg-[length:300%_100%] transition-all duration-300 cursor-pointer bg-transparent border-0 p-0">US Labor Codes</button>
                <span className="text-[#E5E7EB] select-none">|</span>
                <button type="button" onClick={() => onNavigateType?.("privacy")} className="us-corporate-gradient-footer-link font-[500] text-[#6B7280] hover:text-transparent hover:bg-clip-text hover:[-webkit-background-clip:text] hover:[-webkit-background-clip:text] hover:bg-[linear-gradient(90deg,#1A6CFF_0%,#40F600_33%,#FF9500_66%,#1A6CFF_100%)] hover:bg-[length:300%_100%] transition-all duration-300 cursor-pointer bg-transparent border-0 p-0">Privacy &amp; Terms</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
