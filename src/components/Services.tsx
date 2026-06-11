import { useReveal } from "../hooks/useReveal";
import { useCMS } from "../hooks/useCMS";

const services = [
  {
    n: "01",
    title: "Cinema de marca",
    desc: "Filmes institucionais, campanhas e short films de alto valor narrativo.",
    items: ["Direção", "Roteiro", "Produção executiva", "Color & finish"],
  },
  {
    n: "02",
    title: "Fotografia editorial",
    desc: "Editoriais de moda, produto e lifestyle para revistas e marcas premium.",
    items: ["Pre-production", "Casting & styling", "Locations", "Retouch"],
  },
  {
    n: "03",
    title: "Documentário & autoral",
    desc: "Histórias humanas filmadas com paciência cinematográfica.",
    items: ["Pesquisa", "Direção", "Captação 4K/6K", "Sound design"],
  },
  {
    n: "04",
    title: "Arquivo & licenciamento",
    desc: "Acesso curado ao nosso arquivo de imagens e clipes para marcas.",
    items: ["Licenças globais", "Edições limitadas", "Print fine-art"],
  },
];

export default function Services() {
  const { t } = useCMS();
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="studio" className="bg-noir-900 py-24 md:py-36 border-t border-noir-100/5">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div ref={ref} className="reveal max-w-3xl mb-16 md:mb-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            {t("services.eyebrow", "· 03 / Studio")}
          </p>
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] text-noir-50 text-balance">
            {t("services.title.1", "Quatro disciplinas.")}
            <br />
            <em className="italic text-noir-400">{t("services.title.2", "Uma só linguagem.")}</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-noir-100/5">
          {services.map((s, i) => (
            <ServiceCell key={s.n} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCell({
  n, title, desc, items, index,
}: { n: string; title: string; desc: string; items: string[]; index: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal group relative bg-noir-900 p-8 md:p-12 hover:bg-noir-850 transition-colors duration-700 min-h-[320px] flex flex-col justify-between"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] text-noir-400">{n}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div>
        <h3 className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-noir-50 mb-3">
          {title}
        </h3>
        <p className="text-noir-300 text-[15px] leading-relaxed max-w-md mb-6">{desc}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {items.map((it) => (
            <span key={it} className="font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">
              · {it}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
