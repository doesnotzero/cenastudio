---
name: design-system-auditor
description: Use when auditing Cena Studio/FRAME.AI design system consistency, visual hierarchy, spacing, typography, color usage, component reuse, mobile responsiveness, or UI polish. Apply before broad visual changes, after adding new components, or whenever the user mentions visual inconsistency, spacing issues, or "it looks messy".
---

# Design System Auditor

## Overview

Use this skill to turn "the UI looks messy/inconsistent" into a concrete design system audit and implementation plan. The goal is not cosmetic polish first; it is visual consistency: users should experience a cohesive, predictable interface with clear hierarchy, consistent spacing, and reusable components.

## Core Lens

Every audited screen must answer four visual questions without external explanation:

1. **What is the primary action?** Visually dominant CTA with clear hierarchy
2. **What is the visual hierarchy?** Clear information architecture (title → subtitle → body → secondary)
3. **Is spacing consistent?** Predictable gaps between related and unrelated elements
4. **Is this component reusable?** Can this pattern be extracted and reused elsewhere?

## Who To Call

Simulate or assign these perspectives:

- **Product Designer:** checks visual hierarchy, spacing consistency, and component reuse
- **Design System Frontend:** validates component API, props, and implementation patterns
- **Mobile UX Specialist:** checks responsive behavior, touch targets, and mobile layout
- **Accessibility Specialist:** validates color contrast, focus states, and screen reader compatibility
- **Brand Guardian:** ensures changes align with brand identity (black, orange, cinematic language)

## Audit Workflow

1. **Inventory components.** List all UI components: buttons, cards, inputs, modals, navigation, tables, etc.
2. **Pick one surface.** Example: Dashboard, ProjectHub, Studio, Tools, Documents, Files, Reviews.
3. **Mark inconsistency points.** Look for:
   - Inconsistent spacing (4px, 8px, 16px, 24px, 32px pattern violations)
   - Competing visual hierarchy (multiple primary CTAs)
   - Hardcoded values instead of design tokens
   - Duplicate component implementations
   - Inconsistent typography (font sizes, weights, line heights)
   - Color usage violations (brand colors vs semantic colors)
   - Mobile layout issues (overflow, touch targets < 44px)
4. **Classify each issue.**
   - `P0`: breaks accessibility or causes visual confusion
   - `P1`: inconsistent spacing or hierarchy slows user down
   - `P2`: component duplication or hardcoded values
   - `P3`: polish, consistency, or later optimization
5. **Extract reusable components.** Identify patterns that should become shared components
6. **Validate.** Run type/test/build checks and browser-check desktop and mobile for visual consistency
7. **Document.** Update design system docs, component library, and changelog

## Implementation Rules

- Use design tokens (CSS variables) for spacing, colors, typography
- Follow 4px/8px spacing scale consistently
- One primary CTA per surface; secondary actions must visually recede
- Extract reusable components instead of duplicating code
- Ensure minimum touch target of 44px for mobile
- Maintain WCAG AA color contrast (4.5:1 for normal text, 3:1 for large text)
- Preserve brand identity unless user explicitly approves redesign
- Test on both desktop and mobile for every change

## Design Token Reference

**Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**Typography:**
- Display: Bebas Neue (headings, titles)
- Body: DM Sans (paragraphs, labels)
- Mono: JetBrains Mono (code, technical)
- Editorial: Cormorant Garamond (elegant text)

**Colors:**
- Primary: `--color-frame-black` (#000000)
- Secondary: `--color-frame-white` (#f9f9f9)
- Accent: `--color-frame-orange` (#e85002)
- Neutral: `--color-frame-cream` (#d9c3ab)
- Gray scale: `--color-frame-gray-1` through `--color-frame-gray-3`

## Output Format

When reporting an audit, use:

1. **Verdict:** one clear sentence on whether the visual inconsistency is valid
2. **Main reason:** the design-level cause of inconsistency
3. **Who to call:** the roles needed and why
4. **Findings:** prioritized list with file references when available
5. **Component extraction:** list of reusable components to create
6. **Phased execution:** concrete phases with validation and documentation steps
7. **Done criteria:** tests, build, browser checks, and design system docs updated

## Done Criteria

- Spacing follows consistent 4px/8px scale throughout
- Typography hierarchy is predictable (display → heading → body → caption)
- Components are reusable and documented
- Mobile layout works without overflow or tiny touch targets
- Color contrast meets WCAG AA standards
- Design tokens are used instead of hardcoded values
- Documentation records component decisions and patterns
