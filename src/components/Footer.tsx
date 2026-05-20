export default function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <footer className="bg-noir-950 border-t border-noir-100/5 pt-24 pb-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        {/* Massive type */}
        <div className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-6">
            · Encerramento
          </p>
          <h2 className="font-display text-[18vw] md:text-[14vw] leading-[0.85] tracking-[-0.04em] text-noir-50 text-balance">
            Momentum<em className="italic text-noir-500">.</em>
          </h2>
          <p className="mt-6 font-display italic text-2xl md:text-3xl text-noir-300 max-w-2xl">
            Imagens que permanecem em silêncio.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-noir-100/8">
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400 mb-3">
              Estúdio
            </div>
            <p className="text-noir-200 leading-relaxed">
              Rua das Janelas Verdes, 26<br />
              1200-690 Lisboa · Portugal
            </p>
            <p className="text-noir-200 leading-relaxed mt-4">
              Alameda Santos, 700<br />
              01418-100 São Paulo · Brasil
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400 mb-3">
              Contato
            </div>
            <a href="mailto:studio@momentum.film" className="block text-noir-100 hover:text-accent transition">studio@momentum.film</a>
            <a href="https://wa.me/351900000000" className="block text-noir-100 hover:text-accent transition mt-1">+351 900 000 000</a>
            <a href="#" className="block text-noir-100 hover:text-accent transition mt-1">@momentum.studio</a>
          </div>
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400 mb-3">
              Newsletter · 4×/ano
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 border-b border-noir-100/15 focus-within:border-accent transition pb-2">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 bg-transparent outline-none text-noir-50 placeholder:text-noir-500 text-[14px]"
              />
              <button className="text-[12px] text-noir-300 hover:text-accent transition">Subscrever →</button>
            </form>
            <p className="text-noir-500 text-[12px] mt-3">
              Editorial trimestral · sem ruído. Cancele com 1 clique.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["home", "Index"],
              ["work", "Work"],
              ["studio", "Studio"],
              ["estimate", "Estimate"],
              ["dashboard", "Dashboard"],
            ].map(([id, l]) => (
              <button key={id} onClick={() => onNavigate(id)} className="text-[12px] text-noir-400 hover:text-noir-50 transition">
                {l}
              </button>
            ))}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-500">
            © 2026 Estúdio MOMENTUM · Todos os direitos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
