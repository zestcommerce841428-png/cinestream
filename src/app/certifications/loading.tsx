export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading content">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-80 max-w-full rounded-lg bg-gray-900 animate-pulse" />
          <div className="h-4 w-64 max-w-full rounded bg-gray-900/70 animate-pulse" />
        </div>
        <div className="h-10 w-72 rounded-2xl bg-gray-900 animate-pulse" />
      </div>
      {Array.from({ length: 2 }).map((_, section) => (
        <div key={section} className="space-y-4">
          <div className="h-5 w-40 rounded bg-gray-900 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-900/60 animate-pulse rounded-2xl border border-gray-800" />
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
