import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * ConsentContext — LGPD.
 * Apenas APÓS o consentimento o app pode escrever em localStorage.
 * Antes disso, qualquer leitura/escrita é bloqueada (no-op).
 *
 * O próprio status do consentimento é gravado no localStorage
 * (com nome explícito e amparado pelo art. 7º, II e VIII da LGPD).
 */

type ConsentValue = "granted" | "denied" | "unknown";

type Ctx = {
  status: ConsentValue;
  grant: () => void;
  deny: () => void;
  reset: () => void;
  canPersist: boolean;
};

const CONSENT_KEY = "sim-lgpd-consent";

const Context = createContext<Ctx | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentValue>("unknown");

  useEffect(() => {
    try {
      const v = localStorage.getItem(CONSENT_KEY);
      if (v === "granted" || v === "denied") setStatus(v);
    } catch {
      /* storage indisponível: navegação privada */
    }
  }, []);

  const persist = useCallback((v: ConsentValue) => {
    setStatus(v);
    try {
      if (v === "unknown") localStorage.removeItem(CONSENT_KEY);
      else localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const grant = useCallback(() => persist("granted"), [persist]);
  const deny = useCallback(() => {
    // limpa qualquer dado anterior (direito ao esquecimento – LGPD art. 18, VI)
    try {
      const keep = new Set([CONSENT_KEY]);
      const toDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("sim-") && !keep.has(k)) toDelete.push(k);
      }
      toDelete.forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    persist("denied");
  }, [persist]);
  const reset = useCallback(() => persist("unknown"), [persist]);

  const value = useMemo<Ctx>(
    () => ({
      status,
      grant,
      deny,
      reset,
      canPersist: status === "granted",
    }),
    [status, grant, deny, reset]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useConsent() {
  const v = useContext(Context);
  if (!v) throw new Error("useConsent must be used inside <ConsentProvider>");
  return v;
}

/**
 * safeStorage — wrapper de localStorage que respeita o consentimento.
 * Use sempre que for persistir preferências/rascunhos.
 */
export function makeSafeStorage(canPersist: boolean) {
  return {
    get(key: string): string | null {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key: string, value: string): boolean {
      if (!canPersist) return false;
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    remove(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}
