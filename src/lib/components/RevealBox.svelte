<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
		subtitle?: string;
		open?: boolean;
		tone?: 'neutral' | 'math' | 'warning';
	}

	let { children, title = 'Reveal', subtitle, open = false, tone = 'neutral' }: Props = $props();
</script>

<details class="reveal-box tone-{tone}" {open}>
	<summary>
		<div class="reveal-summary-text">
			<span class="reveal-title">{title}</span>
			{#if subtitle}
				<span class="reveal-subtitle">{subtitle}</span>
			{/if}
		</div>
	</summary>
	<div class="reveal-content">
		{@render children()}
	</div>
</details>

<style>
	.reveal-box {
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #fafaf9, #f6f4ef);
		overflow: hidden;
	}

	.reveal-box summary {
		list-style: none;
		cursor: pointer;
		padding: 0.9rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		user-select: none;
	}

	.reveal-box summary::-webkit-details-marker {
		display: none;
	}

	.reveal-box summary::before {
		content: '▸';
		font-size: 0.72rem;
		color: var(--color-ink-faint);
		transition: transform 0.2s ease;
	}

	.reveal-box[open] summary::before {
		transform: rotate(90deg);
	}

	.reveal-summary-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.reveal-title {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-light);
	}

	.reveal-subtitle {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
	}

	.reveal-content {
		padding: 0 1rem 1rem;
		color: var(--color-ink-light);
		font-size: 0.98rem;
		line-height: 1.7;
	}

	.tone-math {
		border-color: #d8c5f6;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
	}

	.tone-math .reveal-title {
		color: var(--color-d);
	}

	.tone-warning {
		border-color: #f5c7c7;
		background: linear-gradient(135deg, #fff7f7, #fff1f1);
	}

	.tone-warning .reveal-title {
		color: #b42318;
	}
</style>
