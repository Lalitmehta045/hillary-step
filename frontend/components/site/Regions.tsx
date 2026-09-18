"use client";

import { useState, useEffect } from "react";
import { WorldMapCanvas } from "@/components/site/WorldMapCanvas";
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
        <svg className="absolute left-[-18%] top-[6%] h-[88%] w-[132%] opacity-[0.72]" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="presence-ribbon-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A6CFF" stopOpacity="0.08" />
              <stop offset="48%" stopColor="#1A6CFF" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#007BFF" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient id="presence-ribbon-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#40F600" stopOpacity="0.06" />
              <stop offset="52%" stopColor="#40F600" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#40F600" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="presence-ribbon-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.04" />
              <stop offset="55%" stopColor="#FF9500" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FF9500" stopOpacity="0.04" />
            </linearGradient>
            <filter id="presence-ribbon-blur" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <g filter="url(#presence-ribbon-blur)">
            <path
              d="M-80 170 C 180 80, 360 105, 570 245 S 970 445, 1190 300 S 1460 125, 1710 215"
              fill="none"
              stroke="url(#presence-ribbon-blue)"
              strokeWidth="105"
              strokeLinecap="round"
            >
              <animate attributeName="d" dur="13s" repeatCount="indefinite"
                values="M-80 170 C 180 80, 360 105, 570 245 S 970 445, 1190 300 S 1460 125, 1710 215;M-80 205 C 180 120, 360 125, 570 275 S 970 470, 1190 325 S 1460 145, 1710 245;M-80 170 C 180 80, 360 105, 570 245 S 970 445, 1190 300 S 1460 125, 1710 215" />
            </path>
            <path
              d="M-100 235 C 160 145, 350 160, 575 300 S 955 490, 1195 345 S 1460 180, 1710 270"
              fill="none"
              stroke="url(#presence-ribbon-green)"
              strokeWidth="54"
              strokeLinecap="round"
            >
              <animate attributeName="d" dur="11s" repeatCount="indefinite"
                values="M-100 235 C 160 145, 350 160, 575 300 S 955 490, 1195 345 S 1460 180, 1710 270;M-100 265 C 160 175, 350 180, 575 330 S 955 520, 1195 375 S 1460 205, 1710 300;M-100 235 C 160 145, 350 160, 575 300 S 955 490, 1195 345 S 1460 180, 1710 270" />
            </path>
            <path
              d="M-100 290 C 145 205, 350 215, 575 350 S 960 545, 1200 400 S 1470 245, 1710 325"
              fill="none"
              stroke="url(#presence-ribbon-orange)"
              strokeWidth="32"
              strokeLinecap="round"
            >
              <animate attributeName="d" dur="15s" repeatCount="indefinite"
                values="M-100 290 C 145 205, 350 215, 575 350 S 960 545, 1200 400 S 1470 245, 1710 325;M-100 315 C 145 230, 350 240, 575 380 S 960 570, 1200 425 S 1470 270, 1710 350;M-100 290 C 145 205, 350 215, 575 350 S 960 545, 1200 400 S 1470 245, 1710 325" />
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

        <FadeIn delay={0.2} className="mt-[64px] max-md:mt-[40px] flex flex-col gap-[48px] lg:flex-row">
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
        </FadeIn>
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
