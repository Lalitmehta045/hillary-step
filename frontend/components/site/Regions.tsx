"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";

import { Globe } from "@/components/site/Globe";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";

const REGIONS = {
  "United States": {
    marker: { left: "30%", top: "47%" },
    offices: "Los Angeles · San Jose · New York · Dallas · Boston · Chicago",
    entity: "Hillary Step Solutions LLC",
    principal: "Kunal Priyadarshi, Founder & Group CEO",
    capabilities: "Digital Transformation · Talent Acquisition · Strategic AI Consulting",
    jurisdiction: "North America (Federal & Cross-State Delivery), Canada & Mexico",
    operatingModel: "Onshore Client Management with Seamless Cross-Border Delivery",
    timezone: "EST (UTC-5)",
    iana: "America/New_York",
  },
  Australia: {
    marker: { left: "77%", top: "74%" },
    offices: "Sydney · Melbourne · Brisbane · Perth",
    entity: "Hillary Step Solutions Pty Ltd",
    principal: "Mrinal Priyadarshi, Regional COO",
    capabilities: "Digital Infrastructure & Cloud · Trans-Tasman Talent Acquisition · Workforce Capability & Scaling",
    jurisdiction: "Australia, New Zealand, and APAC Corporate Networks",
    operatingModel: "Hybrid Managed Services & Agile Workforce Scaling",
    timezone: "AEST (UTC+10)",
    iana: "Australia/Sydney",
  },
  India: {
    marker: { left: "65%", top: "54%" },
    offices: "Delhi NCR · Bengaluru · Mumbai · Hydrabad · Chennai",
    entity: "Hillary Step Solutions Private Limited",
    principal: "Kantesh Prasad Singh, Regional CFO",
    capabilities: "SaaS Product R&D · Eco-Smart Infra Projects · Global IT Delivery Hubs · Outsourcing ",
    jurisdiction: "Pan-India Distribution & International Offshore Integration",
    operatingModel: "Centralized Engineering Command & Offshore Development Center (ODC)",
    timezone: "IST (UTC+05:30)",
    iana: "Asia/Kolkata",
  },
} as const;

type RegionName = keyof typeof REGIONS;
const NAMES = Object.keys(REGIONS) as RegionName[];

