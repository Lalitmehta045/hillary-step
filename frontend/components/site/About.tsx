"use client";

import { m } from "framer-motion";
import { ArrowRight } from "./Hero";

const MILESTONES = [
  {
    id: "idea",
    title: "IDEA",
    description: "Turning ambition into direction.",
    position: "left-[12%] top-[76%]",
  },
  {
    id: "build",
    title: "BUILD",
    description: "Creating scalable solutions.",
    position: "left-[31%] top-[57%]",
  },
  {
    id: "grow",
    title: "GROW",
    description: "Delivering measurable impact.",
    position: "left-[57%] top-[34%]",
  },
  {
    id: "future",
    title: "A HIGHER FUTURE",
    description: "Pushing boundaries together.",
    position: "right-[5%] top-[7%]",
  },
];

const VALUES = [
  {
    number: "01",
    title: "Our Mission",
    text: "To empower organizations with innovative technology, deep expertise, and a partner-first mindset.",
  },
  {
    number: "02",
    title: "Our Vision",
    text: "To become the trusted partner for businesses that dare to move further, faster, and higher.",
  },
  {
    number: "03",
    title: "Our Values",
    text: "Integrity, innovation, collaboration, and an unwavering focus on meaningful impact.",
  },
];

function Climber({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`absolute z-30 ${className}`}
    >
      <div className="relative h-[58px] w-[34px]">
        {/* Backpack */}
        <div className="absolute left-[5px] top-[18px] h-[23px] w-[14px] rounded-[7px] bg-[#26313B] shadow-sm" />

        {/* Head */}
        <div className="absolute left-[14px] top-[3px] h-[9px] w-[9px] rounded-full bg-[#20262B]" />

        {/* Body */}
        <div className="absolute left-[13px] top-[12px] h-[19px] w-[8px] rounded-full bg-[#303B45]" />

        {/* Left arm */}
        <div className="absolute left-[8px] top-[15px] h-[4px] w-[11px] origin-right rotate-[135deg] rounded-full bg-[#303B45]" />

        {/* Right arm */}
        <div className="absolute left-[18px] top-[16px] h-[4px] w-[12px] origin-left rotate-[-45deg] rounded-full bg-[#303B45]" />

        {/* Left leg */}
        <div className="absolute left-[11px] top-[29px] h-[18px] w-[5px] origin-top rotate-[24deg] rounded-full bg-[#1F2930]" />

        {/* Right leg */}
        <div className="absolute left-[18px] top-[29px] h-[18px] w-[5px] origin-top rotate-[-28deg] rounded-full bg-[#1F2930]" />

        {/* Pole */}
        <div className="absolute left-[27px] top-[15px] h-[42px] w-[1px] origin-top rotate-[8deg] bg-[#69737D]" />
      </div>
    </m.div>
  );
}

