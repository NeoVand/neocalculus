<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		solution?: Snippet;
		number?: number;
	}

	let { children, solution, number }: Props = $props();
	let showSolution = $state(false);
	let isExtension = $derived(number !== undefined && number > 10);
</script>

<div class="exercise" class:exercise-extension={isExtension}>
	{#if number}
		<div class="exercise-header">
			Exercise {number}{#if isExtension}
				(Extension){/if}
		</div>
	{/if}
	<div class="exercise-prompt">
		{@render children()}
	</div>
	{#if solution}
		<button class="exercise-toggle" onclick={() => (showSolution = !showSolution)}>
			{showSolution ? '▾ Hide solution' : '▸ Show solution'}
		</button>
		{#if showSolution}
			<div class="exercise-solution">
				{@render solution()}
			</div>
		{/if}
	{/if}
</div>
