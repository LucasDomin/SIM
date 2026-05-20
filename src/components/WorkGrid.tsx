import { useState } from "react";
import { projects, type Project } from "../data/projects";
import { useReveal } from "../hooks/useReveal";

type Props = {
  onOpen: (p: Project) => void;
  variant?: "home" | "full";
};

const filters = ["All", "Film", "Editorial", "Brand", "Documentary", "Fashion"] as const;

export default function WorkGrid({ onOpen, variant = "home" }: Props) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const list = active === "All" ? projects : projects.filter((p) => p.category === active);
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="work" className="bg-noir-950 py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div ref={headRef} className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
              · 01 / Selected Work
            </p>
            <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] text-noir-50 text-balance">
              Casos selecionados
              <br />
              <em className="italic text-noir-400">do nosso arquivo.</em>
            </h2>
          </div>
          {variant === "full" && (
            <div className="flex flex-wrap gap-1.5 glass-light rounded-full p-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`px-4 py-1.5 rounded-full text-[12px] tracking-wide transition-all ${
                    active === f
                      ? "bg-noir-50 text-noir-900"
                      : "text-noir-300 hover:text-noir-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {list.map((p, i) => {
            const layouts = [
              "md:col-span-7 md:row-span-2",
              "md:col-span-5",
              "md:col-span-5",
              "md:col-span-7",
              "md:col-span-6",
              "md:col-span-6",
            ];
            const aspect = i === 0 ? "aspect-[4/5] md:aspect-auto md:h-[680px]" : "aspect-[4/3]";
            return <Card key={p.id} project={p} className={layouts[i % layouts.length]} aspect={aspect} index={i} onOpen={onOpen} />;
          })}
        </div>
      </div>
    </section>
  );
}

function Card({
  project,
  className,
  aspect,
  index,
  onOpen,
}: {
  project: Project;
  className: string;
  aspect: string;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      className={`reveal group relative overflow-hidden cursor-pointer ${className} ${aspect}`}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(project)}
    >
      <div className="absolute inset-0 bg-noir-800 overflow-hidden rounded-sm">
        <img
          src={project.cover}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-[1400ms] ease-out ${
            hover ? "scale-[1.06] brightness-95" : "scale-100 brightness-75"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/30 to-transparent" />
      </div>

      {/* Top meta */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-noir-100/80">
        <span className="glass px-2.5 py-1 rounded-full">{project.category}</span>
        <span className="opacity-70">{project.id}</span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-300 mb-2">
              {project.client} · {project.year}
            </p>
            <h3 className="font-display text-3xl md:text-5xl text-noir-50 tracking-[-0.02em] leading-[0.95]">
              {project.title}
            </h3>
            <p
              className={`mt-2 text-sm text-noir-200/80 max-w-md transition-all duration-700 ${
                hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              {project.subtitle}
            </p>
          </div>
          <div
            className={`w-11 h-11 rounded-full border border-noir-100/30 flex items-center justify-center shrink-0 transition-all duration-500 ${
              hover ? "bg-noir-50 border-noir-50" : "bg-transparent"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 6h10m-4-4 4 4-4 4"
                stroke={hover ? "#0a0a0a" : "#f5f5f6"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
