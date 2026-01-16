# Phase 2: Optimization Solver Core

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Build the CP-SAT constraint solver engine in isolation, independently testable.

---

## Deliverables Checklist

### Solver Package Structure (`solver/`)
- [ ] Independent Python package with `pyproject.toml`
- [ ] Add `ortools` dependency
- [ ] Set up package structure

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
- [ ] `simple_scenario.json` - Minimal test case
- [ ] `complex_scenario.json` - Multi-leave-type, mid-year accruals
- [ ] `expiry_scenario.json` - Leaves expiring end-of-year

### Testing
- [ ] Unit tests for each constraint type
- [ ] Integration tests with all fixtures
- [ ] Performance benchmarks (<2 seconds for 12-month horizon)
- [ ] Determinism tests (same input = same output)
- [ ] Edge cases: no feasible solution, mid-period accruals, expiring leaves, leap years
- [ ] Achieve >85% test coverage

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
- ✓ Explainer generates clear rationale
- ✓ Test coverage >85%

---

## Decisions Made

<!-- Add decisions as implementation progresses -->
<!-- Example: -->
<!-- - [2026-01-17] Chose weighted sum for multi-objective optimization -->

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

**Target**: <2 seconds for 12-month horizon

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->
<!-- Important: Document any OR-Tools specific learnings or gotchas -->

---

## Next Steps

1. Create `solver/` directory at repo root
2. Initialize `pyproject.toml` with `ortools` dependency
3. Set up package structure (model/, engine/, tests/, fixtures/)
4. Implement variable generation
5. Implement constraints layer by layer
6. Implement objective function
7. Build model orchestrator
8. Create test fixtures
9. Write and run tests
10. Benchmark performance
11. Update this document with results
12. Move to Phase 3
