import { m } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const CARDS = [
  {
    title: "Global (RPO) & Managed Services (MSP)",
    items: [
      "Recruitment lifecycle management",
      "Onshore + offshore delivery centers",
      "Talent sourcing",
      "Screening & assessment",
      "Recruitment operations",
      "Pipeline optimization",
      "Administrative overhead reduction",
    ],
    tags: ["AI Matching", "Predictive Sourcing", "Smart Shortlisting"],
  },
  {
    title: "Employer of Record — EOR",
    items: [
      "Global payroll",
      "Localized taxation",
      "Employee benefits",
      "International workforce administration",
      "Labor-law compliance",
      "Cross-border employment",
      "Workforce risk management",
    ],
    tags: ["Modern Stack", "Future Ready"],
  },
];

const BOTTOM_CARDS = [
  {
    title: "Reverse Sourcing of Elite Talent",
    items: [
      "Passive candidate discovery",
      "Elite technical talent pools",
      "Rare skill identification",
      "Pre-vetted candidate networks",
      "Proactive client-talent matching",
    ],
    tags: ["AI Matching", "Predictive Sourcing", "Smart Shortlisting"],
  },
  {
    title: "Academic Synergy & Skill Development",
    items: [
      "University partnerships",
      "Skill development centers",
      "Graduate talent pipelines",
      "Training",
      "Certification",
      "International mobility",
      "Workforce readiness",
    ],
    tags: ["Modern Stack", "Future Ready"],
  },
];

export function CoreStaffingServices() {
  return (
    <section className="py-[100px] max-md:py-[60px] w-full font-display flex justify-center px-[16px] relative z-10">
      <div className="w-full max-w-[993px] bg-[rgba(74,222,128,0.28)] border border-[rgba(229,231,235,0.5)] rounded-[32px] pt-[48px] pr-[16px] pb-[32px] pl-[32px] flex flex-col gap-[24px] mx-auto">
        
        {/* Header */}
        <div>
          <p className="text-[13px] font-[700] tracking-[1.5px] text-[#15803D] uppercase mb-[16px]">
            THE COGNITIVE ENGINE
          </p>
          <h2 className="font-display text-[48px] max-md:text-[36px] font-[700] leading-[1.1] tracking-[-1px] text-[#111111] mb-[20px]">
            Core Staffing Services
          </h2>
          <p className="text-[18px] leading-[28px] text-[#4B5563] max-w-[600px]">
            Technology, data and academic partnerships that keep our talent network future-ready.
          </p>
        </div>

        {/* Top Row: Two Cards */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
          {CARDS.map((card, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-b from-[rgba(255,255,255,0.9)] via-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.4)] rounded-[24px] p-[32px] border border-white flex flex-col justify-between"
            >
              <div>
                <h3 className="font-sans text-[20px] font-[700] leading-[28px] text-[#006D39] mb-[24px]">
                  {card.title}
                </h3>
                <ul className="space-y-[12px] mb-[32px]">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-[12px]">
                      <span className="mt-[8px] w-[5px] h-[5px] rounded-full bg-[#6B7280] shrink-0" />
                      <span className="text-[16px] text-[#4B5563] leading-[24px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-[12px]">
                {card.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="bg-[#D1F4D9] text-[#166534] text-[13px] font-[600] px-[16px] py-[6px] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row: Full Width Card */}
        <div className="bg-gradient-to-b from-[rgba(255,255,255,0.9)] via-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.4)] rounded-[24px] p-[32px] border border-white flex gap-[64px] max-lg:flex-col items-center">
          <div className="flex-1 w-full">
            <h3 className="font-sans text-[20px] font-[700] leading-[28px] text-[#006D39] mb-[24px]">
              Global Compliance & Sovereign Human Welfare
            </h3>
            <p className="text-[16px] text-[#4B5563] leading-[28px] mb-[32px]">
              We take absolute fiduciary responsibility for your deployed workforce. Our frameworks manage complete international insurance, risk mitigation, and localized statutory employee benefits, including PF, ESI, and regional labor funds, across all global jurisdictions, ensuring zero legal friction for the client.
            </p>
            <div className="flex flex-wrap gap-[12px]">
              {["Campus Connect", "Training Partnerships", "Future Workforce"].map((tag, i) => (
                <span 
                  key={i} 
                  className="bg-[#D1F4D9] text-[#166534] text-[13px] font-[600] px-[16px] py-[6px] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Image representing the pipeline */}
          <div className="flex-1 w-full flex items-center justify-center">
            <img 
              src="/academy-talent-pipeline.png" 
              alt="Academy & Talent Pipeline: Building a Future Workforce" 
              className="w-full max-w-[542px] h-auto object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* Bottom Row: Two Cards */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
          {BOTTOM_CARDS.map((card, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-b from-[rgba(255,255,255,0.9)] via-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.4)] rounded-[24px] p-[32px] border border-white flex flex-col justify-between"
            >
              <div>
                <h3 className="font-sans text-[20px] font-[700] leading-[28px] text-[#006D39] mb-[24px]">
                  {card.title}
                </h3>
                <ul className="space-y-[12px] mb-[32px]">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-[12px]">
                      <span className="mt-[8px] w-[5px] h-[5px] rounded-full bg-[#6B7280] shrink-0" />
                      <span className="text-[16px] text-[#4B5563] leading-[24px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-[12px]">
                {card.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="bg-[#D1F4D9] text-[#166534] text-[13px] font-[600] px-[16px] py-[6px] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
