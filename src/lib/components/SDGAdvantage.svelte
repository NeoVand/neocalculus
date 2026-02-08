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
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
		{title}
	</div>
	<div class="sdg-advantage-content">
		{@render children()}
	</div>
</aside>

<style>
	.sdg-advantage {
		border: 1px solid #c4b5fd;
		border-radius: 0.75rem;
		padding: 1.25rem var(--space-md);
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
	}

	.sdg-advantage-header {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #a855f7;
		margin-bottom: 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.sdg-advantage-header svg {
		color: #a855f7;
		flex-shrink: 0;
		opacity: 0.8;
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
		color: #a855f7;
	}
</style>
