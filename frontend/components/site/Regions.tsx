"use client";

import { useState } from "react";
import { RegionsGradientAnimation } from "@/components/site/RegionsGradientAnimation";
import { WorldMapCanvas } from "@/components/site/WorldMapCanvas";
import { Globe } from "@/components/site/Globe";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";

const REGIONS = {
  "United States": {
    marker: { left: "30%", top: "47%" },
    offices: "Los Angeles · San Jose · New York · Dallas · Boston · Chicago",
    principal: "Kunal Priyadarshi, Founder & Global CEO",
    capabilities: "Digital Transformation · Staff Augmentation",
    operatingStandard: "Unified global delivery compliance",
    registrations: "US Labor Code compliant",
    projects: "Scaling cross-border engineering teams",
  },
  Australia: {
    marker: { left: "77%", top: "74%" },
    offices: "Sydney · Melbourne · Brisbane · Perth",
    principal: "Mrinal Priyadarshi, Regional COO",
    capabilities: "IT Consulting · Workforce Architecture",
    operatingStandard: "Standardised agile framework deployment",
    registrations: "ASIC standards aligned delivery",
    projects: "Oceania enterprise systems architecture",
  },
  India: {
    marker: { left: "65%", top: "54%" },
    offices: "Delhi NCR · Bengaluru · Mumbai · Hydrabad · Chennai",
    principal: "Kantesh Prasad Singh, Regional CFO",
    capabilities: "SaaS · Global IT Delivery · EPC · RPO",
    operatingStandard: "Cost-optimised development pipelines",
    registrations: "Certified MSME Hub",
    projects: "Product Development · Government EPC Tenders",
  },
} as const;

type RegionName = keyof typeof REGIONS;
const NAMES = Object.keys(REGIONS) as RegionName[];

export function Regions() {
  const [active, setActive] = useState<RegionName>("India");
  const region = REGIONS[active];

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
          <div className="relative h-[500px] max-md:h-[350px] w-full shrink-0 overflow-hidden rounded-[24px] bg-gradient-to-tr from-[#00FF11] via-[#007BFF] to-[#FF6200] p-[1px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:w-[691px]">
            <div className="h-full w-full overflow-hidden rounded-[23px] bg-white">
              <Globe active={active} />
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
                    className={`flex h-[40px] items-center rounded-full px-[20px] font-sans text-[14px] leading-[20px] tracking-[0px] font-[500] transition-all duration-250 hover:-translate-y-[2px] ${isActive ? "bg-[#007BFF] text-white shadow-md hover:shadow-lg" : "bg-white text-[#171717] shadow-sm hover:shadow-md"
                      }`}
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
                <Row label="Managing Principal" value={region.principal} />
                <Row label="Core Capabilities" value={region.capabilities} />
                <Row label="Operating Standard" value={region.operatingStandard} />
                <Row label="Registrations" value={region.registrations} />
                <Row label="Signature Focus" value={region.projects} />
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
