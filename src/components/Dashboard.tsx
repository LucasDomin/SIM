import { useState } from "react";

const kpis = [
  { label: "Projetos ativos", value: "12", trend: "+3", sub: "vs Q3" },
  { label: "Pipeline", value: "€ 412k", trend: "+18%", sub: "30 dias" },
  { label: "Leads (mês)", value: "47", trend: "+22%", sub: "via Vera AI" },
  { label: "Conversão", value: "34.2%", trend: "+4.1pp", sub: "estimate → call" },
];

const projects = [
  { code: "NR-2026-014", client: "Hermès",      title: "Atlas II",        stage: "Pre-prod",  due: "12 fev",  budget: "€ 64.000", owner: "NF", color: "bg-amber-400/80" },
  { code: "NR-2026-013", client: "Ettore",      title: "Obsidian Cut",    stage: "Color",      due: "04 fev",  budget: "€ 42.500", owner: "MC", color: "bg-emerald-400/80" },
  { code: "NR-2026-011", client: "Saint Cyr",   title: "Aurora",          stage: "Captação",   due: "28 jan",  budget: "€ 38.000", owner: "LV", color: "bg-sky-400/80" },
  { code: "NR-2026-009", client: "Vogue PT",    title: "Linho · Inverno", stage: "Briefing",   due: "02 mar",  budget: "€ 8.500",  owner: "CA", color: "bg-noir-300" },
  { code: "NR-2026-008", client: "Atelier B.",  title: "Monolith 02",     stage: "Finish",     due: "22 jan",  budget: "€ 28.000", owner: "NF", color: "bg-rose-400/80" },
];

const activity = [
  { t: "agora",   ev: "Vera respondeu briefing — Acne Studios" },
  { t: "12 min",  ev: "Estimate gerado · €18k–€22k · Filme" },
  { t: "1 h",     ev: "Hermès aprovou treatment Atlas II" },
  { t: "3 h",     ev: "Color pass enviado · Obsidian Cut" },
  { t: "Ontem",   ev: "Saint Cyr · agenda confirmada Islândia" },
];

export default function Dashboard() {
  const [tab, setTab] = useState<"overview" | "projects" | "leads">("overview");

  return (
    <section id="dashboard" className="min-h-screen bg-noir-900 pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
              · Internal · v3.2 · Studio control
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-[-0.02em] text-noir-50">
              Dashboard <em className="italic text-noir-400">MOMENTUM.</em>
            </h1>
            <p className="text-noir-300 mt-3">Quinta-feira, 30 jan · Bom dia, Nuno.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass-light rounded-full p-1 flex">
              {(["overview", "projects", "leads"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-[12px] capitalize transition ${
                    tab === t ? "bg-noir-50 text-noir-900" : "text-noir-300 hover:text-noir-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="glass-light rounded-full px-4 py-2 text-[12px] text-noir-200 hover:text-noir-50 transition">
              + Novo projeto
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-noir-100/5 rounded-2xl overflow-hidden mb-10">
          {kpis.map((k) => (
            <div key={k.label} className="bg-noir-850 p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 mb-3">
                {k.label}
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-4xl md:text-5xl text-noir-50 tracking-[-0.02em]">
                  {k.value}
                </span>
                <span className="text-emerald-400 text-[12px] font-mono">{k.trend}</span>
              </div>
              <div className="text-noir-400 text-[12px] mt-2">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Projects table */}
          <div className="lg:col-span-8 glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-noir-100/5">
              <h3 className="text-noir-50 text-sm tracking-wide">Projetos · Pipeline</h3>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">
                Live · sincronizado com Frame.io
              </div>
            </div>
            <div className="divide-y divide-noir-100/5">
              <div className="grid grid-cols-12 gap-3 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">
                <div className="col-span-3">Cliente</div>
                <div className="col-span-3">Projeto</div>
                <div className="col-span-2">Etapa</div>
                <div className="col-span-2">Entrega</div>
                <div className="col-span-2 text-right">Budget</div>
              </div>
              {projects.map((p) => (
                <div key={p.code} className="grid grid-cols-12 gap-3 px-6 py-4 hover:bg-noir-800/40 transition cursor-pointer group items-center">
                  <div className="col-span-3">
                    <div className="text-noir-50 text-[14px]">{p.client}</div>
                    <div className="font-mono text-[10px] text-noir-400">{p.code}</div>
                  </div>
                  <div className="col-span-3 text-noir-200 text-[14px] font-display">{p.title}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                    <span className="text-noir-200 text-[12px]">{p.stage}</span>
                  </div>
                  <div className="col-span-2 text-noir-300 text-[13px]">{p.due}</div>
                  <div className="col-span-2 text-right">
                    <span className="text-noir-50 text-[14px] font-display">{p.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Vera live */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow" />
                  <span className="text-noir-50 text-sm">Vera · agora</span>
                </div>
                <span className="font-mono text-[10px] text-noir-400">AI Concierge</span>
              </div>
              <p className="text-noir-200 text-[14px] leading-relaxed mb-4">
                3 novos briefings de alto valor desde ontem. Recomendo priorizar
                <span className="text-accent"> Acne Studios</span> (€42k estimado, fit cultural alto).
              </p>
              <button className="text-[12px] text-accent hover:text-noir-50 transition border-b border-accent/40 pb-0.5">
                Ver análise completa →
              </button>
            </div>

            {/* Activity */}
            <div className="glass rounded-2xl p-6">
              <h4 className="text-noir-50 text-sm tracking-wide mb-4">Atividade recente</h4>
              <ul className="space-y-3.5">
                {activity.map((a, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-noir-400 mt-2 shrink-0" />
                    <div className="flex-1">
                      <div className="text-noir-200 text-[13px] leading-snug">{a.ev}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-noir-500 mt-0.5">{a.t}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendar */}
            <div className="glass rounded-2xl p-6">
              <h4 className="text-noir-50 text-sm tracking-wide mb-4">Agenda · semana</h4>
              <div className="space-y-2">
                {[
                  ["Seg 03 fev", "Hermès · scout"],
                  ["Qua 05 fev", "Color · Obsidian"],
                  ["Sex 07 fev", "Saint Cyr · captação"],
                ].map(([d, ev]) => (
                  <div key={d} className="flex items-center justify-between border-b border-noir-100/5 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">{d}</span>
                    <span className="text-noir-200 text-[13px]">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
