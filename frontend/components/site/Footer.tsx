"use client";

import { useState } from "react";
import { FooterWave } from "@/components/site/FooterWave";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlobalStaffingModal } from "@/components/site/GlobalStaffingModal";
import { ITSolutionsModal } from "@/components/site/ITSolutionsModal";
import { CivilInfraModal } from "@/components/site/CivilInfraModal";
import Image from "next/image";
import { FaLinkedinIn, FaYoutube, FaLocationDot } from "react-icons/fa6";

type FooterLink = {
  label: string;
  href?: string;
  action?: "it" | "staffing" | "civil";
};

const COLUMNS: {
  title: string;
  links: FooterLink[];
}[] = [
  {
    title: "OPERATIONAL PILLARS",
    links: [
      { label: "Cognitive Digital – Platforms", action: "it" },
      { label: "Global Talent – People", action: "staffing" },
      { label: "Eco Smart Infra – Projects", action: "civil" },
    ],
  },
  {
    title: "STATUTORY COMPLIANCE",
    links: [
      { label: "MCA Parameters" },
      { label: "ASIC Standards" },
      { label: "US Corporate Labor Codes" },
    ],
  },
  {
    title: "CORPORATE GATEWAY",
    links: [
      { label: "About the Ascent", href: "/#about" },
      { label: "The Incubation Lab", href: "/#pillars" },
      { label: "Contact the Sherpas", href: "/#contact" },
    ],
  },
  {
    title: "VALIDATIONS",
    links: [
      { label: "MSME Certified" },
      { label: "DPIIT Recognition" },
    ],
  },
];

const SOCIALS = [
  { icon: FaLinkedinIn, alt: "LinkedIn", bg: "bg-[#0077B5]", hoverBg: "hover:bg-[#005E93]" },
  { icon: FaYoutube, alt: "YouTube", bg: "bg-[#FF0000]", hoverBg: "hover:bg-[#CC0000]" },
  { icon: FaLocationDot, alt: "Google Map", bg: "bg-[#34A853]", hoverBg: "hover:bg-[#2B8A44]" },
];

export function Footer() {
  const [isITModalOpen, setIsITModalOpen] = useState(false);
  const [isStaffingModalOpen, setIsStaffingModalOpen] = useState(false);
  const [isCivilModalOpen, setIsCivilModalOpen] = useState(false);

  const handleAction = (action: FooterLink["action"]) => {
    if (action === "it") setIsITModalOpen(true);
    if (action === "staffing") setIsStaffingModalOpen(true);
    if (action === "civil") setIsCivilModalOpen(true);
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-[#353434]/20 bg-white">
      <FooterWave className="pointer-events-none absolute inset-0 z-20 h-full w-full" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-[30px] px-[64px] max-md:px-[24px] max-lg:px-[40px] pt-[64px] max-md:pt-[40px]">
        <StaggerContainer className="flex w-full flex-col gap-[32px] md:flex-row md:items-start md:justify-between">
          {COLUMNS.map((col) => (
            <StaggerItem key={col.title} className="shrink-0">
              <nav className="flex flex-col gap-[12px]">
                <h2 className="font-display text-[15px] font-[500] leading-[20px] tracking-[0.04em] text-[#1E3A8A] uppercase">
                  {col.title}
                </h2>
                <ul className="flex flex-col gap-[10px]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.action ? (
                        <button
                          type="button"
                          onClick={() => handleAction(link.action)}
                          className="group/link relative inline-flex cursor-pointer items-center gap-[6px] bg-transparent p-0 text-left font-display text-[15px] font-[400] leading-[22px] tracking-[0px] text-[#1E3A8A]/85 transition-all duration-300 hover:text-[#1A6CFF] hover:translate-x-[4px]"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#1A6CFF] to-[#3AF900] transition-all duration-300 ease-out group-hover/link:w-full" />
                          </span>
                        </button>
                      ) : link.href ? (
                        <a
                          href={link.href}
                          className="group/link relative inline-flex items-center gap-[6px] font-display text-[15px] font-[400] leading-[22px] tracking-[0px] text-[#1E3A8A]/85 transition-all duration-300 hover:text-[#1A6CFF] hover:translate-x-[4px]"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#1A6CFF] to-[#3AF900] transition-all duration-300 ease-out group-hover/link:w-full" />
                          </span>
                        </a>
                      ) : (
                        <span className="font-display text-[15px] font-[400] leading-[22px] tracking-[0px] text-[#1E3A8A]/85">
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2} className="flex items-center gap-[19px]">
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <AnimatedButton
                key={s.alt}
                variant="socialIcon"
                href="#"
                aria-label={s.alt}
                className={`group flex h-[45px] w-[45px] items-center justify-center rounded-[10px] overflow-hidden transition-colors ${s.bg} ${s.hoverBg}`}
              >
                <Icon className="h-[22px] w-[22px] text-white transition-transform duration-300 group-hover:scale-110" />
              </AnimatedButton>
            );
          })}
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="h-px w-full bg-[#353434]/20" />
        </FadeIn>
      </div>

      <div className="relative z-10 w-full bg-[#424549]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[30px] px-[64px] max-md:px-[24px] max-lg:px-[40px] py-[30px]">
          <FadeIn delay={0.4}>
            <div className="relative flex flex-col items-start gap-[12px]">
              <Image
                src="/hillary-gunmetal.png"
                alt="Hillary Step Solutions Logo"
                width={63}
                height={43}
                className="object-contain"
              />
              <p className="font-display text-[20px] font-[400] leading-[28px] tracking-[-0.5px] text-white">
                Hillary Step Solutions
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.5} className="flex w-full justify-center max-md:justify-start">
            <p className="font-sans text-[11px] tracking-[0.4px] text-white/60 max-md:text-left max-md:leading-[16px]">
              © 2026 Hillary Step Solutions. Operating as Principal and Agent Worldwide. All Rights Reserved
            </p>
          </FadeIn>
        </div>
      </div>

      <ITSolutionsModal isOpen={isITModalOpen} onClose={() => setIsITModalOpen(false)} />
      <GlobalStaffingModal isOpen={isStaffingModalOpen} onClose={() => setIsStaffingModalOpen(false)} />
      <CivilInfraModal isOpen={isCivilModalOpen} onClose={() => setIsCivilModalOpen(false)} />
    </footer>
  );
}
