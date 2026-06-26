---
name: performance-optimization
description: "Use when the user requests performance improvements, bundle optimization, lazy loading, memoization, database query optimization, caching, or Vite/Vercel configuration tuning. Front-loaded keywords: performance, otimizacao, bundle, chunk, lazy, memo, cache, index, sql, query, vite, vercel, carregamento, velocidade."
---

# Skill: performance-optimization

Use this skill when optimizing performance of the FRAME.AI Director.

## Bundle Optimization (Vite)
- manualChunks para separar vendors: react, radix, player libs
- Chunk principal atual ~2MB raw / 436kB gzip — prioridade #1 quebrá-lo
- Usar vite-bundle-analyzer periodicamente

## Lazy Loading
- React.lazy() + Suspense para TODAS páginas em pages/
- Suspense fallback com LoadingSkeleton
- Prefetch páginas comuns via webpackPrefetch ou <link rel=preload>

## React Performance
- React.memo para componentes com props imutáveis e 5+ instâncias
- useMemo para computações pesadas (sortedList, filteredItems)
- useCallback para callbacks passados a children memoizados
- Keys únicas e estáveis em listas (id, nunca índice)
- Animar apenas transform + opacity (GPU)

## Database Optimization
- Índices obrigatórios: user_id, project_id, email, created_at, status em todas tabelas
- Evitar SELECT * — selecionar colunas necessárias
- Paginação com LIMIT + OFFSET + COUNT(*) separado
- Múltiplos inserts em transação: db.transaction()

## Caching
- API responses raramente mudam (tools, plans) — cache 5 min no cliente
- Context providers como cache natural de dados do usuário
- SQLite em Vercel é efêmero (/tmp/frame.db) — sem cache persistente
- Vite faz hash de filenames para cache busting

## Network Optimization
- Chamadas independentes em paralelo: Promise.all()
- Input debounce 300ms para buscas
- Prefetch data no hover do mouse

## Render Optimization
- Listas 100+ itens considerar virtualização (@tanstack/virtual)
- will-change: transform em elementos animados
- Respeitar prefers-reduced-motion

## Vercel Edge
- maxDuration: 60s, memory: 1024MB
- Cold start ~500ms — considerar pings periódicos
- Edge Functions para latência crítica
