# FRAME.AI Director - Log de Upgrades

## Data: 23 de Junho de 2026

### Visão Geral
Este documento detalha todas as implementações realizadas para aumentar o valor percebido, escalabilidade e experiência do usuário do FRAME.AI Director. Todas as funcionalidades foram implementadas localmente.

---

## ✅ Implementações Concluídas

### 1. Módulo CRM (Clientes, Oportunidades, Interações)

#### 1.1 Schema do Banco de Dados
**Arquivo:** `server/models/db.ts`

**Tabelas Adicionadas:**
- `clients`: Armazena informações de clientes (nome, empresa, email, telefone, segmento, status, notas, total gasto, datas de contato)
- `opportunities`: Gerencia oportunidades de vendas (título, estágio, valor estimado, probabilidade, data prevista de fechamento)
- `interactions`: Histórico de interações com clientes (tipo, direção, resumo, resultado, próximo follow-up)
- `collaborators`: Gestão de colaboradores/equipe
- `project_members`: Membros por projeto com permissões
- `files`: Upload de arquivos organizados por projeto

**Alterações na tabela `projects`:**
- Adicionada coluna `client_id` para vincular projetos a clientes
- Adicionada coluna `status` (active, completed, archived)

#### 1.2 Backend - API Endpoints

**Arquivos Criados:**
- `server/controllers/clientsController.ts`: CRUD completo de clientes + estatísticas
- `server/controllers/opportunitiesController.ts`: CRUD completo de oportunidades + estatísticas de pipeline
- `server/controllers/interactionsController.ts`: CRUD completo de interações + próximos follow-ups
- `server/routes/clients.ts`: Router consolidado para clientes, oportunidades e interações
- `server/controllers/exportController.ts`: Sistema de exportação (JSON, CSV)
- `server/routes/export.ts`: Rotas de exportação

**Endpoints Disponíveis:**
```
/api/clients
  GET    /              - Listar todos os clientes
  GET    /:id           - Obter cliente específico
  POST   /              - Criar novo cliente
  PUT    /:id           - Atualizar cliente
  DELETE /:id           - Excluir cliente
  GET    /stats         - Estatísticas de clientes

/api/clients/opportunities
  GET    /              - Listar oportunidades
  GET    /:id           - Obter oportunidade específica
  POST   /              - Criar oportunidade
  PUT    /:id           - Atualizar oportunidade
  DELETE /:id           - Excluir oportunidade
  GET    /stats         - Estatísticas de pipeline

/api/clients/interactions
  GET    /              - Listar interações (com filtros por tipo e cliente)
  GET    /:id           - Obter interação específica
  POST   /              - Criar interação
  PUT    /:id           - Atualizar interação
  DELETE /:id           - Excluir interação
  GET    /upcoming      - Próximos follow-ups

/api/export
  GET    /projects/:id   - Exportar projeto (JSON/CSV)
  GET    /clients/:id   - Exportar cliente específico (JSON/CSV)
  GET    /clients        - Exportar todos os clientes (JSON/CSV)
  GET    /pipeline       - Exportar pipeline de vendas (JSON/CSV)
```

#### 1.3 Frontend - UI Components

**Arquivos Criados:**
- `client/src/pages/Clients.tsx`: Página completa de gestão de clientes
  - Listagem com filtros (status, segmento, busca)
  - Cards de clientes com estatísticas
  - Modal de criação/edição de clientes
  - Modal de confirmação de exclusão
  - Dashboard com métricas (total clientes, valor total, segmentação)
  - Animações com framer-motion
  - Notificações com sonner

- `client/src/pages/Pipeline.tsx`: Kanban board de pipeline de vendas
  - 6 estágios: Prospecção, Reunião, Proposta, Negociação, Fechado, Perdido
  - Cards de oportunidades com valor e probabilidade
  - Navegação entre estágios
  - Estatísticas de pipeline (valor total, oportunidades, fechados no mês)
  - Modal de criação/edição de oportunidades
  - Vinculação com clientes
  - Animações e transições

- `client/src/pages/Interactions.tsx`: Histórico de interações
  - Listagem cronológica de interações
  - Filtros por tipo (ligação, email, reunião, mensagem) e cliente
  - Cards detalhados com ícones por tipo
  - Indicador de direção (recebido/enviado)
  - Campo de resultado e próximo follow-up
  - Modal de criação/edição
  - Vinculação com clientes e oportunidades

