interface HeatmapData {
  x: string[];
  y: string[];
  intensity: number[][];
}

interface HeatmapWidgetProps {
  title: string;
  data: HeatmapData;
  config?: any;
}

export default function HeatmapWidget({ title, data, config }: HeatmapWidgetProps) {
  // Simple heatmap implementation
  // For production, consider using a library like react-calendar-heatmap

  return (
    <div className="border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-6 hover:border-frame-orange/40 transition-colors">
      {/* Title */}
      <div className="mb-6">
        <p className="font-frame-mono text-[0.58rem] uppercase tracking-[0.14em] text-frame-gray-light">
          {title}
        </p>
      </div>

      {/* Placeholder */}
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-frame-orange/20 hover:bg-frame-orange/40 transition-colors cursor-pointer"
              style={{
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
        <p className="text-xs text-frame-gray-light mt-2">
          Heatmap visualization (placeholder)
        </p>
        <p className="text-xs text-frame-orange mt-1">
          Full implementation coming soon
        </p>
      </div>
    </div>
  );
}
