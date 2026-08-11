"use client";

import { m } from "framer-motion";

const services = [
  {
    title: "Software Development",
    desc: "Custom software solutions tailored to your business needs. Scalable, secure, and built for performance.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A5C3FF]">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    points: [
      "Custom Web Applications",
      "Enterprise Software",
      "API Development & Integration",
      "Legacy System Modernization",
      "Testing & Quality Assurance"
    ],
    footer: "Faster delivery, better performance, and measurable business impact."
  },
  {
    title: "Cloud Solutions",
    desc: "Scalable cloud infrastructure that ensures flexibility, resilience, and cost optimization.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A5C3FF]">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    points: [
      "Cloud Migration",
      "Cloud Infrastructure Setup",
      "DevOps & Automation",
      "Backup & Disaster Recovery",
      "Cloud Security"
    ],
    footer: "Highly available, secure, and cost-effective cloud solutions for your business."
  },
  {
    title: "Cybersecurity Services",
    desc: "Comprehensive security strategies to protect your digital assets and ensure compliance.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A5C3FF]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    points: [
      "Vulnerability Assessments",
      "Penetration Testing",
      "Security Audits & Compliance",
      "Incident Response",
      "Data Encryption"
    ],
    footer: "Robust protection for your critical business data and infrastructure."
  },
  {
    title: "AI & Automation",
    desc: "Leverage artificial intelligence to automate workflows and unlock new business insights.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A5C3FF]">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h.01" />
        <path d="M17 7h.01" />
        <path d="M7 17h.01" />
        <path d="M17 17h.01" />
        <path d="M12 12h.01" />
      </svg>
    ),
    points: [
      "Machine Learning Models",
      "Process Automation (RPA)",
      "Natural Language Processing",
      "Predictive Analytics",
      "Custom AI Assistants"
    ],
    footer: "Drive efficiency and innovation through intelligent automation."
  },
  {
    title: "Mobile Development",
    desc: "Native and cross-platform mobile experiences designed for engagement and scale.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A5C3FF]">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    points: [
      "iOS App Development",
      "Android App Development",
      "Cross-Platform (React Native)",
      "Mobile UI/UX Design",
      "App Maintenance & Scaling"
    ],
    footer: "Engaging, high-performance mobile apps for your users."
  },
  {
    title: "Data & Analytics Solution",
    desc: "Transform raw data into actionable insights for strategic decision-making.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A5C3FF]">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    points: [
      "Data Warehousing",
      "Business Intelligence Dashboards",
      "Big Data Processing",
      "Data Visualization",
      "Real-time Analytics"
    ],
    footer: "Data-driven insights to accelerate your business growth."
  }
];

const FlipCard = ({ service, index }: { service: any, index: number }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-full h-[400px] max-md:h-[420px] [perspective:1000px]"
    >
      <div className="w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-[16px] relative cursor-pointer">
        
        {/* Front */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-[16px] p-[40px] max-md:p-[32px] flex flex-col items-center justify-center text-center border border-[#E5E7EB]/50">
          <div className="mb-[24px]">
            {service.icon}
          </div>
          <h4 className="font-display text-[22px] font-[700] text-[#111111] mb-[16px] leading-[1.2]">
            {service.title}
          </h4>
          <p className="font-sans text-[14px] leading-[22px] text-[#4B5563] mb-auto">
            {service.desc}
          </p>
          
          <div className="mt-[32px] flex items-center justify-center gap-[8px] text-[13px] font-[700] text-[#111111]">
            Click to learn more
            <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#153B8C] text-white rounded-[16px] p-[40px] max-md:p-[32px] flex flex-col items-start text-left shadow-xl">
          <h4 className="font-display text-[20px] font-[700] text-white mb-[24px] leading-[1.2]">
            {service.title}
          </h4>
          
          <ul className="flex flex-col gap-[12px] mb-auto">
            {service.points.map((pt: string, i: number) => (
              <li key={i} className="flex items-start gap-[12px]">
                <div className="mt-[4px] shrink-0 text-[#A5C3FF]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-sans text-[13px] leading-[1.4] text-white/90">
                  {pt}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-[32px] flex items-start gap-[12px] border-t border-white/10 pt-[24px]">
            <div className="shrink-0 text-white mt-[2px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="font-sans text-[13px] leading-[1.4] text-white/80">
              {service.footer}
            </span>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export function ITSolutionsContent() {
  return (
    <div className="w-full font-display px-[80px] pt-[80px] pb-[80px] max-md:px-[24px]">
      
      {/* Header */}
      <div className="mb-[64px] max-md:mb-[48px]">
        <p className="text-[14px] font-[600] tracking-wide text-[#1A6CFF] uppercase mb-[16px]">
          IT Solutions
        </p>
        <h2 className="font-display text-[48px] max-md:text-[36px] font-[700] leading-[1.1] tracking-[-1px] text-[#111111] mb-[20px]">
          Technology that powers<br className="max-md:hidden" /> your business forward.
        </h2>
        <p className="text-[18px] max-md:text-[16px] leading-[28px] text-[#6B7280] max-w-[700px]">
          From strategy to deployment, we build secure, scalable, and future-ready solutions to help your business adapt, innovate, and grow.
        </p>
      </div>

      {/* Grid Section */}
      <div className="flex flex-col items-center w-full">
        <p className="text-[14px] font-[700] tracking-[1px] text-[#1A6CFF] uppercase mb-[12px] text-center">
          OUR IT SOLUTIONS
        </p>
        <h3 className="font-display text-[28px] max-md:text-[24px] font-[700] text-[#111111] mb-[48px] text-center">
          Comprehensive Solutions for Every Need
        </h3>
        
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[32px] w-full max-w-[900px] mx-auto">
          {services.map((service, idx) => (
            <FlipCard key={idx} service={service} index={idx} />
          ))}
        </div>
      </div>

    </div>
  );
}
