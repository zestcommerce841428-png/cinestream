import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface EndpointCardProps {
  keyId: string;
  name: string;
  path: string;
  category: string;
  description: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ keyId, name, path, category, description }) => {
  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4 hover:border-brand-500/50 transition-all group flex flex-col justify-between shadow-xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            {category}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
            GET
          </span>
        </div>
        <h3 className="font-extrabold text-base text-white group-hover:text-brand-300 transition">
          {name}
        </h3>
        <p className="text-xs text-gray-400 font-mono bg-gray-950 p-2 rounded-lg border border-gray-800/80 truncate">
          {path}
        </p>
        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
      <Link
        href={`/api-explorer/${keyId}`}
        className="mt-4 w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-brand-600 border border-gray-800 hover:border-brand-500 text-gray-200 hover:text-white text-xs font-bold transition group-hover:shadow-lg"
      >
        <Play className="w-3.5 h-3.5 text-brand-400 group-hover:text-white" />
        <span>Open Endpoint ({keyId})</span>
      </Link>
    </div>
  );
};

export default EndpointCard;
