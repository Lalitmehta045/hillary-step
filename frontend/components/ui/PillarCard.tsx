"use client";

import { m } from "framer-motion";
import { hoverVariants } from "@/components/motion/variants";
import Image from "next/image";
import { memo } from "react";

// Hoisted transition objects
const cardHoverTransition = { duration: 0.3, ease: "easeOut" as const };
const imageRevealTransition = { duration: 1.2, ease: "easeOut" as const };
const imageInitial = { scale: 1.05 };
const imageAnimate = { scale: 1 };
const imageViewport = { once: true as const };

interface PillarCardProps {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
}

export const PillarCard = memo(function PillarCard({ image, alt, eyebrow, title }: PillarCardProps) {
  return (
    <m.article
      whileHover={hoverVariants.cardLift}
      transition={cardHoverTransition}
      className="relative h-[721px] max-md:h-[400px] max-lg:h-[500px] overflow-hidden rounded-[32px] border border-[#EFEFF1] shadow-sm bg-white"
    >
      <m.div
        initial={imageInitial}
        whileInView={imageAnimate}
        transition={imageRevealTransition}
        viewport={imageViewport}
        className="absolute inset-0 h-full w-full transform-gpu"
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </m.div>
      <div className="relative flex items-start justify-between p-[32px]">
        <div>
          <p className="font-sans text-[12px] font-[600] tracking-widest text-white/85 uppercase">
            {eyebrow}
          </p>
          <h3 className="mt-[12px] font-sans text-[30px] font-[510] leading-[37.5px] text-white">
            {title}
          </h3>
        </div>
        <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-white/90">
          <ExpandIcon />
        </span>
      </div>
    </m.article>
  );
});

function ExpandIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1a6cff"
      strokeWidth="2.1"
      strokeLinecap="round"
    >
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
      <path d="M4 4l6 6M20 4l-6 6M20 20l-6-6M4 20l6-6" strokeWidth="1.7" />
    </svg>
  );
}
