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
    <footer className="relative w-full overflow-hidden border-t border-[#353434]/20 bg-white">
      <FooterWave className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-[30px] px-[96px] max-md:px-[24px] pt-[64px] max-md:pt-[40px]">
        <StaggerContainer className="grid grid-cols-2 max-md:grid-cols-1 gap-[48px] max-md:gap-[32px] md:grid-cols-4">
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
                        className="group/link relative inline-flex items-center gap-[6px] font-display text-[16px] font-[400] leading-[24px] tracking-[0px] text-[#1E3A8A] transition-all duration-300 hover:text-[#1A6CFF] hover:translate-x-[4px]"
                      >
                        <span className="relative">
                          {link}
                          <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#1A6CFF] to-[#3AF900] transition-all duration-300 ease-out group-hover/link:w-full" />
                        </span>
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
          <div className="h-px w-full bg-[#353434]/20" />
        </FadeIn>
      </div>

      <div className="relative z-10 w-full bg-[#424549]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[30px] px-[96px] max-md:px-[24px] py-[30px]">
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
            <p className="font-sans text-[10px] tracking-[2.4px] max-md:tracking-[1px] text-white/60 uppercase max-md:text-left max-md:leading-[16px]">
              OPERATING AS PRINCIPAL AND AGENT WORLDWIDE.
            </p>
          </FadeIn>
        </div>
      </div>
    </footer>
  );
}
