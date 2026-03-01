<script lang="ts">
	import { Trash2, AlertCircle } from 'lucide-svelte';
	import type { LeaveType, AccrualSchedule } from '$lib/mocks/types';

	interface Props {
		leaveType: LeaveType;
		onUpdate?: (updated: LeaveType) => void;
		onDelete?: () => void;
	}

	let { leaveType, onUpdate, onDelete }: Props = $props();

	let name = $state('');
	let daysPerYear = $state(0);
	let priority = $state(0);
	let accrualSchedule = $state<AccrualSchedule>('upfront');
	let carryoverDays = $state(0);
	let expiresAtYearEnd = $state(false);

	let confirmingDelete = $state(false);

	// Only show validation errors after the user has interacted with a field
	let touched = $state({
		name: false,
		daysPerYear: false,
		priority: false,
		carryoverDays: false
	});

	// Sync prop → local state when parent swaps the leaveType (e.g. loading a preset)
	$effect(() => {
		name = leaveType.name;
		daysPerYear = leaveType.daysPerYear;
		priority = leaveType.priority;
		accrualSchedule = leaveType.accrualSchedule;
		carryoverDays = leaveType.carryoverDays;
		expiresAtYearEnd = leaveType.expiresAtYearEnd;
	});

	// Empty string = valid; non-empty = error message to display
	let nameError = $derived(name.trim().length === 0 ? 'Leave type name is required' : '');

	let daysError = $derived(
		!Number.isInteger(daysPerYear) || daysPerYear < 1
			? 'Must be a whole number of at least 1'
			: ''
	);

	let priorityError = $derived(
		!Number.isInteger(priority) || priority < 1 ? 'Must be a positive whole number' : ''
	);

	let carryoverError = $derived(
		!Number.isInteger(carryoverDays) || carryoverDays < 0 ? 'Must be 0 or more' : ''
	);

	let isValid = $derived(
		nameError === '' && daysError === '' && priorityError === '' && carryoverError === ''
	);

	function emitUpdate() {
		if (!isValid) return;
		onUpdate?.({
			id: leaveType.id,
			name: name.trim(),
			daysPerYear,
			priority,
			accrualSchedule,
			carryoverDays,
			expiresAtYearEnd
		});
	}

	function handleDeleteClick() {
		confirmingDelete = true;
	}

	function handleDeleteConfirm() {
		onDelete?.();
	}

	function handleDeleteCancel() {
		confirmingDelete = false;
	}

	const accrualOptions: Array<{ value: AccrualSchedule; label: string; description: string }> = [
		{ value: 'upfront', label: 'Upfront', description: 'All days available Jan 1' },
		{ value: 'monthly', label: 'Monthly', description: 'Days accrue each month' },
		{ value: 'quarterly', label: 'Quarterly', description: 'Days accrue each quarter' },
		{ value: 'yearly', label: 'Yearly', description: 'All days available after 1 year' }
	];

	function inputClasses(error: string, isTouched: boolean): string {
		const base = [
			'w-full rounded-md border px-3 py-2 text-sm',
			'text-text-primary bg-surface-raised shadow-xs',
			'placeholder:text-text-tertiary',
			'transition-colors duration-150',
			'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2'
		].join(' ');

		if (error && isTouched) {
			return `${base} border-error-500 bg-error-50`;
		}
		return `${base} border-border focus:border-primary-500`;
	}
</script>

