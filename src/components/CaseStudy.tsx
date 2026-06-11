import { useEffect, useState } from "react";
import type { Project } from "../data/projects";
import { useCMS } from "../hooks/useCMS";

type Props = { project: Project | null; onClose: () => void };

export default function CaseStudy({ project, onClose }: Props) {
  const { m } = useCMS();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (project) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [project]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 400);
  };

  if (!project) return null;
  const cover = m(`project.${project.slug}.cover`, project.cover);
  const stills = project.stills.map((still, index) => m(`project.${project.slug}.still.${index + 1}`, still));

  return (
    <div className={`fixed inset-0 z-[80] transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-noir-950" onClick={handleClose} />
      <div className="relative h-full overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 glass border-b border-noir-100/5">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">
                Case · {project.id}
              </span>
              <span className="h-3 w-px bg-noir-100/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                {project.category}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-[12px] tracking-wide text-noir-200 hover:text-noir-50 transition"
            >
              <span>Fechar</span>
              <span className="w-7 h-7 rounded-full border border-noir-100/15 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="relative h-[80svh] min-h-[520px] w-full overflow-hidden">
          <img src={cover} alt={project.title} className="w-full h-full object-cover animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4 fade-up">
                {project.client} · {project.location} · {project.year}
              </p>
              <h1 className="font-display text-[14vw] md:text-[9vw] leading-[0.9] tracking-[-0.03em] text-noir-50 fade-up text-balance" style={{ animationDelay: "100ms" }}>
                {project.title}
              </h1>
              <p className="mt-4 font-display italic text-2xl md:text-3xl text-noir-200 fade-up" style={{ animationDelay: "220ms" }}>
                {project.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4 space-y-8">
              {[
                ["Cliente", project.client],
                ["Ano", project.year],
                ["Local", project.location],
                ["Formato", project.format],
                ...(project.duration ? [["Duração", project.duration]] : []),
              ].map(([k, v]) => (
                <div key={k} className="border-b border-noir-100/8 pb-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 mb-1">{k}</div>
                  <div className="text-noir-50 text-[15px]">{v}</div>
                </div>
              ))}
            </div>
            <div className="md:col-span-8">
              <p className="font-display text-2xl md:text-4xl leading-[1.25] text-noir-100 text-balance">
                {project.description}
              </p>

              {project.awards && (
                <div className="mt-12">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Awards</div>
                  <ul className="space-y-2">
                    {project.awards.map((a) => (
                      <li key={a} className="text-noir-200 text-lg">— {a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stills gallery */}
        <div className="space-y-1 px-1 md:px-2">
          {stills.map((s, i) => (
            <div key={s} className={`relative ${i % 2 === 0 ? "md:pr-32" : "md:pl-32"}`}>
              <div className="aspect-[16/9] overflow-hidden">
                <img src={s} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 px-2 py-3 flex justify-between">
                <span>Still · {String(i + 1).padStart(2, "0")}</span>
                <span>{project.title} · {project.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
                · Credits
              </p>
              <h3 className="font-display text-4xl md:text-5xl text-noir-50 tracking-[-0.02em]">
                Equipa
              </h3>
            </div>
            <div className="md:col-span-8">
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                {project.credits.map((c) => (
                  <div key={c.role} className="flex items-baseline justify-between border-b border-noir-100/8 pb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">
                      {c.role}
                    </span>
                    <span className="text-noir-50 text-[15px]">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-noir-100/5 bg-noir-900 py-20">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
              Próxima conversa
            </p>
            <h3 className="font-display text-4xl md:text-6xl text-noir-50 tracking-[-0.02em] text-balance">
              Vamos criar algo <em className="italic">memorável</em>.
            </h3>
            <button
              onClick={handleClose}
              className="mt-8 inline-flex items-center gap-3 bg-noir-50 text-noir-900 rounded-full pl-5 pr-2 py-2 hover:bg-accent transition"
            >
              <span className="text-[13px] tracking-wide font-medium">Iniciar projeto</span>
              <span className="w-8 h-8 rounded-full bg-noir-900 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 12 12">
                  <path d="M1 6h10m-4-4 4 4-4 4" stroke="#f5f5f6" strokeWidth="1.2" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
