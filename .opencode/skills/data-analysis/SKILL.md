---
name: data-analysis
description: "Use when the user requests analytics queries, dashboard metrics, data aggregation, reporting, CSV export, or business intelligence insights. Front-loaded keywords: analise, analytics, dados, data, metrica, metric, dashboard, grafico, chart, relatorio, report, export, csv, aggregation, agregação."
---

# Skill: data-analysis

Use this skill when working with analytics, metrics, and data reporting on the FRAME.AI Director.

## Analytics Controller
- overall: GET /api/analytics/overall — métricas gerais
- project: GET /api/analytics/projects/:id — por projeto
- revenue: GET /api/analytics/revenue — receita
- activity: GET /api/analytics/activity — atividade recente

## Query Patterns
- Total gerações: COUNT(*) FROM generations WHERE user_id = ?
- Por ferramenta: GROUP BY tool_id JOIN tools
- Por período: GROUP BY DATE(created_at) com WHERE dos últimos 30 dias
- Pipeline value: SUM(value) WHERE stage NOT IN ('closed_lost')
- Atividade recente: UNION ALL de generations + projects ORDER BY created_at DESC LIMIT 10

## Admin Analytics
- Total usuários, ativos hoje, por plano, por role
- Receita total: SUM(p.price) FROM subscriptions JOIN plans
- Top 5 ferramentas, média diária de gerações

## Export Module
- GET /api/export/:entity?format=json|csv
- CSV: headers + rows com join(',')
- Content-Type: text/csv para formato CSV

## Frontend Dashboard
- CSS Grid para cards de métricas (sem lib gráfica pesada)
- Barras com div width percentual
- Métrica: label, valor, ícone, tendência, cor
- Period selector: 7d, 30d, 90d, 12m

## Conventions
- user_id scoping em TODAS queries (multi-tenancy)
- COALESCE em valores numéricos para evitar null
- Paginação com LIMIT + OFFSET + ?page&limit
- Cache de analytics com TTL 5 minutos
