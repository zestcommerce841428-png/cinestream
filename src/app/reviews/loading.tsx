export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading reviews">
      <div className="space-y-2">
        <div className="h-8 w-96 max-w-full rounded-lg bg-gray-900 animate-pulse" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}
