import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 86400;

const TOP_REGIONS = ['US', 'GB', 'CA', 'DE', 'FR', 'IN', 'JP', 'AU'];

export const metadata: Metadata = buildMetadata({
  title: 'Global Streaming Providers Matrix',
  description: 'Official streaming, buy, and rent providers matrix by territory.',
  path: '/streaming-matrix',
});

interface PageProps {
  searchParams: Promise<{ region?: string }>;
}

export default async function StreamingMatrixPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const region = TOP_REGIONS.includes(sp.region || '') ? sp.region! : 'US';

  const res = await tmdbClient.getMovieWatchProvidersList(region);
  const providers = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Streaming Providers Matrix</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Official streaming, buy, and rent providers matrix by territory.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto flex-wrap">
          {TOP_REGIONS.map((r) => (
            <Link
              key={r}
              href={`/streaming-matrix?region=${r}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${region === r ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {r}
            </Link>
          ))}
        </div>
      </div>

      {providers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {providers.map((p) => (
            <Link
              key={p.provider_id}
              href={`/discover?type=movie&provider=${p.provider_id}&region=${region}`}
              className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition space-y-2 text-center block"
            >
              <span className="font-extrabold text-xs text-white line-clamp-1">{p.provider_name}</span>
              <p className="text-[10px] text-gray-400">Priority #{p.display_priority}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No providers found for this region.</p>
      )}
    </div>
  );
}
