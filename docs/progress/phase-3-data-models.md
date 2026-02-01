# Phase 3: Data Models & Foundation

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Establish type-safe contracts and foundational data structures for the backend. Define the API contracts based on validated UI requirements from Phases 1-2.

---

## Why After UI?

Building UI first revealed:
- **Actual data needs** - What fields are truly necessary vs. speculative
- **API contract requirements** - What requests/responses should look like
- **Validation rules** - What constraints users encounter
- **Edge cases** - Real scenarios from mock data testing

Now we build models that perfectly fit the validated UI.

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
- [ ] Weekend calculation utilities (locale-aware)

### Type Safety Bridge
- [ ] Verify Pydantic models match TypeScript interfaces from UI
- [ ] Document any discrepancies and rationale
- [ ] Ensure serialization/deserialization compatibility

### Testing
- [ ] Unit tests for Pydantic validation logic
- [ ] Edge case tests: leap years, invalid dates, negative balances
- [ ] Accrual calculation tests (monthly/quarterly/yearly)
- [ ] Database integration tests
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
- ✓ Pydantic models align with UI TypeScript interfaces
- ✓ Validation errors are user-friendly

---

## UI → Backend Alignment

### TypeScript Interface (from Phase 1)
```typescript
interface LeaveType {
  id: string;
  name: string;
  daysPerYear: number;
  priority: number;
  accrualSchedule: 'monthly' | 'quarterly' | 'yearly' | 'upfront';
  carryoverDays: number;
  expiresAtYearEnd: boolean;
}
```

### Corresponding Pydantic Model
```python
class LeaveType(BaseModel):
    id: str
    name: str
    days_per_year: int = Field(gt=0)
    priority: int = Field(ge=0)  # Lower = preferred
    accrual_schedule: AccrualSchedule
    carryover_days: int = Field(ge=0, default=0)
    expires_at_year_end: bool = False
    
    class Config:
        from_attributes = True
```

**Validation insights from UI testing:**
- Users struggled with priority ordering → Add validation messages
- Need to support mid-year accruals → Add vesting_date field
- Expiring leaves need warnings → Add validation for expiry scenarios

---

## Decisions Made

<!-- Add decisions as implementation progresses -->
<!-- Example: -->
<!-- - [2026-02-01] Added vesting_date to AccrualRule based on UI testing feedback -->

---

## Blockers

<!-- Document any blockers encountered -->
<!-- Example: -->
<!-- - [2026-01-17] Need to decide on timezone handling for multi-country holidays -->

---

## Testing Results

**Test Coverage**: -
**Tests Passing**: -/-

<!-- Update as tests are written and run -->

---

## Next Steps

1. Set up Python project structure in `apps/api/`
2. Install dependencies: `pydantic>=2.0`, `sqlalchemy` (or direct sqlite3)
3. Create `models/` directory
4. Implement LeaveType and related models (align with UI interfaces)
5. Write unit tests for models
6. Create database schema
7. Implement database utilities
8. Run full test suite
9. Verify model serialization matches mock data format
10. Update this document with results
11. **Move to Phase 4: Optimization Solver Core**

