// mockApi.ts - Mock API service that mimics real API responses
import type { OptimizeRequest, OptimizeResponse } from './types';
import { getMockPlans } from './mockPlans';
import { scenarioAPolicies } from './mockPolicies';
import { usHolidays2026 } from './mockHolidays';

// Simulate network delay
const MOCK_DELAY_MS = 500;

// Simulate network request with delay
function simulateNetwork<T>(data: T): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), MOCK_DELAY_MS);
	});
}

// Determine which scenario to return based on request data
function determineScenario(request: OptimizeRequest): string {
	const leaveTypeCount = request.leaveTypes.length;
	const hasExpiringLeave = request.leaveTypes.some((lt) => lt.expiresAtYearEnd);
	const totalDays = request.leaveTypes.reduce((sum, lt) => sum + lt.daysPerYear, 0);

	if (totalDays >= 25) {
		return 'scenarioD'; // Generous leave
	}
	if (hasExpiringLeave) {
		return 'scenarioC'; // Expiring leave
	}
	if (leaveTypeCount > 1) {
		return 'scenarioB'; // Mixed leave types
	}
	return 'scenarioA'; // Standard simple case
}

// Mock API client
export const mockApi = {
	/**
	 * Optimize leave plans based on input configuration
	 */
	async optimize(request: OptimizeRequest): Promise<OptimizeResponse> {
		console.log('[Mock API] optimize called with:', request);

		const scenario = determineScenario(request);
		const response = getMockPlans(scenario);

		return simulateNetwork(response);
	},

	/**
	 * Get available leave policy templates
	 */
	async getPolicyTemplates(): Promise<typeof scenarioAPolicies> {
		console.log('[Mock API] getPolicyTemplates called');

		const { policyTemplates } = await import('./mockPolicies');
		return simulateNetwork(policyTemplates);
	},

	/**
	 * Get holiday templates for a region
	 */
	async getHolidayTemplates(region: 'us' | 'uk' = 'us'): Promise<typeof usHolidays2026> {
		console.log('[Mock API] getHolidayTemplates called for region:', region);

		const { holidayTemplates } = await import('./mockHolidays');
		return simulateNetwork(holidayTemplates[region] || holidayTemplates.us);
	},

	/**
	 * Health check endpoint
	 */
	async healthCheck(): Promise<{ status: 'healthy' | 'degraded'; version: string }> {
		return simulateNetwork({
			status: 'healthy',
			version: '0.1.0-mock'
		});
	}
};

// Export a convenience function to simulate different network conditions
export function createMockApiWithDelay(delayMs: number) {
	return {
		...mockApi,
		async optimize(request: OptimizeRequest): Promise<OptimizeResponse> {
			const scenario = determineScenario(request);
			const response = getMockPlans(scenario);

			return new Promise((resolve) => {
				setTimeout(() => resolve(response), delayMs);
			});
		}
	};
}

// Export error simulation for testing error handling
export function createMockApiWithError(errorMessage: string) {
	return {
		...mockApi,
		async optimize(): Promise<never> {
			return new Promise((_, reject) => {
				setTimeout(() => reject(new Error(errorMessage)), MOCK_DELAY_MS);
			});
		}
	};
}
