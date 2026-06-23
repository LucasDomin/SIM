import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

/**
 * ParallaxMarquee — mantém o enunciado "A resposta continua sendo"
 * e substitui apenas o "SIM" pela logo da marca, sem barra.
 */
export function ParallaxMarquee({
  text = "A resposta continua sendo SIM",
}: {
  text?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [beforeSim, afterSim = ""] = text.split("SIM");

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

  const Unit = ({ outline = false }: { outline?: boolean }) => (
    <div className="flex shrink-0 items-end gap-4 md:gap-6">
      <span
        className="font-display text-[12vw] font-light leading-[0.9] tracking-[-0.02em] md:text-[8vw]"
        style={
          outline
            ? {
                WebkitTextStroke: "1px rgba(244,241,236,0.38)",
                color: "transparent",
              }
            : undefined
        }
      >
        {beforeSim}
      </span>
      <div className={outline ? "opacity-35" : ""}>
        <Logo
          noBar
          className={`!h-auto w-[22vw] md:w-[14vw] ${outline ? "text-noir-100" : "text-cream"}`}
        />
      </div>
      {afterSim ? (
        <span
          className="font-display text-[12vw] font-light leading-[0.9] tracking-[-0.02em] md:text-[8vw]"
          style={
            outline
              ? {
                  WebkitTextStroke: "1px rgba(244,241,236,0.38)",
                  color: "transparent",
                }
              : undefined
          }
        >
          {afterSim}
        </span>
      ) : null}
    </div>
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-noir-850 bg-noir-950 py-20 md:py-28"
      aria-label={text}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div
        className="mask-fade-x"
        style={{ transform: `translateX(${shift * -16}%)`, willChange: "transform" }}
      >
        <div className="animate-marquee flex w-max items-end gap-14 md:gap-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <Unit key={`outline-${i}`} outline />
          ))}
        </div>
      </div>

      <div
        className="mask-fade-x -mt-[2vw]"
        style={{ transform: `translateX(${shift * 16}%)`, willChange: "transform" }}
      >
        <div
          className="animate-marquee-slow flex w-max items-end gap-14 md:gap-20"
          style={{ animationDirection: "reverse" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Unit key={`fill-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