<div class="bg-surface-raised border-border space-y-4 rounded-lg border p-4 shadow-sm">
	<!-- Name -->
	<div class="space-y-1">
		<label for="name-{leaveType.id}" class="block text-sm font-medium text-text-primary">
			Leave type name
			<span aria-hidden="true" class="ml-0.5 text-error-500">*</span>
		</label>

		<input
			id="name-{leaveType.id}"
			type="text"
			class={inputClasses(nameError, touched.name)}
			bind:value={name}
			oninput={() => {
				touched.name = true;
				emitUpdate();
			}}
			onblur={() => (touched.name = true)}
			placeholder="e.g., Paid Time Off"
			required
			aria-required="true"
			aria-invalid={touched.name && nameError !== ''}
			aria-describedby={touched.name && nameError
				? `name-error-${leaveType.id}`
				: undefined}
		/>

		{#if touched.name && nameError}
			<p
				id="name-error-{leaveType.id}"
				role="alert"
				class="flex items-center gap-1 text-xs text-error-700"
			>
				<AlertCircle size={12} aria-hidden="true" />
				{nameError}
			</p>
		{/if}
	</div>

	<!-- Days per Year + Priority -->
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1">
			<label for="days-{leaveType.id}" class="block text-sm font-medium text-text-primary">
				Days per year
				<span aria-hidden="true" class="ml-0.5 text-error-500">*</span>
			</label>

			<input
				id="days-{leaveType.id}"
				type="number"
				class={inputClasses(daysError, touched.daysPerYear)}
				bind:value={daysPerYear}
				onchange={() => {
					touched.daysPerYear = true;
					emitUpdate();
				}}
				onblur={() => (touched.daysPerYear = true)}
				min="1"
				step="1"
				required
				aria-required="true"
				aria-invalid={touched.daysPerYear && daysError !== ''}
				aria-describedby={touched.daysPerYear && daysError
					? `days-error-${leaveType.id}`
					: undefined}
			/>

			{#if touched.daysPerYear && daysError}
				<p
					id="days-error-{leaveType.id}"
					role="alert"
					class="flex items-center gap-1 text-xs text-error-700"
				>
					<AlertCircle size={12} aria-hidden="true" />
					{daysError}
				</p>
			{/if}
		</div>

		<div class="space-y-1">
			<label for="priority-{leaveType.id}" class="block text-sm font-medium text-text-primary">
				Priority
				<span aria-hidden="true" class="ml-0.5 text-error-500">*</span>
			</label>

			<input
				id="priority-{leaveType.id}"
				type="number"
				class={inputClasses(priorityError, touched.priority)}
				bind:value={priority}
				onchange={() => {
					touched.priority = true;
					emitUpdate();
				}}
				onblur={() => (touched.priority = true)}
				min="1"
				step="1"
				required
				aria-required="true"
				aria-invalid={touched.priority && priorityError !== ''}
				aria-describedby="priority-hint-{leaveType.id}{touched.priority && priorityError
					? ` priority-error-${leaveType.id}`
					: ''}"
			/>

			<p id="priority-hint-{leaveType.id}" class="text-xs text-text-tertiary">
				Lower number = used first
			</p>

			{#if touched.priority && priorityError}
				<p
					id="priority-error-{leaveType.id}"
					role="alert"
					class="flex items-center gap-1 text-xs text-error-700"
				>
					<AlertCircle size={12} aria-hidden="true" />
					{priorityError}
				</p>
			{/if}
		</div>
	</div>

	<!-- Accrual Schedule -->
	<div class="space-y-1">
		<label for="accrual-{leaveType.id}" class="block text-sm font-medium text-text-primary">
			Accrual schedule
		</label>

		<select
			id="accrual-{leaveType.id}"
			class="border-border bg-surface-raised text-text-primary w-full cursor-pointer rounded-md border px-3 py-2 text-sm shadow-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
			bind:value={accrualSchedule}
			onchange={emitUpdate}
		>
			{#each accrualOptions as option}
				<option value={option.value}>{option.label} — {option.description}</option>
			{/each}
		</select>
	</div>

	<!-- Carryover Days + Expires at Year End -->
	<div class="grid grid-cols-2 gap-4 items-start">
		<div class="space-y-1">
			<label for="carryover-{leaveType.id}" class="block text-sm font-medium text-text-primary">
				Carryover days
			</label>

			<input
				id="carryover-{leaveType.id}"
				type="number"
				class={inputClasses(carryoverError, touched.carryoverDays)}
				bind:value={carryoverDays}
				onchange={() => {
					touched.carryoverDays = true;
					emitUpdate();
				}}
				onblur={() => (touched.carryoverDays = true)}
				min="0"
				step="1"
				aria-invalid={touched.carryoverDays && carryoverError !== ''}
				aria-describedby={touched.carryoverDays && carryoverError
					? `carryover-error-${leaveType.id}`
					: undefined}
			/>

			{#if touched.carryoverDays && carryoverError}
				<p
					id="carryover-error-{leaveType.id}"
					role="alert"
					class="flex items-center gap-1 text-xs text-error-700"
				>
					<AlertCircle size={12} aria-hidden="true" />
					{carryoverError}
				</p>
			{/if}
		</div>

		<div class="flex flex-col space-y-2">
			<span
				class="block text-sm font-medium text-text-primary"
				id="expires-label-{leaveType.id}"
			>
				Expires at year end
			</span>

			<button
				type="button"
				role="switch"
				aria-checked={expiresAtYearEnd ? 'true' : 'false'}
				aria-labelledby="expires-label-{leaveType.id}"
				class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 {expiresAtYearEnd
					? 'bg-primary-500'
					: 'bg-border-strong'}"
				onclick={() => {
					expiresAtYearEnd = !expiresAtYearEnd;
					emitUpdate();
				}}
			>
				<span
					class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 {expiresAtYearEnd
						? 'translate-x-6'
						: 'translate-x-1'}"
					aria-hidden="true"
				></span>
			</button>

			<p class="text-xs text-text-tertiary">
				{expiresAtYearEnd ? 'Unused days expire Dec 31' : 'Unused days carry over'}
			</p>
		</div>
	</div>

	<!-- Delete — only rendered if onDelete prop is provided -->
	{#if onDelete}
		<div class="border-border border-t pt-4">
			{#if !confirmingDelete}
				<button
					type="button"
					class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-error-500 transition-colors duration-150 hover:bg-error-50 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
					onclick={handleDeleteClick}
				>
					<Trash2 size={14} aria-hidden="true" />
					Delete leave type
				</button>
			{:else}
				<div class="flex items-center gap-2" role="group" aria-label="Confirm deletion">
					<p class="text-sm text-text-secondary">Delete this leave type?</p>

					<button
						type="button"
						class="rounded-md bg-error-500 px-3 py-1.5 text-sm text-text-inverse transition-colors duration-150 hover:bg-error-700 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={handleDeleteConfirm}
					>
						Yes, delete
					</button>

					<button
						type="button"
						class="border-border text-text-primary rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={handleDeleteCancel}
					>
						Cancel
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
