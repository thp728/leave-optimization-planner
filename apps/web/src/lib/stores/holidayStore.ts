// holidayStore.ts - Svelte store for holiday calendar
import { writable, derived } from 'svelte/store';
import type { Holiday } from '$lib/mocks/types';

// Store for holidays
function createHolidayStore() {
	const { subscribe, set, update } = writable<Holiday[]>([]);

	return {
		subscribe,
		set,
		update,

		// Add a new holiday
		add: (holiday: Omit<Holiday, 'date'> & { date: string }) => {
			update((holidays) => {
				// Check if holiday already exists for this date
				const exists = holidays.some((h) => h.date === holiday.date);
				if (exists) {
					// Update existing
					return holidays.map((h) => (h.date === holiday.date ? holiday : h));
				}
				// Add new
				return [...holidays, holiday];
			});
		},

		// Remove a holiday by date
		remove: (date: string) => {
			update((holidays) => holidays.filter((h) => h.date !== date));
		},

		// Update a holiday
		updateHoliday: (date: string, updates: Partial<Holiday>) => {
			update((holidays) => holidays.map((h) => (h.date === date ? { ...h, ...updates } : h)));
		},

		// Load preset holidays
		loadPreset: (holidays: Holiday[]) => set(holidays),

		// Clear all holidays
		clear: () => set([]),

		// Import holidays from template
		importFromTemplate: async (region: 'us' | 'uk' = 'us') => {
			const { holidayTemplates } = await import('$lib/mocks/mockHolidays');
			set(holidayTemplates[region] || holidayTemplates.us);
		}
	};
}

export const holidayStore = createHolidayStore();

// Derived store for holidays sorted by date
export const holidaysByDate = derived(holidayStore, ($holidays) =>
	[...$holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
);

// Derived store for public holidays only
export const publicHolidays = derived(holidayStore, ($holidays) =>
	$holidays.filter((h) => h.type === 'public')
);

// Derived store for company holidays only
export const companyHolidays = derived(holidayStore, ($holidays) =>
	$holidays.filter((h) => h.type === 'company')
);

// Derived store for holiday count
export const holidayCount = derived(holidayStore, ($holidays) => $holidays.length);

// Derived store to get holidays as a Set for quick lookup
export const holidayDateSet = derived(
	holidayStore,
	($holidays) => new Set($holidays.map((h) => h.date))
);
