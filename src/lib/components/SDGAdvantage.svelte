<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
	}

	let { children, title = 'The SDG Advantage' }: Props = $props();
</script>

<aside class="sdg-advantage">
	<div class="sdg-advantage-header">
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<path d="M9 1l2.47 5.01L17 6.64l-4 3.9.94 5.5L9 13.5l-4.94 2.54.94-5.5-4-3.9 5.53-.63L9 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
		</svg>
		{title}
	</div>
	<div class="sdg-advantage-content">
		{@render children()}
	</div>
</aside>

<style>
	.sdg-advantage {
		border: 1px solid var(--color-d);
		border-radius: 0.75rem;
		padding: 1.25rem var(--space-md);
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
		position: relative;
		overflow: hidden;
	}

	.sdg-advantage::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--color-d), #6366f1);
	}

	.sdg-advantage-header {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-d);
		margin-bottom: 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sdg-advantage-header svg {
		color: var(--color-d);
		flex-shrink: 0;
	}

	.sdg-advantage-content {
		font-size: 1.02rem;
		line-height: 1.7;
	}

	.sdg-advantage-content :global(p) {
		margin-bottom: 0.5rem;
	}

	.sdg-advantage-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.sdg-advantage-content :global(strong) {
		color: var(--color-d);
	}
</style>
