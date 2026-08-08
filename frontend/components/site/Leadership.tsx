import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import Image from "next/image";

const LEADERS = [
  {
    image: "/assets/leader-1.png",
    role: "Group Managing Principal",
    name: "K. Kundra",
    quote: '"Infrastructure is a promise a nation makes to itself."',
    alt: "Portrait of K. Kundra, group managing principal",
  },
  {
    image: "/assets/leader-2.png",
    role: "Regional Principal · Pacific",
    name: "D. Kotari",
    quote: '"Precision at scale is the only scale worth pursuing."',
    alt: "Portrait of D. Kotari, regional principal for the Pacific",
  },
  {
    image: "/assets/leader-3.png",
    role: "Regional Principal · South Asia",
    name: "R. Iyer",
    quote: '"Public systems become invisible when they are built well."',
    alt: "Portrait of R. Iyer, regional principal for South Asia",
  },
  {
    image: "/assets/leader-4.png",
    role: "Chief Scientist, Innovation Lab",
    name: "M. Halberg",
    quote: '"Research is our compounding advantage."',
    alt: "Portrait of M. Halberg, chief scientist of the innovation lab",
  },
];

export function Leadership() {
  return (
    <section className="w-full bg-white py-[80px] max-md:py-[60px]">
      <div className="mx-auto w-full max-w-[1280px] px-[96px] max-md:px-[24px] max-lg:px-[40px]">
        <StaggerContainer>
          <StaggerItem>
            <p className="font-sans text-[14px] font-[600] leading-[20px] tracking-[2.8px] text-[#0070F3] uppercase">
              LEADERSHIP
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] max-w-[768px] font-display text-[56px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[44px] max-lg:leading-[48px] font-[590] leading-[56px] tracking-[-1.4px] max-md:tracking-[-1px] text-[#111111]">
              An <span className="grad-text">Operating partnership</span>, not a boardroom.
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="mt-[64px] max-md:mt-[40px] grid grid-cols-1 gap-[32px] md:grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1">
          {LEADERS.map((l) => (
            <StaggerItem key={l.name}>
              <article className="flex flex-col pb-[18px] group">
                <div className="relative overflow-hidden rounded-[24px] aspect-[248/310]">
                  <Image
                    src={l.image}
                    alt={l.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-[24px] font-sans text-[12px] font-[600] uppercase tracking-[1.2px] text-[#8b8b8b]">
                  {l.role}
                </p>
                <h3 className="mt-[8px] font-sans text-[20px] font-[700] text-[#111111]">{l.name}</h3>
                <p className="mt-[8px] font-sans text-[15px] italic leading-[24.38px] text-[#1A1A1A]">
                  {l.quote}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
