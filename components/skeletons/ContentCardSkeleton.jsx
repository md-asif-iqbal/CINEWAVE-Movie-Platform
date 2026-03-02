export default function ContentCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-cw-bg-card rounded-md" />
          <div className="mt-2 space-y-1.5">
            <div className="h-3 bg-cw-border/30 rounded w-3/4" />
            <div className="h-2.5 bg-cw-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
