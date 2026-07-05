# Implementation Plan: REBRAND FASE 1 - FUNDAÇÃO

## Overview

Phase 1 (Foundation) of the Cena Studio Platform rebrand establishes the core navigation structure, visual storytelling dashboard, and Liquid Glass aesthetic. This phase transforms a confusing platform where Studio IA is hidden and users get lost into an intuitive workflow-guided experience with 5 clear tabs (HOME, CLIENTS, JOBS, STUDIO, FINANCE), a storytelling HOME dashboard, a 3-step onboarding flow, and foundational glassmorphism components.

**Business Value**: Reduce user abandonment from 50% to 30% on day 1, increase Studio IA discovery from 20% to 80%+, decrease time to first job from 15 minutes to < 5 minutes.

**Technical Scope**: React 18 + TypeScript frontend, Tailwind CSS styling, glassmorphism effects with backdrop-filter, existing state management (Zustand/React Query).

---

## Task Breakdown Summary

- **Total Tasks**: 49
- **Phase 1.1 (Foundation Components & Design Tokens)**: 6 tasks
- **Phase 1.2 (Navigation & TopNav)**: 5 tasks
- **Phase 1.3 (HOME Dashboard)**: 17 tasks (including 5 new API tasks)
- **Phase 1.4 (WelcomeModal Onboarding)**: 6 tasks
- **Phase 1.5 (Integration, Testing & Polish)**: 15 tasks (including 2 new API test tasks)
- **Estimated Total Time**: 110-130 hours

---

## Execution Order

Visual DAG showing task dependencies:

```
PHASE 1.1 (Foundation)
├─ 1.1.1 Design Token System ──┬──> ALL OTHER TASKS
├─ 1.1.2 GlassCard Component ──┤
├─ 1.1.3 StatusBadge Component ┤
├─ 1.1.4 ProgressBar Component ┤
├─ 1.1.5 QuickActionButton ────┤
└─ 1.1.6 Tooltip Component ─────┘
         │
         ▼
PHASE 1.2 (Navigation)
├─ 1.2.1 Refactor TopNav (5 tabs) ──┬──> 1.5.2 (Property Tests)
├─ 1.2.2 Navigation State Logic ────┤
├─ 1.2.3 Search Command Palette ────┤
├─ 1.2.4 Theme Toggle Integration ──┤
└─ 1.2.5 Mobile Responsive Nav ─────┘
         │
         ▼
PHASE 1.3 (HOME Dashboard + Backend APIs)
├─ 1.3.1 WorkflowCard Component ─────────┬──> 1.3.4 (Workflow Row)
├─ 1.3.2 JobCard Component ──────────────┼──> 1.3.7 (Active Jobs)
├─ 1.3.3 ChecklistItem Component ────────┼──> 1.3.6 (Checklist Col)
│                                         │
├─ 1.3.4 Workflow Cards Row ─────────────┤
├─ 1.3.5 Greeting Section ───────────────┤
│                                         │
├─ 1.3.13 Backend Task List API ─────────┬──> 1.3.6, 1.3.17
├─ 1.3.14 Backend Task Update API ───────┼──> 1.3.6, 1.3.17
├─ 1.3.15 Backend Task Creation API ─────┼──> 1.3.17
├─ 1.3.16 Backend Task Deletion API ─────┼──> 1.3.17
│                                         │
├─ 1.3.6 Checklist Column ───────────────┼──> 1.3.10 (Layout)
├─ 1.3.7 Active Jobs Column ─────────────┤
├─ 1.3.8 Finance Strip ──────────────────┤
├─ 1.3.9 New Job Button & Flow ──────────┤
│                                         │
├─ 1.3.17 Frontend API Integration ──────┼──> 1.3.6 (updates)
│                                         │
├─ 1.3.10 HOME Dashboard Layout ─────────┼──> 1.3.11 (Data)
├─ 1.3.11 Data Loading & Caching ────────┼──> 1.5.3 (Integration)
└─ 1.3.12 Skeleton Loading States ───────┘
         │
         ▼
PHASE 1.4 (WelcomeModal)
├─ 1.4.1 WelcomeModal 3-Step Structure ──┬──> 1.5.3 (Integration)
├─ 1.4.2 Step 1: Welcome & Intro ────────┤
├─ 1.4.3 Step 2: Navigation Map ─────────┤
├─ 1.4.4 Step 3: Workflow Explanation ───┤
├─ 1.4.5 Preference Persistence ─────────┤
└─ 1.4.6 Demo Job Creation ──────────────┘
         │
         ▼
PHASE 1.5 (Testing & Polish)
├─ 1.5.1 Unit Tests (Base Components) ───┐
├─ 1.5.2 Property-Based Tests ───────────┤
├─ 1.5.3 Integration Tests (Cypress) ────┤
├─ 1.5.3.1 Backend API Unit Tests ───────┤ (NEW)
├─ 1.5.3.2 Task CRUD Integration Test ───┤ (NEW)
├─ 1.5.4 Accessibility Audit & Fixes ────┤
├─ 1.5.5 Performance Optimization ───────┤
├─ 1.5.6 Browser Compatibility Tests ────┤
├─ 1.5.7 Animation Performance Tuning ───┤
├─ 1.5.8 Error Handling & Recovery ──────┤
├─ 1.5.9 Security Review (XSS/Auth) ─────┤
├─ 1.5.10 Visual QA & Design Compliance ─┤
├─ 1.5.11 Documentation & Code Comments ─┤
├─ 1.5.12 Lighthouse Audit ──────────────┤
└─ 1.5.13 Final Integration Testing ─────┘
```

---

## Tasks

## Phase 1.1: Foundation Components & Design Tokens

- [ ] 1.1.1 Implement Design Token System

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** None
**Assignee:** Frontend Developer

**Description:**
Create comprehensive CSS custom properties system for colors, typography, spacing, border radius, shadows, and glassmorphism effects supporting both light and dark themes.

**Technical Details:**
- File: `client/src/styles/tokens.css` (new file)
- CSS custom properties format: `--property-name: value;`
- Create `:root[data-theme="light"]` and `:root[data-theme="dark"]` selectors
- Include all color variables, spacing scale, typography scale, border radius scale
- Add glass effect variables (background, border, shadow with alpha channels)

**Acceptance Criteria:**
- [ ] Color system defined for both themes (primary, status, backgrounds, borders)
- [ ] Typography scale: hero (4rem), page (2.5rem), section (2rem), card (1.5rem), body (1rem), small (0.875rem), label (0.75rem)
- [ ] Spacing scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), 4xl (96px)
- [ ] Border radius scale: sm (8px), md (12px), lg (16px), xl (24px), 2xl (32px), full (9999px)
- [ ] Shadow scale: sm, md, lg, xl with appropriate rgba values
- [ ] Glass effects: background, border, shadow for light/dark themes
- [ ] Tokens imported in main CSS/Tailwind config

**Design Reference:** `design.md > Visual Design System Specifications`
**Requirements Reference:** NFR-008, NFR-009, NFR-010, NFR-011

**Verification:**
```bash
# Visual verification: Toggle theme and check all colors update
npm run dev
```

---

- [ ] 1.1.2 Create Base GlassCard Component

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable GlassCard component with glassmorphism effect (backdrop-blur, semi-transparent backgrounds, rounded borders) supporting light/dark variants and hover animations.

**Technical Details:**
- File: `client/src/components/base/GlassCard.tsx` (new file)
- TypeScript interface: `GlassCardProps` with children, variant, padding, borderRadius, hover, onClick
- CSS: backdrop-filter: blur(20px), rgba backgrounds, configurable border-radius
- Support light variant: rgba(255,255,255,0.7) and dark variant: rgba(10,10,10,0.6)
- Hover effect: translateY(-4px), box-shadow increase, 300ms ease-out transition
- Fallback for unsupported backdrop-filter: solid background rgba with higher opacity

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Light variant: rgba(255,255,255,0.7) background, border rgba(0,0,0,0.08)
- [ ] Dark variant: rgba(10,10,10,0.6) background, border rgba(255,255,255,0.18)
- [ ] Border radius configurable: 12px, 16px, 24px (default), 32px
- [ ] Hover effect optional: translateY -4px, shadow 0 16px 48px rgba(0,0,0,0.12)
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Fallback for unsupported backdrop-filter browsers (feature detection with CSS.supports)
- [ ] Respects prefers-reduced-motion (no hover animation)

**Design Reference:** `design.md > Components > 6. Base Glass Components`
**Requirements Reference:** FR-020, FR-021, NFR-008

**Verification:**
```bash
npm run test -- GlassCard.test.tsx
```

---

- [ ] 1.1.3 Create StatusBadge Component

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable StatusBadge component with semantic color mapping (success, warning, danger, info, neutral), pill shape, optional icons, and pulse animation.

**Technical Details:**
- File: `client/src/components/base/StatusBadge.tsx` (new file)
- TypeScript interface: `StatusBadgeProps` with type, text, icon, pulse, size
- Color mapping: success=#10b981, warning=#f59e0b, danger=#ef4444, info=#3b82f6, neutral=#6b7280
- Background: status color with alpha 0.1, Border: status color with alpha 0.3, Text: full opacity status color
- Border radius: 999px (pill shape), Padding: 0.25rem 0.75rem (size: sm), 0.375rem 1rem (size: md)
- Pulse animation: @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }, 2s infinite

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Color mapping correct for all 5 types (success, warning, danger, info, neutral)
- [ ] Background color: rgba with alpha 0.1, border: rgba with alpha 0.3
- [ ] Text color: full opacity, bold weight
- [ ] Border radius: 999px (pill), padding responsive to size prop
- [ ] Optional icon renders before text
- [ ] Pulse animation applies when pulse=true
- [ ] Animation respects prefers-reduced-motion (disabled if set)
- [ ] Size variants: sm (0.75rem text), md (0.875rem text)

**Design Reference:** `design.md > Components > 6. Base Glass Components > StatusBadge`
**Requirements Reference:** FR-022, FR-023

**Verification:**
```bash
npm run test -- StatusBadge.test.tsx
```

---

- [ ] 1.1.4 Create ProgressBar Component

**Priority:** P0
**Estimated Time:** 1.5 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable ProgressBar component showing completion percentage with smooth animation, configurable color, and optional percentage label.

