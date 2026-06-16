import { useLang } from "../contexts/LanguageContext";
import { projects } from "../data/projects";
import { Reveal, SectionLabel, SprocketStrip } from "./ui";

const STILL_W = 320;

function Reel({ reverse = false }: { reverse?: boolean }) {
  // gather all stills with their project tint
  const stills = projects.flatMap((p) =>
    p.stills.map((s) => ({ src: s, title: p.title, color: p.color }))
  );
  const loop = [...stills, ...stills];

  return (
    <div className="group relative overflow-hidden">
      <div
        className={
          (reverse ? "animate-marquee-slow " : "animate-marquee ") +
          "group-hover:[animation-play-state:paused] flex gap-4"
        }
        style={{
          width: "max-content",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex gap-4">
          {loop.map((s, i) => (
            <figure
              key={i}
              className="relative shrink-0 overflow-hidden rounded-sm border border-noir-800"
              style={{ width: STILL_W, height: STILL_W * 0.62 }}
            >
              <img
                src={s.src}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 hover:grayscale-0 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 to-transparent opacity-70" />
              <figcaption className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-wide2 text-cream/80">
                {s.title}{" "}
                <span className="text-noir-400">
                  · {String((i % stills.length) + 1).padStart(2, "0")}
                </span>
              </figcaption>
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FramesReel() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden border-y border-noir-850 bg-noir-900 pt-12 pb-16 md:pt-16 md:pb-20">
      <div className="mx-auto mb-12 max-w-[1500px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03">{t.frames.label}</SectionLabel>
            <h2 className="mt-5 max-w-2xl font-display text-[8vw] font-light leading-[0.98] tracking-[-0.02em] text-cream md:text-[3.4vw]">
              {t.frames.title}
            </h2>
          </div>
          <p className="max-w-xs text-pretty text-sm text-noir-400 md:text-right">
            {t.frames.desc}
          </p>
        </Reveal>
      </div>

      <SprocketStrip className="mb-4" />
      <div className="mask-fade-x space-y-4">
        <Reel />
        <Reel reverse />
      </div>
      <SprocketStrip className="mt-4" />
    </section>
  );
}
