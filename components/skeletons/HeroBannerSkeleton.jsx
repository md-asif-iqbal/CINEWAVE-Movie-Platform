export default function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-cw-bg-card animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-16 space-y-3">
        <div className="h-8 sm:h-10 md:h-14 bg-cw-border/30 rounded w-2/3 max-w-md" />
        <div className="h-4 bg-cw-border/30 rounded w-1/2 max-w-sm" />
        <div className="h-4 bg-cw-border/30 rounded w-1/3 max-w-xs" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 sm:h-12 w-28 sm:w-32 bg-cw-border/30 rounded" />
          <div className="h-10 sm:h-12 w-28 sm:w-32 bg-cw-border/30 rounded" />
        </div>
      </div>
    </div>
  );
}
