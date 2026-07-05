import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
  data: Array<{ stage: string; count: number; value: number }>;
  loading?: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  prospect: '#6366f1',
  qualified: '#8b5cf6',
  proposal: '#a855f7',
  negotiation: '#c026d3',
  won: '#22c55e',
  lost: '#ef4444',
};

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospecção',
  qualified: 'Qualificado',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganho',
  lost: 'Perdido',
};

export function FunnelChart({ data, loading = false }: FunnelChartProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-frame-gray-light">Carregando dados...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-frame-gray-light">Nenhum dado disponível</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    stageLabel: STAGE_LABELS[item.stage] || item.stage,
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis
          type="number"
          stroke="#999"
          style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
        />
        <YAxis
          type="category"
          dataKey="stageLabel"
          stroke="#999"
          width={75}
          style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '12px'
          }}
          formatter={(value: number, name: string) => {
            if (name === 'count') return [value, 'Oportunidades'];
            if (name === 'value') return [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor Total'];
            return [value, name];
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] || '#999'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