**Arquivos Modificados:**
- `client/src/App.tsx`: Adicionadas rotas `/clients`, `/pipeline`, `/interactions`
- `client/src/contexts/ProjectContext.tsx`: Atualizado `createProject` para aceitar `clientId` opcional
- `client/src/lib/api.ts`: Atualizado `api.projects.create` para enviar `clientId`
- `server/controllers/projectsController.ts`: Atualizado para salvar `client_id` ao criar projeto
- `server/router.ts`: Integrado `clientsRoutes` e `exportRoutes`
- `client/src/pages/Dashboard.tsx`: Adicionado campo de seleção de cliente no modal de criação de projeto

#### 1.4 Integração Projetos ↔ Clientes

**Funcionalidades:**
- Campo de seleção de cliente ao criar projeto
- Projetos vinculados aparecem na página do cliente
- Estatísticas de projetos por cliente
- Exportação de dados cruzados

---

### 2. Sistema de Exportação Avançado

**Arquivos:**
- `server/controllers/exportController.ts`: Lógica de exportação
- `server/routes/export.ts`: Rotas de exportação

**Funcionalidades:**
- Exportação em JSON e CSV
- Exportação de projetos (com estados das ferramentas)
- Exportação de clientes (com oportunidades, interações e projetos)
- Exportação de pipeline de vendas
- Nomes de arquivo com timestamp
- Headers apropriados para download

**Formatos Suportados:**
- JSON: Dados estruturados completos
- CSV: Planilhas compatíveis com Excel/Google Sheets

---

## 📊 Estrutura de Dados

### Tabela: clients
```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  segment TEXT DEFAULT 'direct',
  status TEXT DEFAULT 'lead',
  notes TEXT,
  total_spent INTEGER DEFAULT 0,
  first_contact_at TEXT,
  last_contact_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Tabela: opportunities
```sql
CREATE TABLE opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'prospect',
  estimated_value INTEGER,
  probability INTEGER DEFAULT 50,
  expected_close_date TEXT,
  lost_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Tabela: interactions
```sql
CREATE TABLE interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  direction TEXT NOT NULL,
  summary TEXT NOT NULL,
  outcome TEXT,
  next_follow_up TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## 🎨 UI/UX Melhorias

### Componentes Utilizados
- **Radix UI**: Dialog, Dropdown Menu
- **Framer Motion**: Animações suaves de entrada/saída
- **Sonner**: Toast notifications
- **Lucide React**: Ícones modernos
- **Tailwind CSS**: Estilização consistente

### Padrões de Design
- Modais animados com backdrop
- Cards com hover effects
- Transições suaves entre estados
- Feedback visual imediato (toasts)
- Layout responsivo
- Tipografia frame-mono para labels e frame-display para títulos

---

## 🔒 Segurança

- Todas as rotas de CRM requerem autenticação via JWT
- Validação de user_id em todas as operações
- Cascade delete para manter integridade referencial
- Tratamento de erros com mensagens apropriadas

---

### 2. Sistema de Exportação Avançado

**Arquivos:**
- `server/controllers/exportController.ts`: Lógica de exportação
- `server/routes/export.ts`: Rotas de exportação

**Funcionalidades:**
- Exportação em JSON e CSV
- Exportação de projetos (com estados das ferramentas)
- Exportação de clientes (com oportunidades, interações e projetos)
- Exportação de pipeline de vendas
- Nomes de arquivo com timestamp
- Headers apropriados para download

**Formatos Suportados:**
- JSON: Dados estruturados completos
- CSV: Planilhas compatíveis com Excel/Google Sheets

---

### 3. Sistema de Upload de Arquivos Local

**Arquivos:**
- `server/controllers/filesController.ts`: Controller para gerenciamento de arquivos
- `server/routes/files.ts`: Rotas de arquivos
- `client/src/pages/Files.tsx`: Página de gestão de arquivos

**Funcionalidades:**
- Upload de arquivos organizados por projeto
- Diretório específico por projeto (`uploads/project_{id}`)
- Metadados de arquivo (nome, tipo, tamanho, caminho)
- Download de arquivos
- Exclusão de arquivos (física e do banco)
- Ícones por tipo de arquivo (imagem, vídeo, áudio, PDF)
- Formatação de tamanho de arquivo
- Barra de progresso durante upload

**Endpoints:**
```
/api/files
  GET    /projects/:projectId   - Listar arquivos do projeto
  POST   /upload                 - Upload de arquivo
  GET    /:id                    - Obter informações do arquivo
  GET    /:id/download           - Baixar arquivo
  DELETE /:id                    - Excluir arquivo
