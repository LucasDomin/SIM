import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchPublishedProjects, fetchPublishedSiteConfig, type ProjectRow, type SiteConfigRow } from "../lib/siteRepo";
import { projects as DEFAULT_PROJECTS, SITE_CONFIG as DEFAULT_SITE_CONFIG, type Project, type SiteConfig } from "../data/defaults";

type SiteData = {
  projects: Project[];
  siteConfig: SiteConfig;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const Ctx = createContext<SiteData | null>(null);

// Cache em memória compartilhado entre componentes (stale-while-revalidate)
let cache: { data: Omit<SiteData, "refresh">; at: number } | null = null;
const CACHE_TTL_MS = 60_000;

async function loadAll() {
  const [projects, siteConfig] = await Promise.all([
    fetchPublishedProjects(),
    fetchPublishedSiteConfig(),
  ]);
  return { projects, siteConfig, loading: false, error: null as string | null, at: Date.now() };
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(cache?.data.projects ?? DEFAULT_PROJECTS);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(cache?.data.siteConfig ?? DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(cache?.data.error ?? null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await loadAll();
      cache = { data: { projects: next.projects, siteConfig: next.siteConfig, loading: false, error: null }, at: Date.now() };
      setProjects(next.projects);
      setSiteConfig(next.siteConfig);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao carregar dados";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fresh = cache && Date.now() - cache.at < CACHE_TTL_MS;
    if (!fresh) {
      refresh();
    }
  }, [refresh]);

  // Realtime: escuta mudanças no Supabase e atualiza o site inteiro em tempo real.
  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof import("../lib/supabase").supabase.channel> | null = null;
    let cleanup = () => {};
    (async () => {
      try {
        const { supabase, isSupabaseConfigured } = await import("../lib/supabase");
        if (!isSupabaseConfigured || !active) return;
        channel = supabase
          .channel("public:site")
          .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, refresh)
          .on("postgres_changes", { event: "*", schema: "public", table: "site_config" }, refresh)
          .subscribe();
        cleanup = () => {
          if (channel) supabase.removeChannel(channel);
        };
      } catch {
        /* realtime é opcional */
      }
    })();
    return () => {
      active = false;
      cleanup();
    };
  }, [refresh]);

  const value = useMemo<SiteData>(
    () => ({ projects, siteConfig, loading, error, refresh }),
    [projects, siteConfig, loading, error, refresh]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteData(): SiteData {
  const v = useContext(Ctx);
  if (!v) {
    return {
      projects: DEFAULT_PROJECTS,
      siteConfig: DEFAULT_SITE_CONFIG,
      loading: false,
      error: null,
      refresh: async () => {},
    };
  }
  return v;
}

export type { ProjectRow, SiteConfigRow };
