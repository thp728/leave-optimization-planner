// preferencesStore.ts - Svelte store for user preferences
import { writable, derived } from 'svelte/store';
import type { UserPreferences, DateRange, BreakFrequency } from '$lib/mocks/types';

// Default preferences
const defaultPreferences: UserPreferences = {
	planningHorizon: {
		start: new Date().toISOString().split('T')[0],
		end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
	},
	minConsecutiveDaysOff: 3,
	maxConsecutiveDaysOff: 15,
	preferredBreakFrequency: 'quarterly'
};

// Store for user preferences
function createPreferencesStore() {
	const { subscribe, set, update } = writable<UserPreferences>(defaultPreferences);

	return {
		subscribe,
		set,
		update,

		// Update planning horizon
		setPlanningHorizon: (horizon: DateRange) => {
			update((prefs) => ({
				...prefs,
				planningHorizon: horizon
			}));
		},

		// Update horizon start date
		setStartDate: (start: string) => {
			update((prefs) => ({
				...prefs,
				planningHorizon: {
					...prefs.planningHorizon,
					start
				}
			}));
		},

		// Update horizon end date
		setEndDate: (end: string) => {
			update((prefs) => ({
				...prefs,
				planningHorizon: {
					...prefs.planningHorizon,
					end
				}
			}));
		},

		// Update minimum consecutive days off
		setMinConsecutiveDays: (days: number) => {
			update((prefs) => ({
				...prefs,
				minConsecutiveDaysOff: Math.max(1, days)
			}));
		},

		// Update maximum consecutive days off
		setMaxConsecutiveDays: (days: number) => {
			update((prefs) => ({
				...prefs,
				maxConsecutiveDaysOff: Math.max(prefs.minConsecutiveDaysOff, days)
			}));
		},

		// Update preferred break frequency
		setBreakFrequency: (frequency: BreakFrequency) => {
			update((prefs) => ({
				...prefs,
				preferredBreakFrequency: frequency
			}));
		},

		// Reset to defaults
		reset: () => set(defaultPreferences),

		// Load saved preferences
		load: (prefs: UserPreferences) => set(prefs)
	};
}

export const preferencesStore = createPreferencesStore();

// Derived store for horizon duration in days
export const horizonDurationDays = derived(preferencesStore, ($prefs) => {
	const start = new Date($prefs.planningHorizon.start);
	const end = new Date($prefs.planningHorizon.end);
	const diffTime = end.getTime() - start.getTime();
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Derived store to check if preferences are valid
export const isPreferencesValid = derived(preferencesStore, ($prefs) => {
	const start = new Date($prefs.planningHorizon.start);
	const end = new Date($prefs.planningHorizon.end);
	const isValidDateRange = start < end;
	const isValidMinMax = $prefs.minConsecutiveDaysOff <= $prefs.maxConsecutiveDaysOff;
	const isValidMin = $prefs.minConsecutiveDaysOff >= 1;
	const isValidMax = $prefs.maxConsecutiveDaysOff <= 365;

	return isValidDateRange && isValidMinMax && isValidMin && isValidMax;
});

// Derived store for planning horizon as Date objects
export const planningHorizonDates = derived(preferencesStore, ($prefs) => ({
	start: new Date($prefs.planningHorizon.start),
	end: new Date($prefs.planningHorizon.end)
}));
