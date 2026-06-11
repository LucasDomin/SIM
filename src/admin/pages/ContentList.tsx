import { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { ContentItem } from '../../types/admin';

export default function ContentList() {
  const { content, loading, updateContent } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  const handleSave = async (name: string) => {
    const result = await updateContent(name, editValue);
    if (!result.error) {
      setEditingId(null);
    }
  };

  const groupedContent = Object.values(content).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-noir-400">Carregando conteúdos...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-noir-50">Conteúdo</h1>
        <p className="text-noir-400 mt-2">Gerencie todos os textos do site</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedContent).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-accent mb-4">
              {category}
            </h2>
            <div className="bg-noir-900 rounded-xl border border-noir-100/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-noir-100/5">
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Nome
                    </th>
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Valor
                    </th>
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Atualizado
                    </th>
                    <th className="text-right text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-noir-100/5 last:border-0">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-noir-50 text-sm">{item.friendly_name}</p>
                          <p className="text-noir-500 text-xs font-mono">{item.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-noir-800 border border-accent/50 rounded px-3 py-1.5 text-sm text-noir-50 outline-none w-full max-w-md"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(item.name);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                        ) : (
                          <p className="text-noir-300 text-sm truncate max-w-md">
                            {item.value}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-noir-400 text-xs">
                          {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {editingId === item.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleSave(item.name)}
                              className="text-xs bg-accent text-noir-900 px-3 py-1.5 rounded hover:bg-noir-50 transition-colors"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs bg-noir-800 text-noir-300 px-3 py-1.5 rounded hover:bg-noir-700 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-xs text-accent hover:text-noir-50 transition-colors"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
