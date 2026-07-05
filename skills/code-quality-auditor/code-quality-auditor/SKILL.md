---
name: code-quality-auditor
description: Use when auditing Cena Studio/FRAME.AI code quality, technical debt, controller complexity, code duplication, test coverage, or maintainability. Apply before refactoring, after adding features, or whenever the user mentions code smells, large files, or "this is hard to maintain".
---

# Code Quality Auditor

## Overview

Use this skill to turn "this code is hard to maintain" into a concrete code quality audit and refactoring plan. The goal is not premature refactoring first; it is maintainable code: developers should be able to understand, modify, and extend the codebase without fear.

## Core Lens

Every audited code module must meet these quality standards:

1. **Single Responsibility** - Each function/class does one thing well
2. **Small and focused** - Functions < 50 lines, files < 300 lines
3. **DRY (Don't Repeat Yourself)** - No code duplication > 3 lines
4. **Test coverage** - 80% intermediate gate, progressing to 95% for critical modules
5. **Type safety** - No `any` types, proper TypeScript typing
6. **Dead code** - Detect with a static tool, verify references, then remove in small tested batches

## Who To Call

Simulate or assign these perspectives:

- **Senior Backend Engineer:** analyzes controller complexity, service patterns, and database queries
- **Senior Frontend Engineer:** analyzes component complexity, state management, and performance
- **Tech Lead:** identifies architectural patterns and technical debt
- **QA Engineer:** validates test coverage and test quality
- **Security Engineer:** checks for security vulnerabilities and best practices

## Audit Workflow

1. **Inventory code modules.** List controllers, services, components, and utilities
2. **Identify code smells.** Look for:
   - Large files (> 300 lines)
   - Large functions (> 50 lines)
   - Code duplication (> 3 lines repeated)
   - God objects/monolithic controllers
   - Excessive nesting (> 4 levels)
   - Magic numbers and hardcoded values
   - Missing error handling
   - Inconsistent naming conventions
   - Poor separation of concerns
   - Low test coverage
   - Unused exports, files, dependencies, and unreachable branches
3. **Classify each issue.**
   - `P0`: security vulnerability or critical bug
   - `P1`: significantly impacts maintainability or performance
   - `P2`: moderate code quality issue
   - `P3`: minor improvement opportunity
4. **Refactor in phases.** Prioritize high-impact, low-risk refactoring
5. **Validate.** Run tests, type checking, and build after each phase
6. **Document.** Update architecture docs, decision log, and changelog

## Implementation Rules

- Extract large functions into smaller, focused functions
- Split large controllers into multiple controllers/services
- Create reusable utilities for duplicated code
- Use dependency injection for testability
- Implement proper error handling and logging
- Follow SOLID principles
- Write tests before refactoring (test-driven refactoring)
- Run `knip` or `ts-prune` as evidence; never delete solely from an unreviewed report
- Maintain backward compatibility when possible
- Use TypeScript strict mode

## Code Quality Metrics

**File Size:**
- Controllers: < 300 lines
- Services: < 200 lines
- Components: < 200 lines
- Utilities: < 100 lines

**Function Size:**
- Functions: < 50 lines
- Methods: < 30 lines

**Complexity:**
- Cyclomatic complexity: < 10
- Nesting depth: < 4 levels

**Test Coverage:**
- Controllers: > 85%
- Services: > 90%
- Utils: > 95%
- Total: >= 80% intermediate gate; 95% progressive target

## Known Issues in Cena Studio

Based on code review:

1. **analyticsController.ts** - 746 lines, needs refactoring into services
2. **LanguageContext.tsx** - 111KB, needs code splitting
3. **authService.ts** - 1140 lines, needs splitting into smaller services
4. **Dual database pattern** - SQLite + Prisma code duplication in every controller
5. **Test coverage** - Raise critical modules first, pass 80%, then progress toward 95%
6. **Dead code** - Add a reproducible report and clean confirmed findings in isolated changes

## Output Format

When reporting an audit, use:

1. **Verdict:** one clear sentence on whether the code quality issue is valid
2. **Main reason:** the code-level cause of maintainability issues
3. **Who to call:** the roles needed and why
4. **Findings:** prioritized list with file references and metrics
5. **Refactoring plan:** concrete phases with expected improvements
6. **Test strategy:** how to maintain/improve test coverage during refactoring
7. **Done criteria:** code metrics improved, tests passing, documentation updated

## Done Criteria

- All files < 300 lines (or justified)
- All functions < 50 lines (or justified)
- Code duplication eliminated
- Test coverage passes the current progressive gate and moves toward 95%
- Confirmed dead code is removed without behavioral regression
- TypeScript strict mode enabled
- No `any` types (or justified)
- Documentation records refactoring decisions
- CI/CD passes all checks
