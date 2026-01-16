# Phase 1: Data Models & Foundation

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Establish type-safe contracts and foundational data structures for the backend.

---

## Deliverables Checklist

### Pydantic Models (`apps/api/models/`)
- [ ] `leave_types.py` - LeaveType, AccrualRule, ExpiryRule models
- [ ] `calendar.py` - Holiday, WeekendRule, PlanningHorizon models
- [ ] `preferences.py` - UserPreferences, BreakPattern models
- [ ] `plan.py` - LeavePlan, DayAssignment, PlanMetadata models

### Database Schema (`apps/api/db/`)
- [ ] `schema.sql` - SQLite schema for policies, holidays, saved plans
- [ ] `connection.py` - Database connection utilities
- [ ] `migrations/` - Initial migration scripts

### Validation & Utilities
- [ ] Input sanitization utilities
- [ ] Date range validators
- [ ] Accrual calculation helpers

### Testing
- [ ] Unit tests for Pydantic validation logic
- [ ] Edge case tests: leap years, invalid dates, negative balances
- [ ] Accrual calculation tests (monthly/quarterly/yearly)
- [ ] Achieve >80% test coverage

---

## Key Files

- [apps/api/models/leave_types.py](../../apps/api/models/leave_types.py)
- [apps/api/models/calendar.py](../../apps/api/models/calendar.py)
- [apps/api/models/preferences.py](../../apps/api/models/preferences.py)
- [apps/api/models/plan.py](../../apps/api/models/plan.py)
- [apps/api/db/schema.sql](../../apps/api/db/schema.sql)
- [apps/api/db/connection.py](../../apps/api/db/connection.py)

---

## Success Criteria

- ✓ All models have comprehensive validation
- ✓ Can serialize/deserialize complex policy configurations
- ✓ Database schema supports all required entities
- ✓ Test coverage >80% for models

---

## Decisions Made

<!-- Add decisions as implementation progresses -->
<!-- Example: -->
<!-- - [2026-01-17] Chose to use Pydantic v2 for better performance and validation -->

---

## Blockers

<!-- Document any blockers encountered -->
<!-- Example: -->
<!-- - [2026-01-17] Waiting for clarification on accrual rule edge cases -->

---

## Testing Results

**Test Coverage**: -
**Tests Passing**: -/-

<!-- Update as tests are written and run -->

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Set up Python project structure in `apps/api/`
2. Install dependencies: `pydantic>=2.0`, `sqlalchemy` (or direct sqlite3)
3. Create `models/` directory
4. Implement LeaveType and related models
5. Write unit tests for models
6. Create database schema
7. Implement database utilities
8. Run full test suite
9. Update this document with results
10. Move to Phase 2
