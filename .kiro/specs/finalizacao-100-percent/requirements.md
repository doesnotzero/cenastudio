# 📋 REQUIREMENTS - Finalização 100%

**Status**: Draft
**Criado**: 04 Jul 2026
**Objetivo**: Completar os 9% finais do projeto (91% → 100%)

---

## 🎯 OVERVIEW

Completar 4 áreas críticas para atingir 100% de completude:
1. Analytics Premium (50% → 100%)
2. Polish Final (60% → 100%)
3. E2E Tests (0% → 100%)
4. Performance & Bug Fixes (80% → 100%)

**Critério de Sucesso**: Deploy production-ready com zero erros críticos.

---

## 1️⃣ ANALYTICS PREMIUM

### 1.1 Dashboards Customizáveis
**Prioridade**: HIGH
**Status Atual**: 0% (não existe)

#### Requisitos Funcionais:
- [ ] RF-AP-001: Usuário pode criar dashboards personalizados
- [ ] RF-AP-002: Suportar 8 tipos de widgets:
  - KPI Card (número + variação)
  - Line Chart (tendências)
  - Bar Chart (comparações)
  - Pie Chart (distribuição)
  - Table (dados tabulares)
  - Funnel Chart (conversão)
  - Heatmap (intensidade)
  - Gauge (progresso meta)
- [ ] RF-AP-003: Drag & drop para organizar widgets
- [ ] RF-AP-004: Salvar layouts personalizados
- [ ] RF-AP-005: Compartilhar dashboards com equipe

#### Requisitos Não-Funcionais:
- [ ] RNF-AP-001: Render < 2s para dashboards com até 12 widgets
- [ ] RNF-AP-002: Responsivo mobile (collapse em lista vertical)
- [ ] RNF-AP-003: Persistir no SQLite (não localStorage)

#### Dados de Entrada:
- Tickets, Users, Projects, Proposals, Commercial data

#### Dados de Saída:
- Dashboard layouts (JSON)
- Widget configs (type, dataSource, filters)

---

### 1.2 Relatórios Avançados
**Prioridade**: HIGH
**Status Atual**: 30% (existe básico no Commercial Hub)

#### Requisitos Funcionais:
- [ ] RF-RA-001: Relatórios pré-configurados:
  - Performance de Vendas (mensal/trimestral)
  - Produtividade de Equipe (tickets/user)
  - Análise de Pipeline (stages, conversão)
  - ROI de Projetos (receita vs custo)
  - Customer Health Score (NPS, tickets, renovação)
- [ ] RF-RA-002: Filtros avançados:
  - Date range (custom, presets)
  - Multi-select (users, stages, projects)
  - Comparação de períodos (vs last month/year)
- [ ] RF-RA-003: Agendamento de relatórios:
  - Diário/Semanal/Mensal
  - Email automático (PDF anexo)
  - Webhook para integrações
- [ ] RF-RA-004: Drill-down em métricas:
  - Clicar em gráfico → ver detalhes
  - Filtrar em tempo real

#### Requisitos Não-Funcionais:
- [ ] RNF-RA-001: Exportação PDF < 5s (até 50 páginas)
- [ ] RNF-RA-002: Exportação Excel < 3s (até 10k linhas)
- [ ] RNF-RA-003: Queries otimizadas (índices no Prisma)

---

### 1.3 Exportação Premium
**Prioridade**: MEDIUM
**Status Atual**: 50% (CSV existe, Excel/PDF placeholder)

#### Requisitos Funcionais:
- [ ] RF-EP-001: Export Excel (XLSX):
  - Múltiplas sheets (summary, details, charts)
  - Formatação (cores, borders, fonts)
  - Fórmulas nativas (SUM, AVERAGE)
  - Usar biblioteca: `exceljs`
- [ ] RF-EP-002: Export PDF:
  - Branding (logo, cores empresa)
  - Multi-página com header/footer
  - Charts como imagens (PNG embed)
  - Usar biblioteca: `pdfkit` ou `puppeteer`
- [ ] RF-EP-003: Export PowerPoint (PPTX):
  - Slides pré-formatados
  - Charts nativos (editáveis)
  - Usar biblioteca: `pptxgenjs`
- [ ] RF-EP-004: Batch export:
  - Múltiplos relatórios em ZIP
  - Progress bar durante geração

#### Requisitos Não-Funcionais:
- [ ] RNF-EP-001: Geração assíncrona (não bloquear UI)
- [ ] RNF-EP-002: Download direto ou email (> 10MB)

---

## 2️⃣ POLISH FINAL

### 2.1 Mobile Responsiveness
**Prioridade**: HIGH
**Status Atual**: 60% (funciona mas não otimizado)

#### Requisitos Funcionais:
- [ ] RF-MR-001: Breakpoints consistentes:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- [ ] RF-MR-002: Navigation mobile:
  - Bottom tab bar (5 ícones principais)
  - Hamburger menu (secundário)
  - Swipe gestures (voltar)
