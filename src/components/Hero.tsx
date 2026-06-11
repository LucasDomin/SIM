import { useEffect, useRef, useState } from "react";

type Props = {
  onCTA: (page: string) => void;
};

const heroImages = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2800&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2800&q=85",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=2800&q=85",
];

export default function Hero({ onCTA }: Props) {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const tick = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 6000;
      setProgress(Math.min(elapsed, 1));
      if (elapsed >= 1) {
        setIdx((i) => (i + 1) % heroImages.length);
        startRef.current = Date.now();
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [idx]);

  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-noir-950">
      {/* Image stack */}
      {heroImages.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            key={`${src}-${idx === i ? "active" : "idle"}`}
            src={src}
            alt=""
            className={`w-full h-full object-cover ${i === idx ? "animate-slow-zoom" : ""}`}
          />
        </div>
      ))}

      {/* Vignette + gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir-950/70 via-noir-950/20 to-noir-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]" />

      {/* Letterbox: topo em degradê suave, base sólida */}
      <div className="absolute inset-x-0 top-0 h-[22vh] z-10 bg-gradient-to-b from-noir-950 via-noir-950/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[6vh] bg-noir-950 z-10" />



      {/* Content */}
      <div className="relative z-20 h-full flex flex-col">
        <div className="flex-1 flex items-end pb-16 md:pb-24">
          <div className="w-full max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="max-w-4xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-6 fade-up">
                Cinematic Photography · Audiovisual Studio
              </p>
              <h1
                className="font-display text-[14vw] md:text-[8.5vw] leading-[0.92] tracking-[-0.03em] text-noir-50 fade-up text-balance"
                style={{ animationDelay: "120ms" }}
              >
                Capturas que <em className="italic text-accent">permanecem</em>
                <br />
                em movimento.
              </h1>
              <p
                className="mt-8 max-w-xl text-base md:text-lg text-noir-200/80 leading-relaxed fade-up text-pretty"
                style={{ animationDelay: "240ms" }}
              >
                Estúdio independente dedicado à fotografia editorial e ao cinema de marca para
                clientes que entendem o valor do detalhe.
              </p>

              <div
                className="mt-10 flex flex-wrap items-center gap-4 fade-up"
                style={{ animationDelay: "360ms" }}
              >
                <button
                  onClick={() => onCTA("work")}
                  className="group flex items-center gap-3 bg-noir-50 text-noir-900 rounded-full pl-6 pr-2 py-2 hover:bg-accent transition-colors duration-500"
                >
                  <span className="text-[13px] tracking-wide font-medium">Assistir reel</span>
                  <span className="w-9 h-9 rounded-full bg-noir-900 flex items-center justify-center group-hover:bg-noir-950 transition">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 1l6 4-6 4V1z" fill="#f5f5f6" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => onCTA("estimate")}
                  className="text-[13px] tracking-wide text-noir-100 border-b border-noir-100/30 hover:border-accent hover:text-accent transition-colors pb-1"
                >
                  Solicitar orçamento inteligente →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom progress + ticker */}
        <div className="relative z-10 px-5 md:px-10 pb-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              {heroImages.map((_, i) => (
                <div key={i} className="flex-1 h-px bg-noir-100/15 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-noir-50"
                    style={{
                      width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%",
                      transition: i === idx ? "width 50ms linear" : "width 600ms ease",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-noir-300/70">
              <span>{["Atlas · 2025", "Noctilucent · 2024", "Kintsugi · 2024"][idx]}</span>
              <span className="hidden md:inline">Scroll to discover ↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
