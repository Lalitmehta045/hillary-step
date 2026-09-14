import { m } from "framer-motion";

const Node = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <m.div
    animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    className={`absolute z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#292b31] text-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.28)] ${className}`}
  >
    {children}
  </m.div>
);

const Line = ({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => (
  <m.div
    initial={{ opacity: 0.2 }}
    animate={{ opacity: [0.2, 0.75, 0.2] }}
    transition={{ duration: 2.8, repeat: Infinity, delay, ease: "easeInOut" }}
    className={`absolute h-px origin-left bg-gradient-to-r from-[#4c5667]/10 via-[#56d7ff]/55 to-[#4c5667]/10 ${className}`}
  />
);

function CloudGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
      <path d="M14 34h22a8 8 0 0 0 1-16 12 12 0 0 0-23-2 9 9 0 0 0 0 18Z" fill="#35d5ff" />
      <path d="M14 34h22a8 8 0 0 0 1-16 12 12 0 0 0-23-2 9 9 0 0 0 0 18Z" stroke="#7ee9ff" strokeWidth="1.5" />
    </svg>
  );
}

function CoreGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
      <circle cx="24" cy="24" r="13" stroke="#32d8ff" strokeWidth="3" />
      <circle cx="24" cy="24" r="5" fill="#32d8ff" />
      <path d="M24 6v7M24 35v7M6 24h7M35 24h7" stroke="#32d8ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CognitiveCard({ second = false }: { second?: boolean }) {
  return (
    <div className="relative h-[270px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#202126] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(38,207,255,0.07),transparent_32%)]" />
      <div className="relative z-10 px-6 pt-6">
        <div className="text-[16px] font-semibold tracking-tight text-white">
          {second ? "Cognitive AI Runtime" : "Cognitive Digital Platform"}
        </div>
        <p className="mt-2 max-w-[430px] text-[13px] leading-5 text-white/50">
          {second
            ? "Connect intelligent agents, models, and enterprise systems through one adaptive cognitive layer."
            : "Unify data, intelligence, and digital workflows through a connected platform built for scale."}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[82px]">
        <Line className="left-[28%] top-[49%] w-[22%] rotate-[-32deg]" delay={0.1} />
        <Line className="left-[28%] top-[51%] w-[23%] rotate-[30deg]" delay={0.7} />
        <Line className="left-[50%] top-[49%] w-[23%] rotate-[-28deg]" delay={1.2} />
        <Line className="left-[50%] top-[52%] w-[24%] rotate-[28deg]" delay={1.8} />
        <Line className="left-[28%] top-[50%] w-[45%]" delay={0.4} />

        <Node className="left-[9%] top-[17%]" delay={0.1}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12h8M12 8v8" />
          </svg>
        </Node>
        <Node className="left-[9%] top-[65%]" delay={0.8}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="7" />
          </svg>
        </Node>
        <Node className="right-[9%] top-[17%]" delay={1.2}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="3" />
          </svg>
        </Node>
        <Node className="right-[9%] top-[65%]" delay={1.7}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14M12 5v14" /><rect x="4" y="4" width="16" height="16" rx="4" />
          </svg>
        </Node>

        <m.div
          animate={{ boxShadow: ["0 0 0 rgba(50,216,255,0)", "0 0 34px rgba(50,216,255,0.24)", "0 0 0 rgba(50,216,255,0)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 z-30 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] border border-white/10 bg-[#292b31]"
        >
          {second ? <CoreGlyph /> : <CloudGlyph />}
        </m.div>
      </div>
    </div>
  );
}

export function CognitivePlatformAnimations() {
  return (
    <section className="mb-10 mt-2 w-full">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CognitiveCard />
        <CognitiveCard second />
      </div>
    </section>
  );
}
