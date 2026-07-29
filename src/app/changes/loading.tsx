export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading content">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-80 max-w-full rounded-lg bg-gray-900 animate-pulse" />
          <div className="h-4 w-64 max-w-full rounded bg-gray-900/70 animate-pulse" />
        </div>
        <div className="h-10 w-64 rounded-2xl bg-gray-900 animate-pulse" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-900 animate-pulse rounded-xl border border-gray-800" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
