'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, ArrowLeft, Download } from 'lucide-react';
import { getBackdropUrl, getImageUrl } from '@/services/tmdb';

interface GalleryTabsProps {
  movieId: number;
  movieTitle: string;
  backdrops: any[];
  posters: any[];
  logos: any[];
}

export default function GalleryTabs({ movieId, movieTitle, backdrops, posters, logos }: GalleryTabsProps) {
  const [activeTab, setActiveTab] = useState<'backdrops' | 'posters' | 'logos'>('backdrops');

  return (
    <>
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-8 h-8 text-brand-500" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Media Gallery - {movieTitle}</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">{backdrops.length} Backdrops • {posters.length} Posters • {logos.length} Logos</p>
          </div>

          <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('backdrops')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'backdrops' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Backdrops ({backdrops.length})
            </button>
            <button
              onClick={() => setActiveTab('posters')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'posters' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Posters ({posters.length})
            </button>
            <button
              onClick={() => setActiveTab('logos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'logos' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Logos ({logos.length})
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {activeTab === 'backdrops' && (
        backdrops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {backdrops.map((img: any, i: number) => (
              <div key={i} className="group relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500 transition-all shadow-xl">
                <Image src={getBackdropUrl(img.file_path, 'w780')} alt="Backdrop" fill className="object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{img.width} x {img.height}</span>
                  <a href={getBackdropUrl(img.file_path, 'original')} target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-brand-400 hover:underline">
                    <Download className="w-3.5 h-3.5" />
                    <span>High Res</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No backdrops available.</p>
        )
      )}

      {activeTab === 'posters' && (
        posters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {posters.map((img: any, i: number) => (
              <div key={i} className="group relative aspect-[2/3] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500 transition-all shadow-xl">
                <Image src={getImageUrl(img.file_path, 'w500')} alt="Poster" fill className="object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{img.width} x {img.height}</span>
                  <a href={getImageUrl(img.file_path, 'original')} target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-brand-400 hover:underline">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No posters available.</p>
        )
      )}

      {activeTab === 'logos' && (
        logos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {logos.map((img: any, i: number) => (
              <div key={i} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 flex items-center justify-center aspect-video">
                <Image src={getImageUrl(img.file_path, 'w300')} alt="Logo" width={180} height={80} className="object-contain max-h-24" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No logos available.</p>
        )
      )}
    </>
  );
}
