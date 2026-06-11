import { useState } from 'react';

export default function Settings() {
  const [siteName, setSiteName] = useState('SIM - Still In Moviment');
  const [siteDescription, setSiteDescription] = useState('Cinematic Photography & Audiovisual Studio');

  const handleSave = () => {
    // TODO: Save to Supabase
    alert('Configurações salvas (em desenvolvimento)');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-noir-50">Configurações</h1>
        <p className="text-noir-400 mt-2">Configure o site</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-noir-900 rounded-xl border border-noir-100/10 p-6 space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] text-noir-400 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-noir-800 border border-noir-100/10 rounded-lg px-4 py-3 text-noir-50 outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] text-noir-400 mb-2">
              Descrição
            </label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
              className="w-full bg-noir-800 border border-noir-100/10 rounded-lg px-4 py-3 text-noir-50 outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-accent text-noir-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-noir-50 transition-colors"
          >
            Salvar Configurações
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-6 bg-noir-900/50 rounded-xl border border-noir-100/10">
          <h3 className="text-sm text-noir-50 mb-2">Informações do Sistema</h3>
          <div className="space-y-2 text-xs text-noir-400 font-mono">
            <p>Versão: 1.0.0</p>
            <p>Build: {new Date().toLocaleDateString('pt-BR')}</p>
            <p>Supabase: {import.meta.env.VITE_SUPABASE_URL ? 'Conectado' : 'Não configurado'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
