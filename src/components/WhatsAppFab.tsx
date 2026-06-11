import { useEffect, useState } from "react";

export default function WhatsAppFab() {
  const [show, setShow] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    const p = setTimeout(() => setPulse(false), 9000);
    return () => { clearTimeout(t); clearTimeout(p); };
  }, []);

  const msg = encodeURIComponent("Olá, SIM. Gostaria de conversar sobre um projeto.");

  return (
    <a
      href={`https://wa.me/351900000000?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed z-[60] bottom-20 right-6 md:right-10 transition-all duration-700 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Falar no WhatsApp"
    >
      <div className="relative flex items-center justify-end">
        {pulse && (
          <span className="absolute right-0 w-12 h-12 rounded-full bg-emerald-400/40 animate-ping" />
        )}

        {/* Container retrátil: largura cresce no hover */}
        <div className="relative flex items-center gap-3 rounded-full border border-noir-100/10 bg-noir-900/80 backdrop-blur-md p-1.5 overflow-hidden transition-all duration-500 ease-out max-w-[48px] group-hover:max-w-[280px] group-hover:pr-4 group-hover:bg-noir-50 group-hover:border-noir-200/30">
          {/* Ícone (sempre visível no lado esquerdo do botão compacto) */}
          <span className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.37a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.03z" />
            </svg>
          </span>

          {/* Texto (revelado no hover) */}
          <div className="flex flex-col whitespace-nowrap opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-noir-200 group-hover:text-noir-600">
              Falar agora
            </span>
            <span className="text-[14px] font-medium text-noir-50 group-hover:text-noir-950 group-hover:font-semibold">
              Vera responde em 2 min
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
