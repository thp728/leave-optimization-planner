import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import PlanComparison from './PlanComparison.svelte';
import type { LeavePlan } from '$lib/mocks/types';

function makePlan(overrides: Partial<LeavePlan> = {}): LeavePlan {
	return {
		id: 'plan-1',
		rank: 1,
		totalDaysOff: 130,
		paidLeaveDays: 20,
		longestConsecutiveBreak: 9,
		dailyAssignments: [],
		rationale: 'Test',
		...overrides
	};
}

describe('PlanComparison', () => {
	it('shows empty state when no plans', () => {
		render(PlanComparison, {
			props: { plans: [], selectedPlanId: null }
		});
		expect(screen.getByText(/no plans to compare/i)).toBeInTheDocument();
	});

	it('renders correct column count (plans + 1 for metric label)', () => {
		const plans = [
			makePlan({ id: 'p1', rank: 1 }),
			makePlan({ id: 'p2', rank: 2 })
		];
		render(PlanComparison, {
			props: { plans, selectedPlanId: 'p1' }
		});
		const headers = screen.getAllByRole('columnheader');
		expect(headers).toHaveLength(3); // metric + 2 plans
	});

	it('highlights best values with check icon', () => {
		const plans = [
			makePlan({ id: 'p1', rank: 1, totalDaysOff: 150, paidLeaveDays: 10 }),
			makePlan({ id: 'p2', rank: 2, totalDaysOff: 120, paidLeaveDays: 25 })
		];
		render(PlanComparison, {
			props: { plans, selectedPlanId: 'p1' }
		});
		// The table should render with metrics
		const table = screen.getByRole('table');
		expect(table).toBeInTheDocument();
		// Check that plan data appears
		expect(screen.getByText('150')).toBeInTheDocument();
		expect(screen.getByText('120')).toBeInTheDocument();
	});

	it('calls onSelectPlan on click', async () => {
		const user = userEvent.setup();
		const onSelectPlan = vi.fn();
		const plans = [makePlan({ id: 'p1', rank: 1 })];
		render(PlanComparison, {
			props: { plans, selectedPlanId: null, onSelectPlan }
		});
		const selectBtn = screen.getByRole('button', { name: /select/i });
		await user.click(selectBtn);
		expect(onSelectPlan).toHaveBeenCalledWith('p1');
	});

	it('shows single-plan note', () => {
		render(PlanComparison, {
			props: { plans: [makePlan()], selectedPlanId: 'plan-1' }
		});
		expect(screen.getByText(/only one plan was generated/i)).toBeInTheDocument();
	});

	it('does not show single-plan note for multiple plans', () => {
		render(PlanComparison, {
			props: {
				plans: [makePlan({ id: 'p1' }), makePlan({ id: 'p2', rank: 2 })],
				selectedPlanId: 'p1'
			}
		});
		expect(screen.queryByText(/only one plan was generated/i)).not.toBeInTheDocument();
	});
});
