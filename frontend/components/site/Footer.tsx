import { FooterWave } from "@/components/site/FooterWave";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import Image from "next/image";
import { FaInstagram, FaXTwitter, FaLinkedinIn, FaFacebookF } from "react-icons/fa6";

const COLUMNS = [
  {
    title: "Company",
    links: ["About", "Leadership", "Innovation Lab", "Sustainability", "Newsroom"],
  },
  {
    title: "Solutions",
    links: [
      "Built Environment",
      "Digital Frontier",
      "Human Capital",
      "Joint Ventures",
      "International EPC",
    ],
  },
  {
    title: "Investors",
    links: ["Investor Portal", "Annual Reports", "Governance", "Filings", "ESG Reporting"],
  },
  {
    title: "Compliance",
    links: [
      "Companies Act 2013",
      "International Arbitration",
      "Global Compliance",
      "Privacy",
      "Terms of Service",
      "CSR",
      "Skill Development",
      "Employee Welfare",
    ],
  },
];

const SOCIALS = [
  { icon: FaInstagram, alt: "Instagram" },
  { icon: FaXTwitter, alt: "X" },
  { icon: FaLinkedinIn, alt: "LinkedIn" },
  { icon: FaFacebookF, alt: "Facebook" },
];

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-[#353434]/20 bg-white py-[64px] max-md:py-[40px]">
      <FooterWave className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative mx-auto w-full max-w-[1280px] px-[96px] max-md:px-[24px]">
        <StaggerContainer className="grid grid-cols-2 max-md:grid-cols-1 gap-[48px] max-md:gap-[32px] md:grid-cols-4 pb-[58px] max-md:pb-[40px]">
          {COLUMNS.map((col) => (
            <StaggerItem key={col.title}>
              <nav className="flex flex-col gap-[8px]">
                <h2 className="font-display text-[16px] font-[400] leading-[24px] tracking-[0px] text-[#1E3A8A]">
                  {col.title}
                </h2>
                <ul className="flex flex-col gap-[8px]">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-display text-[16px] font-[400] leading-[24px] tracking-[0px] text-[#1E3A8A] hover:underline transition-opacity"
                      >
                        {link}
                      </a>
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
                className="group flex h-[45px] w-[45px] items-center justify-center rounded-[10px] overflow-hidden transition-colors bg-[#616161] hover:bg-[#4a4a4a]"
              >
                <Icon className="h-[24px] w-[24px] text-white transition-colors" />
              </AnimatedButton>
            );
          })}
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="my-[32px] h-px w-full bg-[#353434]/20" />
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="relative flex h-[28px] max-md:h-auto max-md:flex-col max-md:items-start items-center">
            <p className="font-display text-[20px] font-[400] leading-[28px] tracking-[-0.5px] text-[#000000]">
              Hillary Step Solution
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.5} className="flex w-full justify-center max-md:justify-start pt-[24px]">
          <p className="font-sans text-[10px] tracking-[2.4px] max-md:tracking-[1px] text-[#111111]/60 uppercase max-md:text-left max-md:leading-[16px]">
            OPERATING AS PRINCIPAL AND AGENT WORLDWIDE.
          </p>
        </FadeIn>
      </div>
    </footer>
  );
}
