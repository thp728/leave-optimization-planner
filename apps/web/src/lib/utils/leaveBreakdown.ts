import type { DayAssignment, LeaveType } from '$lib/mocks/types';

/**
 * Aggregate leave days by leave type, sorted descending by days.
 */
export function computeByLeaveType(
	assignments: DayAssignment[],
	typeMap: Map<string, LeaveType>
): Array<{ name: string; days: number; isPaid: boolean }> {
	const map = new Map<string, { name: string; days: number; isPaid: boolean }>();
	for (const d of assignments) {
		if (d.type !== 'leave' || !d.leaveTypeId) continue;
		const existing = map.get(d.leaveTypeId);
		const policy = typeMap.get(d.leaveTypeId);
		const name = policy?.name ?? `Leave (${d.leaveTypeId.slice(0, 8)})`;
		map.set(d.leaveTypeId, {
			name,
			days: (existing?.days ?? 0) + 1,
			isPaid: d.isPaidLeave
		});
	}
	return [...map.values()].sort((a, b) => b.days - a.days);
}

/**
 * Count non-work days per calendar month, sorted chronologically.
 */
export function computeByMonth(
	assignments: DayAssignment[]
): Array<{ label: string; count: number }> {
	const MONTHS = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	];
	const map = new Map<string, number>();
	for (const d of assignments) {
		if (d.type === 'work') continue;
		const month = d.date.slice(0, 7); // YYYY-MM
		map.set(month, (map.get(month) ?? 0) + 1);
	}
	return [...map.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([yearMonth, count]) => ({
			label: MONTHS[parseInt(yearMonth.slice(5)) - 1],
			count
		}));
}
