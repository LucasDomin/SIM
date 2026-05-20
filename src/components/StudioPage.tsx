import { useReveal } from "../hooks/useReveal";

const team = [
  { name: "Nuno Ferreira",     role: "Director · Founder",   img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
  { name: "Marta Caldeira",    role: "DoP · Partner",        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
  { name: "Leonardo Vasconcelos", role: "Director of Photography", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
  { name: "Catarina Albuquerque", role: "Stylist · Creative",   img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80" },
];

export default function StudioPage() {
  const r1 = useReveal<HTMLDivElement>();
  const r2 = useReveal<HTMLDivElement>();

  return (
    <div className="pt-32 bg-noir-950">
      {/* Hero */}
      <section className="px-5 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-6 fade-up">
            · Studio · Est. 2017
          </p>
          <h1 className="font-display text-[12vw] md:text-[8vw] leading-[0.9] tracking-[-0.03em] text-noir-50 fade-up text-balance">
            Uma casa pequena<br />
            <em className="italic text-noir-400">por escolha.</em>
          </h1>
          <p className="mt-10 max-w-2xl text-xl text-noir-300 leading-relaxed fade-up" style={{ animationDelay: "200ms" }}>
            Somos doze. Recusamos mais do que aceitamos. Trabalhamos com clientes que entendem
            que o tempo é o ingrediente mais valioso de qualquer imagem.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-24 md:py-32 px-5 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div ref={r1} className="reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-noir-100/5">
            {[
              ["08", "anos de estúdio"],
              ["14", "países filmados"],
              ["240+", "projetos entregues"],
              ["12", "prémios internacionais"],
            ].map(([n, l]) => (
              <div key={n} className="bg-noir-950 p-8 md:p-10">
                <div className="font-display text-6xl md:text-7xl text-noir-50 tracking-[-0.03em]">{n}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 mt-3">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-noir-900 py-24 md:py-32 border-y border-noir-100/5">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div ref={r2} className="reveal grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">· Process</p>
              <h2 className="font-display text-5xl md:text-6xl text-noir-50 tracking-[-0.02em]">
                Quatro tempos.
              </h2>
            </div>
            <div className="md:col-span-8 space-y-px">
              {[
                ["01", "Conversa",   "Uma chamada de 30 minutos. Ouvimos antes de propor."],
                ["02", "Treatment",  "Um documento curto, denso, visual. A direção criativa em 2 semanas."],
                ["03", "Produção",   "Equipa enxuta, decisões rápidas, equipamento certo. Sem ruído."],
                ["04", "Entrega",    "Master cinematográfico + cortes para todos os canais. Suporte 12 meses."],
              ].map(([n, t, d]) => (
                <div key={n} className="grid grid-cols-12 gap-4 py-6 border-b border-noir-100/8">
                  <div className="col-span-2 font-mono text-[11px] text-noir-400 pt-2">{n}</div>
                  <div className="col-span-10 md:col-span-4">
                    <div className="font-display text-2xl text-noir-50">{t}</div>
                  </div>
                  <div className="col-span-12 md:col-span-6 text-noir-300 text-[15px] leading-relaxed">
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 px-5 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">· Team</p>
          <h2 className="font-display text-5xl md:text-6xl text-noir-50 tracking-[-0.02em] mb-14">
            As pessoas <em className="italic text-noir-400">por trás.</em>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {team.map((m, i) => (
              <Member key={m.name} {...m} i={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Member({ name, role, img, i }: { name: string; role: string; img: string; i: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal group" style={{ transitionDelay: `${i * 80}ms` }}>
      <div className="aspect-[3/4] overflow-hidden bg-noir-800">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1200ms] scale-100 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <div className="pt-4">
        <div className="font-display text-lg text-noir-50">{name}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 mt-1">{role}</div>
      </div>
    </div>
  );
}
