"use client";

import { useEffect, useRef } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
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
    <section className="relative min-h-[850px] max-md:min-h-[680px] max-lg:min-h-[750px] w-full overflow-hidden bg-[#0b1220]">
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

      {/* The hero video contains the complete visual and messaging experience. */}
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />

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
