# Requirements Document

## Introduction

Phase 1 (Foundation) of the Cena Studio Platform rebrand establishes the core navigation structure, visual storytelling dashboard, and Liquid Glass aesthetic. This phase transforms a confusing platform where Studio IA is hidden and users get lost into an intuitive workflow-guided experience with 5 clear tabs (HOME, CLIENTS, JOBS, STUDIO, FINANCE), a storytelling HOME dashboard, a 3-step onboarding flow, and foundational glass-morphism components.

**Business Value**: Reduce user abandonment from 50% to 30% on day 1, increase Studio IA discovery from 20% to 80%+, decrease time to first job from 15 minutes to < 5 minutes.

**Technical Scope**: React 18 frontend with TypeScript, Tailwind CSS for styling, glassmorphism effects with backdrop-filter, Zustand for state management, React Query for data fetching.

### Goals and Success Criteria

### Primary Goals

1. **Simplify Navigation**: Reduce navigation items from 7+ to 5 clear tabs with Studio IA always visible
2. **Visual Storytelling**: Transform generic dashboard into workflow-guided experience showing user journey
3. **Establish Visual Identity**: Implement Liquid Glass aesthetic (glassmorphism + 24-32px rounded borders)
4. **Improve Onboarding**: Create 3-step WelcomeModal aligned with new navigation structure
5. **Build Foundation**: Create reusable component library for subsequent phases

### Success Criteria

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Studio IA Discovery | 20% | 80%+ | % users who click Studio tab in first 7 days |
| First Job Completion | 50% | 70%+ | % new users who create job on day 1 |
| Time to First Job | 15 min | < 5 min | Average time from signup to job creation |
| Day 1 Abandonment | 50% | 30% | % users who never return after first day |
| Navigation Clicks to Job | 7+ | 2 | Click count from HOME to job creation |
| Lighthouse Score | N/A | 95+ | Performance, accessibility, best practices |

## Glossary

- **TopNav**: Top navigation bar component containing the 5 main navigation tabs
- **Liquid Glass**: Design aesthetic combining glassmorphism effects with rounded borders (24-32px)
- **WorkflowCard**: Dashboard component displaying key metrics (Active Jobs, Clients Waiting, etc.)
- **WelcomeModal**: Onboarding modal that appears on first user login
- **Studio IA**: AI tools section of the platform for content generation and assistance

## Requirements

### User Stories

#### Navigation & Structure

### US-001: See All Main Sections at Once
**As a** filmmaker using Cena Studio
**I want** all main navigation options visible in the top bar
**So that** I can understand what the platform offers and navigate directly without hunting for features

**Acceptance Criteria:**
- [ ] TopNav displays exactly 5 tabs: HOME, CLIENTS, JOBS, STUDIO, FINANCE
- [ ] All tabs are visible without dropdown or "MORE" menu
- [ ] Active tab is highlighted with orange underline
- [ ] Icons accompany tab labels for quick scanning
- [ ] Navigation remains fixed at top during scroll

**Design Reference:** `design.md > Components and Interfaces > 1. TopNav Component`
**Priority:** P0

---

### US-002: Access Studio IA Directly
**As a** filmmaker
**I want** Studio IA to be a top-level navigation item
**So that** I can discover and use AI tools without exploring hidden menus

**Acceptance Criteria:**
- [ ] STUDIO tab is visible in main navigation (4th position)
- [ ] Tab labeled "STUDIO" with 🤖 icon
- [ ] Clicking opens Studio IA tools page
- [ ] No "MORE" menu exists in navigation
- [ ] Studio remains accessible from all pages

**Design Reference:** `design.md > Architecture > Navigation Flow Diagram`
**Priority:** P0

---

### US-003: Understand My Current Location
**As a** user navigating the platform
**I want** clear visual indication of which section I'm in
**So that** I don't get lost or confused about my location

