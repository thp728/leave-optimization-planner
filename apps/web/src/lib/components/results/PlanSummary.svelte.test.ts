import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import PlanSummary from './PlanSummary.svelte';
import type { LeavePlan } from '$lib/mocks/types';

function makePlan(overrides: Partial<LeavePlan> = {}): LeavePlan {
	return {
		id: 'plan-1',
		rank: 1,
		totalDaysOff: 130,
		paidLeaveDays: 20,
		longestConsecutiveBreak: 9,
		dailyAssignments: [],
		rationale: 'Short rationale text',
		...overrides
	};
}

describe('PlanSummary', () => {
	it('shows trophy badge for rank 1', () => {
		render(PlanSummary, { props: { plan: makePlan({ rank: 1 }) } });
		expect(screen.getByText(/#1 Best/i)).toBeInTheDocument();
	});

	it('shows "Rank #N" for other ranks', () => {
		render(PlanSummary, { props: { plan: makePlan({ rank: 3 }) } });
		expect(screen.getByText(/rank #3/i)).toBeInTheDocument();
	});

	it('displays all metrics', () => {
		render(PlanSummary, {
			props: {
				plan: makePlan({
					totalDaysOff: 131,
					paidLeaveDays: 21,
					longestConsecutiveBreak: 11
				})
			}
		});
		expect(screen.getByText('131')).toBeInTheDocument();
		expect(screen.getByText('21')).toBeInTheDocument();
		expect(screen.getByText('11')).toBeInTheDocument();
		// 131 / 21 = 6.2
		expect(screen.getByText('6.2×')).toBeInTheDocument();
	});

	it('shows infinity when paidLeaveDays is 0', () => {
		render(PlanSummary, {
			props: { plan: makePlan({ paidLeaveDays: 0, totalDaysOff: 50 }) }
		});
		// The ∞× symbol
		const efficiencyEl = screen.getByText(/∞/);
		expect(efficiencyEl).toBeInTheDocument();
	});

	describe('rationale truncation', () => {
		it('truncates at 120 chars with expand/collapse', async () => {
			const user = userEvent.setup();
			const longRationale = 'A'.repeat(150);
			render(PlanSummary, {
				props: { plan: makePlan({ rationale: longRationale }) }
			});
			// Should show truncated text and "Show more"
			expect(screen.getByText(/show more/i)).toBeInTheDocument();

			// Expand
			await user.click(screen.getByText(/show more/i));
			expect(screen.getByText(longRationale)).toBeInTheDocument();
			expect(screen.getByText(/show less/i)).toBeInTheDocument();

			// Collapse
			await user.click(screen.getByText(/show less/i));
			expect(screen.getByText(/show more/i)).toBeInTheDocument();
		});

		it('does not show expand button for short rationale', () => {
			render(PlanSummary, {
				props: { plan: makePlan({ rationale: 'Short text' }) }
			});
			expect(screen.queryByText(/show more/i)).not.toBeInTheDocument();
		});
	});

	describe('select button', () => {
		it('only renders with onSelect prop', () => {
			render(PlanSummary, {
				props: { plan: makePlan() }
			});
			expect(screen.queryByRole('button', { name: /select this plan/i })).not.toBeInTheDocument();
		});

		it('renders and calls onSelect', async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(PlanSummary, {
				props: { plan: makePlan(), onSelect }
			});
			await user.click(screen.getByRole('button', { name: /select this plan/i }));
			expect(onSelect).toHaveBeenCalledOnce();
		});

		it('shows "Currently Viewing" when selected', () => {
			render(PlanSummary, {
				props: { plan: makePlan(), isSelected: true, onSelect: vi.fn() }
			});
			expect(screen.getByRole('button', { name: /currently viewing/i })).toBeInTheDocument();
		});
	});
});
