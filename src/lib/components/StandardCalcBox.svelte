<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
	}

	let { children, title = 'In Standard Calculus…' }: Props = $props();
</script>

<aside class="standard-calc-box">
	<div class="standard-calc-header">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
			<path d="M5.5 8h5M8 5.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
		</svg>
		{title}
	</div>
	<div class="standard-calc-content">
		{@render children()}
	</div>
</aside>

<style>
	.standard-calc-box {
		border: 1px dashed var(--color-border);
		border-radius: 0.75rem;
		padding: 1.1rem 1.25rem;
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #fafaf9, #f5f5f4);
	}

	.standard-calc-header {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-ink-faint);
		letter-spacing: 0.02em;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.standard-calc-header svg {
		flex-shrink: 0;
		color: var(--color-ink-faint);
	}

	.standard-calc-content {
		font-size: 0.95rem;
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
