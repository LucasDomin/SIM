import { useEffect, useRef, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useAdmin } from "../contexts/AdminContext";
import type { Project } from "../data/defaults";
import { ProjectEditor } from "./ProjectEditor";
import { HeroEditor } from "./HeroEditor";
import { Logo } from "./Logo";
import { SpectrumBar } from "./ui";
import { supabase } from "../lib/supabase";

type FilmstripItem = { id: string; url: string; title: string; position: number };
type Client = { id: string; name: string; logo_url: string; position: number };

// ── Logo Cropper ──────────────────────────────────────────────────────────────
function LogoCropper({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!open) { setUrl(""); setPreview(""); } }, [open]);

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setUrl(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-noir-950/95 p-6 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-sm border border-noir-700 bg-noir-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl text-cream">Logo</h3>
          <button onClick={onClose} className="rounded-full border border-noir-700 p-2 text-noir-400 hover:text-cream">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Upload ou URL */}
        <div className="flex flex-col gap-3">
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">URL da imagem (PNG recomendado)</span>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value); }}
              placeholder="https://..."
              className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-noir-800" />
            <span className="font-mono text-[9px] text-noir-500">OU</span>
            <div className="h-px flex-1 bg-noir-800" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-noir-700 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-accent hover:text-accent"
          >
            Fazer upload de arquivo
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" className="hidden" onChange={handleFile} />
        </div>

        {/* Preview harmonizado */}
        {preview && (
          <div className="mt-5">
            <div className="mb-2 font-mono text-[9px] uppercase tracking-wide2 text-noir-500">Preview (como aparece no marquee)</div>
            <div className="flex items-center justify-center rounded-sm border border-noir-800 bg-noir-950 py-6">
              <img
                src={preview}
                alt="preview"
                className="h-10 w-auto max-w-[160px] object-contain opacity-70"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="mt-2 text-[10px] text-noir-500">
              Todos os logos são exibidos em branco (filter invert) com altura fixa de 40px — ficam harmoniosos independente do original.
            </p>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => { if (url) { onSave(url); onClose(); } }}
            disabled={!url}
            className="flex-1 rounded-full bg-cream py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.01] disabled:opacity-40"
          >
            Usar este logo
          </button>
          <button onClick={onClose} className="rounded-full border border-noir-700 px-4 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-300 transition-colors hover:text-cream">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function AdminDashboard({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout?: () => void;
}) {
  const { lang } = useLang();
  const { logout, drafts, setEditing, authenticated, rows, rowsLoading, refreshRows, email } = useAdmin();
  const [active, setActive] = useState<Project | null>(null);
  const [heroOpen, setHeroOpen] = useState(false);

  // Filmstrip
  const [filmstrip, setFilmstrip] = useState<FilmstripItem[]>([]);
  const [filmstripLoading, setFilmstripLoading] = useState(false);
  const [filmstripSaving, setFilmstripSaving] = useState(false);
  const [filmstripMsg, setFilmstripMsg] = useState<string | null>(null);

  // Clients
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsSaving, setClientsSaving] = useState(false);
  const [clientsMsg, setClientsMsg] = useState<string | null>(null);
  const [logoCropperOpen, setLogoCropperOpen] = useState(false);
  const [logoCropperTarget, setLogoCropperTarget] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !authenticated) return;
    loadFilmstrip();
    loadClients();
  }, [open, authenticated]);

  // ── Filmstrip ──
  const loadFilmstrip = async () => {
    setFilmstripLoading(true);
    const { data } = await supabase.from("filmstrip").select("*").order("position", { ascending: true });
    if (data) setFilmstrip(data as FilmstripItem[]);
    setFilmstripLoading(false);
  };

  const updateFilmstripItem = (i: number, field: keyof FilmstripItem, val: string) => {
    setFilmstrip((prev) => { const next = [...prev]; next[i] = { ...next[i], [field]: val }; return next; });
  };
  const removeFilmstripItem = (i: number) => setFilmstrip((prev) => prev.filter((_, idx) => idx !== i));
  const addFilmstripItem = () => setFilmstrip((prev) => [...prev, { id: `new-${Date.now()}`, url: "", title: "", position: prev.length + 1 }]);
  const moveFilmstripItem = (i: number, dir: -1 | 1) => {
    setFilmstrip((prev) => {
      const next = [...prev]; const swap = i + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[i], next[swap]] = [next[swap], next[i]]; return next;
    });
  };
  const saveFilmstrip = async () => {
    setFilmstripSaving(true); setFilmstripMsg(null);
    const valid = filmstrip.filter((s) => s.url.trim() !== "");
    await supabase.from("filmstrip").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await supabase.from("filmstrip").insert(valid.map((s, i) => ({ url: s.url.trim(), title: s.title.trim(), position: i + 1 })));
    setFilmstripSaving(false);
    if (error) { setFilmstripMsg("Erro: " + error.message); }
    else { setFilmstripMsg("Filmstrip salvo!"); await loadFilmstrip(); setTimeout(() => setFilmstripMsg(null), 3000); }
  };

  // ── Clients ──
  const loadClients = async () => {
    setClientsLoading(true);
    const { data } = await supabase.from("clients").select("*").order("position", { ascending: true });
    if (data) setClients(data as Client[]);
    setClientsLoading(false);
  };

  const updateClient = (i: number, field: keyof Client, val: string) => {
    setClients((prev) => { const next = [...prev]; next[i] = { ...next[i], [field]: val }; return next; });
  };
  const removeClient = (i: number) => setClients((prev) => prev.filter((_, idx) => idx !== i));
  const addClient = () => setClients((prev) => [...prev, { id: `new-${Date.now()}`, name: "", logo_url: "", position: prev.length + 1 }]);
  const moveClient = (i: number, dir: -1 | 1) => {
    setClients((prev) => {
      const next = [...prev]; const swap = i + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[i], next[swap]] = [next[swap], next[i]]; return next;
    });
  };
  const openLogoCropper = (i: number) => { setLogoCropperTarget(i); setLogoCropperOpen(true); };
  const onLogoSave = (url: string) => {
    if (logoCropperTarget !== null) updateClient(logoCropperTarget, "logo_url", url);
  };
  const saveClients = async () => {
    setClientsSaving(true); setClientsMsg(null);
    const valid = clients.filter((c) => c.name.trim() !== "");
    await supabase.from("clients").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await supabase.from("clients").insert(valid.map((c, i) => ({ name: c.name.trim(), logo_url: c.logo_url.trim(), position: i + 1 })));
    setClientsSaving(false);
    if (error) { setClientsMsg("Erro: " + error.message); }
    else { setClientsMsg("Clientes salvos!"); await loadClients(); setTimeout(() => setClientsMsg(null), 3000); }
  };

  if (!open || !authenticated) return null;
  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  return (
    <>
      <div className="fixed inset-0 z-[170] overflow-y-auto bg-noir-950 fade-in">
        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-10 md:py-12">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-noir-800 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Logo compact />
              <span className="font-mono text-[10px] uppercase tracking-wide2 text-noir-400">/ {label("Painel de edição", "Edit dashboard")}</span>
              {email && <span className="hidden rounded-full border border-noir-700 px-3 py-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-300 md:inline">{email}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => refreshRows()} className="rounded-full border border-noir-700 px-3 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream">{label("Atualizar", "Refresh")}</button>
              <button onClick={() => setHeroOpen(true)} className="rounded-full border border-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-accent transition-colors hover:bg-accent hover:text-noir-950">{label("Editar Banner", "Edit Hero")}</button>
              <button onClick={() => setEditing(true)} className="rounded-full bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.02]">{label("Ativar modo edição", "Turn edit mode on")}</button>
              <button onClick={() => (onLogout ? onLogout() : logout())} className="rounded-full border border-noir-700 px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream">{label("Sair", "Sign out")}</button>
              <button onClick={onClose} className="rounded-full border border-noir-700 p-2 text-noir-400 transition-colors hover:border-noir-500 hover:text-cream" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          </div>

          {/* Projetos */}
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-noir-400">{label("Clique em qualquer projeto para abrir o editor completo.", "Click any project to open the full editor.")}</p>
          <SpectrumBar className="mt-8" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rowsLoading && <div className="col-span-full rounded-sm border border-noir-800 bg-noir-900 px-4 py-3 font-mono text-[10px] uppercase tracking-wide2 text-noir-400">{label("Carregando…", "Loading…")}</div>}
            {rows.map((p) => {
              const hasDraft = Boolean(drafts[p.slug]);
              return (
                <button key={p.id} onClick={() => setActive(p)} className="group relative overflow-hidden rounded-sm border border-noir-700 bg-noir-900 text-left transition-all hover:border-noir-500">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                    <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent" />
                    {hasDraft && <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-950">{label("Rascunho", "Draft")}</span>}
                  </div>
                  <div className="p-4">
                    <div className="font-mono text-[9px] uppercase tracking-wide2 text-accent">{p.category} · {p.client}</div>
                    <div className="mt-1 font-display text-xl text-cream">{p.title}</div>
                    <div className="mt-2 line-clamp-2 text-xs leading-relaxed text-noir-400">{p.description}</div>
                    <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                      <span>{p.year}</span>
                      <span className="transition-colors group-hover:text-cream">{label("Editar →", "Edit →")}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filmstrip */}
          <div className="mt-16">
            <SpectrumBar />
            <div className="mt-8 flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl text-cream">{label("Filmstrip", "Filmstrip")}</h2>
                <p className="mt-1 text-sm text-noir-400">{label("Fotos independentes da faixa animada. Ao clicar, abre em tela cheia.", "Independent photos in the animated strip. Click opens fullscreen.")}</p>
              </div>
              <button onClick={addFilmstripItem} className="shrink-0 rounded-full border border-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-accent transition-colors hover:bg-accent hover:text-noir-950">+ {label("Adicionar", "Add")}</button>
            </div>
            {filmstripMsg && <div className={`mt-4 rounded-sm border px-4 py-3 font-mono text-[11px] ${filmstripMsg.startsWith("Erro") ? "border-red-700 bg-red-950 text-red-300" : "border-green-700 bg-green-950 text-green-300"}`}>{filmstripMsg}</div>}
            {filmstripLoading ? <div className="mt-6 font-mono text-[10px] text-noir-500">{label("Carregando…", "Loading…")}</div> : (
              <>
                {filmstrip.length > 0 && (
                  <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                    {filmstrip.map((s, i) => (
                      <div key={i} className="shrink-0 text-center" style={{ width: 100 }}>
                        <div className="relative overflow-hidden rounded-sm border border-noir-700" style={{ width: 100, height: 62 }}>
                          {s.url ? <img src={s.url} alt={s.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-noir-800 font-mono text-[9px] text-noir-500">vazia</div>}
                        </div>
                        <div className="mt-1 truncate font-mono text-[8px] text-noir-400">{s.title || "—"}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-col gap-3">
                  {filmstrip.map((s, i) => (
                    <div key={i} className="rounded-sm border border-noir-800 bg-noir-900 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wide2 text-accent">{label("Foto", "Photo")} {i + 1}</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveFilmstripItem(i, -1)} disabled={i === 0} className="rounded p-1 text-noir-500 hover:text-cream disabled:opacity-20">↑</button>
                          <button onClick={() => moveFilmstripItem(i, 1)} disabled={i === filmstrip.length - 1} className="rounded p-1 text-noir-500 hover:text-cream disabled:opacity-20">↓</button>
                          <button onClick={() => removeFilmstripItem(i)} className="rounded p-1 text-noir-500 hover:text-red-400">✕</button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {s.url && <img src={s.url} alt={s.title} className="h-16 w-24 shrink-0 rounded-sm border border-noir-700 object-cover" />}
                        <div className="flex flex-1 flex-col gap-2">
                          <label className="block">
                            <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">URL</span>
                            <input value={s.url} onChange={(e) => updateFilmstripItem(i, "url", e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none" />
                          </label>
                          <label className="block">
                            <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">{label("Nome (lightbox)", "Name (lightbox)")}</span>
                            <input value={s.title} onChange={(e) => updateFilmstripItem(i, "title", e.target.value)} placeholder={`${label("Foto", "Photo")} ${String(i + 1).padStart(2, "0")}`} className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none" />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filmstrip.length === 0 && <p className="text-xs text-noir-600">{label("Nenhuma foto. Clique em '+ Adicionar'.", "No photos. Click '+ Add'.")}</p>}
                </div>
                {filmstrip.length > 0 && (
                  <button onClick={saveFilmstrip} disabled={filmstripSaving} className="mt-6 rounded-full bg-cream px-8 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.02] disabled:opacity-60">
                    {filmstripSaving ? label("Salvando…", "Saving…") : label("Salvar filmstrip", "Save filmstrip")}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Clientes / Logos */}
          <div className="mt-16">
            <SpectrumBar />
            <div className="mt-8 flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl text-cream">{label("Clientes & Logos", "Clients & Logos")}</h2>
                <p className="mt-1 text-sm text-noir-400">{label("Adicione ou remova clientes. Com logo PNG, exibe a imagem; sem logo, exibe o nome em texto. Todos ficam harmoniosos — altura fixa, filtro branco.", "Add or remove clients. With PNG logo shows image; without shows name as text. All harmonious — fixed height, white filter.")}</p>
              </div>
              <button onClick={addClient} className="shrink-0 rounded-full border border-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-accent transition-colors hover:bg-accent hover:text-noir-950">+ {label("Adicionar", "Add")}</button>
            </div>
            {clientsMsg && <div className={`mt-4 rounded-sm border px-4 py-3 font-mono text-[11px] ${clientsMsg.startsWith("Erro") ? "border-red-700 bg-red-950 text-red-300" : "border-green-700 bg-green-950 text-green-300"}`}>{clientsMsg}</div>}
            {clientsLoading ? <div className="mt-6 font-mono text-[10px] text-noir-500">{label("Carregando…", "Loading…")}</div> : (
              <>
                {/* Preview marquee */}
                {clients.length > 0 && (
                  <div className="mt-6 flex gap-8 overflow-x-auto rounded-sm border border-noir-800 bg-noir-900 px-6 py-5">
                    {clients.map((c, i) => (
                      <div key={i} className="flex shrink-0 items-center gap-8">
                        {c.logo_url ? (
                          <img src={c.logo_url} alt={c.name} className="h-8 w-auto max-w-[100px] object-contain opacity-60" style={{ filter: "brightness(0) invert(1)" }} />
                        ) : (
                          <span className="whitespace-nowrap font-display text-2xl font-light text-noir-300">{c.name || "—"}</span>
                        )}
                        {i < clients.length - 1 && <span className="inline-block h-1.5 w-1.5 rotate-45 bg-accent/70" />}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3">
                  {clients.map((c, i) => (
                    <div key={i} className="rounded-sm border border-noir-800 bg-noir-900 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wide2 text-accent">{label("Cliente", "Client")} {i + 1}</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveClient(i, -1)} disabled={i === 0} className="rounded p-1 text-noir-500 hover:text-cream disabled:opacity-20">↑</button>
                          <button onClick={() => moveClient(i, 1)} disabled={i === clients.length - 1} className="rounded p-1 text-noir-500 hover:text-cream disabled:opacity-20">↓</button>
                          <button onClick={() => removeClient(i)} className="rounded p-1 text-noir-500 hover:text-red-400">✕</button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {/* Preview do logo */}
                        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-sm border border-noir-700 bg-noir-950">
                          {c.logo_url ? (
                            <img src={c.logo_url} alt={c.name} className="h-8 w-auto max-w-[80px] object-contain" style={{ filter: "brightness(0) invert(1)" }} />
                          ) : (
                            <span className="font-mono text-[8px] text-noir-600">sem logo</span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <label className="block">
                            <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">{label("Nome do cliente", "Client name")}</span>
                            <input value={c.name} onChange={(e) => updateClient(i, "name", e.target.value)} placeholder="Ex: Hermès" className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none" />
                          </label>
                          <div className="flex gap-2">
                            <label className="block flex-1">
                              <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">URL do logo (PNG)</span>
                              <input value={c.logo_url} onChange={(e) => updateClient(i, "logo_url", e.target.value)} placeholder="https://... ou vazio para texto" className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none" />
                            </label>
                            <div className="flex flex-col justify-end">
                              <button
                                onClick={() => openLogoCropper(i)}
                                className="rounded-sm border border-noir-700 px-3 py-2 font-mono text-[9px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-accent hover:text-accent"
                              >
                                {label("Ver preview", "Preview")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {clients.length === 0 && <p className="text-xs text-noir-600">{label("Nenhum cliente. Clique em '+ Adicionar'.", "No clients. Click '+ Add'.")}</p>}
                </div>

                {clients.length > 0 && (
                  <button onClick={saveClients} disabled={clientsSaving} className="mt-6 rounded-full bg-cream px-8 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.02] disabled:opacity-60">
                    {clientsSaving ? label("Salvando…", "Saving…") : label("Salvar clientes", "Save clients")}
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      <ProjectEditor open={Boolean(active)} project={active} onClose={() => setActive(null)} />
      <HeroEditor open={heroOpen} onClose={() => setHeroOpen(false)} />
      <LogoCropper
        open={logoCropperOpen}
        onClose={() => setLogoCropperOpen(false)}
        onSave={onLogoSave}
      />
    </>
  );
}
