import { go } from "../lib/adminRoute";

export default function AdminAccessButton() {
  return (
    <button
      onClick={() => go("/admin/login")}
      className="fixed left-3 bottom-3 z-[65] flex h-7 items-center gap-1.5 rounded-full border border-noir-100/8 bg-noir-950/25 px-2.5 font-mono text-[8px] uppercase tracking-[0.2em] text-noir-100/28 backdrop-blur-sm transition-all duration-500 hover:border-noir-100/20 hover:bg-noir-950/80 hover:text-noir-100/85"
      aria-label="Acessar admin"
    >
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4.5 7V5.2C4.5 3.25 5.9 2 8 2s3.5 1.25 3.5 3.2V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="3" y="7" width="10" height="7" rx="1.8" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 10v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span>Admin</span>
    </button>
  );
}