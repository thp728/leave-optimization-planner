<script lang="ts">
	import type { LeavePlan } from '$lib/mocks/types';
	import { Trophy, Check } from 'lucide-svelte';

	interface Props {
		plans: LeavePlan[];
		selectedPlanId: string | null;
		onSelectPlan?: (planId: string) => void;
	}

	let { plans, selectedPlanId, onSelectPlan }: Props = $props();

	const sortedPlans = $derived([...plans].sort((a, b) => a.rank - b.rank));

	// Best values per metric
	const bestTotalDays = $derived(
		plans.length > 0 ? Math.max(...plans.map((p) => p.totalDaysOff)) : 0
	);
	const bestPaidLeave = $derived(
		plans.length > 0 ? Math.min(...plans.map((p) => p.paidLeaveDays)) : 0
	);
	const bestLongestBreak = $derived(
		plans.length > 0 ? Math.max(...plans.map((p) => p.longestConsecutiveBreak)) : 0
	);

	// Metric definitions — functions close over the best values above
	const metrics = $derived([
		{
			label: 'Total Days Off',
			hint: 'Higher is better',
			getValue: (p: LeavePlan) => `${p.totalDaysOff}`,
			isBest: (p: LeavePlan) => p.totalDaysOff === bestTotalDays
		},
		{
			label: 'Paid Leave Used',
			hint: 'Lower is better',
			getValue: (p: LeavePlan) => `${p.paidLeaveDays}`,
			isBest: (p: LeavePlan) => p.paidLeaveDays === bestPaidLeave
		},
		{
			label: 'Longest Break',
			hint: 'Higher is better',
			getValue: (p: LeavePlan) => `${p.longestConsecutiveBreak} days`,
			isBest: (p: LeavePlan) => p.longestConsecutiveBreak === bestLongestBreak
		},
		{
			label: 'Efficiency',
			hint: 'Days off per paid day',
			getValue: (p: LeavePlan) =>
				p.paidLeaveDays > 0 ? `${(p.totalDaysOff / p.paidLeaveDays).toFixed(1)}×` : '∞',
			isBest: (p: LeavePlan) => p.paidLeaveDays === bestPaidLeave
		}
	]);

	function handleSelect(planId: string) {
		onSelectPlan?.(planId);
	}
</script>

<div class="space-y-4">
	<h2 class="text-xl font-bold text-text-primary">Compare Plans</h2>

	{#if plans.length === 0}
		<div class="rounded-xl border border-border bg-surface-raised p-8 text-center">
			<p class="text-text-secondary">No plans to compare.</p>
		</div>
	{:else}
		<div class="overflow-x-auto rounded-xl border border-border bg-surface-raised">
			<table class="w-full min-w-96">
				<thead>
					<tr class="border-b border-border bg-surface-overlay">
						<!-- Metric label column header -->
						<th
							scope="col"
							class="sticky left-0 z-10 bg-surface-overlay py-3 pl-4 pr-6 text-left text-xs font-medium text-text-secondary"
						>
							Metric
						</th>
						<!-- One column per plan -->
						{#each sortedPlans as plan}
							<th
								scope="col"
								class="min-w-36 px-4 py-3 text-center transition-colors"
								class:bg-accent-50={plan.id === selectedPlanId}
							>
								<div class="flex flex-col items-center gap-1.5">
									{#if plan.rank === 1}
										<span class="flex items-center gap-1 text-xs font-semibold text-accent-600">
											<Trophy size={12} aria-hidden="true" />
											Best
										</span>
									{/if}
									<span class="text-sm font-semibold text-text-primary">Plan #{plan.rank}</span>
									<button
										class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2"
										class:bg-accent-500={plan.id === selectedPlanId}
										class:text-white={plan.id === selectedPlanId}
										class:bg-surface={plan.id !== selectedPlanId}
										class:text-text-secondary={plan.id !== selectedPlanId}
										class:hover:bg-accent-100={plan.id !== selectedPlanId}
										class:hover:text-accent-700={plan.id !== selectedPlanId}
										onclick={() => handleSelect(plan.id)}
										aria-pressed={plan.id === selectedPlanId}
									>
										{plan.id === selectedPlanId ? 'Viewing' : 'Select'}
									</button>
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each metrics as metric, i}
						<tr class="border-b border-border/50 last:border-0">
							<!-- Metric label cell (sticky) -->
							<td
								class="sticky left-0 z-10 py-3 pl-4 pr-6 text-sm"
								class:bg-surface-overlay={i % 2 === 1}
								class:bg-surface-raised={i % 2 === 0}
							>
								<div class="font-medium text-text-primary">{metric.label}</div>
								<div class="text-xs text-text-secondary">{metric.hint}</div>
							</td>
							<!-- Value cells per plan -->
							{#each sortedPlans as plan}
								<td
									class="px-4 py-3 text-center text-sm transition-colors"
									class:bg-accent-50={plan.id === selectedPlanId}
									class:bg-surface-overlay={i % 2 === 1 && plan.id !== selectedPlanId}
								>
									{#if metric.isBest(plan)}
										<span
											class="inline-flex items-center gap-1 rounded-md bg-success-50 px-2 py-0.5 font-semibold text-success-700"
										>
											<Check size={12} aria-hidden="true" />
											{metric.getValue(plan)}
										</span>
									{:else}
										<span class="text-text-primary">{metric.getValue(plan)}</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if plans.length === 1}
			<p class="text-center text-xs text-text-secondary">
				Only one plan was generated. Adjust your preferences to explore more options.
			</p>
		{/if}
	{/if}
</div>
