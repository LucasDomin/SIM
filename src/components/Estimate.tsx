import { useMemo, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { Reveal, SectionLabel, SpectrumBar } from "./ui";
import { cn } from "../lib/cn";

const TYPES = [
  { id: "brand", labelPT: "Cinema de Marca", labelEN: "Brand Cinema", base: 12000 },
  { id: "editorial", labelPT: "Editorial", labelEN: "Editorial", base: 4500 },
  { id: "doc", labelPT: "Documentário", labelEN: "Documentary", base: 9000 },
  { id: "fashion", labelPT: "Fashion Film", labelEN: "Fashion Film", base: 7500 },
];

const ADDONS = [
  { id: "color", labelPT: "Color grading", labelEN: "Color grading", price: 1800 },
  { id: "sound", labelPT: "Sound design", labelEN: "Sound design", price: 2200 },
  { id: "drone", labelPT: "Aéreo / drone", labelEN: "Aerial / drone", price: 1500 },
  { id: "stills", labelPT: "Set fotográfico", labelEN: "Photo stills set", price: 2000 },
];

const DAY_RATE = 2500;

export function Estimate() {
  const { t, lang } = useLang();
  const [type, setType] = useState(TYPES[0]);
  const [days, setDays] = useState(2);
  const [picked, setPicked] = useState<string[]>(["color"]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const total = useMemo(() => {
    const addons = ADDONS.filter((a) => picked.includes(a.id)).reduce(
      (s, a) => s + a.price,
      0
    );
    return type.base + days * DAY_RATE + addons;
  }, [type, days, picked]);

  const fmt = (n: number) => n.toLocaleString(lang === "pt" ? "pt-PT" : "en-US");

  return (
    <section id="estimate" className="relative overflow-hidden bg-noir-950 py-24 md:py-36">
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="07">{t.estimate.label}</SectionLabel>
              <h2 className="mt-5 font-display text-[10vw] font-light leading-[0.95] tracking-[-0.02em] text-cream md:text-[4.6vw]">
                {t.estimate.title}
              </h2>
              <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-noir-400 md:text-base">
                {t.estimate.desc}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10 hidden lg:block">
              <SpectrumBar animate className="max-w-[200px]" />
            </Reveal>
          </div>

          {/* Calculator */}
          <Reveal className="lg:col-span-7" delay={80}>
            <div className="glass rounded-sm p-6 md:p-9">
              {/* Type */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                  {lang === "pt" ? "Tipo de projeto" : "Project type"}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TYPES.map((tp) => (
                    <button
                      key={tp.id}
                      onClick={() => setType(tp)}
                      className={cn(
                        "rounded-sm border px-3 py-3 text-left text-[12px] transition-all",
                        type.id === tp.id
                          ? "border-accent bg-accent/10 text-cream"
                          : "border-noir-700 text-noir-300 hover:border-noir-500"
                      )}
                    >
                      <div className="font-display text-base leading-tight">
                        {lang === "pt" ? tp.labelPT : tp.labelEN}
                      </div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                        {t.estimate.currency}
                        {tp.base.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Days */}
              <div className="mt-7">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                    {lang === "pt" ? "Dias de produção" : "Production days"}
                  </div>
                  <div className="font-display text-2xl text-cream">{days}</div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--color-accent)]"
                  aria-label="Production days"
                />
              </div>

              {/* Add-ons */}
              <div className="mt-7">
                <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                  {lang === "pt" ? "Entregáveis" : "Deliverables"}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {ADDONS.map((a) => {
                    const on = picked.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggle(a.id)}
                        className={cn(
                          "flex items-center justify-between rounded-sm border px-3 py-3 text-left text-[12px] transition-all",
                          on
                            ? "border-accent bg-accent/10 text-cream"
                            : "border-noir-700 text-noir-300 hover:border-noir-500"
                        )}
                      >
                        <span>{lang === "pt" ? a.labelPT : a.labelEN}</span>
                        <span className="font-mono text-[10px] text-noir-500">
                          +{t.estimate.currency}
                          {a.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="mt-8 flex items-end justify-between border-t border-noir-700 pt-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                    {t.estimate.summary}
                  </div>
                  <div className="mt-1 font-display text-4xl font-light text-accent md:text-5xl">
                    {t.estimate.currency}
                    {fmt(total)}
                  </div>
                </div>
                <a
                  href={`mailto:hello@sim.studio?subject=${encodeURIComponent(
                    `${t.estimate.title} — ${lang === "pt" ? type.labelPT : type.labelEN}`
                  )}`}
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.03]"
                >
                  {t.estimate.cta}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
