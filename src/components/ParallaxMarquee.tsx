import { useEffect, useRef, useState } from "react";

/**
 * ParallaxMarquee — letreiro com texto em parallax.
 * Usado para frases de impacto entre seções.
 */
export function ParallaxMarquee({
  text = "A resposta continua sendo SIM",
}: {
  text?: string;
}) {
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

  const unit = `${text} \u00A0·\u00A0 `;
  const run = unit.repeat(6);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-noir-850 bg-noir-950 py-16 md:py-24"
      aria-label={text}
    >
      {/* glow rail */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Linha 1 — contorno, parallax para a esquerda */}
      <div
        className="mask-fade-x"
        style={{ transform: `translateX(${shift * -16}%)`, willChange: "transform" }}
      >
        <div className="animate-marquee flex w-max whitespace-nowrap">
          <span
            className="font-display text-[15vw] font-light leading-[0.9] tracking-[-0.02em] md:text-[11vw]"
            style={{
              WebkitTextStroke: "1px rgba(244,241,236,0.45)",
              color: "transparent",
            }}
          >
            {run}
          </span>
        </div>
      </div>

      {/* Linha 2 — preenchida, parallax para a direita (oposta) */}
      <div
        className="mask-fade-x -mt-[2vw]"
        style={{ transform: `translateX(${shift * 16}%)`, willChange: "transform" }}
      >
        <div className="animate-marquee-slow flex w-max whitespace-nowrap" style={{ animationDirection: "reverse" }}>
          <span className="font-display text-[15vw] font-light italic leading-[0.9] tracking-[-0.02em] text-cream md:text-[11vw]">
            {run}
          </span>
        </div>
      </div>
    </section>
  );
}
