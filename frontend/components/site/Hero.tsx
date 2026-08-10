"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motion/FadeIn";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Navbar } from "@/components/site/Navbar";

export function Hero() {
  const { scrollY } = useScroll();

  // Parallax for background
  const y = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <section className="relative min-h-[850px] max-md:min-h-[680px] max-lg:min-h-[750px] w-full overflow-hidden bg-white">
      <m.div
        style={{ y }}
        className="absolute inset-0 h-[110%] w-full transform-gpu will-change-transform"
      >
        <Image
          src="/assets/hero-towers.png"
          alt="Glass skyscrapers photographed from street level against an overcast sky"
          priority
          fill
          sizes="100vw"
          className="object-cover brightness-[1.55] contrast-[0.9] saturate-0"
        />
      </m.div>
      <div className="absolute inset-x-0 top-0 h-[120px] bg-linear-to-b from-white/80 to-transparent pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Hero copy */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[64px] max-md:px-[24px] max-lg:px-[40px] pt-[200px] max-md:pt-[120px] max-lg:pt-[140px]">
        <StaggerContainer animateOnMount={true}>
          <StaggerItem>
            <h1 className="max-w-[690px] max-md:max-w-full font-display text-[88px] max-md:text-[44px] max-lg:text-[64px] font-[700] leading-[88px] max-md:leading-[48px] max-lg:leading-[68px] tracking-[-2.2px] max-md:tracking-[-1px] text-white [text-shadow:0px_4px_12px_rgba(0,0,0,0.15)] max-md:[text-shadow:0px_2px_12px_rgba(0,0,0,0.5)]">
              Connecting Technology, Talent, and Global Growth.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[38px] max-md:mt-[24px] max-w-[620px] max-md:max-w-full font-sans text-[18px] max-md:text-[16px] font-normal leading-[26px] max-md:leading-[23px] text-[#1B1B1C] max-md:text-white max-md:[text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
              A global technology and workforce partner delivering AI, software engineering, digital
              transformation, and international staffing solutions.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-[24px] max-md:mt-[32px] flex items-center gap-[16px] max-md:flex-col max-md:items-stretch max-md:gap-[12px]">
              <AnimatedButton
                href="#"
                variant="blueGlow"
                className="flex h-[54px] max-md:justify-center items-center gap-[8px] rounded-full bg-brand-blue px-[24px] py-[14px] font-sans text-[14px] leading-[20px] font-[500] tracking-[0px] text-white shadow-[0px_4px_10px_rgba(0,85,255,0.2)]"
              >
                Explore Global Projects
                <ArrowRight />
              </AnimatedButton>
              <AnimatedButton
                href="#"
                variant="subtleShadow"
                className="flex h-[54px] max-md:justify-center items-center gap-[8px] rounded-full border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.21)] px-[24px] py-[14px] font-sans text-[14px] leading-[20px] font-[500] tracking-[0px] text-white max-md:bg-black/30 max-md:border-white/30 backdrop-blur-[4px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
              >
                Partner With Us
                <ArrowUpRight />
              </AnimatedButton>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Bottom row */}
      <div className="absolute inset-x-0 bottom-[38px] max-md:bottom-[24px] z-10 pointer-events-none">
        <FadeIn delay={0.6}>
          <div className="mx-auto flex w-full max-w-[1440px] h-[48px] items-center justify-center px-[64px] max-md:px-[24px] max-lg:px-[40px]">
            <span className="font-display text-[14px] tracking-[0.22em] text-white/60">
              SCROLL
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function ArrowUpRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
