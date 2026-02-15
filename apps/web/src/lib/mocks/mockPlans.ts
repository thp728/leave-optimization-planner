// mockPlans.ts - Pre-generated optimization results for testing
import type { DayAssignment, LeavePlan, OptimizeResponse } from './types';

// Helper to generate day assignments for a date range
function generateDayAssignments(
	startDate: string,
	endDate: string,
	leaveDates: Map<string, { leaveTypeId: string; isPaid: boolean }>,
	holidayDates: Set<string>
): DayAssignment[] {
	const assignments: DayAssignment[] = [];
	const start = new Date(startDate);
	const end = new Date(endDate);

	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split('T')[0];
		const dayOfWeek = d.getDay();
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

		if (leaveDates.has(dateStr)) {
			const leave = leaveDates.get(dateStr)!;
			assignments.push({
				date: dateStr,
				type: 'leave',
				leaveTypeId: leave.leaveTypeId,
				isPaidLeave: leave.isPaid,
				rationale: 'Optimized break day'
			});
		} else if (holidayDates.has(dateStr)) {
			assignments.push({
				date: dateStr,
				type: 'holiday',
				isPaidLeave: false,
				rationale: 'Public holiday'
			});
		} else if (isWeekend) {
			assignments.push({
				date: dateStr,
				type: 'weekend',
				isPaidLeave: false
			});
		} else {
			assignments.push({
				date: dateStr,
				type: 'work',
				isPaidLeave: false
			});
		}
	}

	return assignments;
}

