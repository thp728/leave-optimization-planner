<script lang="ts">
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import {
		Plus,
		RotateCcw,
		Sparkles,
		Loader2,
		CheckCircle2,
		Circle,
		AlertCircle
	} from 'lucide-svelte';

	import LeaveTypeForm from './LeaveTypeForm.svelte';
	import HolidayForm from './HolidayForm.svelte';
	import PreferencesForm from './PreferencesForm.svelte';

	import {
		policyStore,
		isPolicyValid,
		totalLeaveDays,
		policiesByPriority
	} from '$lib/stores/policyStore';
	import { holidayStore, holidayCount, holidaysByDate } from '$lib/stores/holidayStore';
	import {
		preferencesStore,
		isPreferencesValid,
		horizonDurationDays
	} from '$lib/stores/preferencesStore';
	import { planStore, isLoading } from '$lib/stores/planStore';
	import type { OptimizeRequest } from '$lib/mocks/types';

	type Section = 'policies' | 'holidays' | 'preferences';

	const scenarios = ['A', 'B', 'C', 'D'] as const;
	type Scenario = (typeof scenarios)[number];

	const tabs: Array<{ id: Section; label: string }> = [
		{ id: 'policies', label: 'Leave Policies' },
		{ id: 'holidays', label: 'Holidays' },
		{ id: 'preferences', label: 'Preferences' }
	];

	let activeSection = $state<Section>('policies');
	let optimizeError = $state<string | null>(null);

	let isFormValid = $derived($isPolicyValid && $holidayCount > 0 && $isPreferencesValid);

	let missingItems = $derived([
		...(!$isPolicyValid ? ['At least one valid leave policy'] : []),
		...($holidayCount === 0 ? ['At least one holiday'] : []),
		...(!$isPreferencesValid ? ['Valid planning preferences'] : [])
	]);

	function addLeaveType() {
		policyStore.add();
	}

	function addHoliday() {
		const existing = new Set(get(holidayStore).map((h) => h.date));
		let d = new Date();
		let dateStr = d.toISOString().split('T')[0];
		while (existing.has(dateStr)) {
			d.setDate(d.getDate() + 1);
			dateStr = d.toISOString().split('T')[0];
		}
		holidayStore.add({ date: dateStr, name: '', type: 'public' });
	}

	async function loadScenario(scenario: Scenario) {
		const [policies, holidays] = await Promise.all([
			import('$lib/mocks/mockPolicies'),
			import('$lib/mocks/mockHolidays')
		]);

		const policiesMap = {
			A: policies.scenarioAPolicies,
			B: policies.scenarioBPolicies,
			C: policies.scenarioCPolicies,
			D: policies.scenarioDPolicies
		};
		const holidaysMap = {
			A: holidays.scenarioAHolidays,
			B: holidays.scenarioBHolidays,
			C: holidays.scenarioCHolidays,
			D: holidays.scenarioDHolidays
		};

		policyStore.loadPreset(policiesMap[scenario]);
		holidayStore.loadPreset(holidaysMap[scenario]);
	}

	async function handleOptimize() {
		optimizeError = null;
		const request: OptimizeRequest = {
			leaveTypes: get(policyStore),
			holidays: get(holidayStore),
			preferences: get(preferencesStore)
		};
		try {
			await planStore.optimize(request);
			goto('/results');
		} catch (err) {
			optimizeError = err instanceof Error ? err.message : 'Optimization failed';
		}
	}

	function handleReset() {
		policyStore.reset();
		holidayStore.clear();
		preferencesStore.reset();
		optimizeError = null;
	}
</script>

