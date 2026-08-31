// Shared service data for IT Solutions and Civil & Infrastructure
// Extended content for detail modals

export type ServiceData = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  iconId: string;
  category: "it-solutions" | "civil-infrastructure";
  accentColor: string;
  accentColorDark: string;
  points: string[];
  footer: string;
  detailedDescription: string;
  processSteps: { title: string; desc: string }[];
  benefits: { title: string; desc: string }[];
  stats: { value: string; label: string }[];
};

export const itServices: ServiceData[] = [
  {
    slug: "app-development",
    title: "App Development",
    desc: "Custom mobile applications built around your users and business objectives.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    iconId: "mobile",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "iOS & Android Apps",
      "Cross-Platform Development",
      "User-Centric Design",
      "Enterprise Mobility"
    ],
    footer: "Engaging, high-performance mobile apps for your users.",
    detailedDescription: "Create exceptional mobile experiences that engage your users and drive business results. We develop native iOS and Android apps as well as cross-platform solutions.",
    processSteps: [], benefits: [], stats: []
  },
  {
    slug: "web-development",
    title: "Web Development",
    desc: "High-performance websites and web applications designed for modern businesses.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    iconId: "code",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Custom Web Applications",
      "Responsive Web Design",
      "E-commerce Platforms",
      "CMS Integration"
    ],
    footer: "High-performance web solutions built for scale.",
    detailedDescription: "We build responsive, fast, and scalable web applications that deliver exceptional user experiences.",
    processSteps: [], benefits: [], stats: []
  },
  {
    slug: "cloud-development",
    title: "Cloud Development",
    desc: "Scalable cloud solutions that improve flexibility, performance, and operational efficiency.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    iconId: "cloud",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Cloud Infrastructure Setup",
      "Cloud Migration Services",
      "DevOps & Automation",
      "Cloud Security & Compliance"
    ],
    footer: "Highly available, secure, and cost-effective cloud solutions.",
    detailedDescription: "Transform your IT infrastructure with our comprehensive cloud solutions. We design, migrate, and manage cloud environments.",
    processSteps: [], benefits: [], stats: []
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    desc: "Intuitive digital experiences designed to make technology simpler for your users.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
    iconId: "ai",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "User Research & Testing",
      "Wireframing & Prototyping",
      "Visual Interface Design",
      "Design System Creation"
    ],
    footer: "Designs that engage, convert, and retain users.",
    detailedDescription: "We craft beautiful and intuitive user interfaces backed by solid user experience research and testing.",
    processSteps: [], benefits: [], stats: []
  },
  {
    slug: "software-development",
    title: "Software Development",
    desc: "Purpose-built software designed to solve specific business challenges.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    iconId: "code",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Enterprise Software",
      "Legacy System Modernization",
      "API Development",
      "Testing & QA"
    ],
    footer: "Custom software tailored to your operational needs.",
    detailedDescription: "We build robust, scalable software solutions that drive business growth. Our team of experienced engineers leverages modern frameworks.",
    processSteps: [], benefits: [], stats: []
  },
  {
    slug: "it-consulting",
    title: "IT Consulting",
    desc: "Technology guidance that helps you make better decisions and build a clear path forward.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    iconId: "chart",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Digital Transformation Strategy",
      "Technology Audits",
      "IT Infrastructure Planning",
      "Vendor Selection & Management"
    ],
    footer: "Strategic insights for a future-ready business.",
    detailedDescription: "Our consulting services help you align technology with your business goals, providing a roadmap for sustainable growth.",
    processSteps: [], benefits: [], stats: []
  }
];

