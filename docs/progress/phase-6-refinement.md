# Phase 6: Refinement & Edge Cases

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Handle edge cases, improve explainability, add polish.

---

## Deliverables Checklist

### Edge Case Handling
- [ ] Mid-period accruals UI feedback
- [ ] Expiring leave warnings
- [ ] Infeasible scenario explanations
- [ ] Leap year handling validation

### Enhanced Explainability
- [ ] Per-day rationale tooltips
- [ ] "Why not other leave types?" explanations
- [ ] Alternative plan comparisons
- [ ] Trade-off visualizations

### Optimization Tuning
- [ ] Configurable objective weights
- [ ] User-adjustable preferences (UI + API)
- [ ] Multi-solution generation (top N plans)

### Data Persistence
- [ ] Save/load policy configurations
- [ ] Bookmark favorite plans
- [ ] History of optimization runs

### Documentation
- [ ] User guide for policy configuration
- [ ] FAQ for common scenarios
- [ ] Developer docs for solver customization

### Performance Optimization
- [ ] Frontend bundle size optimization
- [ ] API response caching
- [ ] Database indexing
- [ ] Solver warm-start strategies

---

## Key Files

- [apps/api/services/explainer_service.py](../../apps/api/services/explainer_service.py)
- [apps/web/src/lib/components/TradeoffVisualization.svelte](../../apps/web/src/lib/components/TradeoffVisualization.svelte)
- [apps/api/routers/configurations.py](../../apps/api/routers/configurations.py)
- [docs/user-guide.md](../user-guide.md)
- [docs/solver-customization.md](../solver-customization.md)

---

## Success Criteria

- ✓ All documented edge cases handled gracefully
- ✓ Explanations clear for non-technical users
- ✓ Can generate and compare top 3-5 plans
- ✓ Saved configurations load correctly
- ✓ User documentation comprehensive
- ✓ Performance targets maintained

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
**Performance**: -

<!-- Update as tests are written and run -->

---

## Edge Cases Checklist

- [ ] Mid-period monthly accruals
- [ ] Mid-period quarterly accruals
- [ ] Mid-period yearly accruals
- [ ] Year-end expiring leaves
- [ ] Leap year February 29th
- [ ] Locale-specific weekends (Fri-Sat vs Sat-Sun)
- [ ] Infeasible zero-paid-leave scenarios
- [ ] Negative balance prevention
- [ ] Pre-vesting leave usage prevention

---

## Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Solver execution | <2s | - | Not tested |
| API response time | <2.5s | - | Not tested |
| Frontend bundle size | <500KB | - | Not tested |
| Lighthouse accessibility | >90 | - | Not tested |

---

## Documentation Status

| Document | Status | Completeness |
|----------|--------|--------------|
| User guide | Not started | 0% |
| FAQ | Not started | 0% |
| Solver customization | Not started | 0% |

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Identify and test all documented edge cases
2. Enhance explainer service for better rationale
3. Build trade-off visualization component
4. Add configurable optimization weights
5. Implement save/load functionality
6. Create user documentation
7. Create FAQ
8. Write solver customization guide
9. Optimize frontend bundle size
10. Add API response caching
11. Add database indexes
12. Run full edge case test suite
13. Update this document with final results
14. Mark MVP as complete!
