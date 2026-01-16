# Tech Stack – Leave Optimization Planner (Individual User)

This document defines the **final, optimal tech stack** for the project.  
The stack is chosen to maximize **correctness, explainability, and long-term extensibility**, while keeping operational complexity low.

---

## 1. Architecture Overview

The system follows a **solver-centric, service-oriented architecture**:

```

Frontend (Calendar UI)
↓
Backend API (Policy + Orchestration)
↓
Constraint Solver (Optimization Core)

```

The optimization engine is treated as a **first-class component**, not a utility function.

---

## 2. Frontend

### Framework

**SvelteKit + TypeScript**

**Rationale**

- Excellent fit for calendar-heavy, interactive UIs
- Minimal state management overhead
- Fast iteration speed
- Strong typing without React-level boilerplate
- SSR support for predictable rendering

### UI Components

- Custom calendar (or thin wrapper over FullCalendar)
- Form-driven policy configuration
- Plan comparison view (ranked plans)

### State Management

- Svelte stores
- Derived stores for computed views (e.g., break lengths, costs)

### Responsibilities

- Collect user inputs (policies, preferences)
- Visualize holiday and leave calendars
- Display ranked optimized plans
- Trigger re-optimization on edits

---

## 3. Backend API

### Language & Framework

**Python 3.11 + FastAPI**

**Rationale**

- Best ecosystem for optimization and date arithmetic
- Clean request/response modeling with Pydantic
- Automatic OpenAPI spec generation
- Simple async support for concurrent requests

### Core Responsibilities

- Validate and normalize user inputs
- Expand accrual and vesting timelines
- Build optimization-ready data structures
- Invoke solver and post-process results
- Return explainable, structured plans

### Data Validation

- **Pydantic v2**
  - Strong schema enforcement
  - Clear error reporting
  - Shared models with solver inputs

---

## 4. Optimization Engine (Core)

### Solver

**Google OR-Tools – CP-SAT**

**Rationale**

- Industry-grade constraint programming solver
- Handles:
  - Accrual constraints
  - Multi-objective optimization
  - Discrete day-by-day decisions
- Deterministic and auditable
- Proven performance at yearly horizons

### Modeling Approach

- Binary variables per (day × leave type)
- Hard constraints:
  - Vesting
  - Leave balance limits
  - Calendar restrictions
- Soft objectives:
  - Paid leave minimization
  - Break length maximization
  - Leave expiry avoidance

### Output

- Ranked plans
- Per-day leave assignments
- Cost and rationale metadata

---

## 5. Data Storage

### Primary Store

**SQLite**

**Rationale**

- Zero-config
- Ideal for single-user MVP
- Easy local-first deployment
- Simple migration path to Postgres

### Stored Data

- Leave policies
- Holiday calendars
- Saved optimization runs

---

## 6. API Contract

### Communication

- REST (JSON)
- OpenAPI-driven type generation for frontend

### Typical Endpoints

- `POST /optimize`
- `GET /holidays`
- `GET /plans/{id}`

---

## 7. Deployment & Dev Tooling

### Development

- Docker (backend)
- Vite (frontend)
- Pre-commit hooks (formatting, linting)

### Deployment (MVP)

- Single backend service
- Static frontend hosting
- No background workers initially

---

## 8. Non-Goals (Intentional Omissions)

- No calendar integrations (Google/Outlook)
- No real-time collaboration
- No AI/LLM dependency
- No enterprise auth

---

## 9. Future-Proofing Notes

- Group planning can be added by extending the solver model
- Solver can be extracted into a separate service if needed
- Frontend is decoupled from optimization logic
- Policies are fully data-driven

---

## 10. Why This Stack Is Optimal

- Uses the **best available tool** for the hardest problem
- Avoids premature novelty
- Scales in complexity without rewrites
- Produces trustworthy, explainable results

This stack optimizes for **engineering correctness over hype**, which is essential for a planning system.
