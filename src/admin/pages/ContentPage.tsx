import { useMemo, useState } from "react";
import { useCMS } from "../../hooks/useCMS";
import { saveContentItem } from "../../lib/cmsRepository";
import type { ContentItem } from "../../types/cms";
import { AdminButton, AdminCard } from "../components/AdminCard";

export default function ContentPage() {
  const { content, refresh } = useCMS();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const filtered = useMemo(() => content.filter((item) => `${item.friendlyName} ${item.category} ${item.value}`.toLowerCase().includes(query.toLowerCase())), [content, query]);

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Textos</p><h1 className="font-display text-5xl">Conteúdo</h1></div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar conteúdo..." className="bg-noir-800 rounded-full px-5 py-3 outline-none text-sm" />
      </div>
      <div className="space-y-3">
        {filtered.map((item) => <ContentRow key={item.id} item={item} onEdit={() => setEditing(item)} />)}
      </div>
      {editing && <ContentModal item={editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await refresh(); }} />}
    </section>
  );
}

function ContentRow({ item, onEdit }: { item: ContentItem; onEdit: () => void }) {
  return (
    <AdminCard className="grid md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-3"><div className="text-noir-50 font-medium">{item.friendlyName}</div><div className="text-xs text-noir-500">{item.id}</div></div>
      <div className="md:col-span-2 text-sm text-noir-400">{item.category}</div>
      <div className="md:col-span-5 text-sm text-noir-300 truncate">{item.value}</div>
      <div className="md:col-span-1 text-xs text-noir-500">{new Date(item.updatedAt).toLocaleDateString("pt-BR")}</div>
      <div className="md:col-span-1 text-right"><AdminButton onClick={onEdit}>Editar</AdminButton></div>
    </AdminCard>
  );
}

function ContentModal({ item, onClose, onSaved }: { item: ContentItem; onClose: () => void; onSaved: () => void }) {
  const [value, setValue] = useState(item.value);
  return (
    <div className="fixed inset-0 z-[120] bg-noir-950/80 backdrop-blur-xl grid place-items-center p-5">
      <form className="glass rounded-3xl p-6 w-full max-w-2xl" onSubmit={async (e) => { e.preventDefault(); await saveContentItem({ ...item, value }); onSaved(); }}>
        <h2 className="font-display text-3xl mb-2">{item.friendlyName}</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-5">{item.category} · {item.id}</p>
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={8} className="w-full bg-noir-800 rounded-2xl p-4 outline-none mb-5" />
        <div className="flex justify-end gap-3"><AdminButton tone="dark" onClick={onClose}>Cancelar</AdminButton><AdminButton type="submit">Salvar</AdminButton></div>
      </form>
    </div>
  );
}