# FRAME.AI Director — Auditoria Completa de Melhorias

Gerada em 25/06/2026 após revisão de todos os setores com 11 skills ativas.

---

## Índice
1. [🔴 CRÍTICO — Segurança](#1-seguranca)
2. [🔴 CRÍTICO — Performance](#2-performance)
3. [🟠 ALTO — Analytics & Dados](#3-analytics--dados)
4. [🟠 ALTO — Qualidade de Código](#4-qualidade-de-codigo)
5. [🟡 MÉDIO — Práticas de Desenvolvimento](#5-praticas-de-desenvolvimento)
6. [🟢 MELHORIA — UI/UX & Database](#6-melhoria-uiux--database)
7. [📋 Prioridades para Deploy](#7-prioridades-para-deploy)

---

## 1. Segurança

### 🔴 Crítico

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 1.1 | **OAuth2 sem state parameter** — vulnerável a CSRF login attack | `passport.ts:37` | Atacante pode linkar conta GitHub dele à sessão da vítima |
| 1.2 | **Chaves de API ao vivo no .env** — NVIDIA API key, Stripe publishable key em plaintext no disco | `.env:20,32` | Comprometimento da máquina expõe keys reais |
| 1.3 | **Reset token logado no console** — qualquer log aggregator expõe token de reset de senha | `authService.ts:211` | Atacante com acesso a logs pode resetar senhas |
| 1.4 | **Senhas fracas default** — admin123 / demo123 para seed users | `db.ts:408,423` | Contas seed com senhas trivialmente adivinháveis |
| 1.5 | **Nenhuma validação Zod na maioria das rotas** — projects, clients, opportunities, collaborators, files, video reviews sem validação | Todos controllers exceto auth/contact/ai/admin | Dados malformados podem corromper banco |
| 1.6 | **Upload sem limite de tamanho** — base64 sem validação de tamanho máximo | `filesController.ts:79` | DoS por memory exhaustion via upload gigante |

### 🟠 Alto

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 1.7 | **CSV injection** — células começando com `=`, `+`, `-` podem executar fórmulas no Excel | `exportController.ts:50-56,132-138,189-198,256-264` | Formula injection ao abrir CSV |
| 1.8 | **express.json() sem limit** — sem `{ limit: "1mb" }` | `app.ts:45` | DoS via JSON gigante |
| 1.9 | **Auth rate limit permissivo** — 20/15min (deveria ser 5/15min) | `app.ts:47` | Brute force mais fácil |
| 1.10 | **sameSite lax** — deveria ser strict para CSRF extra | `authenticate.ts:40-46` | CSRF via navegação cross-site |
| 1.11 | **Missing trial_ends_at para GitHub OAuth** — subscription com status trial sem data de fim | `passport.ts:90` | Usuários GitHub OAuth sem trial tracking |

### Recomendações Imediatas
- [ ] Adicionar `state` parameter no GitHub OAuth (passport.ts)
- [ ] Rotacionar NVIDIA_API_KEY e Stripe keys expostas
- [ ] Remover console.log do reset token ou envolver em `if (NODE_ENV === 'development')`
- [ ] Adicionar Zod schemas para todas rotas sem validação
- [ ] Adicionar `express.json({ limit: "1mb" })`
- [ ] Adicionar limite de tamanho no upload de arquivos
- [ ] Escapar células CSV com prefixo `\t` para prevenir formula injection
- [ ] Mudar auth rate limit para 5/15min

---

## 2. Performance

### 🔴 Crítico

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 2.1 | **Nenhum lazy loading** — 26 páginas importadas estaticamente | `App.tsx:10-34` | Bundle inicial de **1.9 MB** — todo código carregado de uma vez |
| 2.2 | **Nenhum manualChunks** no Vite — sem code splitting | `vite.config.ts` | Chunk único monolithic, impossível cache separado |
| 2.3 | **Zero índices no banco** — 16 tabelas, 0 CREATE INDEX | `db.ts` | Full table scan em TODAS queries; degrada O(n) com crescimento |
| 2.4 | **Zero React.memo** — componentes puros re-renderizam sem necessidade | Todos componentes | Milhares de re-renders desnecessários |
| 2.5 | **Zero debounce em buscas** — API call por caractere digitado | `Clients.tsx:375-381`, `Files.tsx:442` | Múltiplas requisições por keystroke |

### 🟠 Alto

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 2.6 | **66 SELECT *** — todas colunas retornadas mesmo quando não usadas | Todos controllers | I/O overhead com JSON blobs grandes |
| 2.7 | **N+1 pattern** — verificação de ownership em query separada antes da query real | 10+ controllers | 2x queries por endpoint |
| 2.8 | **Anthropic sem timeout** — AbortController ausente, pode travar 10+ min | `aiService.ts:80-85` | Request pode exceder timeout Vercel (60s) |
| 2.9 | **Libraries de vídeo carregadas em todas páginas** — HLS (522kB) + Dash (855kB) | `App.tsx` (importação estática) | 1.3 MB de JS desnecessário na landing/login |

### Recomendações Imediatas
- [ ] Adicionar React.lazy() + Suspense para TODAS as 26 páginas em App.tsx
- [ ] Adicionar manualChunks no vite.config.ts (separar react, radix, video libs, pages)
- [ ] Adicionar CREATE INDEX statements no db.ts para TODAS tabelas
- [ ] Adicionar debounce hook (300ms) em Clients.tsx e Files.tsx
- [ ] Adicionar AbortController + timeout 60s no Anthropic provider
- [ ] Adicionar React.memo em componentes puros (EmptyState, FrameShell, NotificationsPopover)
- [ ] Substituir SELECT * por colunas explícitas em list endpoints
- [ ] Lazy-load video libs apenas em páginas de vídeo

---

## 3. Analytics & Dados

### 🔴 Crítico

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 3.1 | **Bug: users.online não existe** — server retorna `{ count, users }`, client espera `{ count, online }` | `AdminDashboard.tsx:24` vs `adminController.ts:41` | Mostra "undefined" no card de usuários |
| 3.2 | **Número de planos hardcoded** — `"3"` no código em vez de fetch da API | `AdminDashboard.tsx:120` | Desatualiza se planos mudarem |

### 🟠 Alto

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 3.3 | **COALESCE ausente em SUM/AVG** — revenue by month (110-122), by segment (126-136), avg deal (141) | `analyticsController.ts` | Valores null no response quebram UI |
| 3.4 | **Generations table sem campos de analytics** — sem status, duration_ms, tokens_used, model | `db.ts:163-170` | Impossível fazer analytics de performance IA |
| 3.5 | **Updated_at ausente** — generations, files, interactions sem tracking de modificação | `db.ts` | Não dá para saber quando foram alterados |
| 3.6 | **Nenhum analytics admin** — adminController não expõe métricas globais (total gerações, receita, etc) | `adminController.ts` | Painel admin sem dados úteis |

### Recomendações Imediatas
- [ ] Corrigir `users.online` → `users.count` ou alinhar server/client
- [ ] Fetch número de planos do servidor em vez de hardcoded
- [ ] Adicionar COALESCE nas queries de SUM/AVG sem ele
- [ ] Adicionar colunas analytics na generations table
- [ ] Adicionar updated_at em generations, files, interactions
- [ ] Criar endpoint GET /api/admin/analytics com métricas globais

---

## 4. Qualidade de Código

### 🔴 Crítico

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 4.1 | **22 casts `as any`** — maioria em videoReviewsController.ts (14 ocorrências) | `videoReviewsController.ts` | TypeScript safety anulado |
| 4.2 | **CheckoutForm.tsx dead code** — componente de cartão de crédito nunca importado | `CheckoutForm.tsx` | 100+ linhas de código morto |
| 4.3 | **Dependências não usadas** — input-otp, next-themes, add, express-session, @types/google.maps | `package.json` | 5+ pacotes desnecessários |
| 4.4 | **@dnd-kit/sortable v10 incompatível com @dnd-kit/core v6** | `package.json` | Versões incompatíveis — provável runtime error |

### 🟠 Alto

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 4.5 | **Export style inconsistente** — contact.ts usa named export, resto usa default export | `routes/contact.ts` | Inconsistência de padrão |
| 4.6 | **Router creation inconsistente** — clients.ts usa `express.Router()`, resto usa `Router()` | `routes/clients.ts:1` | Inconsistência |
| 4.7 | **13 imports de React não usados** — React 19 não precisa de import para JSX | 13 arquivos em client/src | Código desnecessário |
| 4.8 | **DbCount vs DbCountByCount** — dois tipos diferentes para COUNT result | `types.ts:135-141` | Inconsistência entre controllers |
| 4.9 | **ApiResponse type no client vs server** — client tipa manualmente o response de admin.users | `api.ts:142` | Pode esconder erros runtime |

### Recomendações Imediatas
- [ ] Substituir `as any` por tipos adequados em videoReviewsController.ts
- [ ] Remover CheckoutForm.tsx (dead code — Stripe removido)
- [ ] Remover dependências não usadas do package.json
- [ ] Fixar versões compatíveis do @dnd-kit
- [ ] Padronizar export style (named exports em todos routes)
- [ ] Remover imports React não usados
- [ ] Unificar DbCount/DbCountByCount em um tipo só

---

## 5. Práticas de Desenvolvimento

### 🟠 Alto

| # | Problema | Arquivo | Impacto |
|---|----------|---------|---------|
| 5.1 | **ClientFormFields cria funções em todo render** — `const f = (field) => (v) => onChange(field, v)` cria novas referências | `ClientFormFields.tsx:119` | Inputs re-renderizam em cada keystroke |
| 5.2 | **Stripe webhook registrado em app.ts** — foge do pattern router.ts | `app.ts:39-43` | Quebra a convenção de routing |
| 5.3 | **SMTP planejado mas não implementado** — comentário de feature incompleta | `contactController.ts:11` | Tech debt |
| 5.4 | **useMobile vs useIsMobile** — nome do arquivo difere do nome da função exportada | `hooks/useMobile.tsx` | Inconsistência de naming |
| 5.5 | **ADMIN_EMAILS ausente do .env.example** — variável obrigatória não documentada | `.env.example` | Setup difícil para novos devs |

### Recomendações
- [ ] Extrair StyledInput/StyledSelect como componentes memoizados em ClientFormFields
- [ ] Mover webhook route para routes/ e usar middleware especial
- [ ] Implementar SMTP ou remover comentário
- [ ] Renomear arquivo useMobile.tsx → useIsMobile.tsx ou função exportada → useMobile
- [ ] Adicionar ADMIN_EMAILS ao .env.example

---

## 6. Melhoria (UI/UX & Database)

### 🟢 Database

| # | Melhoria | Detalhe | Prioridade |
|---|----------|---------|------------|
| 6.1 | Adicionar índices para TODAS tabelas | 25+ CREATE INDEX para user_id, project_id, email, status, created_at | Alta |
| 6.2 | Adicionar `last_login_at` em users | Tracking de engajamento de usuários | Média |
| 6.3 | Adicionar `status` em generations | Distinguir gerações bem-sucedidas de falhas | Alta |
| 6.4 | Adicionar `duration_ms`, `tokens_used`, `model` em generations | Analytics de performance IA | Alta |
| 6.5 | Adicionar `archived_at` em projects | Tracking de archiving | Baixa |

### 🟢 Frontend

| # | Melhoria | Detalhe | Prioridade |
|---|----------|---------|------------|
| 6.6 | Adicionar chart library (Recharts) | Substituir barras manuais por gráficos interativos | Média |
| 6.7 | Loading skeletons para todas páginas | Suspense fallback em cada lazy page | Alta |
| 6.8 | Error state com retry em todos fetch | Botão "Tentar novamente" em erro de API | Alta |
| 6.9 | Notificações com undo toast para deletar | Ações destrutivas com 5s de undo | Média |
| 6.10 | Tempo real user timezone no analytics | Converter UTC para timezone do usuário | Baixa |

### 🟢 Backend

| # | Melhoria | Detalhe | Prioridade |
|---|----------|---------|------------|
| 6.11 | Agregar endpoint /api/analytics/dashboard | Unificar 3 chamadas em 1 | Média |
| 6.12 | Adicionar /api/analytics/usage | Expor tabela usage para dashboard | Média |
| 6.13 | Adicionar /api/health | Endpoint de health check (DB, uptime) | Baixa |
| 6.14 | Usar csv-stringify em vez de CSV manual | Evitar bugs de quoting/encoding | Média |
| 6.15 | Adicionar BOM utf-8 em CSVs | Compatibilidade Excel Brasil | Baixa |

---

## 7. Prioridades para Deploy

### Sprint 1 — Segurança (2-3 dias)
1. Adicionar `state` no GitHub OAuth (CSRF fix)
2. Rotacionar chaves expostas + remover .env com chaves
3. Remover console.log de reset token
4. Adicionar Zod schemas para rotas sem validação
5. `express.json({ limit: "1mb" })` + limite upload
6. Escapar CSV injection

### Sprint 2 — Performance (2-3 dias)
1. React.lazy() + Suspense em todas páginas
2. manualChunks no vite.config.ts
3. CREATE INDEX para todas tabelas
4. Debounce hook em buscas
5. AbortController + timeout no Anthropic
6. React.memo em componentes puros

### Sprint 3 — Analytics & Code Quality (2-3 dias)
1. Fix users.online bug no AdminDashboard
2. COALESCE nas queries faltando
3. Adicionar colunas analytics na generations table
4. Remover CheckoutForm.tsx + dependências não usadas
5. Substituir `as any` por tipos adequados
6. Adicionar `updated_at` onde falta

### Sprint 4 — Melhorias (1-2 dias)
1. Loading skeletons
2. Error state com retry
3. Endpoint /api/analytics/dashboard
4. CSV com library + BOM
5. Adicionar /api/health
