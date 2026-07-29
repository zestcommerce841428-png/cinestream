export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading comparison">
      <div className="h-8 w-96 max-w-full rounded-lg bg-gray-900 animate-pulse" />
      <div className="h-20 bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-96 bg-gray-900 animate-pulse rounded-3xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}
