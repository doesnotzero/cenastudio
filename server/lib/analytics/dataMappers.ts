/**
 * Analytics Premium - Widget Data Mappers
 *
 * Transforms database queries into widget-specific data formats
 */

import { prisma } from "../../models/prisma.js";

// ===============================================
// TYPES
// ===============================================

export interface WidgetDataRequest {
  userId: bigint;
  dataSource: string;
  config: any;
}

export interface KPIData {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
}

export interface BarChartData {
  categories: string[];
  values: number[];
  colors?: string[];
}

export interface PieChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

export interface TableData {
  columns: Array<{
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'badge';
  }>;
  rows: Array<Record<string, any>>;
}

export interface FunnelData {
  stages: string[];
  values: number[];
  conversion?: number[];
}

export interface HeatmapData {
  x: string[];
  y: string[];
  intensity: number[][];
}

export interface GaugeData {
  value: number;
  min: number;
  max: number;
  target?: number;
  label?: string;
}

// ===============================================
// HELPER FUNCTIONS
// ===============================================

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function getTrend(change: number): 'up' | 'down' | 'neutral' {
  if (change > 1) return 'up';
  if (change < -1) return 'down';
  return 'neutral';
}

function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7); // YYYY-MM
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(date));
  }
  return months;
}

function getCurrentMonth(): string {
  return monthKey(new Date());
}

function getPreviousMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return monthKey(date);
}

// ===============================================
// KPI MAPPERS
// ===============================================

async function mapTicketsKPI(userId: bigint, config: any): Promise<KPIData> {
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();

  // This would use Ticket model when available
  // For now using Opportunity as placeholder
  const [current, previous] = await Promise.all([
    prisma.opportunity.count({
      where: {
        userId,
        createdAt: { gte: new Date(currentMonth + '-01') }
      }
    }),
    prisma.opportunity.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(previousMonth + '-01'),
          lt: new Date(currentMonth + '-01')
        }
      }
    })
  ]);

  const change = calculateChange(current, previous);

  return {
    value: current,
    change: Math.round(change * 10) / 10,
    trend: getTrend(change),
    label: 'Total this month'
  };
}

async function mapRevenueKPI(userId: bigint, config: any): Promise<KPIData> {
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();

  const [currentData, previousData] = await Promise.all([
    prisma.opportunity.aggregate({
      where: {
        userId,
        stage: 'won',
        updatedAt: { gte: new Date(currentMonth + '-01') }
      },
      _sum: { estimatedValue: true }
    }),
    prisma.opportunity.aggregate({
      where: {
        userId,
        stage: 'won',
        updatedAt: {
          gte: new Date(previousMonth + '-01'),
          lt: new Date(currentMonth + '-01')
        }
      },
      _sum: { estimatedValue: true }
    })
  ]);

  const current = currentData._sum.estimatedValue || 0;
  const previous = previousData._sum.estimatedValue || 0;
  const change = calculateChange(current, previous);

  return {
    value: current,
    change: Math.round(change * 10) / 10,
    trend: getTrend(change),
    label: 'Revenue this month'
  };
}

async function mapUsersKPI(userId: bigint, config: any): Promise<KPIData> {
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();

  const [current, previous] = await Promise.all([
    prisma.client.count({
      where: {
        userId,
        createdAt: { gte: new Date(currentMonth + '-01') }
      }
    }),
    prisma.client.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(previousMonth + '-01'),
          lt: new Date(currentMonth + '-01')
        }
      }
    })
  ]);

  const change = calculateChange(current, previous);

  return {
    value: current,
    change: Math.round(change * 10) / 10,
    trend: getTrend(change),
    label: 'New clients this month'
  };
}

async function mapProposalsKPI(userId: bigint, config: any): Promise<KPIData> {
  const currentMonth = getCurrentMonth();

  const [total, won] = await Promise.all([
    prisma.opportunity.count({
      where: {
        userId,
        stage: { in: ['proposal', 'negotiation'] }
      }
    }),
    prisma.opportunity.count({
      where: {
        userId,
        stage: 'won',
        updatedAt: { gte: new Date(currentMonth + '-01') }
      }
    })
  ]);

  return {
    value: total,
    change: won,
    trend: 'neutral',
    label: `${total} active, ${won} won this month`
  };
}

async function mapProjectsKPI(userId: bigint, config: any): Promise<KPIData> {
  const [active, total] = await Promise.all([
    prisma.project.count({
      where: { userId, status: 'active' }
    }),
    prisma.project.count({
      where: { userId }
    })
  ]);

  const percentage = total > 0 ? (active / total) * 100 : 0;

  return {
    value: active,
    change: Math.round(percentage * 10) / 10,
    trend: 'neutral',
    label: `${active} of ${total} active`
  };
}

// ===============================================
// LINE CHART MAPPERS
// ===============================================

