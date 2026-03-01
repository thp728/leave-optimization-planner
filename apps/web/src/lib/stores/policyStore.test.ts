import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
	policyStore,
	totalLeaveDays,
	policiesByPriority,
	isPolicyValid
} from './policyStore';
import type { LeaveType } from '$lib/mocks/types';

function makePolicy(overrides: Partial<LeaveType> = {}): LeaveType {
	return {
		id: 'test-id',
		name: 'Test PTO',
		daysPerYear: 20,
		priority: 1,
		accrualSchedule: 'monthly',
		carryoverDays: 5,
		expiresAtYearEnd: false,
		...overrides
	};
}

describe('policyStore', () => {
	beforeEach(() => {
		policyStore.reset();
	});

	describe('add()', () => {
		it('adds a policy with a generated UUID', () => {
			policyStore.add();
			const policies = get(policyStore);
			expect(policies).toHaveLength(1);
			expect(policies[0].id).toBeTruthy();
		});

		it('merges partial overrides', () => {
			policyStore.add({ name: 'Custom PTO', daysPerYear: 25 });
			const policies = get(policyStore);
			expect(policies[0].name).toBe('Custom PTO');
			expect(policies[0].daysPerYear).toBe(25);
		});

		it('generates unique IDs per call', () => {
			policyStore.add();
			policyStore.add();
			const policies = get(policyStore);
			expect(policies[0].id).not.toBe(policies[1].id);
		});
	});

	describe('updatePolicy()', () => {
		it('updates matching policy', () => {
			policyStore.loadPreset([makePolicy({ id: 'p1', name: 'Old' })]);
			policyStore.updatePolicy('p1', { name: 'New' });
			expect(get(policyStore)[0].name).toBe('New');
		});

		it('no-op for unknown ID', () => {
			policyStore.loadPreset([makePolicy({ id: 'p1' })]);
			policyStore.updatePolicy('unknown', { name: 'X' });
			expect(get(policyStore)[0].name).toBe('Test PTO');
		});
	});

	describe('remove()', () => {
		it('removes by ID', () => {
			policyStore.loadPreset([makePolicy({ id: 'p1' }), makePolicy({ id: 'p2' })]);
			policyStore.remove('p1');
			const policies = get(policyStore);
			expect(policies).toHaveLength(1);
			expect(policies[0].id).toBe('p2');
		});

		it('no-op for unknown ID', () => {
			policyStore.loadPreset([makePolicy({ id: 'p1' })]);
			policyStore.remove('unknown');
			expect(get(policyStore)).toHaveLength(1);
		});
	});

	describe('setPriority()', () => {
		it('updates priority field', () => {
			policyStore.loadPreset([makePolicy({ id: 'p1', priority: 1 })]);
			policyStore.setPriority('p1', 5);
			expect(get(policyStore)[0].priority).toBe(5);
		});
	});

	describe('reset() / loadPreset()', () => {
		it('reset clears the array', () => {
			policyStore.add();
			policyStore.reset();
			expect(get(policyStore)).toEqual([]);
		});

		it('loadPreset replaces the array', () => {
			const preset = [makePolicy({ id: 'a' }), makePolicy({ id: 'b' })];
			policyStore.loadPreset(preset);
			expect(get(policyStore)).toEqual(preset);
		});
	});

	describe('totalLeaveDays', () => {
		it('returns sum of daysPerYear', () => {
			policyStore.loadPreset([
				makePolicy({ daysPerYear: 20 }),
				makePolicy({ id: 'p2', daysPerYear: 10 })
			]);
			expect(get(totalLeaveDays)).toBe(30);
		});

		it('is reactive on add', () => {
			expect(get(totalLeaveDays)).toBe(0);
			policyStore.add({ daysPerYear: 15 });
			expect(get(totalLeaveDays)).toBe(15);
		});
	});

	describe('policiesByPriority', () => {
		it('returns sorted ascending by priority', () => {
			policyStore.loadPreset([
				makePolicy({ id: 'p3', priority: 3 }),
				makePolicy({ id: 'p1', priority: 1 }),
				makePolicy({ id: 'p2', priority: 2 })
			]);
			const sorted = get(policiesByPriority);
			expect(sorted.map((p) => p.id)).toEqual(['p1', 'p2', 'p3']);
		});

		it('does not mutate original store', () => {
			policyStore.loadPreset([
				makePolicy({ id: 'p2', priority: 2 }),
				makePolicy({ id: 'p1', priority: 1 })
			]);
			get(policiesByPriority);
			expect(get(policyStore)[0].id).toBe('p2');
		});
	});

	describe('isPolicyValid', () => {
		it('returns false when empty', () => {
			expect(get(isPolicyValid)).toBe(false);
		});

		it('returns false for blank name', () => {
			policyStore.loadPreset([makePolicy({ name: '' })]);
			expect(get(isPolicyValid)).toBe(false);
		});

		it('returns false for zero days', () => {
			policyStore.loadPreset([makePolicy({ daysPerYear: 0 })]);
			expect(get(isPolicyValid)).toBe(false);
		});

		it('returns false for zero priority', () => {
			policyStore.loadPreset([makePolicy({ priority: 0 })]);
			expect(get(isPolicyValid)).toBe(false);
		});

		it('returns true when all policies are valid', () => {
			policyStore.loadPreset([
				makePolicy({ name: 'PTO', daysPerYear: 20, priority: 1 })
			]);
			expect(get(isPolicyValid)).toBe(true);
		});
	});
});