**Technical Details:**
- File: `client/src/components/base/ProgressBar.tsx` (new file)
- TypeScript interface: `ProgressBarProps` with value, max, label, color, showPercentage
- Bar height: 8px, border-radius: 999px (pill shape)
- Fill animation: width transition 500ms ease-out
- Percentage calculation: (value / max) * 100, constrained to 0-100 range
- Label position: right side of bar, font-size: 0.75rem
- Accessible: aria-valuenow, aria-valuemin, aria-valuemax attributes

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Progress bar height: 8px, border-radius: 999px
- [ ] Fill color configurable via props (default: orange #FF6B00)
- [ ] Background color: rgba(0,0,0,0.1) for light theme, rgba(255,255,255,0.1) for dark
- [ ] Percentage label optional, displays as "XX%" format
- [ ] Fill width animates smoothly: transition width 500ms ease-out
- [ ] Value constrained to 0-100 range (validation)
- [ ] ARIA attributes: aria-valuenow={value}, aria-valuemin={0}, aria-valuemax={max}
- [ ] Respects prefers-reduced-motion (instant transition)

**Design Reference:** `design.md > Components > 6. Base Glass Components > Progress Bar`
**Requirements Reference:** FR-012, US-019

**Verification:**
```bash
npm run test -- ProgressBar.test.tsx
```

---

- [ ] 1.1.5 Create QuickActionButton Component

**Priority:** P0
**Estimated Time:** 1.5 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable QuickActionButton component for job card and other quick actions with ghost/solid variants, icon support, and hover effects.

**Technical Details:**
- File: `client/src/components/base/QuickActionButton.tsx` (new file)
- TypeScript interface: `QuickActionButtonProps` with icon, label, size, variant, onClick
- Variants: ghost (transparent bg, border, text color), solid (bg color, white text)
- Sizes: sm (padding: 0.25rem 0.5rem, text: 0.75rem), md (padding: 0.5rem 1rem, text: 0.875rem)
- Hover: ghost variant changes bg to primary color, solid variant lifts (translateY -2px)
- Icon renders before label, optional icon-only mode

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Ghost variant: transparent bg, border 1px solid, text color primary
- [ ] Solid variant: bg primary color, text white, no border
- [ ] Hover ghost: bg becomes primary color, text becomes white
- [ ] Hover solid: translateY(-2px), shadow increases
- [ ] Transition: all 200ms ease-out
- [ ] Icon optional, renders before label with mr-1 spacing
- [ ] Icon-only mode: no label, square padding
- [ ] Respects prefers-reduced-motion

**Design Reference:** `design.md > Components > 6. Base Glass Components > Quick Action Button`
**Requirements Reference:** FR-020, US-020

**Verification:**
```bash
npm run test -- QuickActionButton.test.tsx
```

---

- [ ] 1.1.6 Create Tooltip Component

**Priority:** P1
**Estimated Time:** 2 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable Tooltip component showing contextual help on hover/focus with smooth animation and positioning logic.

**Technical Details:**
- File: `client/src/components/base/Tooltip.tsx` (new file)
- TypeScript interface: `TooltipProps` with children, content, position (top, bottom, left, right)
- Animation: opacity 0→1, translateY 4px→0, 150ms ease-out
- Background: rgba(0,0,0,0.9) for light theme, rgba(255,255,255,0.9) for dark
- Arrow pointer: 6px triangle using CSS borders
- Z-index: 1000, position: absolute relative to parent
- Show on hover and focus (keyboard accessible)

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Tooltip appears on hover (mouseenter) and focus
- [ ] Tooltip disappears on mouseleave and blur
- [ ] Position configurable: top, bottom, left, right (default: top)
- [ ] Arrow pointer positioned correctly for each position
- [ ] Animation: opacity 0→1, translateY 4px→0, 150ms ease
- [ ] Background: dark rgba for light theme, light rgba for dark theme
- [ ] Text: white for light theme, black for dark theme, 0.75rem size
- [ ] Padding: 0.5rem 0.75rem, border-radius: 4px
- [ ] Respects prefers-reduced-motion (instant show/hide)
- [ ] Keyboard accessible (shows on focus)

**Design Reference:** `design.md > Components > 6. Base Glass Components`
**Requirements Reference:** NFR-007 (Accessibility)

**Verification:**
```bash
npm run test -- Tooltip.test.tsx
```

---

## Phase 1.2: Navigation & TopNav

- [ ] 1.2.1 Refactor TopNav to 5 Tabs

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** 1.1.1 (Design Tokens), 1.1.2 (GlassCard)
**Assignee:** Frontend Developer

**Description:**
Refactor existing AppNavBar.tsx to display exactly 5 tabs (HOME, CLIENTS, JOBS, STUDIO, FINANCE) without "MORE" dropdown menu, apply glassmorphism styling, and ensure Studio tab is always visible.

**Technical Details:**
- File: `client/src/components/AppNavBar.tsx` (modify existing)
- Remove `moreMenuOpen` state and dropdown logic
- Create `primaryNavItems` array with 5 tabs only: HOME, CLIENTS, JOBS, STUDIO, FINANCE
- Remove `secondaryNavItems` (absorbed into primary tabs or removed)
- Add icons to each tab: 🏠 HOME, 👥 CLIENTS, 🎬 JOBS, 🤖 STUDIO, 💰 FINANCE
- Apply glass styling: backdrop-filter: blur(30px), position: fixed/sticky
- Active tab: 2px orange underline (#FF6B00), bold text

**Current Code Analysis:**
- Current structure: 4 primary tabs (TODAY, PROJECTS, COMMERCIAL, ANALYTICS) + MORE menu
- MORE menu contains: TOOLS, DOCUMENTS, VIDEO-REVIEWS, COLLABORATORS, COMPANY, ADMIN
- Change: Remove MORE menu, make 5 primary tabs (HOME replaces TODAY, JOBS replaces PROJECTS, STUDIO replaces TOOLS visible, FINANCE replaces ANALYTICS)
- Keep: Active state logic, mobile menu (grid layout), theme toggle, user profile

**Acceptance Criteria:**
- [ ] Exactly 5 tabs visible on desktop (no dropdown)
- [ ] Tab order left-to-right: HOME, CLIENTS, JOBS, STUDIO, FINANCE
- [ ] Studio IA tab prominently visible (4th position, no hidden menu)
- [ ] Active tab highlighted with 2px orange underline at bottom
- [ ] Icons rendered before tab labels (inline, mr-2 spacing)
- [ ] Mobile menu still functional (grid layout with all 5 tabs)
- [ ] Glass effect: backdrop-filter: blur(30px), rgba background
- [ ] Position: sticky/fixed at top, z-index: 50
- [ ] No TypeScript errors, no console warnings

**Design Reference:** `design.md > Components > 1. TopNav Component`
**Requirements Reference:** US-001, US-002, FR-001, FR-002

**Verification:**
```bash
npm run test -- AppNavBar.test.tsx
npm run build
# Visual: Open app, verify 5 tabs, no MORE menu, Studio visible
```

---

- [ ] 1.2.2 Implement Navigation State Management Logic

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.2.1 (TopNav Refactor)
**Assignee:** Frontend Developer

**Description:**
Implement navigation state management algorithm ensuring exactly one tab is active at any time, with route-based tab activation and browser back/forward button support.

**Technical Details:**
- File: `client/src/utils/navigationState.ts` (new file)
- Algorithm: `manageNavigationState(currentPath, navigationTabs)` returns updated tabs
- Function: `extractTabIdFromPath(path)` returns tab identifier or 'home' default
- Valid tab IDs: ['home', 'clients', 'jobs', 'studio', 'finance']
- Path matching: /home → home, /clients → clients, /project/123 → jobs (parent), etc.
- Loop invariant: After each iteration, exactly one tab has isActive=true

**Acceptance Criteria:**
- [ ] `manageNavigationState` function implemented matching pseudocode in design.md
- [ ] `extractTabIdFromPath` handles all valid routes (/home, /clients, /jobs, /studio, /finance)
- [ ] Nested routes map to parent tab (e.g., /project/123 → jobs)
- [ ] Invalid/unknown paths default to 'home'
- [ ] Exactly one tab active after state update (∃! tab where isActive=true)
- [ ] Unit tests verify single active tab property
- [ ] Property-based tests with fast-check verify uniqueness for all paths

**Design Reference:** `design.md > Algorithmic Pseudocode > Navigation State Management Algorithm`
**Requirements Reference:** FR-002, FR-003, FR-004

**Verification:**
```bash
npm run test -- navigationState.test.ts
# Property test should run 100+ cases
```

---

- [ ] 1.2.3 Add Search Command Palette (Cmd+K)

**Priority:** P1
**Estimated Time:** 3 hours
**Dependencies:** 1.2.1 (TopNav Refactor)
**Assignee:** Frontend Developer

**Description:**
Implement keyboard shortcut (Cmd+K / Ctrl+K) that opens search modal for quick navigation to all 5 sections, with fuzzy filtering and Enter key navigation.

**Technical Details:**
- File: `client/src/components/CommandPalette.tsx` (new file or enhance existing)
- Keyboard listener: document.addEventListener('keydown', handler)
- Shortcut detection: (e.metaKey || e.ctrlKey) && e.key === 'k'
- Modal displays all 5 navigation sections as options
- Filter as user types using fuzzy search (e.g., "cli" matches "clients")
- Enter key navigates to selected option, Esc closes modal
- Accessible: ARIA modal, focus trap, role="dialog"

**Acceptance Criteria:**
- [ ] Cmd+K (Mac) / Ctrl+K (Windows/Linux) opens search modal
- [ ] Modal shows all 5 tabs: HOME, CLIENTS, JOBS, STUDIO, FINANCE
- [ ] Typing filters options in real-time (fuzzy match on label)
- [ ] Arrow keys navigate between options (highlight selected)
- [ ] Enter key navigates to highlighted option
- [ ] Esc key closes modal
- [ ] Search works from any page
- [ ] Focus trapped inside modal when open
- [ ] Glass effect styling applied to modal backdrop
- [ ] ARIA attributes: role="dialog", aria-modal="true", aria-labelledby

**Design Reference:** `design.md > Components > 1. TopNav Component > State Management`
**Requirements Reference:** US-004, FR-005

**Verification:**
```bash
npm run test -- CommandPalette.test.tsx
# Manual: Press Cmd+K, type "stud", verify STUDIO highlighted, press Enter
```

---

- [ ] 1.2.4 Integrate Theme Toggle with Design Tokens

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.1.1 (Design Tokens), 1.2.1 (TopNav)
**Assignee:** Frontend Developer

**Description:**
Ensure theme toggle button in TopNav correctly switches between light/dark themes, updates data-theme attribute on document root, and persists preference to user profile.

**Technical Details:**
- File: `client/src/components/AppNavBar.tsx` (modify existing theme toggle)
- Function: `toggleTheme()` updates `document.documentElement.setAttribute('data-theme', newTheme)`
- Persist theme to user preferences: `saveUserPreference('theme', newTheme)`
- Load theme on mount from user preferences or default to 'auto'
- Glass components automatically adapt colors via CSS custom properties
- Icons: Sun for light theme, Moon for dark theme

**Acceptance Criteria:**
- [ ] Theme toggle button present in TopNav
- [ ] Clicking toggles between light and dark themes
- [ ] Document root data-theme attribute updates: 'light' or 'dark'
- [ ] All glass components update colors (verify backgrounds, borders, text)
- [ ] Theme preference saves to user profile (API call)
- [ ] Theme persists across browser sessions (loaded on mount)
- [ ] Icon changes: Sun (light mode) ↔ Moon (dark mode)
- [ ] Animation: smooth color transition 300ms ease
- [ ] No FOUC (Flash of Unstyled Content) on page load

**Design Reference:** `design.md > Visual Design System > Color System`
**Requirements Reference:** US-022, FR-022, NFR-008

**Verification:**
```bash
npm run test -- AppNavBar.test.tsx
# Manual: Toggle theme, verify all colors update, refresh page, verify persistence
```

---

- [ ] 1.2.5 Make TopNav Mobile Responsive

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.2.1 (TopNav Refactor)
**Assignee:** Frontend Developer

**Description:**
Ensure TopNav is fully responsive on mobile devices with hamburger menu, grid layout for all 5 tabs, and touch-friendly interactions.

**Technical Details:**
- File: `client/src/components/AppNavBar.tsx` (modify existing mobile menu)
- Mobile breakpoint: < 1280px (xl breakpoint)
- Hamburger icon: Menu icon (☰), toggles mobile menu visibility
- Mobile menu: absolute positioned dropdown, grid layout 2 columns
- All 5 tabs displayed in grid (no hidden items)
- Close menu after tab selection (navigate and close)

**Acceptance Criteria:**
- [ ] Hamburger menu icon visible on screens < 1280px
- [ ] Desktop tabs hidden on mobile (display: none)
- [ ] Mobile menu opens on hamburger click
- [ ] Mobile menu displays all 5 tabs in 2-column grid
- [ ] Mobile menu has glass effect backdrop (blur)
- [ ] Tapping tab navigates and closes menu
- [ ] Menu closes on outside click (click backdrop)
- [ ] Menu closes on Esc key
- [ ] Touch targets ≥ 44px height (accessibility)
- [ ] Active tab highlighted in mobile menu
- [ ] Smooth animation: slide down on open, fade out on close

**Design Reference:** `design.md > Components > 1. TopNav Component > Visual Wireframe`
**Requirements Reference:** FR-001, NFR-012 (Usability)

**Verification:**
```bash
npm run test -- AppNavBar.test.tsx
# Manual: Resize browser to mobile, verify hamburger, tap menu, verify all tabs
```

---

## Phase 1.3: HOME Dashboard

- [ ] 1.3.1 Create WorkflowCard Component

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.1.2 (GlassCard), 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable WorkflowCard component showing key metrics (count + label) with large number typography, icon, glassmorphism styling, and hover lift animation for quick navigation.

**Technical Details:**
- File: `client/src/components/dashboard/WorkflowCard.tsx` (new file)
- TypeScript interface: `WorkflowCardProps` with icon, count, label, sublabel, status, onClick
- Layout: icon top-left, count (3rem bold) center, label (0.75rem uppercase) below, sublabel (0.875rem muted) bottom
- Glass effect: GlassCard wrapper with hover enabled
- Status border: optional colored left border (4px) for status indication
- Hover: translateY(-4px), shadow increase, 300ms ease-out

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Large count display: font-size 3rem, font-weight bold, line-height 1
- [ ] Label: font-size 0.75rem, uppercase, letter-spacing 0.08em, font-weight 600
- [ ] Sublabel: font-size 0.875rem, color muted (--text-muted)
- [ ] Icon: 2rem size, positioned top-left or top-center
- [ ] Glass effect via GlassCard wrapper (border-radius: 24px)
- [ ] Hover animation: translateY(-4px), box-shadow increase
- [ ] Optional status left border: 4px solid with status color
- [ ] Clickable: cursor pointer, onClick handler
- [ ] Responsive: stacks vertically on small screens

**Design Reference:** `design.md > Components > 3. WorkflowCard Component`
**Requirements Reference:** US-006, FR-007, FR-008

**Verification:**
```bash
npm run test -- WorkflowCard.test.tsx
```

---

- [ ] 1.3.2 Create JobCard Component

**Priority:** P0
**Estimated Time:** 3.5 hours
**Dependencies:** 1.1.2 (GlassCard), 1.1.3 (StatusBadge), 1.1.4 (ProgressBar), 1.1.5 (QuickActionButton)
**Assignee:** Frontend Developer

**Description:**
Create reusable JobCard component showing job title, client, status, deadline, days left, progress bar, urgency indicator, and quick action buttons with status-specific border colors.

**Technical Details:**
- File: `client/src/components/dashboard/JobCard.tsx` (new file)
- TypeScript interface: `JobCardProps` with job object, onQuickAction, onCardClick
- Job interface: id, title, client, status, deadline, daysLeft, progress, urgent
- Status border colors: briefing=#f59e0b, production=#FF6B00, review=#3b82f6, delivered=#10b981
- Urgency indicator: 🔴 red dot + red text when daysLeft < 3
- Quick action buttons: [Briefing] [Review] [Hub] using QuickActionButton component
- Progress bar at bottom using ProgressBar component

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Title: 1.5rem font-size, bold, truncate with ellipsis if too long
- [ ] Client: "Cliente: {name}" format, 0.875rem, muted color
- [ ] Deadline: "Deadline: {date} ({daysLeft} dias)" format
- [ ] Urgency: red 🔴 indicator and red text when urgent=true (daysLeft < 3)
- [ ] Status border: 2px solid left border with color mapping to status
- [ ] Progress bar: uses ProgressBar component, color matches status
- [ ] Quick action buttons: 3 buttons (Briefing, Review, Hub), ghost variant
- [ ] Card clickable: entire card is clickable (except buttons), calls onCardClick
- [ ] Button click prevents card click (stopPropagation)
- [ ] Glass effect via GlassCard wrapper
- [ ] Hover: lift animation (translateY -4px)

**Design Reference:** `design.md > Components > 4. JobCard Component`
**Requirements Reference:** US-008, US-020, FR-010, FR-011, FR-012

**Verification:**
```bash
npm run test -- JobCard.test.tsx
# Test urgent job (daysLeft=2), verify red indicator
# Test each status, verify correct border color
```

---

- [ ] 1.3.3 Create ChecklistItem Component

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create reusable ChecklistItem component with checkbox, text label, optional link, strikethrough animation when checked, and delete button on hover.

**Technical Details:**
- File: `client/src/components/dashboard/ChecklistItem.tsx` (new file)
- TypeScript interface: `ChecklistItemProps` with id, text, checked, link, onClick, onDelete
- Checkbox: large (20px), styled with accent color (orange)
- Text: 0.875rem, regular weight, strikethrough when checked (transition 300ms)
- Checked state: opacity 0.5, text-decoration line-through
- Delete button: appears on hover (X icon), ghost variant, size sm
- Link: optional, clicking navigates to link (if present)

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface
- [ ] Checkbox: 20px size, styled accent color (#FF6B00)
- [ ] Text: 0.875rem, line-height 1.4, mr-2 spacing from checkbox
- [ ] Checked state: text-decoration line-through, opacity 0.5, transition 300ms
- [ ] Clicking checkbox calls onClick handler
- [ ] Delete button appears on hover (positioned right side)
- [ ] Delete button calls onDelete handler
- [ ] Optional link: text is clickable, navigates to link (uses <Link> or <a>)
- [ ] Keyboard accessible: checkbox focusable, Enter/Space toggles
- [ ] Animation smooth: strikethrough and opacity transition

**Design Reference:** `design.md > Components > HOME Dashboard > Checklist Column`
**Requirements Reference:** US-007, FR-009

**Verification:**
```bash
npm run test -- ChecklistItem.test.tsx
```

---

- [ ] 1.3.4 Implement Workflow Cards Row

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.3.1 (WorkflowCard)
**Assignee:** Frontend Developer

**Description:**
Create Workflow Cards Row section displaying 4 cards (Active Jobs, Clients Waiting, Reviews Pending, Studio Tools) with staggered entrance animation and correct data binding.

**Technical Details:**
- File: `client/src/components/dashboard/WorkflowCardsRow.tsx` (new file)
- Layout: 4 columns grid on desktop, 2 columns on tablet, 1 column on mobile
- Cards: WorkflowCard component instances
- Data: receives `workflowStats` prop with activeJobs, clientsWaiting, reviewsPending counts
- Navigation: onClick navigates to respective sections (/jobs, /clients, /jobs?filter=review, /studio)
- Animation: staggered entrance (50ms delay per card), opacity 0→1, translateY 20px→0

**Acceptance Criteria:**
- [ ] Section displays 4 WorkflowCard components
- [ ] Card 1: "JOBS ATIVOS", count from workflowStats.activeJobs, icon 📊, navigates to /jobs
- [ ] Card 2: "CLIENTS AGUARDANDO", count from workflowStats.clientsWaiting, icon 👤, navigates to /clients
- [ ] Card 3: "REVIEWS PENDENTES", count from workflowStats.reviewsPending, icon 🎥, navigates to /jobs?filter=review
- [ ] Card 4: "STUDIO FERRAMENTAS", static label "FERRAMENTAS IA", icon 🤖, navigates to /studio
- [ ] Grid layout: 4 columns desktop, 2 columns tablet, 1 column mobile
- [ ] Staggered animation: each card delays 50ms (card[0]=0ms, card[1]=50ms, card[2]=100ms, card[3]=150ms)
- [ ] Animation: opacity 0→1, translateY 20px→0, 300ms ease-out
- [ ] Animation only on initial mount (not on data refresh)
- [ ] Respects prefers-reduced-motion

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Layout Structure`
**Requirements Reference:** US-006, FR-007, FR-008, FR-025

**Verification:**
```bash
npm run test -- WorkflowCardsRow.test.tsx
# Visual: Verify staggered animation on page load
```

---

- [ ] 1.3.5 Implement Greeting Section

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create Greeting Section displaying personalized time-based greeting (Bom dia/Boa tarde/Boa noite), user name, and summary of pending actions at top of HOME dashboard.

**Technical Details:**
- File: `client/src/components/dashboard/GreetingSection.tsx` (new file)
- Time-based greeting: 6am-12pm = "Bom dia", 12pm-6pm = "Boa tarde", 6pm-6am = "Boa noite"
- Format: "{Greeting}, {firstName}! 🎬"
- Summary line: "Você tem {count} ações pendentes hoje." (if count > 0)
- Typography: greeting 2.5rem bold, summary 1rem muted color
- Icon: 🎬 (film) after name

**Acceptance Criteria:**
- [ ] Component created with TypeScript interface: `GreetingProps` with userName, pendingActionsCount
- [ ] Time-based greeting: "Bom dia" (6am-12pm), "Boa tarde" (12pm-6pm), "Boa noite" (6pm-6am)
- [ ] Displays user's first name (extracted from full name or uses full name if single word)
- [ ] Summary displays count of pending actions (if > 0)
- [ ] Typography: greeting 2.5rem bold, summary 1rem muted
- [ ] Icon: 🎬 rendered after user name
- [ ] Fallback: "Olá" if time detection fails
- [ ] Greeting updates on page load (recalculates time)
- [ ] Responsive: smaller font sizes on mobile (2rem greeting, 0.875rem summary)

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Responsibilities`
**Requirements Reference:** US-005, FR-006

**Verification:**
```bash
npm run test -- GreetingSection.test.tsx
# Test at different times of day (mock Date.now)
```

---

- [ ] 1.3.6 Implement Checklist Column

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.3.3 (ChecklistItem), 1.3.13 (Backend Task List API), 1.3.14 (Backend Task Update API)
**Assignee:** Frontend Developer

**Description:**
Create Checklist Column section displaying list of today's tasks with checkboxes, add new item input, and CRUD operations persisting to backend via React Query hooks.

**Technical Details:**
- File: `client/src/components/dashboard/ChecklistColumn.tsx` (new file)
- Layout: 30% width on desktop, full width on mobile
- Title: "📋 HOJE" (0.875rem uppercase)
- List: ChecklistItem components, max 10 visible (scroll for more)
- Add button: "+ Adicionar" opens input field
- Input: text input (3-200 characters), Enter key creates item, Esc cancels
- React Query integration: useQuery for GET /api/tasks, useMutation for POST/PATCH/DELETE
- Optimistic UI: update UI immediately, rollback on error
- Error toast: "Não foi possível salvar a tarefa. Tentar novamente?"

**Acceptance Criteria:**
- [ ] Column displays title "📋 HOJE"
- [ ] Displays list of ChecklistItem components (from React Query data)
- [ ] Max 10 items visible, scroll for more (max-height with overflow-y: auto)
- [ ] "+ Adicionar" button at bottom, clicking shows input field
- [ ] Input field: text input, placeholder "Nova tarefa...", 3-200 char validation
- [ ] Pressing Enter creates new item, calls POST mutation with optimistic update
- [ ] Clicking checkbox marks complete, calls PATCH mutation with optimistic update
- [ ] Delete button (on hover) deletes item, calls DELETE mutation with optimistic update
- [ ] Optimistic UI updates: instant visual feedback before API confirmation
- [ ] Error handling: show error toast on failure, rollback optimistic update
- [ ] Empty state: "Nenhuma tarefa pendente" message if checklist.length = 0
- [ ] Loading state: Skeleton loaders while fetching tasks

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Layout Structure`
**Requirements Reference:** US-007, US-023, US-024, US-025, US-026, FR-009, FR-015, FR-016, FR-017, FR-018

**Verification:**
```bash
npm run test -- ChecklistColumn.test.tsx
# Integration test: Add item, check item, delete item, verify API calls
```

---

- [ ] 1.3.7 Implement Active Jobs Column

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.3.2 (JobCard)
**Assignee:** Frontend Developer

**Description:**
Create Active Jobs Column section displaying list of active job cards (status: briefing, production, review) with scroll, "+ NOVO JOB" button, and empty state.

**Technical Details:**
- File: `client/src/components/dashboard/ActiveJobsColumn.tsx` (new file)
- Layout: 70% width on desktop, full width on mobile
- Title: "🎬 JOBS ATIVOS" (0.875rem uppercase)
- List: JobCard components, max 6 initially visible (infinite scroll or "Load More")
- Jobs ordered by deadline (soonest first)
- "+ NOVO JOB" button at bottom, opens job creation modal/flow
- Empty state: "Nenhum job ativo" message with "+ Criar Job" button if activeJobs.length = 0

**Acceptance Criteria:**
- [ ] Column displays title "🎬 JOBS ATIVOS"
- [ ] Displays list of JobCard components (from activeJobs prop)
- [ ] Jobs ordered by deadline ascending (soonest first)
- [ ] Max 6 jobs visible initially, scroll container (max-height, overflow-y: auto)
- [ ] "+ NOVO JOB" button at bottom (glass button style, orange accent)
- [ ] Clicking "+ NOVO JOB" opens job creation modal/navigates to create page
- [ ] Quick action buttons on JobCard work: Briefing, Review, Hub navigation
- [ ] Clicking card navigates to job details page: /project/:id
- [ ] Empty state: if no active jobs, shows "Nenhum job ativo. Crie seu primeiro job!" message
- [ ] Empty state button: "+ Criar Job" triggers same flow as "+ NOVO JOB"
- [ ] Responsive: full width on mobile

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Layout Structure`
**Requirements Reference:** US-008, US-010, FR-014

**Verification:**
```bash
npm run test -- ActiveJobsColumn.test.tsx
# Test with 0 jobs (empty state), 3 jobs (no scroll), 10 jobs (scroll)
```

---

- [ ] 1.3.8 Implement Finance Strip

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.1.1 (Design Tokens)
**Assignee:** Frontend Developer

**Description:**
Create Finance Strip section displaying monthly revenue and completed jobs count in single line at bottom of HOME dashboard with link to full finance page.

**Technical Details:**
- File: `client/src/components/dashboard/FinanceStrip.tsx` (new file)
- Layout: full width horizontal strip, glass effect background
- Content: "💰 R$ {revenue} este mês • {jobsCompleted} jobs faturados → Ver Finance"
- Currency formatting: BRL format (R$ 12.500,00)
- Link: "→ Ver Finance" navigates to /finance
- Data: receives `financeStrip` prop with monthlyRevenue, jobsCompleted, currency

**Acceptance Criteria:**
- [ ] Component displays single-line strip at bottom of dashboard
- [ ] Icon: 💰 at start
- [ ] Monthly revenue: formatted as "R$ {amount}" (BRL format with thousands separator)
- [ ] Jobs completed: "{count} jobs faturados" format
- [ ] Link: "→ Ver Finance" clickable, navigates to /finance
- [ ] Separator: bullet • between revenue and jobs count
- [ ] Glass effect: subtle background rgba, border-top
- [ ] Padding: 1rem vertical, 1.5rem horizontal
- [ ] Text: 0.875rem size, muted color (except link)
- [ ] Link: orange color, hover underline
- [ ] Responsive: wraps to 2 lines on mobile

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Visual Wireframe`
**Requirements Reference:** US-009, FR-013

**Verification:**
```bash
npm run test -- FinanceStrip.test.tsx
# Test with 0 revenue, test with large numbers (R$ 125.000,50)
```

---

- [ ] 1.3.9 Implement New Job Button & Creation Flow

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.3.7 (Active Jobs Column)
**Assignee:** Frontend Developer

**Description:**
Implement "+ NOVO JOB" button in Active Jobs column that opens job creation modal or navigates to job creation page with step-by-step form.

**Technical Details:**
- Button: Glass button style, orange accent, positioned at bottom of Active Jobs column
- Flow option 1: Modal with step-by-step form (Title, Client select, Deadline, Status)
- Flow option 2: Navigate to /jobs/new page with form
- Form validation: title (3-200 chars required), client (required), deadline (future date), status (default: briefing)
- API: POST /api/jobs with form data
- Success: Job appears in Active Jobs list immediately (optimistic update), navigate to job details
- Error: Show toast error message, keep modal open

**Acceptance Criteria:**
- [ ] "+ NOVO JOB" button styled with glass effect, orange text/border
- [ ] Clicking button opens job creation modal or navigates to /jobs/new
- [ ] Modal/form displays: Title input, Client select, Deadline date picker, Status dropdown
- [ ] Title validation: 3-200 characters, required
- [ ] Client validation: required, dropdown of existing clients
- [ ] Deadline validation: future date, required
- [ ] Status: dropdown (briefing, production, review, delivered), default "briefing"
- [ ] Submit button: "Criar Job", disabled until valid
- [ ] Cancel button: "Cancelar", closes modal/navigates back
- [ ] API call: POST /api/jobs with {title, clientId, deadline, status}
- [ ] Success: Job added to activeJobs list immediately, modal closes, navigate to /project/:newId
- [ ] Error: Toast error message, modal stays open, retry possible

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Visual Wireframe`
**Requirements Reference:** US-010, FR-014

**Verification:**
```bash
npm run test -- ActiveJobsColumn.test.tsx
# Integration test: Click button, fill form, submit, verify job created
```

---

- [ ] 1.3.10 Create HOME Dashboard Layout

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.3.4 (Workflow Cards), 1.3.5 (Greeting), 1.3.6 (Checklist), 1.3.7 (Active Jobs), 1.3.8 (Finance Strip)
**Assignee:** Frontend Developer

**Description:**
Compose complete HOME dashboard layout integrating all sections (Greeting, Workflow Cards, Checklist, Active Jobs, Finance Strip) with correct responsive grid.

**Technical Details:**
- File: `client/src/pages/Dashboard.tsx` (modify or create HOME page)
- Layout structure from top to bottom:
  1. Greeting Section (full width)
  2. Workflow Cards Row (full width, 4-column grid)
  3. Main Content: 2-column grid (30% Checklist | 70% Active Jobs) on desktop, stacked on mobile
  4. Finance Strip (full width)
- Grid gaps: lg (24px) between sections
- Container: max-width: 1400px, centered, padding: xl (32px)

**Acceptance Criteria:**
- [ ] Dashboard page created or modified at /dashboard or /home route
- [ ] Sections rendered in correct order: Greeting → Workflow Cards → Checklist/Jobs → Finance
- [ ] Greeting section: full width, mb-lg (24px)
- [ ] Workflow Cards Row: full width, 4-column grid desktop, 2-column tablet, 1-column mobile, mb-lg
- [ ] Main content: 2-column grid desktop (30% | 70%), stacked on mobile (< 768px)
- [ ] Checklist column: 30% width desktop, full width mobile, mr-lg (24px) desktop
- [ ] Active Jobs column: 70% width desktop, full width mobile
- [ ] Finance Strip: full width, mt-lg (24px)
- [ ] Container: max-width 1400px, mx-auto, px-xl (32px)
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Gap between sections: lg (24px)

**Design Reference:** `design.md > Components > 2. HOME Dashboard Component > Layout Structure`
**Requirements Reference:** US-005, US-006, US-007, US-008, US-009

**Verification:**
```bash
npm run test -- Dashboard.test.tsx
# Visual: Verify layout at mobile (375px), tablet (768px), desktop (1400px) widths
```

---

- [ ] 1.3.11 Implement Dashboard Data Loading & Caching

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** 1.3.10 (Dashboard Layout)
**Assignee:** Frontend Developer

**Description:**
Implement efficient data loading for HOME dashboard using parallel requests, React Query caching, stale-while-revalidate strategy, and error handling with retry logic.

**Technical Details:**
- File: `client/src/hooks/useDashboardData.ts` (new custom hook)
- React Query: useQuery hooks for each data source
- Parallel loading: Promise.all or multiple useQuery calls
- Cache TTL: 5 minutes (300 seconds)
- Stale-while-revalidate: show cached data immediately, fetch fresh in background
- Data sources: user profile, jobs, clients, checklist, workflow stats (calculated client-side or backend)
- Error handling: retry once with exponential backoff, show error state after 2 failures

**Acceptance Criteria:**
- [ ] Custom hook `useDashboardData(userId)` created
- [ ] React Query: useQuery for userProfile, jobs, clients, checklist
- [~] Parallel data loading: all queries fetch simultaneously
- [~] Cache: staleTime 5 minutes, cacheTime 10 minutes
- [~] Stale-while-revalidate: cached data displays immediately, refetch in background
- [~] WorkflowStats calculated from jobs/clients data (or fetched from backend)
- [~] FinanceStrip data calculated from jobs (filtered by status=delivered, currentMonth)
- [~] Error handling: retry 1 time with 1-second delay, exponential backoff
- [~] Error state: return error object with message, isError boolean
- [~] Loading state: return isLoading boolean (true only on initial load, not refetch)
- [~] Optimistic updates: mutations update cache immediately

**Design Reference:** `design.md > Algorithmic Pseudocode > HOME Dashboard Data Loading Algorithm`
**Requirements Reference:** FR-023, FR-031, NFR-014

**Verification:**
```bash
npm run test -- useDashboardData.test.ts
# Test caching: load dashboard, navigate away, return, verify cached data used
# Test error: mock API failure, verify retry, verify error state
```

---

- [ ] 1.3.12 Implement Skeleton Loading States

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.3.10 (Dashboard Layout)
**Assignee:** Frontend Developer

**Description:**
Create skeleton loading placeholders for all dashboard sections (Greeting, Workflow Cards, Checklist, Jobs, Finance) that match final layout dimensions to prevent layout shift.

**Technical Details:**
- File: `client/src/components/dashboard/SkeletonLoader.tsx` (new file with multiple skeleton components)
- Skeletons: GreetingSkeleton, WorkflowCardSkeleton, ChecklistSkeleton, JobCardSkeleton, FinanceSkeleton
- Animation: pulse animation (opacity 1 → 0.5 → 1), 2s infinite
- Dimensions: match final component sizes exactly (prevent CLS)
- Color: muted gray background (--bg-tertiary), border-radius matches final components

**Acceptance Criteria:**
- [~] Skeleton components created for: Greeting, WorkflowCard, ChecklistItem, JobCard, FinanceStrip
- [~] Skeleton dimensions match final components (same width, height, padding)
- [~] Pulse animation: @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }, 2s infinite
- [~] Skeleton background: muted gray (var(--bg-tertiary))
- [~] Border radius: matches final components (24px for cards)
- [~] Dashboard displays skeletons while isLoading=true
- [~] Skeletons replace with real data smoothly (fade transition)
- [~] No Cumulative Layout Shift (CLS) when data loads (Lighthouse CLS < 0.1)
- [~] Respects prefers-reduced-motion (no pulse animation)

**Design Reference:** `design.md > Performance Considerations > Data Loading Performance`
**Requirements Reference:** FR-030, NFR-003 (CLS < 0.1)

**Verification:**
```bash
npm run test -- SkeletonLoader.test.tsx
# Lighthouse audit: Verify CLS < 0.1
# Visual: Slow network (3G throttle), verify smooth transition
```

---

- [ ] 1.3.13 Implement Backend Task List Retrieval API

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** None (backend task, can run in parallel with frontend)
**Assignee:** Backend Developer

**Description:**
Create RESTful API endpoint GET /api/tasks that returns authenticated user's checklist items with pagination support, efficient queries, and proper authentication/authorization.

**Technical Details:**
- Endpoint: GET /api/tasks
- Authentication: JWT token validation (extract userId from token)
- Authorization: Filter tasks WHERE task.userId = authenticated userId
- Database query: SELECT id, text, checked, link, createdAt, updatedAt FROM tasks WHERE userId = ? AND deletedAt IS NULL ORDER BY createdAt DESC
- Pagination: Support query params ?page=1&limit=10 (default limit: 10)
- Response format: JSON { tasks: Task[], total: number, page: number, limit: number }
- Performance: Add index on (userId, deletedAt, createdAt) for fast queries

**Acceptance Criteria:**
- [ ] Endpoint GET /api/tasks returns user's tasks
- [ ] Authentication: Validates JWT token, extracts userId, returns 401 if invalid/missing
- [ ] Authorization: Returns only tasks belonging to authenticated user
- [ ] Response schema: { tasks: Array<{ id, text, checked, link, createdAt, updatedAt }>, total, page, limit }
- [ ] Query params: ?page (default: 1), ?limit (default: 10, max: 100)
- [ ] Ordering: Most recent first (ORDER BY createdAt DESC)
- [ ] Soft-deleted tasks excluded (WHERE deletedAt IS NULL)
- [ ] Empty result returns 200 with { tasks: [], total: 0, page: 1, limit: 10 }
- [ ] Error responses: 401 (unauthorized), 500 (server error)
- [ ] Response time < 200ms for typical user (< 50 tasks)
- [ ] Database index created on (userId, deletedAt, createdAt)

**Design Reference:** `requirements.md > FR-015: Task List Retrieval API`
**Requirements Reference:** US-023, FR-015

**Verification:**
```bash
# Manual API test
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/tasks
# Expected: 200 OK with tasks array

# Unit test
npm run test -- api/tasks.test.ts
```

---

- [ ] 1.3.14 Implement Backend Task Update API

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.3.13 (Task List API for task existence validation)
**Assignee:** Backend Developer

**Description:**
Create RESTful API endpoint PATCH /api/tasks/:id that updates task fields with partial update support, ownership validation, and input validation.

**Technical Details:**
- Endpoint: PATCH /api/tasks/:id
- Authentication: JWT token validation (extract userId)
- Authorization: Verify task.userId = authenticated userId BEFORE update (return 403 if mismatch)
- Request body: JSON { checked?: boolean, text?: string, link?: string }
- Partial updates: Only update provided fields (SQL UPDATE with dynamic field list)
- Text validation: If provided, length 3-200 characters
- Link validation: If provided, validate URL format (regex or URL parser)
- Auto-update: Set updatedAt = NOW() on every update
- Response: Return updated task object

**Acceptance Criteria:**
- [ ] Endpoint PATCH /api/tasks/:id updates task
- [ ] Authentication: Validates JWT token, returns 401 if invalid
- [ ] Authorization: Verifies task.userId = authenticated userId, returns 403 if mismatch
- [ ] Request body: Accepts { checked?: boolean, text?: string, link?: string }
- [ ] Partial updates: Only provided fields are updated (e.g., PATCH { checked: true } only updates checked)
- [ ] Text validation: If provided, 3-200 characters, returns 400 with error message if invalid
- [ ] Link validation: If provided, must be valid URL format, returns 400 if invalid
- [ ] updatedAt field automatically set to current timestamp
- [ ] Response: 200 OK with updated task object
- [ ] Error responses: 400 (validation error with descriptive message), 401 (unauthorized), 403 (forbidden), 404 (task not found), 500 (server error)
- [ ] Response time < 150ms

**Design Reference:** `requirements.md > FR-016: Task Update API`
**Requirements Reference:** US-024, FR-016

**Verification:**
```bash
# Manual API test
curl -X PATCH -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"checked": true}' \
  http://localhost:3000/api/tasks/123
# Expected: 200 OK with updated task

# Unit test
npm run test -- api/tasks.patch.test.ts
```

---

- [ ] 1.3.15 Implement Backend Task Creation API

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.3.13 (Task List API for rate limit check)
**Assignee:** Backend Developer

**Description:**
Create RESTful API endpoint POST /api/tasks that creates new checklist items with validation, rate limiting (50 tasks/user/day), and auto-generated fields.

**Technical Details:**
- Endpoint: POST /api/tasks
- Authentication: JWT token validation (extract userId)
- Request body: JSON { text: string, link?: string }
- Text validation: Required, 3-200 characters
- Link validation: Optional, must be valid URL if provided
- Rate limit: Check COUNT(*) WHERE userId = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 DAY), return 429 if >= 50
- Default values: checked=false, createdAt=NOW(), updatedAt=NOW(), userId=authenticated user, deletedAt=NULL
- ID generation: Auto-increment primary key or UUID
- Response: 201 Created with created task object (including generated ID)

**Acceptance Criteria:**
- [ ] Endpoint POST /api/tasks creates new task
- [ ] Authentication: Validates JWT token, returns 401 if invalid
- [ ] Request body: Requires { text: string }, optional { link?: string }
- [ ] Text validation: Required, 3-200 characters, returns 400 if invalid
- [ ] Link validation: Optional, valid URL format if provided, returns 400 if invalid
- [ ] Rate limit: 50 tasks per user per day (rolling 24 hours), returns 429 if exceeded
- [ ] Rate limit message: "Limite diário de tarefas atingido" (429 status)
- [ ] Default values: checked=false, createdAt=NOW(), updatedAt=NOW(), userId=authenticated user, deletedAt=NULL
- [ ] ID generation: Auto-generated unique identifier (UUID or auto-increment)
- [ ] Response: 201 Created with created task object (including id, all fields)
- [ ] Duplicate text allowed: No uniqueness constraint on text field
- [ ] Error responses: 400 (validation error), 401 (unauthorized), 429 (rate limit), 500 (server error)
- [ ] Response time < 200ms

**Design Reference:** `requirements.md > FR-017: Task Creation API`
**Requirements Reference:** US-025, FR-017

**Verification:**
```bash
# Manual API test
curl -X POST -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"text": "Nova tarefa de teste"}' \
  http://localhost:3000/api/tasks
# Expected: 201 Created with task object

# Unit test
npm run test -- api/tasks.post.test.ts
```

---

- [ ] 1.3.16 Implement Backend Task Deletion API

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.3.13 (Task List API for task existence validation)
**Assignee:** Backend Developer

**Description:**
Create RESTful API endpoint DELETE /api/tasks/:id that performs soft deletion (sets deletedAt timestamp) with ownership validation and audit trail preservation.

**Technical Details:**
- Endpoint: DELETE /api/tasks/:id
- Authentication: JWT token validation (extract userId)
- Authorization: Verify task.userId = authenticated userId BEFORE deletion (return 403 if mismatch)
- Soft delete: UPDATE tasks SET deletedAt = NOW() WHERE id = ? (do NOT use DELETE FROM)
- Already-deleted: Check if deletedAt IS NOT NULL, return 404 if already deleted
- Response: 204 No Content (or 200 with success message)
- Audit trail: Deleted tasks remain in database for analytics/recovery

**Acceptance Criteria:**
- [ ] Endpoint DELETE /api/tasks/:id soft-deletes task
- [ ] Authentication: Validates JWT token, returns 401 if invalid
- [ ] Authorization: Verifies task.userId = authenticated userId, returns 403 if mismatch
- [ ] Soft delete: Sets deletedAt=NOW(), does NOT remove row from database
- [ ] Already-deleted tasks: Returns 404 with message "Tarefa não encontrada"
- [ ] Response: 204 No Content (or 200 OK with success message)
- [ ] Audit trail: Deleted tasks remain in database (only deletedAt is set)
- [ ] GET /api/tasks excludes soft-deleted tasks (WHERE deletedAt IS NULL)
- [ ] Error responses: 401 (unauthorized), 403 (forbidden), 404 (task not found), 500 (server error)
- [ ] Response time < 150ms
- [ ] Optional: Hard delete cron job (DELETE WHERE deletedAt < DATE_SUB(NOW(), INTERVAL 30 DAY)) runs daily

**Design Reference:** `requirements.md > FR-018: Task Deletion API`
**Requirements Reference:** US-026, FR-018

**Verification:**
```bash
# Manual API test
curl -X DELETE -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/tasks/123
# Expected: 204 No Content

# Verify soft delete (should still exist in DB)
SELECT * FROM tasks WHERE id = 123;
# Expected: Row exists with deletedAt set

# Unit test
npm run test -- api/tasks.delete.test.ts
```

---

- [ ] 1.3.17 Integrate Task Management APIs with Frontend

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.3.13, 1.3.14, 1.3.15, 1.3.16 (all backend API tasks), 1.3.6 (ChecklistColumn component)
**Assignee:** Frontend Developer

**Description:**
Create React Query hooks for task management CRUD operations (GET, POST, PATCH, DELETE) with optimistic updates, error handling, and cache invalidation strategies.

**Technical Details:**
- File: `client/src/hooks/useTaskManagement.ts` (new file)
- React Query hooks: useTaskList, useCreateTask, useUpdateTask, useDeleteTask
- Optimistic updates: Update cache immediately, rollback on error
- Error handling: Toast notifications, retry logic
- Cache invalidation: Invalidate task list cache after mutations
- Error messages: User-friendly Portuguese messages (e.g., "Não foi possível salvar a tarefa")

**Acceptance Criteria:**
- [ ] Custom hook `useTaskList()` created using useQuery for GET /api/tasks
- [ ] Custom hook `useCreateTask()` created using useMutation for POST /api/tasks
- [ ] Custom hook `useUpdateTask()` created using useMutation for PATCH /api/tasks/:id
- [ ] Custom hook `useDeleteTask()` created using useMutation for DELETE /api/tasks/:id
- [ ] Optimistic updates: All mutations update cache before API confirmation
- [ ] Rollback: Failed mutations revert optimistic updates and show error toast
- [ ] Error messages: User-friendly Portuguese (e.g., "Não foi possível salvar a tarefa. Tentar novamente?")
- [ ] Toast notifications: Success (green), error (red), with "Tentar Novamente" button on error
- [ ] Cache invalidation: Mutations invalidate task list query to trigger refetch
- [ ] Retry logic: Failed requests retry once with 1-second delay
- [ ] Loading states: Mutations expose isLoading boolean for UI feedback
- [ ] ChecklistColumn component updated to use new hooks

**Design Reference:** `requirements.md > US-023, US-024, US-025, US-026`
**Requirements Reference:** US-007, US-023, US-024, US-025, US-026, FR-015, FR-016, FR-017, FR-018

**Verification:**
```bash
npm run test -- useTaskManagement.test.ts
# Integration test: Create task, update task, delete task, verify optimistic updates
```

---

## Phase 1.4: WelcomeModal Onboarding

- [ ] 1.4.1 Create WelcomeModal 3-Step Structure

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.1.2 (GlassCard)
**Assignee:** Frontend Developer

**Description:**
Refactor existing WelcomeModal.tsx to 3-step structure aligned with new navigation (currently 4 steps), with step progression logic, back/next buttons, progress dots, and glassmorphism backdrop.

**Technical Details:**
- File: `client/src/components/onboarding/WelcomeModal.tsx` (modify existing)
- Reduce steps from 4 to 3: Welcome, Navigation Map, Workflow Explanation
- State: currentStep (1-3), neverShowAgain (boolean)
- Buttons: Back (visible steps 2-3), Next (all steps), Skip (all steps)
- Progress indicators: 3 dots at top, current step highlighted
- Backdrop: backdrop-filter blur(8px), rgba(0,0,0,0.8)

**Current Analysis:**
- Current WelcomeModal has 4 steps (welcome, tour, demo, start)
- Need to consolidate to 3 steps: Step 1 (welcome), Step 2 (navigation visual map), Step 3 (workflow + demo)
- Keep existing modal structure, animation, glassmorphism backdrop

**Acceptance Criteria:**
- [~] Modal reduced to 3 steps from current 4 steps
- [~] Step 1: Welcome + introduction (combine welcome + intro content)
- [~] Step 2: Navigation map showing 5 tabs visually
- [~] Step 3: Workflow explanation + demo job option
- [~] Progress dots: 3 dots at top center, active dot highlighted (orange, w-6), inactive (gray, w-2)
- [~] Back button: visible on steps 2-3, disabled on step 1
- [~] Next button: visible on all steps, label changes ("Próximo" → "Começar!" on step 3)
- [~] Skip button: visible on all steps, closes modal
- [~] Glassmorphism backdrop: backdrop-filter blur(8px), background rgba(0,0,0,0.8)
- [~] Animation: step transitions fade + slide (300ms ease)

**Design Reference:** `design.md > Components > 5. WelcomeModal Component`
**Requirements Reference:** US-011, FR-016

**Verification:**
```bash
npm run test -- WelcomeModal.test.tsx
# Test step progression: 1→2→3, back: 3→2→1
```

---

- [ ] 1.4.2 Design Step 1: Welcome & Introduction

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.4.1 (Modal Structure)
**Assignee:** Frontend Developer

**Description:**
Design and implement Step 1 content for WelcomeModal showing personalized welcome message, platform introduction, and list of key features.

**Technical Details:**
- Icon: ✨ Sparkles at top
- Title: "Olá, {userName}!" (2.5rem bold) - personalized with user's name
- Subtitle: "Bem-vindo ao Cena Studio!" (1.5rem)
- Description: "A plataforma completa para gestão de produção audiovisual com inteligência artificial."
- Feature list: 4 bullet points with checkmark icons
- Features: "Gerencie projetos do briefing à entrega", "Pipeline CRM integrado", "Review de vídeos com anotações", "IA para roteiros e storyboards"

**Acceptance Criteria:**
- [~] Step 1 content displays when currentStep=1
- [~] Title: personalized "Olá, {firstName}!" using user's first name
- [~] Subtitle: "Bem-vindo ao Cena Studio!" (1.5rem, semibold)
- [~] Icon: ✨ Sparkles (2rem size) at top, orange color
- [~] Description paragraph: 1rem, line-height 1.5, muted color
- [~] Feature list: 4 items with checkmark icons (✓ or Check icon component)
- [~] Features styled: flex layout, icon left, text right, gap 12px
- [~] Text: 0.875rem, regular weight
- [~] Buttons at bottom: "PULAR TOUR" (ghost), "COMEÇAR →" (primary)
- [~] Animation: fade in on mount (opacity 0→1, 300ms)

**Design Reference:** `design.md > Components > 5. WelcomeModal Component > Visual Design - Step 1`
**Requirements Reference:** US-011, FR-015

**Verification:**
```bash
npm run test -- WelcomeModal.test.tsx
# Visual: Open modal, verify Step 1 content displays correctly
```

---

- [ ] 1.4.3 Design Step 2: Navigation Visual Map

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.4.1 (Modal Structure)
**Assignee:** Frontend Developer

**Description:**
Design and implement Step 2 showing visual map/diagram of 5 navigation tabs with icons, labels, and descriptions explaining each section.

**Technical Details:**
- Icon: 🗺️ Map at top
- Title: "SUA NAVEGAÇÃO" (1.5rem bold)
- Visual diagram: 5 connected nodes horizontally
- Nodes: [🏠 HOME] ─ [👥 CLIENTS] ─ [🎬 JOBS] ─ [🤖 STUDIO] ─ [💰 FINANCE]
- Each node: icon, label (uppercase), short description below
- Descriptions: HOME="Seu radar diário", CLIENTS="Carteira de clientes", JOBS="Pipeline produção", STUDIO="IA tools", FINANCE="Dinheiro estúdio"
- Tip box: "💡 DICA: Studio IA está sempre visível no topo!"

**Acceptance Criteria:**
- [~] Step 2 content displays when currentStep=2
- [~] Title: "SUA NAVEGAÇÃO" (1.5rem, bold, uppercase)
- [~] Icon: 🗺️ Map (2rem) at top
- [~] Visual diagram: 5 nodes horizontally connected with lines/arrows
- [~] Each node displays: icon (1.5rem), label (0.875rem uppercase bold), description (0.75rem muted)
- [~] Node layout: flex row, justify-between, gap 16px
- [~] Connection lines: horizontal line between nodes (1px solid, muted)
- [~] Tip box at bottom: light background (info color alpha 0.1), border, padding 16px
- [~] Tip text: "💡 DICA: Studio IA está sempre visível no topo!"
- [~] Buttons: "← VOLTAR" (ghost), "PRÓXIMO →" (primary)
- [~] Animation: fade + slide in (opacity 0→1, translateX 20px→0, 300ms)

**Design Reference:** `design.md > Components > 5. WelcomeModal Component > Visual Design - Step 2`
**Requirements Reference:** US-011, FR-016

**Verification:**
```bash
npm run test -- WelcomeModal.test.tsx
# Visual: Navigate to Step 2, verify navigation map displays correctly
```

---

- [ ] 1.4.4 Design Step 3: Workflow Explanation

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.4.1 (Modal Structure)
**Assignee:** Frontend Developer

**Description:**
Design and implement Step 3 showing workflow explanation (Cliente → Job → Studio → Entrega) with action buttons and demo job option.

**Technical Details:**
- Icon: 🎬 Film at top
- Title: "SEU WORKFLOW" (1.5rem bold)
- Workflow steps: 4 numbered steps with descriptions and action buttons
- Step 1: "CLIENTE → Cadastre na aba CLIENTS" + [Ir para Clients] button
- Step 2: "JOB → Crie um job na aba JOBS" + [Criar Job] button
- Step 3: "STUDIO → Use IA para roteiro, briefing, docs" + [Abrir Studio] button
- Step 4: "ENTREGA → Review, aprovação, faturamento"
- Divider: "OU" centered
- Demo option: "Criar Job Demo (dados prontos)" + [Criar Demo] button

**Acceptance Criteria:**
- [~] Step 3 content displays when currentStep=3
- [~] Title: "SEU WORKFLOW" (1.5rem, bold, uppercase)
- [~] Icon: 🎬 Film (2rem) at top
- [~] 4 workflow steps displayed: numbered (1-4), each with label, description, optional button
- [~] Step format: number (1.5rem bold, orange), label + arrow (→), description, action button
- [~] Action buttons: ghost style, size sm, inline below description
- [~] Step 1 button: "Ir para Clients" → navigates to /clients
- [~] Step 2 button: "Criar Job" → opens job creation flow
- [~] Step 3 button: "Abrir Studio" → navigates to /studio
- [~] Step 4: no button (end of workflow)
- [~] Divider: "OU" text centered between workflow and demo option
- [~] Demo option: highlighted box (glass effect), "Criar Job Demo" button (primary style)
- [~] Buttons at bottom: "← VOLTAR" (ghost), "COMEÇAR! 🚀" (primary, larger)
- [ ] Animation: fade + slide in (opacity 0→1, translateX 20px→0, 300ms)

**Design Reference:** `design.md > Components > 5. WelcomeModal Component > Visual Design - Step 3`
**Requirements Reference:** US-011, US-014

**Verification:**
```bash
npm run test -- WelcomeModal.test.tsx
# Test: Click "Ir para Clients", verify navigation
# Test: Click "Criar Demo", verify demo job creation flow
```

---

### Task 1.4.5: Implement Preference Persistence

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.4.1 (Modal Structure)
**Assignee:** Frontend Developer

**Description:**
Implement user preference persistence for WelcomeModal (completed, skipped, never show again) saving to backend and loading on authentication.

**Technical Details:**
- Preferences: welcomeModalCompleted (boolean), welcomeModalSkipped (boolean), neverShowWelcome (boolean)
- API: PATCH /api/user/preferences with {key: value} pairs
- Save on: Complete (step 3 "Começar"), Skip (any step), Never show checkbox checked
- Load on: User authentication, check preferences to determine if modal should show
- Modal logic: Show if firstLogin=true AND welcomeModalCompleted=false AND neverShowWelcome=false

**Acceptance Criteria:**
- [~] "Nunca mostrar novamente" checkbox on Step 3 (below content, above buttons)
- [~] Checkbox state: neverShowAgain (boolean), default false
- [~] Completing modal (clicking "Começar"): saves welcomeModalCompleted=true, firstLogin=false
- [~] If neverShowAgain=true: also saves neverShowWelcome=true
- [~] Skipping modal: saves welcomeModalSkipped=true
- [~] API: PATCH /api/user/preferences or /api/users/:id endpoint
- [~] Preferences persist to user profile in database
- [~] On login: load preferences, determine if modal should auto-show
- [~] Modal shows if: user.firstLogin=true AND !user.preferences.welcomeModalCompleted AND !user.preferences.neverShowWelcome
- [~] Failed save: retry in background, log error, don't block user (modal still closes)

**Design Reference:** `design.md > Algorithmic Pseudocode > WelcomeModal Progression Algorithm`
**Requirements Reference:** US-012, US-013, FR-015, FR-017

**Verification:**
```bash
npm run test -- WelcomeModal.test.tsx
# Integration test: Complete modal, logout, login, verify modal doesn't show
# Test: Check "never show", complete, verify preference saved
```

---

### Task 1.4.6: Implement Demo Job Creation

**Priority:** P1
**Estimated Time:** 3 hours
**Dependencies:** 1.4.4 (Step 3)
**Assignee:** Frontend Developer

**Description:**
Implement "Criar Job Demo" button functionality that creates sample job with realistic data (demo client, title, status, deadline) and navigates to job details.

**Technical Details:**
- Button: "Criar Demo" on Step 3, glass button style
- API: POST /api/demo/job (backend endpoint creates demo job with sample data)
- Demo job data: title="Projeto Demo - Comercial", client="Cliente Exemplo", status="production", deadline=7 days from now, progress=50
- Demo job marked: Add tag "Demo" or boolean field isDemo=true
- Success: Show toast "Job demo criado com sucesso!", close modal, navigate to /project/:newDemoJobId
- Check existing: On Step 3 mount, check if demo job already exists (GET /api/demo/check)

**Acceptance Criteria:**
- [~] "Criar Demo" button on Step 3, styled as primary button (glass, orange)
- [~] Clicking button: loading state (spinner + "Criando..." text), button disabled
- [~] API: POST /api/demo/job creates job with sample data
- [~] Demo job: title="Projeto Demo - Comercial", client auto-created "Cliente Exemplo", status="production", deadline=now+7days, progress=50
- [~] Job tagged/marked as demo: isDemo=true field or tag array includes "Demo"
- [~] Success: toast "Job demo criado com sucesso!", modal closes, navigate to /project/:demoJobId
- [~] Error: toast error message, button re-enabled, retry possible
- [~] Check existing: GET /api/demo/check on Step 3 mount, if exists show "Job demo já existe! Ver Projeto Demo" button instead
- [~] "Ver Projeto Demo" button: navigates to existing demo job, closes modal

**Design Reference:** `design.md > Components > 5. WelcomeModal Component > Visual Design - Step 3`
**Requirements Reference:** US-014, FR-018

**Verification:**
```bash
npm run test -- WelcomeModal.test.tsx
# Integration test: Click "Criar Demo", verify API call, verify navigation
# Test: Create demo, close modal, reopen, verify "Ver Projeto Demo" button shows
```

---

## Phase 1.5: Integration, Testing & Polish

### Task 1.5.1: Write Unit Tests for Base Components

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** 1.1.2-1.1.6 (All base components)
**Assignee:** QA/Frontend Developer

**Description:**
Write comprehensive unit tests for all base components (GlassCard, StatusBadge, ProgressBar, QuickActionButton, Tooltip, WorkflowCard, JobCard, ChecklistItem) achieving ≥85% coverage.

**Technical Details:**
- Framework: Jest + React Testing Library
- Coverage target: ≥85% for each component (lines, branches, functions, statements)
- Test scenarios: rendering, props handling, user interactions, edge cases, accessibility
- Mock: API calls, navigation, context providers
- Files: `*.test.tsx` co-located with components

**Test Cases per Component:**
- GlassCard: variant prop (light/dark), hover effect, onClick handler, children rendering
- StatusBadge: all 5 types (colors correct), pulse animation, icon rendering
- ProgressBar: value constraining (0-100), percentage label, ARIA attributes, animation
- QuickActionButton: variant (ghost/solid), hover, icon, onClick
- Tooltip: show/hide on hover/focus, positioning (top/bottom/left/right), keyboard
- WorkflowCard: count display, navigation onClick, hover animation
- JobCard: status border colors, urgency indicator, progress bar, quick actions
- ChecklistItem: checkbox toggle, strikethrough on checked, delete button

**Acceptance Criteria:**
- [~] Unit tests written for all 8 base components
- [~] Coverage ≥85% for each component (measure with --coverage flag)
- [~] All props tested: correct rendering, type validation
- [~] User interactions tested: clicks, hovers, keyboard events
- [~] Edge cases tested: empty states, max values, invalid props
- [~] Accessibility tested: ARIA attributes, keyboard navigation, focus
- [~] Snapshots: create snapshot tests for visual regression
- [~] Tests pass: npm run test exits with code 0

**Design Reference:** `design.md > Testing Strategy > Unit Testing Approach`
**Requirements Reference:** FR-039, NFR-016

**Verification:**
```bash
npm run test -- --coverage
# Verify coverage report: each component ≥85%
```

---

### Task 1.5.2: Write Property-Based Tests for Core Algorithms

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** 1.2.2 (Navigation State), 1.3.11 (Data Loading)
**Assignee:** QA/Frontend Developer

**Description:**
Write property-based tests using fast-check for core algorithms (navigation uniqueness, job progress range, workflow stats non-negative, status transitions, modal step bounds).

**Technical Details:**
- Framework: fast-check + Jest integration
- Properties: 5 core properties from design.md Correctness Properties section
- Test runs: 100+ random cases per property
- Shrinking: fast-check automatically finds minimal failing case
- Files: `*.property.test.ts` for each algorithm

**Properties to Test:**
1. Navigation uniqueness: ∀ path, exactly 1 active tab
2. Job progress range: ∀ job, 0 ≤ progress ≤ 100
3. Workflow stats non-negative: ∀ calculations, all values ≥ 0
4. Status transition validity: ∀ transitions, matches validTransitions map
5. Modal step bounds: ∀ actions, 1 ≤ step ≤ 3

**Acceptance Criteria:**
- [~] Property test 1: Navigation uniqueness (manageNavigationState function)
- [~] Property test 2: Job progress range (createJob or updateJob function)
- [~] Property test 3: Workflow stats non-negative (calculateWorkflowStats function)
- [~] Property test 4: Status transition validity (canTransitionStatus function)
- [~] Property test 5: Modal step bounds (handleWelcomeModalProgression function)
- [~] Each property test runs 100+ cases (fc.assert with default or custom numRuns)
- [~] Custom generators: fc.record for complex objects (Job, Client, etc.)
- [~] Shrinking verified: intentionally break property, verify minimal failing case
- [~] All property tests pass: npm run test exits with code 0
- [~] Property tests integrated in CI/CD pipeline

**Design Reference:** `design.md > Testing Strategy > Property-Based Testing Approach`
**Requirements Reference:** FR-040

**Verification:**
```bash
npm run test -- *.property.test.ts
# Each test should show "Property passed after X runs"
```

---

### Task 1.5.3: Write Integration Tests with Cypress

**Priority:** P0
**Estimated Time:** 5 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** QA/Frontend Developer

**Description:**
Write end-to-end integration tests using Cypress for critical user flows (onboarding, navigation, dashboard data loading, job card interactions, theme toggle).

**Technical Details:**
- Framework: Cypress (or Playwright as alternative)
- Test scenarios: 5 critical flows from design.md
- Environment: Test against development server (npm run dev)
- Data: Seed database with test data before each test
- Files: `cypress/integration/*.spec.ts`

**Test Flows:**
1. Complete onboarding flow: login → modal → 3 steps → completion → verify no re-show
2. Navigation flow: click all 5 tabs → verify page loads → verify active tab indicator
3. Job card interaction: click quick action (Briefing) → verify navigation → return to HOME
4. Dashboard data loading: navigate to HOME → verify skeletons → verify data population
5. Theme toggle: click toggle → verify colors update → refresh → verify persistence

**Acceptance Criteria:**
- [~] Test 1 (Onboarding): login as new user → modal appears → step through 1→2→3 → complete → logout → login → verify modal doesn't appear
- [~] Test 2 (Navigation): click HOME → verify /home route → click CLIENTS → verify /clients → repeat for all 5 tabs
- [~] Test 3 (Job card): navigate to HOME → click job card "Briefing" button → verify navigation to briefing page → back button → verify HOME
- [~] Test 4 (Dashboard): navigate to HOME → verify skeleton states visible → wait for data → verify workflow cards, jobs, checklist populated
- [~] Test 5 (Theme): click theme toggle → verify dark theme applied (data-theme="dark") → refresh page → verify theme persists
- [~] All tests pass: cypress run exits with code 0
- [~] Tests run on CI/CD pipeline before deployment
- [~] Screenshots captured on test failure

**Design Reference:** `design.md > Testing Strategy > Integration Testing Approach`
**Requirements Reference:** FR-041

**Verification:**
```bash
npm run cypress:run
# Or: npx cypress open (interactive mode)
```

---

### Task 1.5.3.1: Write Backend API Unit Tests for Task Management

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.3.13, 1.3.14, 1.3.15, 1.3.16 (all backend API tasks)
**Assignee:** Backend Developer / QA

**Description:**
Write comprehensive unit tests for all task management API endpoints (GET, POST, PATCH, DELETE /api/tasks) covering success paths, error scenarios, authentication, authorization, and validation.

**Technical Details:**
- Framework: Jest (Node.js) or equivalent backend testing framework
- Coverage target: ≥90% for API endpoints
- Test database: Use test database or mock ORM queries
- Test scenarios: success, auth failures, validation errors, rate limits, edge cases
- Files: `server/tests/api/tasks.test.ts` (or equivalent)

**Test Cases per Endpoint:**
- **GET /api/tasks**: Valid request returns tasks, unauthorized returns 401, pagination works, soft-deleted excluded
- **POST /api/tasks**: Valid request creates task, validation errors return 400, rate limit returns 429, unauthorized returns 401
- **PATCH /api/tasks/:id**: Valid request updates task, ownership validation (403), validation errors (400), unauthorized (401), not found (404)
- **DELETE /api/tasks/:id**: Valid request soft-deletes task, ownership validation (403), unauthorized (401), not found (404), already-deleted returns 404

**Acceptance Criteria:**
- [ ] Unit tests written for GET /api/tasks (5+ test cases: success, auth, pagination, empty result, soft-deleted exclusion)
- [ ] Unit tests written for POST /api/tasks (6+ test cases: success, validation errors, rate limit, auth, duplicate text allowed)
- [ ] Unit tests written for PATCH /api/tasks/:id (7+ test cases: success, partial update, ownership validation, validation errors, auth, not found)
- [ ] Unit tests written for DELETE /api/tasks/:id (5+ test cases: success soft delete, ownership validation, auth, not found, already-deleted)
- [ ] Coverage ≥90% for API endpoints (measure with --coverage flag)
- [ ] Mock external dependencies: database queries, JWT validation
- [ ] Test response formats: verify correct HTTP status codes, JSON structure
- [ ] All tests pass: npm run test:api exits with code 0

**Design Reference:** `requirements.md > FR-015, FR-016, FR-017, FR-018`
**Requirements Reference:** FR-015, FR-016, FR-017, FR-018

**Verification:**
```bash
npm run test:api -- --coverage
# Verify coverage report: API endpoints ≥90%
```

---

### Task 1.5.3.2: Write Integration Tests for Task Management CRUD Flow

**Priority:** P0
**Estimated Time:** 2.5 hours
**Dependencies:** 1.3.17 (Frontend API integration), 1.5.3.1 (Backend API tests)
**Assignee:** QA/Frontend Developer

**Description:**
Write Cypress integration test for complete task management flow: create task, check task, edit task text, delete task, with API verification and optimistic UI testing.

**Technical Details:**
- Framework: Cypress (or Playwright)
- Test flow: Navigate to HOME → Add task → Verify API call → Check task → Verify PATCH → Edit text → Delete task → Verify soft delete
- API intercepts: Use cy.intercept to verify API calls
- Optimistic UI: Verify immediate UI updates before API response
- Error scenario: Simulate API failure, verify rollback and error toast

**Test Scenarios:**
1. **Create task**: Type "Test Task" → press Enter → verify POST /api/tasks called → verify task appears in checklist
2. **Check task**: Click checkbox → verify PATCH /api/tasks/:id called with checked:true → verify strikethrough applied
3. **Edit task**: (if editing feature exists) Click task → edit text → verify PATCH called
4. **Delete task**: Hover task → click delete button → verify DELETE /api/tasks/:id called → verify task removed from list
5. **Optimistic UI**: Intercept POST (delay response) → create task → verify task appears immediately → wait for response → verify task still there
6. **Error handling**: Intercept POST (return 500) → create task → verify error toast appears → verify task NOT in list

**Acceptance Criteria:**
- [ ] Integration test created: `cypress/integration/task-management.spec.ts`
- [ ] Test 1 (Create): Type task → press Enter → cy.intercept verifies POST /api/tasks → task visible in checklist
- [ ] Test 2 (Check): Click checkbox → cy.intercept verifies PATCH /api/tasks/:id → strikethrough visible
- [ ] Test 3 (Delete): Click delete → cy.intercept verifies DELETE /api/tasks/:id → task removed from list
- [ ] Test 4 (Optimistic UI): Delay API response → verify task appears immediately (before response)
- [ ] Test 5 (Error handling): Mock 500 error → verify error toast appears → verify rollback (task not in list)
- [ ] All assertions pass: test runs green in Cypress
- [ ] Test runs on CI/CD pipeline

**Design Reference:** `requirements.md > US-007, US-023, US-024, US-025, US-026`
**Requirements Reference:** US-007, FR-015, FR-016, FR-017, FR-018

**Verification:**
```bash
npx cypress run --spec "cypress/integration/task-management.spec.ts"
# Or: npx cypress open (interactive mode)
```

---

### Task 1.5.4: Perform Accessibility Audit & Fixes

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** Frontend Developer

**Description:**
Perform comprehensive accessibility audit using Lighthouse, axe DevTools, and manual testing (keyboard, screen reader), fix all violations to achieve 100 Lighthouse accessibility score.

**Technical Details:**
- Tools: Lighthouse (Chrome DevTools), axe DevTools extension, WAVE extension
- Manual testing: Keyboard navigation (Tab, Enter, Esc, Arrow keys), screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- WCAG 2.1 Level AA compliance target
- Common issues: color contrast, missing ARIA labels, keyboard traps, focus indicators

**Audit Checklist:**
1. Run Lighthouse accessibility audit → fix all issues
2. Run axe DevTools → fix all violations (0 violations target)
3. Keyboard navigation: Tab through all interactive elements → verify focus order
4. Focus indicators: verify visible focus outline on all focusable elements
5. Screen reader: test with NVDA/VoiceOver → verify semantic HTML, ARIA labels
6. Color contrast: verify ≥ 4.5:1 for body text, ≥ 3:1 for large text
7. ARIA attributes: verify correct usage (aria-label, aria-labelledby, aria-modal, aria-valuenow)

**Acceptance Criteria:**
- [~] Lighthouse accessibility score = 100 (run on HOME, TopNav, WelcomeModal)
- [~] axe DevTools reports 0 violations
- [~] All interactive elements keyboard accessible (Tab navigation works)
- [~] Focus order follows logical reading order (top to bottom, left to right)
- [~] Focus indicators visible (≥ 3:1 contrast ratio) on all focusable elements
- [~] Screen reader compatible: semantic HTML (<nav>, <main>, <button>, <input>)
- [~] ARIA labels present on icon-only buttons, progress bars, modals
- [~] Color contrast verified: body text ≥ 4.5:1, large text ≥ 3:1, checked with Contrast Checker tool
- [~] No keyboard traps: Tab/Shift+Tab doesn't get stuck
- [~] Skip links present: "Skip to main content" link at top
- [~] All violations documented and fixed

**Design Reference:** `design.md > Testing Strategy > Accessibility Testing`
**Requirements Reference:** FR-042, NFR-005, NFR-006, NFR-007

**Verification:**
```bash
npm run lighthouse -- --only-categories=accessibility
# Or use Chrome DevTools Lighthouse tab
```

---

### Task 1.5.5: Optimize Performance (FCP, TTI, CLS)

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** Frontend Developer

**Description:**
Optimize performance to achieve Lighthouse targets: FCP < 1.5s, TTI < 2.5s, CLS < 0.1, improve bundle size, implement code splitting, optimize images.

**Technical Details:**
- Lighthouse audit: Performance score target ≥ 95
- Metrics: FCP (First Contentful Paint), TTI (Time to Interactive), CLS (Cumulative Layout Shift), LCP (Largest Contentful Paint)
- Optimizations: code splitting, lazy loading, image optimization, font preloading, critical CSS inlining
- Tools: Webpack Bundle Analyzer, Chrome DevTools Performance tab

**Optimization Strategies:**
1. Code splitting: Split routes using React.lazy() and Suspense
2. Lazy loading: Load images below fold with loading="lazy"
3. Font optimization: Preload fonts, use font-display: swap with size-adjust
4. Critical CSS: Inline critical CSS in <head>
5. Bundle size: Analyze with webpack-bundle-analyzer, remove unused dependencies
6. Image optimization: Convert to WebP, add width/height attributes
7. Reduce JavaScript: Remove console.log, minimize third-party scripts

**Acceptance Criteria:**
- [~] Lighthouse Performance score ≥ 95 (tested on HOME dashboard)
- [~] First Contentful Paint (FCP) < 1.5s
- [~] Time to Interactive (TTI) < 2.5s
- [~] Cumulative Layout Shift (CLS) < 0.1 (skeleton screens match final layout)
- [~] Largest Contentful Paint (LCP) < 2.0s
- [~] Bundle size: main bundle < 500KB gzipped
- [~] Code splitting implemented: separate bundles for each route
- [~] Images: lazy loading for below-fold images, width/height attributes set
- [~] Fonts: preloaded, font-display: swap, size-adjust CSS property
- [~] Critical CSS: inlined in HTML <head>
- [~] Performance tested on simulated 3G throttle (Chrome DevTools)

**Design Reference:** `design.md > Performance Considerations > Performance Targets`
**Requirements Reference:** FR-030, FR-031, NFR-001, NFR-002, NFR-003

**Verification:**
```bash
npm run lighthouse
npm run analyze-bundle
# Chrome DevTools: Performance tab, 3G throttle, record page load
```

---

### Task 1.5.6: Test Browser Compatibility

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** QA/Frontend Developer

**Description:**
Test platform on all supported browsers (Chrome, Firefox, Safari, Edge) and verify glassmorphism fallbacks, CSS Grid/Flexbox layouts, and JavaScript features work correctly.

**Technical Details:**
- Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Features: backdrop-filter (glassmorphism), CSS Grid, Flexbox, ES6+ JavaScript
- Testing: Manual testing on each browser, visual regression testing
- Fallbacks: Detect unsupported features, apply fallback styles

**Browser Test Checklist:**
1. Chrome: Full test (primary browser)
2. Firefox: Test glassmorphism, grid layouts, animations
3. Safari: Test backdrop-filter (supported), scrolling behavior
4. Edge: Test glassmorphism, compatibility mode disabled
5. Mobile Safari (iOS): Test touch interactions, safe area insets
6. Mobile Chrome (Android): Test responsive layouts, touch targets

**Acceptance Criteria:**
- [~] Chrome 90+ (desktop): All features work, no visual issues
- [~] Firefox 88+ (desktop): All features work, glassmorphism renders correctly
- [~] Safari 14+ (desktop): backdrop-filter works, layouts correct
- [~] Edge 90+ (desktop): All features work, no compatibility issues
- [~] Mobile Safari (iOS 14+): Touch interactions work, responsive layouts correct
- [~] Mobile Chrome (Android): Touch interactions work, no layout issues
- [~] Glassmorphism fallback: If backdrop-filter unsupported, solid background with higher opacity
- [~] CSS Grid: Fallback to Flexbox if needed (unlikely for modern browsers)
- [~] JavaScript: ES6+ features polyfilled if needed (or transpiled by Babel)
- [~] No console errors on any browser
- [~] Visual regression: Screenshots match across browsers (within reasonable tolerance)

**Design Reference:** `design.md > Dependencies > Core Framework Dependencies`
**Requirements Reference:** FR-043

**Verification:**
```bash
# Manual testing on each browser
# BrowserStack or LambdaTest for automated cross-browser testing
```

---

### Task 1.5.7: Tune Animation Performance (60fps)

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** All animated components
**Assignee:** Frontend Developer

**Description:**
Optimize all animations to maintain 60fps (16.67ms per frame) using GPU acceleration, will-change hints, and transform-only animations, verify with Chrome DevTools Performance profiler.

**Technical Details:**
- Performance target: 60fps (no dropped frames)
- Techniques: Use transform/opacity only, avoid layout-triggering properties, will-change hints, translateZ(0) for layer promotion
- Tools: Chrome DevTools Performance tab, FPS meter
- Test scenarios: Card hover, staggered entrance, modal transitions, progress bar fill

**Optimization Techniques:**
1. Transform-only: Use transform instead of top/left/margin
2. Opacity-only: Use opacity instead of display/visibility
3. Will-change: Add will-change: transform to frequently animated elements
4. Layer promotion: Use transform: translateZ(0) to force GPU acceleration
5. Reduce complexity: Simplify animations during scroll or many elements
6. RequestAnimationFrame: Use RAF for JavaScript animations
7. Intersection Observer: Only animate visible elements

**Acceptance Criteria:**
- [~] Chrome DevTools Performance recording shows 60fps (no red/yellow frames)
- [~] Frame time < 16.67ms for all animations
- [~] Card hover animation: smooth translateY, no jank
- [~] Staggered entrance animation: smooth for 4+ cards
- [~] Modal transitions: smooth backdrop blur + content slide
- [~] Progress bar fill: smooth width animation
- [~] Tested on mid-tier device: 4-core CPU, integrated GPU (simulated in DevTools)
- [~] Will-change applied to: .glass-card:hover, .workflow-card, .modal-content
- [~] Transform: translateZ(0) applied to glass cards
- [~] No layout-triggering properties animated (width, height, margin, padding, border)
- [~] Respects prefers-reduced-motion: animations disabled

**Design Reference:** `design.md > Performance Considerations > Animation Performance`
**Requirements Reference:** FR-032, NFR-004

**Verification:**
```bash
# Chrome DevTools: Performance tab → Record → Interact with animations → Stop → Analyze FPS
# Enable FPS meter: DevTools → More tools → Rendering → Frame Rendering Stats
```

---

### Task 1.5.8: Implement Error Handling & Recovery

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** 1.3.11 (Data Loading)
**Assignee:** Frontend Developer

**Description:**
Implement comprehensive error handling for all API requests with retry logic, user-friendly error messages, fallback to cached data, and error state UI components.

**Technical Details:**
- Error types: Network errors, API errors (4xx, 5xx), validation errors
- Retry logic: Automatic retry once with exponential backoff (1s, 2s, 4s)
- Error UI: Toast notifications, error state components with "Try Again" button
- Fallback: Use cached data (if < 1 hour old) when API fails
- Logging: Log errors to monitoring service (Sentry or console in dev)

**Error Scenarios:**
1. Dashboard data load fails → Retry once → Show error state with "Tentar Novamente"
2. Job status transition invalid → Show toast error → Highlight valid options
3. Checklist item save fails → Rollback optimistic update → Show toast error
4. WelcomeModal preference save fails → Retry in background → Don't block user
5. Glassmorphism unsupported → Fallback to solid backgrounds

**Acceptance Criteria:**
- [~] All API requests have try/catch error handling
- [~] Retry logic: 1 automatic retry with 1-second delay (exponential backoff for subsequent)
- [~] Error toast: user-friendly message (e.g., "Não foi possível carregar os dados"), 5s auto-dismiss
- [~] Error state component: displays error message + "Tentar Novamente" button
- [~] Clicking "Try Again": re-fetches data, shows loading state
- [~] Fallback to cached data: if API fails and cache exists (< 1 hour old), show cached data with warning
- [~] Optimistic updates rollback: if mutation fails, revert UI to previous state
- [~] Error logging: all errors logged with context (user ID, endpoint, error message)
- [~] Network offline: detect navigator.onLine=false, show "Sem conexão" message
- [~] Invalid status transition: show toast "Transição inválida. Status válidos: [list]"

**Design Reference:** `design.md > Error Handling`
**Requirements Reference:** FR-025, NFR-013

**Verification:**
```bash
npm run test -- errorHandling.test.ts
# Integration test: Mock API failure, verify retry, verify error state
# Manual: Disconnect network, verify offline message
```

---

### Task 1.5.9: Conduct Security Review (XSS, Auth, HTTPS)

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** Security Engineer / Senior Frontend Developer

**Description:**
Conduct security review focusing on XSS prevention, authentication/authorization, HTTPS-only communication, and sensitive data handling, fix all identified vulnerabilities.

**Technical Details:**
- XSS: Sanitize all user input, escape HTML output, CSP headers
- Auth: JWT validation, token expiration, httpOnly cookies
- HTTPS: Enforce HTTPS, HSTS headers, no mixed content
- Data privacy: No logging of tokens/passwords, PII handling
- Tools: OWASP ZAP, manual code review, penetration testing

**Security Checklist:**
1. XSS Prevention: Sanitize job titles, client names, checklist items before save
2. CSP Headers: Content-Security-Policy with strict directives
3. Auth Token: JWT stored in httpOnly cookie, not localStorage
4. Token Validation: Backend validates token on every request
5. HTTPS Only: All API calls use https://, HTTP redirects to HTTPS
6. HSTS Header: Strict-Transport-Security: max-age=31536000
7. Sensitive Data: No console.log of tokens, passwords, financial data
8. SQL Injection: Use parameterized queries (if backend uses SQL)

**Acceptance Criteria:**
- [~] XSS: All user input sanitized before storage (remove <script> tags, HTML entities)
- [~] React JSX: No dangerouslySetInnerHTML used (or sanitized with DOMPurify if necessary)
- [~] CSP Header: Content-Security-Policy header with script-src 'self', style-src 'self' 'unsafe-inline'
- [~] JWT Token: Stored in httpOnly cookie (not localStorage or sessionStorage)
- [~] Token expiration: Token refresh before 7-day expiration
- [~] Auth validation: Backend extracts userId from token, verifies match with requested data
- [~] HTTPS Only: All API endpoints use https:// protocol
- [~] HTTP→HTTPS redirect: Server redirects HTTP requests to HTTPS (301)
- [~] HSTS Header: Strict-Transport-Security: max-age=31536000; includeSubDomains
- [~] No mixed content: Browser console shows no mixed content warnings
- [~] Sensitive data: No tokens, passwords, financial amounts in console.log or error logs
- [~] Manual penetration test: Common XSS payloads tested (<script>alert('XSS')</script>, etc.)

**Design Reference:** `design.md > Security Considerations`
**Requirements Reference:** FR-034, FR-035, FR-036, FR-037, FR-038

**Verification:**
```bash
npm run security-audit
# Or: OWASP ZAP scan, manual code review
# Test XSS: Try entering <script>alert('XSS')</script> in job title
```

---

### Task 1.5.10: Visual QA & Design System Compliance

**Priority:** P0
**Estimated Time:** 3 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** Designer + Frontend Developer

**Description:**
Perform visual quality assurance comparing implemented components against design.md specifications, verify design system compliance (colors, typography, spacing, border radius, glassmorphism).

**Technical Details:**
- Design system checklist: Colors, typography, spacing, border radius, glassmorphism effects, shadows
- Visual comparison: Screenshots vs. design specs, pixel-perfect review
- Consistency: Verify all components use design tokens, no hardcoded values
- Tools: Browser DevTools, Figma/design tool (if available), visual regression testing

**Visual QA Checklist:**
1. Colors: Verify all colors match design tokens (primary, status, backgrounds, borders)
2. Typography: Verify font families, sizes, weights, line-heights match design system
3. Spacing: Verify all gaps, padding, margins use spacing scale (xs, sm, md, lg, xl, 2xl)
4. Border radius: Verify all cards use correct radius (xl=24px for cards, 2xl=32px for large)
5. Glassmorphism: Verify backdrop-filter blur(20px), rgba backgrounds, subtle borders
6. Shadows: Verify box-shadows match shadow scale (sm, md, lg, xl)
7. Animations: Verify timing (300ms), easing (ease-out), transforms (translateY -4px)
8. Responsive: Verify layouts at 375px (mobile), 768px (tablet), 1400px (desktop)

**Acceptance Criteria:**
- [~] All colors match design tokens (no hardcoded hex values outside tokens.css)
- [~] Typography: Font families correct (Frame Display for headings, DM Sans for body)
- [~] Typography: Font sizes correct (2.5rem page title, 1.5rem card title, 1rem body, 0.75rem label)
- [~] Spacing: All gaps/padding/margins use spacing scale variables (--space-sm, --space-md, etc.)
- [~] Border radius: Cards use xl (24px), buttons use md (12px), badges use full (9999px)
- [~] Glassmorphism: All glass cards have backdrop-filter: blur(20px), correct rgba backgrounds
- [~] Shadows: Cards use shadow-md (0 8px 32px rgba(0,0,0,0.08))
- [~] Animations: Hover lifts use translateY(-4px), 300ms ease-out transition
- [~] Staggered animations: 50ms delay per card
- [~] Responsive: Layouts correct at 375px, 768px, 1400px breakpoints
- [~] Visual consistency: All similar components styled identically
- [~] No design debt: No "TODO" or placeholder styles

**Design Reference:** `design.md > Visual Design System Specifications`
**Requirements Reference:** NFR-008, NFR-009, NFR-010, NFR-011

**Verification:**
```bash
# Manual: Compare screenshots with design.md specs
# Visual regression: Percy, Chromatic, or manual screenshot comparison
```

---

### Task 1.5.11: Write Documentation & Code Comments

**Priority:** P1
**Estimated Time:** 3 hours
**Dependencies:** All Phase 1.1-1.4 tasks
**Assignee:** Frontend Developer

**Description:**
Write comprehensive documentation for components, algorithms, and APIs, add JSDoc comments to complex functions, create README for spec implementation.

**Technical Details:**
- Component docs: PropTypes/TypeScript interfaces, usage examples, Storybook stories
- Algorithm docs: JSDoc comments matching pseudocode from design.md
- API docs: Endpoint documentation, request/response formats
- README: Implementation summary, architecture overview, development guide
- Inline comments: Explain complex logic, business rules, workarounds

**Documentation Checklist:**
1. Component README: List all components with brief descriptions
2. PropTypes/Interfaces: TypeScript interfaces documented with JSDoc
3. Storybook: Stories for all base components with all variants
4. Algorithm comments: JSDoc for manageNavigationState, calculateWorkflowStats, etc.
5. API documentation: Endpoints used by frontend, request/response examples
6. Development guide: Setup instructions, npm scripts, folder structure
7. Design system docs: Colors, typography, spacing usage guide
8. Testing guide: How to run tests, coverage, property tests

**Acceptance Criteria:**
- [~] README.md created in spec directory (.kiro/specs/rebrand-fase1-fundacao/README.md)
- [~] README includes: Overview, Architecture, Components, Development Setup, Testing, Deployment
- [~] All components have TypeScript interfaces with JSDoc comments
- [~] Complex algorithms have JSDoc comments matching design.md pseudocode
- [~] Storybook stories created for: GlassCard, StatusBadge, ProgressBar, QuickActionButton, Tooltip, WorkflowCard, JobCard
- [~] API endpoints documented: /api/dashboard/*, /api/jobs/*, /api/checklist/*, /api/demo/*
- [~] Inline comments explain: business logic, workarounds, browser-specific code
- [~] Design system usage guide: How to use design tokens, when to use which spacing/radius
- [~] Testing guide: npm run test, npm run test:coverage, npm run cypress, property tests explanation

**Design Reference:** `design.md > Algorithmic Pseudocode`
**Requirements Reference:** NFR-017

**Verification:**
```bash
# Review: Check README completeness, verify Storybook stories render
npm run storybook
```

---

### Task 1.5.12: Run Lighthouse Audit & Fix Issues

**Priority:** P0
**Estimated Time:** 2 hours
**Dependencies:** 1.5.4 (Accessibility), 1.5.5 (Performance)
**Assignee:** Frontend Developer

**Description:**
Run comprehensive Lighthouse audit (Performance, Accessibility, Best Practices, SEO) on HOME dashboard and TopNav, fix all issues to achieve ≥95 score in all categories.

**Technical Details:**
- Lighthouse categories: Performance, Accessibility, Best Practices, SEO
- Target scores: Performance ≥95, Accessibility 100, Best Practices ≥95, SEO ≥90
- Test on: HOME dashboard, TopNav, WelcomeModal
- Throttling: Simulated 3G, Mobile device (Moto G4)
- Iteration: Run audit → Fix issues → Re-run → Verify scores

**Lighthouse Checklist:**
1. Performance: FCP < 1.5s, TTI < 2.5s, CLS < 0.1, LCP < 2.0s
2. Accessibility: Score 100, all ARIA labels, color contrast, keyboard nav
3. Best Practices: HTTPS, no console errors, no deprecated APIs, CSP
4. SEO: Meta tags, viewport, font sizes, crawlable links

**Acceptance Criteria:**
- [~] Lighthouse Performance score ≥ 95 (run on HOME dashboard)
- [~] Lighthouse Accessibility score = 100
- [~] Lighthouse Best Practices score ≥ 95
- [~] Lighthouse SEO score ≥ 90
- [~] Metrics: FCP < 1.5s, TTI < 2.5s, CLS < 0.1, LCP < 2.0s
- [~] No console errors or warnings
- [~] HTTPS enforced, valid SSL certificate
- [~] Meta tags present: title, description, viewport
- [~] No deprecated APIs used
- [~] CSP header present
- [~] All images have alt text
- [~] All links have discernible text (no empty <a> tags)

**Design Reference:** `design.md > Performance Considerations > Performance Targets`
**Requirements Reference:** FR-030, NFR-001, NFR-005

**Verification:**
```bash
npm run lighthouse
# Or: Chrome DevTools → Lighthouse tab → Generate report
```

---

### Task 1.5.13: Final Integration Testing & Deployment Prep

**Priority:** P0
**Estimated Time:** 4 hours
**Dependencies:** All Phase 1.5 tasks
**Assignee:** Tech Lead / Senior Developer

**Description:**
Perform final end-to-end integration testing covering complete user journey (login → onboarding → navigation → dashboard usage → job creation), prepare for deployment (environment config, CI/CD, rollback plan).

**Technical Details:**
- Complete user journey: First-time user flow + returning user flow
- Environment: Staging environment matching production configuration
- Testing: Manual testing + automated Cypress tests
- Deployment prep: Environment variables, build verification, rollback plan
- Smoke tests: Post-deployment quick checks

**Integration Test Scenarios:**
1. First-time user: Sign up → WelcomeModal → Complete onboarding → Navigate all 5 tabs → Create first job
2. Returning user: Login → Dashboard loads → View jobs → Click quick action → Check checklist → Navigate to Studio
3. Mobile user: Login on mobile → Hamburger menu → Navigate tabs → Responsive layouts work
4. Theme switching: Toggle light/dark → Verify colors → Refresh → Verify persistence
5. Error recovery: Disconnect network → Trigger API call → See error state → Reconnect → Click retry → Success

**Acceptance Criteria:**
- [~] All Cypress integration tests pass (5 test flows)
- [~] Manual testing: Complete first-time user journey (signup to first job creation)
- [~] Manual testing: Complete returning user journey (login to dashboard usage)
- [~] Mobile testing: Test on iOS Safari and Android Chrome (responsive layouts work)
- [~] Theme testing: Toggle theme, verify persistence, verify all colors update
- [~] Error testing: Simulate network failure, verify error states, verify retry works
- [~] Environment config: All environment variables documented (.env.example)
- [~] Build verification: npm run build completes without errors, bundle size < 500KB gzipped
- [~] CI/CD pipeline: Tests run automatically on push to main branch
- [~] Rollback plan: Document how to rollback to previous version if issues
- [~] Smoke tests defined: 5 quick checks post-deployment (login works, dashboard loads, navigation works, theme toggle works, jobs load)

**Design Reference:** `design.md > Testing Strategy > Integration Testing Approach`
**Requirements Reference:** FR-041

**Verification:**
```bash
npm run test
npm run cypress:run
npm run build
# Deploy to staging → Run smoke tests → Verify all pass → Deploy to production
```

---

## Parallel Execution Opportunities

**Can work in parallel:**
- **Phase 1.1 (Foundation)**: All 6 tasks can be worked on simultaneously by different developers (Design Tokens, then components in parallel)
- **Phase 1.2 (Navigation) + Phase 1.4 (WelcomeModal)**: After 1.1 is done, TopNav and WelcomeModal can be developed in parallel (different developers)
- **Phase 1.3 individual components**: After base components (1.1) are done, WorkflowCard (1.3.1), JobCard (1.3.2), ChecklistItem (1.3.3) can be built in parallel
- **Phase 1.5 Testing tasks**: Unit tests (1.5.1), Property tests (1.5.2), Integration tests (1.5.3) can be written in parallel

**Must be sequential:**
- Phase 1.1 MUST complete before Phase 1.2, 1.3, 1.4 (foundation components needed)
- Individual component tasks (1.3.1-1.3.3) MUST complete before layout tasks (1.3.10)
- Dashboard layout (1.3.10) MUST complete before data loading (1.3.11)
- All implementation (1.1-1.4) MUST complete before final testing (1.5.3, 1.5.13)
- Performance (1.5.5) and Accessibility (1.5.4) can run after implementation but before Lighthouse audit (1.5.12)

---

## Risk Management

### High Risk Tasks

**Task 1.3.11 (Dashboard Data Loading & Caching)**
- **Risk:** Complex state management, race conditions, cache invalidation bugs
- **Impact:** Dashboard shows stale data, infinite loading, or crashes
- **Mitigation:**
  - Break into sub-tasks: Profile loading, Jobs loading, Stats calculation, Cache logic
  - Implement skeleton screens first (visual feedback while debugging)
  - Write extensive unit tests for data loading hook
  - Use React Query's built-in features (reduces custom logic)

**Task 1.5.5 (Performance Optimization)**
- **Risk:** Hitting 60fps with glassmorphism can be challenging on low-end devices
- **Impact:** Janky animations, poor user experience, low Lighthouse scores
- **Mitigation:**
  - Early performance testing (don't wait until end)
  - GPU acceleration (transform: translateZ(0), will-change hints)
  - Conditional rendering (disable effects on low-end devices if needed)
  - Fallback to solid backgrounds if backdrop-filter causes jank

**Task 1.5.3 (Integration Tests with Cypress)**
- **Risk:** Flaky tests due to timing issues, async operations, network conditions
- **Impact:** CI/CD pipeline fails intermittently, delays deployment
- **Mitigation:**
  - Use Cypress best practices (cy.wait for API responses, not arbitrary timeouts)
  - Seed database with consistent test data before each test
  - Mock API responses for deterministic behavior
  - Retry flaky tests 2-3 times before failing

### Dependencies on External Factors

**Backend API Availability**
- **Task 1.3.11 (Data Loading):** Requires backend endpoints /api/dashboard/*, /api/jobs/*, /api/checklist/*
- **Mitigation:** Mock API responses during development, coordinate with backend team on API contract

**Design Assets (Icons, Images)**
- **Task 1.5.10 (Visual QA):** Requires final icons, images, logos for design compliance check
- **Mitigation:** Use placeholder assets during development, finalize in last sprint

**Third-Party Libraries**
- **React Query, Framer Motion, Tailwind CSS:** Dependencies on external packages
- **Mitigation:** Lock dependency versions in package.json, test updates in separate branch before upgrading

---

## Success Criteria for Phase 1 Completion

Phase 1 is complete and ready for deployment when:

### Functional Completeness
- [~] All 49 tasks marked as complete
- [~] All P0 priority tasks verified and tested
- [~] 5-tab navigation (HOME, CLIENTS, JOBS, STUDIO, FINANCE) implemented and functional
- [~] HOME dashboard displays: Greeting, Workflow Cards, Checklist, Active Jobs, Finance Strip
- [~] WelcomeModal reduced to 3 steps, aligned with new navigation
- [~] All base components (GlassCard, StatusBadge, ProgressBar, etc.) created and reusable

### Quality & Testing
- [~] Unit test coverage ≥ 85% for all components
- [~] All 5 property-based tests passing (100+ cases each)
- [~] All 5 Cypress integration tests passing
- [~] Zero console errors or warnings in production build

### Performance
- [~] Lighthouse Performance score ≥ 95
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Time to Interactive (TTI) < 2.5s
- [~] Cumulative Layout Shift (CLS) < 0.1
- [~] All animations running at 60fps (no dropped frames)

### Accessibility
- [ ] Lighthouse Accessibility score = 100
- [ ] axe DevTools reports 0 violations
- [~] All interactive elements keyboard accessible
- [~] Screen reader compatible (tested with NVDA/VoiceOver)
- [~] Color contrast ratios ≥ 4.5:1 (body text), ≥ 3:1 (large text)

### Security
- [~] All user input sanitized (XSS prevention)
- [~] JWT tokens stored in httpOnly cookies
- [~] All API calls use HTTPS
- [~] No sensitive data logged to console
- [~] CSP headers implemented

### Design System Compliance
- [~] All components use design tokens (no hardcoded colors/spacing)
- [~] Glassmorphism effect applied consistently (backdrop-filter: blur(20px))
- [~] Border radius standardized (24px for cards, 12px for buttons)
- [~] Typography hierarchy correct (Frame Display headings, DM Sans body)
- [~] Spacing system used consistently (sm, md, lg, xl, 2xl)

### Browser Compatibility
- [~] Tested and working on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- [~] Mobile responsive: iOS Safari, Android Chrome
- [~] Glassmorphism fallbacks work in unsupported browsers

### Documentation
- [~] README.md complete with architecture, setup, testing instructions
- [~] All components documented with TypeScript interfaces
- [~] Storybook stories created for all base components
- [~] API endpoints documented

### Deployment Readiness
- [~] Production build completes without errors
- [~] Bundle size < 500KB gzipped
- [~] Environment variables documented (.env.example)
- [~] CI/CD pipeline configured and passing
- [~] Rollback plan documented
- [~] Smoke tests defined and verified

### Business Metrics Tracking Setup
- [~] Analytics events configured for: Studio IA tab clicks, job creation, onboarding completion
- [~] Dashboard data points logged for future analysis: Time to first job, navigation patterns

---

## Post-Phase 1: Next Steps

After Phase 1 completion, the platform will have:
✅ Clear 5-tab navigation with Studio IA always visible
✅ Storytelling HOME dashboard guiding user workflow
✅ Glassmorphism aesthetic establishing visual identity
✅ 3-step onboarding aligned with new structure
✅ Foundation component library for future phases

**Phase 2** will focus on:
- CLIENTS page: Visual card grid, client details, job history
- JOBS page: Kanban board with drag-and-drop, status transitions
- Enhanced job creation flow with step-by-step wizard
- Client-to-job workflow integration

**Phase 3** will address:
- STUDIO page: AI tools grid by category, context selection
- Integration of existing Studio IA tools into new structure
- Quota indicators, usage tracking
- Free Chat Assistant at bottom

**Phase 4** will complete:
- FINANCE page: Revenue dashboard, charts, job/proposal lists
- Mobile app refinements (PWA or native)
- Advanced features: Collaboration, notifications center, command palette enhancements

---

**END OF TASKS DOCUMENT**

**Total Tasks:** 49
**Estimated Total Time:** 110-130 hours (14-17 developer-days at 8 hours/day)
**Timeline:** 2.5-3.5 weeks with 2-3 developers (including 1 backend developer) working in parallel

**Ready for implementation?** 🚀
