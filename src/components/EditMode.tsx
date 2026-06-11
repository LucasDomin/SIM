import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCMS } from "../hooks/useCMS";
import { saveContentItem } from "../lib/cmsRepository";

export default function EditMode() {
  const { user } = useAuth();
  const { content, refresh } = useCMS();
  const [enabled, setEnabled] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const item = content.find((x) => x.id === editingId);
  const [value, setValue] = useState("");

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setEnabled((x) => !x)}
        className="fixed left-5 bottom-5 z-[70] glass rounded-full px-4 py-2 text-xs text-noir-200 hover:text-noir-50"
      >
        {enabled ? "Sair do Edit Mode" : "Editar Conteúdo"}
      </button>
      {enabled && (
        <div className="fixed left-5 bottom-20 z-[70] glass rounded-2xl p-3 max-h-[360px] overflow-auto w-[280px]">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">Edit Mode</div>
          {content.slice(0, 40).map((x) => (
            <button
              key={x.id}
              onClick={() => { setEditingId(x.id); setValue(x.value); }}
              className="block w-full text-left text-xs text-noir-300 hover:text-noir-50 py-1.5 border-b border-noir-100/5"
            >
              {x.friendlyName}
            </button>
          ))}
        </div>
      )}
      {item && (
        <div className="fixed inset-0 z-[150] bg-noir-950/80 backdrop-blur-xl grid place-items-center p-5">
          <form
            className="glass rounded-3xl p-6 w-full max-w-xl"
            onSubmit={async (e) => {
              e.preventDefault();
              await saveContentItem({ ...item, value });
              await refresh();
              setEditingId(null);
            }}
          >
            <h2 className="font-display text-3xl mb-2">{item.friendlyName}</h2>
            <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={7} className="w-full bg-noir-800 rounded-2xl p-4 outline-none mb-4" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditingId(null)} className="rounded-full bg-noir-800 px-4 py-2 text-sm">Cancelar</button>
              <button className="rounded-full bg-noir-50 text-noir-900 px-4 py-2 text-sm">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}