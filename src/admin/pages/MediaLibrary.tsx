import { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKETS } from '../../lib/supabase';

interface MediaItem {
  name: string;
  updated_at: string | null;
  metadata?: {
    size?: number;
    width?: number;
    height?: number;
    mimetype?: string;
  } | null;
}

export default function MediaLibrary() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [imageData, videoData] = await Promise.all([
          supabase.storage.from(STORAGE_BUCKETS.IMAGES).list('', { limit: 100 }),
          supabase.storage.from(STORAGE_BUCKETS.VIDEOS).list('', { limit: 100 }),
        ]);

        setImages(imageData.data?.map(i => ({ ...i, updated_at: i.updated_at || '' })) || []);
        setVideos(videoData.data?.map(v => ({ ...v, updated_at: v.updated_at || '' })) || []);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormat = (name: string) => {
    return name.split('.').pop()?.toUpperCase() || '—';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-noir-50">Mídia</h1>
        <p className="text-noir-400 mt-2">Gerencie imagens e vídeos</p>
      </div>

      {loading ? (
        <div className="text-noir-400">Carregando...</div>
      ) : (
        <div className="space-y-8">
          {/* Images */}
          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-accent mb-4">
              Imagens ({images.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image) => (
                <div
                  key={image.name}
                  className="bg-noir-900 rounded-lg overflow-hidden border border-noir-100/10 group"
                >
                  <div className="aspect-square bg-noir-800 relative">
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${image.name}`}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-noir-50 truncate" title={image.name}>
                      {image.name}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-noir-400 font-mono">
                      <span>{getFormat(image.name)}</span>
                      <span>{formatSize(image.metadata?.size)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-noir-400 text-sm py-8 text-center">
                  Nenhuma imagem encontrada
                </div>
              )}
            </div>
          </section>

          {/* Videos */}
          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-accent mb-4">
              Vídeos ({videos.length})
            </h2>
            <div className="bg-noir-900 rounded-xl border border-noir-100/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-noir-100/5">
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Nome
                    </th>
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Formato
                    </th>
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Tamanho
                    </th>
                    <th className="text-left text-xs font-mono uppercase tracking-[0.2em] text-noir-400 py-4 px-6">
                      Atualizado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.name} className="border-b border-noir-100/5 last:border-0">
                      <td className="py-4 px-6">
                        <p className="text-noir-50 text-sm">{video.name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono text-noir-400">
                          {getFormat(video.name)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-noir-400">
                          {formatSize(video.metadata?.size ?? undefined)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-noir-400">
                          {video.updated_at ? new Date(video.updated_at).toLocaleDateString('pt-BR') : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {videos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-noir-400 text-sm">
                        Nenhum vídeo encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
