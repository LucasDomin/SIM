import { useEffect, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { Reveal, SectionLabel, SpectrumBar } from "./ui";

export function Manifesto() {
  const { t } = useLang();
  const [phase, setPhase] = useState<"still" | "move">("still");

  useEffect(() => {
    const id = setInterval(
      () => setPhase((p) => (p === "still" ? "move" : "still")),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="manifesto"
      className="relative bg-noir-950 pt-20 pb-16 md:pt-28 md:pb-20"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-noir-700 to-transparent lg:block" />
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <SectionLabel index="01">{t.manifesto.label}</SectionLabel>
        </Reveal>
        <div className="mt-12 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display font-light leading-tight tracking-[-0.02em] text-cream text-[11vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[5.5vw]">
              <span className="block">{t.manifesto.lead.split(" ")[0]}</span>
              <span className="block italic text-accent">
                {t.manifesto.lead.split(" ").slice(1).join(" ")}.
              </span>
            </h2>
            <div className="relative mt-8 inline-grid grid-cols-2 rounded-full border border-noir-700 p-1 font-mono text-[10px] uppercase tracking-wide2">
              {/* pílula com as cores da marca — desliza entre STILL e MOVEMENT */}
              <span
                aria-hidden
                className="sim-spectrum-flow absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: phase === "move" ? "translateX(100%)" : "translateX(0)" }}
              />
              <span
                className={`relative z-10 px-5 py-2 text-center transition-colors duration-700 ${
                  phase === "still" ? "text-noir-950" : "text-noir-400"
                }`}
              >
                {t.manifesto.toggleStill}
              </span>
              <span
                className={`relative z-10 px-5 py-2 text-center transition-colors duration-700 ${
                  phase === "move" ? "text-noir-950" : "text-noir-400"
                }`}
              >
                {t.manifesto.toggleMove}
              </span>
            </div>
            {/* MOVEMENT: degradê com as cores da marca correndo em loop */}
            <style>{`
              .sim-spectrum-flow {
                background-image: linear-gradient(90deg, #996ea7, #e45a58, #ea8d11, #fac421, #33ae74, #2894d1, #b1b7b1, #f4c78d, #996ea7);
                background-size: 200% 100%;
                animation: sim-spectrum-flow 3.2s linear infinite;
                box-shadow: 0 0 18px rgba(250, 196, 33, 0.25);
              }
              @keyframes sim-spectrum-flow {
                from { background-position: 0% 50%; }
                to { background-position: 200% 50%; }
              }
              @media (prefers-reduced-motion: reduce) {
                .sim-spectrum-flow { animation: none; }
              }
            `}</style>
          </div>
          <div className="flex flex-col justify-end gap-7 lg:col-span-5">
            <Reveal>
              <p className="max-w-xl text-pretty text-left text-base leading-relaxed text-noir-200 md:text-lg">
                {t.manifesto.body}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-xl text-pretty text-left text-sm leading-relaxed text-noir-300 md:text-base">
                {t.manifesto.body2}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <SpectrumBar glow animate height="h-[4px]" className="mt-4 max-w-xs" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
