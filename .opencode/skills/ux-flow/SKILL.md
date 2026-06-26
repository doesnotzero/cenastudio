---
name: ux-flow
description: "Use when the user asks for user experience improvements, navigation flow changes, page transitions, user journeys, onboarding, information architecture, menu restructuring, breadcrumb trails, contextual navigation, project workflow, or any UX refinements. Front-loaded keywords: ux, user experience, fluxo, navegação, jornada, onboarding, experiência, flow, breadcrumb, menu, transição, journey, usabilidade."
---

# Skill: ux-flow

Use this skill when the user wants to improve user experience, navigation flows, and page architecture.

## Current Navigation Structure

```
Dashboard (/)          → project list, create, pin, delete
├── /project/:id       → Project Hub (overview + quick tools)
│   ├── Studio         → /project/:id/studio/:toolId
│   ├── Arquivos       → /project/:id/files
│   ├── Aprovação      → /project/:id/video-reviews
│   └── Equipe         → /project/:id/collaborators
├── /tools             → tool catalog
├── /clients           → CRM kanban
├── /pipeline          → sales opportunities (standalone CRM)
├── /files             → file manager (project selector)
├── /video-reviews     → video approval
├── /collaborators     → team management
├── /analytics         → analytics
├── /profile           → user profile
└── /admin             → admin panel
```

## Key UX Problems to Address

1. **No breadcrumb navigation** — users can't easily see where they are in the hierarchy
2. **Disconnected project context** — moving between Studio/Files/Approval within a project requires manual URL changes (now partially fixed with ProjectNav)
3. **Dashboard is the only entry point** — no "recents" on login, no quick-start wizard
4. **Pipeline page is misleading** — named like a production pipeline but is actually a CRM sales board; needs renaming or repurposing
5. **No undo/confirmation for destructive actions** — deletions lack "undo" toast pattern
6. **Loading states lack skeletons** — full-page spinners feel abrupt
7. **Project creation is modal-only** — no dedicated page for complex project setup (creative goals, client, team invite)
8. **No keyboard shortcuts** beyond Cmd+K (which only has navigation commands)

## UX Patterns to Apply

- **Breadcrumbs**: `Dashboard > Project Name > Studio > Roteiro` as clickable trail
- **Skeleton loading**: Use pulsing placeholder blocks instead of spinners for content areas
- **Undo toasts**: After deletion, show toast with "Desfazer" button for 5 seconds
- **Empty state CTAs**: Every empty state should have a clear CTA (Create first X, Learn more)
- **Confirmation dialogs**: Use `Dialog` component for destructive actions, not inline alerts
- **Progressive disclosure**: Show advanced options in expandable sections, hide rarely used features
- **Contextual help**: Small `?` icon near complex fields that opens tooltip

## Procedure

1. Map the current user journey for the feature
2. Identify friction points (too many clicks, unclear labels, missing feedback)
3. Propose simplified flow
4. Implement with minimal changes to existing code
5. Verify the flow end-to-end
