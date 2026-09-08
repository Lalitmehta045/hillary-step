import { useEffect, useRef, useState, useCallback } from "react";
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

  const [isBlobActive, setIsBlobActive] = useState(false);
  const blobRef = useRef(null);
  const shatterTimerRef = useRef(null);

  const handleShatterStart = useCallback(() => {
    setIsBlobActive(true);
    if (shatterTimerRef.current) clearTimeout(shatterTimerRef.current);
    shatterTimerRef.current = setTimeout(() => {
      setIsBlobActive(false);
    }, 2200);
  }, []);

  const handleShatterEnd = useCallback(() => {
    setIsBlobActive(false);
    if (shatterTimerRef.current) {
      clearTimeout(shatterTimerRef.current);
      shatterTimerRef.current = null;
    }
  }, []);

  const handleSummitClick = useCallback(() => {
    if (blobRef.current?.shatter) {
      blobRef.current.shatter();
    } else {
      handleShatterStart();
    }
  }, [handleShatterStart]);

  useEffect(() => {
    return () => {
      if (shatterTimerRef.current) clearTimeout(shatterTimerRef.current);
    };
  }, []);

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
      className="relative flex min-h-[105vh] flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden"
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
              HSS | PLATFORMS • PEOPLE • PROJECTS
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
              The Execution Process becomes truly flawless once you understand our AI-driven Methodology.
            </motion.p>
          </div>

          <div className="flex items-center justify-center lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
              className="relative aspect-square w-[280px] sm:w-[360px] md:w-[420px] lg:w-[460px] xl:w-[500px] flex items-center justify-center"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-radial from-[#00E5FF]/10 via-[#00FF87]/5 to-transparent blur-3xl" />

              {/* Interactive 3D Fluid Particle Blob */}
              <FluidBlob
                className="h-full w-full"
                interactive={true}
                blobRef={blobRef}
                onShatterStart={handleShatterStart}
                onShatterEnd={handleShatterEnd}
              />

              {/* Circular Arc Labels (Top Summit & Bottom Base) */}
              <div
                className={`pointer-events-none absolute inset-0 transition-all duration-500 ease-out z-10 ${
                  isBlobActive
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                }`}
              >
                <svg
                  className="h-full w-full overflow-visible select-none"
                  viewBox="0 0 500 500"
                >
                  <defs>
                    {/* Top arc: hugging the upper summit of the blob */}
                    <path
                      id="hero-top-summit-arc"
                      d="M 48,176 A 215,215 0 0,1 452,176"
                      fill="none"
                    />
                    {/* Bottom arc: smiling under the lower base of the blob */}
                    <path
                      id="hero-bottom-base-arc"
                      d="M 48,324 A 215,215 0 0,0 452,324"
                      fill="none"
                    />
                  </defs>

                  {/* Top Arc: Click the Summit. */}
                  <g
                    className="pointer-events-auto cursor-pointer group"
                    onClick={handleSummitClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Click the Summit to trigger particle animation"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSummitClick();
                    }}
                  >
                    {/* Decorative subtle dashed orbital guide */}
                    <path
                      d="M 120,110 A 215,215 0 0,1 380,110"
                      fill="none"
                      stroke="rgba(0, 229, 255, 0.22)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      className="transition-all duration-300 group-hover:stroke-[rgba(0,229,255,0.7)]"
                    />
                    <text
                      className="fill-[#00E5FF] transition-all duration-300 group-hover:fill-white group-hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.9)]"
                      style={{
                        fontFamily: "var(--font-sf), monospace, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                      }}
                    >
                      <textPath
                        href="#hero-top-summit-arc"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        Click the Summit.
                      </textPath>
                    </text>
                  </g>

                  {/* Bottom Arc: Hover the Base. */}
                  <g className="pointer-events-none select-none">
                    {/* Decorative subtle dashed orbital guide */}
                    <path
                      d="M 120,390 A 215,215 0 0,0 380,390"
                      fill="none"
                      stroke="rgba(0, 255, 135, 0.2)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                    />
                    <text
                      className="fill-[#8A8A8A]"
                      style={{
                        fontFamily: "var(--font-sf), monospace, sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                      }}
                    >
                      <textPath
                        href="#hero-bottom-base-arc"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        Hover the Base.
                      </textPath>
                    </text>
                  </g>
                </svg>
              </div>

              {/* Center Revealed Text: "Your Tech Sherpas" */}
              <div
                className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 ease-out z-20 ${
                  isBlobActive
                    ? "opacity-100 scale-100 blur-none"
                    : "opacity-0 scale-85 blur-sm pointer-events-none"
                }`}
                aria-hidden={!isBlobActive}
              >
                {/* Ambient glow behind center badge */}
                <div className="absolute h-36 w-36 rounded-full bg-radial from-[#00E5FF]/30 via-[#00FF87]/20 to-transparent blur-2xl -z-10" />

                <div className="px-6 py-3.5 rounded-2xl bg-[#050505]/85 backdrop-blur-xl border border-[rgba(0,229,255,0.4)] shadow-[0_0_35px_rgba(0,229,255,0.3)] flex flex-col items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.35em] text-[#00E5FF] uppercase">
                    HILLARY STEP
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] whitespace-nowrap">
                    Your Tech Sherpas
                  </h3>
                </div>
              </div>
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
          EXPLORE THE CORE
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
