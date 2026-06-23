import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

function AnswerPhrase({ outline = false }: { outline?: boolean }) {
  return (
    <div className="flex shrink-0 items-baseline gap-[0.22em] whitespace-nowrap">
      <span
        className="font-display text-[12vw] font-light leading-[0.9] tracking-[-0.02em] md:text-[8vw]"
        style={
          outline
            ? { WebkitTextStroke: "1px rgba(244,241,236,0.42)", color: "transparent" }
            : undefined
        }
      >
        A resposta continua sendo
      </span>
      <Logo
        noBar
        outline={outline}
        className={`inline-block !h-auto w-[24vw] translate-y-[0.08em] md:w-[14vw] ${
          outline ? "text-cream/45" : "text-cream"
        }`}
      />
    </div>
  );
}

/**
 * ParallaxMarquee — letreiro com a logo SIM em parallax.
 * Usado para "A resposta continua sendo SIM" entre seções.
 */
export function ParallaxMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress =
          (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2);
        setShift(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-noir-850 bg-noir-950 py-20 md:py-28"
      aria-label="A resposta continua sendo SIM"
    >
      {/* glow rail */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Linha 1 — contorno (outline), parallax para a esquerda */}
      <div
        className="mask-fade-x"
        style={{ transform: `translateX(${shift * -16}%)`, willChange: "transform" }}
      >
        <div className="animate-marquee flex w-max items-center gap-16 md:gap-24">
          {Array.from({ length: 12 }).map((_, i) => (
            <AnswerPhrase key={`outline-${i}`} outline />
          ))}
        </div>
      </div>

      {/* Linha 2 — preenchida, parallax para a direita (oposta) */}
      <div
        className="mask-fade-x -mt-[3vw] md:-mt-[2vw]"
        style={{ transform: `translateX(${shift * 16}%)`, willChange: "transform" }}
      >
        <div className="animate-marquee-slow flex w-max items-center gap-16 md:gap-24" style={{ animationDirection: "reverse" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <AnswerPhrase key={`fill-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
