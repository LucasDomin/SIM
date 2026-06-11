import { useAuth } from "../../contexts/AuthContext";
import { go } from "../../lib/adminRoute";

const nav = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/content", "Conteúdo"],
  ["/admin/media", "Mídia"],
  ["/admin/settings", "Settings"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user, isDemo } = useAuth();
  return (
    <div className="min-h-screen bg-noir-950 text-noir-100">
      <aside className="fixed inset-y-0 left-0 hidden md:flex w-64 border-r border-noir-100/10 bg-noir-900/70 backdrop-blur-xl flex-col p-6">
        <div className="font-display italic text-3xl text-noir-50 mb-1">sim</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400 mb-10">Admin CMS</div>
        <nav className="space-y-1">
          {nav.map(([href, label]) => (
            <button key={href} onClick={() => go(href)} className="w-full text-left rounded-xl px-4 py-3 text-sm text-noir-300 hover:bg-noir-800 hover:text-noir-50 transition">
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="text-xs text-noir-400 break-all">{user?.email}{isDemo ? " · demo" : ""}</div>
          <button onClick={() => signOut().then(() => go("/admin/login"))} className="w-full rounded-full bg-noir-50 text-noir-900 px-4 py-2 text-sm">Logout</button>
        </div>
      </aside>
      <main className="md:pl-64">
        <header className="sticky top-0 z-20 md:hidden glass p-4 flex items-center justify-between">
          <strong>SIM Admin</strong>
          <button onClick={() => signOut().then(() => go("/admin/login"))}>Sair</button>
        </header>
        <div className="p-5 md:p-10 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}