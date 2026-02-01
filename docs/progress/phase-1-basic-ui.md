# Phase 1: Basic Frontend UI & Forms (with Mock Data)

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Build input forms and results display using mock data. Establish UI foundation and validate user experience before backend implementation.

---

## Why UI First?

- **Immediate visual feedback** - See the product from day one
- **API design validation** - Building UI reveals what data structures are actually needed
- **User experience focus** - Prove the core workflow before investing in solver complexity
- **Parallel development** - Frontend team can progress while backend is being built

---

## Deliverables Checklist

### Mock Data Layer (`apps/web/src/lib/mocks/`)
- [ ] `mockPolicies.ts` - Sample leave policies (PTO, sick, floating holidays)
- [ ] `mockHolidays.ts` - Sample holiday calendars (US, UK, etc.)
- [ ] `mockPlans.ts` - Pre-generated optimization results for testing
- [ ] `mockApi.ts` - Mock API service that mimics real API responses
- [ ] `types.ts` - Manual TypeScript interfaces (will later be generated from OpenAPI)

### Input Forms (`apps/web/src/lib/components/forms/`)
- [ ] `LeaveTypeForm.svelte` - Add/edit leave types
- [ ] `HolidayForm.svelte` - Define holidays
- [ ] `PreferencesForm.svelte` - Planning horizon, break patterns
- [ ] `PolicyBuilder.svelte` - Orchestrates all input forms ⭐ CRITICAL

### State Management (`apps/web/src/lib/stores/`)
- [ ] `policyStore.ts` - Svelte store for leave policies
- [ ] `holidayStore.ts` - Holiday calendar state
- [ ] `preferencesStore.ts` - User preferences
- [ ] `planStore.ts` - Optimization results (mock initially)

### Basic Results Display (`apps/web/src/lib/components/`)
- [ ] `PlanSummary.svelte` - Plan metadata (total days, longest break, paid leave count)
- [ ] `LeaveBreakdown.svelte` - Table of leave consumption by type
- [ ] `PlanComparison.svelte` - Side-by-side ranked plan comparison

### Routes (`apps/web/src/routes/`)
- [ ] `+page.svelte` - Landing/input page with policy builder
- [ ] `results/+page.svelte` - Results page (table view)

### Mock Scenarios
- [ ] **Scenario A**: Standard 20 PTO days + 10 holidays - simple optimization
- [ ] **Scenario B**: Mixed leave types (PTO, sick, floating) - priority handling
- [ ] **Scenario C**: End-of-year expiring leave - use-it-or-lose-it scenario
- [ ] **Scenario D**: Zero paid leave feasible - optimal scenario

### Testing
- [ ] Component tests: Form validation and submission
- [ ] Store tests: State mutations and derived values
- [ ] Mock data tests: Verify mock responses match expected API format
- [ ] TypeScript strict mode validation
- [ ] Achieve >70% test coverage

---

## Key Files

- [apps/web/src/lib/mocks/types.ts](../../apps/web/src/lib/mocks/types.ts) ⭐ CRITICAL - Define interfaces
- [apps/web/src/lib/mocks/mockPlans.ts](../../apps/web/src/lib/mocks/mockPlans.ts) - Pre-built plan data
- [apps/web/src/lib/mocks/mockApi.ts](../../apps/web/src/lib/mocks/mockApi.ts) - Mock service
- [apps/web/src/lib/components/forms/PolicyBuilder.svelte](../../apps/web/src/lib/components/forms/PolicyBuilder.svelte)
- [apps/web/src/lib/stores/policyStore.ts](../../apps/web/src/lib/stores/policyStore.ts)
- [apps/web/src/lib/stores/planStore.ts](../../apps/web/src/lib/stores/planStore.ts)
- [apps/web/src/routes/+page.svelte](../../apps/web/src/routes/+page.svelte)
- [apps/web/src/routes/results/+page.svelte](../../apps/web/src/routes/results/+page.svelte)

---

## Success Criteria

- ✓ User can input complete policy configuration via forms
- ✓ Forms validate inputs client-side
- ✓ Mock optimization returns pre-defined plans instantly
- ✓ Results display shows plan metadata and breakdown
- ✓ Can compare multiple ranked plans
- ✓ No runtime type errors
- ✓ UI is responsive and accessible
- ✓ Mock data structure matches expected API contract

---

## TypeScript Interfaces (Draft)

```typescript
// types.ts - Will be replaced by OpenAPI-generated types in Phase 5

interface LeaveType {
  id: string;
  name: string;
  daysPerYear: number;
  priority: number; // Lower = preferred
  accrualSchedule: 'monthly' | 'quarterly' | 'yearly' | 'upfront';
  carryoverDays: number;
  expiresAtYearEnd: boolean;
}

interface Holiday {
  date: string; // ISO format
  name: string;
  type: 'public' | 'company';
}

interface UserPreferences {
  planningHorizon: { start: string; end: string };
  minConsecutiveDaysOff: number;
  maxConsecutiveDaysOff: number;
  preferredBreakFrequency: 'monthly' | 'quarterly' | 'flexible';
}

interface DayAssignment {
  date: string;
  type: 'work' | 'weekend' | 'holiday' | 'leave';
  leaveTypeId?: string;
  isPaidLeave: boolean;
  rationale?: string;
}

interface LeavePlan {
  id: string;
  rank: number;
  totalDaysOff: number;
  paidLeaveDays: number;
  longestConsecutiveBreak: number;
  dailyAssignments: DayAssignment[];
  rationale: string;
}

interface OptimizeRequest {
  leaveTypes: LeaveType[];
  holidays: Holiday[];
  preferences: UserPreferences;
}

interface OptimizeResponse {
  plans: LeavePlan[];
  metadata: {
    executionTimeMs: number;
    horizonDays: number;
    totalSolutionsFound: number;
  };
}
```

---

## Decisions Made

<!-- Add decisions as implementation progresses -->
<!-- Example: -->
<!-- - [2026-02-01] Chose to build UI first with mock data to validate UX early -->

---

## Blockers

<!-- Document any blockers encountered -->

---

## Testing Results

**Test Coverage**: -
**Tests Passing**: -/-
**TypeScript Errors**: -

<!-- Update as tests are written and run -->

---

## Component Status

| Component | Status | Tests |
|-----------|--------|-------|
| LeaveTypeForm | Not implemented | - |
| HolidayForm | Not implemented | - |
| PreferencesForm | Not implemented | - |
| PolicyBuilder | Not implemented | - |
| PlanSummary | Not implemented | - |
| LeaveBreakdown | Not implemented | - |
| PlanComparison | Not implemented | - |
| MockApi | Not implemented | - |

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Create `apps/web/` SvelteKit project structure
2. Install dependencies (Svelte, TypeScript, testing libraries)
3. Create `mocks/` directory with TypeScript interfaces
4. Build mock data scenarios (A, B, C, D)
5. Implement mock API service
6. Create Svelte stores for state management
7. Build LeaveTypeForm component
8. Build HolidayForm component
9. Build PreferencesForm component
10. Build PolicyBuilder orchestrator
11. Build results display components (PlanSummary, LeaveBreakdown, PlanComparison)
12. Create input page route (+page.svelte)
13. Create results page route
14. Wire up mock API to stores
15. Test full mock user flow
16. Write component and store tests
17. Run TypeScript strict check
18. Update this document with results
19. **Move to Phase 2: Calendar Visualization**

