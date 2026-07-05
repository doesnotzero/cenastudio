import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Target, Calendar, Download, Loader2, LineChart as LineChartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { RevenueChart } from "@/components/commercial/RevenueChart";
import { FunnelChart } from "@/components/commercial/FunnelChart";
import { ForecastChart } from "@/components/commercial/ForecastChart";
import { ComparisonBadge } from "@/components/commercial/ComparisonBadge";
import { SkeletonCard } from "@/components/commercial/SkeletonCard";
import { SkeletonChart } from "@/components/commercial/SkeletonChart";
import { SkeletonTable } from "@/components/commercial/SkeletonTable";
import { motion } from "framer-motion";

interface CommercialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  pipelineValue: number;
  averageTicket: number;
  activeDeals: number;
  wonDeals: number;
  lostDeals: number;
}

interface CommercialMetrics {
  winRate: number;
  avgCloseTime: number;
  stageTickets: Record<string, { count: number; totalValue: number; avgTicket: number }>;
  pipelineVelocity: number;
  velocityChange: number;
  totalOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
}

interface ReportFilters {
  startDate: string;
  endDate: string;
  stage: string;
}

interface FilteredStats {
  revenue: number;
  opportunities: number;
  conversionRate: number;
  avgTicket: number;
}

interface PeriodComparison {
  revenue: { current: number; previous: number; change: string; isPositive: boolean };
  conversionRate: { current: number; previous: number; change: string; isPositive: boolean };
  pipelineValue: { current: number; previous: number; change: string; isPositive: boolean };
  activeDeals: { current: number; previous: number; change: string; isPositive: boolean };
}

interface ForecastData {
  historical: Array<{ month: string; revenue: number; isForecast: boolean }>;
  forecast: Array<{ month: string; revenue: number; isForecast: boolean }>;
  metrics: {
    avgRevenue: number;
    recentTrend: number;
    growthRate: string;
    confidence: string;
  };
}

