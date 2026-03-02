export default function ProfileCardSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-md bg-cw-bg-card" />
          <div className="h-3 bg-cw-border/30 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
