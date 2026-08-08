"use client";

import { useState } from "react";
import { RegionsGradientAnimation } from "@/components/site/RegionsGradientAnimation";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";

const REGIONS = {
  "United States": {
    marker: { left: "30%", top: "47%" },
    offices: "New York · San Francisco · Houston",
    principal: "A. Whitmore, Managing Principal",
    capabilities: "Civil EPC · AI · Executive Search",
    registrations: "SEC · GSA · SAM Registered",
    projects: "JFK T-9 Modernization · DoE Grid AI",
  },
  Australia: {
    marker: { left: "77%", top: "74%" },
    offices: "Sydney · Melbourne · Perth",
    principal: "D. Kotari, Regional Principal",
    capabilities: "Smart Terminals · Rail · Workforce",
    registrations: "ASIC · AusTender Registered",
    projects: "Sydney Smart Terminal · NSW Grid",
  },
  India: {
    marker: { left: "65%", top: "54%" },
    offices: "Mumbai · Bengaluru · Delhi NCR",
    principal: "R. Iyer, Regional Principal",
    capabilities: "Digital Public Infrastructure · EPC",
    registrations: "MCA · GeM Registered",
    projects: "DPI Mandate · Metro Line Expansion",
  },
} as const;

type RegionName = keyof typeof REGIONS;
const NAMES = Object.keys(REGIONS) as RegionName[];

export function Regions() {
  const [active, setActive] = useState<RegionName>("United States");
  const region = REGIONS[active];

  return (
    <section className="relative w-full overflow-hidden bg-white py-[148px] max-md:py-[80px]">
      <RegionsGradientAnimation />

      <div className="relative mx-auto w-full max-w-[1280px] px-[32px] max-md:px-[24px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[14px] font-[600] leading-[20px] tracking-[2.8px] text-[#0070F3] uppercase">
              GLOBAL PRESENCE
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] max-w-[672px] font-display text-[60px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[48px] max-lg:leading-[48px] font-[590] leading-[60px] tracking-[-1.5px] max-md:tracking-[-1px] text-[#171717]">
              Three regions. One operating standard.
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.2} className="mt-[64px] max-md:mt-[40px] flex flex-col gap-[48px] lg:flex-row">
          {/* Map card */}
          <div className="relative h-[500px] max-md:h-[350px] w-full shrink-0 rounded-[24px] bg-white p-[32px] max-md:p-[16px] shadow-sm lg:w-[691px]">
            <span className="absolute left-[16%] top-[29%] h-[4px] w-[4px] rounded-full bg-black/12" />
            <span className="absolute left-[18%] top-[29%] h-[4px] w-[4px] rounded-full bg-black/12" />

            {NAMES.map((name) => {
              const isActive = name === active;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActive(name)}
                  style={REGIONS[name].marker}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-[13px] transition-transform duration-150 hover:scale-105"
                >
                  <span
                    className={`h-[19px] w-[19px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#FF9500] ring-4 ring-[#FF9500]/20 shadow-[0_0_10px_rgba(255,149,0,0.5)]"
                        : "bg-[#111111] group-hover:bg-[#0070F3]"
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap font-sans text-[12px] font-[600] uppercase tracking-[1.4px] transition-colors ${
                      isActive ? "text-[#111111]" : "text-[#111111]"
                    }`}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
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
                    className={`flex h-[40px] items-center rounded-full px-[20px] font-sans text-[14px] font-[500] transition-all duration-250 hover:-translate-y-[2px] ${
                      isActive ? "bg-[#007BFF] text-white shadow-md hover:shadow-lg" : "bg-white text-[#171717] shadow-sm hover:shadow-md"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <div className="mt-[32px] flex h-auto min-h-[467px] max-md:min-h-0 flex-col gap-[32px] max-md:gap-[24px] rounded-[24px] bg-white p-[40px] max-md:p-[24px] shadow-sm lg:w-[492px]">
              <h3 className="font-sans text-[30px] max-md:text-[24px] font-[600] leading-[38px] max-md:leading-[32px] text-[#171717]">
                {active}
              </h3>

              <dl className="flex flex-col gap-[24px]">
                <Row label="Offices" value={region.offices} />
                <Row label="Managing Principal" value={region.principal} />
                <Row label="Capabilities" value={region.capabilities} />
                <Row label="Registrations" value={region.registrations} />
                <Row label="Signature Projects" value={region.projects} />
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
