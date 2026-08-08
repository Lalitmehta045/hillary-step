const NAV = ["Home", "About", "Global Presence", "Careers", "Contact"];

export function Hero() {
  return (
    <section className="relative min-h-[1190px] w-full overflow-hidden bg-white">
      <img
        src="/assets/hero-towers.png"
        alt="Glass skyscrapers photographed from street level against an overcast sky"
        className="absolute inset-0 h-full w-full object-cover brightness-[1.55] contrast-[0.9] saturate-0"
      />
      <div className="absolute inset-x-0 top-0 h-[120px] bg-linear-to-b from-white/80 to-transparent" />

      {/* Navigation */}
      <header className="relative z-20">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-[64px] pt-[24px] pb-[48px]">
          <a href="#" className="shrink-0 leading-none">
            <img
              src="/assets/logo-hillary-step.png"
              alt="Hillary Step Solutions Logo"
              className="h-[43px] w-[63px] object-contain"
            />
          </a>

          <nav className="hidden items-center gap-[36px] lg:flex">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans text-[14px] font-[510] leading-[20px] text-[#111111] transition-opacity hover:opacity-70"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[24px]">
            <button
              type="button"
              className="flex items-center gap-[7px] font-sans text-[14px] font-[510] leading-[20px] text-[#111111]"
            >
              <GlobeIcon />
              USA
              <ChevronIcon />
            </button>
            <a
              href="#"
              className="flex h-[44px] items-center gap-[9px] rounded-full border border-white/70 bg-white/25 px-[22px] font-sans text-[14px] font-[510] leading-[20px] text-[#111111] backdrop-blur-sm"
            >
              Admin Portal
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </header>

      {/* Hero copy */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[64px] pt-[262px]">
        <h1 className="max-w-[690px] font-display text-[88px] font-[700] leading-[88px] tracking-[-2.2px] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.28)]">
          Connecting Technology, Talent, and Global Growth.
        </h1>

        <p className="mt-[38px] max-w-[620px] font-sans text-[20px] font-normal leading-[28px] text-[#1B1B1C]">
          A global technology and workforce partner delivering AI, software engineering, digital
          transformation, and international staffing solutions.
        </p>

        <div className="mt-[24px] flex items-center gap-[16px]">
          <a
            href="#"
            className="flex h-[54px] items-center gap-[13px] rounded-full bg-brand-blue px-[30px] font-sans text-[17px] font-semibold text-white"
          >
            Explore Global Projects
            <ArrowRight />
          </a>
          <a
            href="#"
            className="flex h-[54px] items-center gap-[12px] rounded-full border border-white/60 bg-white/20 px-[30px] font-sans text-[17px] font-semibold text-ink backdrop-blur-sm"
          >
            Partner With Us
            <ArrowUpRight />
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <div className="absolute inset-x-0 bottom-[38px] z-10">
        <div className="mx-auto flex w-full max-w-[1440px] h-[48px] items-center px-[64px]">
          <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#252525]">
            <span className="font-serif text-[22px] italic text-white">N</span>
          </div>
          <span className="mx-auto font-sans text-[14px] tracking-[0.22em] text-white/60">
            SCROLL
          </span>
          <div className="w-[54px]" />
        </div>
      </div>
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
