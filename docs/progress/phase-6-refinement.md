# Phase 6: Refinement & Edge Cases

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Handle edge cases, improve explainability, add polish. Complete the MVP with comprehensive documentation.

---

## Deliverables Checklist

### Edge Case Handling
- [ ] Mid-period accruals UI feedback (show "vests on X date")
- [ ] Expiring leave warnings (highlight leaves expiring soon)
- [ ] Infeasible scenario explanations (why zero paid isn't possible)
- [ ] Leap year handling validation (Feb 29 edge cases)
- [ ] Negative balance prevention (hard constraint validation)
- [ ] Pre-vesting leave usage prevention (soft warning vs hard block)

### Enhanced Explainability
- [ ] Per-day rationale tooltips ("Using PTO because it expires soon")
- [ ] "Why not other leave types?" explanations
- [ ] Alternative plan comparisons ("Plan 2 uses more PTO but gives longer break")
- [ ] Trade-off visualizations (scatter plot: days off vs paid leave used)

### Optimization Tuning
- [ ] Configurable objective weights (advanced settings)
- [ ] User-adjustable preferences (UI + API)
- [ ] Multi-solution generation (top N plans, currently hardcoded)

### Data Persistence
- [ ] Save/load policy configurations (localStorage for MVP)
- [ ] Bookmark favorite plans
- [ ] History of optimization runs (last 10)

### Documentation
- [ ] User guide for policy configuration (`docs/user-guide.md`)
- [ ] FAQ for common scenarios (`docs/faq.md`)
- [ ] Developer docs for solver customization (`docs/solver-customization.md`)
- [ ] API documentation (from OpenAPI spec)
- [ ] Update main README with setup instructions

### Performance Optimization
- [ ] Frontend bundle size optimization (tree shaking, lazy loading)
- [ ] API response caching (Redis/memory for repeated queries)
- [ ] Database indexing for policy lookups
- [ ] Solver warm-start strategies (for similar inputs)

### Production Readiness
- [ ] Environment configuration (.env files)
- [ ] Docker setup for deployment
- [ ] Health check endpoints
- [ ] Logging and monitoring
- [ ] Error tracking (Sentry or similar)

---

## Key Files

- [apps/api/services/explainer_service.py](../../apps/api/services/explainer_service.py)
- [apps/web/src/lib/components/TradeoffVisualization.svelte](../../apps/web/src/lib/components/TradeoffVisualization.svelte)
- [apps/api/routers/configurations.py](../../apps/api/routers/configurations.py)
- [apps/web/src/lib/stores/persistenceStore.ts](../../apps/web/src/lib/stores/persistenceStore.ts)
- [docs/user-guide.md](../user-guide.md)
- [docs/faq.md](../faq.md)
- [docs/solver-customization.md](../solver-customization.md)
- [Dockerfile](../../Dockerfile)
- [docker-compose.yml](../../docker-compose.yml)

---

## Success Criteria

- ✓ All documented edge cases handled gracefully
- ✓ Explanations clear for non-technical users
- ✓ Can generate and compare top 3-5 plans
- ✓ Saved configurations load correctly
- ✓ User documentation comprehensive and clear
- ✓ Performance targets maintained (<2s solver, <2.5s end-to-end)
- ✓ Frontend bundle <500KB gzipped
- ✓ Lighthouse accessibility score >90
- ✓ MVP ready for user testing

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

- [ ] Mid-period monthly accruals (vesting during horizon)
- [ ] Mid-period quarterly accruals
- [ ] Mid-period yearly accruals
- [ ] Year-end expiring leaves (use by Dec 31)
- [ ] Leap year February 29th (valid date handling)
- [ ] Locale-specific weekends (Fri-Sat vs Sat-Sun)
- [ ] Infeasible zero-paid-leave scenarios (explain why)
- [ ] Negative balance prevention (validation)
- [ ] Pre-vesting leave usage prevention (warning UI)
- [ ] Overlapping holiday and weekend (proper counting)
- [ ] Very long planning horizons (24+ months)
- [ ] Zero leave days available (empty plan)
- [ ] All days are holidays (extreme case)

---

## Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Solver execution | <2s | - | Not tested |
| API response time | <2.5s | - | Not tested |
| Frontend bundle size | <500KB | - | Not tested |
| Lighthouse accessibility | >90 | - | Not tested |
| Lighthouse performance | >80 | - | Not tested |

---

## Documentation Status

| Document | Status | Completeness |
|----------|--------|--------------|
| User guide | Not started | 0% |
| FAQ | Not started | 0% |
| Solver customization | Not started | 0% |
| API docs | Not started | 0% |
| Setup README | Not started | 0% |

---

## MVP Launch Checklist

- [ ] All 6 phases complete
- [ ] All tests passing
- [ ] Test coverage targets met
- [ ] Performance benchmarks achieved
- [ ] Documentation complete
- [ ] Accessibility audit passed
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified
- [ ] No critical bugs in issue tracker
- [ ] Tag release as `v1.0.0-mvp`

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Identify and test all documented edge cases
2. Enhance explainer service for better rationale
3. Build trade-off visualization component
4. Add configurable optimization weights (advanced mode)
5. Implement save/load functionality (localStorage)
6. Add plan history feature
7. Create user documentation (user-guide.md)
8. Create FAQ (faq.md)
9. Write solver customization guide
10. Write API documentation
11. Optimize frontend bundle size (code splitting, lazy loading)
12. Add API response caching if needed
13. Add database indexes if needed
14. Run full edge case test suite
15. Run accessibility audit
16. Cross-browser testing
17. Mobile testing
18. Final performance benchmarking
19. Update main README
20. Tag release
21. **MVP COMPLETE! 🎉**

