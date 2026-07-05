# Design - MEGAZORD Evolução Completa

**Spec ID**: megazord-evolucao-completa
**Created**: 2026-07-04
**Status**: In Design

---

## 🏗️ ARQUITETURA GERAL

### Stack Tecnológica Atual
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript + Node.js
- **Database**: PostgreSQL (Supabase)
- **Auth**: Passport.js + Supabase Auth
- **Styling**: TailwindCSS + Shadcn/ui
- **Charts**: Recharts
- **AI**: OpenRouter
- **Deploy**: Vercel

### Princípios Arquiteturais
1. **Separation of Concerns**: Frontend/Backend bem separados
2. **RESTful APIs**: Endpoints claros e consistentes
3. **Component-Based**: Componentes React reutilizáveis
4. **Type-Safe**: TypeScript em todo codebase
5. **Real-time Ready**: WebSocket para features real-time

---

## 1️⃣ NOTIFICAÇÕES - Arquitetura

### Backend Components

**Models** (`server/models/notification.ts`)
```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType: string; // 'project', 'opportunity', 'review', etc
  entityId: string;
  read: boolean;
  createdAt: Date;
  metadata: object;
}

enum NotificationType {
  COMMENT = 'comment',
  STATUS_CHANGE = 'status_change',
  NEW_OPPORTUNITY = 'new_opportunity',
  DEADLINE_APPROACHING = 'deadline_approaching',
  CHAT_MESSAGE = 'chat_message',
  APPROVAL_PENDING = 'approval_pending'
}
```

**Controllers** (`server/controllers/notificationController.ts`)
- `getNotifications(userId, filters)` - Lista notificações
- `markAsRead(notificationId)` - Marca como lida
- `markAllAsRead(userId)` - Marca todas como lidas
- `deleteNotification(notificationId)` - Deleta notificação
- `getUnreadCount(userId)` - Conta não lidas

**Services** (`server/services/notificationService.ts`)
- `createNotification(data)` - Cria notificação
- `sendToUser(userId, notification)` - Envia via WebSocket
- `scheduleDeadlineNotifications()` - Job para deadlines

**Routes** (`server/routes/notifications.ts`)
- `GET /api/notifications` - Lista notificações
- `GET /api/notifications/unread-count` - Conta não lidas
- `PUT /api/notifications/:id/read` - Marca como lida
- `PUT /api/notifications/mark-all-read` - Marca todas
- `DELETE /api/notifications/:id` - Deleta

**Database Schema**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_read (user_id, read),
  INDEX idx_created_at (created_at)
);
```

### Frontend Components

**Context** (`client/src/contexts/NotificationContext.tsx`)
- Estado global de notificações
- WebSocket connection para real-time
- Funções: markAsRead, fetchNotifications

**Components**
- `NotificationCenter.tsx` - Dropdown no navbar
- `NotificationItem.tsx` - Item individual
- `NotificationBadge.tsx` - Badge com contagem
- `NotificationToast.tsx` - Toast notifications
- `NotificationSettings.tsx` - Preferências

**Hooks**
- `useNotifications()` - Hook para acessar contexto
- `useWebSocket()` - Hook para WebSocket connection

---

## 2️⃣ CHAT - Arquitetura

### Backend Components

**Models** (`server/models/`)
```typescript
// message.ts
interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  createdAt: Date;
  editedAt?: Date;
  reactions: Reaction[];
}

