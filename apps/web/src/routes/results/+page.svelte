<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		planStore,
		selectedPlan,
		sortedPlans,
		hasPlans,
		isLoading,
		hasError
	} from '$lib/stores/planStore';
	import PlanSummary from '$lib/components/results/PlanSummary.svelte';
	import PlanComparison from '$lib/components/results/PlanComparison.svelte';
	import LeaveBreakdown from '$lib/components/results/LeaveBreakdown.svelte';

	let activeView = $state('summary');

	function goBack() {
		goto('/');
	}

	function selectPlan(planId: string) {
		planStore.selectPlan(planId);
	}

	function handleRerun() {
		planStore.clear();
		goto('/');
	}
</script>

<svelte:head>
	<title>Optimization Results | Leave Planner</title>
	<meta name="description" content="View your optimized leave plans" />
</svelte:head>


<main class="bg-surface min-h-screen">
	<div class="container mx-auto py-8">
		<!-- Header -->
		<header class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-text-primary text-3xl font-bold">Your Optimized Leave Plans</h1>
				{#if $planStore.metadata}
					<p class="text-text-secondary mt-1 text-sm">
						Found {$planStore.metadata.totalSolutionsFound} solution{$planStore.metadata
							.totalSolutionsFound !== 1
							? 's'
							: ''}
						in {$planStore.metadata.executionTimeMs}ms
					</p>
				{/if}
			</div>
			<div class="flex gap-2">
				<button
					class="border-border bg-surface-raised text-text-primary rounded border px-4 py-2"
					onclick={goBack}
				>
					Back to Input
				</button>
				<button class="bg-primary-500 rounded px-4 py-2 text-white" onclick={handleRerun}>
					Re-run
				</button>
			</div>
		</header>

		<!-- Loading State -->
		{#if $isLoading}
			<div class="flex h-64 items-center justify-center">
				<div class="text-center">
					<div
						class="border-primary-500 mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
					></div>
					<p class="text-text-secondary">Optimizing your schedule...</p>
				</div>
			</div>
		{:else if $hasError}
			<!-- Error State -->
			<div class="border-error bg-error/10 rounded-lg border p-8 text-center">
				<h2 class="text-error text-xl font-semibold">Optimization Failed</h2>
				<p class="text-text-secondary mt-2">{$planStore.error}</p>
				<button class="bg-primary-500 mt-4 rounded px-4 py-2 text-white" onclick={goBack}>
					Try Again
				</button>
			</div>
		{:else if !$hasPlans}
			<!-- Empty State -->
			<div class="border-border bg-surface-raised rounded-lg border p-12 text-center">
				<h2 class="text-text-primary text-xl font-semibold">No Results Yet</h2>
				<p class="text-text-secondary mt-2">
					Configure your leave policy and run optimization to see results here.
				</p>
				<button class="bg-primary-500 mt-6 rounded px-6 py-2 text-white" onclick={goBack}>
					Get Started
				</button>
			</div>
		{:else}
			<!-- Results Content -->
			<div class="space-y-8">
				<!-- View Toggle -->
				<div class="border-border border-b">
					<nav class="flex gap-4">
						<button
							class="border-b-2 px-4 py-2"
							class:border-accent={activeView === 'summary'}
							class:border-transparent={activeView !== 'summary'}
							class:text-accent={activeView === 'summary'}
							onclick={() => (activeView = 'summary')}
						>
							Summary
						</button>
						<button
							class="border-b-2 px-4 py-2"
							class:border-accent={activeView === 'comparison'}
							class:border-transparent={activeView !== 'comparison'}
							class:text-accent={activeView === 'comparison'}
							onclick={() => (activeView = 'comparison')}
						>
							Compare All
						</button>
						<button
							class="border-b-2 px-4 py-2"
							class:border-accent={activeView === 'breakdown'}
							class:border-transparent={activeView !== 'breakdown'}
							class:text-accent={activeView === 'breakdown'}
							onclick={() => (activeView = 'breakdown')}
						>
							Breakdown
						</button>
					</nav>
				</div>

				<!-- View Content -->
				{#if activeView === 'summary'}
					<!-- Summary View - Show selected plan prominently, others smaller -->
					{#if $selectedPlan}
						<div class="border-accent bg-accent/5 rounded-lg border p-6">
							<h2 class="text-text-primary mb-4 text-xl font-semibold">Recommended Plan</h2>
							<PlanSummary plan={$selectedPlan} isSelected={true} />
						</div>
					{/if}

					{#if $sortedPlans.length > 1}
						<div class="mt-8">
							<h3 class="text-text-primary mb-4 text-lg font-semibold">Other Options</h3>
							<div class="grid gap-4 md:grid-cols-2">
								{#each $sortedPlans.filter((p) => p.id !== $selectedPlan?.id) as plan}
									<PlanSummary {plan} isSelected={false} onSelect={() => selectPlan(plan.id)} />
								{/each}
							</div>
						</div>
					{/if}
				{:else if activeView === 'comparison'}
					<!-- Comparison View -->
					<PlanComparison
						plans={$sortedPlans}
						selectedPlanId={$planStore.selectedPlanId}
						onSelectPlan={selectPlan}
					/>
				{:else if activeView === 'breakdown'}
					<!-- Breakdown View -->
					{#if $selectedPlan}
						<LeaveBreakdown plan={$selectedPlan} />
					{:else}
						<p class="text-text-secondary text-center">Select a plan to view breakdown</p>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</main>