function Milestone({
  title,
  description,
  className,
  index,
}: {
  title: string;
  description: string;
  className: string;
  index: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`absolute z-40 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-[#1A6CFF]/30" />

          <m.span
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-[7px] w-[7px] rounded-full bg-[#1A6CFF] shadow-[0_0_12px_rgba(26,108,255,0.45)]"
          />
        </div>

        <div className="min-w-[125px]">
          <p className="font-sans text-[11px] font-semibold tracking-[0.16em] text-[#111111]">
            {title}
          </p>

          <p className="mt-1 max-w-[155px] font-sans text-[10px] leading-[15px] text-[#70757D]">
            {description}
          </p>
        </div>
      </div>
    </m.div>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-white text-[#111111]"
    >
      {/* =========================================================
          HERO / ASCENT
      ========================================================== */}
      <section className="relative min-h-[980px] overflow-hidden max-lg:min-h-[900px] max-md:min-h-[820px]">
        {/* Very subtle atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-[14%] h-[500px] w-[500px] rounded-full bg-[#EAF2FF] opacity-40 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[5%] left-[18%] h-[320px] w-[320px] rounded-full bg-[#F3F6FA] opacity-80 blur-[100px]"
        />

        {/* Main content */}
        <div className="relative z-20 mx-auto w-full max-w-[1400px] px-[52px] pt-[120px] max-xl:px-[40px] max-md:px-[24px] max-md:pt-[110px]">
          <div className="max-w-[470px]">
            {/* Eyebrow */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-4"
            >
              <span className="font-sans text-[11px] font-semibold tracking-[0.28em] text-[#1A6CFF]">
                ABOUT US
              </span>

              <span className="h-px w-[44px] bg-[#1A6CFF]/30" />
            </m.div>

            {/* Main heading */}
            <m.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-[28px] font-display text-[76px] font-[500] leading-[0.98] tracking-[-0.055em] text-[#111111] max-xl:text-[66px] max-md:text-[48px] max-md:leading-[1.02]"
            >
              We help
              <br />
              businesses
              <br />
              <span className="text-[#111111]">
                climb{" "}
              </span>
              <span className="text-[#1A6CFF]">higher.</span>
            </m.h2>

            {/* Description */}
            <m.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.25,
              }}
              className="mt-[30px] max-w-[410px] font-sans text-[17px] font-normal leading-[1.55] text-[#646A73] max-md:text-[15px]"
            >
              Technology, people and engineering solutions for organizations
              ready to take their next defining step.
            </m.p>

            {/* Buttons */}
            <m.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.35,
              }}
              className="mt-[30px] flex items-center gap-4"
            >
              <a
                href="#our-story"
                className="group inline-flex h-[48px] items-center gap-3 rounded-full bg-[#111111] px-[22px] font-sans text-[13px] font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
              >
                Our Story
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#leadership"
                className="group inline-flex h-[48px] items-center gap-3 rounded-full border border-[#D9DDE2] bg-white px-[22px] font-sans text-[13px] font-medium text-[#20242A] transition-all duration-300 hover:border-[#AEB5BE] hover:bg-[#FAFAFA]"
              >
                Meet The Team
                <span className="text-[14px] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </m.div>

            {/* Purpose */}
            <m.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.5,
              }}
              className="mt-[78px] max-w-[350px] max-md:mt-[55px]"
            >
              <div className="flex items-center gap-4">
                <span className="font-sans text-[10px] font-semibold tracking-[0.25em] text-[#8A9098]">
                  OUR PURPOSE
                </span>

                <span className="h-px w-[30px] bg-[#D9DDE2]" />
              </div>

              <p className="mt-[18px] font-sans text-[15px] leading-[1.6] text-[#676D75]">
                To empower businesses with innovative solutions, deep
                expertise, and a partner-first mindset — helping them reach
                new heights in a rapidly changing world.
              </p>
            </m.div>
          </div>
        </div>

        {/* =========================================================
            MOUNTAIN
        ========================================================== */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-10 h-[790px] w-[66%] max-xl:w-[70%] max-lg:h-[700px] max-lg:w-[76%] max-md:h-[520px] max-md:w-[125%] max-md:right-[-25%]">
          {/* Mountain silhouette */}
          <m.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 1.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 opacity-[0.78]"
              style={{
                WebkitMaskImage:
                  "url('/assets/mountain-outline.png')",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "bottom right",
                maskImage:
                  "url('/assets/mountain-outline.png')",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "bottom right",
                background:
                  "linear-gradient(145deg, #F7F9FB 0%, #DCE3EA 45%, #AEB8C3 100%)",
              }}
            />

            {/* Mountain highlight */}
            <div
              className="absolute inset-0 opacity-[0.6]"
              style={{
                WebkitMaskImage:
                  "url('/assets/mountain-outline.png')",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "bottom right",
                maskImage:
                  "url('/assets/mountain-outline.png')",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "bottom right",
                background:
                  "linear-gradient(120deg, transparent 10%, rgba(255,255,255,0.95) 46%, transparent 70%)",
              }}
            />
          </m.div>

          {/* Soft mountain fade into white */}
          <div
            className="absolute inset-x-0 bottom-0 h-[35%]"
            style={{
              background:
                "linear-gradient(to top, #FFFFFF 2%, rgba(255,255,255,0.78) 30%, rgba(255,255,255,0) 100%)",
            }}
          />

          <div
            className="absolute inset-y-0 left-0 w-[30%]"
            style={{
              background:
                "linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* =====================================================
              ASCENT ROUTE
          ====================================================== */}
          <svg
            viewBox="0 0 1000 760"
            preserveAspectRatio="none"
            className="absolute inset-0 z-20 h-full w-full overflow-visible"
          >
            <defs>
              <filter
                id="routeGlow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur
                  stdDeviation="3"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base route */}
            <m.path
              d="M 130 690 C 250 630, 270 565, 365 515 C 455 465, 500 380, 595 315 C 700 242, 760 150, 835 58"
              fill="none"
              stroke="#AFC7ED"
              strokeWidth="2"
              strokeDasharray="5 7"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                pathLength: {
                  duration: 2.8,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.5,
                },
              }}
            />

            {/* Active blue route */}
            <m.path
              d="M 130 690 C 250 630, 270 565, 365 515 C 455 465, 500 380, 595 315 C 700 242, 760 150, 835 58"
              fill="none"
              stroke="#1A6CFF"
              strokeWidth="1.7"
              filter="url(#routeGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.9 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                pathLength: {
                  duration: 3.1,
                  delay: 0.2,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.5,
                  delay: 0.2,
                },
              }}
            />
          </svg>

          {/* Milestones */}
          <Milestone
            index={0}
            title="IDEA"
            description="Turning ambition into direction."
            className="left-[13%] top-[72%]"
          />

          <Milestone
            index={1}
            title="BUILD"
            description="Creating scalable solutions."
            className="left-[34%] top-[51%]"
          />

          <Milestone
            index={2}
            title="GROW"
            description="Delivering measurable impact."
            className="left-[60%] top-[28%]"
          />

          <Milestone
            index={3}
            title="A HIGHER FUTURE"
            description="Pushing boundaries together."
            className="right-[4%] top-[4%]"
          />

          {/* Climbers */}
          <Climber
            className="left-[17%] top-[75%]"
            delay={0.2}
          />

          <Climber
            className="left-[38%] top-[53%]"
            delay={0.35}
          />

          <Climber
            className="left-[63%] top-[31%]"
            delay={0.5}
          />

          <Climber
            className="right-[17%] top-[8%]"
            delay={0.65}
          />

          {/* Summit label */}
          <m.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 1.3,
            }}
            className="absolute bottom-[8%] right-[5%] z-40 hidden text-right lg:block"
          >
            <p className="font-sans text-[9px] font-semibold tracking-[0.25em] text-[#9AA1AA]">
              HIGHER TOGETHER
            </p>

            <div className="mt-3 ml-auto h-[42px] w-px bg-[#D9DDE2]" />

            <p className="mt-3 font-sans text-[8px] tracking-[0.18em] text-[#B0B5BC]">
              27.9881° N, 86.9250° E
            </p>

            <p className="mt-1 font-sans text-[8px] tracking-[0.18em] text-[#B0B5BC]">
              MT. EVEREST
            </p>
          </m.div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================== */}
      <section className="relative z-30 border-b border-[#E8EAED] bg-white">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-3 px-[24px] py-[46px] max-md:grid-cols-1 max-md:gap-[30px] max-md:py-[36px]">
          <Stat
            value="50+"
            label="Global Clients"
            border
          />

          <Stat
            value="6+"
            label="Countries"
            border
          />

          <Stat
            value="98%"
            label="Client Retention"
          />
        </div>
      </section>

      {/* =========================================================
          OUR STORY
      ========================================================== */}
      <section
        id="our-story"
        className="relative mx-auto w-full max-w-[1280px] px-[52px] py-[125px] max-xl:px-[40px] max-md:px-[24px] max-md:py-[80px]"
      >
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-[100px] max-lg:grid-cols-1 max-lg:gap-[45px]">
          {/* Heading */}
          <div>
            <div className="flex items-center gap-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.25em] text-[#1A6CFF]">
                OUR STORY
              </span>

              <span className="h-px w-[42px] bg-[#B9D0F5]" />
            </div>

            <h3 className="mt-[28px] max-w-[480px] font-display text-[62px] font-[500] leading-[1.02] tracking-[-0.045em] text-[#111111] max-md:text-[45px]">
              Built by
              <br />
              doers, for
              <br />
              what&apos;s next.
            </h3>
          </div>

          {/* Story */}
          <div className="pt-[42px] max-lg:pt-0">
            <p className="max-w-[650px] font-sans text-[17px] leading-[1.65] text-[#626871]">
              Hillary Step Solutions was founded on a simple belief — that
              meaningful progress happens when technology, people, and purpose
              come together.
            </p>

            <p className="mt-[25px] max-w-[650px] font-sans text-[17px] leading-[1.65] text-[#626871]">
              What started as a focused pursuit of better solutions has grown
              into a global ecosystem of strategists, engineers, technology
              specialists, and problem-solvers helping organizations overcome
              complex challenges and reach new heights.
            </p>

            <a
              href="#journey"
              className="group mt-[30px] inline-flex h-[46px] items-center gap-3 rounded-full border border-[#D7DBE0] px-[20px] font-sans text-[12px] font-medium text-[#20242A] transition-all duration-300 hover:border-[#AEB5BE] hover:bg-[#FAFAFA]"
            >
              More About Our Journey
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="mt-[105px] grid grid-cols-3 border-t border-[#E8EAED] pt-[60px] max-md:mt-[70px] max-md:grid-cols-1 max-md:gap-[45px]">
          {VALUES.map((value, index) => (
            <div
              key={value.number}
              className={`relative px-[26px] first:pl-0 last:pr-0 max-md:px-0 ${
                index !== VALUES.length - 1
                  ? "border-r border-[#E8EAED] max-md:border-r-0 max-md:border-b max-md:pb-[40px]"
                  : ""
              }`}
            >
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#A0A6AE]">
                {value.number}
              </span>

              <h4 className="mt-[20px] font-display text-[19px] font-medium text-[#171A1E]">
                {value.title}
              </h4>

              <p className="mt-[12px] max-w-[300px] font-sans text-[14px] leading-[1.65] text-[#737981]">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          CLOSING STATEMENT
      ========================================================== */}
      <section className="relative min-h-[520px] overflow-hidden border-t border-[#E8EAED] bg-white">
        {/* Decorative mountain left */}
        <div
          aria-hidden="true"
          className="absolute bottom-[-80px] left-[-80px] h-[390px] w-[480px] opacity-[0.22]"
          style={{
            WebkitMaskImage:
              "url('/assets/mountain-outline.png')",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "bottom left",
            maskImage:
              "url('/assets/mountain-outline.png')",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "bottom left",
            background: "#CBD4DE",
          }}
        />

        {/* Decorative mountain right */}
        <div
          aria-hidden="true"
          className="absolute bottom-[-40px] right-[-50px] h-[420px] w-[470px] opacity-[0.28]"
          style={{
            WebkitMaskImage:
              "url('/assets/mountain-outline.png')",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "bottom right",
            maskImage:
              "url('/assets/mountain-outline.png')",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "bottom right",
            background:
              "linear-gradient(145deg, #DCE3EA, #AEB8C3)",
          }}
        />

        <div className="relative z-10 flex min-h-[520px] items-center justify-center px-[24px] text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="font-sans text-[10px] font-semibold tracking-[0.3em] text-[#7D8791]">
              THE JOURNEY CONTINUES
            </p>

            <h3 className="mt-[22px] font-display text-[68px] font-[500] leading-none tracking-[-0.055em] text-[#111111] max-md:text-[46px]">
              Higher,{" "}
              <span className="text-[#1A6CFF]">Together.</span>
            </h3>

            <div className="mx-auto mt-[25px] h-px w-[48px] bg-[#1A6CFF]" />

            <p className="mt-[22px] font-sans text-[14px] text-[#7A8088]">
              Same mountains. Bigger possibilities.
            </p>
          </m.div>
        </div>
      </section>
    </section>
  );
}

/* ===============================================================
   STAT COMPONENT
================================================================ */

function Stat({
  value,
  label,
  border = false,
}: {
  value: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div
      className={`text-center ${
        border
          ? "border-r border-[#E3E6E9] max-md:border-r-0 max-md:border-b max-md:pb-[28px]"
          : ""
      }`}
    >
      <m.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-[38px] font-[500] tracking-[-0.04em] text-[#111111]"
      >
        {value}
      </m.p>

      <p className="mt-[5px] font-sans text-[12px] text-[#747A82]">
        {label}
      </p>
    </div>
  );
}