// chatRoom.ts
interface ChatRoom {
  id: string;
  type: 'project' | 'direct';
  projectId?: string;
  participants: string[]; // user IDs
  lastMessageAt: Date;
  createdAt: Date;
}
```

**Controllers** (`server/controllers/chatController.ts`)
- `getRooms(userId)` - Lista salas do usuário
- `getMessages(roomId, pagination)` - Mensagens da sala
- `sendMessage(roomId, userId, content)` - Envia mensagem
- `uploadAttachment(file)` - Upload de arquivo
- `searchMessages(roomId, query)` - Busca mensagens

**WebSocket** (`server/lib/websocket/chatHandler.ts`)
- `onConnection(socket, userId)` - Conexão estabelecida
- `onSendMessage(data)` - Recebe mensagem
- `onTyping(data)` - Usuário digitando
- `broadcastToRoom(roomId, event, data)` - Broadcast

**Routes**
- `GET /api/chat/rooms` - Lista salas
- `GET /api/chat/rooms/:id/messages` - Mensagens
- `POST /api/chat/rooms/:id/messages` - Envia mensagem
- `POST /api/chat/upload` - Upload anexo

**Database Schema**
```sql
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL, -- 'project' or 'direct'
  project_id UUID REFERENCES projects(id),
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_participants (
  room_id UUID REFERENCES chat_rooms(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP,
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text',
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  INDEX idx_room_created (room_id, created_at DESC)
);
```

### Frontend Components

**Pages**
- `Chat.tsx` - Página principal do chat
- `ChatWindow.tsx` - Janela de conversa

**Components**
- `ChatSidebar.tsx` - Lista de conversas
- `ChatHeader.tsx` - Header da conversa
- `MessageList.tsx` - Lista de mensagens
- `MessageInput.tsx` - Input de mensagem
- `MessageBubble.tsx` - Mensagem individual
- `TypingIndicator.tsx` - "Usuário digitando..."
- `AttachmentPreview.tsx` - Preview de anexos

**Context** (`client/src/contexts/ChatContext.tsx`)
- WebSocket connection
- Estado de salas e mensagens
- Funções de envio/recebimento

---

## 3️⃣ CALENDÁRIO - Arquitetura

### Biblioteca Escolhida
**react-big-calendar** - Full-featured, customizável

### Backend Components

**Models** (`server/models/calendarEvent.ts`)
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  type: 'project' | 'meeting' | 'deadline';
  projectId?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  participants: string[];
  description?: string;
  color?: string;
  createdBy: string;
  createdAt: Date;
}
```

**Controllers** (`server/controllers/calendarController.ts`)
- `getEvents(userId, startDate, endDate)` - Eventos do período
- `createEvent(data)` - Cria evento
- `updateEvent(id, data)` - Atualiza evento
- `deleteEvent(id)` - Deleta evento
- `getProjectTimeline(projectId)` - Timeline do projeto

**Routes**
- `GET /api/calendar/events` - Lista eventos
- `POST /api/calendar/events` - Cria evento
- `PUT /api/calendar/events/:id` - Atualiza
- `DELETE /api/calendar/events/:id` - Deleta
- `GET /api/calendar/projects/:id/timeline` - Timeline

### Frontend Components

**Pages**
- `Calendar.tsx` - Calendário principal
- `ProjectTimeline.tsx` - Timeline de projetos

**Components**
- `CalendarView.tsx` - Wrapper do react-big-calendar
- `EventModal.tsx` - Modal criar/editar evento
- `EventCard.tsx` - Card de evento
- `TimelineChart.tsx` - Gráfico de timeline
- `CalendarFilters.tsx` - Filtros de visualização

**Custom Views**
- Month View (padrão)
- Week View
- Day View
- Agenda View (lista)

---

## 4️⃣ DASHBOARD CUSTOMIZÁVEL - Arquitetura

### Biblioteca Escolhida
**react-grid-layout** - Drag & drop grid system

### Backend Components

**Models** (`server/models/dashboardLayout.ts`)
```typescript
interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  widgets: WidgetConfig[];
  createdAt: Date;
}

interface WidgetConfig {
  id: string;
  type: WidgetType;
  position: { x: number; y: number; w: number; h: number };
  config: object; // Widget-specific config
}

enum WidgetType {
  PROJECTS = 'projects',
  OPPORTUNITIES = 'opportunities',
  REVENUE = 'revenue',
  TASKS = 'tasks',
  CALENDAR = 'calendar',
  NOTIFICATIONS = 'notifications',
  ANALYTICS = 'analytics',
  COMMERCIAL_HUB = 'commercial_hub'
}
```

**Controllers** (`server/controllers/dashboardController.ts`)
- `getLayouts(userId)` - Layouts salvos
- `saveLayout(userId, layout)` - Salva layout
- `deleteLayout(layoutId)` - Deleta layout
- `getWidgetData(widgetType, config)` - Dados do widget

**Routes**
- `GET /api/dashboard/layouts` - Lista layouts
- `POST /api/dashboard/layouts` - Salva layout
- `DELETE /api/dashboard/layouts/:id` - Deleta
- `GET /api/dashboard/widgets/:type/data` - Dados widget

**Database Schema**
```sql
CREATE TABLE dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  widgets JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Frontend Components

**Pages**
- `CustomDashboard.tsx` - Dashboard customizável

**Components**
- `DashboardBuilder.tsx` - Builder com drag & drop
- `WidgetLibrary.tsx` - Biblioteca de widgets disponíveis
- `WidgetWrapper.tsx` - Wrapper com controles
- `WidgetConfig.tsx` - Configuração de widget
- Widgets específicos:
  - `ProjectsWidget.tsx`
  - `OpportunitiesWidget.tsx`
  - `RevenueWidget.tsx`
  - `TasksWidget.tsx`
  - `CalendarWidget.tsx`
  - `NotificationsWidget.tsx`
  - `AnalyticsWidget.tsx`
  - `CommercialHubWidget.tsx`

**Hooks**
- `useDashboardLayout()` - Gerencia layout
- `useWidgetData(type, config)` - Dados do widget

---

## 5️⃣ INTEGRAÇÃO COM IA - Arquitetura

### AI Provider
**OpenRouter** - Já configurado no projeto

### Backend Components

**Services** (`server/services/ai/`)
- `scriptSuggestions.ts` - Sugestões de roteiro
- `budgetAnalysis.ts` - Análise de orçamento
- `proposalGenerator.ts` - Geração de propostas
- `interactionSummarizer.ts` - Resumo de interações
- `sentimentAnalysis.ts` - Análise de sentimento

**Controllers** (`server/controllers/aiController.ts`)
- `generateScriptSuggestions(briefData)` - Sugestões roteiro
- `analyzeBudget(projectId)` - Análise orçamento
- `generateProposal(projectData)` - Gerar proposta
- `summarizeInteraction(interactionId)` - Resumir interação
- `analyzeSentiment(feedbackData)` - Análise sentimento
- `chatbot(query, context)` - Chatbot de ajuda

**Routes**
- `POST /api/ai/script-suggestions` - Sugestões roteiro
- `POST /api/ai/budget-analysis` - Análise orçamento
- `POST /api/ai/generate-proposal` - Gerar proposta
- `POST /api/ai/summarize-interaction` - Resumir
- `POST /api/ai/analyze-sentiment` - Sentimento
- `POST /api/ai/chatbot` - Chatbot

**OpenRouter Integration**
```typescript
// server/lib/ai/openrouter.ts
class AIService {
  async completion(prompt: string, context?: object) {
    // Usa OpenRouter API
    // Model: claude-3-5-sonnet ou gpt-4
    // Streaming: true para UX
  }
}
```

### Frontend Components

**Components**
- `AIScriptSuggestions.tsx` - Interface sugestões
- `AIBudgetAnalysis.tsx` - Interface análise
- `AIProposalGenerator.tsx` - Interface proposta
- `AIChatbot.tsx` - Chatbot floating button
- `AISentimentDashboard.tsx` - Dashboard sentimento

**Hooks**
- `useAI(endpoint, data)` - Hook genérico AI
- `useAIStream()` - Hook para streaming responses

---

## 6️⃣ KANBAN AVANÇADO - Arquitetura

### Biblioteca Escolhida
**@dnd-kit/core** - Modern drag & drop

### Backend Components

**Models** (`server/models/kanbanColumn.ts`)
```typescript
interface KanbanColumn {
  id: string;
  boardId: string; // 'pipeline' para o padrão
  name: string;
  position: number;
  wipLimit?: number;
  color?: string;
}
```

**Controllers** (expandir `opportunityController.ts`)
- `getColumns(boardId)` - Lista colunas
- `createColumn(data)` - Cria coluna
- `updateColumn(id, data)` - Atualiza coluna
- `reorderColumns(boardId, order)` - Reordena
- `moveCard(cardId, toColumnId, position)` - Move card

**Routes** (adicionar em `opportunities.ts`)
- `GET /api/kanban/columns` - Lista colunas
- `POST /api/kanban/columns` - Cria coluna
- `PUT /api/kanban/columns/:id` - Atualiza
- `PUT /api/kanban/reorder-columns` - Reordena
- `PUT /api/opportunities/:id/move` - Move card

### Frontend Components

**Pages** (melhorar `Pipeline.tsx` existente)

**Components**
- `KanbanBoard.tsx` - Board principal
- `KanbanColumn.tsx` - Coluna com drag & drop
- `KanbanCard.tsx` - Card com informações
- `KanbanFilters.tsx` - Filtros avançados
- `SwimLaneView.tsx` - Vista com swimlanes
- `CardQuickEdit.tsx` - Edição inline
- `ColumnSettings.tsx` - Config de coluna

**Hooks**
- `useKanban()` - Estado e funções do kanban
- `useDndKit()` - Wrapper do @dnd-kit

---

## 7️⃣ EXPORTS - Arquitetura

### Bibliotecas
- **xlsx** - Excel export
- **papaparse** - CSV export
- **jspdf** + **html2canvas** - PDF export (já tem jspdf)

### Backend Components

**Services** (`server/services/export/`)
- `excelExporter.ts` - Geração de Excel
- `csvExporter.ts` - Geração de CSV
- `pdfExporter.ts` - Geração de PDF
- `jsonExporter.ts` - Geração de JSON

**Controllers** (`server/controllers/exportController.ts`)
- `exportProjects(format, filters)` - Exporta projetos
- `exportClients(format, filters)` - Exporta clientes
- `exportAnalytics(format, dateRange)` - Exporta analytics
- `exportReport(reportType, data)` - Exporta relatório

**Routes**
- `GET /api/export/projects/:format` - Exporta projetos
- `GET /api/export/clients/:format` - Exporta clientes
- `GET /api/export/analytics/:format` - Exporta analytics
- `POST /api/export/report` - Exporta relatório custom

### Frontend Components

**Components**
- `ExportButton.tsx` - Botão com dropdown de formatos
- `ExportModal.tsx` - Modal com opções de export
- `ExportProgress.tsx` - Progress bar do export

**Implementação**
- Botões de export em: Projects, Clients, Pipeline, Commercial Hub, Analytics
- Download direto do arquivo gerado
- Nome descritivo: `cenastudio_projects_2026-07-04.xlsx`

---

## 8️⃣ PERMISSÕES - Arquitetura

### Backend Components

**Models** (`server/models/`)
```typescript
// role.ts
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array de permission IDs
  isSystem: boolean; // true para roles padrão
  createdAt: Date;
}

