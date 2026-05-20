import { clients } from "../data/projects";

export default function Marquee() {
  const items = [...clients, ...clients];
  return (
    <section className="border-y border-noir-100/5 py-10 bg-noir-950 overflow-hidden">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400 text-center mb-6">
        Selecionados por · Trusted by
      </div>
      <div className="relative mask-fade-x">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {items.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="font-display italic text-3xl md:text-4xl text-noir-300/70 hover:text-noir-50 transition-colors"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
