"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";
import { PillarCard } from "@/components/ui/PillarCard";
import { GlobalStaffingModal } from "@/components/site/GlobalStaffingModal";
import { ITSolutionsModal } from "@/components/site/ITSolutionsModal";
import { CivilInfraModal } from "@/components/site/CivilInfraModal";
import { useState } from "react";

type Pillar = {
  eyebrow: string;
  title: string;
  image: string;
  alt: string;
  href?: string;
  id?: string;
};

const PILLARS: Pillar[] = [
  {
    eyebrow: "PILLAR ONE",
    title: "Cognitive Digital – Platforms",
    image: "/assets/pillar-it.png",
    alt: "Wireframe cloud and laptop illustration in blue",
  },
  {
    eyebrow: "PILLAR TWO",
    title: "Global Talent – People",
    image: "/assets/pillar-staffing.png",
    alt: "Dotted world map with connection arcs in green",
    id: "global-staffing",
  },
  {
    eyebrow: "PILLAR THREE",
    title: "Eco Smart Infra – Projects",
    image: "/assets/pillar-civil.png",
    alt: "Wireframe skyline and bridge illustration in orange",
  },
];

export function Pillars() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isITModalOpen, setIsITModalOpen] = useState(false);
  const [isCivilModalOpen, setIsCivilModalOpen] = useState(false);

  return (
    <section id="pillars" className="w-full bg-white pt-[100px] pb-[40px] max-md:pt-[60px] max-md:pb-[40px]">
      <div className="mx-auto w-full max-w-[1280px] px-[64px] max-md:px-[24px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
              THREE STRATEGIC PILLARS
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] font-display text-[72px] max-md:text-[40px] max-md:leading-[44px] max-lg:text-[56px] max-lg:leading-[60px] font-[590] leading-[72px] tracking-[-1.8px] max-md:tracking-[-1px] text-[#111111]">
              One Company, Three Pillars,
              <br />
              <GradientReveal className="grad-text-bg">Infinite Solutions</GradientReveal>
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[38px] max-md:mt-[24px] max-w-[737px] font-sans text-[20px] max-md:text-[16px] max-md:leading-[24px] font-[300] leading-[28px] tracking-[0px] text-[#49454F]">
              We convene civil engineers, AI researchers, and workforce architects under a single
              principal — designing outcomes that compound across regions.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="mt-[40px] max-md:mt-[32px] grid grid-cols-1 gap-[35px] md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <PillarCard
                image={p.image}
                alt={p.alt}
                title={p.title}
                eyebrow={p.eyebrow}
                href={p.href}
                onClick={
                  p.id === "global-staffing" 
                    ? () => setIsModalOpen(true) 
                    : p.title === "Cognitive Digital – Platforms" 
                      ? () => setIsITModalOpen(true) 
                      : p.title === "Eco Smart Infra – Projects"
                        ? () => setIsCivilModalOpen(true)
                        : undefined
                }
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
      <GlobalStaffingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ITSolutionsModal isOpen={isITModalOpen} onClose={() => setIsITModalOpen(false)} />
      <CivilInfraModal isOpen={isCivilModalOpen} onClose={() => setIsCivilModalOpen(false)} />
    </section>
  );
}
