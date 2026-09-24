import dynamic from "next/dynamic";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { InnovationLab } from "@/components/site/InnovationLab";
import { About } from "@/components/site/About";
import { Journey } from "@/components/site/Journey";
import { Leadership } from "@/components/site/Leadership";
import { Forms } from "@/components/site/Forms";

const Regions = dynamic(() => import("@/components/site/Regions").then((mod) => mod.Regions), { ssr: true });
const AISection = dynamic(() => import("@/components/ai/AISection"), { ssr: true });
const Footer = dynamic(() => import("@/components/site/Footer").then((mod) => mod.Footer), { ssr: true });

export default function Home() {
  return (
    <main className="w-full overflow-x-clip bg-white">
      <div id="home" className="absolute top-0" />
      <Hero />
      <Pillars />
      {/* Hidden for now - Unhide when needed: */}
      {/* <div id="capabilities" /> */}
      {/* <InnovationLab /> */}
      <div id="about" />
      <About />
      <Journey />
      <Leadership />
      <div id="global-presence" />
      <Regions />
      <div id="ai-experience" />
      <AISection />
      <div id="careers" className="w-full bg-white h-16 md:h-24" />
      <Forms />
      <Footer />
    </main>
  );
}
