import { useEffect, useState } from "react";
import type { Project } from "../data/defaults";
import { useLang } from "../contexts/LanguageContext";
import { useAdmin } from "../contexts/AdminContext";
import { ImageCropper } from "./ImageCropper";
import { cn } from "../lib/cn";
import {
  sanitizeImageUrl,
  sanitizeMediaUrl,
  sanitizeText,
} from "../lib/sanitize";

export function ProjectEditor({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const { updateDraft, commitDraft, resetDraft, getProject } = useAdmin();
  const [cropperOpen, setCropperOpen] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    client: string;
    category: string;
    description: string;
    year: string;
    location: string;
    format: string;
    cover: string;
    video: string;
    poster: string;
    stills: string[];
  }>({
    title: "",
    client: "",
    category: "",
    description: "",
    year: "",
    location: "",
    format: "",
    cover: "",
    video: "",
    poster: "",
    stills: [],
  });

  useEffect(() => {
    if (!open || !project) return;
    const merged = getProject(project);
    setForm({
      title: merged.title,
      client: merged.client,
      category: merged.category,
      description: merged.description,
      year: merged.year,
      location: merged.location,
      format: merged.format,
      cover: merged.cover,
      video: merged.video || "",
      poster: merged.poster || "",
      stills: merged.stills ?? [],
    });
  }, [open, project, getProject]);

  if (!open || !project) return null;

  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const save = () => {
    updateDraft(project.slug, {
      title: sanitizeText(form.title, 120),
      client: sanitizeText(form.client, 120),
      description: sanitizeText(form.description, 1200),
      cover: sanitizeImageUrl(form.cover),
      year: sanitizeText(form.year, 12),
      location: sanitizeText(form.location, 120),
      format: sanitizeText(form.format, 120),
      category: sanitizeText(form.category, 60),
      video: sanitizeMediaUrl(form.video),
      poster: sanitizeImageUrl(form.poster),
    });
    // Salva stills separadamente via siteRepo
    import("../lib/siteRepo").then(({ supabase: _s }) => {});
    // Atualiza stills diretamente no draft via contexto
    updateDraft(project.slug, { stills: form.stills } as any);
    commitDraft(project.slug);
    onClose();
  };

  const reset = () => {
    resetDraft(project.slug);
    onClose();
  };

  const onCropSave = (payload: { url: string; crop: { x: number; y: number; scale: number } }) => {
    const safe = sanitizeImageUrl(payload.url);
    if (!safe) return;
    setForm((f) => ({ ...f, cover: safe }));
    updateDraft(project.slug, { cover: safe, coverCrop: payload.crop });
    setCropperOpen(false);
  };

  const updateStill = (i: number, val: string) => {
    setForm((f) => {
      const next = [...f.stills];
      next[i] = val;
      return { ...f, stills: next };
    });
  };

  const removeStill = (i: number) => {
    setForm((f) => ({ ...f, stills: f.stills.filter((_, idx) => idx !== i) }));
  };

  const addStill = () => {
    setForm((f) => ({ ...f, stills: [...f.stills, ""] }));
  };

  const moveStill = (i: number, dir: -1 | 1) => {
    setForm((f) => {
      const next = [...f.stills];
      const swap = i + dir;
      if (swap < 0 || swap >= next.length) return f;
      [next[i], next[swap]] = [next[swap], next[i]];
      return { ...f, stills: next };
    });
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-noir-950/90 p-4 backdrop-blur-md fade-in">
      <div className="relative grid w-full max-w-6xl gap-5 rounded-sm border border-noir-700 bg-noir-900 p-5 md:grid-cols-[1fr_420px] md:p-8 fade-up overflow-y-auto max-h-[95vh]">
        <div className="flex items-center justify-between md:col-span-2">
          <div>
            <h3 className="font-display text-2xl text-cream">
              {label("Editar projeto", "Edit project")}
            </h3>
            <p className="mt-1 text-sm text-noir-400">
              {label(
                "Pré-visualize antes de salvar — texto e imagem são atualizados em tempo real.",
                "Preview before saving — text and image update in real time."
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-noir-700 p-2 text-noir-400 transition-colors hover:border-noir-500 hover:text-cream"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Live preview */}
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
            {label("Pré-visualização", "Live preview")}
          </div>
          <div className="overflow-hidden rounded-sm border border-noir-700 bg-noir-950">
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16 / 10",
                backgroundImage: `url(${form.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                <div className="font-mono text-[10px] uppercase tracking-wide2 text-accent">
                  {form.category} · {form.client}
                </div>
                <div className="mt-1 font-display text-3xl text-cream">{form.title || "—"}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 text-left text-sm text-noir-300">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("Ano", "Year")}
                </div>
                <div>{form.year}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("Local", "Location")}
                </div>
                <div>{form.location}</div>
              </div>
              <div className="col-span-2">
                <div className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("Formato", "Format")}
                </div>
                <div>{form.format}</div>
              </div>
              <div className="col-span-2">
                <div className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("Descrição", "Description")}
                </div>
                <div className="text-sm leading-relaxed text-noir-300">{form.description}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCropperOpen(true)}
            className="mt-3 w-full rounded-full border border-noir-700 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-200 transition-colors hover:border-noir-500 hover:text-cream"
          >
            {label("Abrir editor de imagem / crop", "Open image editor / crop")}
          </button>

          {/* Stills preview */}
          {form.stills.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                {label("Preview dos stills", "Stills preview")}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {form.stills.map((s, i) => (
                  <div
                    key={i}
                    className="relative shrink-0 overflow-hidden rounded-sm border border-noir-700"
                    style={{ width: 100, height: 62 }}
                  >
                    {s ? (
                      <img src={s} alt={`still ${i + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-noir-800 font-mono text-[9px] text-noir-500">
                        URL vazia
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-noir-950/70 px-1 py-0.5 font-mono text-[8px] text-noir-400">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <Field
            label={label("Título", "Title")}
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          />
          <Field
            label={label("Cliente", "Client")}
            value={form.client}
            onChange={(v) => setForm((f) => ({ ...f, client: v }))}
          />
          <Field
            label={label("Categoria", "Category")}
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v }))}
          />
          <Field
            label={label("Ano", "Year")}
            value={form.year}
            onChange={(v) => setForm((f) => ({ ...f, year: v }))}
          />
          <Field
            label={label("Localização", "Location")}
            value={form.location}
            onChange={(v) => setForm((f) => ({ ...f, location: v }))}
          />
          <Field
            label={label("Formato", "Format")}
            value={form.format}
            onChange={(v) => setForm((f) => ({ ...f, format: v }))}
          />
          <Textarea
            label={label("Descrição", "Description")}
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          />

          {/* Stills */}
          <div className="mt-2 border-t border-noir-800 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wide2 text-accent">
                {label("Fotos do filmstrip (stills)", "Filmstrip photos (stills)")}
              </div>
              <button
                onClick={addStill}
                className="rounded-full border border-noir-700 px-3 py-1 font-mono text-[9px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-accent hover:text-accent"
              >
                + {label("Adicionar", "Add")}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.stills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-4 shrink-0 font-mono text-[9px] text-noir-500">{i + 1}</span>
                  <input
                    value={s}
                    onChange={(e) => updateStill(i, e.target.value)}
                    placeholder="https://..."
                    className="min-w-0 flex-1 rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={() => moveStill(i, -1)}
                    disabled={i === 0}
                    className="shrink-0 rounded p-1 text-noir-500 transition-colors hover:text-cream disabled:opacity-20"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveStill(i, 1)}
                    disabled={i === form.stills.length - 1}
                    className="shrink-0 rounded p-1 text-noir-500 transition-colors hover:text-cream disabled:opacity-20"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeStill(i)}
                    className="shrink-0 rounded p-1 text-noir-500 transition-colors hover:text-spec-2"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {form.stills.length === 0 && (
                <p className="text-xs text-noir-600">
                  {label("Nenhum still adicionado.", "No stills added.")}
                </p>
              )}
            </div>
          </div>

          {/* Video fields */}
          <div className="mt-2 border-t border-noir-800 pt-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wide2 text-accent">
              {label("Vídeo (opcional)", "Video (optional)")}
            </div>
            <Field
              label={label("URL do vídeo", "Video URL")}
              value={form.video || ""}
              onChange={(v) => setForm((f) => ({ ...f, video: v }))}
            />
            <div className="mt-2">
              <Field
                label={label("URL da capa (poster)", "Poster URL")}
                value={form.poster || ""}
                onChange={(v) => setForm((f) => ({ ...f, poster: v }))}
              />
            </div>
            {form.video && form.poster && (
              <div className="mt-3 overflow-hidden rounded-sm border border-noir-700">
                <video
                  src={form.video}
                  poster={form.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="aspect-[16/10] w-full object-cover"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-noir-800 pt-4">
            <button
              onClick={save}
              className="w-full rounded-full bg-cream py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.01]"
            >
              {label("Salvar e publicar", "Save & publish")}
            </button>
            <button
              onClick={reset}
              className={cn(
                "w-full rounded-full border border-noir-700 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-300 transition-colors",
                "hover:border-noir-500 hover:text-cream"
              )}
            >
              {label("Restaurar original", "Restore original")}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-full border border-noir-700 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream"
            >
              {label("Cancelar", "Cancel")}
            </button>
          </div>
        </div>
      </div>

      <ImageCropper
        open={cropperOpen}
        initialImage={form.cover}
        onClose={() => setCropperOpen(false)}
        onSave={onCropSave}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-sm text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full resize-none rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-sm leading-relaxed text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
      />
    </label>
  );
}
