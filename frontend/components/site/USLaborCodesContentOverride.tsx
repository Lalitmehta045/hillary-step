"use client";

import { useEffect } from "react";
import { USLaborCodesContent as BaseUSLaborCodesContent } from "./USLaborCodesContent";

interface USLaborCodesContentProps {
  onClose?: () => void;
  onNavigateType?: (type: "privacy" | "msme" | "mca" | "asic") => void;
}

export function USLaborCodesContent(props: USLaborCodesContentProps) {
  useEffect(() => {
    const section = document.getElementById("sec-12");
    if (!section) return;

    section.innerHTML = `
      <h3 class="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
        <span class="text-[#1A6CFF] font-[700]">12.</span>
        <span>Corporate Identification</span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        <div class="rounded-[12px] border border-[#E2E8F0]/70 bg-[#F8FAFC] p-4 sm:p-5 flex flex-col gap-3">
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Legal Entity Name</span><span class="font-display text-[14px] md:text-[14.5px] leading-[1.6] font-[600] text-[#111827]">Hillary Step Solutions LLC</span></div>
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">State of Incorporation</span><span class="font-display text-[14px] leading-[1.6] text-[#4B5563]">Wyoming</span></div>
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Incorporation Date</span><span class="font-display text-[14px] leading-[1.6] text-[#4B5563]">14/09/2026</span></div>
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Corporate ID / File Number</span><span class="font-display text-[14px] leading-[1.6] text-[#4B5563]">2026-002080383</span></div>
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">DOL Compliance Status</span><span class="font-display text-[14px] leading-[1.6] text-[#4B5563]">Active</span></div>
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Official Email ID</span><a href="mailto:info@hillarystepsolutions.com" class="font-display text-[14px] leading-[1.6] text-[#1A6CFF] hover:underline">info@hillarystepsolutions.com</a></div>
        </div>
        <div class="rounded-[12px] border border-[#E2E8F0]/70 bg-[#F8FAFC] p-4 sm:p-5 flex flex-col gap-3">
          <span class="font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#FF9500]">📍 Principal Place of Business &amp; Registered Agent Office</span>
          <span class="font-display text-[14px] md:text-[14.5px] leading-[1.65] text-[#4B5563]">30 N Gould St Ste N<br />Sheridan, WY 82801</span>
          <div><span class="block font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Registered Agent</span><span class="font-display text-[14px] leading-[1.6] text-[#4B5563]">Northwest Registered Agent Service Inc</span></div>
        </div>
      </div>
    `;

    const footerButtons = Array.from(document.querySelectorAll("button")).filter((button) =>
      ["Privacy Policy", "Terms of Service", "Security Architecture", "Sitemap"].includes(button.textContent?.trim() || "")
    );

    footerButtons.forEach((button) => {
      button.classList.add("us-corporate-gradient-footer-link");
    });

    const style = document.createElement("style");
    style.textContent = `
      .us-corporate-gradient-footer-link { transition: all 300ms ease; }
      .us-corporate-gradient-footer-link:hover {
        background-image: linear-gradient(90deg, #1A6CFF 0%, #40F600 33%, #FF9500 66%, #1A6CFF 100%);
        background-size: 300% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent !important;
        -webkit-text-fill-color: transparent;
        animation: us-corporate-gradient-flow 8s ease infinite;
      }
      @keyframes us-corporate-gradient-flow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  return <BaseUSLaborCodesContent {...props} />;
}
