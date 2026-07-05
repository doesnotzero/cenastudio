export function SkeletonChart({ height = "256px" }: { height?: string }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="flex h-full flex-col gap-3">
        {/* Chart bars/lines placeholder */}
        <div className="flex h-full items-end gap-2">
          <div className="h-[40%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[60%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[80%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[70%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[90%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[85%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[95%] w-full rounded-t bg-frame-gray-3" />
          <div className="h-[75%] w-full rounded-t bg-frame-gray-3" />
        </div>
        {/* Axis labels */}
        <div className="flex justify-between px-2">
          <div className="h-3 w-12 rounded bg-frame-gray-3" />
          <div className="h-3 w-12 rounded bg-frame-gray-3" />
          <div className="h-3 w-12 rounded bg-frame-gray-3" />
          <div className="h-3 w-12 rounded bg-frame-gray-3" />
        </div>
      </div>
    </div>
  );
}
