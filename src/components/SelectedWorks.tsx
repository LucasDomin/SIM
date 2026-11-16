import { useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useAdmin } from "../contexts/AdminContext";
import { useSiteData } from "../hooks/useSiteData";
import type { Project } from "../data/defaults";
import { Reveal, SectionLabel } from "./ui";
import { FramesStrip } from "./FramesReel";
import { Clients } from "./Clients";
import { HoverVideoPlayer } from "./HoverVideoPlayer";
import { isYouTube } from "../lib/youtube";
import { cn } from "../lib/cn";
import { categoryLabel } from "../lib/labels";

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
  const { t, lang } = useLang();
  const { getProject } = useAdmin();
  const merged = getProject(project);
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
        aria-label={`${merged.title} — ${t.works.view}`}
      >
        {merged.video && (merged.poster || isYouTube(merged.video)) ? (
          <HoverVideoPlayer
            videoUrl={merged.video}
            posterUrl={merged.poster || undefined}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <img
            src={merged.cover}
            alt={merged.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/85 via-noir-950/10 to-transparent opacity-90" />

        {/* big index — aligned left to match text layout */}
        <span className="pointer-events-none absolute left-4 top-3 font-display text-[5rem] leading-none text-cream/15 md:text-[7rem]">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* play affordance */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 translate-y-3 items-center justify-center rounded-full border border-cream/40 bg-noir-950/30 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:h-20 md:w-20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-cream md:scale-110">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {/* bottom title overlay — all text aligned left */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-start gap-4 p-5 md:p-7">
          <div className="text-left">
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-accent">
              {categoryLabel(merged.category, lang)} · {merged.client}
            </div>
            <div className="mt-1 font-display text-3xl text-cream md:text-5xl">
              {merged.title}
            </div>
          </div>
          <span className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors group-hover:text-accent md:block">
            {t.works.view} →
          </span>
        </div>
      </button>

      {/* Text column */}
      <div className={cn("text-left lg:col-span-5", flip && "lg:order-1")}>
        <p className="max-w-md text-sm leading-relaxed text-noir-300 md:text-base">
          {merged.description}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-y-5 sm:grid-cols-2">
          <MetaCell label={lang === "en" ? "Client" : "Cliente"} value={merged.client} />
          <MetaCell label={lang === "en" ? "Year" : "Ano"} value={merged.year} />
          <MetaCell label={lang === "en" ? "Location" : "Local"} value={merged.location} />
          <MetaCell label={lang === "en" ? "Format" : "Formato"} value={merged.format} />
        </div>

        {merged.awards && (
          <div className="mt-6 flex flex-wrap gap-2">
            {merged.awards.map((a) => (
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

/** Card vertical (9:16) da aba Social: prévia no hover, abre o vídeo ao clicar. */
function SocialCard({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const { getProject } = useAdmin();
  const p = getProject(project);
  return (
    <Reveal>
      <button
        onClick={() => onOpen(project.slug)}
        className="group relative block w-full overflow-hidden rounded-sm text-left"
        style={{ aspectRatio: "9 / 16" }}
        aria-label={p.title}
      >
        {p.video ? (
          <HoverVideoPlayer
            videoUrl={p.video}
            posterUrl={p.poster || p.cover || undefined}
            aspectRatio="9 / 16"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <img src={p.cover} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir-950/90 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
          <div className="font-mono text-[9px] uppercase tracking-wide2 text-accent">{p.client}</div>
          <div className="mt-1 font-display text-xl font-light leading-tight text-cream md:text-2xl">{p.title}</div>
        </div>
      </button>
    </Reveal>
  );
}

export function SelectedWorks({ onOpen }: { onOpen: (slug: string) => void }) {
  const { t, lang } = useLang();
  const { projects: all } = useSiteData();
  const projects = all.filter((p) => p.category !== "Social");
  const social = all.filter((p) => p.category === "Social");
  const [tab, setTab] = useState<"films" | "social">("films");
  const showSocial = tab === "social" && social.length > 0;
  return (
    <section id="works" className="relative bg-noir-950 pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 border-b border-noir-800 pb-10">
          <div className="text-left">
            <SectionLabel index="02">{t.works.label}</SectionLabel>
            <h2 className="mt-5 font-display text-[10vw] font-light leading-[0.95] tracking-[-0.02em] text-cream md:text-[4.6vw]">
              {t.works.title}
            </h2>
          </div>
          <p className="max-w-xs text-left text-sm text-noir-400">
            {t.works.desc}
          </p>
        </Reveal>

        {social.length > 0 && (
          <div className="mt-10 flex gap-2" role="tablist">
            {([
              ["films", lang === "en" ? "Films" : "Filmes", projects.length],
              ["social", "Social", social.length],
            ] as const).map(([key, label, n]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={cn(
                  "rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-wide2 transition-colors",
                  tab === key
                    ? "border-accent bg-accent/10 text-cream"
                    : "border-noir-700 text-noir-400 hover:border-noir-500 hover:text-cream"
                )}
              >
                {label} <span className="ml-1 text-noir-500">{n}</span>
              </button>
            ))}
          </div>
        )}

        {showSocial ? (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {social.map((p) => (
              <SocialCard key={p.slug} project={p} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col gap-10 md:gap-14">
            {projects.map((p, i) => (
              <ProjectRow key={p.slug} project={p} index={i} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>

      {/* Filmstrip embutido (antes seção 03 Galeria) — agora parte do bloco 02 */}
      <div className="mt-16 md:mt-20">
        <FramesStrip />
      </div>

      <div className="mt-12 md:mt-16">
        <Clients />
      </div>
    </section>
  );
}
