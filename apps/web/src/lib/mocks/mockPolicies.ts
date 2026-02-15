// mockPolicies.ts - Sample leave policies for testing
import type { LeaveType } from './types';

// Standard PTO policy - 20 days per year
export const standardPTO: LeaveType = {
	id: 'pto-standard',
	name: 'Paid Time Off',
	daysPerYear: 20,
	priority: 1,
	accrualSchedule: 'monthly',
	carryoverDays: 5,
	expiresAtYearEnd: false
};

// Generous PTO policy - 25 days per year
export const generousPTO: LeaveType = {
	id: 'pto-generous',
	name: 'Paid Time Off',
	daysPerYear: 25,
	priority: 1,
	accrualSchedule: 'upfront',
	carryoverDays: 10,
	expiresAtYearEnd: false
};

// Sick leave policy
export const sickLeave: LeaveType = {
	id: 'sick',
	name: 'Sick Leave',
	daysPerYear: 10,
	priority: 3,
	accrualSchedule: 'yearly',
	carryoverDays: 0,
	expiresAtYearEnd: true
};

// Floating holidays
export const floatingHolidays: LeaveType = {
	id: 'floating',
	name: 'Floating Holidays',
	daysPerYear: 3,
	priority: 2,
	accrualSchedule: 'yearly',
	carryoverDays: 0,
	expiresAtYearEnd: true
};

// Casual leave (lower priority)
export const casualLeave: LeaveType = {
	id: 'casual',
	name: 'Casual Leave',
	daysPerYear: 12,
	priority: 4,
	accrualSchedule: 'quarterly',
	carryoverDays: 3,
	expiresAtYearEnd: false
};

// Use-it-or-lose-it PTO (expires at year end)
export const expiringPTO: LeaveType = {
	id: 'pto-expiring',
	name: 'PTO (Use or Lose)',
	daysPerYear: 15,
	priority: 1,
	accrualSchedule: 'upfront',
	carryoverDays: 0,
	expiresAtYearEnd: true
};

// Scenario A: Standard 20 PTO + 10 holidays (simple optimization)
export const scenarioAPolicies: LeaveType[] = [standardPTO];

// Scenario B: Mixed leave types with priority handling
export const scenarioBPolicies: LeaveType[] = [standardPTO, sickLeave, floatingHolidays];

// Scenario C: End-of-year expiring leave
export const scenarioCPolicies: LeaveType[] = [expiringPTO, standardPTO];

// Scenario D: Generous leave for optimal scenario
export const scenarioDPolicies: LeaveType[] = [generousPTO, floatingHolidays];

// All available policy templates
export const policyTemplates: LeaveType[] = [
	standardPTO,
	generousPTO,
	sickLeave,
	floatingHolidays,
	casualLeave,
	expiringPTO
];

// Default empty policy for forms
export function createEmptyLeaveType(): LeaveType {
	return {
		id: crypto.randomUUID(),
		name: '',
		daysPerYear: 0,
		priority: 1,
		accrualSchedule: 'monthly',
		carryoverDays: 0,
		expiresAtYearEnd: false
	};
}
