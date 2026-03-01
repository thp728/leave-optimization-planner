# Frontend Test Plan: Component Tests, Store Tests, >70% Coverage

## Context

Phase 1 (Basic UI) is implementation-complete but has zero test infrastructure — no vitest, no test libraries, no test files. The three remaining deliverables from [phase-1-basic-ui.md](phase-1-basic-ui.md) are:
1. Component tests (form validation and submission)
2. Store tests (state mutations and derived values)
3. Achieve >70% test coverage

## Step 1: Install test dependencies

Add to `apps/web/` devDependencies:
```
vitest  @vitest/coverage-v8  happy-dom
@testing-library/svelte  @testing-library/jest-dom  @testing-library/user-event
```

Add scripts to `apps/web/package.json`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

## Step 2: Create test configuration

**`apps/web/vitest.config.ts`** — Separate from vite.config.ts (must use `svelte()` not `sveltekit()` for test env):
- Environment: `happy-dom`
- Setup file: `src/test/setup.ts`
- Path aliases: `$lib` → `src/lib`, `$app/navigation` and `$app/stores` → hand-written mocks
- `resolve.conditions: ['browser']`
- Coverage: v8 provider, include `src/lib/**/*.{ts,svelte}`, exclude `src/lib/mocks/**`, thresholds at 70%

**`apps/web/src/test/setup.ts`** — Import `@testing-library/jest-dom/vitest`, polyfill `crypto.randomUUID` if needed

**`apps/web/src/test/mocks/navigation.ts`** — Mock `goto`, `invalidate`, etc. as `vi.fn()`

**`apps/web/src/test/mocks/stores.ts`** — Mock `page`, `navigating`, `updated` as readable stores

## Step 3: Extract pure helpers for testability

Two sets of pure functions are currently private inside Svelte components. Extract them so they can be unit-tested directly:

1. **`apps/web/src/lib/utils/leaveBreakdown.ts`** — Move `computeByLeaveType()` and `computeByMonth()` from `LeaveBreakdown.svelte` (lines 12-51)
2. **`apps/web/src/lib/utils/dateUtils.ts`** — Move `isValidDate()` from `HolidayForm.svelte` (lines 26-30)

Update both components to import from the new util files. No behavior change.

## Step 4: Store tests

All in `apps/web/src/lib/stores/`. Each test imports the store, calls mutations, reads with `get()`.

### `policyStore.test.ts`
| Test | What |
|------|------|
| `add()` | Adds policy with generated UUID, merges partial overrides, unique IDs per call |
| `updatePolicy()` | Updates matching policy, no-op for unknown ID |
| `remove()` | Removes by ID, no-op for unknown ID |
| `setPriority()` | Updates priority field |
| `reset()` / `loadPreset()` | Clears / replaces array |
| `totalLeaveDays` | Sum of daysPerYear, reactive on add |
| `policiesByPriority` | Sorted ascending, doesn't mutate original |
| `isPolicyValid` | False when empty, false for blank name/zero days/zero priority, true when all valid |

### `holidayStore.test.ts`
| Test | What |
|------|------|
| `add()` | Appends new, upserts on duplicate date |
| `remove()` | Removes by date, no-op for unknown |
| `updateHoliday()` | Merges updates by date |
| `loadPreset()` / `clear()` | Replaces / empties |
| `importFromTemplate()` | Async dynamic import for 'us' and 'uk' |
| `holidaysByDate` | Sorted chronologically |
| `publicHolidays` / `companyHolidays` | Filtered by type |
| `holidayCount` / `holidayDateSet` | Count and Set\<string\> |

### `preferencesStore.test.ts`
| Test | What |
|------|------|
| `setStartDate/setEndDate/setPlanningHorizon` | Updates correct field |
| `setMinConsecutiveDays` | Clamps to >= 1 |
| `setMaxConsecutiveDays` | Clamps to >= current min |
| `reset()` / `load()` | Restores defaults / loads arbitrary |
| `horizonDurationDays` | Correct day count, 0 when equal, negative when reversed |
| `isPreferencesValid` | False for start>=end, min>max, max>365; true for valid combos |

