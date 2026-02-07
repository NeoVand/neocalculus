<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		solution?: Snippet;
		number?: number;
	}

	let { children, solution, number }: Props = $props();
	let showSolution = $state(false);
</script>

<div class="exercise">
	{#if number}<div class="exercise-header">Exercise {number}</div>{/if}
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
