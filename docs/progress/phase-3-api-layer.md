# Phase 3: API Layer & Orchestration

**Status**: Not Started
**Started**: -
**Completed**: -

---

## Goal

Expose solver via REST API with proper validation and error handling.

---

## Deliverables Checklist

### API Endpoints (`apps/api/routers/`)
- [ ] `optimize.py` - POST /optimize endpoint
- [ ] `holidays.py` - GET /holidays endpoint
- [ ] `plans.py` - GET /plans/{id} endpoint

### Service Layer (`apps/api/services/`)
- [ ] `policy_service.py` - Policy CRUD operations
- [ ] `holiday_service.py` - Holiday calendar management
- [ ] `optimization_service.py` - Orchestrates solver invocation ⭐ CRITICAL
- [ ] `plan_service.py` - Saved plan persistence

### Request/Response Schemas (`apps/api/schemas/`)
- [ ] `optimize_request.py` - Input validation schema
- [ ] `optimize_response.py` - Structured plan output
- [ ] `error_responses.py` - Standardized error formats

### Integration Layer
- [ ] Adapter to convert API models → solver inputs
- [ ] Result transformer: solver output → API response
- [ ] Error handling for infeasible scenarios

### OpenAPI Specification
- [ ] Auto-generated via FastAPI
- [ ] Export to `packages/schemas/openapi.yaml`

### Testing
- [ ] API tests: Full request/response cycle
- [ ] Integration tests: API + Solver end-to-end
- [ ] Error handling tests: Invalid inputs, infeasible scenarios
- [ ] Performance tests: Response time <2s
- [ ] Achieve >75% test coverage

---

## Key Files

- [apps/api/routers/optimize.py](../../apps/api/routers/optimize.py)
- [apps/api/routers/holidays.py](../../apps/api/routers/holidays.py)
- [apps/api/routers/plans.py](../../apps/api/routers/plans.py)
- [apps/api/services/optimization_service.py](../../apps/api/services/optimization_service.py) ⭐ CRITICAL
- [apps/api/adapters/solver_adapter.py](../../apps/api/adapters/solver_adapter.py)
- [apps/api/tests/test_optimize_endpoint.py](../../apps/api/tests/test_optimize_endpoint.py)
- [packages/schemas/openapi.yaml](../../packages/schemas/openapi.yaml)

---

## Success Criteria

- ✓ POST /optimize accepts policy JSON and returns ranked plans
- ✓ GET /holidays returns structured calendar data
- ✓ GET /plans/{id} retrieves saved plans
- ✓ Clear error messages for validation failures
- ✓ OpenAPI spec generated and exportable
- ✓ All endpoints have integration tests

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

<!-- Update as tests are written and run -->

---

## API Endpoints

| Method | Endpoint | Status | Response Time |
|--------|----------|--------|---------------|
| POST | /optimize | Not implemented | - |
| GET | /holidays | Not implemented | - |
| GET | /plans/{id} | Not implemented | - |
| GET | /health | ✓ Implemented | - |

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
10. Write integration tests
11. Export OpenAPI spec
12. Update this document with results
13. Move to Phase 4
