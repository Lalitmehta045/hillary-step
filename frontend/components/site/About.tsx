"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ArrowRight } from "./Hero";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { MountainAnimation } from "@/components/motion/MountainAnimation";
import { AnimatedMountainMask } from "@/components/motion/AnimatedMountainMask";
import { GradientReveal } from "@/components/motion/GradientReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const TIMELINE = [
  { year: "2015", title: "Genesis & Strategic Vision", text: "A decade of corporate experience led to an independent research journey and the founding vision of HSS." },
  { year: "2015–2019", title: "Infrastructure & Operations", text: "Built expertise through government tenders, civil infrastructure, staffing, vendor management and cross-border operations." },
  { year: "21 FEB 2020", title: "Incorporation & Governance", text: "HSS was formally incorporated under the Companies Act, 2013, establishing a transparent and structured corporate foundation." },
  { year: "2021–2024", title: "Technology & Global Systems", text: "Expanded into telecom, secure cloud networks and cross-border compliance across India, Australia and the USA." },
  { year: "2024–PRESENT", title: "AI & Global Expansion", text: "Advanced AI-driven resource systems and global staffing architecture, culminating in HSS's expansion across Australia and the USA.", last: true },
];

export function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <section className="relative w-full overflow-hidden bg-white">
        <MountainAnimation className="pointer-events-none absolute bottom-0 right-0 w-[840px] h-[600px] max-w-[62%] max-md:max-w-[120%] select-none">
          <AnimatedMountainMask />
        </MountainAnimation>

        <div className="relative mx-auto w-full max-w-[1280px] pt-[64px] pb-[256px] px-[24px] max-md:pt-[40px] max-md:pb-[120px]">
          <StaggerContainer className="flex flex-col gap-[40px] max-md:gap-[24px]">
            <StaggerItem>
              <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
                ABOUT HILLARY STEP
              </p>
              <h2 className="mt-[24px] max-w-[790px] font-display text-[72px] max-md:text-[40px] max-md:leading-[44px] max-lg:text-[56px] font-[590] leading-[72px] max-lg:leading-[60px] tracking-[-1.8px] max-md:tracking-[-1px] text-[#111111]">
                Every Summit Begins<br className="hidden md:block" />
                <GradientReveal>
                  with <span className="grad-text">One Defining</span><br className="hidden md:block" />
                  <span className="text-[#1a6cff]">Step.</span>
                </GradientReveal>
              </h2>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col gap-[20px] max-md:gap-[16px]">
                <p className="max-w-[976px] font-sans text-[18px] max-md:text-[15px] max-md:leading-[22px] font-[400] leading-[26px] tracking-[0px] text-[#49454F]">
                  Inspired by one of the world&apos;s most iconic symbols of perseverance, Hillary Step
                  Solutions represents the determination to overcome complexity, embrace innovation, and
                  achieve meaningful progress. We help organizations navigate their most critical
                  challenges through technology, global workforce solutions, and engineering excellence.
                </p>
                <p className="max-w-[976px] font-sans text-[18px] max-md:text-[15px] max-md:leading-[22px] font-[400] leading-[26px] tracking-[0px] text-[#49454F]">
                  Hillary Step Solutions is a global business solutions company empowering organizations
                  through intelligent technology, world-class workforce solutions, and engineering
                  excellence. We partner with businesses across the USA, Australia, and India to deliver
                  AI-driven digital transformation, custom software development, international
                  recruitment, strategic staffing, and infrastructure consulting. By combining innovation,
                  industry expertise, and a client-first approach, we help organizations overcome complex
                  challenges, accelerate growth, and build a sustainable future.
                </p>
                <AnimatePresence>
                  {isExpanded && (
                    <m.div
                      initial={{ height: 0, opacity: 0, marginTop: -20 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                      exit={{ height: 0, opacity: 0, marginTop: -20 }}
                      className="flex flex-col gap-[20px] max-md:gap-[16px] overflow-hidden"
                    >
                      <p className="max-w-[976px] font-sans text-[18px] max-md:text-[15px] max-md:leading-[22px] font-[400] leading-[26px] tracking-[0px] text-[#49454F]">
                        Our dedicated teams work relentlessly to build scalable, future-proof architectures
                        that drive operational efficiency and create new avenues for revenue generation. From
                        modernizing legacy systems to deploying cutting-edge AI models, we tailor our approach
                        to meet the unique demands of each client.
                      </p>
                      <p className="max-w-[976px] font-sans text-[18px] max-md:text-[15px] max-md:leading-[22px] font-[400] leading-[26px] tracking-[0px] text-[#49454F]">
                        With a deep understanding of global markets and regulatory landscapes, Hillary Step Solutions
                        ensures seamless cross-border operations. We believe in fostering long-term partnerships built
                        on trust, transparency, and a shared vision for success.
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>

            <StaggerItem>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex h-[52px] items-center gap-[11px] rounded-full bg-brand-blue px-[24px] font-sans text-[14px] font-[500] leading-[20px] text-white shadow-[0px_4px_10px_rgba(0,85,255,0.2)] mt-[8px] transition-transform hover:scale-105 active:scale-95"
              >
                {isExpanded ? "Read Less" : "Read More"}
                <ArrowRight className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section className="w-full bg-[#121212] py-[80px] max-md:py-[60px]">
        <div className="mx-auto w-full max-w-[1280px] px-[24px]">
          <FadeIn>
            <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-brand-green uppercase">
              RESEARCH TIMELINE
            </p>
          </FadeIn>

          <m.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative mt-[92px] max-md:mt-[40px] grid grid-cols-2 max-md:grid-cols-1 max-md:gap-y-[40px] gap-x-[6px] md:grid-cols-5"
          >
            <m.div
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 2.5, ease: "linear" } }
              }}
              className="absolute left-0 right-0 top-[8px] h-px -translate-y-1/2 bg-[#2A2A2A] max-md:hidden pointer-events-none origin-left"
            />
            {TIMELINE.map((item, i) => (
              <div key={i}>
                <div className="relative pr-[40px] max-md:pr-0">
                  <div className="relative flex h-[16px] items-center">
                    {item.last ? (
                      <m.span
                        variants={{
                          hidden: { scale: 0 },
                          visible: { scale: 1, transition: { delay: i * 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        className="relative z-10 h-[9px] w-[9px] bg-white"
                      />
                    ) : (
                      <m.span
                        variants={{
                          hidden: { scale: 0 },
                          visible: { scale: 1, transition: { delay: i * 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        className="relative z-10 h-[14px] w-[14px] rounded-full bg-brand-green shadow-[0_0_14px_4px_rgba(64,246,0,0.45)]"
                      />
                    )}
                  </div>
                  <m.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { delay: i * 0.5 + 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    <h3 className="mt-[42px] max-md:mt-[16px] font-display text-[23px] max-md:text-[20px] font-bold tracking-[0.01em] text-white">
                      {item.year}
                    </h3>
                    <h4 className="mt-[12px] font-sans text-[18px] max-md:text-[16px] font-semibold text-white/90">
                      {item.title}
                    </h4>
                  </m.div>
                </div>
              </div>
            ))}
          </m.div>
        </div>
      </section>
    </>
  );
}
