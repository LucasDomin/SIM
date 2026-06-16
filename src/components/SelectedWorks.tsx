import { useLang } from "../contexts/LanguageContext";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";
import { Reveal, SectionLabel } from "./ui";
import { cn } from "../lib/cn";

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
        {label}
      </div>
      <div className="mt-1 text-[13px] text-noir-100">{value}</div>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}) {
  const { t } = useLang();
  const flip = index % 2 === 1;

  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Image */}
      <button
        onClick={() => onOpen(project.slug)}
        className={cn(
          "group relative block w-full overflow-hidden rounded-sm lg:col-span-7",
          flip && "lg:order-2"
        )}
        style={{ aspectRatio: "16 / 10" }}
        aria-label={`${project.title} — ${t.works.view}`}
      >
        <img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/85 via-noir-950/10 to-transparent opacity-90" />

        {/* big index */}
        <span className="pointer-events-none absolute right-4 top-3 font-display text-[5rem] leading-none text-cream/15 md:text-[7rem]">
          {project.id}
        </span>

        {/* play affordance */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 translate-y-3 items-center justify-center rounded-full border border-cream/40 bg-noir-950/30 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:h-20 md:w-20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-cream md:scale-110">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {/* bottom title overlay (mobile-first legibility) */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-accent">
              {project.category} · {project.client}
            </div>
            <div className="mt-1 font-display text-3xl text-cream md:text-5xl">
              {project.title}
            </div>
          </div>
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors group-hover:text-accent md:block">
            {t.works.view} →
          </span>
        </div>
      </button>

      {/* Text column */}
      <div className={cn("lg:col-span-5", flip && "lg:order-1")}>
        <p className="max-w-md text-pretty text-sm leading-relaxed text-noir-300 md:text-base">
          {project.description}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-y-5 sm:grid-cols-2">
          <MetaCell label="Client" value={project.client} />
          <MetaCell label="Year" value={project.year} />
          <MetaCell label="Location" value={project.location} />
          <MetaCell label="Format" value={project.format} />
        </div>

        {project.awards && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.awards.map((a) => (
              <span
                key={a}
                className="rounded-full border border-noir-600 px-3 py-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-300"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function SelectedWorks({ onOpen }: { onOpen: (slug: string) => void }) {
  const { t } = useLang();
  return (
    <section id="works" className="relative bg-noir-950 py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 border-b border-noir-800 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02">{t.works.label}</SectionLabel>
            <h2 className="mt-5 font-display text-[10vw] font-light leading-[0.95] tracking-[-0.02em] text-cream md:text-[4.6vw]">
              {t.works.title}
            </h2>
          </div>
          <p className="max-w-xs text-pretty text-sm text-noir-400 md:text-right">
            {t.works.desc}
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
