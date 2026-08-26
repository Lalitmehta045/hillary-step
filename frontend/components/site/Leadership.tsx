import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";
import Image from "next/image";

const LEADERS = [
  {
    image: "/assets/founder-images/kunal-priyadarshi.jpeg",
    role: "Director (HSS) & CEO",
    name: "Kunal Priyadarshi",
    quote: '"Tech Engineer & Operational Sherpa, bringing two decades of experience scaling operations."',
    alt: "Portrait of Kunal Priyadarshi, Director (HSS) & CEO",
  },
  {
    image: "/assets/founder-images/Kantesh Prasad Singh.png",
    role: "Director (IND) & CFO",
    name: "Kantesh Prasad Singh",
    quote: '"Financial expert directing forty years of distinguished government and defense fiscal leadership."',
    alt: "Portrait of Kantesh Prasad Singh, Director (IND) & CFO",
  },
  {
    image: "/assets/admin-panel-ui/WhatsApp Image 2026-08-24 at 8.02.18 PM.jpeg",
    role: "Honorary Pillar (HSS) & CCO",
    name: "Kanti Singh",
    quote: '"Education-backed specialist guiding values as a non-governing honorary Chief Culture Officer."',
    alt: "Portrait of Alex Carter, Director (USA) & CTO",
  },
  {
    image: "/assets/founder-images/Mrinal Priyadarshi.png",
    role: "Director (AUS) & COO",
    name: "Mrinal Priyadarshi",
    quote: '"Australia-based engineer driving twelve years of operations management and tech innovation."',
    alt: "Portrait of Mrinal Priyadarshi, Director (AUS) & COO",
  },
];

export function Leadership() {
  return (
    <section className="w-full bg-white pt-[80px] pb-[40px] max-md:pt-[60px] max-md:pb-[40px]">
      <div className="mx-auto w-full max-w-[1280px] px-[96px] max-md:px-[24px] max-lg:px-[40px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
              LEADERSHIP
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] max-w-[768px] font-display text-[56px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[44px] max-lg:leading-[48px] font-[590] leading-[56px] tracking-[-1.4px] max-md:tracking-[-1px] text-[#111111]">
              An <GradientReveal className="grad-text">Operating</GradientReveal>{" "}
              <GradientReveal className="grad-text">partnership</GradientReveal>, not a boardroom.
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="mt-[64px] max-md:mt-[40px] grid grid-cols-1 gap-[32px] md:grid-cols-2 lg:grid-cols-4 max-md:grid-cols-1">
          {LEADERS.map((l) => (
            <StaggerItem key={l.name}>
              <article className="flex flex-col pb-[18px] group">
                <div className="relative overflow-hidden rounded-[24px] aspect-[248/310]">
                  <Image
                    src={l.image}
                    alt={l.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-[24px] font-sans text-[12px] font-[600] leading-[18px] uppercase tracking-[1.8px] text-[#737373]">
                  {l.role}
                </p>
                <h3 className="mt-[8px] font-display text-[20px] font-[700] text-[#111111]">{l.name}</h3>
                {l.quote && (
                  <p className="mt-[8px] font-sans text-[15px] italic leading-[24.38px] text-[#1A1A1A]">
                    {l.quote}
                  </p>
                )}
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
