import { useLang } from "../contexts/LanguageContext";
import { Reveal, SectionLabel } from "./ui";

/**
 * Bastidores — mostra a estrutura de produção (câmeras, luz, monitoramento,
 * equipe) em um mosaico. Fotos em /public/fotos/bastidores/.
 */
type Shot = { n: number; span: string; pt?: string; en?: string };

const SHOTS: Shot[] = [
  { n: 1, span: "col-span-2 md:col-span-8 row-span-2", pt: "Set completo montado na locação", en: "Full set built on location" },
  { n: 2, span: "col-span-1 md:col-span-4 row-span-2", pt: "Monitoramento em tempo real", en: "Real-time monitoring" },
  { n: 3, span: "col-span-1 md:col-span-4 row-span-2", pt: "Câmeras de cinema", en: "Cinema cameras" },
  { n: 4, span: "col-span-2 md:col-span-8", pt: "Multicâmera sincronizado", en: "Synced multi-camera" },
  { n: 5, span: "col-span-1 md:col-span-4" },
  { n: 6, span: "col-span-1 md:col-span-4", pt: "Direção de fotografia", en: "Cinematography" },
  { n: 7, span: "col-span-2 md:col-span-8 row-span-2", pt: "Luz controlada, em qualquer ambiente", en: "Controlled light, anywhere" },
  { n: 8, span: "col-span-1 md:col-span-4 row-span-2", pt: "Direção de cena", en: "Directing talent" },
  { n: 10, span: "col-span-1 md:col-span-4 row-span-2", pt: "O resultado na tela", en: "What ends up on screen" },
  { n: 9, span: "col-span-1 md:col-span-4" },
  { n: 11, span: "col-span-1 md:col-span-4", pt: "Equipe completa", en: "Full crew" },
  { n: 12, span: "col-span-2 md:col-span-4" },
  { n: 13, span: "col-span-1 md:col-span-4", pt: "Câmera e monitor em cada plano", en: "Camera and monitor on every shot" },
  { n: 14, span: "col-span-2 md:col-span-8 row-span-2", pt: "Video village: tudo conferido ao vivo", en: "Video village: everything checked live" },
  { n: 15, span: "col-span-1 md:col-span-8", pt: "Estúdio montado do zero", en: "Studio built from scratch" },
  { n: 18, span: "col-span-1 md:col-span-4 row-span-2", pt: "Luz ajustada plano a plano", en: "Light tuned shot by shot" },
  { n: 17, span: "col-span-1 md:col-span-4" },
  { n: 20, span: "col-span-2 md:col-span-8 row-span-2", pt: "Equipamento de cinema", en: "Cinema gear" },
  { n: 19, span: "col-span-1 md:col-span-4 row-span-2" },
  { n: 21, span: "col-span-1 md:col-span-4 row-span-2", pt: "Corte e monitoramento ao vivo", en: "Live switching and monitoring" },
  { n: 22, span: "col-span-1 md:col-span-4" },
  { n: 23, span: "col-span-1 md:col-span-4 row-span-2" },
  { n: 24, span: "col-span-2 md:col-span-8", pt: "Gravação em consultório", en: "Shooting inside the clinic" },
];

const STACK_PT = ["Multicâmera", "Câmeras de cinema", "Luz de cinema", "Som direto", "Monitoramento ao vivo", "Direção de cena"];
const STACK_EN = ["Multi-camera", "Cinema cameras", "Cinema lighting", "Location sound", "Live monitoring", "Talent direction"];

export function Backstage() {
  const { lang } = useLang();
  const en = lang === "en";
  return (
    <section id="bastidores" className="relative bg-noir-950 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal className="grid gap-8 border-t border-noir-800 pt-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel>{en ? "Behind the scenes" : "Bastidores"}</SectionLabel>
            <h2 className="mt-5 font-display text-[10vw] font-light leading-[0.95] tracking-[-0.02em] text-cream md:text-[4.6vw]">
              {en ? "Cinema structure, on any set." : "Estrutura de cinema, em qualquer set."}
            </h2>
          </div>
          <div className="self-end md:col-span-5">
            <p className="max-w-md text-sm leading-relaxed text-noir-300 md:text-base">
              {en
                ? "Behind every frame there is a crew, gear and method. This is what a SIM production looks like before you press play."
                : "Por trás de cada quadro tem equipe, equipamento e método. É assim que uma produção da SIM acontece antes do play."}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {(en ? STACK_EN : STACK_PT).map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-noir-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide2 text-noir-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-12 md:gap-4">
          {SHOTS.map((s) => {
            const caption = en ? s.en : s.pt;
            return (
              <Reveal key={s.n} className={`group relative overflow-hidden rounded-sm ${s.span}`}>
                <img
                  src={`/fotos/bastidores/bastidores-${String(s.n).padStart(2, "0")}.jpg`}
                  alt={caption ?? (en ? "Behind the scenes" : "Bastidores")}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                />
                {caption && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute bottom-0 left-0 p-3 md:p-5">
                      <span className="inline-block h-1.5 w-1.5 rotate-45 bg-accent" />
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-wide2 text-cream md:text-[11px]">
                        {caption}
                      </div>
                    </div>
                  </>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
