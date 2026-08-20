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
    slug: "software-development",
    title: "Software Development",
    desc: "Custom software solutions tailored to your business needs. Scalable, secure, and built for performance.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    iconId: "code",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Custom Web Applications",
      "Enterprise Software",
      "API Development & Integration",
      "Legacy System Modernization",
      "Testing & Quality Assurance"
    ],
    footer: "Faster delivery, better performance, and measurable business impact.",
    detailedDescription: "We build robust, scalable software solutions that drive business growth. Our team of experienced engineers leverages modern frameworks and agile methodologies to deliver high-quality applications. From initial architecture design to deployment and maintenance, we handle the full software development lifecycle with precision and care.",
    processSteps: [
      { title: "Discovery & Planning", desc: "We analyze your requirements, define project scope, and create a detailed technical roadmap." },
      { title: "Architecture Design", desc: "Our architects design scalable, secure system architectures tailored to your specific needs." },
      { title: "Agile Development", desc: "Iterative development with regular demos, ensuring alignment with your vision at every step." },
      { title: "Testing & QA", desc: "Comprehensive testing including unit, integration, performance, and security testing." },
      { title: "Deployment & Support", desc: "Seamless deployment with CI/CD pipelines and ongoing maintenance and support." }
    ],
    benefits: [
      { title: "Scalable Architecture", desc: "Built to grow with your business, handling increasing loads without performance degradation." },
      { title: "Agile Delivery", desc: "Regular iterations and demos ensure your product evolves based on real feedback." },
      { title: "Security First", desc: "Enterprise-grade security built into every layer of the application." },
      { title: "Cost Effective", desc: "Optimized development processes that deliver maximum value within budget." }
    ],
    stats: [
      { value: "200+", label: "Projects Delivered" },
      { value: "99.9%", label: "Uptime Guarantee" },
      { value: "40%", label: "Faster Time-to-Market" },
      { value: "24/7", label: "Support Available" }
    ]
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    desc: "Scalable cloud infrastructure that ensures flexibility, resilience, and cost optimization.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    iconId: "cloud",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Cloud Migration",
      "Cloud Infrastructure Setup",
      "DevOps & Automation",
      "Backup & Disaster Recovery",
      "Cloud Security"
    ],
    footer: "Highly available, secure, and cost-effective cloud solutions for your business.",
    detailedDescription: "Transform your IT infrastructure with our comprehensive cloud solutions. We design, migrate, and manage cloud environments across AWS, Azure, and GCP. Our cloud experts ensure your workloads run efficiently, securely, and cost-effectively in the cloud.",
    processSteps: [
      { title: "Assessment", desc: "Evaluate existing infrastructure, identify workloads, and plan migration strategy." },
      { title: "Architecture", desc: "Design cloud-native architecture with high availability, scalability, and security." },
      { title: "Migration", desc: "Execute seamless migration with minimal downtime using proven methodologies." },
      { title: "Optimization", desc: "Continuously monitor and optimize cloud resources for performance and cost." },
      { title: "Management", desc: "Ongoing cloud management, monitoring, and 24/7 support." }
    ],
    benefits: [
      { title: "Cost Optimization", desc: "Pay only for what you use with intelligent resource scaling and management." },
      { title: "High Availability", desc: "Multi-region deployments ensuring 99.99% uptime for critical workloads." },
      { title: "Auto Scaling", desc: "Automatically scale resources up or down based on demand." },
      { title: "Disaster Recovery", desc: "Robust backup and recovery strategies to protect your data." }
    ],
    stats: [
      { value: "50+", label: "Cloud Migrations" },
      { value: "35%", label: "Cost Reduction" },
      { value: "99.99%", label: "Uptime Achieved" },
      { value: "3x", label: "Deployment Speed" }
    ]
  },
  {
    slug: "cybersecurity-services",
    title: "Cybersecurity Services",
    desc: "Comprehensive security strategies to protect your digital assets and ensure compliance.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    iconId: "shield",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Vulnerability Assessments",
      "Penetration Testing",
      "Security Audits & Compliance",
      "Incident Response",
      "Data Encryption"
    ],
    footer: "Robust protection for your critical business data and infrastructure.",
    detailedDescription: "Protect your organization from evolving cyber threats with our comprehensive security services. We provide end-to-end cybersecurity solutions including threat detection, vulnerability management, compliance auditing, and incident response.",
    processSteps: [
      { title: "Security Audit", desc: "Comprehensive assessment of your current security posture and vulnerabilities." },
      { title: "Threat Modeling", desc: "Identify potential attack vectors and prioritize risks based on business impact." },
      { title: "Implementation", desc: "Deploy security controls, monitoring tools, and encryption protocols." },
      { title: "Testing", desc: "Rigorous penetration testing and red team exercises to validate defenses." },
      { title: "Monitoring", desc: "24/7 security monitoring with automated threat detection and response." }
    ],
    benefits: [
      { title: "Proactive Defense", desc: "Stay ahead of threats with continuous monitoring and threat intelligence." },
      { title: "Compliance Ready", desc: "Meet GDPR, SOC2, ISO 27001, and other regulatory requirements." },
      { title: "Rapid Response", desc: "Incident response team available 24/7 to minimize breach impact." },
      { title: "Zero Trust", desc: "Implement zero-trust architecture for maximum security." }
    ],
    stats: [
      { value: "1000+", label: "Vulnerabilities Found" },
      { value: "100%", label: "Compliance Rate" },
      { value: "<1hr", label: "Response Time" },
      { value: "0", label: "Data Breaches" }
    ]
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    desc: "Leverage artificial intelligence to automate workflows and unlock new business insights.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    iconId: "ai",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Machine Learning Models",
      "Process Automation (RPA)",
      "Natural Language Processing",
      "Predictive Analytics",
      "Custom AI Assistants"
    ],
    footer: "Drive efficiency and innovation through intelligent automation.",
    detailedDescription: "Harness the power of artificial intelligence to transform your business operations. We build custom ML models, implement robotic process automation, and develop intelligent assistants that streamline workflows and reduce costs.",
    processSteps: [
      { title: "Data Assessment", desc: "Evaluate your data assets, quality, and readiness for AI implementation." },
      { title: "Model Design", desc: "Design and architect AI/ML models tailored to your specific business problems." },
      { title: "Training & Testing", desc: "Train models on your data with rigorous validation and testing protocols." },
      { title: "Integration", desc: "Seamlessly integrate AI capabilities into your existing workflows and systems." },
      { title: "Optimization", desc: "Continuously improve model accuracy and performance with new data." }
    ],
    benefits: [
      { title: "Process Efficiency", desc: "Automate repetitive tasks, freeing your team for high-value work." },
      { title: "Predictive Insights", desc: "Make data-driven decisions with predictive analytics and forecasting." },
      { title: "Custom Models", desc: "AI models trained specifically on your data for maximum accuracy." },
      { title: "Scalable AI", desc: "Solutions that grow and improve as your business and data scale." }
    ],
    stats: [
      { value: "60%", label: "Process Efficiency Gain" },
      { value: "95%+", label: "Model Accuracy" },
      { value: "10x", label: "Faster Processing" },
      { value: "50+", label: "AI Models Deployed" }
    ]
  },
  {
    slug: "mobile-development",
    title: "Mobile Development",
    desc: "Native and cross-platform mobile experiences designed for engagement and scale.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    iconId: "mobile",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "iOS App Development",
      "Android App Development",
      "Cross-Platform (React Native)",
      "Mobile UI/UX Design",
      "App Maintenance & Scaling"
    ],
    footer: "Engaging, high-performance mobile apps for your users.",
    detailedDescription: "Create exceptional mobile experiences that engage your users and drive business results. We develop native iOS and Android apps as well as cross-platform solutions using React Native and Flutter.",
    processSteps: [
      { title: "UX Research", desc: "User research, persona development, and interaction design for optimal mobile experiences." },
      { title: "UI Design", desc: "Pixel-perfect designs following platform-specific guidelines and modern design trends." },
      { title: "Development", desc: "Clean, maintainable code with native performance and smooth animations." },
      { title: "Testing", desc: "Device-specific testing across multiple screen sizes, OS versions, and network conditions." },
      { title: "Launch & Iterate", desc: "App store submission, launch strategy, and continuous improvement based on analytics." }
    ],
    benefits: [
      { title: "Native Performance", desc: "Smooth 60fps animations and instant responsiveness on all devices." },
      { title: "Cross-Platform", desc: "Single codebase for iOS and Android, reducing development time and cost." },
      { title: "Offline Ready", desc: "Apps that work seamlessly even without network connectivity." },
      { title: "Push Engagement", desc: "Smart push notifications that drive user retention and engagement." }
    ],
    stats: [
      { value: "80+", label: "Apps Published" },
      { value: "4.8★", label: "Average App Rating" },
      { value: "5M+", label: "Total Downloads" },
      { value: "98%", label: "Crash-Free Rate" }
    ]
  },
  {
    slug: "data-analytics",
    title: "Data & Analytics Solution",
    desc: "Transform raw data into actionable insights for strategic decision-making.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    iconId: "chart",
    category: "it-solutions",
    accentColor: "#1A6CFF",
    accentColorDark: "#0D2459",
    points: [
      "Data Warehousing",
      "Business Intelligence Dashboards",
      "Big Data Processing",
      "Data Visualization",
      "Real-time Analytics"
    ],
    footer: "Data-driven insights to accelerate your business growth.",
    detailedDescription: "Unlock the full potential of your data with our comprehensive analytics solutions. We design and implement data pipelines, build interactive dashboards, and create custom analytics platforms that turn raw data into strategic business intelligence.",
    processSteps: [
      { title: "Data Audit", desc: "Assess your data sources, quality, and existing analytics capabilities." },
      { title: "Pipeline Design", desc: "Architect robust ETL/ELT pipelines for reliable data flow and transformation." },
      { title: "Warehouse Setup", desc: "Build scalable data warehouses optimized for analytical queries." },
      { title: "Dashboard Development", desc: "Create interactive, real-time dashboards with drill-down capabilities." },
      { title: "Insights Delivery", desc: "Automated reporting and alerting to keep stakeholders informed." }
    ],
    benefits: [
      { title: "Real-time Insights", desc: "Live dashboards that reflect your business performance in real-time." },
      { title: "Self-Service BI", desc: "Empower teams to explore data and create reports independently." },
      { title: "Data Quality", desc: "Automated data validation and cleansing for trustworthy analytics." },
      { title: "Scalable Platform", desc: "Analytics infrastructure that scales with your growing data volumes." }
    ],
    stats: [
      { value: "10TB+", label: "Data Processed Daily" },
      { value: "300+", label: "Dashboards Built" },
      { value: "5x", label: "Faster Decision Making" },
      { value: "99.5%", label: "Data Accuracy" }
    ]
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
