import { ArrowRight } from "./Hero";

const TIMELINE = [
  { year: "XXXX", text: "Founded as a civil consulting practice in India." },
  { year: "XXXX", text: "First international EPC delivered — smart terminal, Sydney." },
  { year: "XXXX", text: "AI Research work . First patent filed." },
  { year: "XXXX", text: "Digital Public Infrastructure mandate with Government of India." },
  { year: "XXXX", text: "Global workforce exceeds 10,000 professionals.", last: true },
];

export function About() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-white pt-[150px]">
        <img
          src="/assets/mountain-outline.png"
          alt="Pencil sketch of a mountain summit"
          className="pointer-events-none absolute bottom-0 right-0 w-[840px] max-w-[62%] select-none opacity-50 object-cover"
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-[64px]">
          <p className="font-sans text-[14px] font-[600] leading-[20px] tracking-[2.8px] text-[#0070F3] uppercase">
            ABOUT HILLARY STEP
          </p>

          <h2 className="mt-[24px] max-w-[790px] font-display text-[72px] font-[590] leading-[72px] tracking-[-1.8px] text-[#111111]">
            Every Summit Begins with <span className="grad-text-bg">One Defining Step.</span>
          </h2>

          <p className="mt-[44px] max-w-[976px] font-sans text-[24px] font-[400] leading-[32px] text-[#A3A3A3]">
            Inspired by one of the world&apos;s most iconic symbols of perseverance, Hillary Step
            Solutions represents the determination to overcome complexity, embrace innovation, and
            achieve meaningful progress. We help organizations navigate their most critical
            challenges through technology, global workforce solutions, and engineering excellence.
          </p>
          <p className="mt-[24px] max-w-[702px] font-sans text-[20px] font-[400] leading-[28px] tracking-[-0.6px] text-[#1B1B1C]">
            Hillary Step Solutions is a global business solutions company empowering organizations
            through intelligent technology, world-class workforce solutions, and engineering
            excellence. We partner with businesses across the USA, Australia, and India to deliver
            AI-driven digital transformation, custom software development, international
            recruitment, strategic staffing, and infrastructure consulting. By combining innovation,
            industry expertise, and a client-first approach, we help organizations overcome complex
            challenges, accelerate growth, and build a sustainable future.
          </p>

          <div className="mt-[250px] pb-[120px]">
            <a
              href="#"
              className="inline-flex h-[52px] items-center gap-[11px] rounded-full bg-brand-blue px-[24px] font-sans text-[16px] font-[590] leading-[24px] text-white"
            >
              Contact Us
              <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#121212] py-[80px]">
        <div className="mx-auto w-full max-w-[1280px] px-[24px]">
          <p className="font-sans text-[14px] font-[600] leading-[20px] tracking-[2.8px] text-brand-green uppercase">
            RESEARCH TIMELINE
          </p>

          <div className="mt-[92px] grid grid-cols-2 gap-x-[6px] md:grid-cols-5">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative pr-[40px]">
                <div className="relative flex h-[16px] items-center">
                  <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#2A2A2A]" />
                  {item.last ? (
                    <span className="relative h-[9px] w-[9px] bg-white" />
                  ) : (
                    <span className="relative h-[14px] w-[14px] rounded-full bg-brand-green shadow-[0_0_14px_4px_rgba(64,246,0,0.45)]" />
                  )}
                </div>
                <h3 className="mt-[42px] font-display text-[23px] font-bold tracking-[0.01em] text-white">
                  {item.year}
                </h3>
                <p className="mt-[16px] max-w-[250px] font-sans text-[17px] leading-[1.62] text-white/55">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
