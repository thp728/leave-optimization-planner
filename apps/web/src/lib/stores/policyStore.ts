// policyStore.ts - Svelte store for leave policies
import { writable, derived } from 'svelte/store';
import type { LeaveType } from '$lib/mocks/types';
import { createEmptyLeaveType } from '$lib/mocks/mockPolicies';

// Store for leave types
function createPolicyStore() {
	const { subscribe, set, update } = writable<LeaveType[]>([]);

	return {
		subscribe,
		set,
		update,

		// Add a new leave type
		add: (leaveType?: Partial<LeaveType>) => {
			update((policies) => {
				const newPolicy = {
					...createEmptyLeaveType(),
					...leaveType
				};
				return [...policies, newPolicy];
			});
		},

		// Update an existing leave type
		updatePolicy: (id: string, updates: Partial<LeaveType>) => {
			update((policies) => policies.map((p) => (p.id === id ? { ...p, ...updates } : p)));
		},

		// Remove a leave type
		remove: (id: string) => {
			update((policies) => policies.filter((p) => p.id !== id));
		},

		// Reorder priorities
		setPriority: (id: string, newPriority: number) => {
			update((policies) =>
				policies.map((p) => (p.id === id ? { ...p, priority: newPriority } : p))
			);
		},

		// Reset to empty
		reset: () => set([]),

		// Load preset policies
		loadPreset: (policies: LeaveType[]) => set(policies)
	};
}

export const policyStore = createPolicyStore();

// Derived store for total available days
export const totalLeaveDays = derived(policyStore, ($policies) =>
	$policies.reduce((sum, p) => sum + p.daysPerYear, 0)
);

// Derived store for policies sorted by priority
export const policiesByPriority = derived(policyStore, ($policies) =>
	[...$policies].sort((a, b) => a.priority - b.priority)
);

// Derived store to check if policies are valid
export const isPolicyValid = derived(
	policyStore,
	($policies) =>
		$policies.length > 0 &&
		$policies.every((p) => p.name.trim() !== '' && p.daysPerYear > 0 && p.priority > 0)
);
