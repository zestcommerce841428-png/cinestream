interface MediaGridSkeletonProps {
  title?: string | boolean;
  count?: number;
}

export default function MediaGridSkeleton({ title, count = 18 }: MediaGridSkeletonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading content">
      {title && (
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-lg bg-gray-900 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded bg-gray-900/70 animate-pulse" />
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-2xl overflow-hidden border border-gray-800/80 bg-gray-900/60">
            <div className="aspect-[2/3] w-full bg-gray-800 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3.5 w-4/5 rounded bg-gray-800 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-gray-800/70 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
