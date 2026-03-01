import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import PolicyBuilder from './PolicyBuilder.svelte';
import { policyStore } from '$lib/stores/policyStore';
import { holidayStore } from '$lib/stores/holidayStore';
import { preferencesStore } from '$lib/stores/preferencesStore';
import { planStore } from '$lib/stores/planStore';
import { get } from 'svelte/store';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('PolicyBuilder', () => {
	beforeEach(() => {
		policyStore.reset();
		holidayStore.clear();
		preferencesStore.reset();
		planStore.clear();
	});

	it('renders 3 tabs with correct ARIA', () => {
		render(PolicyBuilder);
		const tabs = screen.getAllByRole('tab');
		expect(tabs).toHaveLength(3);
		expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
		expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
		expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
	});

	it('switches tab panels on click', async () => {
		const user = userEvent.setup();
		render(PolicyBuilder);
		// Initially on policies
		expect(screen.getByText('Leave Policies', { selector: 'h2' })).toBeInTheDocument();
		// Click holidays tab
		const holidaysTab = screen.getAllByRole('tab')[1];
		await user.click(holidaysTab);
		expect(screen.getByText('Holidays', { selector: 'h2' })).toBeInTheDocument();
	});

	it('optimize button disabled when form incomplete', () => {
		render(PolicyBuilder);
		const optimizeBtn = screen.getByRole('button', { name: /optimize/i });
		expect(optimizeBtn).toBeDisabled();
	});

	it('shows missing items warning when incomplete', () => {
		render(PolicyBuilder);
		expect(screen.getByText(/before you can optimize/i)).toBeInTheDocument();
		expect(screen.getByText(/at least one valid leave policy/i)).toBeInTheDocument();
		expect(screen.getByText(/at least one holiday/i)).toBeInTheDocument();
	});

	it('reset clears all stores', async () => {
		const user = userEvent.setup();
		policyStore.add({ name: 'PTO', daysPerYear: 20, priority: 1 });
		holidayStore.add({ date: '2026-01-01', name: 'NY', type: 'public' });

		render(PolicyBuilder);
		await user.click(screen.getByRole('button', { name: /reset/i }));

		expect(get(policyStore)).toEqual([]);
		expect(get(holidayStore)).toEqual([]);
	});
});
