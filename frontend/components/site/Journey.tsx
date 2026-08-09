"use client";

import { useRef, useState } from "react";
import { m, useScroll, useTransform, useSpring } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Direct transform without heavy spring calculations for 60fps performance
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1.05]);
  const playButtonScale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["40px", "24px"]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }
  };

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
            <p className="mx-auto mt-[38px] max-md:mt-[24px] max-w-[966px] text-center font-sans text-[24px] max-md:text-[16px] max-md:leading-[24px] font-[400] leading-[32px] text-[#A3A3A3]">
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
                
                <m.div
                  style={{ scale: playButtonScale }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FF6200] via-[#00FF11] to-[#007BFF] p-[4px] cursor-pointer z-10 will-change-transform"
                  onClick={togglePlay}
                >
                  <button
                    type="button"
                    aria-label={isPlaying ? "Pause the video" : "Play the video"}
                    className="flex h-[204px] w-[204px] max-md:h-[80px] max-md:w-[80px] max-lg:h-[120px] max-lg:w-[120px] items-center justify-center rounded-full bg-white transition-transform duration-300 hover:scale-[1.02]"
                  >
                    {isPlaying ? (
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="#999898"
                        className="max-md:w-[28px] max-md:h-[28px] max-lg:w-[36px] max-lg:h-[36px]"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg
                        width="110"
                        height="110"
                        viewBox="0 0 52 58"
                        fill="#999898"
                        className="ml-[16px] max-md:ml-[6px] max-md:w-[40px] max-md:h-[40px] max-lg:w-[60px] max-lg:h-[60px]"
                      >
                        <path d="M4 2 48 29 4 56Z" />
                      </svg>
                    )}
                  </button>
                </m.div>
              </div>
            </m.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

