import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalContent: number;
  totalImages: number;
  totalVideos: number;
  lastUpdate: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contentCount, imageCount, videoCount] = await Promise.all([
          supabase.from('content').select('*', { count: 'exact', head: true }),
          supabase.storage.from('images').list('', { limit: 1000 }),
          supabase.storage.from('videos').list('', { limit: 1000 }),
        ]);

        setStats({
          totalContent: contentCount.count || 0,
          totalImages: imageCount.data?.length || 0,
          totalVideos: videoCount.data?.length || 0,
          lastUpdate: new Date().toLocaleDateString('pt-BR'),
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-noir-50">Dashboard</h1>
        <p className="text-noir-400 mt-2">Visão geral do conteúdo</p>
      </div>

      {loading ? (
        <div className="text-noir-400">Carregando...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Conteúdos"
            value={stats.totalContent.toString()}
            subtitle="Textos e configurações"
          />
          <StatCard
            title="Imagens"
            value={stats.totalImages.toString()}
            subtitle="Arquivos no storage"
          />
          <StatCard
            title="Vídeos"
            value={stats.totalVideos.toString()}
            subtitle="Arquivos no storage"
          />
          <StatCard
            title="Última Atualização"
            value={stats.lastUpdate}
            subtitle="Dados atualizados"
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg text-noir-50 mb-4">Ações Rápidas</h2>
        <div className="flex gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-noir-800 hover:bg-noir-700 rounded-lg text-sm text-noir-50 transition-colors"
          >
            Ver Site →
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-noir-900 rounded-xl p-6 border border-noir-100/10">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-noir-400">{title}</p>
      <p className="text-4xl font-display text-noir-50 mt-2">{value}</p>
      <p className="text-xs text-noir-500 mt-2">{subtitle}</p>
    </div>
  );
}
