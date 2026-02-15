// types.ts - TypeScript interfaces for leave optimization
// Will be replaced by OpenAPI-generated types in Phase 5

export type AccrualSchedule = 'monthly' | 'quarterly' | 'yearly' | 'upfront';
export type DayType = 'work' | 'weekend' | 'holiday' | 'leave';
export type HolidayType = 'public' | 'company';
export type BreakFrequency = 'monthly' | 'quarterly' | 'flexible';

export interface LeaveType {
	id: string;
	name: string;
	daysPerYear: number;
	priority: number; // Lower = preferred
	accrualSchedule: AccrualSchedule;
	carryoverDays: number;
	expiresAtYearEnd: boolean;
}

export interface Holiday {
	date: string; // ISO format YYYY-MM-DD
	name: string;
	type: HolidayType;
}

export interface DateRange {
	start: string; // ISO format YYYY-MM-DD
	end: string; // ISO format YYYY-MM-DD
}

export interface UserPreferences {
	planningHorizon: DateRange;
	minConsecutiveDaysOff: number;
	maxConsecutiveDaysOff: number;
	preferredBreakFrequency: BreakFrequency;
}

export interface DayAssignment {
	date: string; // ISO format YYYY-MM-DD
	type: DayType;
	leaveTypeId?: string;
	isPaidLeave: boolean;
	rationale?: string;
}

export interface LeavePlan {
	id: string;
	rank: number;
	totalDaysOff: number;
	paidLeaveDays: number;
	longestConsecutiveBreak: number;
	dailyAssignments: DayAssignment[];
	rationale: string;
}

export interface OptimizeRequest {
	leaveTypes: LeaveType[];
	holidays: Holiday[];
	preferences: UserPreferences;
}

export interface OptimizeMetadata {
	executionTimeMs: number;
	horizonDays: number;
	totalSolutionsFound: number;
}

export interface OptimizeResponse {
	plans: LeavePlan[];
	metadata: OptimizeMetadata;
}

// UI-specific types
export type Variant =
	| 'primary'
	| 'secondary'
	| 'accent'
	| 'ghost'
	| 'success'
	| 'warning'
	| 'error';
export type Size = 'sm' | 'md' | 'lg';
export type ValidationState = 'idle' | 'valid' | 'invalid';
export type ToastType = 'info' | 'success' | 'warning' | 'error';
