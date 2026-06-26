import { useEffect, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { clients as DEFAULT_CLIENTS } from "../data/defaults";
import { Reveal } from "./ui";

type Client = {
  id: string;
  name: string;
  logo_url: string;
  position: number;
};

export function Clients() {
  const { t } = useLang();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setClients(
        DEFAULT_CLIENTS.map((name, i) => ({ id: String(i), name, logo_url: "", position: i }))
      );
      return;
    }
    supabase
      .from("clients")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setClients(data as Client[]);
        else
          setClients(
            DEFAULT_CLIENTS.map((name, i) => ({ id: String(i), name, logo_url: "", position: i }))
          );
      });
  }, []);

  const loop = [...clients, ...clients];

  return (
    <div className="relative overflow-hidden border-y border-noir-850 bg-noir-900 py-10 md:py-12">
      <div className="mx-auto mb-7 max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
            {t.clients.label}
          </div>
        </Reveal>
      </div>
      <div className="group mask-fade-x overflow-hidden">
        <div className="animate-marquee group-hover:[animation-play-state:paused] flex w-max items-center gap-10 pr-10">
          {loop.map((c, i) => (
            <div key={i} className="flex items-center gap-10">
              {c.logo_url ? (
                <img
                  src={c.logo_url}
                  alt={c.name}
                  className="h-8 w-auto max-w-[120px] object-contain opacity-60 transition-opacity hover:opacity-100 md:h-10"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              ) : (
                <span className="whitespace-nowrap font-display text-3xl font-light text-noir-200 transition-colors hover:text-cream md:text-4xl">
                  {c.name}
                </span>
              )}
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-accent/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
