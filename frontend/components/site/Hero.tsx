"use client";

import { useEffect, useRef } from "react";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motion/FadeIn";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Navbar } from "@/components/site/Navbar";

const HERO_VIDEO_SRC = "/hero-video/hero-everest.mp4";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const tryPlay = () => {
      if (motionQuery.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        // Autoplay can fail before user gesture; muted + playsInline covers most cases.
      });
    };

    // Pause when scrolled away — decoding a full-bleed loop offscreen wastes CPU/GPU.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || motionQuery.matches) {
          video.pause();
          return;
        }
        tryPlay();
      },
      { threshold: 0.15 },
    );
    visibility.observe(video);

    const onMotionChange = () => {
      if (motionQuery.matches) video.pause();
      else tryPlay();
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      visibility.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section className="relative min-h-[850px] max-md:min-h-[680px] max-lg:min-h-[750px] w-full overflow-hidden bg-[#0b1220]">
      <div className="absolute inset-0 h-full w-full">
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero copy — text-shadow only, video stays natural */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[64px] max-md:px-[24px] max-lg:px-[40px] pt-[200px] max-md:pt-[120px] max-lg:pt-[140px]">
        <StaggerContainer animateOnMount={true}>
          <StaggerItem>
            <h1 className="max-w-[690px] max-md:max-w-full font-display text-[88px] max-md:text-[44px] max-lg:text-[64px] font-[700] leading-[88px] max-md:leading-[48px] max-lg:leading-[68px] tracking-[-2.2px] max-md:tracking-[-1px] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55),0_1px_4px_rgba(0,0,0,0.4)]">
              Connecting Technology, Talent, and Global Growth.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[38px] max-md:mt-[24px] max-w-[620px] max-md:max-w-full font-sans text-[18px] max-md:text-[16px] font-normal leading-[26px] max-md:leading-[23px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.35)]">
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

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
