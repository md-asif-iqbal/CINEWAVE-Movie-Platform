export default function ContentRowSkeleton({ count = 6 }) {
  return (
    <div className="space-y-3 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="h-6 bg-cw-border/30 rounded w-40 animate-pulse" />
      <div className="flex gap-2 sm:gap-3 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[240px] animate-pulse">
            <div className="aspect-[2/3] bg-cw-bg-card rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
