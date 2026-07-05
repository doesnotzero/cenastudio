---
name: performance-auditor
description: Use when auditing Cena Studio/FRAME.AI performance, bundle size, loading times, render performance, or optimization opportunities. Apply before production deployments, after adding heavy features, or whenever the user mentions slowness, lag, or "it feels slow".
---

# Performance Auditor

## Overview

Use this skill to turn "the app feels slow" into a concrete performance audit and optimization plan. The goal is not premature optimization first; it is measurable performance: users should experience fast loading, smooth interactions, and responsive UI.

## Core Lens

Every audited surface must meet these performance thresholds:

1. **First Contentful Paint (FCP) < 1.8s** - User sees first content quickly
2. **Largest Contentful Paint (LCP) < 2.5s** - Main content loads fast
3. **Time to Interactive (TTI) < 3.9s** - Page becomes interactive quickly
4. **Cumulative Layout Shift (CLS) < 0.1** - No jarring layout shifts
5. **First Input Delay (FID) < 100ms** - Interactions feel responsive

## Who To Call

Simulate or assign these perspectives:

- **Performance Engineer:** analyzes bundle size, loading waterfall, and render performance
- **Frontend Architect:** identifies lazy loading opportunities, code splitting, and caching strategies
- **Backend Engineer:** optimizes API response times, database queries, and caching
- **Network Specialist:** analyzes CDN usage, asset optimization, and network requests
- **Mobile Performance Specialist:** checks mobile-specific performance issues

## Audit Workflow

1. **Measure baseline.** Run Lighthouse on key surfaces: Landing, Login, Dashboard, ProjectHub, Studio, Tools
2. **Identify bottlenecks.** Look for:
   - Large bundle sizes (> 500KB)
   - Unoptimized images (no WebP/AVIF, no responsive images)
   - Render-blocking resources (CSS, JS)
   - Slow API responses (> 500ms)
   - Excessive re-renders in React
   - Memory leaks
   - Unnecessary network requests
3. **Classify each issue.**
   - `P0`: blocks interactivity or causes crashes
   - `P1`: significantly slows down user experience (> 2s delay)
   - `P2`: moderate performance impact (< 2s delay)
   - `P3`: minor optimization opportunities
4. **Optimize in phases.** Prioritize high-impact, low-effort wins first
5. **Validate.** Run Lighthouse, measure before/after, and verify improvements
6. **Document.** Update performance budget, optimization docs, and changelog

## Implementation Rules

- Set performance budgets in Vite config (bundle size, asset size)
- Lazy load routes and components
- Optimize images (WebP/AVIF, responsive images, lazy loading)
- Implement code splitting for heavy features
- Cache API responses with appropriate TTL
- Use React.memo and useMemo judiciously (not everywhere)
- Debounce/throttle expensive operations
- Monitor performance in production with RUM (Real User Monitoring)

## Performance Budget

**Bundle Size:**
- Main bundle: < 500KB
- Individual chunks: < 200KB
- Total initial load: < 1MB

**Asset Size:**
- Images: < 200KB each (optimized)
- Fonts: < 100KB total (subsetted)
- Icons: < 50KB (SVG preferred)

**API Response:**
- GET requests: < 200ms (p95)
- POST requests: < 500ms (p95)
- Database queries: < 100ms (p95)

## Output Format

When reporting an audit, use:

1. **Verdict:** one clear sentence on whether the performance issue is valid
2. **Main reason:** the performance-level cause of slowness
3. **Who to call:** the roles needed and why
4. **Findings:** prioritized list with Lighthouse scores and metrics
5. **Optimization plan:** concrete phases with expected improvements
6. **Performance budget:** current vs target metrics
7. **Done criteria:** Lighthouse scores, bundle size, and loading times improved

## Done Criteria

- Lighthouse Performance score > 90
- FCP < 1.8s, LCP < 2.5s, TTI < 3.9s
- Bundle size within budget
- No render-blocking resources
- Images optimized and lazy loaded
- API responses within SLA
- Performance monitoring in production
- Documentation records optimization decisions
