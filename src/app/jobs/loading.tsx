export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading content">
      <div className="space-y-2">
        <div className="h-8 w-96 max-w-full rounded-lg bg-gray-900 animate-pulse" />
        <div className="h-4 w-72 max-w-full rounded bg-gray-900/70 animate-pulse" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="h-5 w-40 rounded bg-gray-800 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-6 w-20 rounded-xl bg-gray-800/70 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