```

**Rota Frontend:**
- `/files/:projectId` - Página de arquivos do projeto

---

### 4. Gestão de Equipe/Colaboradores

**Arquivos:**
- `server/controllers/collaboratorsController.ts`: Controller de colaboradores
- `server/routes/collaborators.ts`: Rotas de colaboradores
- `client/src/pages/Collaborators.tsx`: Página de gestão de equipe

**Funcionalidades:**
- CRUD completo de colaboradores
- Cargos predefinidos (Admin, Editor, Cinegrafista, Diretor, Produtor, Membro)
- Status de colaborador (Ativo, Inativo, Pendente)
- Taxa horária por colaborador
- Skills e competências
- Estatísticas de equipe
- Filtros por cargo e status
- Cards de colaboradores com informações detalhadas

**Endpoints:**
```
/api/collaborators
  GET    /              - Listar colaboradores
  GET    /stats         - Estatísticas da equipe
  GET    /:id           - Obter colaborador específico
  POST   /              - Criar colaborador
  PUT    /:id           - Atualizar colaborador
  DELETE /:id           - Excluir colaborador
```

**Rota Frontend:**
- `/collaborators` - Página de gestão de equipe

---

### 5. Dashboard de Analytics e Reports

**Arquivos:**
- `server/controllers/analyticsController.ts`: Controller de analytics
- `server/routes/analytics.ts`: Rotas de analytics
- `client/src/pages/Analytics.tsx`: Página de analytics

**Funcionalidades:**
- Analytics geral (projetos, clientes, pipeline, AI, equipe)
- Analytics de receita (receita mensal, ticket médio, taxa de conversão)
- Analytics de atividade (atividade recente, atividade diária)
- Gráficos de receita por mês
- Receita por segmento de cliente
- Métricas de vendas
- Atualização manual de dados
- Formatação de moeda e números

**Endpoints:**
```
/api/analytics
  GET    /overall        - Analytics geral
  GET    /projects/:id   - Analytics específico do projeto
  GET    /revenue        - Analytics de receita
  GET    /activity       - Analytics de atividade
```

**Rota Frontend:**
- `/analytics` - Página de analytics

---

## 📝 Próximos Passos (Pendentes)

### Prioridade Alta
- [x] Implementar upload de arquivos local com organização por projeto

### Prioridade Média
- [x] Implementar gestão de equipe/colaboradores
- [x] Criar dashboard de analytics e reports
- [ ] Implementar multi-usuário por projeto com permissões
- [ ] Melhorar UX com modais animados e transições suaves

### Prioridade Baixa
- [ ] Implementar dark/light theme toggle completo
- [ ] Adicionar atalhos de teclado e busca global
- [ ] Criar sistema de notificações in-app

---

## 🚀 Como Usar

### Acessar as Novas Funcionalidades

1. **Gestão de Clientes**
   - Navegue para `/clients`
   - Clique em "Novo Cliente" para adicionar
   - Use filtros para buscar clientes específicos
   - Edite ou exclua clientes através do menu de ações

2. **Pipeline de Vendas**
   - Navegue para `/pipeline`
   - Clique em "Nova Oportunidade" para adicionar
   - Arraste ou use as setas para mover entre estágios
   - Visualize estatísticas no topo da página

3. **Interações**
   - Navegue para `/interactions`
   - Clique em "Nova Interação" para registrar comunicação
   - Filtre por tipo ou cliente
   - Configure próximos follow-ups

4. **Vincular Cliente a Projeto**
   - Ao criar um projeto no Dashboard
   - Selecione um cliente no campo "Cliente (Opcional)"
   - O projeto será vinculado automaticamente

5. **Exportar Dados**
   - Use os endpoints `/export` com parâmetros de formato
   - Exemplo: `/api/export/clients?format=csv`
   - Exemplo: `/api/export/pipeline?format=json`

---

## 📦 Dependências Adicionadas

### Frontend
- `framer-motion`: Para animações
- `sonner`: Para notificações toast

### Backend
- Nenhuma nova dependência necessária (usa SQLite nativo)

---

## 🐛 Erros Conhecidos

### Acessibilidade
- Alguns elementos de formulário não têm atributos de acessibilidade (aria-label, title)
- Isso pode ser corrigido em uma atualização futura sem afetar a funcionalidade

---

### 9. Login com GitHub para Admin

#### 9.1 Configuração OAuth
**Arquivo:** `server/config/passport.ts`

**Funcionalidades:**
- Integração com GitHub OAuth para login de administradores
- Autenticação via Passport.js
- Criação automática de usuários admin via GitHub
- Vinculação de contas existentes ao GitHub

**Variáveis de Ambiente (.env):**
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

**Rotas:**
```
/api/auth/github          - Iniciar fluxo OAuth
/api/auth/github/callback  - Callback OAuth (redireciona para /dashboard)
```

**Frontend:**
- Botão de login com GitHub adicionado à página `Login.tsx`
- Ícone do GitHub com label "Entrar com GitHub (Admin)"

---

### 10. Sistema de Review de Vídeos (Estilo Frame.io)

#### 10.1 Schema do Banco de Dados
**Arquivo:** `server/models/db.ts`

**Tabelas Adicionadas:**
- `video_reviews`: Reviews de vídeos vinculados a projetos e arquivos
  - Campos: id, project_id, file_id, user_id, title, description, status, share_token, expires_at
- `video_comments`: Comentários com timestamp em vídeos
  - Campos: id, review_id, user_id, author_name, timestamp_seconds, comment, resolved

#### 10.2 Backend - API Endpoints
**Arquivos Criados:**
- `server/controllers/videoReviewsController.ts`: Controller completo para reviews
- `server/routes/videoReviews.ts`: Router com rotas autenticadas e públicas

**Endpoints Autenticados:**
```
/api/video-reviews
  GET    /projects/:projectId     - Listar reviews de um projeto
  GET    /:id                     - Obter review específico com comentários
  POST   /                        - Criar novo review
  PUT    /:id                     - Atualizar review
  DELETE /:id                     - Excluir review
  POST   /:id/share               - Gerar link compartilhável
  POST   /:id/comments            - Adicionar comentário
  PUT    /comments/:id/resolve    - Resolver/reabrir comentário
  DELETE /comments/:id            - Excluir comentário
