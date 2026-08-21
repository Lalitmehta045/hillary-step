import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { About } from "@/components/site/About";
import { Journey } from "@/components/site/Journey";
import { Leadership } from "@/components/site/Leadership";
import { Regions } from "@/components/site/Regions";
import { Forms } from "@/components/site/Forms";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <main className="w-full overflow-x-clip bg-white">
      <div id="home" className="absolute top-0" />
      <Hero />
      <Pillars />
      <div id="about" />
      <About />
      <Journey />
      <Leadership />
      <div id="global-presence" />
      <Regions />
      <div id="careers" />
      <Forms />
      <Footer />
    </main>
  );
}
