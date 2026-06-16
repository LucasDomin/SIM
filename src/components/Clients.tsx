import { useLang } from "../contexts/LanguageContext";
import { clients } from "../data/projects";
import { Reveal, SectionLabel } from "./ui";

export function Clients() {
  const { t } = useLang();
  const loop = [...clients, ...clients];

  return (
    <section className="relative overflow-hidden border-y border-noir-850 bg-noir-900 py-16 md:py-20">
      <div className="mx-auto mb-8 max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <SectionLabel index="05">{t.clients.label}</SectionLabel>
        </Reveal>
      </div>

      <div className="group mask-fade-x overflow-hidden">
        <div className="animate-marquee group-hover:[animation-play-state:paused] flex w-max items-center gap-10 pr-10">
          {loop.map((c, i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="whitespace-nowrap font-display text-3xl font-light text-noir-200 transition-colors hover:text-cream md:text-4xl">
                {c}
              </span>
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-accent/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
