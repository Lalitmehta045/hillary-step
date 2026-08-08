"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";

const PILLARS = [
  {
    eyebrow: "PILLAR ONE",
    title: "IT Solutions",
    image: "/assets/pillar-it.png",
    alt: "Wireframe cloud and laptop illustration in blue",
  },
  {
    eyebrow: "PILLAR TWO",
    title: "Global Staffing",
    image: "/assets/pillar-staffing.png",
    alt: "Dotted world map with connection arcs in green",
  },
  {
    eyebrow: "PILLAR THREE",
    title: "Civil & Infrastructure",
    image: "/assets/pillar-civil.png",
    alt: "Wireframe skyline and bridge illustration in orange",
  },
];

export function Pillars() {
  return (
    <section className="w-full bg-white pt-[100px] pb-[100px] max-md:py-[60px]">
      <div className="mx-auto w-full max-w-[1280px] px-[64px] max-md:px-[24px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[14px] font-[600] leading-[20px] tracking-[2.8px] text-[#0070F3] uppercase">
              THREE STRATEGIC PILLARS
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] font-display text-[72px] max-md:text-[40px] max-md:leading-[44px] max-lg:text-[56px] max-lg:leading-[60px] font-[590] leading-[72px] tracking-[-1.8px] max-md:tracking-[-1px] text-[#111111]">
              One Company, Three Pillars,
              <br />
              <span className="grad-text-bg">Infinite Solutions</span>
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[38px] max-md:mt-[24px] max-w-[737px] font-sans text-[24px] max-md:text-[18px] max-md:leading-[26px] font-[300] leading-[32px] text-[#49454F]">
              We convene civil engineers, AI researchers, and workforce architects under a single
              principal — designing outcomes that compound across regions.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="mt-[86px] max-md:mt-[48px] grid grid-cols-1 gap-[35px] md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <motion.article
                whileHover={{ y: -6, boxShadow: "0 16px 32px -12px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative h-[721px] max-md:h-[400px] max-lg:h-[500px] overflow-hidden rounded-[32px] border border-[#EFEFF1] shadow-sm bg-white"
              >
                <motion.img
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  src={p.image}
                  alt={p.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative flex items-start justify-between p-[32px]">
                  <div>
                    <p className="font-sans text-[12px] font-[600] tracking-widest text-white/85 uppercase">
                      {p.eyebrow}
                    </p>
                    <h3 className="mt-[12px] font-sans text-[30px] font-[510] leading-[37.5px] text-white">
                      {p.title}
                    </h3>
                  </div>
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-white/90">
                    <ExpandIcon />
                  </span>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1a6cff"
      strokeWidth="2.1"
      strokeLinecap="round"
    >
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
      <path d="M4 4l6 6M20 4l-6 6M20 20l-6-6M4 20l6-6" strokeWidth="1.7" />
    </svg>
  );
}

