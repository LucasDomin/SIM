import { useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useAdmin } from "../contexts/AdminContext";
import type { Project } from "../data/defaults";
import { ProjectEditor } from "./ProjectEditor";
import { HeroEditor } from "./HeroEditor";
import { Logo } from "./Logo";
import { SpectrumBar } from "./ui";
import { supabase } from "../lib/supabase";

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

  // Stills editor state
  const [stillsProject, setStillsProject] = useState<string | null>(null);
  const [stillsForm, setStillsForm] = useState<Record<string, string[]>>({});
  const [stillsSaving, setStillsSaving] = useState<string | null>(null);
  const [stillsMsg, setStillsMsg] = useState<string | null>(null);

  if (!open || !authenticated) return null;

  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const openStillsEditor = (slug: string, stills: string[]) => {
    setStillsProject(slug);
    setStillsForm((f) => ({ ...f, [slug]: [...(f[slug] ?? stills)] }));
    setStillsMsg(null);
  };

  const updateStill = (slug: string, i: number, val: string) => {
    setStillsForm((f) => {
      const next = [...(f[slug] ?? [])];
      next[i] = val;
      return { ...f, [slug]: next };
    });
  };

  const removeStill = (slug: string, i: number) => {
    setStillsForm((f) => ({
      ...f,
      [slug]: (f[slug] ?? []).filter((_, idx) => idx !== i),
    }));
  };

  const addStill = (slug: string) => {
    setStillsForm((f) => ({ ...f, [slug]: [...(f[slug] ?? []), ""] }));
  };

  const moveStill = (slug: string, i: number, dir: -1 | 1) => {
    setStillsForm((f) => {
      const next = [...(f[slug] ?? [])];
      const swap = i + dir;
      if (swap < 0 || swap >= next.length) return f;
      [next[i], next[swap]] = [next[swap], next[i]];
      return { ...f, [slug]: next };
    });
  };

  const saveStills = async (slug: string) => {
    setStillsSaving(slug);
    setStillsMsg(null);
    const stills = (stillsForm[slug] ?? []).filter((s) => s.trim() !== "");
    const { error } = await supabase
      .from("projects")
      .update({ stills, updated_at: new Date().toISOString() })
      .eq("slug", slug);
    setStillsSaving(null);
    if (error) {
      setStillsMsg("Erro: " + error.message);
    } else {
      setStillsMsg("Stills salvos com sucesso!");
      await refreshRows();
      setTimeout(() => setStillsMsg(null), 3000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[170] overflow-y-auto bg-noir-950 fade-in">
        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-10 md:py-12">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-noir-800 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Logo compact />
              <span className="font-mono text-[10px] uppercase tracking-wide2 text-noir-400">
                / {label("Painel de edição", "Edit dashboard")}
              </span>
              {email && (
                <span className="hidden rounded-full border border-noir-700 px-3 py-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-300 md:inline">
                  {email}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => refreshRows()}
                className="rounded-full border border-noir-700 px-3 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream"
              >
                {label("Atualizar", "Refresh")}
              </button>
              <button
                onClick={() => setHeroOpen(true)}
                className="rounded-full border border-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-accent transition-colors hover:bg-accent hover:text-noir-950"
              >
                {label("Editar Banner", "Edit Hero")}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="rounded-full bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.02]"
              >
                {label("Ativar modo edição", "Turn edit mode on")}
              </button>
              <button
                onClick={() => (onLogout ? onLogout() : logout())}
                className="rounded-full border border-noir-700 px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream"
              >
                {label("Sair", "Sign out")}
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-noir-700 p-2 text-noir-400 transition-colors hover:border-noir-500 hover:text-cream"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Projetos */}
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-noir-400">
            {label(
              "Clique em qualquer projeto para abrir o editor completo.",
              "Click any project to open the full editor."
            )}
          </p>

          <SpectrumBar className="mt-8" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rowsLoading && (
              <div className="col-span-full rounded-sm border border-noir-800 bg-noir-900 px-4 py-3 font-mono text-[10px] uppercase tracking-wide2 text-noir-400">
                {label("Carregando do Supabase…", "Loading from Supabase…")}
              </div>
            )}
            {rows.map((p) => {
              const hasDraft = Boolean(drafts[p.slug]);
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p)}
                  className="group relative overflow-hidden rounded-sm border border-noir-700 bg-noir-900 text-left transition-all hover:border-noir-500"
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent" />
                    {hasDraft && (
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-950">
                        {label("Rascunho", "Draft")}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-mono text-[9px] uppercase tracking-wide2 text-accent">
                      {p.category} · {p.client}
                    </div>
                    <div className="mt-1 font-display text-xl text-cream">{p.title}</div>
                    <div className="mt-2 line-clamp-2 text-xs leading-relaxed text-noir-400">
                      {p.description}
                    </div>
                    <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                      <span>{p.year}</span>
                      <span className="transition-colors group-hover:text-cream">
                        {label("Editar →", "Edit →")}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seção de Stills por Projeto */}
          {!rowsLoading && rows.length > 0 && (
            <div className="mt-16">
              <SpectrumBar />
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl text-cream">
                    {label("Filmstrip — Fotos por Projeto", "Filmstrip — Photos by Project")}
                  </h2>
                  <p className="mt-1 text-sm text-noir-400">
                    {label(
                      "Edite as fotos que aparecem na faixa animada abaixo dos projetos.",
                      "Edit the photos shown in the animated strip below the projects."
                    )}
                  </p>
                </div>
              </div>

              {stillsMsg && (
                <div className={`mt-4 rounded-sm border px-4 py-3 font-mono text-[11px] ${stillsMsg.startsWith("Erro") ? "border-red-700 bg-red-950 text-red-300" : "border-green-700 bg-green-950 text-green-300"}`}>
                  {stillsMsg}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-6">
                {rows.map((p) => {
                  const isOpen = stillsProject === p.slug;
                  const currentStills = stillsForm[p.slug] ?? (p.stills as string[]) ?? [];

                  return (
                    <div key={p.slug} className="rounded-sm border border-noir-700 bg-noir-900">
                      {/* Cabeçalho do projeto */}
                      <button
                        onClick={() => isOpen ? setStillsProject(null) : openStillsEditor(p.slug, p.stills as string[])}
                        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-noir-800"
                      >
                        <img
                          src={p.cover}
                          alt={p.title}
                          className="h-12 w-20 shrink-0 rounded-sm object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-mono text-[9px] uppercase tracking-wide2 text-accent">
                            {p.category} · {p.client}
                          </div>
                          <div className="font-display text-lg text-cream">{p.title}</div>
                          <div className="font-mono text-[9px] text-noir-500">
                            {(p.stills as string[])?.length ?? 0} {label("fotos", "photos")}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wide2 text-noir-400 transition-colors hover:text-cream">
                          {isOpen ? label("Fechar ↑", "Close ↑") : label("Editar fotos ↓", "Edit photos ↓")}
                        </span>
                      </button>

                      {/* Editor de stills */}
                      {isOpen && (
                        <div className="border-t border-noir-800 p-4">
                          {/* Preview das fotos */}
                          {currentStills.length > 0 && (
                            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                              {currentStills.map((s, i) => (
                                <div
                                  key={i}
                                  className="relative shrink-0 overflow-hidden rounded-sm border border-noir-700"
                                  style={{ width: 100, height: 62 }}
                                >
                                  {s ? (
                                    <img src={s} alt={`still ${i + 1}`} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-noir-800 font-mono text-[9px] text-noir-500">
                                      vazia
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-noir-950/70 px-1 py-0.5 font-mono text-[8px] text-noir-400">
                                    {i + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Campos de URL */}
                          <div className="flex flex-col gap-2">
                            {currentStills.map((s, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="w-4 shrink-0 font-mono text-[9px] text-noir-500">{i + 1}</span>
                                <input
                                  value={s}
                                  onChange={(e) => updateStill(p.slug, i, e.target.value)}
                                  placeholder="https://..."
                                  className="min-w-0 flex-1 rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                                />
                                <button
                                  onClick={() => moveStill(p.slug, i, -1)}
                                  disabled={i === 0}
                                  className="shrink-0 rounded p-1 text-noir-500 transition-colors hover:text-cream disabled:opacity-20"
                                >↑</button>
                                <button
                                  onClick={() => moveStill(p.slug, i, 1)}
                                  disabled={i === currentStills.length - 1}
                                  className="shrink-0 rounded p-1 text-noir-500 transition-colors hover:text-cream disabled:opacity-20"
                                >↓</button>
                                <button
                                  onClick={() => removeStill(p.slug, i)}
                                  className="shrink-0 rounded p-1 text-noir-500 transition-colors hover:text-red-400"
                                >✕</button>
                              </div>
                            ))}
                            {currentStills.length === 0 && (
                              <p className="text-xs text-noir-600">
                                {label("Nenhuma foto adicionada.", "No photos added.")}
                              </p>
                            )}
                          </div>

                          {/* Botões */}
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => addStill(p.slug)}
                              className="rounded-full border border-noir-700 px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-accent hover:text-accent"
                            >
                              + {label("Adicionar foto", "Add photo")}
                            </button>
                            <button
                              onClick={() => saveStills(p.slug)}
                              disabled={stillsSaving === p.slug}
                              className="rounded-full bg-cream px-6 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.02] disabled:opacity-60"
                            >
                              {stillsSaving === p.slug
                                ? label("Salvando…", "Saving…")
                                : label("Salvar fotos", "Save photos")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      <ProjectEditor open={Boolean(active)} project={active} onClose={() => setActive(null)} />
      <HeroEditor open={heroOpen} onClose={() => setHeroOpen(false)} />
    </>
  );
}
