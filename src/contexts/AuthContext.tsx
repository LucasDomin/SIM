import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const demoEnabled = import.meta.env.VITE_ENABLE_DEMO_ADMIN !== "false";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUser] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setDemoUser(demoEnabled && localStorage.getItem("sim.demo.admin") === "true");
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: user ?? (demoUser ? ({ id: "demo", email: "jay@admin.com.br" } as User) : null),
    loading,
    isDemo: !isSupabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) {
        if (demoEnabled && email === "jay@admin.com.br" && password === "JayAdmin01") {
          localStorage.setItem("sim.demo.admin", "true");
          setDemoUser(true);
          return {};
        }
        return { error: "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar Supabase Auth." };
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
      localStorage.removeItem("sim.demo.admin");
      setDemoUser(false);
      setUser(null);
    },
  }), [user, loading, demoUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}