- [ ] RF-MR-003: Tables mobile:
  - Card layout (não scroll horizontal)
  - Expand/collapse detalhes
- [ ] RF-MR-004: Charts mobile:
  - Touch interactions (pinch zoom, pan)
  - Simplificar dados (menos pontos)
- [ ] RF-MR-005: Forms mobile:
  - Input types corretos (tel, email, date)
  - Teclado otimizado
  - Large touch targets (44px min)

#### Requisitos Não-Funcionais:
- [ ] RNF-MR-001: Lighthouse Mobile Score > 90
- [ ] RNF-MR-002: Touch delay < 100ms
- [ ] RNF-MR-003: Viewport units corretos (dvh não vh)

---

### 2.2 Animações e Microinterações
**Prioridade**: MEDIUM
**Status Atual**: 20% (básico do shadcn/ui)

#### Requisitos Funcionais:
- [ ] RF-AM-001: Page transitions:
  - Fade in/out (150ms)
  - Slide lateral (rotas)
- [ ] RF-AM-002: Loading states:
  - Skeleton screens (não spinners genéricos)
  - Progress bars (uploads, exports)
  - Shimmer effect
- [ ] RF-AM-003: Feedback interactions:
  - Button press (scale 0.95)
  - Hover effects (subtle lift)
  - Success/error animations (checkmark, shake)
- [ ] RF-AM-004: Data visualization:
  - Chart animations (draw effect)
  - Number counters (count up)
  - Progress circles

#### Requisitos Não-Funcionais:
- [ ] RNF-AM-001: Respect prefers-reduced-motion
- [ ] RNF-AM-002: GPU-accelerated (transform, opacity)
- [ ] RNF-AM-003: FPS > 60 (no jank)

---

### 2.3 Accessibility (a11y)
**Prioridade**: HIGH
**Status Atual**: 40% (básico do shadcn/ui)

#### Requisitos Funcionais:
- [ ] RF-A11Y-001: Keyboard navigation:
  - Tab order lógico
  - Skip links (pular para conteúdo)
  - Focus visible (outline)
  - Esc para fechar modals
- [ ] RF-A11Y-002: Screen readers:
  - ARIA labels completos
  - Live regions (notificações)
  - Landmark roles
  - Alt text em imagens
- [ ] RF-A11Y-003: Contraste de cores:
  - WCAG AA (4.5:1 texto normal)
  - WCAG AAA (7:1 texto importante)
  - Dark mode compliant
- [ ] RF-A11Y-004: Forms acessíveis:
  - Labels associados
  - Error messages descritivos
  - Required fields marcados
  - Autocomplete attributes

#### Requisitos Não-Funcionais:
- [ ] RNF-A11Y-001: WCAG 2.1 Level AA compliance
- [ ] RNF-A11Y-002: Lighthouse Accessibility Score > 95
- [ ] RNF-A11Y-003: Testar com:
  - VoiceOver (macOS)
  - NVDA (Windows)
  - Keyboard only

---

### 2.4 Performance Optimization
**Prioridade**: HIGH
**Status Atual**: 70% (bom mas pode melhorar)

#### Requisitos Funcionais:
- [ ] RF-PO-001: Code splitting:
  - Lazy load routes
  - Lazy load heavy components (charts)
  - Dynamic imports
- [ ] RF-PO-002: Asset optimization:
  - Images: WebP + fallback
  - Icons: SVG sprites
  - Fonts: subset, preload
- [ ] RF-PO-003: API optimization:
  - Request deduplication
  - Stale-while-revalidate
  - Infinite scroll (não pagination simples)
- [ ] RF-PO-004: Bundle optimization:
  - Tree shaking
  - Remove unused CSS
  - Minify production

#### Requisitos Não-Funcionais:
- [ ] RNF-PO-001: Lighthouse Performance > 90
- [ ] RNF-PO-002: First Contentful Paint < 1.5s
- [ ] RNF-PO-003: Time to Interactive < 3s
- [ ] RNF-PO-004: Bundle size < 300KB (gzipped)

---

## 3️⃣ E2E TESTS

### 3.1 Framework Setup
**Prioridade**: HIGH
**Status Atual**: 0%

#### Requisitos Técnicos:
- [ ] RT-E2E-001: Escolher framework: **Playwright** (recomendado)
  - Motivo: multi-browser, fast, TypeScript native
  - Alternativa: Cypress (mais simples mas limitado)
- [ ] RT-E2E-002: Estrutura de testes:
  ```
  e2e/
  ├── fixtures/        # Dados de teste
  ├── pages/           # Page Object Model
  ├── tests/
  │   ├── auth/
  │   ├── tickets/
  │   ├── commercial/
  │   └── analytics/
  └── playwright.config.ts
  ```
- [ ] RT-E2E-003: CI/CD integration:
  - GitHub Actions workflow
  - Run on PR + merge to main
  - Parallel execution (3 workers)
  - Screenshot/video on failure

---