// permission.ts
interface Permission {
  id: string;
  module: string; // 'projects', 'clients', etc
  action: string; // 'create', 'read', 'update', 'delete'
  description: string;
}
```

**Middleware** (`server/middleware/permissions.ts`)
```typescript
function requirePermission(module: string, action: string) {
  return async (req, res, next) => {
    const userId = req.user.id;
    const hasPermission = await checkPermission(userId, module, action);
    if (!hasPermission) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    next();
  };
}
```

**Controllers** (`server/controllers/permissionController.ts`)
- `getRoles()` - Lista roles
- `createRole(data)` - Cria role
- `updateRole(id, data)` - Atualiza role
- `deleteRole(id)` - Deleta role (se não sistema)
- `assignRole(userId, roleId)` - Atribui role
- `checkPermission(userId, module, action)` - Verifica permissão

**Routes**
- `GET /api/permissions/roles` - Lista roles
- `POST /api/permissions/roles` - Cria role
- `PUT /api/permissions/roles/:id` - Atualiza
- `DELETE /api/permissions/roles/:id` - Deleta
- `POST /api/permissions/assign` - Atribui role

**Database Schema**
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[] NOT NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Roles padrão
INSERT INTO roles (name, description, permissions, is_system) VALUES
('admin', 'Administrador', ARRAY['*.*'], true),
('manager', 'Gerente', ARRAY['projects.*', 'clients.*', 'opportunities.*'], true),
('producer', 'Produtor', ARRAY['projects.read', 'projects.update'], true),
('client', 'Cliente', ARRAY['projects.read'], true);
```

