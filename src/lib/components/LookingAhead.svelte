<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<aside class="looking-ahead">
	<div class="looking-ahead-header">
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<path d="M6 3l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Looking Ahead
	</div>
	<div class="looking-ahead-content">
		{@render children()}
	</div>
</aside>

<style>
	.looking-ahead {
		border: 1px solid var(--color-border);
		border-left: 3px solid var(--color-success);
		border-radius: 0 0.75rem 0.75rem 0;
		padding: 1.25rem var(--space-md);
		margin: var(--space-lg) 0;
		background: linear-gradient(135deg, #ecfdf5, #f0fdf5);
	}

	.looking-ahead-header {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-success);
		margin-bottom: 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.looking-ahead-header svg {
		color: var(--color-success);
		flex-shrink: 0;
	}

	.looking-ahead-content {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-ink-light);
		font-style: italic;
	}

	.looking-ahead-content :global(p) {
		margin-bottom: 0.4rem;
	}

	.looking-ahead-content :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
