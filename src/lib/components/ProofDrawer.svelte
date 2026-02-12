<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[number]>;
		title?: string;
		stageCount?: number;
		initialStage?: number;
		open?: boolean;
	}

	let {
		children,
		title = 'Proof',
		stageCount = 1,
		initialStage = 1,
		open = false
	}: Props = $props();

	let stageOffset = $state(0);
	let clampedStageCount = $derived(Math.max(1, stageCount));
	let baseStage = $derived(Math.max(1, Math.min(initialStage, clampedStageCount)));
	let clampedStage = $derived(Math.max(1, Math.min(baseStage + stageOffset, clampedStageCount)));

	let canPrev = $derived(clampedStage > 1);
	let canNext = $derived(clampedStage < clampedStageCount);

	function prev() {
		if (clampedStage > 1) stageOffset -= 1;
	}

	function next() {
		if (clampedStage < clampedStageCount) stageOffset += 1;
	}
</script>

<details class="proof-drawer" {open}>
	<summary>
		<span class="proof-title">{title}</span>
	</summary>
	<div class="proof-body">
		{#if clampedStageCount > 1}
			<div class="proof-controls" role="group" aria-label="Proof step controls">
				<button class="proof-button" onclick={prev} disabled={!canPrev}>Previous</button>
				<span class="proof-progress">Step {clampedStage} of {clampedStageCount}</span>
				<button class="proof-button" onclick={next} disabled={!canNext}>Next</button>
			</div>
		{/if}
		<div class="proof-content">
			{@render children(clampedStage)}
		</div>
	</div>
</details>

<style>
	.proof-drawer {
		border: 1px solid #d8c5f6;
		border-radius: 0.75rem;
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
		overflow: hidden;
	}

	.proof-drawer summary {
		list-style: none;
		cursor: pointer;
		padding: 0.95rem 1rem;
		user-select: none;
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.proof-drawer summary::-webkit-details-marker {
		display: none;
	}

	.proof-drawer summary::before {
		content: '▸';
		font-size: 0.72rem;
		color: var(--color-d);
		transition: transform 0.2s ease;
	}

	.proof-drawer[open] summary::before {
		transform: rotate(90deg);
	}

	.proof-title {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-d);
	}

	.proof-body {
		padding: 0 1rem 1rem;
	}

	.proof-controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.8rem;
		flex-wrap: wrap;
	}

	.proof-button {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.35rem 0.65rem;
		border-radius: 0.45rem;
		border: 1px solid #d8c5f6;
		background: white;
		color: var(--color-d);
		cursor: pointer;
	}

	.proof-button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.proof-progress {
		font-family: var(--font-sans);
		font-size: 0.74rem;
		color: var(--color-ink-faint);
	}

	.proof-content {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-ink-light);
	}
</style>
