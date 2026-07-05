interface FunnelData {
  stages: string[];
  values: number[];
  conversion?: number[];
}

interface FunnelWidgetProps {
  title: string;
  data: FunnelData;
  config?: any;
}

export default function FunnelWidget({ title, data, config }: FunnelWidgetProps) {
  const maxValue = Math.max(...data.values);

  const getWidthPercentage = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  return (
    <div className="border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-6 hover:border-frame-orange/40 transition-colors">
      {/* Title */}
      <div className="mb-6">
        <p className="font-frame-mono text-[0.58rem] uppercase tracking-[0.14em] text-frame-gray-light">
          {title}
        </p>
      </div>

      {/* Funnel */}
      <div className="space-y-3">
        {data.stages.map((stage, index) => {
          const value = data.values[index] || 0;
          const conversion = data.conversion?.[index];
          const widthPercent = getWidthPercentage(value);

          return (
            <div key={stage} className="space-y-1">
              {/* Stage bar */}
              <div className="relative">
                <div
                  className="bg-gradient-to-r from-frame-orange to-frame-orange/60 h-12 flex items-center justify-between px-4 transition-all duration-300"
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="text-sm font-semibold text-white truncate">
                    {stage}
                  </span>
                  <span className="text-sm font-bold text-white ml-2">
                    {formatNumber(value)}
                  </span>
                </div>
              </div>

              {/* Conversion rate */}
              {conversion !== undefined && index < data.stages.length - 1 && (
                <div className="flex items-center gap-2 text-xs text-frame-gray-light pl-2">
                  <span>→</span>
                  <span>
                    {conversion.toFixed(1)}% conversion to next stage
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-frame-gray-3 flex items-center justify-between text-xs text-frame-gray-light">
        <span>Total at top: {formatNumber(data.values[0] || 0)}</span>
        <span>
          Overall conversion:{" "}
          {data.values[0] > 0
            ? ((data.values[data.values.length - 1] / data.values[0]) * 100).toFixed(1)
            : 0}
          %
        </span>
      </div>
    </div>
  );
}