async function mapRevenueLineChart(userId: bigint, config: any): Promise<LineChartData> {
  const months = getLast12Months();

  const opportunities = await prisma.opportunity.findMany({
    where: {
      userId,
      stage: 'won',
      updatedAt: {
        gte: new Date(months[0] + '-01')
      }
    },
    select: {
      estimatedValue: true,
      updatedAt: true
    }
  });

  // Group by month
  const monthlyRevenue = new Map<string, number>();
  months.forEach(m => monthlyRevenue.set(m, 0));

  opportunities.forEach(opp => {
    const month = monthKey(opp.updatedAt);
    const current = monthlyRevenue.get(month) || 0;
    monthlyRevenue.set(month, current + (opp.estimatedValue || 0));
  });

  return {
    labels: months.map(m => {
      const [year, month] = m.split('-');
      return `${month}/${year.slice(2)}`;
    }),
    datasets: [{
      label: 'Revenue',
      data: months.map(m => monthlyRevenue.get(m) || 0),
      color: '#10b981'
    }]
  };
}

async function mapOpportunitiesLineChart(userId: bigint, config: any): Promise<LineChartData> {
  const months = getLast12Months();

  const opportunities = await prisma.opportunity.findMany({
    where: {
      userId,
      createdAt: {
        gte: new Date(months[0] + '-01')
      }
    },
    select: {
      stage: true,
      createdAt: true
    }
  });

  // Group by month and stage
  const created = new Map<string, number>();
  const won = new Map<string, number>();
  const lost = new Map<string, number>();

  months.forEach(m => {
    created.set(m, 0);
    won.set(m, 0);
    lost.set(m, 0);
  });

  opportunities.forEach(opp => {
    const month = monthKey(opp.createdAt);
    const currentCreated = created.get(month) || 0;
    created.set(month, currentCreated + 1);

    if (opp.stage === 'won') {
      const currentWon = won.get(month) || 0;
      won.set(month, currentWon + 1);
    } else if (opp.stage === 'lost') {
      const currentLost = lost.get(month) || 0;
      lost.set(month, currentLost + 1);
    }
  });

  return {
    labels: months.map(m => {
      const [year, month] = m.split('-');
      return `${month}/${year.slice(2)}`;
    }),
    datasets: [
      {
        label: 'Created',
        data: months.map(m => created.get(m) || 0),
        color: '#3b82f6'
      },
      {
        label: 'Won',
        data: months.map(m => won.get(m) || 0),
        color: '#10b981'
      },
      {
        label: 'Lost',
        data: months.map(m => lost.get(m) || 0),
        color: '#ef4444'
      }
    ]
  };
}

// ===============================================
// BAR CHART MAPPERS
// ===============================================

async function mapClientsBySegmentBarChart(userId: bigint, config: any): Promise<BarChartData> {
  const clients = await prisma.client.groupBy({
    by: ['segment'],
    where: { userId },
    _count: { _all: true }
  });

  const sorted = clients.sort((a, b) => b._count._all - a._count._all);

  return {
    categories: sorted.map(c => c.segment || 'No segment'),
    values: sorted.map(c => c._count._all)
  };
}

async function mapOpportunitiesByStageBarChart(userId: bigint, config: any): Promise<BarChartData> {
  const stages = ['prospect', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

  const opportunities = await prisma.opportunity.groupBy({
    by: ['stage'],
    where: { userId },
    _count: { _all: true },
    _sum: { estimatedValue: true }
  });

  const stageMap = new Map(opportunities.map(o => [o.stage, o._count._all]));

  return {
    categories: stages.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    values: stages.map(s => stageMap.get(s) || 0)
  };
}

// ===============================================
// PIE CHART MAPPERS
// ===============================================

async function mapRevenueBySegmentPieChart(userId: bigint, config: any): Promise<PieChartData> {
  const opportunities = await prisma.opportunity.findMany({
    where: {
      userId,
      stage: 'won'
    },
    include: {
      client: {
        select: { segment: true }
      }
    }
  });

  const segmentRevenue = new Map<string, number>();

  opportunities.forEach(opp => {
    const segment = opp.client?.segment || 'No segment';
    const current = segmentRevenue.get(segment) || 0;
    segmentRevenue.set(segment, current + (opp.estimatedValue || 0));
  });

  const sorted = Array.from(segmentRevenue.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    labels: sorted.map(([segment]) => segment),
    values: sorted.map(([, value]) => value)
  };
}

// ===============================================
// TABLE MAPPERS
// ===============================================

async function mapRecentClientsTable(userId: bigint, config: any): Promise<TableData> {
  const limit = config.limit || 10;

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      company: true,
      email: true,
      status: true,
      totalSpent: true,
      createdAt: true
    }
  });

  return {
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'total_spent', label: 'Total Spent', type: 'number' },
      { key: 'created_at', label: 'Created', type: 'date' }
    ],
    rows: clients.map(c => ({
      id: String(c.id),
      name: c.name,
      company: c.company || '-',
      email: c.email || '-',
      status: c.status,
      total_spent: c.totalSpent,
      created_at: c.createdAt
    }))
  };
}

