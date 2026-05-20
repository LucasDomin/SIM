import { useReveal } from "../hooks/useReveal";

export default function Manifesto() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="bg-noir-950 py-32 md:py-48 relative overflow-hidden">
      {/* Faint frame */}
      <div className="pointer-events-none absolute inset-x-10 top-10 bottom-10 border border-noir-100/5" />

      <div ref={ref} className="reveal max-w-[1100px] mx-auto px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-8">
          · 02 / Manifesto
        </p>
        <p className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-[-0.015em] text-noir-100 text-balance">
          Acreditamos que <em className="italic text-accent">a melhor imagem</em> é aquela que continua
          a existir depois de fechar os olhos. Não fabricamos atenção —{" "}
          <span className="text-noir-50">construímos memória.</span>
        </p>
        <div className="mt-12 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">
          <span className="h-px w-10 bg-noir-400" />
          <span>Estúdio MOMENTUM · Est. 2017 · Lisboa / São Paulo</span>
          <span className="h-px w-10 bg-noir-400" />
        </div>
      </div>
    </section>
  );
}
