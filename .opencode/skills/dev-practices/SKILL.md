---
name: dev-practices
description: "Use when the user requests TypeScript conventions, code organization, component patterns, state management, API client structure, code splitting, lazy loading, or git workflow improvements. Front-loaded keywords: typescript, codigo, organizacao, componente, import, lazy, split, chunk, performance, git, commit, convencao."
---

# Skill: dev-practices

## TypeScript Strictness
- `strict: true` in tsconfig — no `any` unless unavoidable, then `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a justification comment
- Prefer `interface` over `type` for object shapes (consistent error messages)
- Use `type` for unions, intersections, utility transformations
- All function return types must be explicit (not inferred)

## Imports & File Organization
- Barrel exports: each directory has `index.ts` re-exporting public API
- Import path aliases: use `@/` for `client/src/` and `@shared/` for `shared/`
- No default exports — named exports only (better tree-shaking + rename refactoring)
- Group imports: 3rd party → `@/` / `@shared/` → relative (separated by blank line)

## Code Splitting & Lazy Loading
- All page components in `client/src/pages/` must use `React.lazy()` + `Suspense`
- Wrap in `<Suspense fallback={<LoadingSkeleton />}>` at the router level
- No lazy loading for components used above the fold (navbar, sidebar)
- Target: main entry chunk < 200kB gzip; page chunks < 100kB gzip

## Component Conventions
- One component per file, named after the file (PascalCase)
- Props interface named `{ComponentName}Props` — co-located at top of file
- Use `cn()` from `@/lib/utils` for conditional className merging
- Event handlers prefixed `handle` (e.g. `handleSubmit`, `handleClick`)
- Destructure props in function signature, not in body

## State Management
- Local state: `useState` for UI-only, `useReducer` for complex state machines
- Server state: fetch in context providers (`AuthContext`, `ProjectContext`), pass down
- No Redux, no Zustand — React Context + local state is sufficient for this codebase
- Cache API responses in context to avoid refetching on navigation

## API Client Patterns
- All API calls go through `client/src/lib/api.ts`
- Each API function returns `Promise<ApiResponse<T>>` where `ApiResponse = { success: boolean; data?: T; error?: string }`
- Error handling: throw on network error, return `{ success: false, error }` on API error
- Loading state tracked via `useState` at the call site, not in the API client

## Package Management
- Use `pnpm` (not npm/yarn) — `pnpm-lock.yaml` is source of truth
- `--legacy-peer-deps` flag for compatibility with React 19 + older Radix packages
- No `npm audit fix` unless explicitly reviewed — some vulnerabilities are in dev-only packages
- When adding deps: `pnpm add <pkg>` for runtime, `pnpm add -D <pkg>` for dev

## Git Conventions
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` new feature
  - `fix:` bug fix
  - `refactor:` code change without feature/bug
  - `perf:` performance improvement
  - `style:` formatting only
  - `docs:` documentation
  - `chore:` build/config/tooling
- Always include a body explaining *why* when the change is non-trivial
- Before committing: check `git diff --stat` for unintended files
