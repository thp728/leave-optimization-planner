# Phase 1: Basic Frontend UI & Forms (with Mock Data)

**Status**: Implementation Complete — Testing Pending
**Started**: 2026-02-08
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

- [x] `mockPolicies.ts` - Sample leave policies (PTO, sick, floating holidays)
- [x] `mockHolidays.ts` - Sample holiday calendars (US, UK, etc.)
- [x] `mockPlans.ts` - Pre-generated optimization results for testing
- [x] `mockApi.ts` - Mock API service that mimics real API responses
- [x] `types.ts` - Manual TypeScript interfaces (will later be generated from OpenAPI)

### Input Forms (`apps/web/src/lib/components/forms/`)

- [x] `LeaveTypeForm.svelte` - Add/edit leave types (scaffolded)
- [x] `HolidayForm.svelte` - Define holidays (scaffolded)
- [x] `PreferencesForm.svelte` - Planning horizon, break patterns (scaffolded)
- [x] `PolicyBuilder.svelte` - Orchestrates all input forms ⭐ CRITICAL (scaffolded)

### State Management (`apps/web/src/lib/stores/`)

- [x] `policyStore.ts` - Svelte store for leave policies
- [x] `holidayStore.ts` - Holiday calendar state
- [x] `preferencesStore.ts` - User preferences
- [x] `planStore.ts` - Optimization results (mock initially)

### Basic Results Display (`apps/web/src/lib/components/`)

- [x] `PlanSummary.svelte` - Plan metadata (scaffolded)
- [x] `LeaveBreakdown.svelte` - Table of leave consumption by type (scaffolded)
- [x] `PlanComparison.svelte` - Side-by-side ranked plan comparison (scaffolded)

### Routes (`apps/web/src/routes/`)

- [x] `+page.svelte` - Landing/input page with policy builder (scaffolded)
- [x] `results/+page.svelte` - Results page (table view) (scaffolded)

### Mock Scenarios

- [x] **Scenario A**: Standard 20 PTO days + 10 holidays - simple optimization
- [x] **Scenario B**: Mixed leave types (PTO, sick, floating) - priority handling
- [x] **Scenario C**: End-of-year expiring leave - use-it-or-lose-it scenario
- [x] **Scenario D**: Zero paid leave feasible - optimal scenario

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
  accrualSchedule: "monthly" | "quarterly" | "yearly" | "upfront";
  carryoverDays: number;
  expiresAtYearEnd: boolean;
}

interface Holiday {
  date: string; // ISO format
  name: string;
  type: "public" | "company";
}

interface UserPreferences {
  planningHorizon: { start: string; end: string };
  minConsecutiveDaysOff: number;
  maxConsecutiveDaysOff: number;
  preferredBreakFrequency: "monthly" | "quarterly" | "flexible";
}

interface DayAssignment {
  date: string;
  type: "work" | "weekend" | "holiday" | "leave";
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

- [2026-02-08] Scaffolding-only approach for learning - providing structure and TODO guidance without implementation
- [2026-02-08] Created 4 mock scenarios (A, B, C, D) covering standard, mixed, expiring, and generous leave policies
- [2026-02-08] TypeScript interfaces defined in `types.ts` - will be replaced by OpenAPI-generated types in Phase 5
- [2026-02-08] Components use Svelte 5 runes syntax (`$props()`, `$state()`) as per project guidelines
- [2026-03-01] All Phase 1 components fully implemented: forms, stores, mock data, result components, and both routes

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

| Component       | Status      | Tests |
| --------------- | ----------- | ----- |
| LeaveTypeForm   | Implemented | -     |
| HolidayForm     | Implemented | -     |
| PreferencesForm | Implemented | -     |
| PolicyBuilder   | Implemented | -     |
| PlanSummary     | Implemented | -     |
| LeaveBreakdown  | Implemented | -     |
| PlanComparison  | Implemented | -     |
| MockApi         | Implemented | -     |

---

## Notes

### Key Files to Reference

- `apps/web/src/lib/mocks/types.ts` - All TypeScript interfaces
- `apps/web/src/lib/stores/` - State management already complete
- `apps/web/src/lib/mocks/mockPolicies.ts` - Policy templates and scenarios
- `apps/web/src/lib/mocks/mockHolidays.ts` - Holiday calendar data
- `apps/web/src/lib/mocks/mockPlans.ts` - Pre-generated optimization results
- `apps/web/src/routes/layout.css` - Design system tokens

### Testing Strategy

After implementing each component:

1. Run `npm run check` for TypeScript validation
2. Run `npm run lint` for code style
3. Test in browser with mock scenarios
4. Verify responsive design on mobile/desktop

---

## Next Steps

1. Write component tests (form validation and submission)
2. Write store tests (state mutations and derived values)
3. Achieve >70% test coverage
4. Update this document with test results
5. **Move to Phase 2: Calendar Visualization**
