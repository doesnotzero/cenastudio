/**
 * SkeletonForm - Loading placeholder for forms
 */

import { cn } from "@/lib/utils";

interface SkeletonFormProps {
  className?: string;
  fields?: number;
  showSubmit?: boolean;
}

export function SkeletonForm({
  className,
  fields = 4,
  showSubmit = true
}: SkeletonFormProps) {
  return (
    <div className={cn("space-y-4 animate-pulse", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label */}
          <div className="h-4 bg-frame-gray-3 rounded w-24" />

          {/* Input */}
          <div className="h-10 bg-frame-gray-3 rounded w-full" />
        </div>
      ))}

      {/* Submit button */}
      {showSubmit && (
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-frame-gray-3 rounded w-24" />
          <div className="h-10 bg-frame-gray-3 rounded w-20" />
        </div>
      )}
    </div>
  );
}
