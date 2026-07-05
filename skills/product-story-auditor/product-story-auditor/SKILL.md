---
name: product-story-auditor
description: Use when auditing Cena Studio/FRAME.AI product clarity, storytelling, navigation, tool flow, project journey, dashboards, Studio/Documents, commercial-to-project handoff, or UX/UI confusion. Apply before broad visual changes, after adding modules, or whenever the user says the system feels confusing or asks who should review the experience.
---

# Product Story Auditor

## Overview

Use this skill to turn "the product feels confusing" into a concrete product audit and implementation plan. The goal is not cosmetic polish first; it is operational clarity: users should know where they are, what decision they are making, what comes next, and what artifact/outcome the screen produces.

## Core Lens

Every audited screen must answer four questions without external explanation:

1. **Where am I?** Project, client, stage, tool, or account context.
2. **Why am I here?** The decision or task this screen exists to support.
3. **What should I do now?** One primary action, with secondary actions clearly lower priority.
4. **What happens next?** Next stage, artifact, approval, export, or handoff.

## Who To Call

Simulate or assign these perspectives:

- **Product Designer:** reduces choices, clarifies entry/middle/end, checks empty states.
- **UX Writer:** rewrites labels, next actions, status, and stage language.
- **Design System Frontend:** checks hierarchy, spacing, CTA consistency, mobile fit, and component reuse.
- **Workflow QA:** validates a realistic user path from commercial lead to project, artifact, approval, delivery, and finance.
- **Domain Operator:** checks whether the flow matches real audiovisual production work.

## Audit Workflow

1. **Inventory the journey.** List all entry points and destinations: landing, login, Hoje, Projetos, Comercial, ProjectHub, ProjectChapter, Studio, Tools, Documents, Files, Reviews, Finance.
2. **Pick one real path.** Example: create client -> opportunity -> project -> briefing -> proposal -> contract -> planning -> files -> review -> delivery -> finance.
3. **Mark confusion points.** Look for duplicate CTAs, competing dashboards, hidden context, generic labels, too many equal-weight cards, missing empty-state guidance, and disconnected history.
4. **Classify each issue.**
   - `P0`: blocks task completion or creates wrong data.
   - `P1`: user cannot confidently choose the next step.
   - `P2`: visual hierarchy or wording slows the user down.
   - `P3`: polish, consistency, or later optimization.
5. **Patch in phases.** Prefer one coherent flow improvement per phase over scattered cosmetic changes.
6. **Validate.** Run type/test/build checks and, when UI changes are visual, browser-check desktop and mobile for overflow, blank states, and console errors.
7. **Document.** Update UX docs, decision log, roadmap/changelog, and prompt/context docs when the product model changes.

## Implementation Rules

- Keep the brand identity unless the user explicitly approves a larger redesign.
- Simplify by prioritizing and sequencing, not by removing real functionality.
- One primary CTA per surface; secondary actions may exist but must visually recede.
- Prefer project/client context over global tool lists when the user is inside work.
- Use the same stage names everywhere when referring to the job journey.
- Avoid adding explanatory marketing copy inside operational screens; use concise labels, status, and action text.
- If a screen is a hub, it should route to work. If it is a workspace, it should reduce navigation noise.
- Empty states must tell the user what to create first and where it will be used next.

## Output Format

When reporting an audit, use:

1. **Verdict:** one clear sentence on whether the user's discomfort is valid.
2. **Main reason:** the product-level cause of confusion.
3. **Who to call:** the roles needed and why.
4. **Findings:** prioritized list with file references when available.
5. **Phased execution:** concrete phases with validation and documentation steps.
6. **Done criteria:** tests, build, browser checks, and docs updated.

## Done Criteria

- The user can describe the intended first action on the main screen without guessing.
- A new user can find a project, understand its stage, open the correct tool, and return to the project.
- Commercial, Studio/Documents, Review/Delivery, and Finance feel connected by client/project context.
- Documentation records the decision and the validation performed.
