export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" role="status" aria-label="Loading box office flops">
      <div className="space-y-2">
        <div className="h-8 w-72 rounded-lg bg-gray-900 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded bg-gray-900/70 animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
