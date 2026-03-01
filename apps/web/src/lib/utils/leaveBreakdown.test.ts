import { describe, it, expect } from 'vitest';
import { computeByLeaveType, computeByMonth } from './leaveBreakdown';
import type { DayAssignment, LeaveType } from '$lib/mocks/types';

function makeAssignment(overrides: Partial<DayAssignment> = {}): DayAssignment {
	return {
		date: '2026-01-05',
		type: 'leave',
		leaveTypeId: 'pto-1',
		isPaidLeave: true,
		...overrides
	};
}

function makeLeaveType(overrides: Partial<LeaveType> = {}): LeaveType {
	return {
		id: 'pto-1',
		name: 'PTO',
		daysPerYear: 20,
		priority: 1,
		accrualSchedule: 'monthly',
		carryoverDays: 5,
		expiresAtYearEnd: false,
		...overrides
	};
}

describe('computeByLeaveType', () => {
	it('returns empty array for empty input', () => {
		expect(computeByLeaveType([], new Map())).toEqual([]);
	});

	it('ignores non-leave types', () => {
		const assignments: DayAssignment[] = [
			makeAssignment({ type: 'work' }),
			makeAssignment({ type: 'weekend' }),
			makeAssignment({ type: 'holiday' })
		];
		expect(computeByLeaveType(assignments, new Map())).toEqual([]);
	});

	it('counts days per leave type', () => {
		const typeMap = new Map([['pto-1', makeLeaveType()]]);
		const assignments = [
			makeAssignment({ date: '2026-01-05' }),
			makeAssignment({ date: '2026-01-06' }),
			makeAssignment({ date: '2026-01-07' })
		];
		const result = computeByLeaveType(assignments, typeMap);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ name: 'PTO', days: 3, isPaid: true });
	});

	it('uses fallback name for unknown leave type ID', () => {
		const assignments = [makeAssignment({ leaveTypeId: 'unknown-id-12345678' })];
		const result = computeByLeaveType(assignments, new Map());
		expect(result[0].name).toBe('Leave (unknown-)');
	});

	it('sorts descending by days', () => {
		const typeMap = new Map([
			['pto-1', makeLeaveType({ id: 'pto-1', name: 'PTO' })],
			['sick', makeLeaveType({ id: 'sick', name: 'Sick' })]
		]);
		const assignments = [
			makeAssignment({ leaveTypeId: 'pto-1', date: '2026-01-05' }),
			makeAssignment({ leaveTypeId: 'sick', date: '2026-01-06' }),
			makeAssignment({ leaveTypeId: 'sick', date: '2026-01-07' }),
			makeAssignment({ leaveTypeId: 'sick', date: '2026-01-08' })
		];
		const result = computeByLeaveType(assignments, typeMap);
		expect(result[0].name).toBe('Sick');
		expect(result[0].days).toBe(3);
		expect(result[1].name).toBe('PTO');
		expect(result[1].days).toBe(1);
	});
});

describe('computeByMonth', () => {
	it('returns empty array for empty input', () => {
		expect(computeByMonth([])).toEqual([]);
	});

	it('ignores work days', () => {
		const assignments = [
			makeAssignment({ type: 'work', date: '2026-01-05' }),
			makeAssignment({ type: 'work', date: '2026-01-06' })
		];
		expect(computeByMonth(assignments)).toEqual([]);
	});

	it('counts non-work days per month', () => {
		const assignments = [
			makeAssignment({ type: 'leave', date: '2026-01-05' }),
			makeAssignment({ type: 'leave', date: '2026-01-06' }),
			makeAssignment({ type: 'weekend', date: '2026-02-07' })
		];
		const result = computeByMonth(assignments);
		expect(result).toEqual([
			{ label: 'Jan', count: 2 },
			{ label: 'Feb', count: 1 }
		]);
	});

	it('sorts chronologically', () => {
		const assignments = [
			makeAssignment({ type: 'leave', date: '2026-12-01' }),
			makeAssignment({ type: 'holiday', date: '2026-03-15' }),
			makeAssignment({ type: 'leave', date: '2026-06-20' })
		];
		const result = computeByMonth(assignments);
		expect(result.map((m) => m.label)).toEqual(['Mar', 'Jun', 'Dec']);
	});

	it('includes holidays in count', () => {
		const assignments = [
			makeAssignment({ type: 'holiday', date: '2026-07-04' }),
			makeAssignment({ type: 'leave', date: '2026-07-05' })
		];
		const result = computeByMonth(assignments);
		expect(result).toEqual([{ label: 'Jul', count: 2 }]);
	});
});