<div class="mx-auto max-w-4xl space-y-6 p-4">
	<header class="mb-8 text-center">
		<h1 class="text-text-primary text-3xl font-bold">Configure Your Leave Policy</h1>
		<p class="text-text-secondary mt-2">
			Set up your leave types, holidays, and preferences to generate optimized plans
		</p>
	</header>

	<nav aria-label="Configuration sections">
		<div role="tablist" class="border-border flex border-b">
			{#each tabs as tab}
				{@const isActive = activeSection === tab.id}
				{@const sectionValid =
					tab.id === 'policies'
						? $isPolicyValid
						: tab.id === 'holidays'
							? $holidayCount > 0
							: $isPreferencesValid}
				<button
					role="tab"
					id="tab-{tab.id}"
					aria-selected={isActive}
					aria-controls="tabpanel"
					class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 {isActive
						? 'border-primary-500 text-primary-600'
						: 'border-transparent text-text-secondary hover:border-border hover:text-text-primary'}"
					onclick={() => (activeSection = tab.id)}
				>
					{#if sectionValid}
						<CheckCircle2 size={16} class="text-accent-500" aria-hidden="true" />
					{:else}
						<Circle size={16} class="text-text-tertiary" aria-hidden="true" />
					{/if}
					{tab.label}
				</button>
			{/each}
		</div>
	</nav>

	<div
		id="tabpanel"
		role="tabpanel"
		aria-labelledby="tab-{activeSection}"
		class="border-border bg-surface min-h-100 rounded-lg border p-6"
	>
		{#if activeSection === 'policies'}
			<div class="space-y-4">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-text-primary text-lg font-semibold">Leave Policies</h2>
						<p class="text-text-secondary mt-1 text-sm">
							Define the leave types available to you and their allocation rules.
						</p>
					</div>
					<button
						type="button"
						class="bg-primary-500 text-text-inverse hover:bg-primary-600 flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={addLeaveType}
					>
						<Plus size={16} aria-hidden="true" />
						Add Leave Type
					</button>
				</div>

				{#if $policiesByPriority.length === 0}
					<div class="border-border rounded-lg border border-dashed p-8 text-center">
						<p class="text-text-secondary text-sm">No leave types added yet.</p>
						<p class="text-text-tertiary mt-1 text-xs">
							Click "Add Leave Type" above or load a scenario preset below.
						</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each $policiesByPriority as policy (policy.id)}
							<LeaveTypeForm
								leaveType={policy}
								onUpdate={(updated) => policyStore.updatePolicy(policy.id, updated)}
								onDelete={() => policyStore.remove(policy.id)}
							/>
						{/each}
					</div>
				{/if}
			</div>
		{:else if activeSection === 'holidays'}
			<div class="space-y-4">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-text-primary text-lg font-semibold">Holidays</h2>
						<p class="text-text-secondary mt-1 text-sm">
							Add public and company holidays for the planning period.
						</p>
					</div>
					<button
						type="button"
						class="bg-primary-500 text-text-inverse hover:bg-primary-600 flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={addHoliday}
					>
						<Plus size={16} aria-hidden="true" />
						Add Holiday
					</button>
				</div>

				<div class="flex items-center gap-2">
					<span class="text-text-secondary text-xs">Import template:</span>
					<button
						type="button"
						class="border-border text-text-primary rounded border px-2 py-1 text-xs transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={() => holidayStore.importFromTemplate('us')}
					>
						US 2026
					</button>
					<button
						type="button"
						class="border-border text-text-primary rounded border px-2 py-1 text-xs transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={() => holidayStore.importFromTemplate('uk')}
					>
						UK 2026
					</button>
				</div>

				{#if $holidaysByDate.length === 0}
					<div class="border-border rounded-lg border border-dashed p-8 text-center">
						<p class="text-text-secondary text-sm">No holidays added yet.</p>
						<p class="text-text-tertiary mt-1 text-xs">
							Add holidays manually or import a template above.
						</p>
					</div>
				{:else}
					<div class="space-y-2">
						{#each $holidaysByDate as holiday (holiday.date)}
							<HolidayForm
								{holiday}
								onUpdate={(updated) => holidayStore.updateHoliday(holiday.date, updated)}
								onDelete={() => holidayStore.remove(holiday.date)}
							/>
						{/each}
					</div>
				{/if}
			</div>
		{:else if activeSection === 'preferences'}
			<div class="space-y-4">
				<div>
					<h2 class="text-text-primary text-lg font-semibold">Preferences</h2>
					<p class="text-text-secondary mt-1 text-sm">
						Configure your planning horizon and break preferences.
					</p>
				</div>
				<PreferencesForm
					preferences={$preferencesStore}
					onUpdate={(updated) => preferencesStore.load(updated)}
				/>
			</div>
		{/if}
	</div>

	<div class="border-border bg-surface-raised rounded-lg border p-4">
		<h2 class="text-text-tertiary mb-3 text-xs font-semibold uppercase tracking-wide">Summary</h2>
		<dl class="grid grid-cols-3 gap-4 text-center">
			<div>
				<dt class="text-text-tertiary text-xs">Leave days</dt>
				<dd class="text-text-primary text-2xl font-bold">{$totalLeaveDays}</dd>
			</div>
			<div>
				<dt class="text-text-tertiary text-xs">Holidays</dt>
				<dd class="text-text-primary text-2xl font-bold">{$holidayCount}</dd>
			</div>
			<div>
				<dt class="text-text-tertiary text-xs">Planning horizon</dt>
				<dd class="text-text-primary text-2xl font-bold">{$horizonDurationDays}d</dd>
			</div>
		</dl>
	</div>

	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="text-text-secondary text-sm">Scenario:</span>
				{#each scenarios as scenario}
					<button
						type="button"
						class="border-border text-text-primary rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
						onclick={() => loadScenario(scenario)}
					>
						{scenario}
					</button>
				{/each}
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="border-border text-text-secondary flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors duration-150 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
					onclick={handleReset}
				>
					<RotateCcw size={15} aria-hidden="true" />
					Reset
				</button>
				<button
					type="button"
					disabled={!isFormValid || $isLoading}
					aria-disabled={!isFormValid || $isLoading}
					class="flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 {isFormValid &&
					!$isLoading
						? 'bg-primary-500 text-text-inverse hover:bg-primary-600'
						: 'bg-surface-overlay text-text-tertiary cursor-not-allowed'}"
					onclick={handleOptimize}
				>
					{#if $isLoading}
						<Loader2 size={16} class="animate-spin" aria-hidden="true" />
						Optimizing…
					{:else}
						<Sparkles size={16} aria-hidden="true" />
						Optimize
					{/if}
				</button>
			</div>
		</div>

		{#if !isFormValid}
			<div
				class="border-warning-100 bg-warning-50 flex items-start gap-2 rounded-md border p-3"
				role="status"
			>
				<AlertCircle size={16} class="text-warning-700 mt-0.5 shrink-0" aria-hidden="true" />
				<div class="text-warning-700 text-sm">
					<p class="font-medium">Before you can optimize:</p>
					<ul class="mt-1 list-inside list-disc space-y-0.5 text-xs">
						{#each missingItems as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}

		{#if optimizeError}
			<div
				class="border-error-100 bg-error-50 flex items-start gap-2 rounded-md border p-3"
				role="alert"
			>
				<AlertCircle size={16} class="text-error-700 mt-0.5 shrink-0" aria-hidden="true" />
				<p class="text-error-700 text-sm">{optimizeError}</p>
			</div>
		{/if}
	</div>
</div>
