---
name: security-hardening
description: "Use when the user requests security improvements, authentication hardening, input validation, CORS/helmet configuration, SQL injection prevention, XSS protection, or authorization checks. Front-loaded keywords: seguranca, security, auth, jwt, cors, helmet, xss, sql injection, validacao, rate limit, owasp, protecao, safe."
---

# Skill: security-hardening

Use this skill when implementing security improvements on the FRAME.AI Director.

## Helmet & CORS
- helmet() com CSP desligado (app carrega scripts de múltiplas origens)
- CORS com CLIENT_ORIGIN explícito, credentials true, sem wildcard

## Authentication (JWT)
- JWT_SECRET obrigatório — servidor falha sem ele
- Cookie httpOnly, secure (production), sameSite lax, 7d expiry
- bcryptjs hashSync salt 10 para passwords
- Rate limit: auth 20/15min, AI 10/min, contact 30/15min

## SQL Injection Prevention
- SEMPRE prepared statements (? placeholders) — nunca concatenar SQL
- ORDER BY dinâmico validado contra whitelist de colunas permitidas

## XSS Prevention
- React já escapa por padrão — nunca dangerouslySetInnerHTML sem DOMPurify
- Validar URLs do Google Drive: `/^https?:\/\/(www\.)?drive\.google\.com\/file\/d\//`
- Validar href: if (url.startsWith('https://'))

## Authorization
- Toda rota protegida verifica req.user.id (multi-tenancy)
- Admin routes: authenticate + requireAdmin em sequência
- Project members check: SELECT 1 FROM project_members WHERE project_id = ? AND collaborator_id = ?

## Input Validation (Zod)
- Todas entradas validadas com Zod via validateBody middleware
- Strings com maxLength para evitar ataques de memória
- IDs numéricos como z.number().positive()
- Enums com z.enum() para campos fixos (status, role, etc)

## File Upload Safety
- Validar mime type e tamanho (50MB max)
- Salvar com UUID — nunca nome original do usuário
- Prevenir path traversal: path.resolve(storagePath).startsWith(path.resolve(UPLOAD_DIR))

## Error Leakage
- Produção: mensagem genérica "Erro interno do servidor" — sem stack trace
- Zod errors sanitizados: apenas campo + mensagem
- Dev: stack trace apenas se NODE_ENV !== 'production'

## Env Variables
- Obrigatórias: JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ADMIN_EMAILS
- .env nunca commitado
- Todas configuradas no Vercel Dashboard

## API Security
- Métodos HTTP explícitos nas rotas
- Rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining
- Webhook Stripe verifica assinatura: stripe.webhooks.constructEvent()
