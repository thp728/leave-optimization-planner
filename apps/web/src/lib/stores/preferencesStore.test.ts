import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
	preferencesStore,
	horizonDurationDays,
	isPreferencesValid
} from './preferencesStore';
import type { UserPreferences } from '$lib/mocks/types';

function makePrefs(overrides: Partial<UserPreferences> = {}): UserPreferences {
	return {
		planningHorizon: { start: '2026-01-01', end: '2026-12-31' },
		minConsecutiveDaysOff: 3,
		maxConsecutiveDaysOff: 15,
		preferredBreakFrequency: 'quarterly',
		...overrides
	};
}

describe('preferencesStore', () => {
	beforeEach(() => {
		preferencesStore.load(makePrefs());
	});

	describe('setStartDate / setEndDate / setPlanningHorizon', () => {
		it('setStartDate updates start', () => {
			preferencesStore.setStartDate('2026-03-01');
			expect(get(preferencesStore).planningHorizon.start).toBe('2026-03-01');
		});

		it('setEndDate updates end', () => {
			preferencesStore.setEndDate('2027-06-30');
			expect(get(preferencesStore).planningHorizon.end).toBe('2027-06-30');
		});

		it('setPlanningHorizon updates both', () => {
			preferencesStore.setPlanningHorizon({ start: '2026-06-01', end: '2027-06-01' });
			const h = get(preferencesStore).planningHorizon;
			expect(h.start).toBe('2026-06-01');
			expect(h.end).toBe('2027-06-01');
		});
	});

	describe('setMinConsecutiveDays', () => {
		it('updates value', () => {
			preferencesStore.setMinConsecutiveDays(5);
			expect(get(preferencesStore).minConsecutiveDaysOff).toBe(5);
		});

		it('clamps to >= 1', () => {
			preferencesStore.setMinConsecutiveDays(0);
			expect(get(preferencesStore).minConsecutiveDaysOff).toBe(1);
			preferencesStore.setMinConsecutiveDays(-5);
			expect(get(preferencesStore).minConsecutiveDaysOff).toBe(1);
		});
	});

	describe('setMaxConsecutiveDays', () => {
		it('updates value', () => {
			preferencesStore.setMaxConsecutiveDays(30);
			expect(get(preferencesStore).maxConsecutiveDaysOff).toBe(30);
		});

		it('clamps to >= current min', () => {
			preferencesStore.setMinConsecutiveDays(5);
			preferencesStore.setMaxConsecutiveDays(2);
			expect(get(preferencesStore).maxConsecutiveDaysOff).toBe(5);
		});
	});

	describe('setBreakFrequency', () => {
		it('updates frequency', () => {
			preferencesStore.setBreakFrequency('monthly');
			expect(get(preferencesStore).preferredBreakFrequency).toBe('monthly');
		});
	});

	describe('reset() / load()', () => {
		it('reset restores defaults', () => {
			preferencesStore.setMinConsecutiveDays(10);
			preferencesStore.reset();
			expect(get(preferencesStore).minConsecutiveDaysOff).toBe(3);
		});

		it('load sets arbitrary preferences', () => {
			const custom = makePrefs({ minConsecutiveDaysOff: 7 });
			preferencesStore.load(custom);
			expect(get(preferencesStore)).toEqual(custom);
		});
	});

	describe('horizonDurationDays', () => {
		it('returns correct day count', () => {
			preferencesStore.load(
				makePrefs({ planningHorizon: { start: '2026-01-01', end: '2026-01-11' } })
			);
			expect(get(horizonDurationDays)).toBe(10);
		});

		it('returns 0 when start equals end', () => {
			preferencesStore.load(
				makePrefs({ planningHorizon: { start: '2026-06-01', end: '2026-06-01' } })
			);
			expect(get(horizonDurationDays)).toBe(0);
		});

		it('returns negative when reversed', () => {
			preferencesStore.load(
				makePrefs({ planningHorizon: { start: '2026-12-31', end: '2026-01-01' } })
			);
			expect(get(horizonDurationDays)).toBeLessThan(0);
		});
	});

	describe('isPreferencesValid', () => {
		it('returns true for valid combos', () => {
			preferencesStore.load(makePrefs());
			expect(get(isPreferencesValid)).toBe(true);
		});

		it('returns false when start >= end', () => {
			preferencesStore.load(
				makePrefs({ planningHorizon: { start: '2026-12-31', end: '2026-01-01' } })
			);
			expect(get(isPreferencesValid)).toBe(false);
		});

		it('returns false when min > max', () => {
			preferencesStore.load(makePrefs({ minConsecutiveDaysOff: 20, maxConsecutiveDaysOff: 5 }));
			expect(get(isPreferencesValid)).toBe(false);
		});

		it('returns false when max > 365', () => {
			preferencesStore.load(makePrefs({ maxConsecutiveDaysOff: 400 }));
			expect(get(isPreferencesValid)).toBe(false);
		});

		it('returns false when min < 1', () => {
			preferencesStore.load(makePrefs({ minConsecutiveDaysOff: 0 }));
			expect(get(isPreferencesValid)).toBe(false);
		});
	});
});
