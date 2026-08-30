"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { aiState } from "./store";
import Hero from "./Hero";
import Statement from "./Statement";
import CoreArchitecture from "./CoreArchitecture";
import DataPipeline from "./DataPipeline";
import HumanMachine from "./HumanMachine";
import Summit from "./Summit";
import Teaser from "./Teaser";
import "./ai.css";

const CoreCanvas = dynamic(() => import("./CoreCanvas"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AISection() {
  const rootRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [coreOn, setCoreOn] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Connect to outer Lenis smooth scroll if available
    const handleScrollUpdate = () => {
      ScrollTrigger.update();
    };

    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.on("scroll", handleScrollUpdate);
    }

    const onMove = (e) => {
      aiState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      aiState.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    const ctx = gsap.context(() => {
      // Initial state: hidden
      gsap.set(canvasWrapRef.current, {
        opacity: 0,
        visibility: "hidden",
      });

      // Core lifecycle: active only within AI Hero -> Architecture view range
      ScrollTrigger.create({
        trigger: "#ai-hero",
        start: "top bottom",
        endTrigger: "#ai-architecture",
        end: "bottom top",
        onEnter: () => {
          setCoreOn(true);
          gsap.set(canvasWrapRef.current, { visibility: "visible" });
        },
        onLeave: () => {
          setCoreOn(false);
          gsap.set(canvasWrapRef.current, { visibility: "hidden" });
        },
        onEnterBack: () => {
          setCoreOn(true);
          gsap.set(canvasWrapRef.current, { visibility: "visible" });
        },
        onLeaveBack: () => {
          setCoreOn(false);
          gsap.set(canvasWrapRef.current, { visibility: "hidden" });
        },
      });

      // Fade the fixed 3D core in as we scroll into #ai-hero
      gsap.fromTo(
        canvasWrapRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#ai-hero",
            start: "top 70%",
            end: "top 15%",
            scrub: true,
          },
        }
      );

      // Core activation: dormant at hero -> fully active end of architecture
      ScrollTrigger.create({
        trigger: "#ai-hero",
        start: "top top",
        endTrigger: "#ai-architecture",
        end: "bottom 70%",
        onUpdate: (self) => {
          aiState.core = self.progress;
        },
      });

      // Fade the fixed 3D core out after the architecture section
      if (canvasWrapRef.current) {
        gsap.to(canvasWrapRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#ai-architecture",
            start: "top 55%",
            end: "center 45%",
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
      // @ts-ignore
      if (window.lenis) {
        // @ts-ignore
        window.lenis.off?.("scroll", handleScrollUpdate);
      }
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`ai-root ${reduced ? "reduced" : ""}`}
      data-testid="ai-experience"
    >
      {/* atmosphere */}
      <div className="ai-atmo" aria-hidden="true">
        <div className="ai-atmo-glow" />
        <div className="ai-atmo-grid" />
        <div className="ai-atmo-grain" />
        <div className="ai-atmo-vignette" />
      </div>

      {/* fixed 3D intelligence core */}
      <div
        ref={canvasWrapRef}
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <Suspense fallback={null}>
          <CoreCanvas active={coreOn} />
        </Suspense>
      </div>

      <main className="relative z-[2]">
        <Hero />
        <Statement />
        <CoreArchitecture />

        {/* from here on, sections sit on solid ground above the faded core */}
        <div className="relative bg-[#050505]">
          <DataPipeline />
          <HumanMachine />
          <Summit />
          <Teaser />
        </div>
      </main>
    </div>
  );
}
