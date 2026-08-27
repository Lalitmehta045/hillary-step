import { useEffect, useRef } from "react";
import { m as motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaskReveal from "./MaskReveal";
import dynamic from "next/dynamic";

const FluidBlob = dynamic(
  () => import("@/components/ui/FluidBlob").then((mod) => mod.FluidBlob),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -70,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom 35%",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      id="ai-hero"
      data-testid="ai-hero"
      className="relative flex min-h-[105vh] flex-col justify-center px-6 md:px-16 lg:px-24"
    >
      <div ref={contentRef} className="relative z-[2] w-full max-w-[1400px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="mb-8 text-[11px] md:text-xs font-medium uppercase tracking-[0.35em] text-[#8A8A8A]"
              data-testid="hero-kicker"
            >
              Hillary Step / AI Intelligence
            </motion.p>

            <MaskReveal
              as="h1"
              onLoad
              delay={0.9}
              testId="hero-headline"
              className="font-display text-[clamp(2.8rem,7.5vw,7.8rem)] font-medium leading-[0.98] tracking-[-0.03em] text-[#F5F5F5]"
              lines={["INTELLIGENCE", "AT THE CORE."]}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="mt-8 max-w-md text-base md:text-lg font-light leading-relaxed text-[#8A8A8A]"
              data-testid="hero-subcopy"
            >
              AI becomes more powerful when it becomes part of the system.
            </motion.p>
          </div>

          <div className="flex items-center justify-center lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
              className="relative aspect-square w-[280px] sm:w-[360px] md:w-[420px] lg:w-[460px] xl:w-[500px]"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-radial from-[#00E5FF]/10 via-[#00FF87]/5 to-transparent blur-3xl" />
              <FluidBlob className="h-full w-full" interactive={true} />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.6 }}
        className="absolute bottom-10 left-6 z-[2] flex items-center gap-4 md:left-16 lg:left-24"
        data-testid="hero-scroll-cue"
      >
        <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] text-[#8A8A8A]">
          Scroll to explore
        </span>
        <svg
          className="scroll-cue h-4 w-4 text-[#8A8A8A]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
