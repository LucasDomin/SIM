import { useEffect, useState } from "react";

export default function WhatsAppFab() {
  const [show, setShow] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    const p = setTimeout(() => setPulse(false), 9000);
    return () => { clearTimeout(t); clearTimeout(p); };
  }, []);

  const msg = encodeURIComponent("Olá, MOMENTUM. Gostaria de conversar sobre um projeto.");

  return (
    <a
      href={`https://wa.me/351900000000?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed z-[60] bottom-6 right-6 transition-all duration-700 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="WhatsApp"
    >
      <div className="relative">
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping" />
        )}
        <div className="relative glass rounded-full pl-3 pr-5 py-3 flex items-center gap-3 group hover:bg-noir-50 hover:text-noir-900 transition-colors duration-500">
          <span className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.37a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.03z" />
            </svg>
          </span>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-noir-400 group-hover:text-noir-700">Falar agora</div>
            <div className="text-[13px] text-noir-50 group-hover:text-noir-900">Vera responde em 2 min</div>
          </div>
        </div>
      </div>
    </a>
  );
}
