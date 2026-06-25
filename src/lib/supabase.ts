import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase.
 *
 * Lê as credenciais de variáveis de ambiente Vite.
 * Em build/preview na Vercel, configure VITE_SUPABASE_URL e
 * VITE_SUPABASE_ANON_KEY em Project Settings → Environment Variables.
 *
 * A segurança é feita por RLS no banco — esta chave anon é pública.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // Não quebra a aplicação em dev/build: avisa no console e os
  // hooks de dados caem nos defaults estáticos.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não definidas. Usando dados de fallback."
  );
}

export const supabase = createClient(url ?? "http://localhost", anon ?? "anon", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
  realtime: { params: { eventsPerSecond: 5 } },
});

/** Helper: Supabase está configurado e pode ser usado. */
export const isSupabaseConfigured = Boolean(url && anon);
