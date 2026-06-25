import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Project } from "../data/defaults";
import { sanitizeImageUrl, sanitizeMediaUrl, sanitizeText } from "../lib/sanitize";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  fetchAllProjectsForAdmin,
  publishProject,
  saveProjectAsDraft,
  type ProjectRow,
} from "../lib/siteRepo";

type Category = Project["category"];
void (0 as unknown as Category); // type alias retained for future use

type Draft = {
  cover: string;
  coverCrop: { x: number; y: number; scale: number };
  title: string;
  client: string;
  category: string;
  description: string;
  year: string;
  location: string;
  format: string;
  video: string;
  poster: string;
};

type AdminState = {
  authenticated: boolean;
  email: string | null;
  editing: boolean;
  drafts: Record<string, Partial<Draft>>;
  rows: ProjectRow[];
  rowsLoading: boolean;
  login: (code: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  setEditing: (v: boolean) => void;
  updateDraft: (slug: string, patch: Partial<Draft>) => void;
  commitDraft: (slug: string) => Promise<{ ok: boolean; error?: string }>;
  resetDraft: (slug: string) => void;
  refreshRows: () => Promise<void>;
  publishRow: (slug: string) => Promise<{ ok: boolean; error?: string }>;
  deleteRow: (slug: string) => Promise<{ ok: boolean; error?: string }>;
  getProject: (p: Project) => Project;
};

const Ctx = createContext<AdminState | null>(null);
const EMPTY_DRAFT: Partial<Draft> = {};
const ADMIN_LOCAL_KEY = "sim-admin-v1";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"] | null>(null);
  const [localAccess, setLocalAccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Partial<Draft>>>({});
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [rowsLoading, setRowsLoading] = useState(false);

  // Restaura o gate local do editor (como era antes)
  useEffect(() => {
    try {
      if (localStorage.getItem(ADMIN_LOCAL_KEY) === "1") setLocalAccess(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Observa mudanças de autenticação do Supabase (opcional para salvar com RLS)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (active) setSession(data.session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (active) setSession(newSession);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refreshRows = useCallback(async () => {
    setRowsLoading(true);
    try {
      const data = await fetchAllProjectsForAdmin();
      setRows(data);
    } finally {
      setRowsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localAccess || session) refreshRows();
  }, [localAccess, session, refreshRows]);

  const login = useCallback(async (code: string) => {
    if (code.trim().length >= 4) {
      setLocalAccess(true);
      try {
        localStorage.setItem(ADMIN_LOCAL_KEY, "1");
      } catch {
        /* ignore */
      }
      return { ok: true };
    }
    return { ok: false, error: "Código inválido." };
  }, []);

  const logout = useCallback(async () => {
    setEditing(false);
    setLocalAccess(false);
    try {
      localStorage.removeItem(ADMIN_LOCAL_KEY);
    } catch {
      /* ignore */
    }
    if (isSupabaseConfigured && session) await supabase.auth.signOut();
  }, [session]);

  const updateDraft = useCallback((slug: string, patch: Partial<Draft>) => {
    setDrafts((prev) => ({ ...prev, [slug]: { ...(prev[slug] ?? EMPTY_DRAFT), ...patch } }));
  }, []);

  const commitDraft = useCallback(async (slug: string) => {
    const draft = drafts[slug];
    if (!draft) return { ok: true };
    const base = rows.find((r) => r.slug === slug) ?? defaultRowFromDraft(slug, draft);
    const merged: ProjectRow = { ...base, ...draft, slug, category: categoryOrFallback(draft.category, base.category) };
    const res = await saveProjectAsDraft(merged);
    if (res.ok) {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
      await refreshRows();
    }
    return res;
  }, [drafts, rows, refreshRows]);

  const publishRow = useCallback(async (slug: string) => {
    const draft = drafts[slug];
    const base = rows.find((r) => r.slug === slug);
    if (!base && !draft) return { ok: false, error: "Projeto não encontrado." };
    const merged: ProjectRow = {
      ...(base ?? defaultRowFromDraft(slug, draft ?? {})),
      ...(draft ?? {}),
      slug,
      category: categoryOrFallback(
        (draft as { category?: string } | undefined)?.category,
        base?.category
      ),
    };
    const res = await publishProject(merged);
    if (res.ok) {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
      await refreshRows();
    }
    return res;
  }, [drafts, rows, refreshRows]);

  const deleteRow = useCallback(async (slug: string) => {
    const { deleteProject } = await import("../lib/siteRepo");
    const res = await deleteProject(slug);
    if (res.ok) await refreshRows();
    return res;
  }, [refreshRows]);

  const resetDraft = useCallback((slug: string) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }, []);

  const getProject = useCallback(
    (p: Project): Project => {
      const d = drafts[p.slug];
      if (!d) return p;
      const safeText = (v: string | undefined, fallback: string, max = 1200) =>
        v != null ? sanitizeText(v, max) : fallback;
      return {
        ...p,
        title: safeText(d.title, p.title, 200),
        client: safeText(d.client, p.client, 200),
        description: safeText(d.description, p.description, 1200),
        cover: d.cover ? sanitizeImageUrl(d.cover) || p.cover : p.cover,
        year: safeText(d.year, p.year, 12),
        location: safeText(d.location, p.location, 200),
        format: safeText(d.format, p.format, 200),
        video: d.video ? sanitizeMediaUrl(d.video) || p.video : p.video,
        poster: d.poster ? sanitizeImageUrl(d.poster) || p.poster : p.poster,
      };
    },
    [drafts]
  );

  const value = useMemo<AdminState>(
    () => ({
      authenticated: Boolean(localAccess || session),
      email: session?.user?.email ?? null,
      editing,
      drafts,
      rows,
      rowsLoading,
      login,
      logout,
      setEditing,
      updateDraft,
      commitDraft,
      resetDraft,
      refreshRows,
      publishRow,
      deleteRow,
      getProject,
    }),
    [session, editing, drafts, rows, rowsLoading, login, logout, updateDraft, commitDraft, resetDraft, refreshRows, publishRow, deleteRow, getProject]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function categoryOrFallback(input: string | undefined, fallback: Project["category"] | undefined): Project["category"] {
  const allowed: Project["category"][] = ["Film", "Editorial", "Brand", "Documentary", "Fashion"];
  if (input && (allowed as string[]).includes(input)) {
    return input as Project["category"];
  }
  return (fallback as Project["category"]) ?? "Film";
}

function defaultRowFromDraft(slug: string, d: Partial<Draft>): ProjectRow {
  return {
    id: `local-${slug}`,
    slug,
    title: d.title ?? "",
    subtitle: "",
    category: (d.category as ProjectRow["category"]) ?? "Film",
    client: d.client ?? "",
    year: d.year ?? "",
    location: d.location ?? "",
    duration: "",
    format: d.format ?? "",
    cover: d.cover ?? "",
    stills: [],
    description: d.description ?? "",
    credits: [],
    color: "#d4c5a9",
    video: d.video,
    poster: d.poster,
    is_draft: true,
  };
}

export function useAdmin(): AdminState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin must be used inside <AdminProvider>");
  return v;
}
