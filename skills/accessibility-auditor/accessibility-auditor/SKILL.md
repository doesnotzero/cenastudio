---
name: accessibility-auditor
description: Use when auditing Cena Studio/FRAME.AI accessibility, WCAG compliance, keyboard navigation, screen reader support, or inclusive design. Apply before production deployments, after adding new features, or whenever the user mentions accessibility issues or keyboard navigation problems.
---

# Accessibility Auditor

## Overview

Use this skill to turn "this is hard to use" into a concrete accessibility audit and remediation plan. The goal is not compliance checkboxes first; it is inclusive design: all users should be able to navigate, understand, and interact with the interface regardless of ability.

## Core Lens

Every audited surface must meet these accessibility requirements:

1. **Keyboard navigable** - All interactive elements reachable via Tab
2. **Screen reader compatible** - Semantic HTML and ARIA labels
3. **Color contrast compliant** - WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
4. **Focus visible** - Clear focus indicators for keyboard users
5. **Error messages accessible** - Errors announced to screen readers

## Who To Call

Simulate or assign these perspectives:

- **Accessibility Specialist:** validates WCAG compliance, keyboard navigation, and screen reader support
- **Frontend Developer:** implements ARIA labels, focus management, and semantic HTML
- **UX Designer:** ensures accessible color contrast and clear visual feedback
- **QA Tester:** performs keyboard-only navigation and screen reader testing
- **User with Disabilities:** validates real-world usability with assistive technology

## Audit Workflow

1. **Keyboard navigation test.** Navigate entire interface using only Tab, Shift+Tab, Enter, and Escape
2. **Screen reader test.** Test with NVDA (Windows), VoiceOver (Mac), or TalkBack (Android)
3. **Color contrast check.** Verify all text meets WCAG AA contrast ratios
4. **Semantic HTML audit.** Check for proper heading hierarchy, landmarks, and ARIA labels
5. **Form accessibility.** Verify labels, error messages, and validation are accessible
6. **Classify each issue.**
   - `P0`: blocks keyboard navigation or screen reader use
   - `P1`: significant accessibility barrier
   - `P2`: moderate accessibility issue
   - `P3`: minor accessibility improvement
7. **Remediate in phases.** Prioritize blocking issues first
8. **Validate.** Re-test with keyboard and screen reader after fixes
9. **Document.** Update accessibility docs, ARIA patterns, and changelog

## Implementation Rules

- Use semantic HTML (button, a, nav, main, section, etc.)
- Provide ARIA labels for non-semantic elements
- Ensure focus management (focus trap in modals, focus restoration)
- Use proper heading hierarchy (h1 → h2 → h3)
- Provide alt text for images (decorative images use alt="")
- Ensure color contrast meets WCAG AA standards
- Support keyboard shortcuts with visible indicators
- Announce dynamic content changes to screen readers
- Test with real assistive technology

## WCAG AA Requirements

**Perceivable:**
- Text alternatives for non-text content
- Time-based media alternatives
- Adaptable content
- Distinguishable content (color contrast)

**Operable:**
- Keyboard accessible
- Enough time for users to read and use content
- Seizures and physical reactions (no flashing > 3x per second)
- Navigable (skip links, headings, landmarks)

**Understandable:**
- Readable text
- Predictable functionality
- Input assistance (error identification, labels, instructions)

**Robust:**
- Compatible with assistive technologies

## Output Format

When reporting an audit, use:

1. **Verdict:** one clear sentence on whether the accessibility barrier is valid
2. **Main reason:** the accessibility-level cause of the issue
3. **Who to call:** the roles needed and why
4. **Findings:** prioritized list with WCAG success criteria violations
5. **Remediation plan:** concrete phases with ARIA patterns and semantic HTML fixes
6. **Testing results:** keyboard navigation and screen reader test results
7. **Done criteria:** WCAG AA compliance, keyboard navigation works, screen reader compatible

## Done Criteria

- All interactive elements keyboard accessible
- Screen reader announces all important content
- Color contrast meets WCAG AA standards
- Focus indicators are visible and clear
- Forms have proper labels and error messages
- Dynamic content changes are announced
- Skip links provided for keyboard users
- Documentation records accessibility decisions and patterns
