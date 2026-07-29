export default function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950" role="status" aria-label="Loading details">
      <div className="relative h-[65vh] w-full bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-end md:items-center gap-8">
          <div className="hidden sm:block w-44 sm:w-56 aspect-[2/3] rounded-2xl bg-gray-800 flex-shrink-0" />
          <div className="space-y-4 flex-1 w-full">
            <div className="h-4 w-24 rounded bg-gray-800" />
            <div className="h-10 w-2/3 rounded-lg bg-gray-800" />
            <div className="h-4 w-1/2 rounded bg-gray-800" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-3">
        <div className="h-5 w-32 rounded bg-gray-900 animate-pulse" />
        <div className="h-3.5 w-full rounded bg-gray-900/70 animate-pulse" />
        <div className="h-3.5 w-5/6 rounded bg-gray-900/70 animate-pulse" />
        <div className="h-3.5 w-2/3 rounded bg-gray-900/70 animate-pulse" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
