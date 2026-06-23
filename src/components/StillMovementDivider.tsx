import { useEffect, useRef, useState } from "react";
import { SpectrumBar } from "./ui";

/**
 * StillMovementDivider — divisor de seção (signature brand asset).
 *
 * Composição: STILL · [barra de cores] · MOVEMENT
 *  - barra central com glow sutil
 *  - leve movimento horizontal contínuo (respiração)
 *  - parallax leve no scroll
 *  - fade-in suave de opacidade quando entra na viewport
 *
 * Premium, minimalista, cinematográfico. Sem exageros.
 */
export function StillMovementDivider({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [visible, setVisible] = useState(false);

  // Scroll parallax (leve)
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

  // Fade-in ao entrar na viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-noir-950 py-16 md:py-24 ${className}`}
      aria-label="Still In Movement"
    >
      <div
        className="mx-auto flex max-w-[1100px] items-center justify-center gap-6 px-6 transition-opacity duration-[1200ms] ease-out md:gap-10"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* STILL — desliza levemente para a esquerda no parallax */}
        <span
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.4em] text-noir-300 md:text-[13px]"
          style={{
            transform: `translateX(${shift * -10}px)`,
            willChange: "transform",
          }}
        >
          Still
        </span>

        {/* Barra central — respiração horizontal + glow */}
        <div
          className="relative flex-1"
          style={{
            transform: `translateX(${shift * 6}px)`,
            willChange: "transform",
          }}
        >
          <div className="animate-breathe-x">
            <SpectrumBar glow animate height="h-[5px]" className="w-full" />
          </div>
        </div>

        {/* MOVEMENT — desliza levemente para a direita no parallax */}
        <span
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.4em] text-cream md:text-[13px]"
          style={{
            transform: `translateX(${shift * 10}px)`,
            willChange: "transform",
          }}
        >
          Movement
        </span>
      </div>
    </div>
  );
}
