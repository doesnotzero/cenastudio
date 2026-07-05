/**
 * SkeletonList - Loading placeholder for lists
 */

import { cn } from "@/lib/utils";

interface SkeletonListItemProps {
  className?: string;
  showAvatar?: boolean;
  showActions?: boolean;
}

export function SkeletonListItem({
  className,
  showAvatar = true,
  showActions = true
}: SkeletonListItemProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 border-b border-frame-gray-3 animate-pulse",
      className
    )}>
      {/* Avatar/Icon */}
      {showAvatar && (
        <div className="w-10 h-10 bg-frame-gray-3 rounded-full flex-shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-frame-gray-3 rounded w-1/3 mb-2" />
        <div className="h-3 bg-frame-gray-3 rounded w-2/3" />
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-frame-gray-3 rounded" />
          <div className="w-8 h-8 bg-frame-gray-3 rounded" />
        </div>
      )}
    </div>
  );
}

/**
 * SkeletonList - Multiple list items
 */
export function SkeletonList({
  count = 5,
  showAvatar = true,
  showActions = true,
  className
}: {
  count?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("border border-frame-gray-3 rounded-lg overflow-hidden", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListItem
          key={i}
          showAvatar={showAvatar}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
