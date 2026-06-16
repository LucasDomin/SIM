import { useLang } from "../contexts/LanguageContext";
import { Logo } from "./Logo";
import { SpectrumBar } from "./ui";

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Vimeo", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
];

export function Footer({ onAdmin }: { onAdmin: () => void }) {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-noir-950 pt-20">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* CTA line */}
        <div className="border-b border-noir-800 pb-16">
          <div className="font-mono text-[10px] uppercase tracking-wide2 text-accent">
            {t.footer.contact}
          </div>
          <a
            href="mailto:hello@sim.studio"
            className="group mt-4 block font-display text-[12vw] font-light leading-[0.95] tracking-[-0.03em] text-cream md:text-[7vw]"
          >
            <span className="transition-colors group-hover:text-accent">
              {t.footer.email}
            </span>
            <span className="text-accent">.</span>
          </a>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="scale-90" />
            <p className="mt-6 max-w-xs text-pretty text-sm text-noir-400">
              {t.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
              {t.footer.studio}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-noir-200">
              <li>{t.footer.locations}</li>
              <li>
                <a href="mailto:hello@sim.studio" className="transition-colors hover:text-accent">
                  hello@sim.studio
                </a>
              </li>
              <li>
                <a href="tel:+351210000000" className="transition-colors hover:text-accent">
                  +351 210 000 000
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
              Social
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="group inline-flex items-center gap-1.5 text-noir-200 transition-colors hover:text-accent"
                  >
                    <span className="inline-block h-1 w-1 rounded-full bg-noir-600 transition-colors group-hover:bg-accent" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={onAdmin}
              className="mt-6 font-mono text-[10px] uppercase tracking-wide2 text-noir-500 transition-colors hover:text-accent"
            >
              {t.nav.admin} ↗
            </button>
          </div>
        </div>

        <SpectrumBar className="mb-8" />

        {/* Oversized wordmark */}
        <div className="pointer-events-none select-none border-t border-noir-850 pt-6">
          <div className="font-display text-[26vw] font-light leading-[0.8] tracking-[-0.04em] text-noir-100/[0.04]">
            Still
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-noir-850">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 px-5 py-6 font-mono text-[10px] uppercase tracking-wide2 text-noir-500 md:flex-row md:px-10">
          <span>© {year} SIM — Still In Movement</span>
          <span>{t.footer.rights}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-spec-2" />
            Lisboa · Porto
          </span>
        </div>
      </div>
    </footer>
  );
}
