import { useCMS } from "../../hooks/useCMS";
import { AdminCard } from "../components/AdminCard";
import { go } from "../../lib/adminRoute";

export default function DashboardPage() {
  const { content, media } = useCMS();
  const cards = [
    ["Textos", content.length, "/admin/content"],
    ["Imagens", media.filter((m) => m.kind === "image").length, "/admin/media?kind=image"],
    ["Vídeos", media.filter((m) => m.kind === "video").length, "/admin/media?kind=video"],
  ];
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">SIM CMS</p>
      <h1 className="font-display text-5xl md:text-6xl mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {cards.map(([label, value, href]) => (
          <AdminCard key={String(label)}>
            <div className="text-noir-400 text-sm mb-3">{label}</div>
            <div className="font-display text-5xl text-noir-50 mb-5">{value}</div>
            <button onClick={() => go(String(href))} className="text-accent text-sm">Gerenciar →</button>
          </AdminCard>
        ))}
      </div>
      <AdminCard>
        <h2 className="font-display text-2xl mb-4">Edição rápida</h2>
        <p className="text-noir-300 mb-4">Quando logado, volte ao site público e ative o botão discreto “Editar Conteúdo” no canto inferior esquerdo.</p>
        <button onClick={() => go("/")} className="rounded-full bg-noir-50 text-noir-900 px-4 py-2 text-sm">Ver site</button>
      </AdminCard>
    </section>
  );
}