---
name: error-monitoring
description: "Use when the user requests error handling improvements, logging, monitoring setup, error boundaries, user-facing error messages, or recovery patterns. Front-loaded keywords: erro, error, log, logging, monitoramento, boundary, fallback, toast, excecao, exception, catch, try, recovery, health."
---

# Skill: error-monitoring

Use this skill when implementing error handling, logging, or monitoring on the FRAME.AI Director.

## Error Hierarchy
- AppError class: { message: string, statusCode: number } em errorHandler.ts
- Resposta padrão: { success: false, error: string }
- Categorias: 400 Validation, 401 Unauthorized, 403 Forbidden, 404 NotFound, 429 RateLimit, 500 Internal

## Backend Error Handling
- Controller pattern: try/catch com next(error)
- asyncHandler wrapper para controllers async
- Zod errors convertidos para AppError 400 com primeira mensagem
- Erro desconhecido: logError + 500 genérico

## Frontend Error Handling
- ErrorBoundary no topo da árvore React
- Toda chamada API em try/catch com toast.error()
- Loading + Error + Empty states em todos componentes de dados
- EmptyState component para listas vazias com CTA

## Logging
- console.log aceitável em dev — remover antes de commit
- Log estruturado: JSON.stringify({ level, message, userId, action, timestamp })
- NUNCA logar tokens, passwords, API keys

## Monitoring
- Endpoint /api/health: { status: 'ok', db: 'connected', timestamp, uptime }
- Vercel Analytics coleta requests, status, duração
- Considerar Sentry quando houver budget

## User-Facing Errors
- Mensagens em português claro — sem stack trace
- Erro acionável: "Limite excedido. Faça upgrade."
- Botão "Tentar novamente" em erros de rede
- Form errors inline (não em toast)

## Recovery Patterns
- Optimistic updates com rollback em erro
- Undo toast para ações destrutivas (5s)
- Auto-retry em rate limit (429) após Retry-After header
- Graceful degradation: app funciona sem Stripe/IA offline