### Frontend Components

**Pages**
- `PermissionsAdmin.tsx` - Gestão de permissões

**Components**
- `RoleList.tsx` - Lista de roles
- `RoleEditor.tsx` - Editor de role
- `PermissionMatrix.tsx` - Matriz de permissões
- `UserRoleAssignment.tsx` - Atribuir roles

**Guards** (`client/src/guards/`)
- `PermissionGuard.tsx` - Guard para rotas
- `usePermission()` - Hook para verificar permissão

---

## 9️⃣ AUDITORIA - Arquitetura

### Backend Components

**Models** (`server/models/auditLog.ts`)
```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string; // 'create', 'update', 'delete'
  entityType: string; // 'project', 'client', etc
  entityId: string;
  oldValues?: object;
  newValues?: object;
  ip: string;
  userAgent: string;
  createdAt: Date;
}
```

**Middleware** (`server/middleware/audit.ts`)
```typescript
function auditLog(entityType: string) {
  return async (req, res, next) => {
    // Captura dados da requisição
    // Após resposta, loga a ação
    res.on('finish', () => {
      logAudit({
        userId: req.user.id,
        action: req.method,
        entityType,
        entityId: req.params.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    });
    next();
  };
}
```

**Controllers** (`server/controllers/auditController.ts`)
- `getAuditLogs(filters, pagination)` - Lista logs
- `getEntityHistory(entityType, entityId)` - Histórico entidade
- `exportLogs(filters, format)` - Exporta logs

