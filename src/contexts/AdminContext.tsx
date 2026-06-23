import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Project } from "../data/projects";
import { sanitizeImageUrl, sanitizeMediaUrl, sanitizeText } from "../lib/sanitize";

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
  editing: boolean;
  drafts: Record<string, Partial<Draft>>;
  login: (code: string) => boolean;
  logout: () => void;
  setEditing: (v: boolean) => void;
  updateDraft: (slug: string, patch: Partial<Draft>) => void;
  commitDraft: (slug: string) => void;
  resetDraft: (slug: string) => void;
  getProject: (p: Project) => Project;
};

const Ctx = createContext<AdminState | null>(null);
const STORAGE_KEY = "sim-admin-v1";
const DRAFT_KEY = "sim-drafts-v1";

const EMPTY_DRAFT: Partial<Draft> = {};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Partial<Draft>>>({});

  // Hydrate from localStorage (tolerante a corrupção / JSON inválido).
  useEffect(() => {
    try {
      const auth = localStorage.getItem(STORAGE_KEY);
      if (auth === "1") setAuthenticated(true);
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setDrafts(parsed as Record<string, Partial<Draft>>);
        }
      }
    } catch {
      /* JSON corrompido — descartado de forma segura */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    } catch {
      /* ignore: quota cheia ou modo privado */
    }
  }, [drafts]);

  const login = useCallback((code: string) => {
    // Demo gate: any 6+ char code unlocks (preserved from original SIM flow).
    // In production this would hit a server-side validation.
    if (code.trim().length >= 4) {
      setAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setEditing(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const updateDraft = useCallback((slug: string, patch: Partial<Draft>) => {
    setDrafts((prev) => ({ ...prev, [slug]: { ...(prev[slug] ?? EMPTY_DRAFT), ...patch } }));
  }, []);

  const commitDraft = useCallback((slug: string) => {
    // In a real build this would POST to CMS. For now, drafts are kept in
    // localStorage so the editor can revisit and refine.
    setDrafts((prev) => {
      const next = { ...prev };
      if (next[slug]) {
        next[slug] = { ...next[slug], _committed: true } as Partial<Draft>;
      }
      return next;
    });
  }, []);

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
      // Defesa em profundidade: mesmo que o storage tenha sido manipulado
      // por extensão ou pelo console, qualquer string injetada é neutralizada.
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
      authenticated,
      editing,
      drafts,
      login,
      logout,
      setEditing,
      updateDraft,
      commitDraft,
      resetDraft,
      getProject,
    }),
    [authenticated, editing, drafts, login, logout, updateDraft, commitDraft, resetDraft, getProject]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin must be used inside <AdminProvider>");
  return v;
}

export function useOptionalAdmin() {
  return useContext(Ctx);
}
