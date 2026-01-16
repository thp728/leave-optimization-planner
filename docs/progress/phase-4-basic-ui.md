# Phase 4: Basic Frontend UI & Forms

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Build input forms and API integration (no calendar visualization yet).

---

## Deliverables Checklist

### Type Generation
- [ ] Script to generate TypeScript types from OpenAPI spec
- [ ] `packages/schemas/types.ts` - Generated types

### API Client (`apps/web/src/lib/api/`)
- [ ] `client.ts` - Fetch wrapper with type safety
- [ ] `optimize.ts` - Typed optimize endpoint calls
- [ ] `holidays.ts` - Holiday calendar fetchers

### Input Forms (`apps/web/src/lib/components/forms/`)
- [ ] `LeaveTypeForm.svelte` - Add/edit leave types
- [ ] `HolidayForm.svelte` - Define holidays
- [ ] `PreferencesForm.svelte` - Planning horizon, break patterns
- [ ] `PolicyBuilder.svelte` - Orchestrates all input forms

### State Management (`apps/web/src/lib/stores/`)
- [ ] `policyStore.ts` - Svelte store for leave policies
- [ ] `holidayStore.ts` - Holiday calendar state
- [ ] `preferencesStore.ts` - User preferences
- [ ] `planStore.ts` - Optimization results

### Basic Results Display (`apps/web/src/lib/components/`)
- [ ] `PlanSummary.svelte` - Plan metadata (no calendar)
- [ ] `LeaveBreakdown.svelte` - Table of leave consumption by type
- [ ] `PlanComparison.svelte` - Side-by-side ranked plan comparison

### Routes (`apps/web/src/routes/`)
- [ ] `+page.svelte` - Landing/input page
- [ ] `results/+page.svelte` - Results page (table view)

### Testing
- [ ] Component tests: Form validation and submission
- [ ] Store tests: State mutations and derived values
- [ ] Integration tests: Full user flow (input → API → results)
- [ ] TypeScript strict mode validation
- [ ] Achieve >70% test coverage

---

## Key Files

- [scripts/generate_types.sh](../../scripts/generate_types.sh)
- [packages/schemas/types.ts](../../packages/schemas/types.ts)
- [apps/web/src/lib/api/client.ts](../../apps/web/src/lib/api/client.ts)
- [apps/web/src/lib/components/forms/PolicyBuilder.svelte](../../apps/web/src/lib/components/forms/PolicyBuilder.svelte)
- [apps/web/src/lib/stores/policyStore.ts](../../apps/web/src/lib/stores/policyStore.ts)
- [apps/web/src/lib/stores/planStore.ts](../../apps/web/src/lib/stores/planStore.ts)
- [apps/web/src/routes/+page.svelte](../../apps/web/src/routes/+page.svelte)
- [apps/web/src/routes/results/+page.svelte](../../apps/web/src/routes/results/+page.svelte)

---

## Success Criteria

- ✓ User can input complete policy configuration via forms
- ✓ Forms validate inputs client-side
- ✓ API calls properly typed and error-handled
- ✓ Results display shows plan metadata and breakdown
- ✓ Can compare multiple ranked plans
- ✓ No runtime type errors

---

## Decisions Made

<!-- Add decisions as implementation progresses -->

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

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Generate TypeScript types from OpenAPI spec
2. Create API client wrapper
3. Create Svelte stores for state management
4. Build LeaveTypeForm component
5. Build HolidayForm component
6. Build PreferencesForm component
7. Build PolicyBuilder orchestrator
8. Build results display components
9. Update routes (input and results pages)
10. Write component tests
11. Test full user flow
12. Update this document with results
13. Move to Phase 5
