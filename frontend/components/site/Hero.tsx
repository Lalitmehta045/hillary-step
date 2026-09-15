"use client";

import { useEffect, useRef } from "react";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motion/FadeIn";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Navbar } from "@/components/site/Navbar";

const HERO_VIDEO_SRC = "/hero-video/CINE%20V5.mp4";
const HERO_VIDEO_MOBILE_SRC = "/hero-video/cine-v5-mobile.mp4";
const HERO_POSTER_SRC = "/hero-video/hero-poster.webp";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Essential for iOS Safari & WebKit autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const tryPlay = () => {
      if (motionQuery.matches) {
        video.pause();
        return;
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay can fail before user gesture in low-power mode.
        });
      }
    };

    // Low-power / battery saver mode fallback: play on first user interaction
    const handleFirstInteraction = () => {
      tryPlay();
      removeInteractionListeners();
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };

    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("click", handleFirstInteraction, { passive: true });
    window.addEventListener("scroll", handleFirstInteraction, { passive: true });

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

    tryPlay();

    return () => {
      visibility.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      removeInteractionListeners();
    };
  }, []);

  return (
    <section className="relative min-h-[780px] max-md:min-h-[600px] max-lg:min-h-[680px] w-full overflow-hidden bg-[#0b1220]">
      <div className="absolute inset-0 h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER_SRC}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none transform-gpu will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          <source media="(max-width: 768px)" src={HERO_VIDEO_MOBILE_SRC} type="video/mp4" />
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero copy — text-shadow only, video stays natural */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[64px] max-md:px-[24px] max-lg:px-[40px] pt-[460px] max-md:pt-[260px] max-lg:pt-[340px]">
        <StaggerContainer animateOnMount={true} delay={1.5}>

          <StaggerItem>
            <p className="max-w-[620px] max-md:max-w-full font-sans text-[18px] max-md:text-[16px] font-normal leading-[26px] max-md:leading-[23px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.35)]">
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

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-[38px] max-md:bottom-[24px] z-10 pointer-events-none">
        <FadeIn delay={2.5}>
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

