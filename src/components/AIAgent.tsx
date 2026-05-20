import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

type Msg = { role: "user" | "ai"; text: string };

const seed: Msg[] = [
  { role: "ai", text: "Sou a Vera, assistente comercial do Estúdio MOMENTUM. Em que posso ajudar?" },
];

const quick = [
  "Quero um filme de marca",
  "Editorial para revista",
  "Documentário de 5–10 min",
  "Orçamento aproximado",
];

function aiResponse(input: string): string {
  const i = input.toLowerCase();
  if (i.includes("filme") || i.includes("brand") || i.includes("marca"))
    return "Belíssimo. Filmes de marca no MOMENTUM partem de €18.000 e incluem direção, captação 6K, color e finish. Posso encaminhar um briefing curto e o nosso diretor entra em contacto em 24h.";
  if (i.includes("edit") || i.includes("revista") || i.includes("foto"))
    return "Editoriais começam em €6.500 (até 8 páginas). Inclui pre-production, captação, retoque premium e licenças. Quer indicar a publicação ou marca?";
  if (i.includes("doc") || i.includes("documentário"))
    return "Documentários curtos (5–12 min) ficam entre €24.000–€48.000 conforme deslocações e número de personagens. Posso agendar uma chamada de 20 min com a direção?";
  if (i.includes("preço") || i.includes("orçamento") || i.includes("valor") || i.includes("custo"))
    return "Use o nosso Estimate Inteligente — em menos de 90 segundos devolve uma faixa com 92% de precisão. Quer que eu abra para si?";
  if (i.includes("prazo") || i.includes("quando"))
    return "Janelas atuais: pré-produção em 2–3 semanas, captação conforme calendário. Para 2026, agenda aberta a partir de fevereiro.";
  return "Anotado. Vou encaminhar à direção comercial — em paralelo, sugiro abrir o Estimate Inteligente para uma faixa imediata de investimento.";
}

export default function AIAgent() {
  const ref = useReveal<HTMLDivElement>();
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: aiResponse(text) }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <section className="bg-noir-950 py-24 md:py-36 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div ref={ref} className="reveal grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
              · 04 / AI Concierge
            </p>
            <h2 className="font-display text-5xl md:text-6xl tracking-[-0.02em] text-noir-50 mb-6 text-balance">
              Conheça <em className="italic">Vera</em>.
            </h2>
            <p className="text-noir-300 text-lg leading-relaxed mb-8 max-w-md">
              Concierge comercial treinada na linguagem do estúdio. Responde a briefings,
              estima orçamentos e agenda chamadas com a direção — 24/7, em três idiomas.
            </p>
            <div className="space-y-3">
              {[
                ["Resposta em <2 min", "tempo médio de primeira interação"],
                ["92% precisão", "no estimate inteligente"],
                ["3 idiomas", "PT · EN · FR"],
              ].map(([t, s]) => (
                <div key={t} className="flex items-baseline gap-4 border-b border-noir-100/5 pb-3">
                  <span className="font-display text-2xl text-noir-50">{t}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="glass rounded-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-noir-100/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-noir-500" />
                  <span className="w-2 h-2 rounded-full bg-noir-500" />
                  <span className="w-2 h-2 rounded-full bg-noir-500" />
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-noir-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow" />
                  Vera · Online
                </div>
                <div className="text-[10px] font-mono text-noir-400">v3.2</div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="h-[380px] overflow-y-auto px-5 py-6 space-y-4">
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} fade-in`}
                  >
                    {m.role === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-noir-50 text-noir-900 flex items-center justify-center text-[11px] font-display italic mr-3 shrink-0">
                        V
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                        m.role === "user"
                          ? "bg-noir-50 text-noir-900 rounded-br-sm"
                          : "bg-noir-800 text-noir-100 rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex items-center gap-3 fade-in">
                    <div className="w-7 h-7 rounded-full bg-noir-50 text-noir-900 flex items-center justify-center text-[11px] font-display italic">
                      V
                    </div>
                    <div className="bg-noir-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-noir-400 animate-glow" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-noir-400 animate-glow" style={{ animationDelay: "200ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-noir-400 animate-glow" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[11px] tracking-wide px-3 py-1.5 rounded-full border border-noir-100/10 text-noir-300 hover:text-noir-50 hover:border-accent/50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2 px-3 pb-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Diga em uma frase o que precisa…"
                  className="flex-1 bg-noir-800/60 rounded-full px-5 py-3 text-[14px] text-noir-50 placeholder:text-noir-400 outline-none border border-transparent focus:border-noir-100/15 transition"
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-full bg-accent hover:bg-noir-50 text-noir-900 flex items-center justify-center transition-colors"
                  aria-label="Enviar"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1.5 7h11M8 2.5 12.5 7 8 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
