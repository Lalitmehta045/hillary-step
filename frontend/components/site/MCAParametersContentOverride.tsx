"use client";

import { useEffect } from "react";
import { MCAParametersContent as BaseMCAParametersContent } from "./MCAParametersContent";

interface MCAParametersContentOverrideProps {
  onClose?: () => void;
  onNavigateType?: (type: "privacy" | "msme" | "asic" | "labor") => void;
}

export function MCAParametersContent({
  onClose,
  onNavigateType,
}: MCAParametersContentOverrideProps) {
  useEffect(() => {
    const section = document.getElementById("sec-12");
    if (!section) return;

    section.innerHTML = `
      <h3 class="font-display text-[18px] md:text-[20px] font-[700] text-[#111827] flex items-baseline gap-2">
        <span class="text-[#1A6CFF] font-[700]">12.</span>
        <span>Corporate Identification</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 items-stretch">
        <div class="rounded-[12px] border border-[#E2E8F0]/70 bg-[#F8FAFC] p-4 sm:p-5 flex min-w-0 flex-col">
          <div class="flex flex-col gap-1">
            <span class="font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">Legal Entity Name</span>
            <span class="font-display text-[14px] md:text-[14.5px] leading-[1.6] font-[600] text-[#111827]">Hillary Step Solutions Private Limited</span>
          </div>
          <div class="grid grid-cols-2 gap-5 pt-2">
            <div class="min-w-0 flex flex-col gap-1.5">
              <span class="font-display text-[10px] font-[700] tracking-[0.08em] uppercase text-[#9CA3AF]">Date of Incorporation</span>
              <span class="font-display text-[14px] leading-[1.5] text-[#4B5563]">21 / 02 / 2020</span>
            </div>
            <div class="min-w-0 flex flex-col gap-1.5">
              <span class="font-display text-[10px] font-[700] tracking-[0.08em] uppercase text-[#9CA3AF]">CIN Number</span>
              <span class="font-display text-[13px] leading-[1.5] text-[#4B5563] break-all">U62011UP2020PTC127351</span>
            </div>
          </div>
          <div class="flex flex-col gap-1 pt-1">
            <span class="font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#9CA3AF]">GSTIN</span>
            <span class="font-display text-[14px] leading-[1.6] text-[#4B5563]">23AAFCH2272R1Z9</span>
          </div>
        </div>

        <div class="rounded-[12px] border border-[#E2E8F0]/70 bg-[#F8FAFC] p-4 sm:p-5 flex min-w-0 flex-col gap-3">
          <div class="flex flex-col gap-1">
            <span class="font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#FF9500]">Registered Head Office</span>
            <span class="font-display text-[14px] md:text-[14.5px] leading-[1.55] text-[#4B5563]">E-842, 8th Floor, Gaur Global Village, GH Plot No. 4, Crossings Republik, Ghaziabad, Uttar Pradesh – 201016</span>
          </div>
          <div class="h-px w-full bg-[#E2E8F0]" />
          <div class="flex flex-col gap-1">
            <span class="font-display text-[11px] font-[700] tracking-[0.12em] uppercase text-[#1A6CFF]">Branch Office</span>
            <span class="font-display text-[14px] md:text-[14.5px] leading-[1.55] text-[#4B5563]">Plot No. 850, 49/A, Near Sai Palace Barat Ghar, Pawan Bhoomi, Shaktinagar, Jabalpur, Madhya Pradesh – 482001</span>
          </div>
          <div class="mt-auto pt-3">
            <div class="h-px w-full bg-[#E2E8F0] mb-3" />
            <div class="flex min-w-0 flex-col gap-1.5">
              <span class="font-display text-[10px] font-[700] tracking-[0.08em] uppercase text-[#1A6CFF]">Corporate Email</span>
              <a href="mailto:info@hillarystepsolutions.com" class="block max-w-full truncate font-display text-[13.5px] leading-[1.5] text-[#1A6CFF] hover:underline">info@hillarystepsolutions.com</a>
            </div>
          </div>
        </div>

        </div>
      </div>
    `;

    const footerLinkLabels = [
      "Privacy Policy",
      "Terms of Service",
      "Security Architecture",
      "Sitemap",
    ];

    document.querySelectorAll("button").forEach((button) => {
      const label = button.textContent?.trim();
      if (label && footerLinkLabels.includes(label)) {
        button.classList.add("mca-gradient-footer-link");
      }
    });
  }, []);

  return (
    <>
      <style jsx global>{`
        .mca-gradient-footer-link {
          transition: all 300ms ease;
        }
        .mca-gradient-footer-link:hover {
          background-image: linear-gradient(90deg, #1a6cff 0%, #40f600 33%, #ff9500 66%, #1a6cff 100%);
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent !important;
          -webkit-text-fill-color: transparent;
          animation: gradient-flow 8s ease infinite;
        }
      `}</style>
      <BaseMCAParametersContent
        onClose={onClose}
        onNavigateType={onNavigateType}
      />
    </>
  );
}
