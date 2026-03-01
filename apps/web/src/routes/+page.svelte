<script lang="ts">
	import { goto } from '$app/navigation';
	import { planStore, hasPlans } from '$lib/stores/planStore';
	import PolicyBuilder from '$lib/components/forms/PolicyBuilder.svelte';
	import { Calendar, Sparkles, ArrowRight, ListChecks } from 'lucide-svelte';

	function goToResults() {
		goto('/results');
	}

</script>

<svelte:head>
	<title>Leave Optimization Planner</title>
	<meta name="description" content="Configure your leave policy and optimize your time off" />
</svelte:head>

<main class="bg-surface min-h-screen">
	<!-- Hero section -->
	<header class="bg-primary-600 px-4 py-12 text-center text-text-inverse">
		<h1 class="text-4xl font-bold tracking-tight">Leave Optimization Planner</h1>
		<p class="mt-3 text-lg text-primary-100">
			Maximize your time off with smart planning around holidays
		</p>

		<div class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="flex flex-col items-center gap-2 rounded-lg bg-primary-700/50 p-4">
				<ListChecks class="h-6 w-6" aria-hidden="true" />
				<span class="text-sm font-medium">Configure Policies</span>
				<span class="text-xs text-primary-200">Define your leave types and rules</span>
			</div>
			<div class="flex flex-col items-center gap-2 rounded-lg bg-primary-700/50 p-4">
				<Calendar class="h-6 w-6" aria-hidden="true" />
				<span class="text-sm font-medium">Add Holidays</span>
				<span class="text-xs text-primary-200">Import your holiday calendar</span>
			</div>
			<div class="flex flex-col items-center gap-2 rounded-lg bg-primary-700/50 p-4">
				<Sparkles class="h-6 w-6" aria-hidden="true" />
				<span class="text-sm font-medium">Get Optimized Plans</span>
				<span class="text-xs text-primary-200">Ranked suggestions to maximize time off</span>
			</div>
		</div>
	</header>

	<div class="container mx-auto max-w-5xl px-4 py-8">
		<!-- Results notification banner (shown if plans exist) -->
		{#if $hasPlans}
			<div
				class="animate-slide-up border-accent bg-accent-50 mb-6 rounded-lg border p-4 shadow-sm"
				role="status"
			>
				<div class="flex items-center justify-between gap-4">
					<div>
						<h2 class="text-text-primary font-semibold">You have optimization results!</h2>
						<p class="text-text-secondary text-sm">
							{$planStore.plans.length} plan{$planStore.plans.length !== 1 ? 's' : ''} generated
						</p>
					</div>
					<button
						class="bg-accent-500 hover:bg-accent-600 focus-visible:outline-accent-500 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-text-inverse transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
						onclick={goToResults}
					>
						View Results
						<ArrowRight class="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
			</div>
		{/if}

		<!-- Main PolicyBuilder component -->
		<section aria-label="Leave policy configuration">
			<PolicyBuilder />
		</section>
	</div>

	<!-- Footer -->
	<footer class="border-border border-t px-4 py-6 text-center">
		<p class="text-text-tertiary text-sm">
			Configure your leave types, add your holiday calendar, set your preferences, then hit
			Optimize.
		</p>
	</footer>
</main>