**Acceptance Criteria:**
- [ ] Active tab has 2px orange underline (#FF6B00)
- [ ] Active tab text is bold weight
- [ ] Only one tab is active at a time
- [ ] URL path matches active tab (e.g., `/jobs` → JOBS active)
- [ ] Browser back button updates active tab correctly

**Design Reference:** `design.md > Components and Interfaces > 1. TopNav Component`
**Priority:** P0

---

### US-004: Quick Navigation with Keyboard
**As a** power user
**I want** keyboard shortcuts for navigation
**So that** I can work faster without reaching for the mouse

**Acceptance Criteria:**
- [ ] Cmd+K (Mac) / Ctrl+K (Windows) opens search/command palette
- [ ] Search palette shows all 5 main sections
- [ ] Typing filters navigation options
- [ ] Enter key navigates to selected section
- [ ] Esc key closes search palette

**Design Reference:** `design.md > Components and Interfaces > 1. TopNav Component > Visual Wireframe`
**Priority:** P1

---

### HOME Dashboard Stories

### US-005: See Daily Overview on Login
**As a** filmmaker starting my workday
**I want** a personalized greeting and summary of pending actions
**So that** I immediately know what needs my attention today

**Acceptance Criteria:**
- [ ] Greeting displays user name (e.g., "Bom dia, Does!")
- [ ] Greeting changes by time of day (Bom dia/Boa tarde/Boa noite)
- [ ] Summary shows count of pending actions (e.g., "3 ações pendentes")
- [ ] Greeting section appears at top of HOME page
- [ ] Updates dynamically without page refresh

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Visual Wireframe`
**Priority:** P0

---

### US-006: Access Key Metrics Quickly
**As a** filmmaker
**I want** four workflow cards showing my key numbers
**So that** I can quickly understand my workload and click through to details

**Acceptance Criteria:**
- [ ] Four workflow cards display: Active Jobs, Clients Waiting, Reviews Pending, Studio Tools
- [ ] Each card shows large number (count) and descriptive label
- [ ] Cards use glassmorphism styling with backdrop-blur
- [ ] Clicking card navigates to relevant section
- [ ] Cards animate in with staggered entrance (50ms delay each)

**Design Reference:** `design.md > Components and Interfaces > 3. WorkflowCard Component`
**Priority:** P0

---

### US-007: Manage Daily Tasks
**As a** filmmaker
**I want** a checklist of today's tasks on the HOME dashboard
**So that** I can track what I need to complete without opening separate tools

**Acceptance Criteria:**
- [ ] Checklist column displays on left side (30% width)
- [ ] Shows up to 10 pending tasks/items
- [ ] Each item has checkbox, text, and optional link
- [ ] Checking item marks as complete and applies strikethrough
- [ ] "+ Adicionar" button allows adding new checklist items
- [ ] Checklist persists across sessions
- [ ] API integration retrieves tasks from backend (GET /api/tasks)
- [ ] Checking task updates backend with optimistic UI (PATCH /api/tasks/:id)
- [ ] Adding task creates record in backend (POST /api/tasks)
- [ ] Deleting task removes from backend (DELETE /api/tasks/:id)
- [ ] Failed API calls show error toast with "Tentar Novamente" button
- [ ] Optimistic updates rollback if API confirmation fails

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Layout Structure`
**Priority:** P0

---

### US-008: View Active Jobs at Glance
**As a** filmmaker
**I want** my active jobs displayed as cards on the HOME dashboard
**So that** I can see status, deadlines, and take quick actions without navigating away

**Acceptance Criteria:**
- [ ] Active jobs column displays on right side (70% width)
- [ ] Shows up to 6 job cards (more available via scroll)
- [ ] Each job card displays: title, client, status, deadline, days left, progress bar
- [ ] Urgent jobs (< 3 days) show red indicator
- [ ] Quick action buttons: [Briefing] [Review] [Hub]
- [ ] Clicking card opens job details page

**Design Reference:** `design.md > Components and Interfaces > 4. JobCard Component`
**Priority:** P0

---

### US-009: Monitor Financial Health
**As a** studio owner
**I want** a financial summary strip at the bottom of HOME
**So that** I can see monthly revenue and completed jobs without opening the finance section

**Acceptance Criteria:**
- [ ] Finance strip displays at bottom of HOME page
- [ ] Shows monthly revenue in BRL format (e.g., "R$ 12.500")
- [ ] Shows count of completed jobs this month
- [ ] Includes link "→ Ver Finance" to full financial dashboard
- [ ] Updates automatically when jobs are marked as delivered

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Visual Wireframe`
**Priority:** P0

---

### US-010: Create New Job from HOME
**As a** filmmaker on the HOME dashboard
**I want** a prominent "Novo Job" button
**So that** I can start a new project in 1-2 clicks without navigating to JOBS section

**Acceptance Criteria:**
- [ ] "+ NOVO JOB" button appears in Active Jobs section
- [ ] Button uses glass styling with orange accent
- [ ] Clicking opens job creation modal/form
- [ ] Modal pre-fills user context (date, default status)
- [ ] Created job appears in Active Jobs list immediately

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Visual Wireframe`
**Priority:** P0

---

### Onboarding Stories

### US-011: Complete Guided Onboarding
**As a** new user logging in for the first time
**I want** a step-by-step introduction to the platform
**So that** I understand how to use Cena Studio without feeling overwhelmed

**Acceptance Criteria:**
- [ ] WelcomeModal appears automatically on first login
- [ ] Modal displays 3 steps with progress indicators (dots)
- [ ] Step 1: Welcome message explaining platform purpose
- [ ] Step 2: Visual map of 5 navigation tabs
- [ ] Step 3: Workflow explanation with action buttons
- [ ] User can advance with "Next" button
- [ ] User can go back with "Back" button (from steps 2-3)
- [ ] Modal has glassmorphism backdrop (blur background)

**Design Reference:** `design.md > Components and Interfaces > 5. WelcomeModal Component`
**Priority:** P0

---

### US-012: Skip Onboarding if Desired
**As a** experienced user or someone in a hurry
**I want** the option to skip the onboarding tour
**So that** I can start using the platform immediately

**Acceptance Criteria:**
- [ ] "PULAR TOUR" button visible on all 3 steps
- [ ] Clicking skip closes modal and saves preference
- [ ] User preference "welcomeModalSkipped" saved to database
- [ ] Skipped modal doesn't reappear on subsequent logins
- [ ] User can access onboarding later from settings/help

**Design Reference:** `design.md > Components and Interfaces > 5. WelcomeModal Component > Responsibilities`
**Priority:** P0

---

### US-013: Never See Onboarding Again
**As a** returning user who completed onboarding
**I want** the option to never see the welcome modal again
**So that** I'm not annoyed by repeated prompts

**Acceptance Criteria:**
- [ ] "Nunca mostrar novamente" checkbox on final step
- [ ] Checking box before completion saves "neverShowWelcome" preference
- [ ] Preference persists in user profile
- [ ] Modal never shows again for that user
- [ ] Unchecked by default (requires explicit opt-out)

**Design Reference:** `design.md > Algorithmic Pseudocode > WelcomeModal Progression Algorithm`
**Priority:** P0

---

### US-014: Quick Start with Demo Job
**As a** new user wanting to explore features
**I want** option to create a demo job with pre-filled data
**So that** I can see how the platform works without entering real information

**Acceptance Criteria:**
- [ ] "Criar Job Demo" button appears on Step 3 of onboarding
- [ ] Clicking creates demo job with sample data (client, title, status, deadline)
- [ ] Demo job is marked/tagged as "Demo" or "Sample"
- [ ] User can edit or delete demo job later
- [ ] Demo job appears in Active Jobs on HOME dashboard

**Design Reference:** `design.md > Components and Interfaces > 5. WelcomeModal Component > Visual Design - Step 3`
**Priority:** P1

---

### Visual Design Stories

### US-015: Experience Liquid Glass Aesthetic
**As a** user navigating the platform
**I want** UI elements with modern glassmorphism effect
**So that** the platform feels premium and visually cohesive

**Acceptance Criteria:**
- [ ] All cards use backdrop-filter: blur(20px) or blur(30px)
- [ ] Glass components have semi-transparent backgrounds (rgba with 0.6-0.7 alpha)
- [ ] Border radius is 24px (xl) or 32px (2xl) for standard cards
- [ ] Subtle borders use rgba with low opacity (0.08-0.18)
- [ ] Glass effects work in Chrome, Safari, Firefox, Edge

**Design Reference:** `design.md > Components and Interfaces > 6. Base Glass Components`
**Priority:** P0

---

### US-016: See Smooth Animations
**As a** user interacting with UI elements
**I want** smooth transitions and hover effects
**So that** the platform feels responsive and polished

**Acceptance Criteria:**
- [ ] Cards lift on hover (translateY -4px) with 300ms ease-out transition
- [ ] Workflow cards animate in with staggered entrance (50ms delay per card)
- [ ] Page transitions use fade + slide (opacity 0→1, translateY 20px→0)
- [ ] All animations respect prefers-reduced-motion media query
- [ ] Animations run at 60fps (16.67ms per frame)

**Design Reference:** `design.md > Visual Design System Specifications > Animation System`
**Priority:** P0

---

### US-017: Identify Job Status Visually
**As a** user viewing job cards
**I want** color-coded borders and status badges
**So that** I can instantly recognize job status without reading text

**Acceptance Criteria:**
- [ ] Briefing jobs have yellow border (#f59e0b)
- [ ] Production jobs have orange border (#FF6B00)
- [ ] Review jobs have blue border (#3b82f6)
- [ ] Delivered jobs have green border (#10b981)
- [ ] Urgent jobs (< 3 days to deadline) show 🔴 red indicator
- [ ] Status colors are consistent across all UI elements

**Design Reference:** `design.md > Components and Interfaces > 4. JobCard Component > Visual Design`
**Priority:** P0

---

### US-018: Distinguish Element Importance
**As a** user scanning the interface
**I want** clear visual hierarchy through typography
**So that** I can identify important information quickly

**Acceptance Criteria:**
- [ ] Page titles use 2.5rem font size with bold weight
- [ ] Section titles use 2rem font size
- [ ] Card titles use 1.5rem font size with semibold weight
- [ ] Body text uses 1rem font size with regular weight
- [ ] Labels use 0.75rem uppercase with 600 weight
- [ ] Consistent font families: Frame Display (headings), DM Sans (body)

**Design Reference:** `design.md > Visual Design System Specifications > Typography System`
**Priority:** P0

---

### Component Functionality Stories

### US-019: View Job Progress Visually
**As a** user monitoring jobs
**I want** progress bars showing completion percentage
**So that** I can see how close jobs are to completion at a glance

**Acceptance Criteria:**
- [ ] Progress bar displays in each job card
- [ ] Bar fills from 0% to 100% based on job.progress value
- [ ] Bar height is 8px with 999px border radius (pill shape)
- [ ] Bar color matches job status (briefing=yellow, production=orange, etc.)
- [ ] Percentage label appears next to bar (e.g., "80%")
- [ ] Bar animates smoothly when progress updates (500ms ease-out)

**Design Reference:** `design.md > Components and Interfaces > 4. JobCard Component > Pseudo-code`
**Priority:** P0

---

### US-020: Take Quick Actions on Jobs
**As a** user managing jobs from HOME dashboard
**I want** quick action buttons on job cards
**So that** I can access briefings, reviews, and hub without multiple clicks

**Acceptance Criteria:**
- [ ] Each job card has 3 buttons: [Briefing] [Review] [Hub]
- [ ] Buttons use ghost style (transparent with border)
- [ ] Clicking Briefing opens briefing document for that job
- [ ] Clicking Review opens review/approval interface
- [ ] Clicking Hub opens job detail page
- [ ] Buttons prevent card click event from firing

**Design Reference:** `design.md > Components and Interfaces > 4. JobCard Component > Visual Design`
**Priority:** P0

---

### US-021: See Subscription Plan Status
**As a** user
**I want** my current plan displayed in the navigation
**So that** I'm aware of my subscription level and can upgrade if needed

**Acceptance Criteria:**
- [ ] Plan indicator appears in TopNav user menu area
- [ ] Shows badge with plan name: "Free ⚡", "Pro 💎", or "Studio 🏢"
- [ ] Badge uses appropriate icon for each plan
- [ ] Clicking badge opens plan comparison/upgrade page
- [ ] Badge is visible on all pages

**Design Reference:** `design.md > Components and Interfaces > 1. TopNav Component > Visual Wireframe`
**Priority:** P1

---

### US-022: Toggle Theme Preference
**As a** user with theme preferences
**I want** to switch between light and dark modes
**So that** I can use the platform comfortably in different lighting conditions

**Acceptance Criteria:**
- [ ] Theme toggle button appears in TopNav or user menu
- [ ] Clicking toggles between light and dark themes
- [ ] Theme preference saves to user profile
- [ ] Theme persists across browser sessions
- [ ] All glass components adapt colors to theme (light: white bg, dark: black bg)
- [ ] Text colors invert appropriately (dark text on light, light text on dark)

**Design Reference:** `design.md > Visual Design System Specifications > Color System`
**Priority:** P1

---

### Data & State Stories

### US-023: Retrieve Task List from Backend
**As a** user loading the HOME dashboard
**I want** my checklist items fetched from the backend
**So that** my tasks persist and sync across devices

**Acceptance Criteria:**
- [ ] GET /api/tasks endpoint returns list of user's checklist items
- [ ] Response includes: task id, text, checked status, optional link, creation date
- [ ] API validates authentication token (userId from JWT)
- [ ] Returns only tasks belonging to authenticated user
- [ ] Response time < 200ms for typical user (< 50 tasks)
- [ ] Supports pagination with query params ?page=1&limit=10 (for future growth)
- [ ] Empty task list returns 200 with empty array (not 404)
- [ ] Failed authentication returns 401 with error message

**Design Reference:** New API requirement for task management
**Priority:** P0

---

### US-024: Update Task Status or Content
**As a** user editing a checklist item
**I want** changes saved to the backend
**So that** my edits persist and sync across devices

**Acceptance Criteria:**
- [ ] PATCH /api/tasks/:id endpoint updates task fields
- [ ] Supports partial updates (can update only checked status, only text, or both)
- [ ] Request body accepts: { checked?: boolean, text?: string, link?: string }
- [ ] Returns updated task object on success (200 status)
- [ ] Validates task ownership: user can only update their own tasks (403 if violation)
- [ ] Response time < 150ms
- [ ] Invalid task ID returns 404 with error message
- [ ] Validation errors (e.g., text too long) return 400 with descriptive message
- [ ] Failed authentication returns 401

**Design Reference:** New API requirement for task management
**Priority:** P0

---

### US-025: Create New Checklist Item
**As a** user adding a task
**I want** the new task saved to the backend
**So that** it persists and syncs across devices

**Acceptance Criteria:**
- [ ] POST /api/tasks endpoint creates new checklist item
- [ ] Request body requires: { text: string }, optional: { link?: string }
- [ ] Text validation: 3-200 characters, required
- [ ] Link validation: valid URL format if provided (optional)
- [ ] Returns created task object with generated id (201 status)
- [ ] Rate limit: 50 tasks per user per day (429 status if exceeded)
- [ ] New task defaults: checked=false, createdAt=now, userId=authenticated user
- [ ] Duplicate text allowed (no uniqueness constraint)
- [ ] Failed authentication returns 401

**Design Reference:** New API requirement for task management
**Priority:** P0

---

### US-026: Delete Checklist Item
**As a** user removing a task
**I want** the task deleted from the backend
**So that** it no longer appears on any device

**Acceptance Criteria:**
- [ ] DELETE /api/tasks/:id endpoint deletes checklist item
- [ ] Validates task ownership: user can only delete their own tasks (403 if violation)
- [ ] Soft delete: marks task as deleted (deletedAt timestamp), doesn't remove from database
- [ ] Returns success confirmation (200 or 204 status)
- [ ] Invalid task ID returns 404 with error message
- [ ] Already-deleted task returns 404 (soft-deleted tasks not accessible)
- [ ] Failed authentication returns 401
- [ ] Deleted tasks excluded from GET /api/tasks response

**Design Reference:** New API requirement for task management
**Priority:** P0

---

### US-027: See Real-Time Dashboard Updates
**As a** user working in the platform
**I want** the dashboard to update automatically when data changes
**So that** I always see current information without manual refresh

**Acceptance Criteria:**
- [ ] Dashboard polls for updates every 30 seconds (when tab is active)
- [ ] Creating new job adds it to Active Jobs list immediately (optimistic update)
- [ ] Marking checklist item complete updates UI instantly
- [ ] Changing job status updates card border color without page reload
- [ ] Finance strip recalculates when job status changes to "delivered"

**Design Reference:** `design.md > Algorithmic Pseudocode > HOME Dashboard Data Loading Algorithm`
**Priority:** P0

---

### US-028: Load Dashboard Data Efficiently
**As a** user opening the HOME page
**I want** data to load quickly with visual feedback
**So that** I don't stare at a blank screen or spinner

**Acceptance Criteria:**
- [ ] Skeleton screens display immediately (< 100ms)
- [ ] All dashboard sections load in parallel (Promise.all)
- [ ] Cached data displays first (if available and < 5 minutes old)
- [ ] Fresh data loads in background and updates UI
- [ ] Total load time < 2 seconds for fresh data
- [ ] Total load time < 500ms for cached data

**Design Reference:** `design.md > Performance Considerations > Data Loading Performance`
**Priority:** P0

---

### US-029: Recover from Failed Data Load
**As a** user encountering network issues
**I want** clear error messages and retry options
**So that** I can recover without technical knowledge

**Acceptance Criteria:**
- [ ] Failed requests retry once automatically (exponential backoff)
- [ ] After 2 failures, show error state with "Tentar Novamente" button
- [ ] Error message: "Não foi possível carregar os dados do dashboard"
- [ ] Clicking retry button reloads data
- [ ] Fallback to cached data if available (max 1 hour old)
- [ ] Errors logged to monitoring service (Sentry/equivalent)

**Design Reference:** `design.md > Error Handling > Error Scenario 1`
**Priority:** P0

---

### US-030: Calculate Workflow Statistics Accurately
**As a** user relying on dashboard metrics
**I want** workflow card counts to be mathematically accurate
**So that** I can trust the numbers for decision-making

**Acceptance Criteria:**
- [ ] Active Jobs = count of jobs with status in [briefing, production, review]
- [ ] Clients Waiting = distinct count of clientIds with jobs in [proposal, briefing]
- [ ] Reviews Pending = count of jobs with status = review
- [ ] Finance strip revenue = sum of budgets where status = delivered AND current month
- [ ] All counts are non-negative integers
- [ ] Counts update when underlying data changes

**Design Reference:** `design.md > Data Models > WorkflowStats Model > Calculation Logic`
**Priority:** P0

---

### Accessibility Stories

### US-031: Navigate with Keyboard Only
**As a** user who relies on keyboard navigation
**I want** all interactive elements accessible via Tab key
**So that** I can use the platform without a mouse

**Acceptance Criteria:**
- [ ] All buttons, links, and cards are keyboard focusable
- [ ] Focus order follows logical reading order (top to bottom, left to right)
- [ ] Focus indicator is visible (outline or highlight)
- [ ] Tab cycles through navigation tabs
- [ ] Enter key activates focused button/link
- [ ] Esc key closes modals and dropdowns

**Design Reference:** `design.md > Testing Strategy > Component Functionality Stories`
**Priority:** P0

---

### US-032: Screen Reader Compatibility
**As a** user with visual impairment using screen reader
**I want** semantic HTML and ARIA labels
**So that** I can understand and navigate the platform

**Acceptance Criteria:**
- [ ] Navigation uses <nav> semantic element with aria-label="Main navigation"
- [ ] Job cards have aria-label describing status and deadline
- [ ] Workflow cards have aria-label with count and section name
- [ ] Progress bars have aria-valuenow, aria-valuemin, aria-valuemax
- [ ] Modal has aria-modal="true" and aria-labelledby pointing to title
- [ ] Status badges have aria-label explaining status type

**Design Reference:** `design.md > Implementation Phases > Phase 1.4 > Implement accessibility features`
**Priority:** P0

---

### US-033: Respect Reduced Motion Preference
**As a** user sensitive to motion or with vestibular disorders
**I want** animations disabled when I set reduced motion preference
**So that** I can use the platform without discomfort

**Acceptance Criteria:**
- [ ] Platform detects prefers-reduced-motion: reduce media query
- [ ] All animations disabled when preference is set
- [ ] Transitions instant (transition: none)
- [ ] Backdrop-filter may remain (doesn't cause motion sickness)
- [ ] Page still functions fully without animations

**Design Reference:** `design.md > Performance Considerations > Rendering Performance`
**Priority:** P0

---

### US-034: Use in Various Lighting Conditions
**As a** user working in bright or dark environments
**I want** appropriate contrast ratios for readability
**So that** I can see text and UI elements clearly

**Acceptance Criteria:**
- [ ] Light theme: text contrast ratio ≥ 4.5:1 for body text
- [ ] Light theme: text contrast ratio ≥ 3:1 for large text (18pt+)
- [ ] Dark theme: maintains same contrast ratios
- [ ] Orange accent (#FF6B00) passes contrast on white and black backgrounds
- [ ] Status badge text is readable on colored backgrounds

**Design Reference:** `design.md > Visual Design System Specifications > Color System`
**Priority:** P0

---

## Functional Requirements

### Navigation Requirements

### FR-001: TopNav Fixed Positioning
**Description:** Top navigation bar must remain visible and accessible at all times during scroll.

**Design Reference:** `design.md > Components and Interfaces > 1. TopNav Component > Responsibilities`

**Priority:** P0

**Acceptance Criteria:**
- [ ] TopNav has position: fixed or position: sticky CSS
- [ ] Z-index ensures nav appears above all page content
- [ ] Scroll behavior maintains nav at top of viewport
- [ ] Nav doesn't overlap critical page content
- [ ] Works across all supported browsers

---

### FR-002: Unique Active Tab State
**Description:** System must ensure exactly one navigation tab is marked as active at any time.

**Design Reference:** `design.md > Correctness Properties > Universal Quantification Statements > 1. Navigation Uniqueness Property`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Navigation state management enforces single active tab
- [ ] Tab activation removes active state from other tabs
- [ ] Route changes trigger active tab update
- [ ] Direct URL navigation sets correct active tab
- [ ] Browser back/forward buttons update active tab
- [ ] Unit tests verify ∀ navigationState, ∃! tab where tab.isActive = true

---

### FR-003: Route-Based Tab Activation
**Description:** Active tab must be determined by extracting tab identifier from current URL path.

**Design Reference:** `design.md > Algorithmic Pseudocode > Navigation State Management Algorithm`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Path `/home` activates HOME tab
- [ ] Path `/clients` activates CLIENTS tab
- [ ] Path `/jobs` activates JOBS tab
- [ ] Path `/studio` activates STUDIO tab
- [ ] Path `/finance` activates FINANCE tab
- [ ] Invalid paths default to HOME tab
- [ ] Nested paths (e.g., `/jobs/123`) activate parent tab
- [ ] Algorithm implementation matches pseudocode: `extractTabIdFromPath(path)`

---

### FR-004: Navigation State Persistence
**Description:** Active navigation state must persist correctly during page transitions and browser navigation.

**Design Reference:** `design.md > Algorithmic Pseudocode > Navigation State Management Algorithm > Loop Invariants`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Page refresh maintains correct active tab
- [ ] Browser back button updates active tab
- [ ] Browser forward button updates active tab
- [ ] Deep links open correct tab (e.g., sharing `/jobs` URL)
- [ ] Tab state syncs with URL without full page reload

---

### FR-005: Search Command Palette
**Description:** Keyboard shortcut (Cmd+K / Ctrl+K) must open search interface for quick navigation.

**Design Reference:** `design.md > Components and Interfaces > 1. TopNav Component > State Management`

**Priority:** P1

**Acceptance Criteria:**
- [ ] Cmd+K on Mac opens search modal
- [ ] Ctrl+K on Windows/Linux opens search modal
- [ ] Modal displays all 5 navigation sections
- [ ] Typing filters options in real-time
- [ ] Enter key navigates to selected option
- [ ] Esc key closes modal
- [ ] Search works from any page

---

### HOME Dashboard Requirements

### FR-006: Dynamic Greeting Generation
**Description:** HOME dashboard must display personalized greeting with time-based salutation.

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Responsibilities`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Greeting includes user's first name (e.g., "Bom dia, Does!")
- [ ] Time-based salutation: "Bom dia" (6am-12pm), "Boa tarde" (12pm-6pm), "Boa noite" (6pm-6am)
- [ ] Greeting updates on each page load
- [ ] Fallback to "Olá" if time detection fails
- [ ] Summary line shows count of pending actions (e.g., "Você tem 3 ações pendentes")

---

### FR-007: Workflow Cards Data Binding
**Description:** Workflow cards must display accurate real-time counts from user data.

**Design Reference:** `design.md > Components and Interfaces > 3. WorkflowCard Component > Interface`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Card 1: Active Jobs = count of jobs with status in [briefing, production, review]
- [ ] Card 2: Clients Waiting = distinct clientIds with jobs in [proposal, briefing]
- [ ] Card 3: Reviews Pending = count of jobs with status = review
- [ ] Card 4: Studio Tools = static link to Studio section
- [ ] Counts update when underlying data changes
- [ ] All counts are non-negative integers
- [ ] Zero values display "0" (not hidden)

---

### FR-008: Workflow Card Navigation
**Description:** Clicking workflow card must navigate user to relevant section with context preservation.

**Design Reference:** `design.md > Components and Interfaces > 3. WorkflowCard Component > Responsibilities`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Clicking "JOBS ATIVOS" card navigates to /jobs
- [ ] Clicking "CLIENTS AGUARDANDO" card navigates to /clients with filter applied
- [ ] Clicking "REVIEWS PENDENTES" card navigates to /jobs with review filter
- [ ] Clicking "STUDIO FERRAMENTAS" card navigates to /studio
- [ ] Navigation preserves user context (scroll position on back button)
- [ ] Card click registered with analytics

---

### FR-009: Checklist CRUD Operations
**Description:** Users must be able to create, read, update, and delete checklist items from HOME dashboard.

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Responsibilities`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Display existing checklist items (up to 10 visible)
- [ ] "+ Adicionar" button opens input field for new item
- [ ] User can type text (3-200 characters) and press Enter to create
- [ ] Clicking checkbox marks item as complete (visual strikethrough)
- [ ] Completed items remain visible with 50% opacity
- [ ] Optional: Delete button appears on hover
- [ ] Checklist data persists to database
- [ ] Optimistic UI updates before server confirmation

---

### FR-010: Job Card Status Visualization
**Description:** Job cards must display status via color-coded borders and status badges.

**Design Reference:** `design.md > Components and Interfaces > 4. JobCard Component > Visual Design`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Border color mapping: briefing=#f59e0b, production=#FF6B00, review=#3b82f6, delivered=#10b981
- [ ] Border width is 2px solid
- [ ] Border color changes immediately when status updates
- [ ] Status badge displays status name with appropriate color
- [ ] Color scheme is consistent across light and dark themes

---

### FR-011: Urgency Calculation and Display
**Description:** System must automatically calculate job urgency based on deadline and display visual indicator.

**Design Reference:** `design.md > Data Models > Job Model > Business Logic > calculateUrgency`

**Priority:** P0

**Acceptance Criteria:**
- [ ] `urgent` field auto-calculated: true if daysLeft < 3, else false
- [ ] `daysLeft` = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24))
- [ ] Urgent jobs display 🔴 red indicator next to deadline
- [ ] Deadline text color changes to red (#ef4444) when urgent
- [ ] Calculation runs on each dashboard load and every 60 seconds
- [ ] Property-based test verifies: ∀ job, job.urgent = true ⟺ job.daysLeft < 3

---

### FR-012: Progress Bar Rendering
**Description:** Job cards must display progress bar with accurate percentage fill.

**Design Reference:** `design.md > Components and Interfaces > 4. JobCard Component > Pseudo-code`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Progress bar height is 8px
- [ ] Border radius is 999px (pill shape)
- [ ] Fill percentage matches job.progress value (0-100)
- [ ] Bar color matches job status color
- [ ] Percentage label displays next to bar (e.g., "80%")
- [ ] Bar animates smoothly on progress update (500ms ease-out)
- [ ] Progress value constrained: 0 ≤ progress ≤ 100

---

### FR-013: Finance Strip Calculation
**Description:** Finance summary strip must aggregate revenue and job count for current month.

**Design Reference:** `design.md > Components and Interfaces > 2. HOME Dashboard Component > Layout Structure`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Monthly revenue = SUM(job.budget) WHERE status='delivered' AND MONTH(updatedAt)=currentMonth
- [ ] Jobs completed = COUNT(jobs) WHERE status='delivered' AND MONTH(updatedAt)=currentMonth
- [ ] Display format: "R$ 12.500 este mês • 3 jobs faturados"
- [ ] Currency defaults to BRL (user preference override possible)
- [ ] Updates automatically when job status changes to delivered
- [ ] Link "→ Ver Finance" navigates to /finance

---

### FR-014: Active Jobs Pagination
**Description:** Active Jobs section must display limited number of jobs with scroll for performance.

**Design Reference:** `design.md > Performance Considerations > Data Loading Performance > Pagination`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Initial load shows 6 most recent active jobs
- [ ] Jobs ordered by deadline (soonest first)
- [ ] Scroll container has max-height with overflow-y: auto
- [ ] Loading more jobs fetches next 6 (infinite scroll or "Load More" button)
- [ ] Skeleton placeholders shown during load
- [ ] Empty state message if no active jobs exist

---

### API Requirements

### FR-015: Task List Retrieval API
**Description:** Backend API endpoint must return authenticated user's checklist items with efficient query and pagination support.

**Design Reference:** US-023, US-007 - Task management for HOME dashboard

**Priority:** P0

**Acceptance Criteria:**
- [ ] Endpoint: GET /api/tasks (or GET /api/checklist)
- [ ] Authentication: Validates JWT token, extracts userId
- [ ] Authorization: Returns only tasks where task.userId = authenticated userId
- [ ] Response format: JSON array of task objects
- [ ] Task object schema: { id: string, text: string, checked: boolean, link?: string, createdAt: Date, updatedAt: Date }
- [ ] Query params: ?page=1&limit=10 (pagination support)
- [ ] Default limit: 10 tasks per page
- [ ] Ordering: Most recent first (ORDER BY createdAt DESC)
- [ ] Response time: < 200ms for typical user (< 50 total tasks)
- [ ] Empty result: Returns 200 status with empty array []
- [ ] Error responses: 401 (unauthorized), 500 (server error)
- [ ] Soft-deleted tasks excluded from results (WHERE deletedAt IS NULL)

---

### FR-016: Task Update API
**Description:** Backend API endpoint must update task fields with ownership validation and partial update support.

**Design Reference:** US-024, US-007 - Task editing for HOME dashboard

**Priority:** P0

**Acceptance Criteria:**
- [ ] Endpoint: PATCH /api/tasks/:id (or PUT /api/tasks/:id)
- [ ] Authentication: Validates JWT token, extracts userId
- [ ] Authorization: Verifies task.userId = authenticated userId (403 Forbidden if mismatch)
- [ ] Request body: JSON with optional fields { checked?: boolean, text?: string, link?: string }
- [ ] Partial updates: Only provided fields are updated, others remain unchanged
- [ ] Text validation: If provided, 3-200 characters
- [ ] Link validation: If provided, valid URL format (regex or URL parser)
- [ ] Response: Updated task object (200 status)
- [ ] updatedAt field: Automatically set to current timestamp
- [ ] Response time: < 150ms
- [ ] Error responses: 400 (validation error), 401 (unauthorized), 403 (forbidden), 404 (task not found), 500 (server error)
- [ ] Error messages: Descriptive and user-friendly (e.g., "Texto deve ter entre 3 e 200 caracteres")

---

### FR-017: Task Creation API
**Description:** Backend API endpoint must create new checklist items with validation and rate limiting.

**Design Reference:** US-025, US-007 - Task creation for HOME dashboard

**Priority:** P0

**Acceptance Criteria:**
- [ ] Endpoint: POST /api/tasks
- [ ] Authentication: Validates JWT token, extracts userId
- [ ] Request body: JSON { text: string, link?: string }
- [ ] Text validation: Required, 3-200 characters
- [ ] Link validation: Optional, valid URL format if provided
- [ ] Rate limit: 50 tasks per user per day
- [ ] Rate limit response: 429 (Too Many Requests) with message "Limite diário de tarefas atingido"
- [ ] Default values: checked=false, createdAt=now, updatedAt=now, userId=authenticated user, deletedAt=null
- [ ] ID generation: Auto-generated unique identifier (UUID or auto-increment)
- [ ] Response: Created task object with generated ID (201 Created status)
- [ ] Duplicate text allowed: No uniqueness constraint on text field
- [ ] Response time: < 200ms
- [ ] Error responses: 400 (validation error), 401 (unauthorized), 429 (rate limit exceeded), 500 (server error)

---

### FR-018: Task Deletion API
**Description:** Backend API endpoint must soft-delete tasks with ownership validation.

**Design Reference:** US-026, US-007 - Task deletion for HOME dashboard

**Priority:** P0

**Acceptance Criteria:**
- [ ] Endpoint: DELETE /api/tasks/:id
- [ ] Authentication: Validates JWT token, extracts userId
- [ ] Authorization: Verifies task.userId = authenticated userId (403 Forbidden if mismatch)
- [ ] Soft delete: Sets deletedAt=now (does NOT remove row from database)
- [ ] Response: Success confirmation (200 OK or 204 No Content)
- [ ] Already-deleted tasks: Returns 404 (task not found)
- [ ] Response time: < 150ms
- [ ] Error responses: 401 (unauthorized), 403 (forbidden), 404 (task not found), 500 (server error)
- [ ] GET /api/tasks excludes soft-deleted tasks (WHERE deletedAt IS NULL)
- [ ] Audit trail: Deleted tasks remain in database for analytics/recovery
- [ ] Optional: Hard delete after retention period (e.g., 30 days) via cron job

---

### WelcomeModal Requirements

### FR-019: First Login Detection
**Description:** System must detect first-time users and trigger onboarding modal automatically.

**Design Reference:** `design.md > Components and Interfaces > 5. WelcomeModal Component > Interface > UserProfile.firstLogin`

**Priority:** P0

**Acceptance Criteria:**
- [ ] User profile has `firstLogin` boolean field (default: true)
- [ ] WelcomeModal renders automatically when firstLogin = true
- [ ] Modal doesn't appear if user.preferences.neverShowWelcome = true
- [ ] Modal doesn't appear if user.preferences.welcomeModalCompleted = true
- [ ] Detection happens after successful authentication
- [ ] FirstLogin set to false after modal completion

---

### FR-020: Modal Step Progression Logic
**Description:** Modal must enforce valid step transitions and bounds (1-3).

**Design Reference:** `design.md > Algorithmic Pseudocode > WelcomeModal Progression Algorithm`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Initial step is 1
- [ ] "Next" button advances: 1→2, 2→3
- [ ] "Next" on step 3 triggers completion
- [ ] "Back" button retreats: 2→1, 3→2
- [ ] "Back" on step 1 does nothing (or disabled)
- [ ] Step bounds enforced: 1 ≤ currentStep ≤ 3
- [ ] Property-based test verifies bounds for all action sequences

---

### FR-021: Onboarding Preference Persistence
**Description:** User preferences for onboarding (completed, skipped, never show) must persist across sessions.

**Design Reference:** `design.md > Algorithmic Pseudocode > WelcomeModal Progression Algorithm > handleComplete`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Completing modal saves `welcomeModalCompleted: true` to user profile
- [ ] Completing modal sets `firstLogin: false`
- [ ] Skipping modal saves `welcomeModalSkipped: true`
- [ ] Checking "never show again" saves `neverShowWelcome: true`
- [ ] All preferences persist to database
- [ ] Preferences load on next login to determine modal visibility
- [ ] Failed preference save doesn't block user (retry in background)

---

### FR-022: Demo Job Creation
**Description:** "Criar Job Demo" button must generate sample job with realistic data.

**Design Reference:** `design.md > Components and Interfaces > 5. WelcomeModal Component > Visual Design - Step 3`

**Priority:** P1

**Acceptance Criteria:**
- [ ] Demo job created with title: "Projeto Demo - Comercial"
- [ ] Demo client created: "Cliente Exemplo"
- [ ] Status set to "production"
- [ ] Deadline set to 7 days from creation
- [ ] Progress set to 50%
- [ ] Job tagged/marked as "Demo" (boolean field or tag)
- [ ] Demo job appears in Active Jobs list immediately
- [ ] User can edit or delete demo job normally

---

### FR-023: Modal Backdrop Blur
**Description:** WelcomeModal must render with glassmorphism backdrop that blurs underlying page.

**Design Reference:** `design.md > Components and Interfaces > 5. WelcomeModal Component > Render Modal WITH backdrop-blur`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Backdrop uses backdrop-filter: blur(8px)
- [ ] Backdrop background: rgba(0, 0, 0, 0.8)
- [ ] Modal content has glassmorphism effect
- [ ] Clicking backdrop (outside modal) does NOT close modal (prevents accidental dismiss)
- [ ] Esc key closes modal (same as Skip)

---

### Component Requirements

### FR-024: GlassCard Styling Specification
**Description:** All glass card components must implement standardized glassmorphism effect.

**Design Reference:** `design.md > Components and Interfaces > 6. Base Glass Components > CSS Specifications`

**Priority:** P0

**Acceptance Criteria:**
- [ ] background: rgba(255, 255, 255, 0.7) for light theme
- [ ] backdrop-filter: blur(20px) saturate(180%)
- [ ] -webkit-backdrop-filter: blur(20px) saturate(180%) for Safari
- [ ] border: 1px solid rgba(0, 0, 0, 0.08)
- [ ] border-radius: 24px (default, configurable via props)
- [ ] box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08)
- [ ] Fallback for unsupported browsers: solid background rgba(255, 255, 255, 0.95)

---

### FR-025: GlassCard Variants
**Description:** GlassCard component must support light and dark theme variants.

**Design Reference:** `design.md > Components and Interfaces > 6. Base Glass Components > CSS Specifications > Dark Variant`

**Priority:** P0

**Acceptance Criteria:**
- [ ] `variant="light"` (default): white background, dark borders
- [ ] `variant="dark"`: black background (rgba(10, 10, 10, 0.6)), light borders
- [ ] Dark variant border: rgba(255, 255, 255, 0.18)
- [ ] Dark variant shadow: rgba(0, 0, 0, 0.3)
- [ ] Variant switches automatically with theme toggle
- [ ] Text color adjusts appropriately for each variant

---

### FR-026: StatusBadge Color Mapping
**Description:** StatusBadge component must use semantic colors for each status type.

**Design Reference:** `design.md > Components and Interfaces > 6. Base Glass Components > StatusBadge Component`

**Priority:** P0

**Acceptance Criteria:**
- [ ] success: green (#10b981), icon "✓"
- [ ] warning: yellow (#f59e0b), icon "⏳"
- [ ] danger: red (#ef4444), icon "🔴"
- [ ] info: blue (#3b82f6), icon "ℹ️"
- [ ] neutral: gray (#6b7280), icon "⚪"
- [ ] Background color: status color with alpha 0.1
- [ ] Border: 1px solid status color with alpha 0.3
- [ ] Text color: full opacity status color
- [ ] Border radius: 999px (pill shape)

---

### FR-027: StatusBadge Pulse Animation
**Description:** StatusBadge with `pulse=true` must animate to draw attention.

**Design Reference:** `design.md > Components and Interfaces > 6. Base Glass Components > StatusBadge Component > Pseudo-code`

**Priority:** P1

**Acceptance Criteria:**
- [ ] Pulse animation: opacity 1 → 0.5 → 1
- [ ] Animation duration: 2 seconds
- [ ] Animation iteration: infinite
- [ ] Animation only applies when `pulse` prop is true
- [ ] Animation respects prefers-reduced-motion (disabled if set)

---

### FR-028: Hover Animation Implementation
**Description:** Interactive cards must lift on hover with smooth animation.

**Design Reference:** `design.md > Visual Design System Specifications > Animation System > Hover Lift`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Transform: translateY(-4px) on hover
- [ ] Box shadow increases on hover: 0 16px 48px rgba(0,0,0,0.12)
- [ ] Transition duration: 300ms
- [ ] Transition timing: ease-out (cubic-bezier(0, 0, 0.2, 1))
- [ ] Hover applies to WorkflowCard, JobCard, ClientCard components
- [ ] Animation disabled when prefers-reduced-motion is set

---

### FR-029: Staggered Card Entrance Animation
**Description:** Dashboard cards must animate in with sequential delays for polished entrance.

**Design Reference:** `design.md > Performance Considerations > Animation Performance > Staggered Animations`

**Priority:** P1

**Acceptance Criteria:**
- [ ] Cards start with opacity: 0, translateY: 20px
- [ ] First card animates in immediately
- [ ] Each subsequent card delays by 50ms (card[1] at 50ms, card[2] at 100ms, etc.)
- [ ] Animation: opacity 0→1, translateY 20px→0
- [ ] Transition duration: 300ms ease-out
- [ ] Animation triggers only on initial page load (not on data refresh)
- [ ] Animation disabled when prefers-reduced-motion is set

---

### Data Model Requirements

### FR-030: Job Model Validation
**Description:** Job model must enforce data validation rules before persistence.

**Design Reference:** `design.md > Data Models > Job Model > Validation Rules`

**Priority:** P0

**Acceptance Criteria:**
- [ ] title: 3-200 characters, required
- [ ] deadline: future date, required
- [ ] progress: integer 0-100, default 0
- [ ] urgent: auto-calculated boolean, not user-editable
- [ ] daysLeft: auto-calculated integer, not user-editable
- [ ] status: enum [briefing, production, review, delivered, proposal]
- [ ] currency: string, default "BRL"
- [ ] budget: optional number ≥ 0
- [ ] Validation errors return user-friendly messages

---

### FR-031: Job Status Transition Validation
**Description:** System must enforce valid status transitions and prevent invalid changes.

**Design Reference:** `design.md > Data Models > Job Model > Business Logic > canTransitionStatus`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Valid transitions defined: proposal→[briefing], briefing→[production,proposal], production→[review,briefing], review→[delivered,production], delivered→[]
- [ ] Attempting invalid transition shows error: "Transição inválida. Status válidos: [list]"
- [ ] Status only updates if canTransitionStatus returns true
- [ ] Function signature: canTransitionStatus(currentStatus, newStatus) returns boolean
- [ ] Property-based test verifies all transitions

---

### FR-032: WorkflowStats Aggregation
**Description:** WorkflowStats must aggregate data from jobs and clients collections accurately.

**Design Reference:** `design.md > Data Models > WorkflowStats Model > Calculation Logic`

**Priority:** P0

**Acceptance Criteria:**
- [ ] activeJobs = COUNT(jobs WHERE status IN [briefing, production, review])
- [ ] clientsWaiting = COUNT DISTINCT(jobs.clientId WHERE status IN [proposal, briefing])
- [ ] reviewsPending = COUNT(jobs WHERE status = review)
- [ ] totalClients = COUNT(clients)
- [ ] completedThisMonth = COUNT(jobs WHERE status=delivered AND MONTH(updatedAt)=currentMonth)
- [ ] revenueThisMonth = SUM(jobs.budget WHERE status=delivered AND MONTH(updatedAt)=currentMonth)
- [ ] All values are non-negative
- [ ] Currency field defaults to "BRL"

---

### FR-033: User Preferences Model
**Description:** User preferences must be stored and loaded correctly across sessions.

**Design Reference:** `design.md > Data Models > UserProfile Model`

**Priority:** P0

**Acceptance Criteria:**
- [ ] theme: enum [light, dark, auto], default "auto"
- [ ] welcomeModalCompleted: boolean, default false
- [ ] neverShowWelcome: boolean, default false
- [ ] firstLogin: boolean, default true
- [ ] defaultView: enum [home, jobs, clients], default "home"
- [ ] language: enum [pt-BR, en-US], default "pt-BR"
- [ ] Preferences persist to database on change
- [ ] Preferences load on user authentication

---

### Performance Requirements

### FR-034: First Contentful Paint Target
**Description:** HOME page must render visible content within 1.5 seconds.

**Design Reference:** `design.md > Performance Considerations > Performance Targets`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Skeleton screens render in < 100ms
- [ ] First Contentful Paint (FCP) < 1.5s measured by Lighthouse
- [ ] Critical CSS inlined in HTML
- [ ] JavaScript deferred or async loaded
- [ ] Images lazy loaded except above-fold content
- [ ] Performance measured on 3G throttled connection

---

### FR-035: Dashboard Load Time Optimization
**Description:** Dashboard data must load efficiently using parallel requests and caching.

**Design Reference:** `design.md > Performance Considerations > Data Loading Performance > Implementation`

**Priority:** P0

**Acceptance Criteria:**
- [ ] All data requests execute in parallel using Promise.all()
- [ ] Cached data (< 5 minutes old) displays immediately
- [ ] Fresh data loads in background and updates UI seamlessly
- [ ] Total load time < 500ms with valid cache
- [ ] Total load time < 2s without cache
- [ ] Cache key format: "dashboard_{userId}"
- [ ] Cache TTL: 5 minutes
- [ ] Stale-while-revalidate strategy implemented

---

### FR-036: Animation Performance Target
**Description:** All animations must maintain 60fps for smooth user experience.

**Design Reference:** `design.md > Performance Considerations > Animation Performance > Performance Targets`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Frame time < 16.67ms (60fps)
- [ ] Animations use transform and opacity only (GPU accelerated)
- [ ] No layout-triggering properties animated (width, height, margin, padding)
- [ ] will-change hints applied to frequently animated elements
- [ ] Performance measured with browser DevTools Performance tab
- [ ] No janky animations on mid-tier devices (tested on simulated throttling)

---

### FR-037: Glassmorphism Performance Optimization
**Description:** Glass effects must be optimized to prevent performance degradation.

**Design Reference:** `design.md > Performance Considerations > Rendering Performance`

**Priority:** P0

**Acceptance Criteria:**
- [ ] transform: translateZ(0) applied to promote layers
- [ ] will-change: transform on hover-animated cards
- [ ] Backdrop-filter disabled on low-end devices (detected via navigator.hardwareConcurrency)
- [ ] Fallback to solid backgrounds when backdrop-filter unsupported
- [ ] Prefers-reduced-motion disables backdrop-filter
- [ ] Max 10 glass elements visible simultaneously

---

### Security Requirements

### FR-038: Authentication Token Validation
**Description:** All dashboard API requests must validate JWT authentication token.

**Design Reference:** `design.md > Security Considerations > Authentication and Authorization`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Every API request includes Authorization: Bearer <token> header
- [ ] Backend validates token signature and expiration
- [ ] Invalid/expired token returns 401 Unauthorized
- [ ] Frontend redirects to login on 401 response
- [ ] Token refresh implemented before expiration (7 days)
- [ ] Token stored in httpOnly cookie (not localStorage)

---

### FR-039: User Data Authorization
**Description:** Users must only access their own dashboard data, enforced server-side.

**Design Reference:** `design.md > Security Considerations > Authentication and Authorization > Implementation`

**Priority:** P0

**Acceptance Criteria:**
- [ ] User ID extracted from validated JWT token
- [ ] API requests verify userId from token matches requested data owner
- [ ] Attempting to access other user's data returns 403 Forbidden
- [ ] Authorization check happens before any data queries
- [ ] Authorization logic tested with property-based tests (all valid userId combinations)

---

### FR-040: XSS Prevention for User Content
**Description:** User-generated content (job titles, client names) must be sanitized to prevent XSS attacks.

**Design Reference:** `design.md > Security Considerations > XSS Protection`

**Priority:** P0

**Acceptance Criteria:**
- [ ] All user input sanitized before database storage
- [ ] HTML tags removed: /<[^>]*>/g regex
- [ ] Script tags explicitly removed: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
- [ ] React JSX auto-escapes output (verify no dangerouslySetInnerHTML)
- [ ] Content Security Policy (CSP) header implemented
- [ ] CSP disallows inline scripts: script-src 'self'
- [ ] Manual penetration testing with common XSS payloads

---

### FR-041: HTTPS-Only Communication
**Description:** All API communication must use HTTPS protocol to prevent man-in-the-middle attacks.

**Design Reference:** `design.md > Security Considerations > Data Privacy`

**Priority:** P0

**Acceptance Criteria:**
- [ ] API endpoints use https:// URLs only
- [ ] HTTP requests automatically redirect to HTTPS (301)
- [ ] HSTS header included: Strict-Transport-Security: max-age=31536000
- [ ] Mixed content warnings absent in browser console
- [ ] Valid SSL certificate with strong cipher suites

---

### FR-042: Sensitive Data Logging Prevention
**Description:** System must never log sensitive data (tokens, passwords, financial data) to console or logs.

**Design Reference:** `design.md > Security Considerations > Data Privacy`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Console.log statements removed in production build
- [ ] API responses sanitized before logging (tokens, auth headers removed)
- [ ] Financial amounts only logged in aggregated form (no individual budgets)
- [ ] User PII not included in error tracking (Sentry/equivalent)
- [ ] Environment variables never logged
- [ ] Code review checklist includes sensitive data check

---

### Testing Requirements

### FR-043: Unit Test Coverage Target
**Description:** Core components and algorithms must have ≥85% unit test coverage.

**Design Reference:** `design.md > Testing Strategy > Unit Testing Approach`

**Priority:** P0

**Acceptance Criteria:**
- [ ] TopNav component: 90%+ coverage
- [ ] HOME Dashboard component: 85%+ coverage
- [ ] WorkflowCard component: 95%+ coverage
- [ ] JobCard component: 95%+ coverage
- [ ] WelcomeModal component: 90%+ coverage
- [ ] Navigation state management: 100% coverage
- [ ] Job status transitions: 100% coverage
- [ ] Coverage measured by Jest with --coverage flag
- [ ] Coverage reports generated on CI/CD pipeline

---

### FR-044: Property-Based Testing for Algorithms
**Description:** Core algorithms must be verified with property-based tests using fast-check.

**Design Reference:** `design.md > Testing Strategy > Property-Based Testing Approach`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Navigation uniqueness property: ∀ path, exactly 1 active tab
- [ ] Job progress range property: ∀ job, 0 ≤ progress ≤ 100
- [ ] Workflow stats non-negative property: ∀ calculations, all values ≥ 0
- [ ] Status transition validity property: ∀ transitions, matches validTransitions map
- [ ] Modal step bounds property: ∀ actions, 1 ≤ step ≤ 3
- [ ] Each property test runs 100+ random cases
- [ ] Property tests integrated in Jest test suite

---

### FR-045: Integration Test Coverage
**Description:** Critical user flows must have end-to-end integration tests.

**Design Reference:** `design.md > Testing Strategy > Integration Testing Approach`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Complete onboarding flow (login → modal → 3 steps → completion)
- [ ] Navigation flow (clicking all 5 tabs, verifying page loads)
- [ ] Job card interaction (clicking quick actions, verifying navigation)
- [ ] Dashboard data loading (skeleton → data population)
- [ ] Theme toggle integration (light ↔ dark, persistence)
- [ ] Tests use Cypress or Playwright
- [ ] Tests run on CI/CD pipeline before deployment

---

### FR-046: Accessibility Testing
**Description:** All pages must pass automated accessibility audits and manual keyboard testing.

**Design Reference:** `design.md > Testing Strategy > Accessibility Stories`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Lighthouse accessibility score = 100
- [ ] axe DevTools reports 0 violations
- [ ] All interactive elements keyboard accessible (Tab navigation works)
- [ ] Focus indicators visible on all focusable elements
- [ ] Screen reader testing on NVDA/JAWS (Windows) and VoiceOver (Mac)
- [ ] Color contrast ratios verified with Contrast Checker tool
- [ ] ARIA labels present and descriptive

---

### FR-047: Browser Compatibility Testing
**Description:** Platform must work correctly on all supported browsers.

**Design Reference:** `design.md > Dependencies > Core Framework Dependencies`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Chrome 90+ (desktop and mobile)
- [ ] Firefox 88+ (desktop)
- [ ] Safari 14+ (desktop and iOS)
- [ ] Edge 90+ (desktop)
- [ ] Glassmorphism fallbacks work in unsupported browsers
- [ ] CSS grid and flexbox layouts render correctly
- [ ] JavaScript features polyfilled if needed (ES6+)
- [ ] Manual testing performed on each browser

---

## Non-Functional Requirements

### NFR-001: Performance - First Contentful Paint
**Description:** HOME page must render initial content within 1.5 seconds on 3G connection.

**Design Reference:** `design.md > Performance Considerations > Performance Targets`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Lighthouse FCP score < 1.5s
- [ ] Tested on simulated 3G throttling (DevTools)
- [ ] Critical CSS inlined
- [ ] Fonts preloaded
- [ ] JavaScript code-split by route

---

### NFR-002: Performance - Time to Interactive
**Description:** HOME page must become fully interactive within 2.5 seconds.

**Design Reference:** `design.md > Performance Considerations > Performance Targets`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Lighthouse TTI score < 2.5s
- [ ] Main thread blocked time < 300ms
- [ ] Event handlers attached after hydration
- [ ] Large JavaScript bundles deferred

---

### NFR-003: Performance - Cumulative Layout Shift
**Description:** Page layout must remain stable during load with CLS < 0.1.

**Design Reference:** `design.md > Performance Considerations > Performance Targets`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Lighthouse CLS score < 0.1
- [ ] Skeleton screens match final layout dimensions
- [ ] Images have width/height attributes
- [ ] Fonts use font-display: swap with size-adjust
- [ ] Dynamic content reserves space before loading

---

### NFR-004: Performance - Animation Frame Rate
**Description:** All animations must maintain 60fps (16.67ms per frame).

**Design Reference:** `design.md > Performance Considerations > Animation Performance`

**Priority:** P0

**Acceptance Criteria:**
- [ ] DevTools Performance recording shows no dropped frames
- [ ] Card hover animation stays smooth under load
- [ ] Staggered entrance animations don't jank
- [ ] Tested on mid-tier devices (4-core CPU, integrated GPU)

---

### NFR-005: Accessibility - WCAG 2.1 Level AA Compliance
**Description:** Platform must meet WCAG 2.1 Level AA accessibility standards.

**Design Reference:** `design.md > Testing Strategy > Accessibility Testing`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Color contrast ratios ≥ 4.5:1 for body text
- [ ] Color contrast ratios ≥ 3:1 for large text (18pt+)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (≥ 3:1 contrast)
- [ ] Screen reader compatible (semantic HTML, ARIA labels)
- [ ] No keyboard traps
- [ ] Skip navigation links present
- [ ] Automated testing with axe DevTools

---

### NFR-006: Accessibility - Screen Reader Support
**Description:** All content and functionality must be accessible via screen readers.

**Design Reference:** `design.md > Testing Strategy > US-032 Screen Reader Compatibility`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Semantic HTML elements used (<nav>, <main>, <section>, <article>)
- [ ] ARIA landmarks present: navigation, main, complementary
- [ ] ARIA labels on icon-only buttons
- [ ] ARIA live regions for dynamic content updates
- [ ] Heading hierarchy logical (h1 → h2 → h3)
- [ ] Manual testing with NVDA, JAWS, VoiceOver

---

### NFR-007: Accessibility - Keyboard Navigation
**Description:** All functionality must be operable via keyboard alone.

**Design Reference:** `design.md > Testing Strategy > US-027 Navigate with Keyboard Only`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Tab order follows visual order
- [ ] Shift+Tab moves focus backward
- [ ] Enter/Space activates buttons
- [ ] Esc closes modals and dropdowns
- [ ] Arrow keys navigate within components (optional)
- [ ] No keyboard traps
- [ ] Skip links allow jumping to main content

---

### NFR-008: Visual Design - Liquid Glass Aesthetic Consistency
**Description:** All UI elements must consistently apply Liquid Glass design principles.

**Design Reference:** `design.md > Visual Design System Specifications`

**Priority:** P0

**Acceptance Criteria:**
- [ ] All cards use backdrop-filter: blur(20px) or blur(30px)
- [ ] Border radius standardized: 24px (primary), 32px (large), 12px (small)
- [ ] Semi-transparent backgrounds: rgba with 0.6-0.7 alpha
- [ ] Subtle borders: rgba with 0.08-0.18 alpha
- [ ] Box shadows: 0 8px 32px rgba(0,0,0,0.08) for cards
- [ ] Visual consistency across light and dark themes

---

### NFR-009: Visual Design - Typography Hierarchy
**Description:** Typography must establish clear visual hierarchy across all content.

**Design Reference:** `design.md > Visual Design System Specifications > Typography System`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Page titles: 2.5rem, bold, Frame Display font
- [ ] Section titles: 2rem, bold
- [ ] Card titles: 1.5rem, semibold, DM Sans font
- [ ] Body text: 1rem, regular, line-height 1.5
- [ ] Small text: 0.875rem, regular
- [ ] Labels: 0.75rem, uppercase, letter-spacing 0.08em
- [ ] Consistent font loading (FOIT/FOUT mitigation)

---

### NFR-010: Visual Design - Color Semantic Meaning
**Description:** Colors must convey consistent semantic meaning throughout the platform.

**Design Reference:** `design.md > Visual Design System Specifications > Color System`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Orange (#FF6B00): Primary actions, brand, production status
- [ ] Green (#10b981): Success, completed, delivered status
- [ ] Yellow (#f59e0b): Warning, pending, briefing status
- [ ] Red (#ef4444): Urgent, error, danger
- [ ] Blue (#3b82f6): Info, review status
- [ ] Gray (#6b7280): Neutral, inactive, disabled
- [ ] Colors adjusted for dark theme while maintaining semantic meaning

---

### NFR-011: Visual Design - Spacing Consistency
**Description:** Spacing system must be applied consistently across all layouts.

**Design Reference:** `design.md > Visual Design System Specifications > Spacing System`

**Priority:** P0

**Acceptance Criteria:**
- [ ] xs (4px): Inline padding, tight gaps
- [ ] sm (8px): Element spacing within components
- [ ] md (16px): Card padding, standard gaps
- [ ] lg (24px): Section spacing, component gaps
- [ ] xl (32px): Large padding, block margins
- [ ] 2xl (48px): Page section spacing
- [ ] No arbitrary spacing values (must use scale)

---

### NFR-012: Usability - Response Time
**Description:** User interactions must receive feedback within 100ms for perceived responsiveness.

**Design Reference:** `design.md > Performance Considerations > Animation Performance`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Button clicks show visual feedback (scale, color change) within 100ms
- [ ] Hover states trigger within 50ms
- [ ] Navigation transitions start within 100ms
- [ ] Optimistic UI updates occur immediately (before server confirmation)
- [ ] Loading indicators appear if operation takes > 200ms

---

### NFR-013: Usability - Error Recovery
**Description:** Users must be able to recover from errors without losing work or context.

**Design Reference:** `design.md > Error Handling`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Failed requests automatically retry once
- [ ] Clear error messages explain what went wrong
- [ ] "Try Again" buttons allow manual retry
- [ ] Form data persists if submission fails
- [ ] Unsaved changes prompt before navigation
- [ ] Errors logged for debugging (non-PII)

---

### NFR-014: Reliability - Data Consistency
**Description:** Dashboard data must remain consistent across all displayed components.

**Design Reference:** `design.md > Correctness Properties > Workflow Stats Accuracy Property`

**Priority:** P0

**Acceptance Criteria:**
- [ ] Workflow card counts match underlying data queries
- [ ] Finance strip calculations use same data source as full finance page
- [ ] Active jobs list matches job status filter
- [ ] Real-time updates propagate to all affected components
- [ ] No race conditions between parallel data loads

---

### NFR-015: Reliability - Session Persistence
**Description:** User session and preferences must persist across browser sessions.

**Design Reference:** `design.md > Data Models > UserProfile Model`

**Priority:** P0

**Acceptance Criteria:**
- [ ] JWT token stored securely (httpOnly cookie)
- [ ] Token refresh before expiration (7 days)
- [ ] User preferences sync from database on login
- [ ] Theme preference persists across sessions
- [ ] "Remember me" option extends session duration
- [ ] Session timeout after 7 days inactivity

---

### NFR-016: Maintainability - Component Reusability
**Description:** Base components must be reusable across different contexts without modification.

**Design Reference:** `design.md > Components and Interfaces > 6. Base Glass Components`

**Priority:** P0

**Acceptance Criteria:**
- [ ] GlassCard accepts children prop for flexible content
- [ ] StatusBadge configurable via props (type, text, icon, pulse, size)
- [ ] WorkflowCard accepts callback props for custom navigation
- [ ] ProgressBar works with any numeric range (not just 0-100)
- [ ] Components documented with TypeScript interfaces
- [ ] Storybook stories demonstrate all variants

---

### NFR-017: Maintainability - Code Documentation
**Description:** Complex algorithms and business logic must be documented with comments and pseudocode.

**Design Reference:** `design.md > Algorithmic Pseudocode`

**Priority:** P1

**Acceptance Criteria:**
- [ ] All algorithms have matching pseudocode in design.md
- [ ] Complex functions have JSDoc comments
- [ ] Business logic explained with preconditions/postconditions
- [ ] Correctness properties documented with formal notation
- [ ] README files for each major module

---

### NFR-018: Scalability - Efficient Data Queries
**Description:** Dashboard queries must scale efficiently as user data grows.

**Design Reference:** `design.md > Performance Considerations > Data Loading Performance`

**Priority:** P1

**Acceptance Criteria:**
- [ ] Database queries use appropriate indexes (userId, status, deadline)
- [ ] Active jobs limited to 6 results (pagination for more)
- [ ] Checklist limited to 10 most recent items
- [ ] Aggregate calculations (workflow stats) use COUNT/SUM (not fetching all records)
- [ ] Query performance tested with 100+ jobs, 50+ clients
- [ ] Response time < 200ms for typical user (10 jobs, 5 clients)

---

### NFR-019: Security - Content Security Policy
**Description:** CSP headers must prevent XSS attacks by restricting resource loading.

**Design Reference:** `design.md > Security Considerations > XSS Protection > CSP Header`

**Priority:** P0

**Acceptance Criteria:**
- [ ] default-src 'self' (only load from same origin)
- [ ] script-src 'self' (no inline scripts in production)
- [ ] style-src 'self' 'unsafe-inline' (allow inline styles for Tailwind)
- [ ] img-src 'self' data: https: (allow external images)
- [ ] connect-src 'self' https://api.cenastudio.com (API endpoint)
- [ ] CSP violations logged and monitored
- [ ] CSP tested with browser developer tools

---

### NFR-020: Security - Authentication Session Security
**Description:** User sessions must be protected against hijacking and replay attacks.

**Design Reference:** `design.md > Security Considerations > Authentication and Authorization`

**Priority:** P0

**Acceptance Criteria:**
- [ ] JWT tokens use strong signature (RS256 or HS256 with 256-bit key)
- [ ] Tokens include expiration claim (exp)
- [ ] Tokens include issued-at claim (iat)
- [ ] Tokens stored in httpOnly, secure, SameSite=Strict cookies
- [ ] Refresh token rotation implemented
- [ ] Session invalidation on logout (token blacklist)
- [ ] CSRF protection for state-changing requests

---

## Dependencies

### Core Framework Dependencies

| Dependency | Version | Purpose | Phase 1 Critical |
|------------|---------|---------|------------------|
| React | ^18.2.0 | UI framework | Yes |
| TypeScript | ^5.0.0 | Type safety | Yes |
| React Router | ^6.10.0 | Client-side routing | Yes |
| Tailwind CSS | ^3.3.0 | Utility-first CSS | Yes |

---

### UI Component Libraries

| Dependency | Version | Purpose | Phase 1 Critical |
|------------|---------|---------|------------------|
| Headless UI | ^1.7.0 | Accessible unstyled components (modals, dropdowns) | Yes |
| Framer Motion | ^10.12.0 | Animation library for staggered entrances, hover effects | Yes |
| React Icons | ^4.8.0 | Icon system (🎬 🏠 👥 etc.) | Yes |
| date-fns | ^2.30.0 | Date formatting (deadline, time-based greeting) | Yes |

### State Management

| Dependency | Version | Purpose | Phase 1 Critical |
|------------|---------|---------|------------------|
| Zustand | ^4.3.0 | Lightweight global state (theme, user preferences) | Yes |
| React Query | ^4.29.0 | Server state management, caching, stale-while-revalidate | Yes |

### Testing Libraries

| Dependency | Version | Purpose | Phase 1 Critical |
|------------|---------|---------|------------------|
| Jest | ^29.5.0 | Test runner for unit tests | Yes |
| React Testing Library | ^14.0.0 | Component testing | Yes |
| fast-check | ^3.8.0 | Property-based testing | Yes |
| Cypress | ^12.11.0 | E2E integration testing | Yes |

### Development Tools

| Dependency | Version | Purpose | Phase 1 Critical |
|------------|---------|---------|------------------|
| ESLint | ^8.40.0 | Code linting | Yes |
| Prettier | ^2.8.8 | Code formatting | Yes |
| TypeScript ESLint | ^5.59.0 | TypeScript-specific linting | Yes |
| Storybook | ^7.0.0 | Component documentation and testing | No (P1) |

---

## Out of Scope (Phase 1)

The following features are explicitly OUT OF SCOPE for Phase 1 (Foundation) and will be addressed in subsequent phases:

### Phase 2 Features (CLIENTS + JOBS)
- [ ] CLIENTS page: Grid of client cards with visual status
- [ ] CLIENTS page: Client detail view with job history
- [ ] JOBS page: Kanban board with drag-and-drop
- [ ] JOBS page: Job creation modal/form
- [ ] Job status workflow management (moving between stages)
- [ ] Client-to-job relationship creation flow

### Phase 3 Features (STUDIO)
- [ ] STUDIO page: Grid of AI tool cards by category
- [ ] Context selector (which job is being worked on)
- [ ] Individual AI tool editors (Screenplay, Briefing, Callsheet)
- [ ] Assistente livre (free chat AI)
- [ ] Quota indicators for AI usage
- [ ] Document generation and export

### Phase 4 Features (FINANCE)
- [ ] FINANCE page: Financial dashboard with KPIs
- [ ] FINANCE page: Revenue charts and trends
- [ ] FINANCE page: Job payment tracking
- [ ] Proposal management
- [ ] Invoicing and payment recording

### Phase 5 Features (Advanced)
- [ ] Command palette (Cmd+K) advanced functionality
- [ ] Notifications center
- [ ] Real-time collaboration
- [ ] Job templates (duplicate workflow)
- [ ] Analytics dashboards (heatmaps, usage tracking)
- [ ] Mobile app (PWA or native)
- [ ] Third-party integrations (Google Drive, Dropbox, Frame.io)

### Technical Debt (Not Phase 1)
- [ ] Internationalization (i18n) beyond pt-BR
- [ ] Advanced caching strategies (service workers, IndexedDB)
- [ ] Offline mode support
- [ ] Real-time sync with WebSockets
- [ ] Advanced accessibility features (voice control, magnification)

---

## Glossary

| Term | Definition |
|------|------------|
| **Active Job** | A job with status in [briefing, production, review] (not delivered or proposal) |
| **Backdrop Filter** | CSS property creating blur effect for glassmorphism aesthetic |
| **Checklist** | Daily task list displayed on HOME dashboard for user productivity |
| **CLS (Cumulative Layout Shift)** | Performance metric measuring visual stability during page load |
| **Correctness Property** | Formal statement of algorithm behavior using universal quantification |
| **Days Left** | Auto-calculated integer: days remaining until job deadline |
| **FCP (First Contentful Paint)** | Performance metric: time until first content renders |
| **Glassmorphism** | Design aesthetic using backdrop-blur, semi-transparency, and soft borders |
| **Job** | A project/commercial being managed through the production workflow |
| **Job Status** | Enum: [proposal, briefing, production, review, delivered] tracking job stage |
| **Liquid Glass** | Cena Studio's visual aesthetic combining glassmorphism + 24-32px rounded borders |
| **Loop Invariant** | Property that remains true throughout algorithm loop execution |
| **P0 Priority** | Must-have requirement for Phase 1 launch (blocks release if incomplete) |
| **P1 Priority** | Nice-to-have requirement for Phase 1 (can be moved to Phase 2 if needed) |
| **P2 Priority** | Future phase requirement (explicitly out of scope for Phase 1) |
| **Progress** | Integer 0-100 representing job completion percentage |
| **Property-Based Testing** | Testing approach verifying properties hold for all random inputs |
| **Stale-While-Revalidate** | Caching strategy: serve cached data while fetching fresh in background |
| **Studio IA** | AI-powered tools for screenplay, briefing, callsheet, document generation |
| **TTI (Time to Interactive)** | Performance metric: time until page fully interactive |
| **Urgent Job** | Job with < 3 days until deadline (auto-calculated) |
| **WCAG** | Web Content Accessibility Guidelines (standard for accessible web content) |
| **Workflow Stats** | Aggregated metrics: active jobs count, clients waiting, reviews pending |
| **WelcomeModal** | 3-step onboarding modal shown to first-time users |
| **XSS (Cross-Site Scripting)** | Security vulnerability allowing malicious script injection |

---

## Acceptance Criteria Summary

### Phase 1 Completion Criteria

Phase 1 (Foundation) is considered complete when ALL of the following are met:

**Navigation (P0)**
- ✅ TopNav displays 5 tabs (HOME, CLIENTS, JOBS, STUDIO, FINANCE)
- ✅ Studio IA is prominently visible (no "MORE" menu)
- ✅ Active tab indicator works correctly
- ✅ Navigation persists across page transitions

**HOME Dashboard (P0)**
- ✅ Personalized greeting with pending actions count
- ✅ 4 workflow cards with accurate real-time counts
- ✅ Checklist with add/remove/complete functionality
- ✅ Active jobs displayed with status, deadline, progress
- ✅ Finance strip shows monthly revenue and completed jobs
- ✅ Urgent jobs (< 3 days) display red indicator

**Onboarding (P0)**
- ✅ WelcomeModal appears on first login
- ✅ 3-step progression with visual navigation map
- ✅ Skip and "never show again" options work
- ✅ Preferences persist across sessions

**Components (P0)**
- ✅ GlassCard with light/dark variants
- ✅ StatusBadge with semantic colors
- ✅ ProgressBar with smooth animation
- ✅ WorkflowCard with hover effects
- ✅ All components accessible via keyboard

**Visual Design (P0)**
- ✅ Liquid Glass aesthetic applied consistently
- ✅ 24-32px border radius on cards
- ✅ Typography hierarchy with proper scale
- ✅ Color system with semantic meaning
- ✅ Smooth animations at 60fps

**Performance (P0)**
- ✅ Lighthouse score ≥ 95
- ✅ FCP < 1.5s, TTI < 2.5s, CLS < 0.1
- ✅ Dashboard load < 500ms cached, < 2s fresh
- ✅ Animations maintain 60fps

**Accessibility (P0)**
- ✅ WCAG 2.1 Level AA compliant
- ✅ Lighthouse accessibility score = 100
- ✅ Keyboard navigation functional
- ✅ Screen reader compatible
- ✅ Color contrast ratios meet standards

**Testing (P0)**
- ✅ Unit test coverage ≥ 85%
- ✅ Property-based tests for core algorithms
- ✅ E2E tests for critical flows
- ✅ Browser compatibility verified (Chrome, Firefox, Safari, Edge)

**Security (P0)**
- ✅ JWT authentication validated
- ✅ XSS prevention implemented
- ✅ HTTPS-only communication
- ✅ CSP headers configured

**Success Metrics (Target)**
- ✅ Studio IA discovery: 80%+ (from 20%)
- ✅ First job completion: 70%+ (from 50%)
- ✅ Time to first job: < 5 min (from 15 min)
- ✅ Day 1 abandonment: 30% (from 50%)

---

## Verification and Validation Plan

### Unit Testing Strategy

**Frameworks:** Jest + React Testing Library

**Coverage Targets:**
- Navigation: 100% (critical path)
- Dashboard: 85% (complex logic)
- Components: 95% (reusable building blocks)

**Key Test Suites:**
1. **TopNav.test.tsx**
   - Renders all 5 tabs
   - Highlights correct active tab
   - Navigates on click
   - Opens search on Cmd+K

2. **HOMEDashboard.test.tsx**
   - Loads data correctly
   - Displays workflow cards with accurate counts
   - Shows checklist with CRUD operations
   - Renders active jobs with correct status colors

3. **JobCard.test.tsx**
   - Shows urgency indicator when daysLeft < 3
   - Progress bar reflects correct percentage
   - Quick actions trigger correct handlers

4. **WelcomeModal.test.tsx**
   - Steps progress correctly (1→2→3)
   - Skip closes and saves preference
   - Completion saves preferences
   - Bounds enforced (1 ≤ step ≤ 3)

---

### Property-Based Testing Strategy

**Framework:** fast-check

**Properties to Verify:**

1. **Navigation Uniqueness**
   ```typescript
   ∀ navigationState, ∃! tab where tab.isActive = true
   ```

2. **Job Progress Range**
   ```typescript
   ∀ job, 0 ≤ job.progress ≤ 100
   ```

3. **Workflow Stats Non-Negative**
   ```typescript
   ∀ workflowStats, all values ≥ 0
   ```

4. **Status Transition Validity**
   ```typescript
   ∀ currentStatus, newStatus,
   canTransitionStatus(c, n) ⟹ n ∈ validTransitions[c]
   ```

5. **Modal Step Bounds**
   ```typescript
   ∀ modalState, 1 ≤ modalState.currentStep ≤ 3
   ```

---

### Integration Testing Strategy

**Framework:** Cypress

**Critical Flows:**

1. **Complete Onboarding Flow**
   - User logs in → WelcomeModal appears
   - Click through 3 steps
   - Modal closes, preference saved
   - Reload → Modal doesn't reappear

2. **Navigation Flow**
   - Click each of 5 tabs
   - Verify correct page loads
   - Active indicator updates
   - Browser back button works

3. **Job Card Interaction**
   - HOME dashboard displays jobs
   - Click quick action (Briefing)
   - Correct page opens
   - Back button returns to HOME

4. **Dashboard Data Loading**
   - HOME loads with skeleton screens
   - Data populates within 2 seconds
   - All sections display correctly

---

### Manual Testing Checklist

**Browser Compatibility:**
- [ ] Chrome 90+ (desktop and mobile)
- [ ] Firefox 88+ (desktop)
- [ ] Safari 14+ (desktop and iOS)
- [ ] Edge 90+ (desktop)

**Accessibility:**
- [ ] Keyboard navigation (Tab through all elements)
- [ ] Screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Color contrast check (all text readable)
- [ ] Focus indicators visible

**Visual QA:**
- [ ] Glassmorphism effects render correctly
- [ ] Animations smooth at 60fps
- [ ] Typography hierarchy clear
- [ ] Colors consistent with design system
- [ ] Responsive at breakpoints (375px, 768px, 1024px, 1440px)

**Performance:**
- [ ] Lighthouse audit (score ≥ 95)
- [ ] Network throttling (3G) < 2s load
- [ ] Large dataset (100+ jobs) performs well

---

## References

- **Master Design Document:** `CENA_STUDIO_REBRAND_MASTER.md` - Original rebrand vision and principles
- **Phase 1 Design Specification:** `.kiro/specs/rebrand-fase1-fundacao/design.md` - Detailed technical design
- **Figma Prototype:** [Link to Figma file if available] - Visual mockups and interactions
- **API Documentation:** [Link to API docs] - Endpoint specifications for data fetching

---

**Document Version:** 1.0
**Last Updated:** 2025-01-XX
**Status:** Draft - Ready for Review
**Next Steps:** Review with stakeholders → Approval → Begin Phase 1.1 implementation
