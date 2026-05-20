import { useEffect, useState } from "react";

type Props = {
  onNavigate: (page: string) => void;
  current: string;
};

const links = [
  { id: "home", label: "Index" },
  { id: "work", label: "Work" },
  { id: "studio", label: "Studio" },
  { id: "estimate", label: "Estimate" },
  { id: "dashboard", label: "Dashboard" },
];

export default function Nav({ onNavigate, current }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Lisbon",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(d.toLocaleTimeString("en-GB", opts) + " LIS");
    };
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div
          className={`mx-auto max-w-[1400px] px-5 md:px-10 transition-all duration-700`}
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
              className="flex items-center gap-2.5 group"
            >
              <div className="relative w-7 h-7 rounded-full border border-noir-100/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 animate-aperture">
                  <svg viewBox="0 0 28 28" className="w-full h-full opacity-70">
                    <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-noir-100" />
                    {[0, 60, 120, 180, 240, 300].map((a) => (
                      <line
                        key={a}
                        x1="14"
                        y1="14"
                        x2={14 + 10 * Math.cos((a * Math.PI) / 180)}
                        y2={14 + 10 * Math.sin((a * Math.PI) / 180)}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-noir-100"
                      />
                    ))}
                  </svg>
                </div>
              </div>
              <span className="font-display italic text-[19px] tracking-tight text-noir-50">
                Momentum<span className="text-accent">.</span>
              </span>
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
                  {l.label}
                  {current === l.id && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">
                {time}
              </span>
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
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
