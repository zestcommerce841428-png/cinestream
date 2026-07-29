export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading countries catalog">
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="h-8 w-96 max-w-full rounded-lg bg-gray-900 animate-pulse" />
        <div className="h-4 w-72 max-w-full rounded bg-gray-900/70 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-11 rounded-xl border border-gray-800 bg-gray-900/60 animate-pulse" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
