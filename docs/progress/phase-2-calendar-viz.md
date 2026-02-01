# Phase 2: Calendar Visualization & UX Polish

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Add calendar view to visualize leave plans and improve user experience. Continue using mock data for rapid iteration.

---

## Deliverables Checklist

### Calendar Component (`apps/web/src/lib/components/calendar/`)
- [ ] `Calendar.svelte` - Core calendar grid ⭐ CRITICAL
- [ ] `DayCell.svelte` - Individual day display with leave type colors
- [ ] `MonthView.svelte` - Month-based navigation with prev/next
- [ ] `CalendarLegend.svelte` - Color coding explanation
- [ ] `YearNavigator.svelte` - Year selection for multi-year planning

### Calendar Features
- [ ] Highlight holidays (read-only, distinct styling)
- [ ] Highlight suggested leave days (color by leave type)
- [ ] Show continuous break spans visually (grouping, borders)
- [ ] Tooltips on hover: date, leave type, rationale
- [ ] Switch between ranked plans smoothly
- [ ] Week/weekend distinction (gray weekends)

### Enhanced Results Page
- [ ] Split view: Calendar (left) + Summary panel (right)
- [ ] Plan ranking selector (tabs or dropdown)
- [ ] Explanations panel (solver rationale display)
- [ ] Export functionality (JSON/CSV) - mock implementation

### UX Improvements
- [ ] Loading states during "optimization" (mock delay simulation)
- [ ] Error messaging improvements
- [ ] Form validation feedback (inline errors)
- [ ] Responsive design (mobile-friendly calendar)
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Empty states (no plans generated yet)
- [ ] Success notifications

### Derived Stores (`apps/web/src/lib/stores/`)
- [ ] `calendarStore.ts` - Computed calendar data from plan
- [ ] `breakLengthStore.ts` - Continuous break calculations
- [ ] `statisticsStore.ts` - Aggregated metrics (days off by month, etc.)

### Testing
- [ ] Visual tests: Calendar renders correctly for all months
- [ ] Interaction tests: Hover, click, navigation
- [ ] Responsiveness tests: Mobile, tablet, desktop
- [ ] Accessibility audit: Screen reader compatibility
- [ ] Edge case rendering: Leap years, different month lengths
- [ ] Mock data edge cases: Empty plans, single-day breaks
- [ ] Achieve >70% test coverage

---

## Key Files

- [apps/web/src/lib/components/calendar/Calendar.svelte](../../apps/web/src/lib/components/calendar/Calendar.svelte) ⭐ CRITICAL
- [apps/web/src/lib/components/calendar/DayCell.svelte](../../apps/web/src/lib/components/calendar/DayCell.svelte)
- [apps/web/src/lib/components/calendar/MonthView.svelte](../../apps/web/src/lib/components/calendar/MonthView.svelte)
- [apps/web/src/lib/components/calendar/CalendarLegend.svelte](../../apps/web/src/lib/components/calendar/CalendarLegend.svelte)
- [apps/web/src/lib/components/ExplanationPanel.svelte](../../apps/web/src/lib/components/ExplanationPanel.svelte)
- [apps/web/src/lib/components/LoadingSpinner.svelte](../../apps/web/src/lib/components/LoadingSpinner.svelte)
- [apps/web/src/lib/stores/calendarStore.ts](../../apps/web/src/lib/stores/calendarStore.ts)
- [apps/web/src/lib/stores/breakLengthStore.ts](../../apps/web/src/lib/stores/breakLengthStore.ts)

---

## Success Criteria

- ✓ Calendar displays holidays and leave suggestions clearly
- ✓ Continuous breaks are visually distinct
- ✓ Can switch between ranked plans smoothly
- ✓ Explanations are displayed understandably
- ✓ Works on mobile devices
- ✓ Passes accessibility audit
- ✓ Mock export functionality works
- ✓ Loading states provide good UX

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
**Accessibility Score**: -

<!-- Update as tests are written and run -->

---

## Component Status

| Component | Status | Accessibility |
|-----------|--------|---------------|
| Calendar | Not implemented | - |
| DayCell | Not implemented | - |
| MonthView | Not implemented | - |
| CalendarLegend | Not implemented | - |
| YearNavigator | Not implemented | - |
| ExplanationPanel | Not implemented | - |
| LoadingSpinner | Not implemented | - |

---

## Accessibility Checklist

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announcements for date navigation
- [ ] ARIA labels for calendar cells (date, leave type)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Tooltips accessible via keyboard
- [ ] Plan ranking selector is keyboard accessible

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Create calendar/ component directory
2. Build Calendar core component with grid layout
3. Build DayCell component with leave type color coding
4. Build MonthView navigation with prev/next buttons
5. Build YearNavigator for multi-year support
6. Build CalendarLegend explaining colors
7. Create derived stores for calendar data computation
8. Add tooltips with rationale explanations
9. Build LoadingSpinner component with animation
10. Build ExplanationPanel for solver rationale display
11. Enhance results page with split view layout
12. Add plan ranking selector (tabs/dropdown)
13. Implement mock export functionality
14. Add loading states to forms
15. Add form validation feedback
16. Test responsiveness on mobile/tablet/desktop
17. Run accessibility audit
18. Update mock data to include more complex scenarios
19. Test full user flow with calendar
20. Write component and interaction tests
21. Update this document with results
22. **Move to Phase 3: Data Models & Foundation**

