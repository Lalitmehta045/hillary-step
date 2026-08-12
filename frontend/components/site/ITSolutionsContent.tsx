"use client";

import { m } from "framer-motion";

const services = [
  {
    title: "Software Development",
    desc: "Custom software solutions tailored to your business needs. Scalable, secure, and built for performance.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

const HoverCard = ({ service, index }: { service: any, index: number }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-full h-[500px] max-md:h-[480px] hover:z-50"
    >
      <div className="w-full h-full relative cursor-pointer [perspective:1200px]">
        
        {/* Wallet Back */}
        <div className="absolute bottom-0 w-[96%] left-[2%] h-[260px] bg-gradient-to-t from-gray-200 to-gray-50 rounded-3xl z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:[transform:rotateX(4deg)_scale(0.9)_translateY(20px)] border border-gray-200/60 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)] origin-bottom"></div>

        {/* ATM Card Wrapper (Overflow Hidden to clip bottom) */}
        <div className="absolute bottom-0 w-full h-[1000px] overflow-hidden rounded-b-[24px] pointer-events-none z-20">
          {/* ATM Card */}
          <div className="absolute bottom-0 left-[4%] w-[92%] h-[380px] bg-gradient-to-br from-[#153B8C] to-[#0D2459] rounded-t-3xl shadow-[0_-10px_40px_rgba(21,59,140,0.4)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-y-[180px] scale-[0.85] opacity-50 group-hover:translate-y-[-130px] group-hover:scale-100 group-hover:opacity-100 p-[32px] pt-[28px] border border-white/10 pointer-events-auto flex flex-col origin-bottom">
            <div className="flex flex-col h-full relative z-10 transition-all duration-500 delay-100 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <h4 className="font-display text-[18px] font-[700] text-white mb-[18px] tracking-wide">
                Key Capabilities
              </h4>
              <ul className="flex flex-col gap-[12px]">
                {service.points.map((pt: string, i: number) => (
                  <li key={i} className="flex items-start gap-[12px]">
                    <div className="mt-[3px] shrink-0 text-[#A5C3FF]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-sans text-[13.5px] leading-[1.4] text-white/90">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Inner shadow to simulate depth at the bottom where it enters the wallet */}
            <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-[#0D2459] to-transparent rounded-b-3xl pointer-events-none z-20"></div>
          </div>
        </div>

        {/* Wallet Front */}
        <div className="absolute bottom-0 w-full h-[280px] bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] z-30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:[transform:rotateX(4deg)_scale(0.9)_translateY(20px)] flex flex-col overflow-hidden border border-gray-100/50 origin-bottom">
          <div className="w-full h-[140px] relative overflow-hidden">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent transition-opacity duration-500 group-hover:opacity-80"></div>
            <div className="absolute bottom-4 left-5 right-5 text-white flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#1A6CFF]">
                 {service.icon}
               </div>
               <h4 className="font-display text-[20px] font-[700] leading-tight text-white drop-shadow-md transition-transform duration-500 group-hover:translate-x-1">
                 {service.title}
               </h4>
            </div>
          </div>
          <div className="p-[24px] flex-1 flex flex-col bg-white">
            <p className="text-[14px] leading-[22px] text-gray-600 mb-4 line-clamp-2 transition-all duration-500 group-hover:text-gray-500">
              {service.desc}
            </p>
            <div className="mt-auto flex items-center gap-2 text-[13px] font-[700] text-[#1A6CFF] group-hover:text-[#0D2459] transition-colors">
              Explore Details
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1A6CFF]/10 group-hover:bg-[#1A6CFF]/20 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
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
        
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-[32px] gap-y-[48px] w-full max-w-[900px] mx-auto">
          {services.map((service, idx) => (
            <HoverCard key={idx} service={service} index={idx} />
          ))}
        </div>
      </div>

    </div>
  );
}
