"use client";

import { useState, useEffect } from "react";
import { RegionsGradientAnimation } from "@/components/site/RegionsGradientAnimation";
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
    capabilities: "SaaS Product R&D · Eco-Smart Infra Projects · Global IT Delivery Hubs · RPO",
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
      <RegionsGradientAnimation />

      <div className="relative mx-auto w-full max-w-[1280px] px-[32px] max-md:px-[24px]">
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
          <div className="relative h-[500px] max-md:h-[350px] w-full shrink-0 overflow-hidden rounded-[24px] bg-[#010308] p-[1px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] lg:w-[691px]">
            <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-[#010308]">
              <Globe active={active} />

              {/* Cinematic space atmosphere layered over the globe background. Kept subtle so the Earth remains the hero. */}
              <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden">
                {/* Deep-space depth / Milky-Way style haze */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(30,60,110,0.12)_0%,rgba(7,13,25,0.04)_34%,rgba(0,0,0,0.48)_100%)]" />
                <div className="absolute left-[-18%] top-[8%] h-[70%] w-[70%] rotate-[-18deg] rounded-full bg-[radial-gradient(ellipse,rgba(74,111,170,0.11)_0%,rgba(25,48,85,0.035)_38%,transparent_72%)] blur-3xl" />
                <div className="absolute right-[-22%] bottom-[-18%] h-[70%] w-[65%] rounded-full bg-[radial-gradient(circle,rgba(25,73,140,0.13)_0%,transparent_68%)] blur-3xl" />

                {/* Dense distant star field */}
                <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.7)_0_0.7px,transparent_1px),radial-gradient(circle_at_17%_72%,rgba(255,255,255,0.55)_0_0.8px,transparent_1.2px),radial-gradient(circle_at_29%_31%,rgba(180,210,255,0.65)_0_0.7px,transparent_1px),radial-gradient(circle_at_42%_12%,rgba(255,255,255,0.55)_0_0.7px,transparent_1px),radial-gradient(circle_at_57%_24%,rgba(255,255,255,0.6)_0_0.8px,transparent_1.2px),radial-gradient(circle_at_71%_10%,rgba(255,255,255,0.55)_0_0.7px,transparent_1px),radial-gradient(circle_at_86%_25%,rgba(180,210,255,0.65)_0_0.8px,transparent_1.2px),radial-gradient(circle_at_94%_58%,rgba(255,255,255,0.55)_0_0.7px,transparent_1px),radial-gradient(circle_at_78%_82%,rgba(255,255,255,0.6)_0_0.8px,transparent_1.2px),radial-gradient(circle_at_52%_91%,rgba(180,210,255,0.5)_0_0.7px,transparent_1px),radial-gradient(circle_at_24%_91%,rgba(255,255,255,0.5)_0_0.7px,transparent_1px),radial-gradient(circle_at_4%_48%,rgba(180,210,255,0.55)_0_0.7px,transparent_1px)]" />

                {/* Soft atmospheric blue-white bloom around the Earth horizon */}
                <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7db7ff]/10 shadow-[0_0_70px_18px_rgba(50,120,220,0.045)]" />
                <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,transparent_58%,rgba(73,143,235,0.035)_72%,transparent_76%)]" />
              </div>

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
