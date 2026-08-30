import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check,
  BrainCircuit, Code2, Cloud, Workflow, ShieldCheck, LineChart,
  Users, Building2, Target, Globe2, GraduationCap, HeartHandshake,
  Building, Leaf, Ruler, Cpu, FileCheck2, Gauge,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { pillars } from "../mock";

const iconMap = {
  BrainCircuit, Code2, Cloud, Workflow, ShieldCheck, LineChart,
  Users, Building2, Target, Globe2, GraduationCap, HeartHandshake,
  Building, Leaf, Ruler, Cpu, FileCheck2, Gauge,
};

const PillarPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pillar = pillars.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!pillar) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center gap-6">
        <h1 className="hs-heading text-4xl">Pillar not found</h1>
        <button onClick={() => navigate("/")} className="bg-[#2563eb] px-6 py-3 rounded-full font-semibold">
          Back home
        </button>
      </div>
    );
  }

  const c = pillar.color;
  const others = pillars.filter((p) => p.slug !== slug);

  return (
    <div className="bg-[#0a0e1a] text-white">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img src={pillar.heroImage} alt={pillar.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(10,14,26,0.55) 0%, rgba(10,14,26,0.6) 40%, #0a0e1a 100%)` }} />
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-[520px] h-[520px] rounded-full blur-[130px] opacity-40"
          style={{ backgroundColor: c }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full pb-20 pt-32">
          <button
            onClick={() => navigate("/#pillars")}
            className="group inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-10 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to pillars
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            <p className="font-mono-label text-[11px]" style={{ color: pillar.colorSoft }}>{pillar.tag}</p>
          </div>

          <h1 className="hs-heading text-[46px] sm:text-[76px] lg:text-[104px] max-w-[14ch]">
            {pillar.title} <span style={{ color: c }}>{pillar.subtitle}</span>
          </h1>
          <p className="mt-8 text-white/70 text-xl lg:text-2xl max-w-[46ch] leading-snug font-display font-medium">
            {pillar.tagline}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/8 bg-[#0f1526]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
          {pillar.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="px-6 py-10 lg:py-12 first:pl-0">
              <p className="hs-heading text-4xl lg:text-5xl" style={{ color: c }}>{s.value}</p>
              <p className="mt-2 text-sm text-white/55">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <p className="font-mono-label text-[11px] mb-6" style={{ color: pillar.colorSoft }}>Overview</p>
            <h2 className="hs-heading text-[32px] sm:text-[46px] leading-tight">
              Where ambition meets execution.
            </h2>
            <p className="mt-7 text-white/60 text-lg leading-relaxed">{pillar.intro}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/#contact"
                className="group inline-flex items-center gap-2.5 text-white font-semibold px-7 py-3.5 rounded-full transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: c }}
              >
                Start a conversation
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative rounded-[24px] overflow-hidden border border-white/8">
              <img src={pillar.altImage} alt={pillar.title} className="w-full h-[420px] object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${c}22 100%)` }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-24 bg-[#0f1526]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="font-mono-label text-[11px] mb-6" style={{ color: pillar.colorSoft }}>Capabilities</p>
            <h2 className="hs-heading text-[32px] sm:text-[52px] max-w-[18ch]">
              A full stack of expertise, under one principal.
            </h2>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillar.capabilities.map((cap, i) => {
              const Icon = iconMap[cap.icon] || Cpu;
              return (
                <Reveal key={cap.title} delay={(i % 3) * 90}>
                  <div className="group h-full rounded-[20px] border border-white/8 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-colors hover:-translate-y-1 duration-300">
                    <span
                      className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-5 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${c}1f`, color: pillar.colorSoft }}
                    >
                      <Icon size={22} />
                    </span>
                    <h3 className="font-display font-bold text-lg mb-2">{cap.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed">{cap.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="font-mono-label text-[11px] mb-6" style={{ color: pillar.colorSoft }}>How we work</p>
            <h2 className="hs-heading text-[32px] sm:text-[52px] max-w-[16ch]">
              A method built to compound value.
            </h2>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillar.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 90}>
                <div className="relative h-full rounded-[20px] border border-white/8 bg-white/[0.02] p-7">
                  <span className="hs-heading text-5xl opacity-15" style={{ color: c }}>{step.step}</span>
                  <h3 className="font-display font-bold text-lg mt-4 mb-2">{step.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
                  <span className="absolute top-7 right-7 w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="py-24 bg-[#0f1526]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative rounded-[24px] overflow-hidden border border-white/8">
              <img src={pillar.heroImage} alt={pillar.title} className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c}44, transparent)` }} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-mono-label text-[11px] mb-6" style={{ color: pillar.colorSoft }}>What we deliver</p>
            <h2 className="hs-heading text-[32px] sm:text-[46px] mb-8">Outcomes that speak.</h2>
            <ul className="space-y-4">
              {pillar.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3.5">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c}22`, color: pillar.colorSoft }}>
                    <Check size={14} />
                  </span>
                  <span className="text-white/75 leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* OTHER PILLARS */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="font-mono-label text-[11px] text-[#3b82f6] mb-6">Explore more</p>
            <h2 className="hs-heading text-[30px] sm:text-[46px] mb-12">The other pillars.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <button
                  onClick={() => navigate(`/pillar/${p.slug}`)}
                  className="group w-full text-left rounded-[22px] border border-white/8 overflow-hidden relative h-[220px]"
                  style={{ backgroundColor: p.color }}
                >
                  <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${p.color}ee, ${p.color}55)` }} />
                  <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                    <p className="font-mono-label text-[10px] text-white/80">{p.tag}</p>
                    <div className="flex items-end justify-between">
                      <h3 className="font-display font-extrabold text-white text-2xl max-w-[10ch]">{p.title} – {p.subtitle}</h3>
                      <span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#0a0e1a] group-hover:rotate-45 transition-transform">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="relative rounded-[28px] overflow-hidden border border-white/8 p-12 lg:p-16 text-center" style={{ background: `linear-gradient(135deg, ${c}22, #0f1526 60%)` }}>
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30" style={{ backgroundColor: c }} />
              <div className="relative z-10">
                <h2 className="hs-heading text-[34px] sm:text-[56px] max-w-[18ch] mx-auto">
                  The next ascent starts with {pillar.title}.
                </h2>
                <Link
                  to="/#contact"
                  className="group mt-10 inline-flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-full transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: c }}
                >
                  Partner with us
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PillarPage;
