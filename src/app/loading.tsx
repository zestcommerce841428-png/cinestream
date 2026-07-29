export default function HomeLoading() {
  return (
    <div className="space-y-12" role="status" aria-label="Loading CineStream">
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] bg-gray-900 animate-pulse overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full space-y-4">
          <div className="h-6 w-40 rounded-full bg-gray-800" />
          <div className="h-12 w-2/3 max-w-xl rounded-lg bg-gray-800" />
          <div className="h-4 w-1/2 max-w-md rounded bg-gray-800" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={row} className="space-y-4">
            <div className="h-6 w-48 rounded bg-gray-900 animate-pulse" />
            <div className="flex space-x-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-w-[160px] sm:min-w-[200px] aspect-[2/3] rounded-2xl bg-gray-900 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
