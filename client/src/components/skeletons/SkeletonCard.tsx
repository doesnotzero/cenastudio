/**
 * SkeletonCard - Loading placeholder for cards
 */

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className,
  showImage = false,
  lines = 3
}: SkeletonCardProps) {
  return (
    <div className={cn(
      "border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-4 animate-pulse",
      className
    )}>
      {/* Image/Thumbnail placeholder */}
      {showImage && (
        <div className="w-full aspect-video bg-frame-gray-3 rounded mb-4" />
      )}

      {/* Title placeholder */}
      <div className="h-5 bg-frame-gray-3 rounded w-3/4 mb-3" />

      {/* Description lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-frame-gray-3 rounded"
            style={{ width: `${100 - (i * 15)}%` }}
          />
        ))}
      </div>

      {/* Footer/Actions placeholder */}
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-frame-gray-3 rounded w-20" />
        <div className="h-8 bg-frame-gray-3 rounded w-16" />
      </div>
    </div>
  );
}

/**
 * SkeletonCardGrid - Grid of skeleton cards
 */
export function SkeletonCardGrid({
  count = 6,
  cols = 3
}: {
  count?: number;
  cols?: number;
}) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[cols] || "grid-cols-3";

  return (
    <div className={cn("grid gap-4", gridClass)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