export default function CommercialHub() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<CommercialStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    pipelineValue: 0,
    averageTicket: 0,
    activeDeals: 0,
    wonDeals: 0,
    lostDeals: 0,
  });
  const [metrics, setMetrics] = useState<CommercialMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [funnelData, setFunnelData] = useState<Array<{ stage: string; count: number; value: number }>>([]);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [comparison, setComparison] = useState<PeriodComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  // Report filters
  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    stage: 'all',
  });
  const [filteredStats, setFilteredStats] = useState<FilteredStats | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    loadDashboardData();
    loadChartsData();
    loadMetricsData();
    loadForecastData();
    loadComparisonData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const data = await api.commercial.dashboard();
      setStats(data);
    } catch (error) {
      console.error("Error loading commercial dashboard:", error);
      toast.error("Erro ao carregar dados do dashboard comercial");
    } finally {
      setLoading(false);
    }
  }

  async function loadChartsData() {
    try {
      setChartsLoading(true);
      const [revenue, funnel] = await Promise.all([
        api.commercial.revenue(),
        api.commercial.funnel(),
      ]);
      setRevenueData(revenue);
      setFunnelData(funnel);
    } catch (error) {
      console.error("Error loading charts data:", error);
      toast.error("Erro ao carregar gráficos");
    } finally {
      setChartsLoading(false);
    }
  }

  async function loadMetricsData() {
    try {
      setMetricsLoading(true);
      const data = await api.commercial.metrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error loading metrics data:", error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setMetricsLoading(false);
    }
  }

  async function loadForecastData() {
    try {
      setForecastLoading(true);
      const data = await api.commercial.forecast();
      setForecastData(data);
    } catch (error) {
      console.error("Error loading forecast data:", error);
      toast.error("Erro ao carregar previsão");
    } finally {
      setForecastLoading(false);
    }
  }

  async function loadComparisonData() {
    try {
      const data = await api.commercial.comparison();
      setComparison(data);
    } catch (error) {
      console.error("Error loading comparison data:", error);
      // Silent fail - comparison is optional
    }
  }

  function handleApplyFilters() {
    // Calculate filtered stats based on current data
    // This is a simplified version - in production, would call backend API with filters
    const filtered: FilteredStats = {
      revenue: stats.totalRevenue,
      opportunities: stats.activeDeals + stats.wonDeals + stats.lostDeals,
      conversionRate: stats.conversionRate,
      avgTicket: stats.averageTicket,
    };
    setFilteredStats(filtered);
    toast.success("Filtros aplicados com sucesso");
  }

  function handleClearFilters() {
    setReportFilters({
      startDate: '',
      endDate: '',
      stage: 'all',
    });
    setFilteredStats(null);
    toast.info("Filtros limpos");
  }

  async function handleExport(format: 'excel' | 'pdf' | 'csv') {
    try {
      setExportLoading(true);

      // Generate export data
      const exportData = {
        stats,
        metrics,
        revenueData,
        funnelData,
        filters: reportFilters,
        generatedAt: new Date().toISOString(),
      };

      if (format === 'csv') {
        // CSV export with better formatting
        exportToCSV(exportData);
        toast.success("Relatório CSV exportado com sucesso!");
      } else if (format === 'excel') {
        // Excel-like CSV with tabs
        exportToExcelCSV(exportData);
        toast.success("Relatório Excel-CSV exportado com sucesso!");
      } else if (format === 'pdf') {
        // For now, export a detailed CSV that can be imported to PDF
        exportToDetailedCSV(exportData);
        toast.info("Relatório detalhado exportado. Você pode converter para PDF usando ferramentas online.");
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Erro ao exportar relatório");
    } finally {
      setExportLoading(false);
    }
  }

  function exportToCSV(data: any) {
    const csv = [
      // Header
      ['Commercial Hub - Relatório'],
      ['Gerado em', new Date().toLocaleString('pt-BR')],
      [''],
      ['ESTATÍSTICAS GERAIS'],
      ['Métrica', 'Valor'],
      ['Receita Total', `R$ ${data.stats.totalRevenue.toLocaleString('pt-BR')}`],
      ['Receita Mensal', `R$ ${data.stats.monthlyRevenue.toLocaleString('pt-BR')}`],
      ['Taxa de Conversão', `${data.stats.conversionRate}%`],
      ['Valor em Pipeline', `R$ ${data.stats.pipelineValue.toLocaleString('pt-BR')}`],
      ['Ticket Médio', `R$ ${data.stats.averageTicket.toLocaleString('pt-BR')}`],
      ['Negociações Ativas', data.stats.activeDeals],
      ['Negociações Ganhas', data.stats.wonDeals],
      ['Negociações Perdidas', data.stats.lostDeals],
      [''],
      ['FUNIL DE VENDAS'],
      ['Stage', 'Quantidade', 'Valor Total'],
      ...data.funnelData.map((item: any) => [
        item.stage,
        item.count,
        `R$ ${item.value.toLocaleString('pt-BR')}`
      ]),
      [''],
      ['RECEITA MENSAL'],
      ['Mês', 'Receita'],
      ...data.revenueData.map((item: any) => [
        item.month,
        `R$ ${item.revenue.toLocaleString('pt-BR')}`
      ]),
    ].map(row => row.join(',')).join('\n');

    downloadFile(csv, 'commercial-hub-report.csv', 'text/csv');
  }

  function exportToExcelCSV(data: any) {
    // Excel-compatible CSV with better formatting
    const csv = [
      ['Commercial Hub - Relatório Completo'],
      ['Gerado em:', new Date().toLocaleString('pt-BR')],
      [''],
      ['=== RESUMO EXECUTIVO ==='],
      [''],
      ['INDICADORES PRINCIPAIS'],
      ['Métrica', 'Valor Atual', 'Variação'],
      ['Receita Total', data.stats.totalRevenue, comparison ? `${comparison.revenue.change}%` : 'N/A'],
      ['Taxa de Conversão', `${data.stats.conversionRate}%`, comparison ? `${comparison.conversionRate.change}%` : 'N/A'],
      ['Pipeline', data.stats.pipelineValue, comparison ? `${comparison.pipelineValue.change}%` : 'N/A'],
      ['Deals Ativos', data.stats.activeDeals, comparison ? `${comparison.activeDeals.change}%` : 'N/A'],
      [''],
      ['=== FUNIL DE VENDAS ==='],
      [''],
      ['Estágio', 'Quantidade', 'Valor Total', '% do Total'],
      ...data.funnelData.map((item: any, idx: number, arr: any[]) => {
        const totalCount = arr.reduce((sum, i) => sum + i.count, 0);
        const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : '0.0';
        return [item.stage, item.count, item.value, `${percentage}%`];
      }),
      [''],
      ['=== RECEITA MENSAL (12 MESES) ==='],
      [''],
      ['Mês', 'Receita', 'Variação %'],
      ...data.revenueData.map((item: any, idx: number, arr: any[]) => {
        const prevRevenue = idx > 0 ? arr[idx - 1].revenue : item.revenue;
        const change = prevRevenue > 0 ? (((item.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : '0.0';
        return [item.month, item.revenue, idx > 0 ? `${change}%` : '-'];
      }),
      [''],
      ['=== MÉTRICAS DETALHADAS ==='],
    ];

    if (data.metrics) {
      csv.push(
        [''],
        ['KPIs de Performance'],
        ['Métrica', 'Valor'],
        ['Win Rate', `${data.metrics.winRate}%`],
        ['Tempo Médio de Fechamento', `${data.metrics.avgCloseTime} dias`],
        ['Velocidade do Pipeline', `${data.metrics.pipelineVelocity} deals/mês`],
        ['Variação de Velocidade', `${data.metrics.velocityChange}%`],
        [''],
        ['Ticket Médio por Stage'],
        ['Stage', 'Quantidade', 'Valor Total', 'Ticket Médio'],
        ...Object.entries(data.metrics.stageTickets || {}).map(([stage, stageData]: [string, any]) => [
          stage,
          stageData.count,
          stageData.totalValue,
          stageData.avgTicket
        ])
      );
    }

    const csvText = csv.map(row => row.join('\t')).join('\n'); // Use tab delimiter for Excel
    downloadFile(csvText, 'commercial-hub-excel.csv', 'text/csv');
  }

  function exportToDetailedCSV(data: any) {
    // Detailed report suitable for PDF conversion
    const csv = [
      ['═══════════════════════════════════════════'],
      ['COMMERCIAL HUB - RELATÓRIO DETALHADO'],
      ['═══════════════════════════════════════════'],
      ['Data:', new Date().toLocaleDateString('pt-BR')],
      ['Hora:', new Date().toLocaleTimeString('pt-BR')],
      [''],
      ['─── DASHBOARD PRINCIPAL ───'],
      [''],
      [`💰 Receita Total: R$ ${data.stats.totalRevenue.toLocaleString('pt-BR')}`],
      [`📊 Taxa de Conversão: ${data.stats.conversionRate}%`],
      [`🎯 Pipeline Value: R$ ${data.stats.pipelineValue.toLocaleString('pt-BR')}`],
      [`📅 Deals Ativos: ${data.stats.activeDeals}`],
      [''],
      ['─── ANÁLISE DE FUNIL ───'],
      [''],
      ...data.funnelData.map((item: any) =>
        [`${item.stage}: ${item.count} deals (R$ ${item.value.toLocaleString('pt-BR')})`]
      ),
      [''],
      ['─── TENDÊNCIA DE RECEITA ───'],
      [''],
      ...data.revenueData.slice(-6).map((item: any) =>
        [`${item.month}: R$ ${item.revenue.toLocaleString('pt-BR')}`]
      ),
    ];

    const text = csv.map(row => row.join('')).join('\n');
    downloadFile(text, 'commercial-hub-detailed.txt', 'text/plain');
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-frame-black">
        {/* Header */}
        <div className="border-b border-frame-gray-3 bg-frame-gray-1/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="h-9 w-48 animate-pulse rounded bg-frame-gray-3" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-frame-gray-3" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Tabs skeleton */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 animate-pulse rounded bg-frame-gray-3" />
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded border border-frame-gray-3 bg-frame-gray-1 p-6">
              <div className="mb-4 h-6 w-48 animate-pulse rounded bg-frame-gray-3" />
              <SkeletonChart />
            </div>
            <div className="rounded border border-frame-gray-3 bg-frame-gray-1 p-6">
              <div className="mb-4 h-6 w-32 animate-pulse rounded bg-frame-gray-3" />
              <SkeletonChart />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-frame-black">
      {/* Header */}
      <div className="border-b border-frame-gray-3 bg-frame-gray-1/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-frame-white">
                Commercial Hub
              </h1>
              <p className="mt-2 text-sm text-frame-gray-light">
                Visão completa do pipeline comercial e métricas de vendas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 w-full flex-wrap justify-start gap-2 md:flex-nowrap">
            <TabsTrigger value="dashboard" className="flex-1 md:flex-initial">Dashboard</TabsTrigger>
            <TabsTrigger value="metrics" className="flex-1 md:flex-initial">Métricas</TabsTrigger>
            <TabsTrigger value="funnel" className="flex-1 md:flex-initial">Funil</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 md:flex-initial">Relatórios</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-frame-orange/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-frame-gray-light">
                          Receita Total
                        </p>
                        <p
                          className="mt-2 text-3xl font-bold text-frame-white"
                          aria-label={`Receita total de ${stats.totalRevenue.toLocaleString("pt-BR")} reais`}
                        >
                          R$ {stats.totalRevenue.toLocaleString("pt-BR")}
                        </p>
                        {comparison && (
                          <div className="mt-2">
                            <ComparisonBadge
                              change={comparison.revenue.change}
                              isPositive={comparison.revenue.isPositive}
                            />
                          </div>
                        )}
                      </div>
                      <div className="rounded-full bg-frame-orange/20 p-3" aria-hidden="true">
                        <DollarSign className="text-frame-orange" size={24} />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Conversion Rate Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-green-500/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-frame-gray-light">
                          Taxa de Conversão
                        </p>
                        <p
                          className="mt-2 text-3xl font-bold text-frame-white"
                          aria-label={`Taxa de conversão de ${stats.conversionRate} por cento`}
                        >
                          {stats.conversionRate}%
                        </p>
                        {comparison && (
                          <div className="mt-2">
                            <ComparisonBadge
                              change={comparison.conversionRate.change}
                              isPositive={comparison.conversionRate.isPositive}
                            />
                          </div>
                        )}
                      </div>
                      <div className="rounded-full bg-green-500/20 p-3" aria-hidden="true">
                        <TrendingUp className="text-green-500" size={24} />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Pipeline Value Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-blue-500/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-frame-gray-light">
                          Valor em Pipeline
                        </p>
                        <p className="mt-2 text-3xl font-bold text-frame-white">
                          R$ {stats.pipelineValue.toLocaleString("pt-BR")}
                        </p>
                        {comparison && (
                          <div className="mt-2">
                            <ComparisonBadge
                              change={comparison.pipelineValue.change}
                              isPositive={comparison.pipelineValue.isPositive}
                            />
                          </div>
                        )}
                      </div>
                      <div className="rounded-full bg-blue-500/20 p-3">
                        <Target className="text-blue-500" size={24} />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Active Deals Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-purple-500/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-frame-gray-light">
                          Negociações Ativas
                        </p>
                        <p className="mt-2 text-3xl font-bold text-frame-white">
                          {stats.activeDeals}
                        </p>
                        {comparison && (
                          <div className="mt-2">
                            <ComparisonBadge
                              change={comparison.activeDeals.change}
                              isPositive={comparison.activeDeals.isPositive}
                            />
                          </div>
                        )}
                      </div>
                      <div className="rounded-full bg-purple-500/20 p-3">
                        <Calendar className="text-purple-500" size={24} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Charts Section */}
              <motion.div
                className="grid grid-cols-1 gap-6 lg:grid-cols-2"
                variants={itemVariants}
              >
                <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-frame-white">
                    Receita Mensal (Últimos 12 Meses)
                  </h3>
                  <div role="img" aria-label="Gráfico de linha mostrando receita mensal dos últimos 12 meses">
                    {chartsLoading ? (
                      <SkeletonChart />
                    ) : (
                      <RevenueChart data={revenueData} loading={false} />
                    )}
                  </div>
                </Card>

                <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-frame-white">
                    Funil de Vendas
                  </h3>
                  <div role="img" aria-label="Gráfico de barras mostrando funil de vendas por estágio">
                    {chartsLoading ? (
                      <SkeletonChart />
                    ) : (
                      <FunnelChart data={funnelData} loading={false} />
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Forecast Section */}
              <motion.div variants={itemVariants}>
                <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <LineChartIcon className="text-frame-orange" size={20} />
                    <h3 className="text-lg font-semibold text-frame-white">
                      Previsão de Vendas (Próximos 3 Meses)
                    </h3>
                  </div>
                  {forecastLoading ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse rounded border border-frame-gray-3 bg-frame-gray-2/50 p-3">
                            <div className="h-3 w-24 rounded bg-frame-gray-3" />
                            <div className="mt-2 h-6 w-32 rounded bg-frame-gray-3" />
                          </div>
                        ))}
                      </div>
                      <SkeletonChart height="320px" />
                    </div>
                  ) : (
                    <ForecastChart data={forecastData} loading={false} />
                  )}
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            {metricsLoading ? (
              <div className="space-y-8">
                {/* KPI Cards Skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
                {/* Table Skeleton */}
                <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                  <div className="mb-4 h-6 w-48 animate-pulse rounded bg-frame-gray-3" />
                  <SkeletonTable />
                </Card>
              </div>
            ) : !metrics ? (
              <Card className="bg-frame-gray-1 border-frame-gray-3 p-8">
                <p className="text-center text-frame-gray-light">Nenhuma métrica disponível</p>
              </Card>
            ) : (
              <motion.div
                className="space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Win Rate Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-green-500/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-frame-gray-light">Win Rate</p>
                          <p className="mt-2 text-3xl font-bold text-frame-white">
                            {metrics.winRate}%
                          </p>
                          <p className="mt-1 text-xs text-frame-gray-light">
                            {metrics.wonOpportunities} ganhos de {metrics.totalOpportunities}
                          </p>
                        </div>
                        <div className="rounded-full bg-green-500/20 p-3">
                          <TrendingUp className="text-green-500" size={24} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Average Close Time Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-blue-500/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-frame-gray-light">
                            Tempo Médio de Fechamento
                          </p>
                          <p className="mt-2 text-3xl font-bold text-frame-white">
                            {metrics.avgCloseTime}
                          </p>
                          <p className="mt-1 text-xs text-frame-gray-light">dias</p>
                        </div>
                        <div className="rounded-full bg-blue-500/20 p-3">
                          <Calendar className="text-blue-500" size={24} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Pipeline Velocity Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-purple-500/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-frame-gray-light">
                            Velocidade do Pipeline
                          </p>
                          <p className="mt-2 text-3xl font-bold text-frame-white">
                            {metrics.pipelineVelocity}
                          </p>
                          <p className="mt-1 text-xs text-frame-gray-light">deals/mês</p>
                        </div>
                        <div className="rounded-full bg-purple-500/20 p-3">
                          <Target className="text-purple-500" size={24} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Velocity Change Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-frame-gray-1 border-frame-gray-3 p-6 transition-all hover:border-frame-orange/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-frame-gray-light">
                            Variação Mensal
                          </p>
                          <p className={`mt-2 text-3xl font-bold ${
                            metrics.velocityChange >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {metrics.velocityChange > 0 ? '+' : ''}{metrics.velocityChange}%
                          </p>
                          <p className="mt-1 text-xs text-frame-gray-light">vs mês anterior</p>
                        </div>
                        <div className={`rounded-full p-3 ${
                          metrics.velocityChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <TrendingUp className={
                            metrics.velocityChange >= 0 ? 'text-green-500' : 'text-red-500'
                          } size={24} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* Stage Tickets Table */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-frame-white">
                      Ticket Médio por Stage
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-frame-gray-3">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-frame-gray-light">
                              Stage
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-frame-gray-light">
                              Qtd
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-frame-gray-light">
                              Valor Total
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-frame-gray-light">
                              Ticket Médio
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(metrics.stageTickets).map(([stage, data]) => {
                            const stageLabels: Record<string, string> = {
                              prospect: 'Prospecção',
                              qualified: 'Qualificado',
                              proposal: 'Proposta',
                              negotiation: 'Negociação',
                              won: 'Ganho',
                              lost: 'Perdido',
                            };
                            return (
                              <tr key={stage} className="border-b border-frame-gray-3/50 transition-colors hover:bg-frame-gray-2/30">
                                <td className="px-4 py-3 text-sm text-frame-white">
                                  {stageLabels[stage] || stage}
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-frame-white">
                                  {data.count}
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-frame-white">
                                  R$ {data.totalValue.toLocaleString('pt-BR')}
                                </td>
                                <td className="px-4 py-3 text-right text-sm font-semibold text-frame-orange">
                                  R$ {data.avgTicket.toLocaleString('pt-BR')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          {/* Funnel Tab */}
          <TabsContent value="funnel">
            <Card className="bg-frame-gray-1 border-frame-gray-3 p-8">
              <h3 className="mb-4 text-lg font-semibold text-frame-white">
                Funil de Vendas
              </h3>
              <p className="text-frame-gray-light">
                Funil visual em desenvolvimento...
              </p>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-6">
              {/* Filters Section */}
              <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                <h3 className="mb-4 text-lg font-semibold text-frame-white">
                  Filtros de Relatório
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm text-frame-gray-light">
                      Data Início
                    </label>
                    <input
                      type="date"
                      value={reportFilters.startDate}
                      onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      className="w-full border border-frame-gray-3 bg-frame-black px-3 py-2 text-sm text-frame-white focus:border-frame-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-frame-gray-light">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      value={reportFilters.endDate}
                      onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      className="w-full border border-frame-gray-3 bg-frame-black px-3 py-2 text-sm text-frame-white focus:border-frame-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-frame-gray-light">
                      Stage
                    </label>
                    <select
                      value={reportFilters.stage}
                      onChange={(e) => setReportFilters({ ...reportFilters, stage: e.target.value })}
                      className="w-full border border-frame-gray-3 bg-frame-black px-3 py-2 text-sm text-frame-white focus:border-frame-orange focus:outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="prospect">Prospecção</option>
                      <option value="qualified">Qualificado</option>
                      <option value="proposal">Proposta</option>
                      <option value="negotiation">Negociação</option>
                      <option value="won">Ganho</option>
                      <option value="lost">Perdido</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleApplyFilters}
                    className="frame-btn-primary"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="frame-btn-ghost"
                  >
                    Limpar
                  </button>
                </div>
              </Card>

              {/* Export Buttons */}
              <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                <h3 className="mb-4 text-lg font-semibold text-frame-white">
                  Exportar Relatórios
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={exportLoading}
                    className="frame-btn-primary flex items-center gap-2"
                    aria-label="Exportar relatório em formato Excel"
                  >
                    {exportLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    Exportar Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={exportLoading}
                    className="frame-btn-primary flex items-center gap-2"
                    aria-label="Exportar relatório em formato PDF"
                  >
                    {exportLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={exportLoading}
                    className="frame-btn-ghost flex items-center gap-2"
                    aria-label="Exportar relatório em formato CSV"
                  >
                    {exportLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    Exportar CSV
                  </button>
                </div>
                <p className="mt-3 text-xs text-frame-gray-light">
                  Os relatórios serão gerados com base nos filtros aplicados acima.
                </p>
              </Card>

              {/* Report Preview */}
              <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                <h3 className="mb-4 text-lg font-semibold text-frame-white">
                  Preview do Relatório
                </h3>
                {filteredStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-frame-gray-light">Receita Total</p>
                        <p className="text-xl font-bold text-frame-white">
                          R$ {filteredStats.revenue.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-frame-gray-light">Oportunidades</p>
                        <p className="text-xl font-bold text-frame-white">
                          {filteredStats.opportunities}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-frame-gray-light">Taxa de Conversão</p>
                        <p className="text-xl font-bold text-frame-white">
                          {filteredStats.conversionRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-frame-gray-light">Ticket Médio</p>
                        <p className="text-xl font-bold text-frame-white">
                          R$ {filteredStats.avgTicket.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-frame-gray-light">
                      Período: {reportFilters.startDate || 'Início'} até {reportFilters.endDate || 'Hoje'}
                      {reportFilters.stage !== 'all' && ` • Stage: ${reportFilters.stage}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-frame-gray-light">
                    Aplique os filtros acima para visualizar o preview do relatório
                  </p>
                )}
              </Card>

              {/* Scheduled Reports */}
              <Card className="bg-frame-gray-1 border-frame-gray-3 p-6">
                <h3 className="mb-4 text-lg font-semibold text-frame-white">
                  Relatórios Agendados
                </h3>
                <p className="mb-4 text-sm text-frame-gray-light">
                  Configure relatórios automáticos por email (Em breve)
                </p>
                <button
                  disabled
                  className="frame-btn-ghost opacity-50 cursor-not-allowed"
                >
                  Configurar Agendamento
                </button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
