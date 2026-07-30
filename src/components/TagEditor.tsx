'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';

interface TagEditorProps {
  id: number;
  type: 'movie' | 'tv';
  tags: string[];
}

export default function TagEditor({ id, type, tags }: TagEditorProps) {
  const { setTags } = useWatchlist();
  const [input, setInput] = useState('');

  const addTag = () => {
    const t = input.trim();
    if (!t || tags.includes(t)) return;
    setTags(id, type, [...tags, t]);
    setInput('');
  };

  const removeTag = (tag: string) => setTags(id, type, tags.filter((x) => x !== tag));

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">
          {tag}
          <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-white">
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder="+ tag"
        className="w-16 bg-transparent text-[10px] text-gray-400 placeholder-gray-600 border-b border-gray-800 focus:border-brand-500 outline-none"
      />
    </div>
  );
}
