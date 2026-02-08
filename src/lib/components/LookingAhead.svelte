<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<aside class="looking-ahead">
	<div class="looking-ahead-header">
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
		Looking Ahead
	</div>
	<div class="looking-ahead-content">
		{@render children()}
	</div>
</aside>

<style>
	.looking-ahead {
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		padding: 1.25rem var(--space-md);
		margin: var(--space-lg) 0;
		background: linear-gradient(135deg, #fafaf9, #f5f5f4);
	}

	.looking-ahead-header {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		margin-bottom: 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.looking-ahead-header svg {
		flex-shrink: 0;
		color: var(--color-ink-faint);
		opacity: 0.7;
	}

	.looking-ahead-content {
		font-size: 0.98rem;
		line-height: 1.65;
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
