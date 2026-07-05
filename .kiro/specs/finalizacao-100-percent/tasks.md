# 📋 TASKS - Finalização 100%

**Status**: Draft
**Criado**: 04 Jul 2026
**Estimativa Total**: 8-12 dias

---

## 🎯 PHASE 1: ANALYTICS PREMIUM (3-4 dias)

### Task 1.1: Database Schema + Migrations
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Adicionar models Dashboard e Widget ao schema.prisma
- [ ] Adicionar model Report e ReportExecution
- [ ] Adicionar indexes otimizados (status, assigneeId, etc)
- [ ] Executar `npx prisma migrate dev --name analytics_premium`
- [ ] Executar `npx prisma generate`
- [ ] Validar schema no SQLite

**Dependências**: Nenhuma
**Arquivos**: `prisma/schema.prisma`

---

### Task 1.2: Dashboard Backend API
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `server/controllers/analyticsController.ts`
- [ ] Implementar CRUD dashboards:
  - getDashboards (list user dashboards)
  - createDashboard
  - getDashboard (by id)
  - updateDashboard (layout + widgets)
  - deleteDashboard
- [ ] Criar `server/routes/analytics.ts`
- [ ] Registrar rotas no `server/router.ts`
- [ ] Validação com Zod
- [ ] Testar endpoints no Postman/Thunder

**Dependências**: Task 1.1
**Arquivos**:
- `server/controllers/analyticsController.ts`
- `server/routes/analytics.ts`
- `server/router.ts`

---

### Task 1.3: Widget Data Endpoints
**Estimativa**: 4h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Endpoint: GET /api/analytics/widgets/:id/data
- [ ] Implementar data mappers para cada tipo:
  - KPI: retorna { value, change, trend }
  - LineChart: retorna { labels, datasets }
  - BarChart: retorna { categories, values }
  - PieChart: retorna { labels, values }
  - Table: retorna { columns, rows }
  - Funnel: retorna { stages, values }
  - Heatmap: retorna { x, y, intensity }
  - Gauge: retorna { value, min, max, target }
- [ ] Suportar filtros (dateRange, users, projects)
- [ ] Cache com TanStack Query (5min stale)

**Dependências**: Task 1.2
**Arquivos**:
- `server/controllers/analyticsController.ts`
- `server/lib/analytics/dataMappers.ts`

---

### Task 1.4: Dashboard Frontend - Grid Layout
**Estimativa**: 4h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Instalar `react-grid-layout`
- [ ] Criar `client/src/pages/Analytics/index.tsx`
- [ ] Criar `client/src/pages/Analytics/DashboardView.tsx`
- [ ] Criar `client/src/components/analytics/DashboardGrid.tsx`
- [ ] Implementar drag & drop
- [ ] Implementar resize de widgets
- [ ] Salvar layout no backend (onLayoutChange)
- [ ] Responsive: mobile = lista vertical

**Dependências**: Task 1.2
**Arquivos**:
- `client/src/pages/Analytics/index.tsx`
- `client/src/pages/Analytics/DashboardView.tsx`
- `client/src/components/analytics/DashboardGrid.tsx`

---

