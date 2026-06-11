import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCMS } from "../hooks/useCMS";

type Props = {
  onNavigate: (page: string) => void;
  current: string;
};

const links = [
  { id: "home", label: "Início" },
  { id: "work", label: "Trabalhos" },
  { id: "studio", label: "Estrada" },
  { id: "estimate", label: "Orçamento" },
];

export default function Nav({ onNavigate, current }: Props) {
  const { t } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[60] transition-all duration-700 ${
          scrolled ? "pt-1 pb-3" : "pt-2 pb-6"
        }`}
      >
        {/* Faixa de proteção: garante legibilidade da logo sobre o hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-noir-950 via-noir-950/85 to-transparent" />
        <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 mb-2 transition-opacity duration-500">
          <div className="flex items-center justify-between font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-noir-100/30">
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-glow" />
              <span>Rec · Reel 2026</span>
            </div>
            <div className="hidden md:flex items-center gap-6 opacity-60">
              <span>ISO 800</span>
              <span>35mm · ƒ1.4</span>
              <span>24fps</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <span>01 / 03</span>
            </div>
          </div>
        </div>

        <div
          className={`relative mx-auto max-w-[1400px] px-5 md:px-10 transition-all duration-700`}
        >
          <div
            className={`flex items-center justify-between gap-6 transition-all duration-700 ${
              scrolled
                ? "glass rounded-full px-5 py-2.5"
                : "px-0 py-0"
            }`}
          >
            <button
              onClick={() => onNavigate("home")}
              className="group"
              aria-label="SIM"
            >
              {/* logo reduzida ~10% */}
              <Logo className="w-[100px]" animated />
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onNavigate(l.id)}
                  className={`relative px-4 py-2 text-[13px] tracking-wide transition-colors ${
                    current === l.id
                      ? "text-noir-50"
                      : "text-noir-300 hover:text-noir-50"
                  }`}
                >
                  {t(`nav.${l.id}`, l.label)}
                  {current === l.id && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => onNavigate("estimate")}
                className="group relative overflow-hidden rounded-full border border-noir-100/15 bg-noir-50 text-noir-900 px-4 py-2 text-[12px] tracking-wide font-medium hover:bg-accent transition-colors duration-500"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Iniciar projeto
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`h-px w-5 bg-noir-50 transition-all ${open ? "translate-y-[3px] rotate-45" : ""}`} />
                <span className={`h-px w-5 bg-noir-50 transition-all ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-noir-950/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className="relative h-full flex flex-col justify-center px-8 gap-3">
          {links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => { onNavigate(l.id); setOpen(false); }}
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
              className={`font-display italic text-5xl text-left text-noir-50 transition-all duration-500 ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
            >
              {t(`nav.${l.id}`, l.label)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
