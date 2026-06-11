import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ContentItem } from '../types/admin';

interface UseContentReturn {
  content: Record<string, ContentItem>;
  loading: boolean;
  error: string | null;
  getContent: (name: string) => ContentItem | undefined;
  getText: (name: string, fallback?: string) => string;
  getImage: (name: string, fallback?: string) => string;
  updateContent: (name: string, value: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
}

export function useContent(): UseContentReturn {
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('name');

      if (error) throw error;

      const contentMap: Record<string, ContentItem> = {};
      data?.forEach((item) => {
        contentMap[item.name] = item as ContentItem;
      });

      setContent(contentMap);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (name: string) => content[name];

  const getText = (name: string, fallback?: string) => {
    const item = content[name];
    return item?.value || fallback || '';
  };

  const getImage = (name: string, fallback?: string) => {
    const item = content[name];
    if (item?.value?.startsWith('http')) {
      return item.value;
    }
    // Handle Supabase storage URLs
    return item?.value || fallback || '';
  };

  const updateContent = async (name: string, value: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({ 
          value,
          updated_at: new Date().toISOString(),
        })
        .eq('name', name);

      if (error) throw error;

      // Update local state
      setContent(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          updated_at: new Date().toISOString(),
        },
      }));

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to update content' };
    }
  };

  const refresh = async () => {
    setLoading(true);
    await fetchContent();
  };

  return {
    content,
    loading,
    error,
    getContent,
    getText,
    getImage,
    updateContent,
    refresh,
  };
}