```

**Endpoints Públicos (sem autenticação):**
```
/api/public/video-reviews
  GET    /shared/:token           - Acessar review compartilhado
  POST   /shared/:token/comments  - Adicionar comentário em review compartilhado
```

#### 10.3 Frontend - Páginas
**Arquivos Criados:**
- `client/src/pages/VideoReviews.tsx`: Interface interna para gerenciar reviews
- `client/src/pages/SharedReview.tsx`: Interface pública para clientes

**Funcionalidades de VideoReviews.tsx:**
- Listagem de reviews do projeto
- Visualização de vídeo com player
- Sistema de comentários com timestamp
- Marcação de comentários como resolvidos
- Geração de links compartilháveis
- Exclusão de comentários
- Interface com animações framer-motion

**Funcionalidades de SharedReview.tsx:**
- Acesso público via token
- Visualização de review sem login
- Adição de comentários por clientes
- Exibição de data de expiração
- Interface limpa e intuitiva

**Rotas Frontend:**
```
/video-reviews/:projectId  - Página interna de reviews
/review/:token            - Página pública de review compartilhado
```

---

## 📈 Impacto no Produto

### Valor Percebido
- ✅ Sistema CRM completo integrado
- ✅ Pipeline de vendas visual (Kanban)
- ✅ Histórico de interações detalhado
- ✅ Exportação de dados em múltiplos formatos
- ✅ Vinculação entre projetos e clientes
- ✅ Sistema de review de vídeos estilo Frame.io
- ✅ Links compartilháveis para clientes
- ✅ Login admin via GitHub

### Escalabilidade
- ✅ Schema preparado para multi-usuário
- ✅ Tabelas de colaboradores e membros de projeto
- ✅ Sistema de permissões estruturado
- ✅ Sistema de reviews com tokens seguros

### Experiência do Usuário
- ✅ Interface moderna e animada
- ✅ Feedback visual imediato
- ✅ Filtros e busca avançados
- ✅ Modal intuitivos
- ✅ Responsividade em diferentes telas
- ✅ Acesso fácil para clientes via links compartilháveis

---

## 🔧 Manutenção

### Backup do Banco
O banco SQLite está localizado em `./data/frame.db`. Recomenda-se:
- Backup regular do arquivo `.db`
- Version control do schema
- Documentação de migrações

### Logs
- Logs de erros são exibidos no console
- Toast notifications para feedback ao usuário
- Tratamento de erros em todos os controladores

---

## 📞 Suporte

Para questões ou problemas, verifique:
1. Console do navegador para erros frontend
2. Console do servidor para erros backend
3. Logs do banco de dados
4. Documentação deste arquivo

---

**Última Atualização:** 23 de Junho de 2026
**Versão:** 2.0.0 (CRM Edition)
