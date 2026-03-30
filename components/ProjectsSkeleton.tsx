export default function ProjectsSkeleton() {
  return (
    <section id="projects" className="py-section px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-14 space-y-4">
          <div className="h-6 w-36 rounded-full bg-white/5 animate-pulse" />
          <div className="h-10 w-64 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-4 w-80 rounded bg-white/5 animate-pulse" />
        </div>

        {/* 3 skeleton cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card flex flex-col p-5 gap-4 h-64">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/5 animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/5 animate-pulse" />
                  <div className="w-7 h-7 rounded-lg bg-white/5 animate-pulse" />
                </div>
              </div>
              {/* Title */}
              <div className="h-5 w-3/4 rounded bg-white/5 animate-pulse" />
              {/* Description lines */}
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-full rounded bg-white/5 animate-pulse" />
                <div className="h-3.5 w-5/6 rounded bg-white/5 animate-pulse" />
                <div className="h-3.5 w-4/6 rounded bg-white/5 animate-pulse" />
              </div>
              {/* Tags */}
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-white/5 animate-pulse" />
                <div className="h-5 w-20 rounded-full bg-white/5 animate-pulse" />
                <div className="h-5 w-14 rounded-full bg-white/5 animate-pulse" />
              </div>
              {/* Footer */}
              <div className="flex gap-4 pt-2 border-t border-white/5">
                <div className="h-3.5 w-20 rounded bg-white/5 animate-pulse" />
                <div className="h-3.5 w-12 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="mt-10 flex justify-center">
          <div className="h-11 w-44 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
