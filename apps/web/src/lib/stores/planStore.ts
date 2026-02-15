// planStore.ts - Svelte store for optimization results
import { writable, derived } from 'svelte/store';
import type { LeavePlan, OptimizeRequest, OptimizeResponse } from '$lib/mocks/types';
import { mockApi } from '$lib/mocks/mockApi';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface PlanState {
	plans: LeavePlan[];
	selectedPlanId: string | null;
	loadingState: LoadingState;
	error: string | null;
	metadata: {
		executionTimeMs: number;
		horizonDays: number;
		totalSolutionsFound: number;
	} | null;
}

const initialState: PlanState = {
	plans: [],
	selectedPlanId: null,
	loadingState: 'idle',
	error: null,
	metadata: null
};

// Store for optimization plans
function createPlanStore() {
	const { subscribe, set, update } = writable<PlanState>(initialState);

	return {
		subscribe,
		set,
		update,

		// Run optimization
		optimize: async (request: OptimizeRequest): Promise<OptimizeResponse> => {
			update((state) => ({ ...state, loadingState: 'loading', error: null }));

			try {
				const response = await mockApi.optimize(request);

				update((state) => ({
					...state,
					plans: response.plans,
					selectedPlanId: response.plans[0]?.id || null,
					loadingState: 'success',
					error: null,
					metadata: response.metadata
				}));

				return response;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Optimization failed';
				update((state) => ({
					...state,
					loadingState: 'error',
					error: errorMessage
				}));
				throw err;
			}
		},

		// Select a plan
		selectPlan: (planId: string) => {
			update((state) => ({
				...state,
				selectedPlanId: planId
			}));
		},

		// Clear all plans
		clear: () => set(initialState),

		// Reset error state
		clearError: () => {
			update((state) => ({ ...state, error: null, loadingState: 'idle' }));
		},

		// Set plans directly (for testing)
		setPlans: (plans: LeavePlan[]) => {
			update((state) => ({
				...state,
				plans,
				selectedPlanId: plans[0]?.id || null,
				loadingState: 'success'
			}));
		}
	};
}

export const planStore = createPlanStore();

// Derived store for the selected plan
export const selectedPlan = derived(
	planStore,
	($state) => $state.plans.find((p) => p.id === $state.selectedPlanId) || null
);

// Derived store for sorted plans (by rank)
export const sortedPlans = derived(planStore, ($state) =>
	[...$state.plans].sort((a, b) => a.rank - b.rank)
);

// Derived store for loading state
export const isLoading = derived(planStore, ($state) => $state.loadingState === 'loading');

// Derived store for error state
export const hasError = derived(planStore, ($state) => $state.loadingState === 'error');

// Derived store for success state
export const hasPlans = derived(
	planStore,
	($state) => $state.loadingState === 'success' && $state.plans.length > 0
);

// Derived store for plan count
export const planCount = derived(planStore, ($state) => $state.plans.length);

// Derived store for the best plan (rank 1)
export const bestPlan = derived(
	planStore,
	($state) => $state.plans.find((p) => p.rank === 1) || null
);
