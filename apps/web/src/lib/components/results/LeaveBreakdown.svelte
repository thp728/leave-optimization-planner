<script lang="ts">
	import type { LeavePlan } from '$lib/mocks/types';
	import { policyStore } from '$lib/stores/policyStore';
	import { computeByLeaveType, computeByMonth } from '$lib/utils/leaveBreakdown';

	interface Props {
		plan: LeavePlan;
	}

	let { plan }: Props = $props();

	const leaveTypeMap = $derived(new Map($policyStore.map((lt) => [lt.id, lt])));
	const byLeaveType = $derived(computeByLeaveType(plan.dailyAssignments, leaveTypeMap));
	const byMonth = $derived(computeByMonth(plan.dailyAssignments));
	const maxMonthCount = $derived(Math.max(...byMonth.map((m) => m.count), 1));

	const freeDays = $derived(plan.totalDaysOff - plan.paidLeaveDays);
	const efficiency = $derived(
		plan.paidLeaveDays > 0 ? (plan.totalDaysOff / plan.paidLeaveDays).toFixed(1) : '∞'
	);
</script>

<div class="space-y-6">
	<h3 class="text-lg font-semibold text-text-primary">Leave Breakdown</h3>

	<!-- Summary Stats -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		<div class="rounded-xl border border-border bg-surface-raised p-4 text-center">
			<div class="text-2xl font-bold text-text-primary">{plan.totalDaysOff}</div>
			<div class="mt-1 text-xs text-text-secondary">Total Days Off</div>
		</div>
		<div class="rounded-xl border border-border bg-surface-raised p-4 text-center">
			<div class="text-2xl font-bold text-text-primary">{plan.paidLeaveDays}</div>
			<div class="mt-1 text-xs text-text-secondary">Paid Leave Days</div>
		</div>
		<div class="rounded-xl border border-border bg-surface-raised p-4 text-center">
			<div class="text-2xl font-bold text-text-primary">{freeDays}</div>
			<div class="mt-1 text-xs text-text-secondary">Free Days (no leave)</div>
		</div>
		<div class="rounded-xl border border-border bg-surface-raised p-4 text-center">
			<div class="text-2xl font-bold text-text-primary">{efficiency}×</div>
			<div class="mt-1 text-xs text-text-secondary">Days Off per Paid Day</div>
		</div>
	</div>

	<!-- By Leave Type -->
	{#if byLeaveType.length > 0}
		<section aria-labelledby="breakdown-by-type">
			<h4 id="breakdown-by-type" class="mb-3 text-sm font-semibold text-text-primary">
				By Leave Type
			</h4>
			<div class="overflow-hidden rounded-xl border border-border bg-surface-raised">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border bg-surface-overlay">
							<th
								scope="col"
								class="py-2.5 pl-4 pr-2 text-left text-xs font-medium text-text-secondary"
							>
								Leave Type
							</th>
							<th
								scope="col"
								class="px-2 py-2.5 text-right text-xs font-medium text-text-secondary"
							>
								Days
							</th>
							<th
								scope="col"
								class="py-2.5 pl-2 pr-4 text-right text-xs font-medium text-text-secondary"
							>
								% of Total
							</th>
						</tr>
					</thead>
					<tbody>
						{#each byLeaveType as item, i}
							{@const pct =
								plan.totalDaysOff > 0 ? (item.days / plan.totalDaysOff) * 100 : 0}
							<tr
								class="border-b border-border/50 last:border-0"
								class:bg-surface-overlay={i % 2 === 1}
							>
								<td class="py-3 pl-4 pr-2 text-sm">
									<div class="flex items-center gap-2">
										<span class="font-medium text-text-primary">{item.name}</span>
										{#if !item.isPaid}
											<span
												class="rounded bg-surface-overlay px-1.5 py-0.5 text-xs text-text-secondary"
											>
												unpaid
											</span>
										{/if}
									</div>
								</td>
								<td class="px-2 py-3 text-right text-sm font-semibold text-text-primary">
									{item.days}
								</td>
								<td class="py-3 pl-2 pr-4 text-right text-sm">
									<div class="flex items-center justify-end gap-2">
										<span class="text-text-secondary">{pct.toFixed(0)}%</span>
										<div
											class="h-1.5 w-20 overflow-hidden rounded-full bg-surface-overlay"
											role="presentation"
										>
											<div
												class="h-full rounded-full bg-accent-500"
												style="width: {Math.min(pct, 100).toFixed(0)}%"
											></div>
										</div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{:else}
		<p class="text-center text-sm text-text-secondary">No leave days in this plan.</p>
	{/if}

	<!-- Monthly Distribution -->
	{#if byMonth.length > 0}
		<section aria-labelledby="breakdown-by-month">
			<h4 id="breakdown-by-month" class="mb-3 text-sm font-semibold text-text-primary">
				Monthly Distribution
			</h4>
			<div class="space-y-2 rounded-xl border border-border bg-surface-raised p-4">
				{#each byMonth as { label, count }}
					<div class="flex items-center gap-3">
						<span class="w-8 shrink-0 text-xs font-medium text-text-secondary">{label}</span>
						<div
							class="h-2 flex-1 overflow-hidden rounded-full bg-surface-overlay"
							role="presentation"
						>
							<div
								class="h-full rounded-full bg-primary-400"
								style="width: {((count / maxMonthCount) * 100).toFixed(0)}%"
							></div>
						</div>
						<span class="w-8 text-right text-xs text-text-secondary">{count}d</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
