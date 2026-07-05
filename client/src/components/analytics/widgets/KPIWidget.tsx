import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIData {
  value: number;
  change: number;
  trend: "up" | "down" | "neutral";
  label?: string;
}

interface KPIWidgetProps {
  title: string;
  data: KPIData;
  config?: any;
}

export default function KPIWidget({ title, data, config }: KPIWidgetProps) {
  const formatValue = (value: number) => {
    // Check if it's a currency value (usually > 1000)
    if (value >= 1000) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }

    // Otherwise format as number
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-frame-gray-light";
    }
  };

  return (
    <div className="border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-6 hover:border-frame-orange/40 transition-colors">
      {/* Title */}
      <div className="mb-6">
        <p className="font-frame-mono text-[0.58rem] uppercase tracking-[0.14em] text-frame-gray-light">
          {title}
        </p>
      </div>

      {/* Value */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-frame-white">
          {formatValue(data.value)}
        </h2>
      </div>

      {/* Change & Trend */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-semibold">
            {data.change > 0 ? "+" : ""}{data.change.toFixed(1)}%
          </span>
        </div>

        {data.label && (
          <span className="text-xs text-frame-gray-light">
            {data.label}
          </span>
        )}
      </div>
    </div>
  );
}
