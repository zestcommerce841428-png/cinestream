'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowLeft } from 'lucide-react';
import { tmdbClient, Video } from '@/services/tmdb';

export default function TVVideosPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.id, 10);

  const [tv, setTv] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTVVideos() {
      if (!tvId) return;
      setLoading(true);
      try {
        const [tRes, vRes] = await Promise.all([
          tmdbClient.getTVDetails(tvId),
          tmdbClient.getTVVideos(tvId)
        ]);
        setTv(tRes);
        setVideos(vRes.results || []);
      } catch (e) {
        console.error('Failed loading TV videos', e);
      } finally {
        setLoading(false);
      }
    }
    loadTVVideos();
  }, [tvId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading videos...</div>;
  if (!tv) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">TV Show not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Play className="w-8 h-8 text-rose-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Trailers, Teasers & Featurettes — {tv.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 space-y-3 p-4">
            <div className="aspect-video relative rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${vid.key}`}
                title={vid.name}
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">{vid.type}</span>
              <h3 className="font-bold text-sm text-white">{vid.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
