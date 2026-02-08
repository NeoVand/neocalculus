<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
	}

	let { children, title = 'In Standard Calculus...' }: Props = $props();
</script>

<aside class="standard-calc-box">
	<div class="standard-calc-header">
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 3-5 5-5-5"/><path d="m17 21-5-5-5 5"/><path d="M4 12h16"/></svg>
		{title}
	</div>
	<div class="standard-calc-content">
		{@render children()}
	</div>
</aside>

<style>
	.standard-calc-box {
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		padding: 1.25rem var(--space-md);
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #fafaf9, #f5f5f4);
	}

	.standard-calc-header {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--color-ink-faint);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-bottom: 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.standard-calc-header svg {
		flex-shrink: 0;
		color: var(--color-ink-faint);
		opacity: 0.7;
	}

	.standard-calc-content {
		font-size: 0.98rem;
		line-height: 1.65;
		color: var(--color-ink-light);
	}

	.standard-calc-content :global(p) {
		margin-bottom: 0.4rem;
	}

	.standard-calc-content :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
