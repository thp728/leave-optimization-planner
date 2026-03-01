<script lang="ts">
	import { AlertCircle } from 'lucide-svelte';
	import type { UserPreferences, BreakFrequency } from '$lib/mocks/types';

	interface Props {
		preferences: UserPreferences;
		onUpdate?: (updated: UserPreferences) => void;
	}

	let { preferences, onUpdate }: Props = $props();

	let startDate = $state('');
	let endDate = $state('');
	let minDays = $state(1);
	let maxDays = $state(15);
	let frequency = $state<BreakFrequency>('quarterly');

	let touched = $state({ startDate: false, endDate: false, minDays: false, maxDays: false });

	$effect(() => {
		startDate = preferences.planningHorizon.start;
		endDate = preferences.planningHorizon.end;
		minDays = preferences.minConsecutiveDaysOff;
		maxDays = preferences.maxConsecutiveDaysOff;
		frequency = preferences.preferredBreakFrequency;
	});

	let durationDays = $derived(
		startDate && endDate && new Date(endDate) > new Date(startDate)
			? Math.round(
					(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
				)
			: 0
	);

	let dateRangeError = $derived(
		!startDate || !endDate
			? 'Both dates are required'
			: new Date(startDate).getTime() >= new Date(endDate).getTime()
				? 'End date must be after start date'
				: (new Date(endDate).getTime() - new Date(startDate).getTime()) /
						  (1000 * 60 * 60 * 24) >
					  730
					? 'Planning horizon cannot exceed 2 years'
					: ''
	);

	let minDaysError = $derived(
		!Number.isInteger(minDays) || minDays < 1 ? 'Must be at least 1' : ''
	);

	let maxDaysError = $derived(
		!Number.isInteger(maxDays) || maxDays < 1
			? 'Must be at least 1'
			: maxDays < minDays
				? `Must be at least ${minDays} (min days)`
				: maxDays > 365
					? 'Cannot exceed 365 days'
					: ''
	);

	let isValid = $derived(dateRangeError === '' && minDaysError === '' && maxDaysError === '');

	function emitUpdate() {
		if (!isValid) return;
		onUpdate?.({
			planningHorizon: { start: startDate, end: endDate },
			minConsecutiveDaysOff: minDays,
			maxConsecutiveDaysOff: maxDays,
			preferredBreakFrequency: frequency
		});
	}

	function applyPreset(months: number) {
		const base = startDate || new Date().toISOString().split('T')[0];
		const end = new Date(base + 'T00:00:00');
		end.setMonth(end.getMonth() + months);
		endDate = end.toISOString().split('T')[0];
		touched.endDate = true;
		emitUpdate();
	}

	const frequencyOptions: Array<{ value: BreakFrequency; label: string }> = [
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'quarterly', label: 'Quarterly' },
		{ value: 'flexible', label: 'Flexible' }
	];

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

