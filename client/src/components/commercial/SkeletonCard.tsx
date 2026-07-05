export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded border border-frame-gray-3 bg-frame-gray-1 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Label skeleton */}
          <div className="h-4 w-24 rounded bg-frame-gray-3" />
          {/* Value skeleton */}
          <div className="mt-2 h-9 w-32 rounded bg-frame-gray-3" />
          {/* Badge skeleton */}
          <div className="mt-2 h-6 w-28 rounded bg-frame-gray-3" />
        </div>
        {/* Icon skeleton */}
        <div className="h-12 w-12 rounded-full bg-frame-gray-3" />
      </div>
    </div>
  );
}