### 3.2 Critical User Flows
**Prioridade**: HIGH
**Status Atual**: 0%

#### Cenários de Teste:
- [ ] TC-E2E-001: Autenticação
  - Login success
  - Login failure (senha errada)
  - Logout
  - Session persistence
- [ ] TC-E2E-002: Ticket Lifecycle
  - Criar ticket
  - Atribuir a usuário
  - Mudar status
  - Adicionar comentário
  - Fechar ticket
- [ ] TC-E2E-003: Commercial Hub
  - Visualizar dashboard
  - Filtrar por período
  - Exportar CSV
  - Drill-down em métrica
- [ ] TC-E2E-004: Proposals
  - Criar proposta
  - Adicionar serviços
  - Gerar PDF
  - Salvar/carregar histórico
- [ ] TC-E2E-005: Analytics
  - Criar dashboard customizado
  - Adicionar widget
  - Reorganizar layout
  - Salvar dashboard

#### Requisitos Não-Funcionais:
- [ ] RNF-E2E-001: Suite completa < 5min
- [ ] RNF-E2E-002: 0% flakiness (testes instáveis)
- [ ] RNF-E2E-003: Cobertura > 80% dos fluxos críticos

---

### 3.3 Visual Regression Testing
**Prioridade**: MEDIUM
**Status Atual**: 0%

#### Requisitos Técnicos:
- [ ] RT-VRT-001: Screenshot comparison:
  - Tool: `@playwright/test` (built-in)
  - Baseline images versionadas no Git
  - Threshold: 0.2% pixel diff tolerance
- [ ] RT-VRT-002: Componentes testados:
  - All pages (mobile + desktop)
  - Key components (modal, dropdown, chart)
  - Dark mode variants
- [ ] RT-VRT-003: Diff review workflow:
  - CI gera report HTML
  - Develop aprova/rejeita changes
  - Update baselines automático

---

## 4️⃣ PERFORMANCE & BUG FIXES

### 4.1 Performance Audit
**Prioridade**: HIGH
**Status Atual**: 80%

#### Checklist:
- [ ] PA-001: Lighthouse CI:
  - Run em cada PR
  - Budget alerts (bundle size, FCP)
  - Track over time
- [ ] PA-002: Bundle analysis:
  - `vite-bundle-visualizer`
  - Identificar heavy imports
  - Replace ou lazy load
- [ ] PA-003: Database queries:
  - Review all Prisma queries
  - Add missing indexes
  - Use `select` (não trazer tudo)
  - Batch queries quando possível
- [ ] PA-004: Memory leaks:
  - useEffect cleanups
  - Event listener removals
  - AbortController em fetches

---

### 4.2 Bug Fixing Pass
**Prioridade**: HIGH
**Status Atual**: N/A (identificar bugs primeiro)

#### Processo:
1. [ ] BF-001: Manual testing completo
   - Testar cada página
   - Testar cada feature
   - Testar mobile
   - Testar diferentes usuários/roles
2. [ ] BF-002: Error logging:
   - Setup Sentry ou similar
   - Track JS errors
   - Track API errors
   - Monitor performance
3. [ ] BF-003: Fix bugs encontrados:
   - Priorizar: critical > high > medium > low
   - Criar testes para regressions
   - Document fixes

---

## 5️⃣ ACCEPTANCE CRITERIA

### Deploy Production-Ready:
- [ ] AC-001: Zero erros no console (browser)
- [ ] AC-002: Zero erros no server logs
- [ ] AC-003: Todos os testes E2E passando
- [ ] AC-004: Lighthouse scores:
  - Performance > 90
  - Accessibility > 95
  - Best Practices > 95
  - SEO > 90
- [ ] AC-005: Mobile testing:
  - iPhone (Safari)
  - Android (Chrome)
  - Tablet (iPad)
- [ ] AC-006: Browser compatibility:
  - Chrome (últimas 2 versões)
  - Firefox (últimas 2 versões)
  - Safari (últimas 2 versões)
  - Edge (últimas 2 versões)

---

## 📊 COMPLETION TRACKING

| Área | Atual | Meta | Gap |
|------|-------|------|-----|
| Analytics Premium | 50% | 100% | 50% |
| Polish Final | 60% | 100% | 40% |
| E2E Tests | 0% | 100% | 100% |
| Performance | 80% | 100% | 20% |
| **OVERALL** | **91%** | **100%** | **9%** |

---

## ⏱️ ESTIMATIVA DE ESFORÇO

- **Analytics Premium**: 3-4 dias
- **Polish Final**: 2-3 dias
- **E2E Tests**: 2-3 dias
- **Performance & Bugs**: 1-2 dias

**Total**: 8-12 dias (1.5-2 semanas)

---

## 🎯 NEXT STEPS

1. Review e aprovar requirements
2. Criar design detalhado (arquitetura)
3. Implementar por prioridade
4. Testar continuamente
5. Deploy final

**Status**: ⏳ Aguardando aprovação para prosseguir com Design
