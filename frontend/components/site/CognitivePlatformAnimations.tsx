import { m } from "framer-motion";
import type { ReactNode } from "react";

const providers = [
  { label: "Google", x: "8%", y: "18%", delay: 0 },
  { label: "GitHub", x: "7%", y: "68%", delay: 0.8 },
  { label: "Microsoft", x: "76%", y: "12%", delay: 1.3 },
  { label: "Slack", x: "80%", y: "69%", delay: 1.9 },
  { label: "Notion", x: "48%", y: "7%", delay: 0.45 },
  { label: "Salesforce", x: "43%", y: "82%", delay: 1.6 },
];

const runtimeItems = [
  { label: "Agent", meta: "ready", delay: 0 },
  { label: "Model", meta: "connected", delay: 0.7 },
  { label: "Data", meta: "synced", delay: 1.4 },
];

function ProviderMark({ label }: { label: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black/10 bg-white text-[10px] font-semibold text-[#252525] shadow-[0_8px_22px_rgba(0,0,0,0.12)]">
      {label.slice(0, 1)}
    </span>
  );
}

function ProviderPill({
  label,
  x,
  y,
  delay,
}: {
  label: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <m.div
      className="absolute z-20 flex items-center gap-2 rounded-full border border-white/[0.10] bg-[#27282d]/95 px-2 py-1.5 pr-3 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
      style={{ left: x, top: y }}
      animate={{ y: [0, -5, 0], opacity: [0.78, 1, 0.78] }}
      transition={{ duration: 4.5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <ProviderMark label={label} />
      <span className="text-[10px] font-medium text-white/75">{label}</span>
    </m.div>
  );
}

function CircuitLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <m.div
      className={`absolute h-px origin-left bg-gradient-to-r from-white/5 via-white/35 to-white/5 ${className}`}
      animate={{ opacity: [0.12, 0.65, 0.12], scaleX: [0.92, 1, 0.92] }}
      transition={{ duration: 3.2, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

function PlatformCore() {
  return (
    <m.div
      className="absolute left-1/2 top-1/2 z-30 flex h-[116px] w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[18px] border border-black/10 bg-[#f7f7f5] shadow-[0_22px_55px_rgba(0,0,0,0.28)]"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#191a1e] text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      </div>
      <span className="text-[11px] font-semibold tracking-[-0.01em] text-[#17181b]">Cognitive Platform</span>
      <span className="mt-1 text-[9px] text-black/45">Connected systems</span>
    </m.div>
  );
}

function DigitalPlatformCard() {
  return (
    <div className="relative h-[330px] overflow-hidden rounded-[26px] border border-black/[0.08] bg-[#18191d] shadow-[0_18px_55px_rgba(0,0,0,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative z-40 px-6 pt-6">
        <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">Cognitive Digital Platform</div>
        <p className="mt-1.5 max-w-[360px] text-[11px] leading-[18px] text-white/45">
          Connect applications, data and business systems through one intelligent layer.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[88px]">
        <CircuitLine className="left-[24%] top-[28%] w-[25%] rotate-[16deg]" delay={0.1} />
        <CircuitLine className="left-[25%] top-[70%] w-[25%] rotate-[-16deg]" delay={0.9} />
        <CircuitLine className="left-[52%] top-[27%] w-[27%] rotate-[-17deg]" delay={1.2} />
        <CircuitLine className="left-[51%] top-[71%] w-[29%] rotate-[17deg]" delay={1.8} />
        <CircuitLine className="left-[22%] top-[50%] w-[56%]" delay={0.5} />

        {providers.map((provider) => (
          <ProviderPill key={provider.label} {...provider} />
        ))}
        <PlatformCore />
      </div>
    </div>
  );
}

function RuntimeCard() {
  return (
    <div className="relative h-[330px] overflow-hidden rounded-[26px] border border-black/[0.08] bg-[#18191d] shadow-[0_18px_55px_rgba(0,0,0,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_54%,rgba(255,255,255,0.075),transparent_31%)]" />
      <div className="relative z-40 px-6 pt-6">
        <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">Cognitive AI Runtime</div>
        <p className="mt-1.5 max-w-[390px] text-[11px] leading-[18px] text-white/45">
          Orchestrate agents, models and enterprise actions from a single runtime.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[88px]">
        <m.div
          className="absolute left-1/2 top-1/2 z-30 h-[148px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-white/10 bg-[#232429] p-3 shadow-[0_22px_55px_rgba(0,0,0,0.28)]"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-2">
            <span className="text-[9px] font-medium text-white/65">runtime / cognitive</span>
            <span className="flex items-center gap-1 text-[8px] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> live
            </span>
          </div>
          <div className="mt-3 space-y-2 font-mono text-[8px] text-white/50">
            <div><span className="text-white/25">$</span> hs runtime connect</div>
            <div className="text-white/75">→ orchestration layer ready</div>
            <div className="text-white/55">→ 3 cognitive services linked</div>
            <div className="text-white/35">→ waiting for next action_</div>
          </div>
        </m.div>

        {runtimeItems.map((item, index) => {
          const positions = [
            "left-[7%] top-[20%]",
            "right-[7%] top-[20%]",
            "left-[50%] bottom-[5%] -translate-x-1/2",
          ];
          return (
            <m.div
              key={item.label}
              className={`absolute z-20 flex items-center gap-2 rounded-[14px] border border-white/[0.09] bg-[#292a2f] px-3 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.24)] ${positions[index]}`}
              animate={{ y: [0, -5, 0], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 4.2, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-white/[0.08] text-[9px] font-semibold text-white/75">
                {item.label.slice(0, 1)}
              </div>
              <div>
                <div className="text-[9px] font-medium text-white/75">{item.label}</div>
                <div className="text-[8px] text-white/30">{item.meta}</div>
              </div>
            </m.div>
          );
        })}

        <CircuitLine className="left-[28%] top-[32%] w-[22%] rotate-[17deg]" delay={0.2} />
        <CircuitLine className="left-[50%] top-[33%] w-[22%] rotate-[-17deg]" delay={1} />
        <CircuitLine className="left-[50%] top-[73%] w-[18%] rotate-[90deg]" delay={1.6} />
      </div>
    </div>
  );
}

export function CognitivePlatformAnimations() {
  return (
    <section className="mx-auto mb-12 mt-2 w-full max-w-[1400px] px-8 md:px-16">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DigitalPlatformCard />
        <RuntimeCard />
      </div>
    </section>
  );
}
