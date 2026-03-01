<script lang="ts">
	import type { LeavePlan } from '$lib/mocks/types';
	import { Trophy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-svelte';

	interface Props {
		plan: LeavePlan;
		isSelected?: boolean;
		onSelect?: () => void;
	}

	let { plan, isSelected = false, onSelect }: Props = $props();

	const efficiency = $derived(
		plan.paidLeaveDays > 0 ? (plan.totalDaysOff / plan.paidLeaveDays).toFixed(1) : '∞'
	);

	let showFullRationale = $state(false);
	const rationaleIsLong = $derived(plan.rationale.length > 120);
	const displayedRationale = $derived(
		rationaleIsLong && !showFullRationale ? plan.rationale.slice(0, 120) + '…' : plan.rationale
	);
</script>

<article
	class="rounded-xl border p-5 transition-colors"
	class:border-accent={isSelected}
	class:bg-accent-50={isSelected}
	class:border-border={!isSelected}
	class:bg-surface-raised={!isSelected}
	aria-label="Plan {plan.rank} summary"
>
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between gap-2">
		{#if plan.rank === 1}
			<span
				class="flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1 text-sm font-semibold text-white"
			>
				<Trophy size={14} aria-hidden="true" />
				#1 Best
			</span>
		{:else}
			<span
				class="rounded-full bg-surface-overlay px-3 py-1 text-sm font-medium text-text-secondary"
			>
				Rank #{plan.rank}
			</span>
		{/if}

		{#if isSelected}
			<span
				class="flex items-center gap-1 text-sm font-medium text-accent-600"
				aria-live="polite"
			>
				<CheckCircle size={16} aria-hidden="true" />
				Selected
			</span>
		{/if}
	</div>

	<!-- Metrics Grid -->
	<div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
		<div class="rounded-lg bg-surface p-3 text-center">
			<div class="text-2xl font-bold text-text-primary">{plan.totalDaysOff}</div>
			<div class="mt-0.5 text-xs text-text-secondary">Total Days Off</div>
		</div>
		<div class="rounded-lg bg-surface p-3 text-center">
			<div class="text-2xl font-bold text-text-primary">{plan.paidLeaveDays}</div>
			<div class="mt-0.5 text-xs text-text-secondary">Paid Leave Used</div>
		</div>
		<div class="rounded-lg bg-surface p-3 text-center">
			<div class="text-2xl font-bold text-text-primary">{plan.longestConsecutiveBreak}</div>
			<div class="mt-0.5 text-xs text-text-secondary">Longest Break (days)</div>
		</div>
		<div class="rounded-lg bg-surface p-3 text-center">
			<div class="text-2xl font-bold text-text-primary">{efficiency}×</div>
			<div class="mt-0.5 text-xs text-text-secondary">Days Off per Paid Day</div>
		</div>
	</div>

	<!-- Rationale -->
	<div class="mb-4">
		<p class="text-sm leading-relaxed text-text-secondary">{displayedRationale}</p>
		{#if rationaleIsLong}
			<button
				class="mt-1 flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700 focus:outline-none focus-visible:underline"
				onclick={() => (showFullRationale = !showFullRationale)}
				aria-expanded={showFullRationale}
			>
				{#if showFullRationale}
					<ChevronUp size={12} aria-hidden="true" />Show less
				{:else}
					<ChevronDown size={12} aria-hidden="true" />Show more
				{/if}
			</button>
		{/if}
	</div>

	<!-- Action Button -->
	{#if onSelect}
		<button
			class="w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
			class:bg-primary-500={!isSelected}
			class:text-white={!isSelected}
			class:hover:bg-primary-600={!isSelected}
			class:focus-visible:ring-primary-500={!isSelected}
			class:border={isSelected}
			class:border-accent={isSelected}
			class:text-accent-700={isSelected}
			class:hover:bg-accent-100={isSelected}
			class:focus-visible:ring-accent-500={isSelected}
			onclick={onSelect}
			aria-pressed={isSelected}
		>
			{isSelected ? 'Currently Viewing' : 'Select This Plan'}
		</button>
	{/if}
</article>
