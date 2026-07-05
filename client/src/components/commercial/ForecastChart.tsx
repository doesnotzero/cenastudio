import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

interface ForecastChartProps {
  data: {
    historical: Array<{ month: string; revenue: number; isForecast: boolean }>;
    forecast: Array<{ month: string; revenue: number; isForecast: boolean }>;
    metrics: {
      avgRevenue: number;
      recentTrend: number;
      growthRate: string;
      confidence: string;
    };
  } | null;
  loading?: boolean;
}

export function ForecastChart({ data, loading = false }: ForecastChartProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-frame-gray-light">Carregando previsão...</div>
      </div>
    );
  }

  if (!data || (!data.historical.length && !data.forecast.length)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-frame-gray-light">Dados insuficientes para previsão</div>
      </div>
    );
  }

  // Combine historical and forecast data
  const chartData = [...data.historical, ...data.forecast];

  // Find the index where forecast starts (to draw reference line)
  const forecastStartIndex = data.historical.length - 1;

  return (
    <div className="space-y-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border border-frame-gray-3 bg-frame-gray-2/50 p-3">
          <p className="text-xs text-frame-gray-light">Média Histórica</p>
          <p className="mt-1 text-lg font-semibold text-frame-white">
            R$ {data.metrics.avgRevenue.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="rounded border border-frame-gray-3 bg-frame-gray-2/50 p-3">
          <p className="text-xs text-frame-gray-light">Tendência Recente</p>
          <p className="mt-1 text-lg font-semibold text-frame-white">
            R$ {data.metrics.recentTrend.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="rounded border border-frame-gray-3 bg-frame-gray-2/50 p-3">
          <p className="text-xs text-frame-gray-light">Taxa de Crescimento</p>
          <p className={`mt-1 text-lg font-semibold ${
            parseFloat(data.metrics.growthRate) >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {parseFloat(data.metrics.growthRate) >= 0 ? '+' : ''}{data.metrics.growthRate}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
          <XAxis
            dataKey="month"
            stroke="#999"
            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
          />
          <YAxis
            stroke="#999"
            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#ff4d1d', marginBottom: '4px' }}
            formatter={(value: number, name: string, props: any) => {
              const isForecast = props.payload.isForecast;
              return [
                `R$ ${value.toLocaleString('pt-BR')}`,
                isForecast ? 'Previsão' : 'Receita Real',
              ];
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          />

          {/* Reference line at forecast start */}
          <ReferenceLine
            x={chartData[forecastStartIndex]?.month}
            stroke="#666"
            strokeDasharray="5 5"
            label={{ value: 'Início da Previsão', position: 'top', fill: '#999', fontSize: 10 }}
          />

          {/* Historical data line (solid) */}
          <Line
            type="monotone"
            dataKey="revenue"
            data={data.historical}
            stroke="#ff4d1d"
            strokeWidth={2}
            dot={{ fill: '#ff4d1d', r: 3 }}
            activeDot={{ r: 5, fill: '#ff4d1d' }}
            name="Receita Real"
            connectNulls={false}
          />

          {/* Forecast data line (dashed) */}
          <Line
            type="monotone"
            dataKey="revenue"
            data={[...data.historical.slice(-1), ...data.forecast]}
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#22c55e', r: 3 }}
            activeDot={{ r: 5, fill: '#22c55e' }}
            name="Previsão"
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Confidence Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-frame-gray-light">
        <div className={`h-2 w-2 rounded-full ${
          data.metrics.confidence === 'high' ? 'bg-green-500' :
          data.metrics.confidence === 'medium' ? 'bg-yellow-500' :
          'bg-red-500'
        }`} />
        <span>
          Confiança da previsão: {
            data.metrics.confidence === 'high' ? 'Alta' :
            data.metrics.confidence === 'medium' ? 'Média' :
            'Baixa'
          }
        </span>
      </div>
    </div>
  );
}