export function Regions() {
  const [active, setActive] = useState<RegionName>("India");
  const region = REGIONS[active];
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const iana = REGIONS[active].iana;
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: iana,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <section className="relative w-full overflow-hidden bg-white pt-[64px] pb-[64px] max-md:pt-[40px] max-md:pb-[40px]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="global-presence-ribbon" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A18" stopOpacity="0.34" />
              <stop offset="22%" stopColor="#FF7A18" stopOpacity="0.30" />
              <stop offset="46%" stopColor="#7CFF00" stopOpacity="0.30" />
              <stop offset="66%" stopColor="#40F600" stopOpacity="0.32" />
              <stop offset="84%" stopColor="#1A6CFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#1A6CFF" stopOpacity="0.26" />
            </linearGradient>
            <linearGradient id="global-presence-ribbon-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A18" stopOpacity="0.34" />
              <stop offset="45%" stopColor="#7CFF00" stopOpacity="0.22" />
              <stop offset="72%" stopColor="#40F600" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#1A6CFF" stopOpacity="0.24" />
            </linearGradient>
            <filter id="global-presence-ribbon-blur" x="-15%" y="-35%" width="130%" height="170%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
            <linearGradient id="global-presence-ribbon-fade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="14%" stopColor="white" stopOpacity="0.35" />
              <stop offset="24%" stopColor="white" stopOpacity="0.9" />
              <stop offset="30%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="global-presence-ribbon-mask">
              <rect x="0" y="0" width="1600" height="1000" fill="url(#global-presence-ribbon-fade)" />
            </mask>
          </defs>

          <g mask="url(#global-presence-ribbon-mask)">
            <path
              d="M-120 930 C 250 865, 560 760, 820 690 C 1040 615, 1170 520, 1290 370 C 1400 235, 1490 105, 1690 15"
              fill="none"
              stroke="url(#global-presence-ribbon)"
              strokeWidth="150"
              strokeLinecap="round"
              filter="url(#global-presence-ribbon-blur)"
              opacity="0.98"
            />

            <path
              d="M-140 955 C 250 885, 560 790, 830 715 C 1050 640, 1190 535, 1310 390 C 1420 250, 1510 125, 1710 30"
              fill="none"
              stroke="url(#global-presence-ribbon-highlight)"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.9"
            >
              <animate
                attributeName="d"
                dur="11s"
                repeatCount="indefinite"
                values="M-140 955 C 250 885, 560 790, 830 715 C 1050 640, 1190 535, 1310 390 C 1420 250, 1510 125, 1710 30;
                        M-140 925 C 250 855, 560 760, 830 685 C 1050 610, 1190 505, 1310 360 C 1420 220, 1510 95, 1710 0;
                        M-140 955 C 250 885, 560 790, 830 715 C 1050 640, 1190 535, 1310 390 C 1420 250, 1510 125, 1710 30"
              />
            </path>

            <path
              d="M-80 975 C 300 905, 600 820, 850 745 C 1060 670, 1200 565, 1330 415 C 1440 285, 1530 145, 1740 55"
              fill="none"
              stroke="url(#global-presence-ribbon)"
              strokeWidth="92"
              strokeLinecap="round"
              opacity="0.48"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 22 -14; 0 0"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[32px] max-md:px-[24px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
              GLOBAL PRESENCE
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] max-w-[672px] font-display text-[60px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[48px] max-lg:leading-[48px] font-[590] leading-[60px] tracking-[-1.5px] max-md:tracking-[-1px] text-[#171717]">
              <GradientReveal className="grad-text">Three regions</GradientReveal>. One operating standard.
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-[64px] max-md:mt-[40px] flex flex-col gap-[48px] lg:flex-row"
        >
          {/* Map card */}
          <div className="relative h-[500px] max-md:h-[350px] w-full shrink-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#02050A] via-[#0A101B] to-[#010308] p-[1px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] lg:w-[691px]">
            <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-[#010308]">
              <Globe active={active} />

              <div className="absolute bottom-[24px] left-[32px] z-30 flex flex-col gap-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: '\"SF Pro Display\", \"SF Pro Text\", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                <span className="text-[11px] font-[600] text-white/70 uppercase tracking-[1px]">Timezone</span>
                <span className="text-[14px] font-[500] text-white">
                  {region.timezone} {currentTime ? `• ${currentTime}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-[16px]">
              {NAMES.map((name) => {
                const isActive = name === active;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setActive(name)}
                    className={`flex h-[40px] items-center rounded-full px-[20px] font-sans text-[14px] leading-[20px] tracking-[0px] font-[500] transition-all duration-250 hover:-translate-y-[2px] ${isActive ? "bg-[#007BFF] text-white shadow-md hover:shadow-lg" : "bg-white text-[#171717] shadow-sm hover:shadow-md"}`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <div className="mt-[32px] flex h-auto min-h-[467px] max-md:min-h-0 flex-col gap-[32px] max-md:gap-[24px] rounded-[24px] bg-white p-[40px] max-md:p-[24px] shadow-sm lg:w-[492px]">
              <h3 className="font-sans text-[30px] max-md:text-[24px] font-[600] leading-[36px] max-md:leading-[32px] tracking-[0px] text-[#171717]">
                {active}
              </h3>

              <dl className="flex flex-col gap-[24px]">
                <Row label="Entity" value={region.entity} />
                <Row label="Managing Principal" value={region.principal} />
                <Row label="Core Capabilities" value={region.capabilities} />
                <Row label="Jurisdiction & Reach" value={region.jurisdiction} />
                <Row label="Operating Model" value={region.operatingModel} />
              </dl>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-[12px] font-[600] uppercase tracking-[1.2px] text-[#8b8b8b]">
        {label}
      </dt>
      <dd className="mt-[8px] font-sans text-[14px] font-[400] leading-[20px] text-[#171717]">
        {value}
      </dd>
    </div>
  );
}
