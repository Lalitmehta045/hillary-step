import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { PillarCard } from "@/components/ui/PillarCard";

const PILLARS = [
  {
    eyebrow: "PILLAR ONE",
    title: "IT Solutions",
    image: "/assets/pillar-it.png",
    alt: "Wireframe cloud and laptop illustration in blue",
  },
  {
    eyebrow: "PILLAR TWO",
    title: "Global Staffing",
    image: "/assets/pillar-staffing.png",
    alt: "Dotted world map with connection arcs in green",
  },
  {
    eyebrow: "PILLAR THREE",
    title: "Civil & Infrastructure",
    image: "/assets/pillar-civil.png",
    alt: "Wireframe skyline and bridge illustration in orange",
  },
];

export function Pillars() {
  return (
    <section className="w-full bg-white pt-[100px] pb-[100px] max-md:py-[60px]">
      <div className="mx-auto w-full max-w-[1280px] px-[64px] max-md:px-[24px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[14px] font-[600] leading-[20px] tracking-[2.8px] text-[#0070F3] uppercase">
              THREE STRATEGIC PILLARS
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] font-display text-[72px] max-md:text-[40px] max-md:leading-[44px] max-lg:text-[56px] max-lg:leading-[60px] font-[590] leading-[72px] tracking-[-1.8px] max-md:tracking-[-1px] text-[#111111]">
              One Company, Three Pillars,
              <br />
              <span className="grad-text-bg">Infinite Solutions</span>
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[38px] max-md:mt-[24px] max-w-[737px] font-sans text-[24px] max-md:text-[18px] max-md:leading-[26px] font-[300] leading-[32px] text-[#49454F]">
              We convene civil engineers, AI researchers, and workforce architects under a single
              principal — designing outcomes that compound across regions.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="mt-[86px] max-md:mt-[48px] grid grid-cols-1 gap-[35px] md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <PillarCard
                image={p.image}
                alt={p.alt}
                title={p.title}
                eyebrow={p.eyebrow}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
