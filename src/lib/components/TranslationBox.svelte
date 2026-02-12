<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		left: Snippet;
		right: Snippet;
		leftTitle?: string;
		rightTitle?: string;
		title?: string;
	}

	let {
		left,
		right,
		leftTitle = 'Neocalculus',
		rightTitle = 'Classical Translation',
		title = 'Translation'
	}: Props = $props();
</script>

<aside class="translation-box" aria-label={title}>
	<div class="translation-header">{title}</div>
	<div class="translation-grid">
		<section class="translation-pane">
			<h4>{leftTitle}</h4>
			<div class="translation-content">
				{@render left()}
			</div>
		</section>
		<section class="translation-pane">
			<h4>{rightTitle}</h4>
			<div class="translation-content">
				{@render right()}
			</div>
		</section>
	</div>
</aside>

<style>
	.translation-box {
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		padding: 1rem;
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #fafaf9, #f5f5f4);
	}

	.translation-header {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		margin-bottom: 0.7rem;
	}

	.translation-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.translation-pane {
		border: 1px solid var(--color-border-light);
		border-radius: 0.6rem;
		background: white;
		padding: 0.8rem;
	}

	.translation-pane h4 {
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-d);
		margin: 0 0 0.45rem;
	}

	.translation-content {
		font-size: 0.96rem;
		line-height: 1.65;
		color: var(--color-ink-light);
	}

	@media (max-width: 800px) {
		.translation-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
