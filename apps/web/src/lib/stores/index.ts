// stores/index.ts - Barrel export for all stores
export { policyStore, totalLeaveDays, policiesByPriority, isPolicyValid } from './policyStore';

export {
	holidayStore,
	holidaysByDate,
	publicHolidays,
	companyHolidays,
	holidayCount,
	holidayDateSet
} from './holidayStore';

export {
	preferencesStore,
	horizonDurationDays,
	isPreferencesValid,
	planningHorizonDates
} from './preferencesStore';

export {
	planStore,
	selectedPlan,
	sortedPlans,
	isLoading,
	hasError,
	hasPlans,
	planCount,
	bestPlan
} from './planStore';
