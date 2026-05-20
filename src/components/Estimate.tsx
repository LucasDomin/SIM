import { useMemo, useState } from "react";

type Service = "film" | "editorial" | "doc" | "brand";

const serviceMeta: Record<Service, { label: string; base: number; subtitle: string }> = {
  film:      { label: "Cinema de marca",     base: 18000, subtitle: "Short film / campanha audiovisual" },
  editorial: { label: "Fotografia editorial", base: 6500,  subtitle: "Editorial fashion / produto" },
  doc:       { label: "Documentário",         base: 24000, subtitle: "Curto / médio (5–12 min)" },
  brand:     { label: "Brand book completo",  base: 32000, subtitle: "Filme + stills + identidade visual" },
};

const scopes = [
  { id: "single", label: "Diária única",       mult: 1.0 },
  { id: "double", label: "2 diárias",          mult: 1.6 },
  { id: "week",   label: "Semana completa",    mult: 3.0 },
  { id: "long",   label: "Projeto estendido",  mult: 5.2 },
];
const locations = [
  { id: "studio", label: "Estúdio NOIR",  add: 0 },
  { id: "city",   label: "Cidade",        add: 2500 },
  { id: "travel", label: "Viagem nacional", add: 6500 },
  { id: "intl",   label: "Internacional", add: 18000 },
];
const finishings = [
  { id: "std", label: "Standard",  mult: 1.0 },
  { id: "pro", label: "Premium",   mult: 1.18 },
  { id: "sig", label: "Signature", mult: 1.42 },
];
const usages = [
  { id: "soc",  label: "Social orgânico", add: 0 },
  { id: "paid", label: "Mídia paga",      add: 4500 },
  { id: "tv",   label: "Broadcast / TV",  add: 14000 },
  { id: "glob", label: "Global multi-canal", add: 28000 },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function Estimate() {
  const [step, setStep] = useState<Step>(0);
  const [service, setService] = useState<Service>("film");
  const [scope, setScope] = useState(scopes[1].id);
  const [loc, setLoc] = useState(locations[1].id);
  const [finish, setFinish] = useState(finishings[1].id);
  const [usage, setUsage] = useState(usages[1].id);
  const [contact, setContact] = useState({ name: "", brand: "", email: "" });

  const estimate = useMemo(() => {
    const s = serviceMeta[service];
    const sc = scopes.find((x) => x.id === scope)!.mult;
    const lc = locations.find((x) => x.id === loc)!.add;
    const fn = finishings.find((x) => x.id === finish)!.mult;
    const us = usages.find((x) => x.id === usage)!.add;
    const base = s.base * sc * fn + lc + us;
    return { low: Math.round(base * 0.9), high: Math.round(base * 1.15) };
  }, [service, scope, loc, finish, usage]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const steps = [
    "Tipo de projeto", "Escopo", "Local", "Acabamento", "Distribuição", "Resumo",
  ];

  const next = () => setStep((s) => Math.min(5, s + 1) as Step);
  const prev = () => setStep((s) => Math.max(0, s - 1) as Step);

  const whatsappMsg = encodeURIComponent(
    `Olá, Vera! Acabei de gerar um estimate no site:\n\n` +
    `· Serviço: ${serviceMeta[service].label}\n` +
    `· Escopo: ${scopes.find((s) => s.id === scope)?.label}\n` +
    `· Local: ${locations.find((s) => s.id === loc)?.label}\n` +
    `· Acabamento: ${finishings.find((s) => s.id === finish)?.label}\n` +
    `· Distribuição: ${usages.find((s) => s.id === usage)?.label}\n\n` +
    `Faixa: ${fmt(estimate.low)} – ${fmt(estimate.high)}\n\n` +
    `Gostaria de uma chamada.`
  );

  return (
    <section id="estimate" className="bg-noir-900 border-t border-noir-100/5 py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Header column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
                · 05 / Smart Estimate
              </p>
              <h2 className="font-display text-5xl md:text-6xl tracking-[-0.02em] text-noir-50 mb-6 text-balance">
                Um orçamento em <em className="italic">90 segundos</em>.
              </h2>
              <p className="text-noir-300 text-base leading-relaxed mb-10 max-w-sm">
                Cinco passos. Sem formulários longos. Sem espera. Faixas de investimento calibradas
                com 4 anos de projetos entregues.
              </p>

              <div className="space-y-px">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStep(i as Step)}
                    className={`w-full text-left flex items-center gap-4 py-3 transition-colors ${
                      step === i ? "text-noir-50" : "text-noir-400 hover:text-noir-200"
                    }`}
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em]">
                      0{i + 1}
                    </span>
                    <span className={`h-px flex-1 transition-colors ${step >= i ? "bg-accent" : "bg-noir-100/10"}`} />
                    <span className="text-[13px] tracking-wide">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8">
            <div className="glass rounded-2xl p-6 md:p-10 min-h-[560px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">
                  Step {String(step + 1).padStart(2, "0")} / 06
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  Estimativa viva
                </div>
              </div>

              <div className="flex-1">
                {step === 0 && (
                  <Group title="Qual é a natureza do projeto?">
                    {(Object.keys(serviceMeta) as Service[]).map((k) => (
                      <Option
                        key={k}
                        selected={service === k}
                        onClick={() => setService(k)}
                        title={serviceMeta[k].label}
                        sub={serviceMeta[k].subtitle}
                        meta={`a partir de ${fmt(serviceMeta[k].base)}`}
                      />
                    ))}
                  </Group>
                )}
                {step === 1 && (
                  <Group title="Qual a dimensão da produção?">
                    {scopes.map((s) => (
                      <Option key={s.id} selected={scope === s.id} onClick={() => setScope(s.id)} title={s.label} sub={`Coeficiente ×${s.mult}`} />
                    ))}
                  </Group>
                )}
                {step === 2 && (
                  <Group title="Onde acontece a captação?">
                    {locations.map((s) => (
                      <Option key={s.id} selected={loc === s.id} onClick={() => setLoc(s.id)} title={s.label} sub={s.add ? `+ ${fmt(s.add)}` : "Incluído"} />
                    ))}
                  </Group>
                )}
                {step === 3 && (
                  <Group title="Nível de acabamento">
                    {finishings.map((s) => (
                      <Option key={s.id} selected={finish === s.id} onClick={() => setFinish(s.id)} title={s.label} sub={`Coeficiente ×${s.mult}`} />
                    ))}
                  </Group>
                )}
                {step === 4 && (
                  <Group title="Distribuição e direitos de uso">
                    {usages.map((s) => (
                      <Option key={s.id} selected={usage === s.id} onClick={() => setUsage(s.id)} title={s.label} sub={s.add ? `+ ${fmt(s.add)}` : "Incluído"} />
                    ))}
                  </Group>
                )}
                {step === 5 && (
                  <div className="fade-in space-y-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400 mb-3">
                        Faixa estimada de investimento
                      </p>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-display text-5xl md:text-7xl text-noir-50 tracking-[-0.02em]">
                          {fmt(estimate.low)}
                        </span>
                        <span className="text-noir-400 text-2xl">—</span>
                        <span className="font-display text-5xl md:text-7xl text-accent tracking-[-0.02em]">
                          {fmt(estimate.high)}
                        </span>
                      </div>
                      <p className="text-[12px] text-noir-400 mt-3">
                        Valor indicativo · ±12% conforme escopo final · IVA não incluído
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="Nome" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} />
                      <Field label="Marca" value={contact.brand} onChange={(v) => setContact({ ...contact, brand: v })} />
                      <Field label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} className="sm:col-span-2" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={`https://wa.me/351900000000?text=${whatsappMsg}`}
                        target="_blank" rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-noir-50 text-noir-900 rounded-full pl-5 pr-2 py-2 hover:bg-accent transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.37a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.03zM12.04 20.15a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.19-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23z" /></svg>
                        <span className="text-[13px] tracking-wide font-medium">Continuar no WhatsApp</span>
                        <span className="w-9 h-9 rounded-full bg-noir-900 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M1 6h10m-4-4 4 4-4 4" stroke="#f5f5f6" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                        </span>
                      </a>
                      <button className="text-[13px] text-noir-300 hover:text-noir-50 border-b border-noir-100/20 hover:border-accent pb-1 transition">
                        Receber por email →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer nav */}
              <div className="mt-10 pt-6 border-t border-noir-100/10 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 mb-1">
                    Faixa atual
                  </div>
                  <div className="font-display text-xl text-noir-50">
                    {fmt(estimate.low)} <span className="text-noir-400">–</span>{" "}
                    <span className="text-accent">{fmt(estimate.high)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    disabled={step === 0}
                    className="px-4 py-2.5 rounded-full text-[12px] text-noir-300 hover:text-noir-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={next}
                    disabled={step === 5}
                    className="px-5 py-2.5 rounded-full bg-noir-50 text-noir-900 text-[12px] font-medium hover:bg-accent disabled:opacity-30 transition"
                  >
                    {step === 4 ? "Ver resumo" : "Avançar"} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fade-in">
      <h3 className="font-display text-2xl md:text-3xl text-noir-50 mb-6 tracking-[-0.01em]">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Option({
  selected, onClick, title, sub, meta,
}: { selected: boolean; onClick: () => void; title: string; sub: string; meta?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group text-left p-5 rounded-xl border transition-all duration-300 ${
        selected
          ? "border-accent bg-accent/[0.06]"
          : "border-noir-100/8 hover:border-noir-100/20 bg-noir-800/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <span className="font-display text-lg text-noir-50">{title}</span>
        <span
          className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
            selected ? "border-accent bg-accent" : "border-noir-400"
          }`}
        >
          {selected && <span className="w-1.5 h-1.5 rounded-full bg-noir-900" />}
        </span>
      </div>
      <div className="text-[13px] text-noir-300">{sub}</div>
      {meta && <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{meta}</div>}
    </button>
  );
}

function Field({
  label, value, onChange, className = "",
}: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 bg-transparent border-b border-noir-100/15 focus:border-accent transition py-2 text-noir-50 outline-none text-[15px]"
      />
    </label>
  );
}