<div class="space-y-6">
	<section
		aria-labelledby="horizon-heading"
		class="border-border bg-surface-raised space-y-4 rounded-lg border p-4"
	>
		<div class="flex items-center justify-between">
			<h3 id="horizon-heading" class="text-text-primary text-sm font-semibold">
				Planning Horizon
			</h3>
			<div class="flex items-center gap-2">
				<span class="text-text-tertiary text-xs">Preset:</span>
				<button
					type="button"
					class="border-border text-text-primary rounded border px-2 py-1 text-xs transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
					onclick={() => applyPreset(6)}
				>
					6 Months
				</button>
				<button
					type="button"
					class="border-border text-text-primary rounded border px-2 py-1 text-xs transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
					onclick={() => applyPreset(12)}
				>
					1 Year
				</button>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-1">
				<label for="start-date" class="block text-sm font-medium text-text-primary">
					Start date
					<span aria-hidden="true" class="ml-0.5 text-error-500">*</span>
				</label>
				<input
					id="start-date"
					type="date"
					class={inputClasses(dateRangeError, touched.startDate && touched.endDate)}
					bind:value={startDate}
					onchange={() => {
						touched.startDate = true;
						emitUpdate();
					}}
					onblur={() => (touched.startDate = true)}
					required
					aria-required="true"
					aria-invalid={touched.startDate && touched.endDate && dateRangeError !== ''}
					aria-describedby={touched.startDate && touched.endDate && dateRangeError
						? 'date-range-error'
						: undefined}
				/>
			</div>

			<div class="space-y-1">
				<label for="end-date" class="block text-sm font-medium text-text-primary">
					End date
					<span aria-hidden="true" class="ml-0.5 text-error-500">*</span>
				</label>
				<input
					id="end-date"
					type="date"
					class={inputClasses(dateRangeError, touched.startDate && touched.endDate)}
					bind:value={endDate}
					onchange={() => {
						touched.endDate = true;
						emitUpdate();
					}}
					onblur={() => (touched.endDate = true)}
					required
					aria-required="true"
					aria-invalid={touched.startDate && touched.endDate && dateRangeError !== ''}
					aria-describedby={touched.startDate && touched.endDate && dateRangeError
						? 'date-range-error'
						: undefined}
				/>
			</div>
		</div>

		{#if touched.startDate && touched.endDate && dateRangeError}
			<p
				id="date-range-error"
				role="alert"
				class="flex items-center gap-1 text-xs text-error-700"
			>
				<AlertCircle size={12} aria-hidden="true" />
				{dateRangeError}
			</p>
		{:else if durationDays > 0}
			<p class="text-text-secondary text-sm">
				<span class="text-text-primary font-semibold">{durationDays}</span> days in planning horizon
			</p>
		{/if}
	</section>

	<section
		aria-labelledby="break-heading"
		class="border-border bg-surface-raised space-y-4 rounded-lg border p-4"
	>
		<h3 id="break-heading" class="text-text-primary text-sm font-semibold">Break Preferences</h3>

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-1">
				<label for="min-days" class="block text-sm font-medium text-text-primary">
					Min consecutive days off
				</label>
				<input
					id="min-days"
					type="number"
					class={inputClasses(minDaysError, touched.minDays)}
					bind:value={minDays}
					onchange={() => {
						touched.minDays = true;
						emitUpdate();
					}}
					onblur={() => (touched.minDays = true)}
					min="1"
					step="1"
					aria-invalid={touched.minDays && minDaysError !== ''}
					aria-describedby="min-days-hint{touched.minDays && minDaysError
						? ' min-days-error'
						: ''}"
				/>
				<p id="min-days-hint" class="text-xs text-text-tertiary">Shortest break to schedule</p>
				{#if touched.minDays && minDaysError}
					<p id="min-days-error" role="alert" class="flex items-center gap-1 text-xs text-error-700">
						<AlertCircle size={12} aria-hidden="true" />
						{minDaysError}
					</p>
				{/if}
			</div>

			<div class="space-y-1">
				<label for="max-days" class="block text-sm font-medium text-text-primary">
					Max consecutive days off
				</label>
				<input
					id="max-days"
					type="number"
					class={inputClasses(maxDaysError, touched.maxDays)}
					bind:value={maxDays}
					onchange={() => {
						touched.maxDays = true;
						emitUpdate();
					}}
					onblur={() => (touched.maxDays = true)}
					min={minDays}
					step="1"
					aria-invalid={touched.maxDays && maxDaysError !== ''}
					aria-describedby="max-days-hint{touched.maxDays && maxDaysError
						? ' max-days-error'
						: ''}"
				/>
				<p id="max-days-hint" class="text-xs text-text-tertiary">Longest single break</p>
				{#if touched.maxDays && maxDaysError}
					<p id="max-days-error" role="alert" class="flex items-center gap-1 text-xs text-error-700">
						<AlertCircle size={12} aria-hidden="true" />
						{maxDaysError}
					</p>
				{/if}
			</div>
		</div>

		<div class="space-y-2">
			<p id="frequency-label" class="text-sm font-medium text-text-primary">
				Preferred break frequency
			</p>
			<div
				class="border-border flex overflow-hidden rounded-md border shadow-xs"
				role="group"
				aria-labelledby="frequency-label"
			>
				{#each frequencyOptions as option, i}
					<button
						type="button"
						class="flex-1 px-4 py-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:-outline-offset-2 {frequency ===
						option.value
							? 'bg-primary-500 text-text-inverse'
							: 'bg-surface-raised text-text-secondary hover:bg-surface-overlay'} {i > 0
							? 'border-border border-l'
							: ''}"
						aria-pressed={frequency === option.value}
						onclick={() => {
							frequency = option.value;
							emitUpdate();
						}}
					>
						{option.label}
					</button>
				{/each}
			</div>
		</div>
	</section>
</div>
