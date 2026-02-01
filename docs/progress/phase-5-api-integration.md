# Phase 5: API Layer & Integration

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Expose solver via REST API and integrate with frontend. Replace mock data with real optimization calls while maintaining UI compatibility.

---

## Deliverables Checklist

### API Endpoints (`apps/api/routers/`)
- [ ] `optimize.py` - POST /optimize endpoint ⭐ CRITICAL
- [ ] `holidays.py` - GET /holidays endpoint
- [ ] `plans.py` - GET /plans/{id} endpoint
- [ ] `health.py` - GET /health endpoint (diagnostics)

### Service Layer (`apps/api/services/`)
- [ ] `policy_service.py` - Policy CRUD operations
- [ ] `holiday_service.py` - Holiday calendar management
- [ ] `optimization_service.py` - Orchestrates solver invocation ⭐ CRITICAL
- [ ] `plan_service.py` - Saved plan persistence
- [ ] `validation_service.py` - Input validation and sanitization

### Request/Response Schemas (`apps/api/schemas/`)
- [ ] `optimize_request.py` - Input validation schema
- [ ] `optimize_response.py` - Structured plan output
- [ ] `error_responses.py` - Standardized error formats

### Integration Layer
- [ ] Adapter to convert API models → solver inputs (`apps/api/adapters/solver_adapter.py`)
- [ ] Result transformer: solver output → API response
- [ ] Error handling for infeasible scenarios
- [ ] Response caching for performance (optional Phase 6)

### OpenAPI Specification
- [ ] Auto-generated via FastAPI
- [ ] Export to `packages/schemas/openapi.yaml`

### Frontend Integration
- [ ] Replace mock API with real API client
- [ ] Add error handling for API failures
- [ ] Add retry logic for transient failures
- [ ] Handle infeasible scenario messaging
- [ ] Loading states for real API calls (slower than mock)

### Type Generation
- [ ] Script to generate TypeScript types from OpenAPI spec (`scripts/generate_types.sh`)
- [ ] `packages/schemas/types.ts` - Generated types
- [ ] Compare generated types with manual types from Phase 1
- [ ] Update frontend to use generated types

### Testing
- [ ] API tests: Full request/response cycle
- [ ] Integration tests: API + Solver end-to-end
- [ ] Frontend integration tests: Real API calls
- [ ] Error handling tests: Invalid inputs, infeasible scenarios
- [ ] Performance tests: Response time <2.5s (end-to-end)
- [ ] Achieve >75% test coverage

---

## Key Files

- [apps/api/routers/optimize.py](../../apps/api/routers/optimize.py) ⭐ CRITICAL
- [apps/api/routers/holidays.py](../../apps/api/routers/holidays.py)
- [apps/api/routers/plans.py](../../apps/api/routers/plans.py)
- [apps/api/services/optimization_service.py](../../apps/api/services/optimization_service.py) ⭐ CRITICAL
- [apps/api/adapters/solver_adapter.py](../../apps/api/adapters/solver_adapter.py)
- [apps/api/tests/test_optimize_endpoint.py](../../apps/api/tests/test_optimize_endpoint.py)
- [packages/schemas/openapi.yaml](../../packages/schemas/openapi.yaml)
- [scripts/generate_types.sh](../../scripts/generate_types.sh)
- [apps/web/src/lib/api/client.ts](../../apps/web/src/lib/api/client.ts)

---

## Success Criteria

- ✓ POST /optimize accepts policy JSON and returns ranked plans
- ✓ GET /holidays returns structured calendar data
- ✓ GET /plans/{id} retrieves saved plans
- ✓ Clear error messages for validation failures
- ✓ OpenAPI spec generated and exportable
- ✓ TypeScript types generated from OpenAPI
- ✓ Frontend successfully calls real API (not mock)
- ✓ UI behavior matches mock data experience
- ✓ All endpoints have integration tests
- ✓ End-to-end response time <2.5 seconds

---

## API Endpoints

| Method | Endpoint | Status | Response Time |
|--------|----------|--------|---------------|
| POST | /optimize | Not implemented | - |
| GET | /holidays | Not implemented | - |
| GET | /plans/{id} | Not implemented | - |
| GET | /health | Not implemented | - |

**Target**: <2.5s end-to-end (frontend → API → solver → response)

---

## Integration Checklist

### Backend Setup
- [ ] FastAPI application initialization
- [ ] Router registration
- [ ] Error handling middleware
- [ ] CORS configuration for frontend
- [ ] Request/response logging

### Solver Integration
- [ ] Import solver package
- [ ] Build adapter layer (API models → solver format)
- [ ] Handle solver exceptions
- [ ] Transform solver results to API format
- [ ] Handle infeasible scenarios gracefully

### Frontend Updates
- [ ] Create real API client (replace mockApi.ts)
- [ ] Update stores to use real API
- [ ] Add error handling UI (toast notifications, error pages)
- [ ] Add loading states for slower real API
- [ ] Test full user flow with real optimization

### Type Safety
- [ ] Generate TypeScript types from OpenAPI
- [ ] Verify type compatibility with Phase 1 manual types
- [ ] Update all frontend interfaces
- [ ] Run TypeScript strict check

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
**API Response Time**: -
**End-to-End Time**: -

<!-- Update as tests are written and run -->

---

## Integration Flow

```
Frontend (SvelteKit)
    ↓ POST /optimize (JSON payload)
    
API Layer (FastAPI)
    ↓ Validate request (Pydantic)
    ↓ Transform to solver format (adapter)
    
Solver (CP-SAT)
    ↓ Build constraint model
    ↓ Solve optimization
    ↓ Return solution
    
API Layer
    ↓ Transform results to API format
    ↓ Generate explainer rationale
    ↓ Return JSON response
    
Frontend
    ↓ Parse response
    ↓ Update stores
    ↓ Render results
```

---

## Notes

<!-- Add any implementation notes, learnings, or observations -->

---

## Next Steps

1. Create routers/ directory in apps/api/
2. Create services/ directory in apps/api/
3. Create schemas/ directory in apps/api/
4. Create adapters/ directory in apps/api/
5. Implement POST /optimize endpoint
6. Implement solver adapter
7. Implement optimization service
8. Add GET /holidays endpoint
9. Add GET /plans/{id} endpoint
10. Add GET /health endpoint
11. Write integration tests
12. Export OpenAPI spec
13. Generate TypeScript types from OpenAPI
14. Update frontend: replace mock with real API client
15. Add frontend error handling
16. Add loading states for real API calls
17. Run end-to-end tests
18. Verify performance targets
19. Update this document with results
20. **Move to Phase 6: Refinement & Edge Cases**

