# AGENTS.md – Guidelines for AI Coding Agents

> **Purpose**: This file contains essential information for AI agents working in this repository.

## Build, Lint, and Test Commands

### Backend (Python/FastAPI)

**Package Manager**: `uv` (Python 3.13+)

```bash
# Development server
uv run fastapi dev

# Production server
uv run uvicorn main:app

# Install dependencies
uv sync

# Add new dependency
uv add <package>

# Linting (when configured)
uv run ruff check .
uv run ruff format .

# Type checking (when configured)
uv run mypy .

# Run all tests
uv run pytest

# Run single test file
uv run pytest tests/test_solver.py

# Run specific test
uv run pytest tests/test_solver.py::test_function_name -v
```

### Frontend (SvelteKit)

**Package Manager**: `npm`

```bash
# Development server
cd apps/web && npm run dev

# Build for production
npm run build

# Type checking
npm run check

# Format code
npm run format

# Lint code
npm run lint
```

## Code Style Guidelines

### General Principles

- Prefer explicit over implicit

### Python (Backend & Solver)

**Imports**: Group by stdlib, third-party, local; sort alphabetically within groups
```python
from datetime import date
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from .models import LeavePolicy
```

**Formatting**: Use `ruff` (Black-compatible style)
- Line length: 88 characters
- Trailing commas in multi-line structures

**Type Hints**: Required for all function signatures
```python
def calculate_leave(
    policies: LeavePolicy,
    horizon: DateRange,
    include_weekends: bool = False
) -> LeavePlan:
```

**Naming**: 
- Functions/variables: `snake_case`
- Classes: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`

**Error Handling**: Use FastAPI HTTP exceptions; custom exceptions for solver
```python
from fastapi import HTTPException

raise HTTPException(status_code=400, detail="Invalid leave policy")
```

### TypeScript/Svelte (Frontend)

**Design System**: All frontend development must follow the design system documented in `docs/design-system/`. This includes:
- **Design tokens** defined in `apps/web/src/routes/layout.css` via Tailwind v4 `@theme`
- **Component API specs** in `docs/design-system/components.md`
- **Accessibility requirements** in `docs/design-system/accessibility.md`
- **Token reference** in `docs/design-system/tokens.md`

Use existing design system components from `$lib/components/` before creating new ones.

**Imports**: Group by SvelteKit, third-party, local; sort alphabetically
```typescript
import { page } from '$app/state';

import { Calendar } from 'lucide-svelte';

import { Button, Card } from '$lib/components';
import type { LeavePlan } from '$lib/types';
```

**Formatting**: Prettier with tab indentation
- Single quotes for strings
- Print width: 100 characters
- Tailwind class sorting via `prettier-plugin-tailwindcss`

**Types**: Strict TypeScript; explicit return types on functions
```typescript
interface LeavePlan {
  dates: Date[];
  leaveType: string;
}

function calculateLeaveDays(plan: LeavePlan): number {
  return plan.dates.length;
}
```

**Naming**:
- Functions/variables: `camelCase`
- Components: `PascalCase.svelte`
- Types/Interfaces: `PascalCase`

**Component Structure** (Svelte 5 — uses runes, NOT legacy `export let` or `$:` syntax):
```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Size, Variant } from '$lib/types/components';

  interface Props {
    plan: LeavePlan;
    variant?: Variant;
    children: Snippet;
  }

  let { plan, variant = 'primary', children }: Props = $props();

  // Reactive state
  let isExpanded = $state(false);

  // Derived values
  let totalDays = $derived(plan.dates.length);
</script>

<!-- Template — use Tailwind utilities, NOT scoped <style> blocks -->
<div class="rounded-lg border border-border bg-surface-raised p-4 shadow-sm">
  <h3 class="text-lg font-semibold text-text-primary">{plan.leaveType}</h3>
  {@render children()}
</div>
```

**Styling rules:**
- Use Tailwind utility classes referencing design system tokens (e.g., `bg-primary-500`, `text-text-primary`, `rounded-lg`)
- Do NOT use scoped `<style>` blocks (exception: complex CSS Grid layouts)
- Do NOT use arbitrary Tailwind values (e.g., `bg-[#2563EB]`) — use token-based utilities instead
- Icons: Use `lucide-svelte` — import individually for tree-shaking

## Project Architecture

**Layers** (separation of concerns):
1. **Frontend** (`apps/web/`): SvelteKit + TypeScript - UI only
2. **Backend** (`apps/api/`): FastAPI - API orchestration
3. **Solver** (`solver/`): OR-Tools CP-SAT - Optimization logic (isolated)
4. **Shared** (`packages/`): Contracts and constants

**Key Rule**: Never put solver logic in backend or frontend. Backend calls solver as a service.

## Domain Concepts

- **Leave Types**: Priority (lower=preferred), accrual rules, expiry, carryover
- **Holiday Calendar**: Fixed dates + locale-based weekends (Fri-Sat in some countries)
- **Planning Horizon**: Default 12 months
- **Leave Plans**: Ranked outputs with date ranges, totals, and rationale

## Testing Strategy

- **Backend**: `pytest` with `pytest-asyncio` for FastAPI endpoints
- **Solver**: Property-based tests + fixture-based integration tests
- **Frontend**: Vitest for unit tests, Playwright for E2E (when configured)

## Key Files

- `CLAUDE.md` - Project guidance for Claude Code
- `docs/prd.md` - Full requirements
- `docs/tech-stack.md` - Technology decisions
- `docs/design-system/` - **Design system specification** (tokens, components, accessibility)
- `apps/web/src/routes/layout.css` - Design token definitions (`@theme` block)
- `apps/web/src/lib/components/` - Reusable UI component library
- `apps/api/pyproject.toml` - Backend dependencies
- `apps/web/package.json` - Frontend dependencies

## Common Patterns

**Solver Integration**:
```python
# apps/api/services/optimizer.py
from solver.engine.cp_sat import solve_leave_plan

async def optimize_leave(policies, holidays):
    # Transform to solver format
    result = solve_leave_plan(model_data)
    # Transform back to API format
    return LeavePlan.from_solver_result(result)
```

**API Response Model**:
```python
class LeavePlanResponse(BaseModel):
    id: str
    rank: int
    total_paid_leave: int
    longest_break: int
    daily_assignments: list[DayAssignment]
    rationale: str
```