**Routes**
- `GET /api/audit/logs` - Lista logs
- `GET /api/audit/:entityType/:id/history` - Histórico
- `GET /api/audit/export/:format` - Exporta

**Database Schema**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_user_created (user_id, created_at DESC)
);
```

### Frontend Components

**Pages**
- `AuditLog.tsx` - Página de logs

**Components**
- `AuditLogTable.tsx` - Tabela de logs
- `AuditLogFilters.tsx` - Filtros
- `EntityHistoryTimeline.tsx` - Timeline de entidade
- `AuditLogExport.tsx` - Exportar logs

---

## 🔟 TESTES - Arquitetura

### Testing Stack
- **Vitest** - Unit tests
- **Supertest** - API tests
- **Playwright** - E2E tests (já instalado)
- **MSW** - Mock Service Worker para testes

### Estrutura de Testes

**Backend Tests** (`server/__tests__/`)
```
__tests__/
├── unit/
│   ├── controllers/
│   ├── services/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── setup.ts
```

**Frontend Tests** (`client/src/__tests__/`)
```
__tests__/
├── components/
├── pages/
├── hooks/
└── utils/
```

**E2E Tests** (`tests/e2e/`)
```
e2e/
├── auth.spec.ts
├── projects.spec.ts
├── clients.spec.ts
├── pipeline.spec.ts
└── chat.spec.ts
```

### Test Configuration

**vitest.config.ts**
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: 70
    }
  }
});
```

**playwright.config.ts** (já existe)
- Browsers: chromium, firefox, webkit
- Base URL: http://localhost:5000
- Screenshots on failure
- Video on failure

---

## 1️⃣1️⃣ UX/UI DESIGN SYSTEM

### Design Tokens

**Colors** ⚠️ **MANTER AS CORES ATUAIS DO SISTEMA - NÃO MUDAR!**
- Usar as cores que já estão definidas no projeto
- NÃO criar novo theme.ts
- NÃO alterar paleta de cores existente
- NÃO mudar branding/slogan
- Apenas MELHORAR consistência do que já existe

**Typography** ⚠️ **MANTER TIPOGRAFIA ATUAL - NÃO MUDAR!**
- Usar fonte que já está definida no projeto
- NÃO alterar font-family
- Apenas padronizar TAMANHOS já existentes
- Manter consistência com o que já existe

**Spacing** (Tailwind padrão)
- 4px increments: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

