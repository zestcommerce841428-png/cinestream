import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import ProviderFilters from '@/components/ProviderFilters';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: 'Global Streaming Watch Providers',
  description: 'Browse all official streaming platforms, TV networks, and SVOD services worldwide.',
  path: '/providers',
});

interface PageProps {
  searchParams: Promise<{ type?: string; region?: string }>;
}

export default async function WatchProvidersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const mediaType: 'movie' | 'tv' = sp.type === 'tv' ? 'tv' : 'movie';
  const region = sp.region || 'US';

  const [regionsRes, providersRes] = await Promise.all([
    tmdbClient.getAvailableProviderRegions(),
    mediaType === 'movie' ? tmdbClient.getMovieWatchProvidersList(region) : tmdbClient.getTVWatchProvidersList(region),
  ]);

  const regionsList = regionsRes.results || [];
  const providers = providersRes.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Streaming Watch Providers</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Browse all official streaming platforms, TV networks, and SVOD services worldwide. Click a provider to browse its catalog.
          </p>
        </div>

        <ProviderFilters mediaType={mediaType} region={region} regionsList={regionsList} />
      </div>

      {/* Grid */}
      {providers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {providers.map((p) => (
            <Link
              key={p.provider_id}
              href={`/discover?type=${mediaType}&provider=${p.provider_id}&region=${region}`}
              className="group bg-gray-900/60 p-4 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col items-center text-center space-y-3"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-gray-950 border border-white/10 group-hover:scale-105 transition-transform">
                {p.logo_path ? (
                  <Image src={getImageUrl(p.logo_path, 'w185')} alt={p.provider_name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Logo</div>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-200 group-hover:text-brand-400 line-clamp-1">{p.provider_name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No providers found for this region.</p>
        </div>
      )}
    </div>
  );
}
