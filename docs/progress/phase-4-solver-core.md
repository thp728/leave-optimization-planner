# Phase 4: Optimization Solver Core

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Build the CP-SAT constraint solver engine in isolation, independently testable. Implement the optimization logic that generates leave plans.

---

## Deliverables Checklist

### Solver Package Structure (`solver/`)
- [ ] Independent Python package with `pyproject.toml`
- [ ] Add `ortools` dependency
- [ ] Set up package structure (model/, engine/, tests/, fixtures/)

### Solver Components (`solver/model/`)
- [ ] `variables.py` - Binary variables for (day × leave_type)
- [ ] `constraints.py` - Hard constraints (vesting, balance, calendars)
- [ ] `objective.py` - Multi-objective weighted optimization
- [ ] `builder.py` - Orchestrates model construction ⭐ CRITICAL

### Execution Engine (`solver/engine/`)
- [ ] `cp_sat_runner.py` - Solver invocation and configuration
- [ ] `results_parser.py` - Parse solver output into structured plans
- [ ] `explainer.py` - Generate human-readable rationale ⭐ CRITICAL

### Test Fixtures (`solver/fixtures/`)
- [ ] `simple_scenario.json` - Minimal test case (20 PTO days, 10 holidays)
- [ ] `complex_scenario.json` - Multi-leave-type, mid-year accruals
- [ ] `expiry_scenario.json` - Leaves expiring end-of-year
- [ ] `zero_paid_scenario.json` - Scenario where zero paid leave is feasible
- [ ] `infeasible_scenario.json` - Edge case with no valid solution

### Testing
- [ ] Unit tests for each constraint type
- [ ] Integration tests with all fixtures
- [ ] Performance benchmarks (<2 seconds for 12-month horizon)
- [ ] Determinism tests (same input = same output)
- [ ] Edge cases: no feasible solution, mid-period accruals, expiring leaves, leap years
- [ ] Achieve >85% test coverage

### Alignment with UI
- [ ] Verify solver output format matches mock data from Phase 1
- [ ] Ensure explainer rationale matches UI expectations
- [ ] Validate ranking logic aligns with PlanComparison component

---

## Key Files

- [solver/pyproject.toml](../../solver/pyproject.toml)
- [solver/model/builder.py](../../solver/model/builder.py) ⭐ CRITICAL
- [solver/model/constraints.py](../../solver/model/constraints.py)
- [solver/model/objective.py](../../solver/model/objective.py)
- [solver/engine/cp_sat_runner.py](../../solver/engine/cp_sat_runner.py)
- [solver/engine/explainer.py](../../solver/engine/explainer.py) ⭐ CRITICAL
- [solver/tests/test_integration.py](../../solver/tests/test_integration.py)

---

## Success Criteria

- ✓ Solver produces deterministic results
- ✓ All fixture scenarios return valid plans
- ✓ Performance <2 seconds for 12-month horizon
- ✓ Explainer generates clear rationale matching UI needs
- ✓ Test coverage >85%
- ✓ Output format compatible with mock data from Phase 1

---

## Solver Model Overview

```python
# Conceptual model structure

# Variables
x[d, t] ∈ {0, 1} for each day d and leave type t
    # 1 = use leave type t on day d, 0 = don't use

# Constraints
1. One leave type per day: ∑_t x[d, t] ≤ 1 for all d
2. Balance limits: ∑_d x[d, t] ≤ available_balance[t] for all t
3. Vesting dates: x[d, t] = 0 if d < vesting_date[t]
4. Working days only: x[d, t] = 0 if d is weekend or holiday
5. No conflicts: Can't use leave on pre-existing holidays

# Objective (weighted sum)
maximize: α·(consecutive_breaks) - β·(paid_leave_used) - γ·(priority_violations)

# Where:
# - α = weight for maximizing time off (primary goal)
# - β = weight for minimizing paid leave usage (secondary)
# - γ = weight for respecting leave type priorities (tertiary)
```

---

## Decisions Made

<!-- Add decisions as implementation progresses -->
<!-- Example: -->
<!-- - [2026-02-01] Chose weighted sum for multi-objective optimization -->

---

## Blockers

<!-- Document any blockers encountered -->

---

## Testing Results

**Test Coverage**: -
**Tests Passing**: -/-
**Performance Benchmark**: -

<!-- Update as tests are written and run -->

---

## Performance Benchmarks

| Scenario | Horizon | Execution Time | Status |
|----------|---------|----------------|--------|
| Simple | 3 months | - | Not tested |
| Complex | 12 months | - | Not tested |
| Expiry | 12 months | - | Not tested |
| Zero Paid | 12 months | - | Not tested |

**Target**: <2 seconds for 12-month horizon

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->
<!-- Important: Document any OR-Tools specific learnings or gotchas -->

---

## Next Steps

1. Create `solver/` directory at repo root
2. Initialize `pyproject.toml` with `ortools` dependency
3. Set up package structure
4. Implement variable generation
5. Implement constraints layer by layer
6. Implement objective function
7. Build model orchestrator (builder.py)
8. Create test fixtures (match scenarios from Phase 1 mock data)
9. Write and run unit tests
10. Write integration tests
11. Benchmark performance
12. Build explainer module
13. Verify output format matches mock data expectations
14. Update this document with results
15. **Move to Phase 5: API Layer & Integration**