### Component States

**Button States**
- Default: bg-primary-500, hover:bg-primary-600
- Active: bg-primary-700, scale-95
- Disabled: opacity-50, cursor-not-allowed
- Loading: spinner + disabled

**Input States**
- Default: border-gray-300
- Focus: border-primary-500, ring-2
- Error: border-error, text-error
- Success: border-success
- Disabled: bg-gray-100, cursor-not-allowed

### Animations

**Transitions** (Tailwind)
- `transition-all duration-200 ease-in-out`
- `transition-colors duration-150`
- `transition-transform duration-200`

**Custom Animations**
```css
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1280px

### Accessibility

**WCAG 2.1 AA Compliance**
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande
- Todos interativos acessíveis por teclado
- ARIA labels em ícones
- Focus indicators visíveis
- Mensagens de erro descritivas

---

## 1️⃣2️⃣ PERFORMANCE OPTIMIZATION

### Database Optimization

**Índices**
```sql
-- Projetos
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);

-- Oportunidades
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_value ON opportunities(estimated_value);

-- Notificações
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Mensagens
CREATE INDEX idx_messages_room_created ON messages(room_id, created_at DESC);

-- Audit logs
CREATE INDEX idx_audit_user_created ON audit_logs(user_id, created_at DESC);
```

**Query Optimization**
- Usar `SELECT` específico (não `SELECT *`)
- Pagination em todas listas
- Eager loading de relações (evitar N+1)
- Cache de queries frequentes (Redis futuro)

### Frontend Optimization

**Code Splitting**
```typescript
// Lazy load rotas
const Projects = lazy(() => import('./pages/Projects'));
const Chat = lazy(() => import('./pages/Chat'));
const Calendar = lazy(() => import('./pages/Calendar'));
```

**Image Optimization**
- Lazy loading: `loading="lazy"`
- WebP quando disponível
- Thumbnails para previews (150x150px)
- CDN para assets estáticos

**Bundle Optimization**
- Tree shaking habilitado
- Minificação em produção
- Gzip compression
- Target: < 500KB gzipped

### Caching Strategy

**Backend**
- Headers de cache em assets estáticos
- ETags em APIs de leitura
- Futuro: Redis para cache de sessões

**Frontend**
- React Query para cache de dados
- LocalStorage para preferências
- Service Worker para offline (futuro)

---

## 1️⃣3️⃣ DOCUMENTAÇÃO

### README.md Structure
1. Logo + Descrição
2. Features principais
3. Screenshots
4. Instalação (passo a passo)
5. Configuração (env vars)
6. Como rodar
7. Scripts disponíveis
8. Tecnologias usadas
9. Contribuição
10. Licença

### API Documentation
**Swagger/OpenAPI** - Gerar automaticamente

### User Guide
**Estrutura** (`docs/user-guide.md`)
1. Introdução
2. Login e Cadastro
3. Dashboard
4. Projetos
5. Clientes
6. Pipeline
7. Chat
8. Calendário
9. Notificações
10. Configurações
11. FAQ
12. Troubleshooting

### Technical Documentation
**Estrutura** (`docs/technical/`)
- `architecture.md` - Arquitetura geral
- `database.md` - Schema e relações
- `api.md` - Documentação de APIs
- `deployment.md` - Deploy process
- `contributing.md` - Como contribuir

---

## 🚀 DEPLOYMENT STRATEGY (Segunda-feira)

### Pre-Deploy Checklist
- [ ] Todos testes passando
- [ ] Build local sem erros
- [ ] Variáveis de ambiente documentadas
- [ ] Database migrations preparadas
- [ ] Documentação atualizada

### Deploy Steps
1. Criar contas novas (GitHub, Vercel, Supabase)
2. Configurar Supabase (database, auth, storage)
3. Push código para GitHub
4. Conectar Vercel ao repo
5. Configurar env vars no Vercel
6. Deploy!

### Monitoring
- Vercel Analytics
- Error tracking (Sentry futuro)
- Performance monitoring

---

**STATUS**: Design 100% definido ✅
**PRÓXIMO**: Criar Tasks detalhadas 📋
