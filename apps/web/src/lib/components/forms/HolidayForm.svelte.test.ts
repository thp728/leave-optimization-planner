import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import HolidayForm from './HolidayForm.svelte';
import type { Holiday } from '$lib/mocks/types';

function makeHoliday(overrides: Partial<Holiday> = {}): Holiday {
	return {
		date: '2026-01-01',
		name: "New Year's Day",
		type: 'public',
		...overrides
	};
}

function getDateInput() {
	return screen.getByLabelText('Date *', { exact: false }) as HTMLInputElement;
}

function getNameInput() {
	return screen.getByPlaceholderText("e.g., New Year's Day") as HTMLInputElement;
}

describe('HolidayForm', () => {
	describe('date validation', () => {
		it('shows error for empty date after touch', async () => {
			const user = userEvent.setup();
			render(HolidayForm, {
				props: { holiday: makeHoliday({ date: '' }) }
			});
			const dateInput = getDateInput();
			await user.click(dateInput);
			await user.tab();
			expect(screen.getByText(/date is required/i)).toBeInTheDocument();
		});

		it('shows error for invalid date format', async () => {
			const user = userEvent.setup();
			render(HolidayForm, {
				props: { holiday: makeHoliday({ date: 'not-a-date' }) }
			});
			const dateInput = getDateInput();
			await user.click(dateInput);
			await user.tab();
			expect(screen.getByText(/enter a valid date/i)).toBeInTheDocument();
		});
	});

	describe('name validation', () => {
		it('shows error for empty name after touch', async () => {
			const user = userEvent.setup();
			render(HolidayForm, {
				props: { holiday: makeHoliday({ name: '' }) }
			});
			const nameInput = getNameInput();
			await user.click(nameInput);
			await user.tab();
			expect(screen.getByText(/holiday name is required/i)).toBeInTheDocument();
		});

		it('shows error for name > 100 chars after touch', async () => {
			const user = userEvent.setup();
			render(HolidayForm, {
				props: { holiday: makeHoliday({ name: 'A'.repeat(101) }) }
			});
			const nameInput = getNameInput();
			await user.click(nameInput);
			await user.tab();
			expect(screen.getByText(/100 characters or fewer/i)).toBeInTheDocument();
		});
	});

	describe('type toggle', () => {
		it('shows public/company with aria-pressed', () => {
			render(HolidayForm, {
				props: { holiday: makeHoliday({ type: 'public' }) }
			});
			const publicBtn = screen.getByRole('button', { name: /public/i });
			const companyBtn = screen.getByRole('button', { name: /company/i });
			expect(publicBtn).toHaveAttribute('aria-pressed', 'true');
			expect(companyBtn).toHaveAttribute('aria-pressed', 'false');
		});

		it('toggles type on click', async () => {
			const user = userEvent.setup();
			const onUpdate = vi.fn();
			render(HolidayForm, {
				props: { holiday: makeHoliday({ type: 'public' }), onUpdate }
			});
			const companyBtn = screen.getByRole('button', { name: /company/i });
			await user.click(companyBtn);
			expect(companyBtn).toHaveAttribute('aria-pressed', 'true');
		});
	});

	describe('delete confirm flow', () => {
		it('no delete button without onDelete', () => {
			render(HolidayForm, {
				props: { holiday: makeHoliday() }
			});
			expect(screen.queryByLabelText(/delete holiday/i)).not.toBeInTheDocument();
		});

		it('confirm calls onDelete', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(HolidayForm, {
				props: { holiday: makeHoliday(), onDelete }
			});
			await user.click(screen.getByLabelText(/delete holiday/i));
			expect(screen.getByText(/delete this holiday/i)).toBeInTheDocument();
			await user.click(screen.getByRole('button', { name: /yes, delete/i }));
			expect(onDelete).toHaveBeenCalledOnce();
		});

		it('cancel resets confirmation', async () => {
			const user = userEvent.setup();
			const onDelete = vi.fn();
			render(HolidayForm, {
				props: { holiday: makeHoliday(), onDelete }
			});
			await user.click(screen.getByLabelText(/delete holiday/i));
			await user.click(screen.getByRole('button', { name: /cancel/i }));
			expect(onDelete).not.toHaveBeenCalled();
			expect(screen.queryByText(/delete this holiday/i)).not.toBeInTheDocument();
		});
	});
});
