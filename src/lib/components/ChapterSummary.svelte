<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<aside class="chapter-summary">
	<div class="chapter-summary-header">
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/>
			<path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
		</svg>
		Key Ideas
	</div>
	<div class="chapter-summary-content">
		{@render children()}
	</div>
</aside>

<style>
	.chapter-summary {
		border: 2px solid var(--color-d);
		border-radius: 0.75rem;
		padding: 1.5rem var(--space-md);
		margin: var(--space-lg) 0;
		background: linear-gradient(135deg, var(--color-d-glow), var(--color-d-soft));
	}

	.chapter-summary-header {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-d);
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.chapter-summary-header svg {
		color: var(--color-d);
		flex-shrink: 0;
	}

	.chapter-summary-content {
		font-size: 1.05rem;
		line-height: 1.7;
	}

	.chapter-summary-content :global(ul) {
		list-style: none;
		padding-left: 0;
		margin: 0;
	}

	.chapter-summary-content :global(li) {
		padding: 0.35rem 0;
		padding-left: 1.2rem;
		position: relative;
	}

	.chapter-summary-content :global(li::before) {
		content: '▸';
		position: absolute;
		left: 0;
		color: var(--color-d);
		font-size: 0.8rem;
	}

	.chapter-summary-content :global(p) {
		margin-bottom: 0.5rem;
	}

	.chapter-summary-content :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
