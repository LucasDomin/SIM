import { supabase, isSupabaseConfigured } from "./supabase";
import type { Project } from "../data/defaults";
import { projects as DEFAULT_PROJECTS, SITE_CONFIG as DEFAULT_SITE_CONFIG } from "../data/defaults";
import type { SiteConfig } from "../data/defaults";

/**
 * siteRepo — única camada que fala com o Supabase.
 * O restante da aplicação consome as funções daqui, sem conhecer o cliente.
 *
 * Padrão:
 *  - "default" = rascunho em edição (visível só para o admin logado)
 *  - null = item publicado (visível para todos)
 *
 * Se a query falhar (rede, Supabase fora, etc.) caímos nos defaults estáticos
 * para o site nunca quebrar.
 */

export type ProjectRow = Project & {
  id: string;
  is_draft: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SiteConfigRow = {
  id: string;
  hero_images: string[];
  hero_scenes: string[];
  hero_reels: string[];
  hero_videos: string[];
  background_video: { url: string; poster: string };
  updated_at?: string;
};

// --- LEITURA (visitantes) ---

export async function fetchPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return DEFAULT_PROJECTS;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_draft", false)
      .order("created_at", { ascending: true });
    if (error || !data) return DEFAULT_PROJECTS;
    return (data as ProjectRow[]).map(rowToProject);
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export async function fetchAllProjectsForAdmin(): Promise<ProjectRow[]> {
  if (!isSupabaseConfigured) {
    return DEFAULT_PROJECTS.map((p, i) => ({ ...p, id: `local-${i}`, is_draft: false }));
  }
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true });
    if (error || !data) {
      return DEFAULT_PROJECTS.map((p, i) => ({ ...p, id: `local-${i}`, is_draft: false }));
    }
    return (data as ProjectRow[]).map((r) => ({ ...r, ...rowToProject(r) }));
  } catch {
    return DEFAULT_PROJECTS.map((p, i) => ({ ...p, id: `local-${i}`, is_draft: false }));
  }
}

export async function fetchPublishedSiteConfig(): Promise<SiteConfig> {
  if (!isSupabaseConfigured) return DEFAULT_SITE_CONFIG;
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error || !data) return DEFAULT_SITE_CONFIG;
    return rowToSiteConfig(data as SiteConfigRow);
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export async function fetchPricingTable(): Promise<
  Array<{ id?: string; category: string; item_name: string; base_cost: number; sale_price: number }>
> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("pricing_table")
      .select("*")
      .order("category", { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// --- ESCRITA (admin) ---

export async function saveProjectAsDraft(row: ProjectRow): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." };
  const payload = projectToRow(row, /* isDraft */ true);
  const { error } = await supabase.from("projects").upsert(payload, { onConflict: "slug" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function publishProject(row: ProjectRow): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." };
  const payload = projectToRow(row, /* isDraft */ false);
  const { error } = await supabase.from("projects").upsert(payload, { onConflict: "slug" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function fetchHeroConfig(): Promise<{
  images: string[];
  scenes: string[];
  reels: string[];
  videos: string[];
  backgroundVideo: { url: string; poster: string };
}> {
  if (!isSupabaseConfigured) throw new Error("Supabase não configurado");
  const { data, error } = await supabase
    .from("site_config")
    .select("hero_images, hero_scenes, hero_reels, hero_videos, background_video")
    .eq("id", "default")
    .maybeSingle();
  if (error || !data) throw new Error("Erro ao buscar config do hero");
  return {
    images: data.hero_images ?? [],
    scenes: data.hero_scenes ?? [],
    reels: data.hero_reels ?? [],
    videos: data.hero_videos ?? [],
    backgroundVideo: data.background_video ?? { url: "", poster: "" },
  };
}

export async function saveHeroConfig(cfg: {
  images: string[];
  scenes: string[];
  reels: string[];
  videos: string[];
  backgroundVideo: { url: string; poster: string };
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." };
  const { error } = await supabase
    .from("site_config")
    .upsert(
      {
        id: "default",
        hero_images: cfg.images,
        hero_scenes: cfg.scenes,
        hero_reels: cfg.reels,
        hero_videos: cfg.videos,
        background_video: cfg.backgroundVideo,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteProject(slug: string): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." };
  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function saveSiteConfigAsDraft(
  draft: SiteConfig
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." };
  // Para o site_config ainda mantemos a estratégia "linha publicada + rascunho
  // na mesma row" via flag lógica. Aqui guardamos rascunho separadamente:
  const { error } = await supabase
    .from("site_config")
    .update({ _draft: draft })
    .eq("id", "default");
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function publishSiteConfig(
  cfg: SiteConfig
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." };
  const payload = {
    id: "default",
    hero_images: cfg.hero.images,
    hero_scenes: cfg.hero.scenes,
    hero_reels: cfg.hero.reels,
    hero_videos: cfg.hero.videos,
    background_video: cfg.hero.backgroundVideo,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("site_config").upsert(payload);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// --- Mappers ---

function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? "",
    category: r.category as Project["category"],
    client: r.client ?? "",
    year: r.year ?? "",
    location: r.location ?? "",
    duration: r.duration,
    format: r.format ?? "",
    cover: r.cover ?? "",
    stills: r.stills ?? [],
    description: r.description ?? "",
    credits: r.credits ?? [],
    awards: r.awards,
    color: r.color ?? "#d4c5a9",
    video: r.video,
    poster: r.poster,
  };
}

function projectToRow(p: ProjectRow, isDraft: boolean): Record<string, unknown> {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? "",
    category: p.category,
    client: p.client,
    description: p.description,
    year: p.year,
    location: p.location,
    format: p.format,
    cover: p.cover,
    stills: p.stills ?? [],
    credits: p.credits ?? [],
    awards: p.awards ?? [],
    color: p.color ?? "#d4c5a9",
    video: p.video ?? "",
    poster: p.poster ?? "",
    duration: p.duration ?? "",
    is_draft: isDraft,
    updated_at: new Date().toISOString(),
  };
}

function rowToSiteConfig(r: SiteConfigRow): SiteConfig {
  return {
    hero: {
      images: r.hero_images ?? DEFAULT_SITE_CONFIG.hero.images,
      scenes: r.hero_scenes ?? DEFAULT_SITE_CONFIG.hero.scenes,
      reels: r.hero_reels ?? DEFAULT_SITE_CONFIG.hero.reels,
      videos: r.hero_videos ?? DEFAULT_SITE_CONFIG.hero.videos,
      backgroundVideo: r.background_video ?? DEFAULT_SITE_CONFIG.hero.backgroundVideo,
    },
  };
}
