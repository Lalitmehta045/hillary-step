"use client";

import { m } from "framer-motion";

const services = [
  {
    title: "Urban Infra & Master Planning",
    desc: "Sustainable urban planning, land development, and smart city zoning solutions designed for scale.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M8 10h.01" />
        <path d="M16 10h.01" />
        <path d="M8 14h.01" />
        <path d="M16 14h.01" />
      </svg>
    ),
    points: [
      "Master Urban Planning",
      "Zoning & Land Use Design",
      "Smart Grid Integration",
      "Public Transit Corridors",
      "Sustainable Architecture"
    ],
    footer: "Transforming urban spaces into resilient, future-ready communities."
  },
  {
    title: "Transportation & Bridges",
    desc: "Design and construction management of highways, bridges, railways, and transit hubs.",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19L12 5l8 14" />
        <path d="M6 15h12" />
      </svg>
    ),
    points: [
      "Highway & Expressway Engineering",
      "Bridge & Viaduct Design",
      "Rail & Mass Transit Systems",
      "Traffic Flow Optimization",
      "Pavement & Material Testing"
    ],
    footer: "Connecting regions with high-durability transit infrastructure."
  },
  {
    title: "Structural Engineering",
    desc: "High-performance structural analysis, seismic retrofitting, and heavy foundation engineering.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z" />
      </svg>
    ),
    points: [
      "High-rise Structural Design",
      "Seismic Resilience Analysis",
      "Deep Foundation Engineering",
      "Retrofitting & Rehabilitation",
      "BIM & 3D Structural Modeling"
    ],
    footer: "Uncompromising strength and compliance for heavy structures."
  },
  {
    title: "Water & Environmental Infra",
    desc: "Sustainable water resource management, wastewater treatment, and coastal protection.",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    points: [
      "Water Treatment Plants",
      "Stormwater & Drainage Systems",
      "Environmental Impact Audits",
      "Coastal & Flood Protection",
      "Dam & Reservoir Engineering"
    ],
    footer: "Safeguarding water assets and natural ecosystems."
  },
  {
    title: "Geotechnical & Surveying",
    desc: "Precision site investigation, soil mechanics, GIS mapping, and topographical surveys.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    points: [
      "Geotechnical Soil Testing",
      "LiDAR & Aerial GIS Survey",
      "Subsurface Exploration",
      "Slope Stability Analysis",
      "Foundation Recommendation"
    ],
    footer: "Data-backed ground intelligence for safe execution."
  },
  {
    title: "Smart Construction & PMO",
    desc: "Digital twin monitoring, AI-driven project management, and heavy equipment logistics.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" />
        <path d="M6 20V10l6-6 6 6v10" />
        <path d="M12 4v16" />
      </svg>
    ),
    points: [
      "Digital Twin Monitoring",
      "EPC Project Management",
      "Safety & Compliance Audit",
      "Cost & Resource Optimization",
      "Site Robotics & Drones"
    ],
    footer: "Delivering complex infrastructure projects on time and budget."
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
        <div className="absolute bottom-0 w-[96%] left-[2%] h-[260px] bg-gradient-to-t from-orange-100 to-amber-50 rounded-3xl z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:[transform:rotateX(4deg)_scale(0.9)_translateY(20px)] border border-orange-200/60 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)] origin-bottom"></div>

        {/* ATM Card Wrapper (Overflow Hidden to clip bottom, tall to allow top slide out) */}
        <div className="absolute bottom-0 w-full h-[1000px] overflow-hidden rounded-b-[24px] pointer-events-none z-20">
          {/* ATM Card */}
          <div className="absolute bottom-0 left-[4%] w-[92%] h-[380px] bg-gradient-to-br from-[#C2410C] to-[#7C2D12] rounded-t-3xl shadow-[0_-10px_40px_rgba(194,65,12,0.4)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-y-[180px] scale-[0.85] opacity-50 group-hover:translate-y-[-130px] group-hover:scale-100 group-hover:opacity-100 p-[32px] pt-[28px] border border-orange-400/20 pointer-events-auto flex flex-col origin-bottom">
            <div className="flex flex-col h-full relative z-10 transition-all duration-500 delay-100 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <h4 className="font-display text-[18px] font-[700] text-white mb-[18px] tracking-wide">
                Key Capabilities
              </h4>
              <ul className="flex flex-col gap-[12px]">
                {service.points.map((pt: string, i: number) => (
                  <li key={i} className="flex items-start gap-[12px]">
                    <div className="mt-[3px] shrink-0 text-[#FFEDD5]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-sans text-[13.5px] leading-[1.4] text-white/95">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Inner shadow to simulate depth at the bottom where it enters the wallet */}
            <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-[#7C2D12] to-transparent rounded-b-3xl pointer-events-none z-20"></div>
          </div>
        </div>

        {/* Wallet Front */}
        <div className="absolute bottom-0 w-full h-[280px] bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_25px_50px_rgba(194,65,12,0.15)] z-30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:[transform:rotateX(4deg)_scale(0.9)_translateY(20px)] flex flex-col overflow-hidden border border-orange-100 origin-bottom">
          <div className="w-full h-[140px] relative overflow-hidden">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent transition-opacity duration-500 group-hover:opacity-85"></div>
            <div className="absolute bottom-4 left-5 right-5 text-white flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#EA580C]">
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
            <div className="mt-auto flex items-center gap-2 text-[13px] font-[700] text-[#EA580C] group-hover:text-[#9A3412] transition-colors">
              Explore Details
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#EA580C]/10 group-hover:bg-[#EA580C]/20 transition-colors">
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

export function CivilInfraContent() {
  return (
    <div className="w-full font-display px-[80px] pt-[80px] pb-[80px] max-md:px-[24px]">
      
      {/* Header */}
      <div className="mb-[64px] max-md:mb-[48px]">
        <p className="text-[14px] font-[600] tracking-wide text-[#EA580C] uppercase mb-[16px]">
          Civil & Infrastructure
        </p>
        <h2 className="font-display text-[48px] max-md:text-[36px] font-[700] leading-[1.1] tracking-[-1px] text-[#111111] mb-[20px]">
          Building durable foundations<br className="max-md:hidden" /> for tomorrow's world.
        </h2>
        <p className="text-[18px] max-md:text-[16px] leading-[28px] text-[#6B7280] max-w-[700px]">
          From megastructure structural engineering to smart urban transportation, we engineer resilient infrastructure that powers communities.
        </p>
      </div>

      {/* Grid Section */}
      <div className="flex flex-col items-center w-full">
        <p className="text-[14px] font-[700] tracking-[1px] text-[#EA580C] uppercase mb-[12px] text-center">
          OUR INFRASTRUCTURE SERVICES
        </p>
        <h3 className="font-display text-[28px] max-md:text-[24px] font-[700] text-[#111111] mb-[48px] text-center">
          Engineering Excellence Across Every Scale
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
