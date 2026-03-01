import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import PreferencesForm from './PreferencesForm.svelte';
import type { UserPreferences } from '$lib/mocks/types';

function makePrefs(overrides: Partial<UserPreferences> = {}): UserPreferences {
	return {
		planningHorizon: { start: '2026-01-01', end: '2026-12-31' },
		minConsecutiveDaysOff: 3,
		maxConsecutiveDaysOff: 15,
		preferredBreakFrequency: 'quarterly',
		...overrides
	};
}

describe('PreferencesForm', () => {
	describe('date range errors', () => {
		it('shows error only when both fields touched', async () => {
			const user = userEvent.setup();
			render(PreferencesForm, {
				props: {
					preferences: makePrefs({
						planningHorizon: { start: '2026-12-31', end: '2026-01-01' }
					})
				}
			});
			// Error should not show before touching
			expect(screen.queryByText(/end date must be after/i)).not.toBeInTheDocument();

			// Touch start
			const startInput = screen.getByLabelText(/start date/i);
			await user.click(startInput);
			await user.tab();
			// Still not shown (need both)
			expect(screen.queryByText(/end date must be after/i)).not.toBeInTheDocument();

			// Touch end
			const endInput = screen.getByLabelText(/end date/i);
			await user.click(endInput);
			await user.tab();
			expect(screen.getByText(/end date must be after/i)).toBeInTheDocument();
		});
	});

	describe('min/max days validation', () => {
		it('shows error for min days < 1', async () => {
			const user = userEvent.setup();
			render(PreferencesForm, {
				props: { preferences: makePrefs({ minConsecutiveDaysOff: 0 }) }
			});
			const minInput = screen.getByLabelText(/min consecutive days off/i);
			await user.click(minInput);
			await user.tab();
			expect(screen.getByText(/must be at least 1/i)).toBeInTheDocument();
		});

		it('shows error for max days > 365', async () => {
			const user = userEvent.setup();
			render(PreferencesForm, {
				props: { preferences: makePrefs({ maxConsecutiveDaysOff: 400 }) }
			});
			const maxInput = screen.getByLabelText(/max consecutive days off/i);
			await user.click(maxInput);
			await user.tab();
			expect(screen.getByText(/cannot exceed 365/i)).toBeInTheDocument();
		});

		it('shows error when max < min', async () => {
			const user = userEvent.setup();
			render(PreferencesForm, {
				props: {
					preferences: makePrefs({
						minConsecutiveDaysOff: 10,
						maxConsecutiveDaysOff: 5
					})
				}
			});
			const maxInput = screen.getByLabelText(/max consecutive days off/i);
			await user.click(maxInput);
			await user.tab();
			expect(screen.getByText(/must be at least 10/i)).toBeInTheDocument();
		});
	});

	describe('break frequency toggle', () => {
		it('shows buttons with correct aria-pressed', () => {
			render(PreferencesForm, {
				props: { preferences: makePrefs({ preferredBreakFrequency: 'quarterly' }) }
			});
			const quarterlyBtn = screen.getByRole('button', { name: 'Quarterly' });
			const monthlyBtn = screen.getByRole('button', { name: 'Monthly' });
			expect(quarterlyBtn).toHaveAttribute('aria-pressed', 'true');
			expect(monthlyBtn).toHaveAttribute('aria-pressed', 'false');
		});

		it('toggles frequency on click', async () => {
			const user = userEvent.setup();
			const onUpdate = vi.fn();
			render(PreferencesForm, {
				props: { preferences: makePrefs(), onUpdate }
			});
			const monthlyBtn = screen.getByRole('button', { name: 'Monthly' });
			await user.click(monthlyBtn);
			expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true');
		});
	});

	describe('preset buttons', () => {
		it('6 months preset sets end date ~6 months from start', async () => {
			const user = userEvent.setup();
			const onUpdate = vi.fn();
			render(PreferencesForm, {
				props: {
					preferences: makePrefs({
						planningHorizon: { start: '2026-01-01', end: '2026-03-01' }
					}),
					onUpdate
				}
			});
			await user.click(screen.getByRole('button', { name: '6 Months' }));
			expect(onUpdate).toHaveBeenCalled();
			const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
			const endDate = new Date(lastCall.planningHorizon.end);
			const startDate = new Date('2026-01-01');
			const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
			// 6 months from Jan 1 should be ~180-182 days
			expect(diffDays).toBeGreaterThanOrEqual(180);
			expect(diffDays).toBeLessThanOrEqual(183);
		});

		it('1 year preset sets end date ~12 months from start', async () => {
			const user = userEvent.setup();
			const onUpdate = vi.fn();
			render(PreferencesForm, {
				props: {
					preferences: makePrefs({
						planningHorizon: { start: '2026-01-01', end: '2026-03-01' }
					}),
					onUpdate
				}
			});
			await user.click(screen.getByRole('button', { name: '1 Year' }));
			expect(onUpdate).toHaveBeenCalled();
			const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
			const endDate = new Date(lastCall.planningHorizon.end);
			const startDate = new Date('2026-01-01');
			const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
			// 12 months from Jan 1 should be ~364-366 days
			expect(diffDays).toBeGreaterThanOrEqual(364);
			expect(diffDays).toBeLessThanOrEqual(366);
		});
	});
});
