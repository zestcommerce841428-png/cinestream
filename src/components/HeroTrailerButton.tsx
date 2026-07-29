'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from '@/components/VideoModal';

export default function HeroTrailerButton({ videoKey }: { videoKey: string | null }) {
  const [open, setOpen] = useState(false);

  if (!videoKey) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-105"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Watch Trailer</span>
      </button>
      <VideoModal videoKey={open ? videoKey : null} onClose={() => setOpen(false)} />
    </>
  );
}
