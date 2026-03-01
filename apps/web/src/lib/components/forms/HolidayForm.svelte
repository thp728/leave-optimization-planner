<script lang="ts">
	import { Trash2, AlertCircle, Globe, Building2 } from 'lucide-svelte';
	import type { Holiday, HolidayType } from '$lib/mocks/types';
	import { isValidDate } from '$lib/utils/dateUtils';

	interface Props {
		holiday: Holiday;
		onUpdate?: (updated: Holiday) => void;
		onDelete?: () => void;
	}

	let { holiday, onUpdate, onDelete }: Props = $props();

	let date = $state('');
	let name = $state('');
	let type = $state<HolidayType>('public');
	let confirmingDelete = $state(false);

	let touched = $state({ date: false, name: false });

	$effect(() => {
		date = holiday.date;
		name = holiday.name;
		type = holiday.type;
	});

	function formatDate(value: string): string {
		if (!isValidDate(value)) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		}).format(new Date(value + 'T00:00:00Z'));
	}

	let dateError = $derived(
		date.trim() === ''
			? 'Date is required'
			: !isValidDate(date)
				? 'Enter a valid date'
				: ''
	);

	let nameError = $derived(
		name.trim().length === 0
			? 'Holiday name is required'
			: name.trim().length > 100
				? 'Name must be 100 characters or fewer'
				: ''
	);

	let isValid = $derived(dateError === '' && nameError === '');

	function emitUpdate() {
		if (!isValid) return;
		onUpdate?.({ date, name: name.trim(), type });
	}

	function inputClasses(error: string, isTouched: boolean): string {
		const base = [
			'w-full rounded-md border px-3 py-2 text-sm',
			'text-text-primary bg-surface-raised shadow-xs',
			'placeholder:text-text-tertiary',
			'transition-colors duration-150',
			'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2'
		].join(' ');

		if (error && isTouched) return `${base} border-error-500 bg-error-50`;
		return `${base} border-border focus:border-primary-500`;
	}
</script>

<div class="bg-surface-raised border-border space-y-3 rounded-lg border p-3 shadow-xs">
	<div class="flex items-start gap-3">
		<!-- Date -->
		<div class="min-w-0 flex-1 space-y-1">
			<label for="date-{holiday.date}" class="block text-xs font-medium text-text-secondary">
				Date <span aria-hidden="true" class="text-error-500">*</span>
			</label>
			<input
				id="date-{holiday.date}"
				type="date"
				class={inputClasses(dateError, touched.date)}
				bind:value={date}
				onchange={() => {
					touched.date = true;
					emitUpdate();
				}}
				onblur={() => (touched.date = true)}
				required
				aria-required="true"
				aria-invalid={touched.date && dateError !== ''}
				aria-describedby={touched.date && dateError ? `date-error-${holiday.date}` : undefined}
			/>
			{#if touched.date && dateError}
				<p
					id="date-error-{holiday.date}"
					role="alert"
					class="flex items-center gap-1 text-xs text-error-700"
				>
					<AlertCircle size={12} aria-hidden="true" />
					{dateError}
				</p>
			{:else if isValidDate(date)}
				<p class="text-xs text-text-tertiary">{formatDate(date)}</p>
			{/if}
		</div>

		<!-- Name -->
		<div class="min-w-0 flex-2 space-y-1">
			<label for="name-{holiday.date}" class="block text-xs font-medium text-text-secondary">
				Name <span aria-hidden="true" class="text-error-500">*</span>
			</label>
			<input
				id="name-{holiday.date}"
				type="text"
				class={inputClasses(nameError, touched.name)}
				bind:value={name}
				oninput={() => {
					touched.name = true;
					emitUpdate();
				}}
				onblur={() => (touched.name = true)}
				placeholder="e.g., New Year's Day"
				required
				aria-required="true"
				aria-invalid={touched.name && nameError !== ''}
				aria-describedby={touched.name && nameError ? `name-error-${holiday.date}` : undefined}
			/>
			{#if touched.name && nameError}
				<p
					id="name-error-{holiday.date}"
					role="alert"
					class="flex items-center gap-1 text-xs text-error-700"
				>
					<AlertCircle size={12} aria-hidden="true" />
					{nameError}
				</p>
			{/if}
		</div>

		<!-- Type toggle -->
		<div class="shrink-0 space-y-1">
			<span class="block text-xs font-medium text-text-secondary">Type</span>
			<div
				class="border-border flex overflow-hidden rounded-md border text-sm shadow-xs"
				role="group"
				aria-label="Holiday type"
			>
				<button
					type="button"
					class="flex items-center gap-1.5 px-3 py-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:-outline-offset-2 {type ===
					'public'
						? 'bg-primary-500 text-text-inverse'
						: 'bg-surface-raised text-text-secondary hover:bg-surface-overlay'}"
					aria-pressed={type === 'public'}
					onclick={() => {
						type = 'public';
						emitUpdate();
					}}
				>
					<Globe size={13} aria-hidden="true" />
					Public
				</button>
				<button
					type="button"
					class="flex items-center gap-1.5 border-border border-l px-3 py-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:-outline-offset-2 {type ===
					'company'
						? 'bg-accent-500 text-text-inverse'
						: 'bg-surface-raised text-text-secondary hover:bg-surface-overlay'}"
					aria-pressed={type === 'company'}
					onclick={() => {
						type = 'company';
						emitUpdate();
					}}
				>
					<Building2 size={13} aria-hidden="true" />
					Company
				</button>
			</div>
		</div>

		<!-- Delete -->
		{#if onDelete}
			<div class="shrink-0 space-y-1">
				<span class="block text-xs font-medium text-transparent select-none">Action</span>
				<button
					type="button"
					class="rounded-md p-2 text-error-500 transition-colors duration-150 hover:bg-error-50 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
					aria-label="Delete holiday"
					onclick={() => (confirmingDelete = true)}
				>
					<Trash2 size={16} aria-hidden="true" />
				</button>
			</div>
		{/if}
	</div>

	{#if confirmingDelete}
		<div class="border-border flex items-center gap-2 border-t pt-3" role="group" aria-label="Confirm deletion">
			<p class="text-sm text-text-secondary">Delete this holiday?</p>
			<button
				type="button"
				class="rounded-md bg-error-500 px-3 py-1.5 text-sm text-text-inverse transition-colors duration-150 hover:bg-error-700 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
				onclick={() => onDelete?.()}
			>
				Yes, delete
			</button>
			<button
				type="button"
				class="border-border text-text-primary rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
				onclick={() => (confirmingDelete = false)}
			>
				Cancel
			</button>
		</div>
	{/if}
</div>