### `planStore.test.ts`
| Test | What |
|------|------|
| `optimize()` | Sets loading→success, auto-selects first plan, stores metadata; sets loading→error on rejection, re-throws |
| `selectPlan()` / `clear()` / `clearError()` / `setPlans()` | Basic state transitions |
| All derived stores | `selectedPlan`, `sortedPlans`, `isLoading`, `hasError`, `hasPlans`, `planCount`, `bestPlan` |

Uses `vi.mock('$lib/mocks/mockApi')` to control the async optimize call.

## Step 5: Utility tests

### `apps/web/src/lib/utils/dateUtils.test.ts`
- Valid ISO dates, empty string, non-date strings, invalid calendar dates (Feb 30, month 13), leap year handling, wrong format (missing zero-padding)

### `apps/web/src/lib/utils/leaveBreakdown.test.ts`
- `computeByLeaveType`: empty input, ignores non-leave types, counts per type, fallback name for unknown ID, sorted descending by days
- `computeByMonth`: empty input, ignores work days, counts per month, sorted chronologically, includes holidays

## Step 6: Component tests

All use `@testing-library/svelte` + `userEvent.setup()`. File extension `.svelte.test.ts`.

### `LeaveTypeForm.svelte.test.ts`
- Renders with prop values populated
- **Validation**: Name error shown only after touch (not before), clears on valid input; days/priority errors on invalid values
- **Submission**: `onUpdate` called with trimmed values when valid; not called when invalid
- **Delete flow**: No delete button without `onDelete` prop; click→confirm/cancel→calls `onDelete` or resets
- **Toggle**: Expires at year end switch toggles aria-checked

### `HolidayForm.svelte.test.ts`
- Date validation errors (empty, invalid format)
- Name validation (empty, >100 chars)
- Type toggle (public/company) with aria-pressed
- Delete confirm flow

### `PreferencesForm.svelte.test.ts`
- Date range errors only shown when both fields touched
- min/max days validation (< 1, > 365, max < min)
- Break frequency toggle
- `applyPreset` (6 months / 1 year buttons set end date correctly)

### `PolicyBuilder.svelte.test.ts` (integration-style)
- Renders 3 tabs with correct ARIA
- Optimize button disabled when form incomplete, enabled when stores valid
- `handleOptimize` calls `planStore.optimize` and navigates to `/results`
- Reset clears all stores
- Missing items warning shown when incomplete

### `PlanSummary.svelte.test.ts`
- Trophy badge for rank 1, "Rank #N" for others
- Displays all metrics; efficiency shows "∞×" when paidLeaveDays=0
- Rationale truncation at 120 chars with expand/collapse
- Select button only renders with `onSelect` prop

### `PlanComparison.svelte.test.ts`
- Empty state when no plans
- Correct column count (plans + 1)
- Best values highlighted
- `onSelectPlan` called on click
- Single-plan note

## Implementation order

1. Install packages & create config files (Steps 1-2)
2. Extract utils (Step 3)
3. Utility tests (Step 5) — fast feedback, validate setup works
4. Store tests (Step 4) — policyStore → holidayStore → preferencesStore → planStore
5. Component tests (Step 6) — forms first, then results, PolicyBuilder last
6. Run `npm run test:coverage`, iterate on gaps if needed

## Key files to modify
- `apps/web/package.json` — add deps + scripts
- `apps/web/src/lib/components/results/LeaveBreakdown.svelte` — import extracted utils
- `apps/web/src/lib/components/forms/HolidayForm.svelte` — import extracted `isValidDate`

## Key files to create
- `apps/web/vitest.config.ts`
- `apps/web/src/test/setup.ts`
- `apps/web/src/test/mocks/navigation.ts`
- `apps/web/src/test/mocks/stores.ts`
- `apps/web/src/lib/utils/dateUtils.ts`
- `apps/web/src/lib/utils/leaveBreakdown.ts`
- 4 store test files + 2 utility test files + 6 component test files = **12 test files**

## Verification
1. `cd apps/web && npm test` — all tests pass
2. `npm run test:coverage` — all thresholds >= 70%
3. `npm run check` — TypeScript still passes after util extraction
4. `npm run build` — build succeeds with no regressions
