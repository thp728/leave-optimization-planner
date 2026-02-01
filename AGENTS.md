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

- **Scaffolding over solutions**: Provide boilerplate and guidance, NOT complete implementations
- Leave `// TODO:` or `# TODO:` comments with implementation hints
- Explain architectural decisions in comments
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

**Imports**: Group by SvelteKit, third-party, local; sort alphabetically
```typescript
import { page } from '$app/stores';
import { derived } from 'svelte/store';

import type { LeavePlan } from '$lib/types';
```

**Formatting**: Prettier with 2-space indentation
- Single quotes for strings
- No semicolons (per current config)

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
- Stores: `camelCase` with `$` prefix when used

**Component Structure**:
```svelte
<script lang="ts">
  // Props and imports first
  export let plan: LeavePlan;
  
  // Reactive statements
  $: totalDays = plan.dates.length;
</script>

<!-- Template -->
<div class="plan-card">
  <h3>{plan.leaveType}</h3>
</div>

<style>
  .plan-card {
    /* Component-specific styles */
  }
</style>
```

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

- `CLAUDE.md` - Code generation philosophy (scaffolding not solutions)
- `docs/prd.md` - Full requirements
- `docs/tech-stack.md` - Technology decisions
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
