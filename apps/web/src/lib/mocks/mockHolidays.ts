// mockHolidays.ts - Sample holiday calendars for testing
import type { Holiday } from './types';

// US Federal Holidays 2026
export const usHolidays2026: Holiday[] = [
	{ date: '2026-01-01', name: "New Year's Day", type: 'public' },
	{ date: '2026-01-19', name: 'Martin Luther King Jr. Day', type: 'public' },
	{ date: '2026-02-16', name: "Presidents' Day", type: 'public' },
	{ date: '2026-05-25', name: 'Memorial Day', type: 'public' },
	{ date: '2026-06-19', name: 'Juneteenth', type: 'public' },
	{ date: '2026-07-04', name: 'Independence Day', type: 'public' },
	{ date: '2026-07-03', name: 'Independence Day (Observed)', type: 'public' },
	{ date: '2026-09-07', name: 'Labor Day', type: 'public' },
	{ date: '2026-10-12', name: 'Columbus Day', type: 'public' },
	{ date: '2026-11-11', name: 'Veterans Day', type: 'public' },
	{ date: '2026-11-26', name: 'Thanksgiving Day', type: 'public' },
	{ date: '2026-12-25', name: 'Christmas Day', type: 'public' }
];

// UK Bank Holidays 2026
export const ukHolidays2026: Holiday[] = [
	{ date: '2026-01-01', name: "New Year's Day", type: 'public' },
	{ date: '2026-04-03', name: 'Good Friday', type: 'public' },
	{ date: '2026-04-06', name: 'Easter Monday', type: 'public' },
	{ date: '2026-05-04', name: 'Early May Bank Holiday', type: 'public' },
	{ date: '2026-05-25', name: 'Spring Bank Holiday', type: 'public' },
	{ date: '2026-08-31', name: 'Summer Bank Holiday', type: 'public' },
	{ date: '2026-12-25', name: 'Christmas Day', type: 'public' },
	{ date: '2026-12-28', name: 'Boxing Day (Observed)', type: 'public' }
];

// Company-specific holidays (examples)
export const companyHolidays: Holiday[] = [
	{ date: '2026-11-27', name: 'Thanksgiving Friday (Company)', type: 'company' },
	{ date: '2026-12-24', name: 'Christmas Eve (Company)', type: 'company' },
	{ date: '2026-12-31', name: "New Year's Eve (Company)", type: 'company' }
];

// Scenario A: US Federal holidays only
export const scenarioAHolidays: Holiday[] = [...usHolidays2026];

// Scenario B: US Federal + Company holidays
export const scenarioBHolidays: Holiday[] = [...usHolidays2026, ...companyHolidays];

// Scenario C: UK holidays (for variety)
export const scenarioCHolidays: Holiday[] = [...ukHolidays2026];

// Scenario D: US holidays with extra company days
export const scenarioDHolidays: Holiday[] = [
	...usHolidays2026,
	...companyHolidays,
	{ date: '2026-07-05', name: 'Summer Friday (Company)', type: 'company' }
];

// All holiday templates by region
export const holidayTemplates: Record<string, Holiday[]> = {
	us: usHolidays2026,
	uk: ukHolidays2026,
	company: companyHolidays
};

// Helper function to create a holiday
export function createHoliday(
	date: string,
	name: string,
	type: 'public' | 'company' = 'public'
): Holiday {
	return { date, name, type };
}

// Helper function to get holidays for a specific year (simplified)
export function getHolidaysForYear(year: number, region: 'us' | 'uk' = 'us'): Holiday[] {
	// For mock data, we'll just return the 2026 holidays with adjusted dates
	// In a real implementation, this would calculate actual holiday dates
	const baseHolidays = region === 'us' ? usHolidays2026 : ukHolidays2026;
	return baseHolidays.map((h) => ({
		...h,
		date: h.date.replace('2026', year.toString())
	}));
}
