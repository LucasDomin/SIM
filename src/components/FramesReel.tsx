import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { SprocketStrip } from "./ui";

type FilmstripItem = {
  id: string;
  url: string;
  title: string;
  position: number;
};

// Lightbox
function Lightbox({ item, onClose }: { item: FilmstripItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-noir-950/98 backdrop-blur-md fade-in"
      onClick={onClose}
    >
      {/* Barra superior */}
      <div
        className="flex shrink-0 items-center justify-between border-b border-noir-800 px-6 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-[11px] uppercase tracking-wide2 text-cream">
          {item.title || "—"}
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

      {/* Imagem — ocupa o espaço restante sem cortar */}
      <div
        className="flex flex-1 items-center justify-center p-6"
        onClick={onClose}
      >
        <img
          src={item.url}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

const STILL_W = 320;

function Reel({
  items,
  reverse = false,
  onClickItem,
}: {
  items: FilmstripItem[];
  reverse?: boolean;
  onClickItem: (item: FilmstripItem) => void;
}) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

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
          {loop.map((item, i) => (
            <figure
              key={i}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-sm border border-noir-800 transition-transform duration-300 hover:scale-[1.02]"
              style={{ width: STILL_W, height: STILL_W * 0.62 }}
              onClick={() => onClickItem(item)}
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 hover:grayscale-0 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 to-transparent opacity-70" />
              {item.title && (
                <figcaption className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-wide2 text-cream/80">
                  {item.title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FramesStrip() {
  const [items, setItems] = useState<FilmstripItem[]>([]);
  const [lightbox, setLightbox] = useState<FilmstripItem | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from("filmstrip")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as FilmstripItem[]);
      });
  }, []);

  // Divide em duas fileiras
  const half = Math.ceil(items.length / 2);
  const row1 = items.slice(0, half);
  const row2 = items.slice(half);

  return (
    <>
      <div className="relative overflow-hidden">
        <SprocketStrip className="mb-4" />
        <div className="mask-fade-x space-y-4">
          <Reel items={row1.length > 0 ? row1 : items} onClickItem={setLightbox} />
          <Reel items={row2.length > 0 ? row2 : items} reverse onClickItem={setLightbox} />
        </div>
        <SprocketStrip className="mt-4" />
      </div>

      {lightbox && (
        <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
