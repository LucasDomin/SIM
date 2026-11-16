import { useCallback, useEffect, useState } from "react";
import { photoSets, type Photo } from "../data/photos";
import { useLang } from "../contexts/LanguageContext";

/** Galeria em colunas (masonry) com visualização em tela cheia. */
export function PhotoGallery() {
  const { lang } = useLang();
  const all: (Photo & { set: string })[] = photoSets.flatMap((s) =>
    s.photos.map((p) => ({ ...p, set: `${s.title} · ${s.client}` }))
  );
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + all.length) % all.length)),
    [all.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <div className="mt-12">
      {photoSets.map((s) => (
        <div key={s.slug} className="mb-6 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-wide2">
          <span className="text-accent">{s.title}</span>
          <span className="text-noir-500">{s.client} · {s.year}</span>
        </div>
      ))}

      <div className="columns-2 gap-3 md:columns-3 md:gap-5">
        {all.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setOpen(i)}
            className="group mb-3 block w-full overflow-hidden rounded-sm md:mb-5"
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
            aria-label={`${p.set} — ${lang === "en" ? "photo" : "foto"} ${i + 1}`}
          >
            <img
              src={p.src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-noir-950/95 backdrop-blur-sm fade-in"
          onClick={close}
        >
          <img
            src={all[open].src}
            alt=""
            className="max-h-[88vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-noir-600 bg-noir-950/60 px-4 py-3 text-cream hover:border-accent md:left-8"
            aria-label={lang === "en" ? "Previous" : "Anterior"}
          >
            ←
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-noir-600 bg-noir-950/60 px-4 py-3 text-cream hover:border-accent md:right-8"
            aria-label={lang === "en" ? "Next" : "Próxima"}
          >
            →
          </button>
          <button
            onClick={close}
            className="absolute right-5 top-5 rounded-full border border-noir-600 bg-noir-950/60 px-3 py-1.5 font-mono text-[11px] uppercase text-cream hover:border-accent"
            aria-label={lang === "en" ? "Close" : "Fechar"}
          >
            ✕
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wide2 text-noir-400">
            {all[open].set} · {open + 1}/{all.length}
          </div>
        </div>
      )}
    </div>
  );
}
