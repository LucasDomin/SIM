import { useState } from "react";
import { useSiteData } from "../hooks/useSiteData";
import { SprocketStrip } from "./ui";
import type { Still } from "../data/defaults";

const STILL_W = 320;

// Lightbox
function Lightbox({ still, onClose }: { still: Still; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-noir-950/95 backdrop-blur-md fade-in"
      onClick={onClose}
    >
      {/* Barra superior com nome */}
      <div className="flex items-center justify-between border-b border-noir-800 px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-[11px] uppercase tracking-wide2 text-cream">
          {still.title || "—"}
        </span>
        <button
          onClick={onClose}
          className="rounded-full border border-noir-700 p-2 text-noir-400 transition-colors hover:border-noir-500 hover:text-cream"
          aria-label="Fechar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Imagem em tela cheia */}
      <div className="flex flex-1 items-center justify-center p-6">
        <img
          src={still.url}
          alt={still.title}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

function Reel({ reverse = false, onClickStill }: { reverse?: boolean; onClickStill: (s: Still) => void }) {
  const { projects } = useSiteData();

  const stills: (Still & { color: string })[] = projects.flatMap((p) =>
    (p.stills ?? []).map((s) => ({
      url: typeof s === "string" ? s : s.url,
      title: typeof s === "string" ? p.title : (s.title || p.title),
      color: p.color,
    }))
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
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-sm border border-noir-800 transition-transform duration-300 hover:scale-[1.02]"
              style={{ width: STILL_W, height: STILL_W * 0.62 }}
              onClick={() => onClickStill(s)}
            >
              <img
                src={s.url}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 hover:grayscale-0 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 to-transparent opacity-70" />
              <figcaption className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-wide2 text-cream/80">
                {s.title}
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

export function FramesStrip() {
  const [lightbox, setLightbox] = useState<Still | null>(null);

  return (
    <>
      <div className="relative overflow-hidden">
        <SprocketStrip className="mb-4" />
        <div className="mask-fade-x space-y-4">
          <Reel onClickStill={setLightbox} />
          <Reel reverse onClickStill={setLightbox} />
        </div>
        <SprocketStrip className="mt-4" />
      </div>

      {lightbox && (
        <Lightbox still={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