// Scenario A: Standard 20 PTO days + 10 holidays
// Plan 1: Most days off (uses all PTO strategically around holidays)
const scenarioAPlan1: LeavePlan = {
	id: 'scenario-a-plan-1',
	rank: 1,
	totalDaysOff: 132, // Weekends + holidays + PTO
	paidLeaveDays: 20,
	longestConsecutiveBreak: 11,
	dailyAssignments: generateDayAssignments(
		'2026-01-01',
		'2026-12-31',
		new Map([
			// Memorial Day extended break
			['2026-05-24', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-26', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-27', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-28', { leaveTypeId: 'pto-standard', isPaid: true }],
			// July 4th week
			['2026-07-02', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-06', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-07', { leaveTypeId: 'pto-standard', isPaid: true }],
			// Thanksgiving week
			['2026-11-23', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-11-24', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-11-25', { leaveTypeId: 'pto-standard', isPaid: true }],
			// Christmas/New Year break
			['2026-12-28', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-12-29', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-12-30', { leaveTypeId: 'pto-standard', isPaid: true }]
		]),
		new Set([
			'2026-01-01',
			'2026-01-19',
			'2026-02-16',
			'2026-05-25',
			'2026-06-19',
			'2026-07-03',
			'2026-07-04',
			'2026-09-07',
			'2026-10-12',
			'2026-11-11',
			'2026-11-26',
			'2026-12-25'
		])
	),
	rationale: 'Maximizes consecutive days off by bridging holidays with PTO'
};

// Plan 2: Balanced distribution (spread throughout the year)
const scenarioAPlan2: LeavePlan = {
	id: 'scenario-a-plan-2',
	rank: 2,
	totalDaysOff: 132,
	paidLeaveDays: 20,
	longestConsecutiveBreak: 5,
	dailyAssignments: generateDayAssignments(
		'2026-01-01',
		'2026-12-31',
		new Map([
			// Spring break
			['2026-03-16', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-03-17', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-03-18', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-03-19', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-03-20', { leaveTypeId: 'pto-standard', isPaid: true }],
			// Summer break
			['2026-07-13', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-14', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-15', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-16', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-17', { leaveTypeId: 'pto-standard', isPaid: true }],
			// Fall break
			['2026-10-12', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-10-13', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-10-14', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-10-15', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-10-16', { leaveTypeId: 'pto-standard', isPaid: true }]
		]),
		new Set([
			'2026-01-01',
			'2026-01-19',
			'2026-02-16',
			'2026-05-25',
			'2026-06-19',
			'2026-07-03',
			'2026-07-04',
			'2026-09-07',
			'2026-10-12',
			'2026-11-11',
			'2026-11-26',
			'2026-12-25'
		])
	),
	rationale: 'Distributes PTO evenly throughout the year for regular breaks'
};

// Scenario B: Mixed leave types with priority handling
const scenarioBPlan1: LeavePlan = {
	id: 'scenario-b-plan-1',
	rank: 1,
	totalDaysOff: 142,
	paidLeaveDays: 33, // 20 PTO + 10 sick + 3 floating
	longestConsecutiveBreak: 12,
	dailyAssignments: generateDayAssignments(
		'2026-01-01',
		'2026-12-31',
		new Map([
			// Uses floating holidays first (priority 2)
			['2026-01-02', { leaveTypeId: 'floating', isPaid: true }],
			['2026-07-03', { leaveTypeId: 'floating', isPaid: true }],
			['2026-11-27', { leaveTypeId: 'floating', isPaid: true }],
			// Then PTO (priority 1)
			['2026-05-26', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-27', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-28', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-06', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-07-07', { leaveTypeId: 'pto-standard', isPaid: true }]
		]),
		new Set([
			'2026-01-01',
			'2026-01-19',
			'2026-02-16',
			'2026-05-25',
			'2026-06-19',
			'2026-07-03',
			'2026-07-04',
			'2026-09-07',
			'2026-10-12',
			'2026-11-11',
			'2026-11-26',
			'2026-12-25'
		])
	),
	rationale: 'Prioritizes floating holidays (expiring first) while optimizing PTO around holidays'
};

// Scenario C: End-of-year expiring leave
const scenarioCPlan1: LeavePlan = {
	id: 'scenario-c-plan-1',
	rank: 1,
	totalDaysOff: 138,
	paidLeaveDays: 35, // 15 expiring + 20 regular
	longestConsecutiveBreak: 9,
	dailyAssignments: generateDayAssignments(
		'2026-01-01',
		'2026-12-31',
		new Map([
			// Uses expiring PTO in Q4
			['2026-10-05', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-10-06', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-10-07', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-10-08', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-10-09', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-11-02', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-11-03', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-11-04', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-11-05', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-11-06', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-12-21', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-12-22', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-12-23', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-12-28', { leaveTypeId: 'pto-expiring', isPaid: true }],
			['2026-12-29', { leaveTypeId: 'pto-expiring', isPaid: true }],
			// Regular PTO used earlier in year
			['2026-05-26', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-27', { leaveTypeId: 'pto-standard', isPaid: true }],
			['2026-05-28', { leaveTypeId: 'pto-standard', isPaid: true }]
		]),
		new Set([
			'2026-01-01',
			'2026-01-19',
			'2026-02-16',
			'2026-05-25',
			'2026-06-19',
			'2026-07-03',
			'2026-07-04',
			'2026-09-07',
			'2026-10-12',
			'2026-11-11',
			'2026-11-26',
			'2026-12-25'
		])
	),
	rationale: 'Prioritizes expiring PTO in Q4 while using regular PTO for spring/summer breaks'
};

// Scenario D: Zero paid leave feasible (optimal scenario)
const scenarioDPlan1: LeavePlan = {
	id: 'scenario-d-plan-1',
	rank: 1,
	totalDaysOff: 145,
	paidLeaveDays: 28, // 25 generous PTO + 3 floating
	longestConsecutiveBreak: 11,
	dailyAssignments: generateDayAssignments(
		'2026-01-01',
		'2026-12-31',
		new Map([
			// Optimized around all major holidays
			['2026-01-02', { leaveTypeId: 'floating', isPaid: true }],
			['2026-05-26', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-05-27', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-05-28', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-07-06', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-07-07', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-07-08', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-07-09', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-11-27', { leaveTypeId: 'floating', isPaid: true }],
			['2026-11-30', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-12-28', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-12-29', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-12-30', { leaveTypeId: 'pto-generous', isPaid: true }],
			['2026-12-31', { leaveTypeId: 'floating', isPaid: true }]
		]),
		new Set([
			'2026-01-01',
			'2026-01-19',
			'2026-02-16',
			'2026-05-25',
			'2026-06-19',
			'2026-07-03',
			'2026-07-04',
			'2026-07-05',
			'2026-09-07',
			'2026-10-12',
			'2026-11-11',
			'2026-11-26',
			'2026-12-25'
		])
	),
	rationale:
		'Optimal balance with generous PTO allowance - creates extended breaks around all major holidays'
};

// Export all mock plans by scenario
export const mockPlans: Record<string, LeavePlan[]> = {
	scenarioA: [scenarioAPlan1, scenarioAPlan2],
	scenarioB: [scenarioBPlan1],
	scenarioC: [scenarioCPlan1],
	scenarioD: [scenarioDPlan1]
};

// Export full mock responses
export const mockResponses: Record<string, OptimizeResponse> = {
	scenarioA: {
		plans: [scenarioAPlan1, scenarioAPlan2],
		metadata: {
			executionTimeMs: 150,
			horizonDays: 365,
			totalSolutionsFound: 2
		}
	},
	scenarioB: {
		plans: [scenarioBPlan1],
		metadata: {
			executionTimeMs: 180,
			horizonDays: 365,
			totalSolutionsFound: 1
		}
	},
	scenarioC: {
		plans: [scenarioCPlan1],
		metadata: {
			executionTimeMs: 200,
			horizonDays: 365,
			totalSolutionsFound: 1
		}
	},
	scenarioD: {
		plans: [scenarioDPlan1],
		metadata: {
			executionTimeMs: 120,
			horizonDays: 365,
			totalSolutionsFound: 1
		}
	}
};

// Helper to get mock plans for a scenario
export function getMockPlans(scenario: string): OptimizeResponse {
	return mockResponses[scenario] || mockResponses.scenarioA;
}
