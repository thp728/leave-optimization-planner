# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leave Optimization Planner is a web application that helps corporate employees plan their leaves efficiently. It takes company leave policies and holiday calendars as input, computes optimized leave plans, and presents ranked, explainable results on a calendar UI.

**Status**: Greenfield project - see [docs/prd.md](docs/prd.md) for full requirements and [docs/tech-stack.md](docs/tech-stack.md) for technology decisions.

## Design System

All frontend UI work must follow the design system documented in [docs/design-system/](docs/design-system/):

- **[docs/design-system/README.md](docs/design-system/README.md)** — Overview, principles, conventions, and how to add components
- **[docs/design-system/tokens.md](docs/design-system/tokens.md)** — Color palette (primary blue + teal accent), typography (Inter), spacing (8px grid), shadows, radius, animations
- **[docs/design-system/components.md](docs/design-system/components.md)** — Component API reference with props, variants, usage examples
- **[docs/design-system/accessibility.md](docs/design-system/accessibility.md)** — WCAG AA requirements, ARIA patterns, keyboard navigation

### Key Rules for Frontend Development

1. **Use design tokens** — All colors, spacing, typography, and shadows come from the `@theme` block in `apps/web/src/routes/layout.css`. Use Tailwind utilities like `bg-primary-500`, `text-text-primary`, `rounded-lg` — never hardcoded hex values or arbitrary Tailwind values.
2. **Reuse existing components** — Check `apps/web/src/lib/components/` before creating new UI elements. Import via `$lib/components`.
3. **Svelte 5 patterns** — Use `$props()`, `$state()`, `$derived()`, `$bindable()`, and `Snippet` type. Do NOT use legacy Svelte 4 syntax (`export let`, `$:`, `<slot>`).
4. **No scoped styles** — Use Tailwind utility classes in `class=""` attributes. Avoid `<style>` blocks except for complex CSS Grid layouts.
5. **Accessibility is mandatory** — Every interactive component needs ARIA attributes, keyboard navigation, and visible focus indicators. See [accessibility.md](docs/design-system/accessibility.md).
6. **Icons** — Use `lucide-svelte`. Import icons individually for tree-shaking.

## Tech Stack

**Architecture**: Solver-centric, service-oriented (Frontend → Backend API → Constraint Solver)

| Layer | Technology |
|-------|------------|
| Frontend | SvelteKit + TypeScript |
| Backend | Python 3.11 + FastAPI + Pydantic v2 |
| Solver | Google OR-Tools CP-SAT |
| Database | SQLite |
| API | REST/JSON with OpenAPI |

## Core Domain Concepts

- **Leave Types**: Each has name, priority (lower = preferred), accrual rules (none/monthly/quarterly/yearly), expiry rules, and carryover limits
- **Holiday Calendar**: Fixed-date holidays with locale-based weekend detection
- **Planning Horizon**: Configurable period (default 12 months) for optimization
- **Leave Plans**: Ranked outputs showing date ranges, leave type per day, totals by type, and optimization rationale

## Optimization Engine (CP-SAT Solver)

**Modeling approach**: Binary variables per (day × leave type)

Hard constraints:
- Leave cannot be used before vesting
- Leave balances cannot go negative
- Holidays and weekends are non-working days

Soft objectives (weighted):
- Minimize high-priority-cost (paid) leave usage
- Maximize contiguous non-working periods
- Minimize leave expiry waste

**Performance target**: <2 seconds for 12-month horizon with deterministic results.

## Key Edge Cases

- Mid-period accruals (monthly vesting)
- Expiring leaves near year-end
- No feasible zero-paid-leave plan scenarios
- Leap years and locale-specific weekends (some countries have Fri-Sat weekends)

## MVP Scope

In scope:
- Single user leave planning
- Policy-agnostic configuration
- Calendar view with leave suggestions
- Multiple ranked plan comparison

Out of scope for MVP:
- Group/collaborative planning
- Employer administration
- Calendar sync (Google/Outlook)
- AI behavior-based recommendations

## API Endpoints

- `POST /optimize` - Run optimization with policies and preferences
- `GET /holidays` - Retrieve holiday calendar
- `GET /plans/{id}` - Fetch saved optimization plan
