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
    <section className="bg-[#DDF4E4] py-[100px] max-md:py-[60px] w-full font-display rounded-t-[40px] mt-[-40px] relative z-10">
      <div className="mx-auto w-full max-w-[1210px] px-[32px] max-md:px-[16px]">
        
        {/* Header */}
        <div className="mb-[64px]">
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

        {/* Grid Container */}
        <div className="flex flex-col gap-[24px]">
          
          {/* Top Row: Two Cards */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
            {CARDS.map((card, idx) => (
              <div 
                key={idx}
                className="bg-[#F2FCF5] rounded-[24px] p-[40px] max-md:p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white flex flex-col"
              >
                <h3 className="text-[26px] font-[700] text-[#064E3B] leading-[32px] mb-[28px] max-w-[90%]">
                  {card.title}
                </h3>
                <ul className="space-y-[12px] mb-[40px] flex-1">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-[12px]">
                      <span className="mt-[8px] w-[5px] h-[5px] rounded-full bg-[#6B7280] shrink-0" />
                      <span className="text-[16px] text-[#4B5563] leading-[24px]">{item}</span>
                    </li>
                  ))}
                </ul>
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
          <div className="bg-[#F2FCF5] rounded-[24px] p-[48px] max-md:p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white flex gap-[64px] max-lg:flex-col items-center">
            <div className="flex-1 w-full">
              <h3 className="text-[26px] font-[700] text-[#064E3B] leading-[32px] mb-[24px]">
                Global Compliance & Sovereign Human Welfare
              </h3>
              <p className="text-[16px] text-[#4B5563] leading-[28px] mb-[40px]">
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
            
            {/* CSS Diagram representing the pipeline */}
            <div className="flex-1 w-full bg-[#E5F7EC] rounded-[16px] p-[32px] max-md:p-[20px] border border-white shadow-inner flex flex-col items-center">
              <h4 className="text-[13px] font-[700] text-[#064E3B] uppercase mb-[24px] text-center tracking-wide">
                Academy & Talent Pipeline: Building a Future Workforce
              </h4>
              
              <div className="flex flex-col gap-[16px] w-full max-w-[400px]">
                {/* Phase 1 */}
                <div className="flex items-center gap-[16px] bg-white rounded-[12px] p-[16px] shadow-sm relative z-10 border border-[#DDF4E4]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#D1F4D9] flex items-center justify-center shrink-0">
                    <span className="text-[#166534] font-[700] text-[14px]">01</span>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-[700] text-[#111111]">Foundational Academy</h5>
                    <p className="text-[12px] text-[#6B7280]">K-12 Education & STEM Programs</p>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="flex items-center gap-[16px] bg-white rounded-[12px] p-[16px] shadow-sm relative z-10 border border-[#DDF4E4]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#BBEBCA] flex items-center justify-center shrink-0">
                    <span className="text-[#166534] font-[700] text-[14px]">02</span>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-[700] text-[#111111]">Higher Education & Skills</h5>
                    <p className="text-[12px] text-[#6B7280]">University Partnerships & Curricula</p>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="flex items-center gap-[16px] bg-white rounded-[12px] p-[16px] shadow-sm relative z-10 border border-[#DDF4E4]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#95DCAE] flex items-center justify-center shrink-0">
                    <span className="text-[#166534] font-[700] text-[14px]">03</span>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-[700] text-[#111111]">Early Talent Development</h5>
                    <p className="text-[12px] text-[#6B7280]">Apprenticeships & Internships</p>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="flex items-center gap-[16px] bg-white rounded-[12px] p-[16px] shadow-sm relative z-10 border border-[#DDF4E4]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#71CB92] flex items-center justify-center shrink-0">
                    <span className="text-[#166534] font-[700] text-[14px]">04</span>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-[700] text-[#111111]">Talent Pipeline</h5>
                    <p className="text-[12px] text-[#6B7280]">Pre-vetted Resource Pools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Two Cards */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
            {BOTTOM_CARDS.map((card, idx) => (
              <div 
                key={idx}
                className="bg-[#F2FCF5] rounded-[24px] p-[40px] max-md:p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white flex flex-col"
              >
                <h3 className="text-[26px] font-[700] text-[#064E3B] leading-[32px] mb-[28px] max-w-[90%]">
                  {card.title}
                </h3>
                <ul className="space-y-[12px] mb-[40px] flex-1">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-[12px]">
                      <span className="mt-[8px] w-[5px] h-[5px] rounded-full bg-[#6B7280] shrink-0" />
                      <span className="text-[16px] text-[#4B5563] leading-[24px]">{item}</span>
                    </li>
                  ))}
                </ul>
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
      </div>
    </section>
  );
}
