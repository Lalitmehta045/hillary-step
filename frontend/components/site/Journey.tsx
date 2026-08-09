"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Direct transform without heavy spring calculations for 60fps performance
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1.05]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["40px", "24px"]);

  return (
    <section ref={containerRef} className="w-full bg-white pt-[152px] max-md:pt-[80px] pb-[60px] max-md:pb-[40px] overflow-hidden">
      <div className="mx-auto w-full max-w-[1280px] px-[64px] max-md:px-[24px]">
        <StaggerContainer>
          <StaggerItem>
            <h2 className="mx-auto max-w-[720px] text-center font-display text-[60px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[48px] max-lg:leading-[48px] font-[590] leading-[60px] tracking-[-1.5px] max-md:tracking-[-1px] text-[#111111]">
              The Journey
              <br />
              That <GradientReveal className="grad-text-green">Defines Us.</GradientReveal>
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-[38px] max-md:mt-[24px] max-w-[966px] text-center font-sans text-[24px] max-md:text-[16px] max-md:leading-[24px] font-[400] leading-[32px] tracking-[0px] text-[#A3A3A3]">
              Discover the story behind Hillary Step Solutions and how we help organizations transform
              ideas into technology, talent, and infrastructure that create lasting impact.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-[56px] max-md:mt-[40px] w-full max-w-[1186px] flex justify-center">
            <m.div
              style={{ scale, borderRadius }}
              className="relative h-[545px] max-md:h-[260px] max-lg:h-[400px] w-full overflow-hidden bg-gradient-to-r from-[#FF6200] via-[#00FF11] to-[#007BFF] p-[1px] origin-center will-change-transform translate-z-0"
            >
              <div className="relative w-full h-full overflow-hidden rounded-[inherit] bg-black">
                <video
                  ref={videoRef}
                  src="/assets/video/WhatsApp Video 2026-08-09 at 10.02.09 AM.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </m.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

