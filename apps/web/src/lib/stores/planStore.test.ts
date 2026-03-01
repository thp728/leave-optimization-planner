import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	planStore,
	selectedPlan,
	sortedPlans,
	isLoading,
	hasError,
	hasPlans,
	planCount,
	bestPlan
} from './planStore';
import type { LeavePlan, OptimizeRequest } from '$lib/mocks/types';

vi.mock('$lib/mocks/mockApi', () => ({
	mockApi: {
		optimize: vi.fn()
	}
}));

function makePlan(overrides: Partial<LeavePlan> = {}): LeavePlan {
	return {
		id: 'plan-1',
		rank: 1,
		totalDaysOff: 130,
		paidLeaveDays: 20,
		longestConsecutiveBreak: 9,
		dailyAssignments: [],
		rationale: 'Test plan rationale',
		...overrides
	};
}

const mockRequest: OptimizeRequest = {
	leaveTypes: [],
	holidays: [],
	preferences: {
		planningHorizon: { start: '2026-01-01', end: '2026-12-31' },
		minConsecutiveDaysOff: 3,
		maxConsecutiveDaysOff: 15,
		preferredBreakFrequency: 'quarterly'
	}
};

describe('planStore', () => {
	beforeEach(() => {
		planStore.clear();
		vi.clearAllMocks();
	});

	describe('optimize()', () => {
		it('sets loading → success, auto-selects first plan, stores metadata', async () => {
			const { mockApi } = await import('$lib/mocks/mockApi');
			const plans = [makePlan({ id: 'p1' }), makePlan({ id: 'p2', rank: 2 })];
			vi.mocked(mockApi.optimize).mockResolvedValue({
				plans,
				metadata: { executionTimeMs: 100, horizonDays: 365, totalSolutionsFound: 2 }
			});

			expect(get(isLoading)).toBe(false);
			const promise = planStore.optimize(mockRequest);
			expect(get(isLoading)).toBe(true);

			await promise;

			const state = get(planStore);
			expect(state.loadingState).toBe('success');
			expect(state.selectedPlanId).toBe('p1');
			expect(state.metadata).toEqual({
				executionTimeMs: 100,
				horizonDays: 365,
				totalSolutionsFound: 2
			});
		});

		it('sets loading → error on rejection, re-throws', async () => {
			const { mockApi } = await import('$lib/mocks/mockApi');
			vi.mocked(mockApi.optimize).mockRejectedValue(new Error('Network error'));

			await expect(planStore.optimize(mockRequest)).rejects.toThrow('Network error');
			expect(get(hasError)).toBe(true);
			expect(get(planStore).error).toBe('Network error');
		});
	});

	describe('selectPlan()', () => {
		it('sets selectedPlanId', () => {
			planStore.setPlans([makePlan({ id: 'p1' }), makePlan({ id: 'p2' })]);
			planStore.selectPlan('p2');
			expect(get(planStore).selectedPlanId).toBe('p2');
		});
	});

	describe('clear()', () => {
		it('resets to initial state', () => {
			planStore.setPlans([makePlan()]);
			planStore.clear();
			const state = get(planStore);
			expect(state.plans).toEqual([]);
			expect(state.selectedPlanId).toBeNull();
			expect(state.loadingState).toBe('idle');
		});
	});

	describe('clearError()', () => {
		it('resets error to idle', () => {
			planStore.update((s) => ({ ...s, loadingState: 'error' as const, error: 'fail' }));
			planStore.clearError();
			const state = get(planStore);
			expect(state.loadingState).toBe('idle');
			expect(state.error).toBeNull();
		});
	});

	describe('setPlans()', () => {
		it('sets plans and auto-selects first', () => {
			const plans = [makePlan({ id: 'p1' }), makePlan({ id: 'p2' })];
			planStore.setPlans(plans);
			const state = get(planStore);
			expect(state.plans).toEqual(plans);
			expect(state.selectedPlanId).toBe('p1');
			expect(state.loadingState).toBe('success');
		});
	});

	describe('derived stores', () => {
		it('selectedPlan returns the selected plan or null', () => {
			expect(get(selectedPlan)).toBeNull();
			planStore.setPlans([makePlan({ id: 'p1' })]);
			expect(get(selectedPlan)?.id).toBe('p1');
		});

		it('sortedPlans sorted by rank', () => {
			planStore.setPlans([
				makePlan({ id: 'p2', rank: 2 }),
				makePlan({ id: 'p1', rank: 1 })
			]);
			expect(get(sortedPlans).map((p) => p.id)).toEqual(['p1', 'p2']);
		});

		it('isLoading reflects loading state', () => {
			expect(get(isLoading)).toBe(false);
			planStore.update((s) => ({ ...s, loadingState: 'loading' as const }));
			expect(get(isLoading)).toBe(true);
		});

		it('hasError reflects error state', () => {
			expect(get(hasError)).toBe(false);
			planStore.update((s) => ({ ...s, loadingState: 'error' as const }));
			expect(get(hasError)).toBe(true);
		});

		it('hasPlans is true only with success + plans', () => {
			expect(get(hasPlans)).toBe(false);
			planStore.setPlans([makePlan()]);
			expect(get(hasPlans)).toBe(true);
		});

		it('planCount returns number of plans', () => {
			expect(get(planCount)).toBe(0);
			planStore.setPlans([makePlan(), makePlan({ id: 'p2' })]);
			expect(get(planCount)).toBe(2);
		});

		it('bestPlan returns rank 1 or null', () => {
			expect(get(bestPlan)).toBeNull();
			planStore.setPlans([
				makePlan({ id: 'p2', rank: 2 }),
				makePlan({ id: 'p1', rank: 1 })
			]);
			expect(get(bestPlan)?.id).toBe('p1');
		});
	});
});
