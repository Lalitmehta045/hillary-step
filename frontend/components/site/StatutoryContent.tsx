"use client";

import { m } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { FaScaleBalanced, FaShieldHalved, FaFileContract, FaBuildingUser } from "react-icons/fa6";
import { MCAParametersContent } from "./MCAParametersContent";
import { ASICStandardsContent } from "./ASICStandardsContent";
import { USLaborCodesContent } from "./USLaborCodesContent";
import { PrivacySecurityContent } from "./PrivacySecurityContent";

export type StatutoryType = "mca" | "asic" | "labor" | "msme" | "privacy" | null;

interface StatutoryContentProps {
  type: StatutoryType;
  onNavigateType?: (type: StatutoryType) => void;
}

const contentData = {
  mca: {
    title: "MCA Parameters",
    subtitle: "Ministry of Corporate Affairs Compliance Guidelines",
    description: "Our operations adhere strictly to the compliance frameworks set forth by the Ministry of Corporate Affairs, ensuring transparency, ethical governance, and structural integrity in all corporate dealings.",
    highlights: [
      {
        icon: FaScaleBalanced,
        title: "Regulatory Adherence",
        desc: "Complete alignment with the Companies Act and LLP regulations."
      },
      {
        icon: FaShieldHalved,
        title: "Ethical Governance",
        desc: "Maintaining transparency in financial disclosures and corporate audits."
      },
      {
        icon: FaFileContract,
        title: "Statutory Reporting",
        desc: "Timely filing of annual returns and compliance certificates."
      }
    ]
  },
  asic: {
    title: "ASIC Standards",
    subtitle: "Australian Securities & Investments Commission Framework",
    description: "We are committed to operating within the stringent regulatory environment of the Australian market, ensuring consumer protection, market integrity, and financial compliance.",
    highlights: [
      {
        icon: FaScaleBalanced,
        title: "Market Integrity",
        desc: "Promoting fair and efficient financial markets in Australia."
      },
      {
        icon: FaBuildingUser,
        title: "Corporate Accountability",
        desc: "Strict adherence to directors' duties and corporate governance principles."
      },
      {
        icon: FaShieldHalved,
        title: "Consumer Protection",
        desc: "Ensuring all services meet ASIC's financial services regulations."
      }
    ]
  },
  labor: {
    title: "US Corporate Labor Codes",
    subtitle: "Fair Labor Standards and Workplace Compliance",
    description: "Our workforce management complies with the United States Department of Labor guidelines, prioritizing employee rights, fair compensation, and safe working conditions.",
    highlights: [
      {
        icon: FaBuildingUser,
        title: "Fair Compensation",
        desc: "Strict adherence to FLSA regulations for minimum wage and overtime."
      },
      {
        icon: FaShieldHalved,
        title: "Workplace Safety",
        desc: "Compliance with OSHA standards ensuring a safe environment."
      },
      {
        icon: FaFileContract,
        title: "Equal Opportunity",
        desc: "Enforcing EEOC guidelines to promote a diverse and inclusive workplace."
      }
    ]
  },
  msme: {
    title: "MSME Certified",
    subtitle: "Ministry of Micro, Small & Medium Enterprises",
    description: "We are proudly certified as an MSME, reflecting our commitment to contributing to economic growth, employment generation, and entrepreneurial innovation in the industry.",
    highlights: [
      {
        icon: FaBuildingUser,
        title: "Recognized Enterprise",
        desc: "Officially registered under the Government of India's MSME framework."
      },
      {
        icon: FaScaleBalanced,
        title: "Compliance & Standards",
        desc: "Adherence to regulatory quality benchmarks and operational excellence."
      },
      {
        icon: FaShieldHalved,
        title: "Economic Contribution",
        desc: "Actively fostering local business development and technological innovation."
      }
    ]
  },
  privacy: {
    title: "Privacy & Security",
    subtitle: "Data Protection and Infrastructure Security",
    description: "We maintain the highest standards of data privacy and security. Our infrastructure is designed to protect sensitive information and ensure compliance with global data protection regulations.",
    highlights: [
      {
        icon: FaShieldHalved,
        title: "Data Protection",
        desc: "Robust encryption and access controls to safeguard sensitive information."
      },
      {
        icon: FaScaleBalanced,
        title: "Global Compliance",
        desc: "Alignment with international privacy laws and data handling standards."
      },
      {
        icon: FaFileContract,
        title: "Secure Infrastructure",
        desc: "Continuous monitoring and threat mitigation for maximum reliability."
      }
    ]
  }
};

export function StatutoryContent({ type, onNavigateType }: StatutoryContentProps) {
  if (!type) return null;
  if (type === "mca") {
    return <MCAParametersContent onNavigateType={onNavigateType as any} />;
  }
  if (type === "asic") {
    return <ASICStandardsContent onNavigateType={onNavigateType as any} />;
  }
  if (type === "labor") {
    return <USLaborCodesContent onNavigateType={onNavigateType as any} />;
  }
  if (type === "privacy") {
    return <PrivacySecurityContent onNavigateType={onNavigateType as any} />;
  }
  const data = contentData[type];

  return (
    <div className="flex flex-col w-full h-full bg-[#F8F9FB] text-[#111111] overflow-hidden">
      <div className="relative w-full bg-gradient-to-br from-[#1E3A8A] to-[#1A6CFF] px-[64px] max-md:px-[24px] py-[80px] text-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <FadeIn className="relative z-10 max-w-[800px] mx-auto text-center">
          <m.p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#40F600] uppercase mb-[16px]">
            STATUTORY COMPLIANCE
          </m.p>
          <h1 className="font-display text-[48px] max-md:text-[36px] font-[600] leading-[1.1] tracking-[-1px] mb-[16px]">
            {data.title}
          </h1>
          <p className="font-sans text-[18px] max-md:text-[16px] font-[400] leading-[1.5] text-white/80">
            {data.subtitle}
          </p>
        </FadeIn>
      </div>

      <div className="flex-1 w-full max-w-[1000px] mx-auto px-[64px] max-md:px-[24px] py-[64px]">
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-[24px] p-[40px] max-md:p-[24px] shadow-sm border border-black/5 mb-[48px]">
            <p className="font-sans text-[18px] max-md:text-[16px] leading-[1.6] text-[#333333]">
              {data.description}
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-3 max-md:grid-cols-1 gap-[24px]">
          {data.highlights.map((highlight, idx) => {
            const Icon = highlight.icon;
            return (
              <StaggerItem key={idx}>
                <div className="bg-white rounded-[20px] p-[32px] h-full shadow-sm border border-black/5 hover:border-[#1A6CFF]/30 transition-colors">
                  <div className="w-[48px] h-[48px] rounded-full bg-[#1A6CFF]/10 flex items-center justify-center mb-[24px]">
                    <Icon className="text-[#1A6CFF] text-[20px]" />
                  </div>
                  <h3 className="font-display text-[20px] font-[600] leading-[1.3] text-[#111111] mb-[12px]">
                    {highlight.title}
                  </h3>
                  <p className="font-sans text-[15px] font-[400] leading-[1.6] text-[#555555]">
                    {highlight.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
