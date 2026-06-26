---
name: routes-structure
description: "Use when the user requests route changes, new pages, URL restructuring, navigation reorganization, page creation, or routing architecture improvements for the FRAME.AI Director. Front-loaded keywords: rota, route, página, page, router, wouter, useLocation, useRoute, navegação, navigation, path, URL, link, redirecionar, redirect, SPA, App.tsx."
---

# Skill: routes-structure

Use this skill when creating, modifying, or restructuring routes in the FRAME.AI Director.

## Routing Library

The app uses **[wouter](https://github.com/molefrog/wouter)** (not react-router). Key imports:
```tsx
import { useLocation, useRoute, Route, Switch, Link } from "wouter";
import { useParams } from "wouter";
```

## Route Definitions

Routes are defined in `client/src/App.tsx` inside the `<Router>` component:

```tsx
function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      ...
      <Route component={NotFound} />
    </Switch>
  );
}
```

## Current Route Table

| Path | Component | Auth | Description |
|---|---|---|---|
| `/` | Landing | No | Landing page |
| `/login` | Login | No | Login |
| `/register` | Register | No | Register |
| `/forgot-password` | ForgotPassword | No | Password reset |
| `/reset-password` | ResetPassword | No | Reset link |
| `/auth/callback` | AuthCallback | No | GitHub OAuth |
| `/dashboard` | Dashboard | Yes | Project dashboard |
| `/project/:id` | ProjectHub | Yes | Project overview |
| `/project/:id/studio/:toolId` | Studio | Yes | Tool workspace |
| `/project/:id/files` | Files | Yes | Project files |
| `/project/:id/video-reviews` | VideoReviews | Yes | Project approvals |
| `/project/:id/collaborators` | Collaborators | Yes | Project team |
| `/clients` | Clients | Yes | CRM kanban |
| `/clients/new` | NewClient | Yes | New client |
| `/clients/:id/editar` | EditClient | Yes | Edit client |
| `/pipeline` | Pipeline | Yes | Sales pipeline |
| `/interactions` | Interactions | Yes | Client interactions |
| `/files` | Files | Yes | File manager |
| `/files/:projectId` | Files | Yes | Project files |
| `/video-reviews` | VideoReviews | Yes | All approvals |
| `/video-reviews/:projectId` | VideoReviews | Yes | Project approvals |
| `/review/:token` | SharedReview | No | Shared review |
| `/collaborators` | Collaborators | Yes | All team |
| `/analytics` | Analytics | Yes | Analytics |
| `/tools` | Tools | Yes | Tool catalog |
| `/tools/:id` | ToolDetail | Yes | Tool details |
| `/profile` | Profile | Yes | User profile |
| `/studio/:id` | Studio | Yes | Studio (no project) |
| `/admin` | AdminDashboard | Admin | Admin panel |
| `/404` | NotFound | No | 404 page |

## Route Patterns

- **Project-scoped**: `/project/:projectId/:section/:sub?` — all pages within a project
- **Standalone**: `/page-name` — pages without project context
- **Client-scoped**: `/clients/:id/:action` — CRM pages
- **Shared (no auth)**: `/review/:token`, `/success` — public/limited pages

## Navigation

Use `useLocation` hook:
```tsx
const [, setLocation] = useLocation();
setLocation("/dashboard"); // navigate
```

URL params:
```tsx
const { id } = useParams<{ id: string }>();
```

Protected routing — wrap in `ProtectedRoute`:
```tsx
export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageContent />
    </ProtectedRoute>
  );
}
```

Admin-only — use `requireAdmin` prop:
```tsx
<ProtectedRoute requireAdmin>
  <AdminContent />
</ProtectedRoute>
```

## Adding a New Page

1. Create page in `client/src/pages/` (named export default)
2. Import in `App.tsx`
3. Add `<Route path="/path" component={PageName} />` inside `<Switch>`
4. Import in `CommandPalette.tsx` if it should appear in Cmd+K search

## Redirect Logic

- `useEffect` + `setLocation` for programmatic redirects
- `<Route component={NotFound} />` as last route (catch-all)

## Important

- Do NOT nest `<Switch>` inside other `<Switch>` — wouter matches first match only
- Route ordering matters: more specific paths before less specific ones
- Project-scoped routes must appear BEFORE general routes (e.g., `/files/:projectId` before `/files`)
