import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	holidayStore,
	holidaysByDate,
	publicHolidays,
	companyHolidays,
	holidayCount,
	holidayDateSet
} from './holidayStore';
import type { Holiday } from '$lib/mocks/types';

function makeHoliday(overrides: Partial<Holiday> = {}): Holiday {
	return {
		date: '2026-01-01',
		name: "New Year's Day",
		type: 'public',
		...overrides
	};
}

describe('holidayStore', () => {
	beforeEach(() => {
		holidayStore.clear();
	});

	describe('add()', () => {
		it('appends a new holiday', () => {
			holidayStore.add(makeHoliday());
			expect(get(holidayStore)).toHaveLength(1);
		});

		it('upserts on duplicate date', () => {
			holidayStore.add(makeHoliday({ date: '2026-01-01', name: 'Original' }));
			holidayStore.add(makeHoliday({ date: '2026-01-01', name: 'Updated' }));
			const holidays = get(holidayStore);
			expect(holidays).toHaveLength(1);
			expect(holidays[0].name).toBe('Updated');
		});
	});

	describe('remove()', () => {
		it('removes by date', () => {
			holidayStore.add(makeHoliday({ date: '2026-01-01' }));
			holidayStore.add(makeHoliday({ date: '2026-07-04', name: 'July 4th' }));
			holidayStore.remove('2026-01-01');
			expect(get(holidayStore)).toHaveLength(1);
			expect(get(holidayStore)[0].date).toBe('2026-07-04');
		});

		it('no-op for unknown date', () => {
			holidayStore.add(makeHoliday());
			holidayStore.remove('2099-12-31');
			expect(get(holidayStore)).toHaveLength(1);
		});
	});

	describe('updateHoliday()', () => {
		it('merges updates by date', () => {
			holidayStore.add(makeHoliday({ date: '2026-01-01', name: 'Old', type: 'public' }));
			holidayStore.updateHoliday('2026-01-01', { name: 'New' });
			const h = get(holidayStore)[0];
			expect(h.name).toBe('New');
			expect(h.type).toBe('public');
		});
	});

	describe('loadPreset() / clear()', () => {
		it('loadPreset replaces all holidays', () => {
			holidayStore.add(makeHoliday());
			const preset = [
				makeHoliday({ date: '2026-03-01' }),
				makeHoliday({ date: '2026-06-01' })
			];
			holidayStore.loadPreset(preset);
			expect(get(holidayStore)).toEqual(preset);
		});

		it('clear empties the store', () => {
			holidayStore.add(makeHoliday());
			holidayStore.clear();
			expect(get(holidayStore)).toEqual([]);
		});
	});

	describe('importFromTemplate()', () => {
		it('loads US holidays', async () => {
			await holidayStore.importFromTemplate('us');
			const holidays = get(holidayStore);
			expect(holidays.length).toBeGreaterThan(0);
			expect(holidays[0].type).toBe('public');
		});

		it('loads UK holidays', async () => {
			await holidayStore.importFromTemplate('uk');
			const holidays = get(holidayStore);
			expect(holidays.length).toBeGreaterThan(0);
			expect(holidays.some((h) => h.name.includes('Bank Holiday'))).toBe(true);
		});
	});

	describe('holidaysByDate', () => {
		it('returns sorted chronologically', () => {
			holidayStore.loadPreset([
				makeHoliday({ date: '2026-12-25', name: 'Christmas' }),
				makeHoliday({ date: '2026-01-01', name: 'New Year' }),
				makeHoliday({ date: '2026-07-04', name: 'July 4th' })
			]);
			const sorted = get(holidaysByDate);
			expect(sorted.map((h) => h.date)).toEqual([
				'2026-01-01',
				'2026-07-04',
				'2026-12-25'
			]);
		});
	});

	describe('publicHolidays / companyHolidays', () => {
		it('filters by type', () => {
			holidayStore.loadPreset([
				makeHoliday({ date: '2026-01-01', type: 'public' }),
				makeHoliday({ date: '2026-12-24', type: 'company' }),
				makeHoliday({ date: '2026-07-04', type: 'public' })
			]);
			expect(get(publicHolidays)).toHaveLength(2);
			expect(get(companyHolidays)).toHaveLength(1);
		});
	});

	describe('holidayCount / holidayDateSet', () => {
		it('returns correct count', () => {
			holidayStore.loadPreset([
				makeHoliday({ date: '2026-01-01' }),
				makeHoliday({ date: '2026-07-04' })
			]);
			expect(get(holidayCount)).toBe(2);
		});

		it('returns Set of date strings', () => {
			holidayStore.loadPreset([
				makeHoliday({ date: '2026-01-01' }),
				makeHoliday({ date: '2026-07-04' })
			]);
			const dateSet = get(holidayDateSet);
			expect(dateSet).toBeInstanceOf(Set);
			expect(dateSet.has('2026-01-01')).toBe(true);
			expect(dateSet.has('2026-07-04')).toBe(true);
			expect(dateSet.has('2026-12-25')).toBe(false);
		});
	});
});
