<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		assumptions?: string[];
		appliesTo?: string[];
		doesNotClaim?: string[];
		children?: Snippet;
	}

	let {
		title = 'Assumptions In Force',
		assumptions = [],
		appliesTo = [],
		doesNotClaim = [],
		children
	}: Props = $props();
</script>

<aside class="model-scope-box">
	<div class="model-scope-title">{title}</div>

	{#if assumptions.length > 0}
		<div class="scope-group">
			<h4>Assumptions</h4>
			<ul>
				{#each assumptions as item, i (item + i)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if appliesTo.length > 0}
		<div class="scope-group">
			<h4>Applies To</h4>
			<ul>
				{#each appliesTo as item, i (item + i)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if doesNotClaim.length > 0}
		<div class="scope-group">
			<h4>Does Not Claim</h4>
			<ul>
				{#each doesNotClaim as item, i (item + i)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if children}
		<div class="scope-extra">
			{@render children()}
		</div>
	{/if}
</aside>

<style>
	.model-scope-box {
		border: 1px solid #d8c5f6;
		border-radius: 0.75rem;
		padding: 1rem;
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
	}

	.model-scope-title {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-d);
		margin-bottom: 0.65rem;
	}

	.scope-group + .scope-group {
		margin-top: 0.65rem;
	}

	.scope-group h4 {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		margin: 0 0 0.35rem;
	}

	.scope-group ul {
		margin: 0;
		padding-left: 1.2rem;
	}

	.scope-group li {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--color-ink-light);
	}

	.scope-extra {
		margin-top: 0.7rem;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--color-ink-light);
	}
</style>
