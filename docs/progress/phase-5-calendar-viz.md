# Phase 5: Calendar Visualization & UX Polish

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Add calendar view and improve user experience.

---

## Deliverables Checklist

### Calendar Component (`apps/web/src/lib/components/calendar/`)
- [ ] `Calendar.svelte` - Core calendar grid ⭐ CRITICAL
- [ ] `DayCell.svelte` - Individual day display
- [ ] `MonthView.svelte` - Month-based navigation
- [ ] `CalendarLegend.svelte` - Color coding explanation

### Calendar Features
- [ ] Highlight holidays (read-only)
- [ ] Highlight suggested leave days (color by leave type)
- [ ] Show continuous break spans visually
- [ ] Tooltips on hover (why this leave type?)
- [ ] Switch between ranked plans

### Enhanced Results Page
- [ ] Split view: Calendar + Summary panel
- [ ] Plan ranking selector
- [ ] Explanations panel (solver rationale)
- [ ] Export functionality (JSON/CSV)

### UX Improvements
- [ ] Loading states during optimization
- [ ] Error messaging improvements
- [ ] Form validation feedback
- [ ] Responsive design (mobile-friendly)
- [ ] Accessibility (ARIA labels, keyboard nav)

### Derived Stores (`apps/web/src/lib/stores/`)
- [ ] `calendarStore.ts` - Computed calendar data from plan
- [ ] `breakLengthStore.ts` - Continuous break calculations

### Testing
- [ ] Visual tests: Calendar renders correctly for all months
- [ ] Interaction tests: Hover, click, navigation
- [ ] Responsiveness tests: Mobile, tablet, desktop
- [ ] Accessibility audit: Screen reader compatibility
- [ ] Edge case rendering: Leap years, different weekend patterns
- [ ] Achieve >70% test coverage

---

## Key Files

- [apps/web/src/lib/components/calendar/Calendar.svelte](../../apps/web/src/lib/components/calendar/Calendar.svelte) ⭐ CRITICAL
- [apps/web/src/lib/components/calendar/DayCell.svelte](../../apps/web/src/lib/components/calendar/DayCell.svelte)
- [apps/web/src/lib/components/calendar/MonthView.svelte](../../apps/web/src/lib/components/calendar/MonthView.svelte)
- [apps/web/src/lib/components/ExplanationPanel.svelte](../../apps/web/src/lib/components/ExplanationPanel.svelte)
- [apps/web/src/lib/stores/calendarStore.ts](../../apps/web/src/lib/stores/calendarStore.ts)
- [apps/web/src/lib/components/LoadingSpinner.svelte](../../apps/web/src/lib/components/LoadingSpinner.svelte)

---

## Success Criteria

- ✓ Calendar displays holidays and leave suggestions clearly
- ✓ Continuous breaks visually distinct
- ✓ Can switch between ranked plans smoothly
- ✓ Explanations are understandable
- ✓ Works on mobile devices
- ✓ Passes accessibility audit
- ✓ Export functionality works

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
| ExplanationPanel | Not implemented | - |
| LoadingSpinner | Not implemented | - |

---

## Accessibility Checklist

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announcements for date navigation
- [ ] ARIA labels for calendar cells
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Tooltips accessible via keyboard

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Create calendar/ component directory
2. Build Calendar core component
3. Build DayCell component
4. Build MonthView navigation
5. Build CalendarLegend
6. Create derived stores for calendar data
7. Add tooltips and explanations
8. Build LoadingSpinner component
9. Enhance results page with calendar view
10. Add export functionality
11. Test responsiveness on mobile
12. Run accessibility audit
13. Update this document with results
14. Move to Phase 6
