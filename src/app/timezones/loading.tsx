export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading timezones">
      <div className="h-8 w-96 max-w-full rounded-lg bg-gray-900 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-900 animate-pulse rounded-xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}