async function mapTopOpportunitiesTable(userId: bigint, config: any): Promise<TableData> {
  const limit = config.limit || 10;

  const opportunities = await prisma.opportunity.findMany({
    where: {
      userId,
      stage: { notIn: ['won', 'lost'] }
    },
    orderBy: { estimatedValue: 'desc' },
    take: limit,
    include: {
      client: {
        select: { name: true }
      }
    }
  });

  return {
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'client', label: 'Client', type: 'text' },
      { key: 'stage', label: 'Stage', type: 'badge' },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'probability', label: 'Probability', type: 'number' }
    ],
    rows: opportunities.map(o => ({
      id: String(o.id),
      title: o.title,
      client: o.client?.name || 'No client',
      stage: o.stage,
      value: o.estimatedValue || 0,
      probability: o.probability + '%'
    }))
  };
}

// ===============================================
// FUNNEL MAPPER
// ===============================================

async function mapSalesFunnel(userId: bigint, config: any): Promise<FunnelData> {
  const stages = ['prospect', 'contacted', 'qualified', 'proposal', 'negotiation', 'won'];

  const opportunities = await prisma.opportunity.groupBy({
    by: ['stage'],
    where: { userId },
    _count: { _all: true }
  });

  const stageMap = new Map(opportunities.map(o => [o.stage, o._count._all]));
  const values = stages.map(s => stageMap.get(s) || 0);

  // Calculate conversion rates
  const conversion: number[] = [];
  for (let i = 0; i < stages.length - 1; i++) {
    if (values[i] === 0) {
      conversion.push(0);
    } else {
      conversion.push((values[i + 1] / values[i]) * 100);
    }
  }
  conversion.push(100); // Last stage is 100%

  return {
    stages: stages.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    values,
    conversion: conversion.map(c => Math.round(c * 10) / 10)
  };
}

// ===============================================
// GAUGE MAPPER
// ===============================================

async function mapMonthlyTargetGauge(userId: bigint, config: any): Promise<GaugeData> {
  const target = config.target || 100000;
  const currentMonth = getCurrentMonth();

  const result = await prisma.opportunity.aggregate({
    where: {
      userId,
      stage: 'won',
      updatedAt: { gte: new Date(currentMonth + '-01') }
    },
    _sum: { estimatedValue: true }
  });

  const value = result._sum.estimatedValue || 0;

  return {
    value,
    min: 0,
    max: target,
    target,
    label: `${Math.round((value / target) * 100)}% of target`
  };
}

// ===============================================
// MAIN MAPPER FUNCTION
// ===============================================

export async function getWidgetData(
  type: string,
  dataSource: string,
  userId: bigint,
  config: any = {}
): Promise<any> {

  // KPI widgets
  if (type === 'kpi') {
    switch (dataSource) {
      case 'tickets': return mapTicketsKPI(userId, config);
      case 'revenue': return mapRevenueKPI(userId, config);
      case 'users': return mapUsersKPI(userId, config);
      case 'proposals': return mapProposalsKPI(userId, config);
      case 'projects': return mapProjectsKPI(userId, config);
      case 'clients': return mapUsersKPI(userId, config);
      default: return { value: 0, change: 0, trend: 'neutral' };
    }
  }

  // Line chart widgets
  if (type === 'lineChart') {
    switch (dataSource) {
      case 'revenue': return mapRevenueLineChart(userId, config);
      case 'opportunities': return mapOpportunitiesLineChart(userId, config);
      default: return { labels: [], datasets: [] };
    }
  }

  // Bar chart widgets
  if (type === 'barChart') {
    switch (dataSource) {
      case 'clients': return mapClientsBySegmentBarChart(userId, config);
      case 'opportunities': return mapOpportunitiesByStageBarChart(userId, config);
      default: return { categories: [], values: [] };
    }
  }

  // Pie chart widgets
  if (type === 'pieChart') {
    switch (dataSource) {
      case 'revenue': return mapRevenueBySegmentPieChart(userId, config);
      default: return { labels: [], values: [] };
    }
  }

  // Table widgets
  if (type === 'table') {
    switch (dataSource) {
      case 'clients': return mapRecentClientsTable(userId, config);
      case 'opportunities': return mapTopOpportunitiesTable(userId, config);
      default: return { columns: [], rows: [] };
    }
  }

  // Funnel widget
  if (type === 'funnel') {
    return mapSalesFunnel(userId, config);
  }

  // Gauge widget
  if (type === 'gauge') {
    return mapMonthlyTargetGauge(userId, config);
  }

  // Heatmap (not implemented yet)
  if (type === 'heatmap') {
    return { x: [], y: [], intensity: [] };
  }

  // Fallback
  return {};
}
