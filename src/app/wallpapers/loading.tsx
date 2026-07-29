export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading wallpapers">
      <div className="h-8 w-96 max-w-full rounded-lg bg-gray-900 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}