export const civilServices: ServiceData[] = [
  {
    slug: "urban-infra-master-planning",
    title: "Urban Infra & Master Planning",
    desc: "Sustainable urban planning, land development, and smart city zoning solutions designed for scale.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    iconId: "building",
    category: "civil-infrastructure",
    accentColor: "#EA580C",
    accentColorDark: "#7C2D12",
    points: [
      "Master Urban Planning",
      "Zoning & Land Use Design",
      "Smart Grid Integration",
      "Public Transit Corridors",
      "Sustainable Architecture"
    ],
    footer: "Transforming urban spaces into resilient, future-ready communities.",
    detailedDescription: "We design sustainable, livable urban environments that balance growth with quality of life. Our master planning services encompass land-use zoning, smart infrastructure integration, public transit planning, and sustainable architecture.",
    processSteps: [
      { title: "Site Analysis", desc: "Comprehensive study of terrain, demographics, existing infrastructure, and growth patterns." },
      { title: "Concept Development", desc: "Create master plan concepts balancing residential, commercial, and green spaces." },
      { title: "Stakeholder Review", desc: "Collaborative workshops with government bodies, developers, and community groups." },
      { title: "Detailed Design", desc: "Technical drawings, zoning regulations, and infrastructure layout plans." },
      { title: "Implementation", desc: "Phased development oversight with regulatory compliance monitoring." }
    ],
    benefits: [
      { title: "Smart Integration", desc: "IoT-enabled infrastructure for intelligent traffic, energy, and water management." },
      { title: "Sustainability", desc: "Green building standards and renewable energy integration throughout." },
      { title: "Community Focus", desc: "Designs that prioritize livability, accessibility, and public spaces." },
      { title: "Future-Ready", desc: "Flexible planning that accommodates growth and technological evolution." }
    ],
    stats: [
      { value: "25+", label: "Master Plans Completed" },
      { value: "500K+", label: "Population Served" },
      { value: "30%", label: "Green Space Integration" },
      { value: "15+", label: "Smart City Projects" }
    ]
  },
  {
    slug: "transportation-bridges",
    title: "Transportation & Bridges",
    desc: "Design and construction management of highways, bridges, railways, and transit hubs.",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop",
    iconId: "bridge",
    category: "civil-infrastructure",
    accentColor: "#EA580C",
    accentColorDark: "#7C2D12",
    points: [
      "Highway & Expressway Engineering",
      "Bridge & Viaduct Design",
      "Rail & Mass Transit Systems",
      "Traffic Flow Optimization",
      "Pavement & Material Testing"
    ],
    footer: "Connecting regions with high-durability transit infrastructure.",
    detailedDescription: "We engineer world-class transportation infrastructure that connects communities and drives economic growth. From multi-lane expressways to cable-stayed bridges, our team delivers projects that meet the highest safety and durability standards.",
    processSteps: [
      { title: "Feasibility Study", desc: "Traffic analysis, route optimization, and environmental impact assessment." },
      { title: "Structural Design", desc: "Advanced engineering design with FEM analysis and load calculations." },
      { title: "Material Testing", desc: "Rigorous testing of construction materials for strength and durability." },
      { title: "Construction Management", desc: "On-site supervision ensuring quality, safety, and timeline adherence." },
      { title: "Quality Assurance", desc: "Post-construction inspection, load testing, and certification." }
    ],
    benefits: [
      { title: "Structural Excellence", desc: "Designs that exceed safety codes with built-in redundancy." },
      { title: "Traffic Optimization", desc: "Smart traffic systems that reduce congestion and travel time." },
      { title: "Durability Focus", desc: "Materials and techniques for 75+ year service life." },
      { title: "Minimal Disruption", desc: "Construction methods that minimize impact on existing traffic." }
    ],
    stats: [
      { value: "100+", label: "Bridges Designed" },
      { value: "2000km", label: "Roads Engineered" },
      { value: "75yr+", label: "Design Life" },
      { value: "Zero", label: "Structural Failures" }
    ]
  },
  {
    slug: "structural-engineering",
    title: "Structural Engineering",
    desc: "High-performance structural analysis, seismic retrofitting, and heavy foundation engineering.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    iconId: "structure",
    category: "civil-infrastructure",
    accentColor: "#EA580C",
    accentColorDark: "#7C2D12",
    points: [
      "High-rise Structural Design",
      "Seismic Resilience Analysis",
      "Deep Foundation Engineering",
      "Retrofitting & Rehabilitation",
      "BIM & 3D Structural Modeling"
    ],
    footer: "Uncompromising strength and compliance for heavy structures.",
    detailedDescription: "Our structural engineering team designs buildings and structures that stand the test of time. Using advanced BIM modeling and finite element analysis, we create efficient structural systems for high-rises, industrial facilities, and complex forms.",
    processSteps: [
      { title: "Structural Analysis", desc: "Advanced FEM analysis for load distribution, stress, and deformation." },
      { title: "Foundation Design", desc: "Deep and shallow foundation solutions based on geotechnical data." },
      { title: "BIM Modeling", desc: "3D structural modeling with clash detection and construction sequencing." },
      { title: "Code Compliance", desc: "Ensure designs meet all applicable building codes and seismic standards." },
      { title: "Construction Support", desc: "On-site structural inspection and construction methodology guidance." }
    ],
    benefits: [
      { title: "Seismic Safety", desc: "Advanced seismic analysis and design for earthquake-prone regions." },
      { title: "BIM Integration", desc: "Full 3D modeling for coordination, visualization, and construction." },
      { title: "Material Efficiency", desc: "Optimized designs that minimize material usage without compromising safety." },
      { title: "Retrofit Expertise", desc: "Strengthening existing structures to meet current safety standards." }
    ],
    stats: [
      { value: "500+", label: "Structures Designed" },
      { value: "80+", label: "High-Rise Projects" },
      { value: "Zone V", label: "Seismic Design Capability" },
      { value: "100%", label: "Code Compliance" }
    ]
  },
  {
    slug: "water-environmental-infra",
    title: "Water & Environmental Infra",
    desc: "Sustainable water resource management, wastewater treatment, and coastal protection.",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=1200&auto=format&fit=crop",
    iconId: "water",
    category: "civil-infrastructure",
    accentColor: "#EA580C",
    accentColorDark: "#7C2D12",
    points: [
      "Water Treatment Plants",
      "Stormwater & Drainage Systems",
      "Environmental Impact Audits",
      "Coastal & Flood Protection",
      "Dam & Reservoir Engineering"
    ],
    footer: "Safeguarding water assets and natural ecosystems.",
    detailedDescription: "We design and implement sustainable water and environmental infrastructure that protects communities and ecosystems. From advanced water treatment facilities to flood protection systems, our solutions address critical environmental challenges.",
    processSteps: [
      { title: "Environmental Assessment", desc: "Comprehensive study of water resources, ecology, and environmental impact." },
      { title: "System Design", desc: "Engineer treatment systems, drainage networks, and protection structures." },
      { title: "Regulatory Approval", desc: "Navigate environmental regulations and secure necessary permits." },
      { title: "Construction", desc: "Build facilities with minimal environmental footprint during construction." },
      { title: "Monitoring", desc: "Post-commissioning water quality monitoring and system optimization." }
    ],
    benefits: [
      { title: "Clean Water Access", desc: "Advanced treatment ensuring safe, potable water for communities." },
      { title: "Flood Protection", desc: "Engineered solutions to protect urban areas from flooding." },
      { title: "Sustainability", desc: "Water recycling and rainwater harvesting for resource conservation." },
      { title: "Compliance", desc: "Meet all environmental regulations and discharge standards." }
    ],
    stats: [
      { value: "50MLD+", label: "Treatment Capacity" },
      { value: "200+", label: "Water Projects" },
      { value: "1M+", label: "People Served" },
      { value: "95%", label: "Water Recovery Rate" }
    ]
  },
  {
    slug: "geotechnical-surveying",
    title: "Geotechnical & Surveying",
    desc: "Precision site investigation, soil mechanics, GIS mapping, and topographical surveys.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
    iconId: "compass",
    category: "civil-infrastructure",
    accentColor: "#EA580C",
    accentColorDark: "#7C2D12",
    points: [
      "Geotechnical Soil Testing",
      "LiDAR & Aerial GIS Survey",
      "Subsurface Exploration",
      "Slope Stability Analysis",
      "Foundation Recommendation"
    ],
    footer: "Data-backed ground intelligence for safe execution.",
    detailedDescription: "Our geotechnical and surveying services provide the critical ground-truth data needed for safe and efficient construction. Using advanced LiDAR, GIS mapping, and laboratory testing, we characterize subsurface conditions and provide reliable foundation recommendations.",
    processSteps: [
      { title: "Desk Study", desc: "Review geological maps, historical data, and satellite imagery." },
      { title: "Field Investigation", desc: "Borehole drilling, SPT testing, and in-situ geotechnical tests." },
      { title: "Laboratory Testing", desc: "Soil classification, strength testing, and chemical analysis." },
      { title: "Analysis & Modeling", desc: "Slope stability, settlement analysis, and foundation design parameters." },
      { title: "Reporting", desc: "Comprehensive geotechnical reports with foundation recommendations." }
    ],
    benefits: [
      { title: "Precision Data", desc: "High-accuracy LiDAR and GIS surveys for reliable site information." },
      { title: "Risk Mitigation", desc: "Identify subsurface risks early to avoid costly construction surprises." },
      { title: "Lab Certified", desc: "NABL-accredited laboratory testing for reliable results." },
      { title: "Expert Analysis", desc: "Experienced geotechnical engineers providing practical recommendations." }
    ],
    stats: [
      { value: "5000+", label: "Boreholes Drilled" },
      { value: "10K km²", label: "Area Surveyed" },
      { value: "99%", label: "Data Accuracy" },
      { value: "48hr", label: "Report Turnaround" }
    ]
  },
  {
    slug: "smart-construction-pmo",
    title: "Smart Construction & PMO",
    desc: "Digital twin monitoring, AI-driven project management, and heavy equipment logistics.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    iconId: "construction",
    category: "civil-infrastructure",
    accentColor: "#EA580C",
    accentColorDark: "#7C2D12",
    points: [
      "Digital Twin Monitoring",
      "EPC Project Management",
      "Safety & Compliance Audit",
      "Cost & Resource Optimization",
      "Site Robotics & Drones"
    ],
    footer: "Delivering complex infrastructure projects on time and budget.",
    detailedDescription: "We bring the latest technology to construction management. Our smart construction solutions include digital twins for real-time monitoring, AI-powered project scheduling, drone-based site surveys, and IoT sensors for safety and quality control.",
    processSteps: [
      { title: "Project Setup", desc: "Define scope, create WBS, and set up digital project management tools." },
      { title: "Digital Twin", desc: "Create and maintain digital twin models for real-time project monitoring." },
      { title: "Resource Planning", desc: "AI-optimized scheduling for labor, materials, and equipment allocation." },
      { title: "Safety Management", desc: "IoT-based safety monitoring with predictive hazard detection." },
      { title: "Handover", desc: "Complete documentation, as-built drawings, and operational training." }
    ],
    benefits: [
      { title: "Real-time Visibility", desc: "Digital twins provide instant project status and progress tracking." },
      { title: "Cost Control", desc: "AI-driven resource optimization reducing waste and overruns." },
      { title: "Safety First", desc: "IoT sensors and drone monitoring for proactive safety management." },
      { title: "On-Time Delivery", desc: "Predictive scheduling that identifies delays before they happen." }
    ],
    stats: [
      { value: "₹5000Cr+", label: "Projects Managed" },
      { value: "95%", label: "On-Time Delivery" },
      { value: "20%", label: "Cost Savings" },
      { value: "Zero", label: "Safety Incidents" }
    ]
  }
];

export const allServices: ServiceData[] = [...itServices, ...civilServices];
