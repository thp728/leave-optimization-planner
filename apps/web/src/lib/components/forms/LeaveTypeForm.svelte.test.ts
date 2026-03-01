import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import LeaveTypeForm from './LeaveTypeForm.svelte';
import type { LeaveType } from '$lib/mocks/types';

function makeLeaveType(overrides: Partial<LeaveType> = {}): LeaveType {
	return {
		id: 'lt-1',
		name: 'Paid Time Off',
		daysPerYear: 20,
		priority: 1,
		accrualSchedule: 'monthly',
		carryoverDays: 5,
		expiresAtYearEnd: false,
		...overrides
	};
}

function getNameInput() {
	return screen.getByPlaceholderText('e.g., Paid Time Off') as HTMLInputElement;
}

describe('LeaveTypeForm', () => {
	it('renders with prop values populated', () => {
		render(LeaveTypeForm, {
			props: { leaveType: makeLeaveType({ name: 'Sick Leave', daysPerYear: 10 }) }
		});
		const nameInput = getNameInput();
		expect(nameInput.value).toBe('Sick Leave');
	});

	describe('validation', () => {
		it('shows name error only after touch', async () => {
			const user = userEvent.setup();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType({ name: '' }) }
			});
			const nameInput = getNameInput();
			// Before touch — no error
			expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
			// After touch
			await user.click(nameInput);
			await user.tab();
			expect(screen.getByText(/name is required/i)).toBeInTheDocument();
		});

		it('clears name error on valid input', async () => {
			const user = userEvent.setup();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType({ name: '' }) }
			});
			const nameInput = getNameInput();
			await user.click(nameInput);
			await user.tab();
			expect(screen.getByText(/name is required/i)).toBeInTheDocument();
			await user.click(nameInput);
			await user.type(nameInput, 'Valid Name');
			expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
		});

		it('shows days error on invalid value', async () => {
			const user = userEvent.setup();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType({ daysPerYear: 0 }) }
			});
			const daysInput = screen.getByLabelText(/days per year/i);
			await user.click(daysInput);
			await user.tab();
			expect(screen.getByText(/must be a whole number/i)).toBeInTheDocument();
		});

		it('shows priority error on invalid value', async () => {
			const user = userEvent.setup();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType({ priority: 0 }) }
			});
			// Use the input with id containing "priority"
			const priorityInput = document.querySelector('[id^="priority-"]') as HTMLInputElement;
			await user.click(priorityInput);
			await user.tab();
			expect(screen.getByText(/must be a positive whole number/i)).toBeInTheDocument();
		});
	});

	describe('submission', () => {
		it('calls onUpdate with trimmed values when valid', async () => {
			const user = userEvent.setup();
			const onUpdate = vi.fn();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType(), onUpdate }
			});
			const nameInput = getNameInput();
			await user.clear(nameInput);
			await user.type(nameInput, '  Vacation  ');
			expect(onUpdate).toHaveBeenCalled();
			const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
			expect(lastCall.name).toBe('Vacation');
		});

		it('does not call onUpdate when invalid', async () => {
			const user = userEvent.setup();
			const onUpdate = vi.fn();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType({ name: '' }), onUpdate }
			});
			const nameInput = getNameInput();
			await user.click(nameInput);
			await user.tab();
			expect(onUpdate).not.toHaveBeenCalled();
		});
	});

	describe('delete flow', () => {
		it('does not show delete button without onDelete prop', () => {
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType() }
			});
			expect(screen.queryByText(/delete leave type/i)).not.toBeInTheDocument();
		});

		it('confirm calls onDelete', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType(), onDelete }
			});
			await user.click(screen.getByRole('button', { name: /delete leave type/i }));
			expect(screen.getByText(/delete this leave type/i)).toBeInTheDocument();
			await user.click(screen.getByRole('button', { name: /yes, delete/i }));
			expect(onDelete).toHaveBeenCalledOnce();
		});

		it('cancel resets confirmation', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType(), onDelete }
			});
			await user.click(screen.getByRole('button', { name: /delete leave type/i }));
			await user.click(screen.getByRole('button', { name: /cancel/i }));
			expect(onDelete).not.toHaveBeenCalled();
			expect(screen.queryByText(/delete this leave type/i)).not.toBeInTheDocument();
		});
	});

	describe('toggle', () => {
		it('expires at year end switch toggles aria-checked', async () => {
			const user = userEvent.setup();
			render(LeaveTypeForm, {
				props: { leaveType: makeLeaveType({ expiresAtYearEnd: false }) }
			});
			const toggle = screen.getByRole('switch');
			expect(toggle).toHaveAttribute('aria-checked', 'false');
			await user.click(toggle);
			expect(toggle).toHaveAttribute('aria-checked', 'true');
		});
	});
});
