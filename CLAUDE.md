# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Generation Philosophy

**CRITICAL**: This repository is for learning through hands-on implementation. Claude should provide scaffolding and guidance, NOT complete solutions.

### DO:
- Generate file structures, boilerplate, and scaffolding
- Add detailed comments explaining what each section does
- Leave `// TODO:` or `# TODO:` comments with implementation hints
- Suggest relevant documentation links in comments
- Explain architectural decisions and patterns in comments
- Create function signatures with parameter types and return types
- Set up imports, dependencies, and configuration files

### DO NOT:
- Write complete function implementations
- Fill in business logic
- Complete algorithm implementations
- Solve the core problems

### Code Template Example:

```python
def calculate_optimized_leave(policies: LeavePolicy, horizon: DateRange) -> LeavePlan:
    """
    Calculate optimized leave plan using CP-SAT solver.

    Args:
        policies: Leave policy configuration with types, accruals, and expiry rules
        horizon: Planning period (start_date, end_date)

    Returns:
        Optimized leave plan with ranked alternatives

    TODO: Implementation hints
    - Initialize CP-SAT model and decision variables (binary var per day×leave_type)
    - Add hard constraints: vesting dates, balance limits, non-working days
    - Define objective function: minimize paid leave, maximize contiguous blocks
    - Solve with deterministic parameters (set random_seed=0)
    - See OR-Tools docs: https://developers.google.com/optimization/cp/cp_solver
    """
    pass  # Your implementation here
```

When explaining concepts, assume programming fundamentals are understood but stack-specific patterns (FastAPI, SvelteKit, OR-Tools) need explanation.

## Project Overview

Leave Optimization Planner is a web application that helps corporate employees plan their leaves efficiently. It takes company leave policies and holiday calendars as input, computes optimized leave plans, and presents ranked, explainable results on a calendar UI.

**Status**: Greenfield project - see [docs/prd.md](docs/prd.md) for full requirements and [docs/tech-stack.md](docs/tech-stack.md) for technology decisions.

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