### Task 1.5: Widget Components
**Estimativa**: 6h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/components/analytics/WidgetFactory.tsx`
- [ ] Criar widgets:
  - `widgets/KPIWidget.tsx` (Card com número + variação)
  - `widgets/LineChartWidget.tsx` (Recharts LineChart)
  - `widgets/BarChartWidget.tsx` (Recharts BarChart)
  - `widgets/PieChartWidget.tsx` (Recharts PieChart)
  - `widgets/TableWidget.tsx` (shadcn Table)
  - `widgets/FunnelWidget.tsx` (Recharts custom)
  - `widgets/HeatmapWidget.tsx` (Recharts ScatterChart)
  - `widgets/GaugeWidget.tsx` (Recharts RadialBarChart)
- [ ] Loading states (Skeleton)
- [ ] Error states
- [ ] Empty states

**Dependências**: Task 1.3, Task 1.4
**Arquivos**: `client/src/components/analytics/widgets/*`

---

### Task 1.6: Widget Configuration Modal
**Estimativa**: 3h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/components/analytics/WidgetConfig.tsx`
- [ ] Form com campos:
  - Widget type (select)
  - Title (input)
  - Data source (select)
  - Filters (date range, users, etc)
- [ ] Preview do widget
- [ ] Salvar config no backend
- [ ] Validação com Zod

**Dependências**: Task 1.5
**Arquivos**: `client/src/components/analytics/WidgetConfig.tsx`

---

### Task 1.7: Reports System - Backend
**Estimativa**: 4h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Implementar endpoints:
  - POST /api/analytics/reports (create)
  - GET /api/analytics/reports (list)
  - POST /api/analytics/reports/:id/run (execute)
  - GET /api/analytics/reports/:id/executions (history)
- [ ] Implementar report types:
  - Sales Performance
  - Team Productivity
  - Pipeline Analysis
  - ROI Report
  - Customer Health
- [ ] Background job (setTimeout ou Bull)
- [ ] Salvar resultado em JSON

**Dependências**: Task 1.1
**Arquivos**:
- `server/controllers/analyticsController.ts`
- `server/lib/analytics/reportGenerators.ts`

---

### Task 1.8: Reports System - Frontend
**Estimativa**: 4h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/pages/Analytics/Reports.tsx`
- [ ] Criar `client/src/components/analytics/reports/ReportTemplates.tsx`
- [ ] Criar `client/src/components/analytics/reports/FilterPanel.tsx`
- [ ] Implementar preview de relatório
- [ ] Implementar agendamento (UI apenas, backend simplificado)
- [ ] Mostrar histórico de execuções

**Dependências**: Task 1.7
**Arquivos**:
- `client/src/pages/Analytics/Reports.tsx`
- `client/src/components/analytics/reports/*`

---

### Task 1.9: Export Premium - Excel
**Estimativa**: 3h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Instalar `exceljs`
- [ ] Criar `server/services/ExportService.ts`
- [ ] Implementar generateExcel():
  - Sheet 1: Summary (KPIs)
  - Sheet 2: Details (tabela)
  - Sheet 3: Charts (imagens)
  - Formatação (cores, borders, fonts)
  - Fórmulas nativas
- [ ] Endpoint: POST /api/export/excel
- [ ] Download direto (response buffer)

**Dependências**: Task 1.7
**Arquivos**:
- `server/services/ExportService.ts`
- `server/routes/export.ts`

---

### Task 1.10: Export Premium - PDF
**Estimativa**: 3h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Instalar `pdfkit`
- [ ] Implementar generatePDF():
  - Header com logo
  - Sections (summary, details, charts)
  - Embed chart images
  - Multi-página com header/footer
  - Branding customizável
- [ ] Endpoint: POST /api/export/pdf
- [ ] Download direto

**Dependências**: Task 1.9
**Arquivos**: `server/services/ExportService.ts`

---

### Task 1.11: Export Premium - PowerPoint
**Estimativa**: 2h
**Prioridade**: LOW
**Status**: pending

#### Checklist:
- [ ] Instalar `pptxgenjs`
- [ ] Implementar generatePPTX():
  - Slide 1: Title
  - Slide 2: KPIs
  - Slide 3+: Charts (nativos editáveis)
  - Template corporativo
- [ ] Endpoint: POST /api/export/pptx
- [ ] Frontend: botão Export PowerPoint

**Dependências**: Task 1.10
**Arquivos**: `server/services/ExportService.ts`

---

## 🎨 PHASE 2: POLISH FINAL (2-3 dias)

### Task 2.1: Mobile Navigation
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/components/layout/MobileNav.tsx`
- [ ] Bottom tab bar (5 ícones)
- [ ] Active state highlighting
- [ ] Swipe gestures (opcional)
- [ ] Integrar no Layout.tsx (< 768px)
- [ ] Testar em iPhone/Android

**Dependências**: Nenhuma
**Arquivos**: `client/src/components/layout/MobileNav.tsx`

---

### Task 2.2: Responsive Tables
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/components/ui/ResponsiveTable.tsx`
- [ ] Mobile: Card layout (não scroll horizontal)
- [ ] Desktop: Table normal
- [ ] Expandir/colapsar detalhes
- [ ] Substituir tables existentes:
  - Tickets table
  - Projects table
  - Commercial Hub tables

**Dependências**: Nenhuma
**Arquivos**:
- `client/src/components/ui/ResponsiveTable.tsx`
- `client/src/pages/Tickets.tsx`
- `client/src/pages/Projects.tsx`

---

### Task 2.3: Responsive Charts
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/components/charts/ResponsiveChart.tsx`
- [ ] Auto-resize baseado em container width
- [ ] Mobile: height reduzido (250px)
- [ ] Desktop: height normal (400px)
- [ ] Touch interactions (pinch zoom)
- [ ] Atualizar charts existentes

**Dependências**: Nenhuma
**Arquivos**: `client/src/components/charts/ResponsiveChart.tsx`

---

### Task 2.4: Animations Library
**Estimativa**: 3h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/lib/animations.ts`
- [ ] Implementar animações:
  - fadeIn/fadeOut
  - slideUp/slideDown
  - scaleOnPress
  - hoverLift
- [ ] Respect prefers-reduced-motion
- [ ] Aplicar em componentes principais

**Dependências**: Nenhuma
**Arquivos**: `client/src/lib/animations.ts`

---

### Task 2.5: Skeleton Loaders
**Estimativa**: 2h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Criar skeletons para:
  - DashboardSkeleton
  - TableSkeleton
  - ChartSkeleton
  - CardSkeleton
- [ ] Shimmer effect (CSS animation)
- [ ] Substituir spinners genéricos

**Dependências**: Nenhuma
**Arquivos**: `client/src/components/ui/Skeleton.tsx`

---

### Task 2.6: Count-Up Numbers
**Estimativa**: 1h
**Prioridade**: LOW
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/components/ui/CountUp.tsx`
- [ ] Easing function (easeOutQuad)
- [ ] Intersection Observer (trigger quando visível)
- [ ] Aplicar em KPIs (Home, Commercial)

**Dependências**: Nenhuma
**Arquivos**: `client/src/components/ui/CountUp.tsx`

---

### Task 2.7: Keyboard Navigation
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/hooks/useKeyboardNav.ts`
- [ ] Suportar Arrow keys, Home, End
- [ ] Tab order lógico
- [ ] Focus visible (outline)
- [ ] Esc para fechar modals
- [ ] Skip links (pular navegação)
- [ ] Testar com keyboard only

**Dependências**: Nenhuma
**Arquivos**: `client/src/hooks/useKeyboardNav.ts`

---

### Task 2.8: ARIA Labels Complete
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Auditar todos os componentes
- [ ] Adicionar aria-label onde faltam
- [ ] Adicionar aria-describedby
- [ ] Adicionar landmark roles
- [ ] Live regions (toasts, alerts)
- [ ] Alt text em imagens/ícones
- [ ] Testar com VoiceOver/NVDA

**Dependências**: Nenhuma
**Arquivos**: Todos os componentes

---

### Task 2.9: Color Contrast Audit
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `client/src/lib/a11y.ts` (contrast checker)
- [ ] Auditar todas as cores
- [ ] Garantir WCAG AA (4.5:1)
- [ ] Dark mode compliance
- [ ] Ajustar cores que falham
- [ ] Documentar paleta acessível

**Dependências**: Nenhuma
**Arquivos**: `client/src/lib/a11y.ts`, `tailwind.config.js`

---

### Task 2.10: Code Splitting
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Lazy load routes (React.lazy)
- [ ] Lazy load heavy components (Charts)
- [ ] Suspense boundaries
- [ ] Fallback components
- [ ] Preload critical routes
- [ ] Testar bundle sizes

**Dependências**: Nenhuma
**Arquivos**: `client/src/App.tsx`

---

### Task 2.11: Asset Optimization
**Estimativa**: 2h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Converter images para WebP
- [ ] Criar `client/src/components/ui/OptimizedImage.tsx`
- [ ] SVG sprites para ícones (opcional)
- [ ] Font subsetting
- [ ] Preload critical assets
- [ ] Lazy load images (loading="lazy")

**Dependências**: Nenhuma
**Arquivos**: `client/src/components/ui/OptimizedImage.tsx`

---

### Task 2.12: Bundle Optimization
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Configure manual chunks em vite.config.ts
- [ ] Enable terser minification
- [ ] Remove console.logs em production
- [ ] Tree shaking validation
- [ ] Source maps hidden
- [ ] Run `npm run build` e analisar sizes
- [ ] Target: < 300KB gzipped

**Dependências**: Nenhuma
**Arquivos**: `vite.config.ts`

---

## 🧪 PHASE 3: E2E TESTS (2-3 dias)

### Task 3.1: Playwright Setup
**Estimativa**: 1h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] `npm install -D @playwright/test`
- [ ] `npx playwright install`
- [ ] Criar `playwright.config.ts`
- [ ] Criar estrutura de pastas (e2e/pages, e2e/fixtures, e2e/tests)
- [ ] Script: `"test:e2e": "playwright test"`
- [ ] Validar com teste simples

**Dependências**: Nenhuma
**Arquivos**: `playwright.config.ts`, `package.json`

---

### Task 3.2: Page Objects
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/pages/LoginPage.ts`
- [ ] Criar `e2e/pages/TicketsPage.ts`
- [ ] Criar `e2e/pages/CommercialPage.ts`
- [ ] Criar `e2e/pages/ProposalsPage.ts`
- [ ] Criar `e2e/pages/AnalyticsPage.ts`
- [ ] Métodos helpers (goto, waitFor, interact)

**Dependências**: Task 3.1
**Arquivos**: `e2e/pages/*`

---

### Task 3.3: Test Fixtures
**Estimativa**: 1h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/fixtures/users.ts`
- [ ] Criar `e2e/fixtures/tickets.ts`
- [ ] Criar `e2e/fixtures/projects.ts`
- [ ] Seed database script (opcional)

**Dependências**: Task 3.1
**Arquivos**: `e2e/fixtures/*`

---

### Task 3.4: Auth Tests
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/tests/auth.spec.ts`
- [ ] Test: Login success
- [ ] Test: Login failure
- [ ] Test: Session persistence
- [ ] Test: Logout
- [ ] Run: `npm run test:e2e`

**Dependências**: Task 3.2, Task 3.3
**Arquivos**: `e2e/tests/auth.spec.ts`

---

### Task 3.5: Ticket Lifecycle Tests
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/tests/tickets.spec.ts`
- [ ] Test: Create ticket
- [ ] Test: Assign ticket
- [ ] Test: Change status
- [ ] Test: Add comment
- [ ] Test: Close ticket
- [ ] Run: `npm run test:e2e`

**Dependências**: Task 3.2, Task 3.3
**Arquivos**: `e2e/tests/tickets.spec.ts`

---

### Task 3.6: Commercial Hub Tests
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/tests/commercial.spec.ts`
- [ ] Test: View dashboard
- [ ] Test: Filter by date
- [ ] Test: Export CSV
- [ ] Test: Drill-down metrics
- [ ] Run: `npm run test:e2e`

**Dependências**: Task 3.2
**Arquivos**: `e2e/tests/commercial.spec.ts`

---

### Task 3.7: Proposals Tests
**Estimativa**: 2h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/tests/proposals.spec.ts`
- [ ] Test: Create proposal
- [ ] Test: Add services
- [ ] Test: Generate PDF
- [ ] Test: Save/load history
- [ ] Run: `npm run test:e2e`

**Dependências**: Task 3.2
**Arquivos**: `e2e/tests/proposals.spec.ts`

---

### Task 3.8: Analytics Tests
**Estimativa**: 3h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/tests/analytics.spec.ts`
- [ ] Test: Create dashboard
- [ ] Test: Add widget
- [ ] Test: Drag widget
- [ ] Test: Save layout
- [ ] Test: Export report
- [ ] Run: `npm run test:e2e`

**Dependências**: Task 3.2, Task 1.6
**Arquivos**: `e2e/tests/analytics.spec.ts`

---

### Task 3.9: Visual Regression Tests
**Estimativa**: 2h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Criar `e2e/tests/visual.spec.ts`
- [ ] Screenshot: Homepage (desktop/mobile)
- [ ] Screenshot: Commercial dashboard
- [ ] Screenshot: Analytics dashboard
- [ ] Screenshot: Dark mode
- [ ] Baseline images em Git
- [ ] Run: `npm run test:e2e`

**Dependências**: Task 3.1
**Arquivos**: `e2e/tests/visual.spec.ts`

---

### Task 3.10: CI/CD Integration
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Criar `.github/workflows/e2e.yml`
- [ ] Job: Install + Run tests
- [ ] Upload artifacts (screenshots, videos)
- [ ] Run on PR + push to main
- [ ] Parallel execution (3 workers)
- [ ] Testar workflow no GitHub

**Dependências**: Task 3.4 até 3.9
**Arquivos**: `.github/workflows/e2e.yml`

---

## 🚀 PHASE 4: PERFORMANCE & BUGS (1-2 dias)

### Task 4.1: Lighthouse CI Setup
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] `npm install -D @lhci/cli lighthouse`
- [ ] Criar `lighthouserc.js`
- [ ] Configure budgets (performance, a11y, etc)
- [ ] Script: `"lighthouse": "lhci autorun"`
- [ ] Add to GitHub Actions
- [ ] Run baseline

**Dependências**: Nenhuma
**Arquivos**: `lighthouserc.js`, `.github/workflows/lighthouse.yml`

---

### Task 4.2: Database Indexes
**Estimativa**: 1h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Adicionar indexes ao schema.prisma:
  - Ticket: status, assigneeId, projectId, createdAt
  - User: role, email
  - Project: status, clientId
  - Composite indexes
- [ ] Migration: `npx prisma migrate dev --name add_indexes`
- [ ] Validar query performance

**Dependências**: Nenhuma
**Arquivos**: `prisma/schema.prisma`

---

### Task 4.3: Query Optimization
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Auditar todos os Prisma queries
- [ ] Adicionar `select` (não fetch all)
- [ ] Pagination onde falta (take/skip)
- [ ] Eager loading com `include`
- [ ] Raw queries para aggregations complexas
- [ ] Testar performance

**Dependências**: Task 4.2
**Arquivos**: `server/controllers/*`

---

### Task 4.4: Sentry Setup - Frontend
**Estimativa**: 1h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] `npm install @sentry/react`
- [ ] Init Sentry em `client/src/main.tsx`
- [ ] Configure DSN (env var)
- [ ] Browser tracing
- [ ] Session replay
- [ ] Test error capture

**Dependências**: Nenhuma
**Arquivos**: `client/src/main.tsx`

---

### Task 4.5: Sentry Setup - Backend
**Estimativa**: 1h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] `npm install @sentry/node`
- [ ] Init Sentry em `server/index.ts`
- [ ] Error handler middleware
- [ ] Sanitize sensitive data
- [ ] Test error capture

**Dependências**: Nenhuma
**Arquivos**: `server/index.ts`

---

### Task 4.6: Memory Leak Audit
**Estimativa**: 2h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Auditar useEffect cleanups
- [ ] Auditar event listeners
- [ ] Auditar setInterval/setTimeout
- [ ] Auditar fetch AbortController
- [ ] Fix leaks encontrados
- [ ] Documentar patterns

**Dependências**: Nenhuma
**Arquivos**: Todos os componentes

---

### Task 4.7: Manual Testing Pass
**Estimativa**: 4h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Testar cada página (desktop)
- [ ] Testar cada página (mobile)
- [ ] Testar todos os flows críticos
- [ ] Testar diferentes usuários/roles
- [ ] Criar lista de bugs encontrados
- [ ] Priorizar bugs

**Dependências**: Tasks anteriores
**Arquivos**: `BUG_LIST.md`

---

### Task 4.8: Bug Fixes
**Estimativa**: 4-8h (variável)
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Fix critical bugs
- [ ] Fix high priority bugs
- [ ] Fix medium priority bugs (se tempo)
- [ ] Criar testes para regressions
- [ ] Re-test após fixes

**Dependências**: Task 4.7
**Arquivos**: Variável

---

### Task 4.9: Documentation Update
**Estimativa**: 2h
**Prioridade**: MEDIUM
**Status**: pending

#### Checklist:
- [ ] Atualizar README.md
- [ ] Atualizar DEPLOY_PLAN.md
- [ ] Criar ANALYTICS_GUIDE.md
- [ ] Criar E2E_TESTING.md
- [ ] Atualizar STATUS_PROJETO_ATUAL.md (100%)

**Dependências**: Todas as tasks
**Arquivos**: `*.md`

---

### Task 4.10: Final Deploy
**Estimativa**: 1h
**Prioridade**: HIGH
**Status**: pending

#### Checklist:
- [ ] Run all tests locally
- [ ] Build production: `npm run build`
- [ ] Test production build locally
- [ ] Deploy to Vercel
- [ ] Smoke test production
- [ ] Monitor Sentry for errors
- [ ] Celebrar 🎉

**Dependências**: Todas as tasks
**Arquivos**: Nenhum

---

## 📊 SUMMARY

| Phase | Tasks | Estimativa | Status |
|-------|-------|------------|--------|
| Phase 1: Analytics Premium | 11 | 3-4 dias | pending |
| Phase 2: Polish Final | 12 | 2-3 dias | pending |
| Phase 3: E2E Tests | 10 | 2-3 dias | pending |
| Phase 4: Performance & Bugs | 10 | 1-2 dias | pending |
| **TOTAL** | **43 tasks** | **8-12 dias** | **pending** |

---

## 🎯 CRITICAL PATH

1. Analytics Database → Analytics Backend → Analytics Frontend
2. Mobile Responsive → Accessibility → Performance
3. E2E Setup → Critical Tests → CI Integration
4. Performance Audit → Bug Fixes → Deploy

---

**Status**: ⏳ Pronto para iniciar implementação
**Próxima Ação**: Iniciar Phase 1, Task 1.1
