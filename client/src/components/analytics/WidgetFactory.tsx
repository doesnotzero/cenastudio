import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import KPIWidget from "./widgets/KPIWidget";
import LineChartWidget from "./widgets/LineChartWidget";
import BarChartWidget from "./widgets/BarChartWidget";
import PieChartWidget from "./widgets/PieChartWidget";
import TableWidget from "./widgets/TableWidget";
import FunnelWidget from "./widgets/FunnelWidget";
import GaugeWidget from "./widgets/GaugeWidget";
import HeatmapWidget from "./widgets/HeatmapWidget";

interface WidgetFactoryProps {
  widgetId: string;
  type: string;
  title: string;
  dataSource: string;
  config?: any;
}

export default function WidgetFactory({
  widgetId,
  type,
  title,
  dataSource,
  config = {}
}: WidgetFactoryProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/widgets/${widgetId}/data`, {
        credentials: "include"
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load widget data");
      }
    } catch (err) {
      console.error("Error loading widget data:", err);
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [widgetId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <RefreshCw className="h-6 w-6 animate-spin text-frame-orange" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-red-500/40 bg-red-500/5 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 text-xs text-frame-gray-light hover:text-frame-white underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate widget based on type
  const commonProps = { title, data, config };

  switch (type) {
    case "kpi":
      return <KPIWidget {...commonProps} />;
    case "lineChart":
      return <LineChartWidget {...commonProps} />;
    case "barChart":
      return <BarChartWidget {...commonProps} />;
    case "pieChart":
      return <PieChartWidget {...commonProps} />;
    case "table":
      return <TableWidget {...commonProps} />;
    case "funnel":
      return <FunnelWidget {...commonProps} />;
    case "gauge":
      return <GaugeWidget {...commonProps} />;
    case "heatmap":
      return <HeatmapWidget {...commonProps} />;
    default:
      return (
        <div className="border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-6">
          <h3 className="font-semibold text-sm mb-4">{title}</h3>
          <div className="flex items-center justify-center min-h-[200px] text-frame-gray-light">
            <p className="text-xs">Widget type "{type}" not supported</p>
          </div>
        </div>
      );
  }
}
