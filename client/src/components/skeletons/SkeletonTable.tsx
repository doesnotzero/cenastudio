/**
 * SkeletonTable - Loading placeholder for tables
 */

import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  className?: string;
  rows?: number;
  columns?: number;
}

export function SkeletonTable({
  className,
  rows = 5,
  columns = 4
}: SkeletonTableProps) {
  return (
    <div className={cn("border border-frame-gray-3 rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="border-b border-frame-gray-3 bg-frame-gray-1/30 p-3 animate-pulse">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-frame-gray-3 rounded" />
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="border-b border-frame-gray-3 last:border-b-0 p-3 animate-pulse"
          style={{ animationDelay: `${rowIdx * 50}ms` }}
        >
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-4 bg-frame-gray-3 rounded"
                style={{ width: `${80 - (colIdx * 10)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
