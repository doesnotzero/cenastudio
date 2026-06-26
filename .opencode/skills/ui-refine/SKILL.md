---
name: ui-refine
description: "Use when the user requests visual design improvements, UI consistency fixes, design system tokens, layout refinements, color/palette tweaks, typography, spacing, responsive design, dark mode adjustments, or any visual polishing of the FRAME.AI Director interface. Front-loaded keywords: visual, design, UI, refinamento, layout, cor, cor, tipografia, espaçamento, responsivo, tema, dark mode, polimento, consistência."
---

# Skill: ui-refine

Use this skill when the user asks for visual/UI improvements on the FRAME.AI Director.

## Design System Tokens

All tokens are defined in `client/src/design-system/tokens.css`. Key variables:

- `--frame-black: #0c0c0c` — primary background
- `--frame-white: #f5f0e8` — primary text  
- `--frame-orange: #ff4d00` — accent color
- `--frame-gray-1/2/3/4` — grayscale scale
- `--frame-gray-light`, `--frame-gray-muted` — text muted variants
- `--frame-red: #dc2626` — destructive actions
- Font stacks: `--font-frame-body` (Inter), `--font-frame-mono` (JetBrains Mono), `--font-frame-display` (Cinzel)

## Code Conventions

- All padding/width/height use `px` or `rem` (not arbitrary Tailwind values)
- Buttons: `frame-btn-primary`, `frame-btn-ghost`, `frame-btn-danger` classes
- Labels: `frame-label` class (mono, uppercase, orange, tiny)
- Titles: `frame-title` class (display font, large)
- Containers: border + `bg-frame-gray-1` or `bg-frame-gray-1/10` for cards
- All inputs: `bg-frame-gray-2 border border-frame-gray-3 outline-none focus:border-frame-orange`
- Import icons from `lucide-react`, not inline SVGs

## Common Issues to Fix

1. **Inconsistent spacing** — cards/panels should use consistent padding (px-4 to px-6, py-3 to py-4)
2. **Missing hover states** — all interactive elements need `hover:` transitions and `cursor-pointer`
3. **Broken dark mode** — check that text has proper contrast against background
4. **Overflow** — use `truncate`, `line-clamp-N`, or `overflow-x-auto` for long content
5. **Loading states** — use `Loader2` with `animate-spin` + descriptive text
6. **Empty states** — use `EmptyState` component from `@/components/EmptyState`
7. **Focus rings** — inputs should have `outline-none focus:border-frame-orange`
8. **Button consistency** — use predefined classes, not inline styles

## Procedure

1. Read the specific page/component file
2. Identify visual issues (spacing, color, typography, hover states, consistency)
3. Read `tokens.css` and neighboring components for style reference
4. Apply changes that match the design system
5. Verify no regression in layout

## Design Principles

- **Cinematic dark**: Deep blacks, subtle borders, orange accent
- **Mono details**: Use `font-frame-mono` for labels, metadata, timestamps
- **Space & breathing**: Generous whitespace, don't cramp
- **Subtle interactions**: Hover color shifts, border highlights, no heavy shadows
- **Consistency over creativity**: Follow existing patterns, don't invent new ones
